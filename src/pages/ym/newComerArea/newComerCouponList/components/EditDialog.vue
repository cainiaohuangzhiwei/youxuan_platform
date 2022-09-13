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
							<el-button @click="handleAdd" size="small" type="text"
								>添加优惠券</el-button
							>
							<div>
								<span>{{ selectCoupon.couponName }}</span>
							</div>
						</div>
					</div>
				</template>
				<template slot="useTime">
					<el-date-picker
						v-model="formData.useTime"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					>
					</el-date-picker>
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
import { shopkeeperCouponSave } from '@/api/newComerArea'
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
				useTime: null,
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
					type: 'custom',
					title: '展示时间',
					dataIndex: 'useTime',
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
						validator: (rule, value, callback) => {
							if (!this.formData.useTime || !this.formData.useTime.length) {
								callback(new Error('请选择领取时间'))
							}
							callback()
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
				canReceiveStartTime: moment(this.formData.useTime[0]).valueOf(),
				canReceiveEndTime: moment(this.formData.useTime[1]).valueOf(),
				yxCouponId: this.selectCoupon.yxCouponId,
				couponName: this.selectCoupon.couponName,
			}

			this.loading = true
			if (this.row.id) {
				paramsData.id = this.row.id
			}
			const res = await shopkeeperCouponSave(paramsData)
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
			this.selectCoupon = {}
			this.formData.useTime = null

			if (this.row.id) {
				this.selectCoupon = {
					yxCouponId: this.row.yxCouponId,
					couponName: this.row.yxCouponName,
				}
				this.formData.useTime = [
					moment(this.row.canReceiveStartTime),
					moment(this.row.canReceiveEndTime),
				]
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
