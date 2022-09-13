<template>
	<div>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane
				v-auth="'listPageMarketingReward'"
				label="订单奖励活动"
				name="orderReward"
			>
				<orderReward ref="orderReward"></orderReward>
			</el-tab-pane>
			<el-tab-pane label="销售奖励活动" name="saleReward">
				<saleReward ref="saleReward"></saleReward>
			</el-tab-pane>
			<!-- <el-tab-pane
				v-auth="'listSuningPageBySupplier'"
				label="商家提现账户"
				name="supply"
			>
				<supply ref="supply"></supply>
			</el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script>
import orderReward from './components/orderReward'
import saleReward from './components/saleReward'
import { checkFunctionCode } from '@/utils/auth'
export default {
	name: 'ActivitySettlementList',
	components: {
		orderReward,
		saleReward,
	},
	data() {
		return {
			activeName: 'orderReward',
			listPageMarketingReward: checkFunctionCode('listPageMarketingReward'),
		}
	},
	created() {
		this.activeName = this.listPageMarketingReward ? 'orderReward' : ''
		this.$nextTick(() => {
			this.$refs[this.activeName]._init(true)
		})
	},
	methods: {
		handleClick({ name }) {
			this.$refs[name]._init(true)
		},
	},
}
</script>
