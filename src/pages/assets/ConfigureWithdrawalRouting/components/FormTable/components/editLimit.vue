<template>
	<yx-dialog title="编辑限额" :bottomBtn="bottomBtn" :visible.sync="visible">
		<el-radio-group v-model="operation">
			<div class="radio-item">
				<el-radio :label="1">
					<span>加限额</span>
					<el-input
						oninput="value=value.replace(/[^\d.]/g,'')"
						class="amount-input"
						type="number"
						v-model="plusAmount"
					></el-input>
				</el-radio>
			</div>
			<div class="radio-item">
				<el-radio :label="2">
					<span>减限额</span>
					<el-input
						oninput="value=value.replace(/[^\d.]/g,'')"
						class="amount-input"
						type="number"
						v-model="lessAmount"
					></el-input>
				</el-radio>
			</div>
		</el-radio-group>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import { updateAmountWithdrawalConfig } from '@/api/withdrawalConfig'
import { numberFormat } from '@/utils/helper/common'
export default {
	components: {
		YxDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 操作记录类型,1店主身份提现路由，2限额提现路由
		withdrawalConfigDetailVo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			plusAmount: '',
			lessAmount: '',
			operation: 1,
			bottomBtn: [
				{
					title: '确定',
					click: (e) => {
						this._updateAmountWithdrawalConfig(e)
					},
				},
			],
		}
	},
	methods: {
		_updateAmountWithdrawalConfig: function (e) {
			// this.$forceUpdate()
			// 编辑额度
			let paramJson = {
				operation: this.operation,
				withdrawalConfigId: this.withdrawalConfigDetailVo.withdrawalConfigId,
			}
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			if (this.operation == 1) {
				paramJson.amount = this.plusAmount
			} else {
				paramJson.amount = this.lessAmount
			}
			if (!paramJson.amount) {
				this.$message.warning('请输入金额')
				return
			}
			if (paramJson.amount == 0) {
				this.$message.warning('额度必须大于0')
				return
			}
			if (paramJson.amount > 100000000) {
				this.$message.warning('编辑限额不能超过100000000')
				return
			}
			if (
				this.operation == 2 &&
				this.withdrawalConfigDetailVo.useAmount - this.lessAmount <
					this.withdrawalConfigDetailVo.lockAmount
			) {
				this.$message.warning('可用限额不能小于冻结额度')
				return
			}
			let message = `确定${
				this.operation == 1 ? '加限额' : '减限额'
			} ${numberFormat(paramJson.amount, 2)}元 吗？`
			this.$alert(message, '提示', {
				confirmButtonText: '确定',
				callback: async (action) => {
					if (action == 'confirm') {
						let {
							data: { resultCode, resultMsg },
						} = await updateAmountWithdrawalConfig(paramJson, custom)
						if (resultCode == 0) {
							this.$message({
								message: resultMsg,
								type: 'success',
							})
							this.visible = false
							this.$emit('updateWithdrawalConfig')
						}
					}
				},
			})
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			this.operation = 1
			this.plusAmount = ''
			this.lessAmount = ''
		},
	},
}
</script>

<style lang="scss" scoped>
.radio-item {
	margin: 20px 0;
	.amount-input {
		margin-left: 20px;
	}
}
</style>
