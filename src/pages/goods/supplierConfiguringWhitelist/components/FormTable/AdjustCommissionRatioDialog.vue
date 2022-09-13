<template>
	<div>
		<el-dialog
			top="30vh"
			width="600px"
			:title="
				this.commissionRateData.type == 1
					? '调整默认分佣比例'
					: '批量调整默认分佣比例-' +
					  commissionRateData.operateSupplierIds.length +
					  '个商家'
			"
			:visible.sync="localVisible"
		>
			<div v-if="commissionRateData.type == 1">
				商家名称：{{ commissionRateData.supplierName }}
			</div>
			<div>
				店主分佣比例（F1）：服务商分佣比例（F2）=
				<el-input
					class="w80"
					type="number"
					:min="1"
					v-model.trim="commissionRateData.proportionOne"
					placeholder="F1"
				/>
				<span> : </span>
				<el-input
					class="w80"
					type="number"
					:min="1"
					v-model.trim="commissionRateData.proportionTwo"
					placeholder="F2"
				/>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { batchUpdateProportion } from '@/api/deduction'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		commissionRateData: {
			type: Object,
			default: () => ({}),
		},
	},

	data() {
		return {}
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
			const paramJson = {
				supplierIds: this.commissionRateData.operateSupplierIds,
				proportionOne: this.commissionRateData.proportionOne,
				proportionTwo: this.commissionRateData.proportionTwo,
			}

			return paramJson
		},
		// 保存 type: 1单选, 2多选
		async submitForm() {
			// let inputPattern = /^(([1-9]\d*)|([0-9]+\.[0-9]{0,2}))$/
			let inputPattern = /^[1-9]\d*$/
			if (
				!inputPattern.test(this.commissionRateData.proportionOne) ||
				!inputPattern.test(this.commissionRateData.proportionTwo)
			) {
				return this.$message.warning('分佣比例必须是大于0的正整数')
			}
			const paramJson = this.findSearchParams()
			this.$confirm('是否确认调整默认分佣比例？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						this._updateCheckListCommissionRate(paramJson)
					}
				},
			})
		},

		// 批量调整默认分佣比例
		async _updateCheckListCommissionRate(paramsData) {
			console.log(paramsData)
			const {
				data: { resultMsg, resultCode },
			} = await batchUpdateProportion(paramsData)
			const typeMsg = resultCode == 0 ? 'success' : 'error'
			if (resultCode == 0) {
				this.$message[typeMsg](resultMsg)
				this.$emit('fatherMethodInit')
				this.localVisible = false
			}
		},
	},
}
</script>

<style lang="scss">
.w80 {
	width: 80px;
}
</style>
