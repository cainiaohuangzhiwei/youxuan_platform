<template>
	<div>
		<el-dialog
			width="600px"
			:title="`${title}`"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="140px"
				:items="item"
				:rules="funRules"
				:data="formData"
				:formAction="formAction"
			>
				<template slot="couponName">
					<div>
						<div>
							<el-button
								@click="handleAdd"
								size="small"
								type="text"
								v-if="dialogState"
								>添加优惠券</el-button
							>
							<div>
								<span>{{ selectCoupon.couponName }}</span>
							</div>
						</div>
					</div>
				</template>
				<template slot="useNum" slot-scope="scope">
					<el-input v-model.number="scope.row.useNum"></el-input>
				</template>
				<template slot="realUseNum" slot-scope="scope">
					<el-input v-model.number="scope.row.realUseNum"></el-input>
				</template>
			</yx-form>
			<coupon-dialog
				:itemInfo="couponRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</el-dialog>
	</div>
</template>

<script>
import { saveActFishCouponList } from '@/api/actFish'
import YxForm from '@wg-vue-materials/yx-form'
import CouponDialog from '../components/CouponDialog'
import moment from 'moment'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		dialogState: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
		CouponDialog,
	},

	data() {
		return {
			selectCoupon: {},
			couponRow: [],
			formData: {
				couponName: '',
				useTime: '',
				useNum: '',
				realUseNum: '',
			},
			couponIds: [],
			fileToUpload: '',
			item: [
				{
					type: 'custom',
					dataIndex: 'couponName',
					title: '优惠券',
					disabled: true,
				},
				{
					type: 'time',
					title: '可领取时间',
					dataIndex: 'useTime',
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					title: '兑换珍珠数量',
					dataIndex: 'useNum',
					placeholder: '请输入珍珠数量',
				},
				{
					title: '实际兑换珍珠数量',
					dataIndex: 'realUseNum',
					placeholder: '请输入珍珠数量',
				},
			],
			loading: false,
			formsDialog: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._updateCoupon()
					},
				},
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.localVisible = false
					},
				},
			],
			funRules: {
				couponName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.selectCoupon && !this.selectCoupon.yxCouponId) {
								callback(new Error('请选择优惠券'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				useTime: [
					{
						required: true,
						message: '请选择领取时间!',
						trigger: 'blur',
					},
				],
				useNum: [
					{
						required: true,
						message: '请输入珍珠数量',
						trigger: 'blur',
					},
					{
						validator: (rule, value, callback) => {
							if (!/\d+/.test(value)) {
								callback(new Error('请填写数量'))
							} else if (
								parseInt(value, 10) < 0 ||
								parseInt(value, 10) === value
							) {
								callback(new Error('请填写正整数'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				realUseNum: [
					{
						required: true,
						message: '请输入实际珍珠数量',
						trigger: 'blur',
					},
					{
						validator: (rule, value, callback) => {
							if (!/\d+/.test(value)) {
								callback(new Error('请填写数量'))
							} else if (
								parseInt(value, 10) < 0 ||
								parseInt(value, 10) === value
							) {
								callback(new Error('请填写正整数'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	methods: {
		handleAdd() {
			this.couponRow = JSON.parse(JSON.stringify(this.selectCoupon))
			this.formsDialog = true
		},
		//保存
		async _updateCoupon() {
			let paramsData = {
				startTime: moment(this.formData.useTime[0]).valueOf(),
				endTime: moment(this.formData.useTime[1]).valueOf(),
				yxCouponId: this.selectCoupon.yxCouponId,
				couponName: this.selectCoupon.couponName,
				useNum: this.formData.useNum,
				realUseNum: this.formData.realUseNum,
			}

			this.loading = true
			if (this.row.actFishCouponId) {
				paramsData.actFishCouponId = this.row.actFishCouponId
			}
			const res = await saveActFishCouponList(paramsData)
			const resultCode = res.data.resultCode
			if (resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('initTable')
			}
			this.loading = false
		},

		fatherMethodInit(val) {
			this.selectCoupon = JSON.parse(JSON.stringify(val))
		},

		resetForm() {
			this.localVisible = false
			this.formData = {}
			this.$refs.form.$refs.YxForm.resetFields()
		},

		async open() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.loading = false
			this.formData.useTime = ''
			this.formData.realUseNum = ''
			this.selectCoupon = {}

			if (this.row.actFishCouponId) {
				this.selectCoupon = {
					yxCouponId: this.row.yxCouponId,
					couponName: this.row.couponName,
				}
				this.formData.useTime = [this.row.startTime, this.row.endTime]
				this.formData.useNum = this.row.useNum
				this.formData.realUseNum = this.row.realUseNum
			}
		},

		handleVerify(e) {
			console.log('e', e)
		},
	},
}
</script>

<style lang="scss" scoped></style>
