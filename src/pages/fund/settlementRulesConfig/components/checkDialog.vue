<template>
	<div>
		<el-dialog
			width="450px"
			title="规则配置"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<div v-loading="dialogVisibleLoading" class="check-list">
				<h3>{{ itemInfo.supplierName }} 结算规则如下：</h3>
				<h4>现行结算规则：</h4>
				<p v-for="(item, index) in merchantSettleRuleItemList" :key="index">
					{{ index === 0 ? '规则一：' : '规则二：'
					}}{{ substrIt(item.ruleOrderState) }}；{{
						item.ruleDays
					}}天；结算比例{{ item.ruleSettleProportion }}%
				</p>
				<!-- <p>规则一：发完货；7天；结算50%</p>
				<p>规则二：已签收；5天；剩余结算</p> -->
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { merchantSettleRuleView } from '@/api/orderSettle'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {},

	data() {
		return {
			merchantSettleRuleItemList: [],
			dialogVisibleLoading: false,
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
		substrIt(label) {
			let newLabel = getConstantValueByKey(
				this.$store.state.app.constant.RULE_ORDER_STATE,
				label,
				'-',
				'value',
				'label'
			)
			return newLabel.substr(3, newLabel.length)
		},
		async init() {
			this.dialogVisibleLoading = true // 查看银行信息加载
			let {
				data: {
					resultCode,
					resultData: { merchantSettleRuleItemList = [] },
				},
			} = await merchantSettleRuleView({
				merchantSettleRuleId: this.itemInfo.merchantSettleRuleId,
			})
			this.dialogVisibleLoading = false
			if (resultCode == 0) {
				this.merchantSettleRuleItemList = merchantSettleRuleItemList
			}
		},
		// 关闭弹窗
		resetForm() {
			//重置
			this.merchantSettleRuleItemList = []
			this.localVisible = false
		},
	},
	destroyed() {
		if (this.submitTimer) clearInterval(this.submitTimer)
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
.rules-list {
	position: relative;
	.rules-title {
		position: absolute;
		left: -80px;
	}
	.rules-box {
		margin-bottom: 15px;
	}
	.rules-item {
		display: inline-block;
		margin-right: 20px;
	}
}
.rules-submit-item {
	margin-top: 10px;
}
.check-list {
	position: relative;
	top: -30px;
	h3 {
		font-weight: normal;
		font-size: 15px;
		margin: 5px 0;
		color: #333;
	}
	h4 {
		font-size: 14px;
		margin: 12px 0 5px;
		color: #333;
	}
}
</style>
