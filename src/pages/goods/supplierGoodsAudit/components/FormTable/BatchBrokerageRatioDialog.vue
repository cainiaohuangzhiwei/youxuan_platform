<template>
	<div>
		<el-dialog
			width="400px"
			:title="
				this.brokerageRatioRow.type == 1 ? '批量修改分佣比例' : '修改分佣比例'
			"
			:inline="true"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="_checkCommissionRate"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				labelWidth="40px"
				:formAction="formAction"
			>
				<template #rate>
					<div>
						<el-input
							:min="0"
							:max="100"
							style="width: 92%"
							v-model.trim="formData.rate"
							placeholder="请输入比例"
						/>
						%
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import {
	checkCommissionRate,
	updateCheckListCommissionRate,
} from '@/api/supplierGoodsAudit'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		batchGoodsId: {
			type: Array,
			default: () => [],
		},
		brokerageRatioRow: {
			type: Object,
			default: () => ({}),
		},
		brokerBrandId: {
			type: String,
			default: () => '',
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			item: [
				{
					title: '比例',
					type: 'custom',
					dataIndex: 'rate',
				},
			],
			formData: {
				rate: '',
			},
			rateFirst: '',
			flag: null,
			formRules: {
				rate: [
					{
						validator: (rule, value, callback) => {
							const pattern = /^\d+.?\d{0,2}$/
							if (value === '') {
								callback(new Error('比例不能为空'))
							} else {
								if (Number(value) < 0 || Number(value) >= 100) {
									callback(new Error('比例必须大于0小于100'))
								} else if (isNaN(Number(value))) {
									callback(new Error('请输入正确的比例'))
								} else if (!pattern.test(value)) {
									callback(new Error('小数点后最多只能输入两位'))
								}
								callback()
							}
						},
						trigger: 'blur',
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
		// 搜索条件
		findSearchParams() {
			const { type, goodsId, brandId } = this.brokerageRatioRow
			const paramJson = {
				goodsIdList: type === 1 ? this.batchGoodsId : [goodsId],
				brandId: type === 1 ? this.brokerBrandId : brandId,
			}

			return paramJson
		},

		// 查询是否已修改分佣比例
		async _checkCommissionRate() {
			const paramJson = this.findSearchParams()
			const {
				data: { resultCode, resultData },
			} = await checkCommissionRate(paramJson)

			if (resultCode == 0) {
				this.flag = resultData.flag
				if (resultData.flag) {
					this.rateFirst = resultData.rate
					this.formData.rate = resultData.rate
				}
			}
		},

		// 保存 type: 1多选, 2单选
		async submitForm() {
			const paramJson = this.findSearchParams()
			paramJson.rate = this.formData.rate
			if (!this.flag) {
				this._updateCheckListCommissionRate(paramJson)
			} else {
				this.$confirm(
					this.brokerageRatioRow.type === 2
						? `上次设置分佣比例为${this.rateFirst}%，是否需要重新修改？`
						: '已经设定过分佣比例，是否需要重新修改？',
					'提示',
					{
						type: 'warning',
						callback: async (action) => {
							if (action === 'confirm') {
								this._updateCheckListCommissionRate(paramJson)
							}
						},
					}
				)
			}
		},

		// 批量修改分佣比例
		async _updateCheckListCommissionRate(paramsData) {
			const {
				data: { resultMsg, resultCode },
			} = await updateCheckListCommissionRate(paramsData)
			const typeMsg = resultCode == 0 ? 'success' : 'error'
			if (resultCode == 0) {
				this.$message[typeMsg](resultMsg)
				this.$emit('fatherMethodInit')
				this.resetForm()
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
}
</script>

<style lang="scss" scoped></style>
