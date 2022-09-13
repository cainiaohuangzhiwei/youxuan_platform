<template>
	<div>
		<el-dialog
			width="800px"
			title="修改优惠券发放数量"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				labelWidth="80px"
				:formAction="formAction"
			>
				<template #couponName>
					<div>{{ formData.couponName }}</div>
				</template>
				<template #modifyType>
					<div>
						<el-radio v-model="formData.modifyType" label="1"
							><span>增加</span
							><el-input
								style="width: 80px; margin-left: 10px; margin-right: 10px"
								v-model="formData.rate1"
							></el-input
							>张</el-radio
						>
						<el-radio v-model="formData.modifyType" label="2"
							><span>减少</span
							><el-input
								style="width: 80px; margin-left: 10px; margin-right: 10px"
								v-model="formData.rate2"
							></el-input
							>张</el-radio
						>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { updateGrantQuantity } from '@/api/coupon'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		modifyAmountRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			input: '',
			item: [
				{
					title: '优惠券',
					type: 'custom',
					dataIndex: 'couponName',
				},
				{
					title: '发放数量',
					type: 'custom',
					dataIndex: 'modifyType',
				},
			],
			formData: {
				couponName: '',
				modifyType: '1',
				rate1: '',
				rate2: '',
			},
			formRules: {
				modifyType: [
					{
						validator: (rule, value, callback) => {
							const pattern = /^[1-9]\d*$/
							if (!this.formData.rate1 && !this.formData.rate2) {
								callback(new Error('请填写发放数量'))
							}
							if (value == 1) {
								if (!this.formData.rate1) {
									callback(new Error('请填写发放数量'))
								} else {
									if (!pattern.test(this.formData.rate1)) {
										callback(new Error('请输入正确的格式'))
									}
								}
							}
							if (value == 2) {
								if (!this.formData.rate2) {
									callback(new Error('请填写发放数量'))
								} else {
									if (!pattern.test(this.formData.rate2)) {
										callback(new Error('请输入正确的格式'))
									}
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.formData.rate1 = ''
			this.formData.rate2 = ''
			this.formData.modifyType = '1'
			if (val) {
				this.formData.couponName = this.modifyAmountRow.couponName
			}
		},
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
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		async submitForm() {
			let params = {
				yxCouponId: this.modifyAmountRow.yxCouponId,
				modifyType: this.formData.modifyType,
			}
			if (this.formData.modifyType == 1) {
				params.grantQuantity = this.formData.rate1
			} else {
				params.grantQuantity = this.formData.rate2
			}
			let {
				data: { resultCode },
			} = await updateGrantQuantity(params)
			if (resultCode == 0) {
				this.$message.success('修改成功')
				this.$emit('Refresh', true)
				this.localVisible = false
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
