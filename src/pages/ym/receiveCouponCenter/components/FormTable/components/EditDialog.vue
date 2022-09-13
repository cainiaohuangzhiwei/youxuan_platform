<template>
	<div>
		<el-dialog
			width="60%"
			:title="`${title}`"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="100px"
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
								<span v-for="(item, index) in selectCouponList" :key="index"
									>{{ item.couponName
									}}{{ selectCouponList.length - 1 != index ? '、' : '' }}</span
								>
							</div>
						</div>
					</div>
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
import { addCoupon, updateCoupon } from '@/api/receiveCouponCenter'
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
			selectCouponList: [],
			couponRow: [],
			formData: {
				couponName: '',
				topFlag: '',
				showTime: '',
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
					dataIndex: 'showTime',
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					type: 'radioMap',
					dataIndex: 'topFlag',
					disabled: false,
					title: '是否置顶',
					options: {
						否: 0,
						是: 1,
					},
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
							if (this.selectCouponList && !this.selectCouponList.length) {
								callback(new Error('请选择优惠券'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				showTime: [
					{ required: true, message: '请选择展示时间!', trigger: 'blur' },
				],
				topFlag: [
					{ required: true, message: '请选择是否置顶!', trigger: 'blur' },
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
			this.couponRow = JSON.parse(JSON.stringify(this.selectCouponList))
			this.formsDialog = true
		},
		//保存
		async _updateCoupon() {
			let paramsData = {
				startTime: moment(this.formData.showTime[0]).valueOf(),
				endTime: moment(this.formData.showTime[1]).valueOf(),
				topFlag: this.formData.topFlag,
			}

			this.loading = true
			let res = ''
			if (this.row.couponName) {
				paramsData.couponCenterId = this.row.couponCenterId
				res = await updateCoupon(paramsData)
			} else {
				paramsData.couponIds = this.selectCouponList.map((item) => {
					return item.yxCouponId
				})
				res = await addCoupon(paramsData)
			}
			let resultCode = res.data.resultCode
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
			this.selectCouponList = JSON.parse(JSON.stringify(val))
		},

		resetForm() {
			this.localVisible = false
		},

		open() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.loading = false
			this.formData.showTime = ''
			this.formData.topFlag = ''
			this.selectCouponList = []
			if (this.row.couponCenterId) {
				this.selectCouponList = [
					{
						yxCouponId: this.row.couponCenterId,
						couponName: this.row.couponName,
					},
				]
				this.formData.showTime = [this.row.startTime, this.row.endTime]
				this.formData.topFlag = this.row.topFlag ? this.row.topFlag : 0
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
