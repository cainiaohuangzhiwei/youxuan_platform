<!--
 * @Author: your name
 * @Date: 2021-04-22 17:45:59
 * @LastEditTime: 2021-10-26 11:30:59
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \egg\src\pages\business\WaitCouponList\components\FormTable\FormTable.vue
-->
<template>
	<basic-container>
		<div>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="待补偿优惠券" name="couponCompensated">
					<coupon-compensated></coupon-compensated>
				</el-tab-pane>
				<el-tab-pane label="待补款金额" name="amountMade">
					<amount-made></amount-made>
				</el-tab-pane>
				<el-tab-pane
					v-if="checkFunctionCode('supplierCompensationAmountPage')"
					label="商家待补款金额"
					name="supplyWaitAmount"
				>
					<supply-amount></supply-amount>
				</el-tab-pane>
				<!-- <el-tab-pane label="汇聚待补款金额" name="aggregateAmountCompensated">
					<aggregate-AmountCompensated></aggregate-AmountCompensated>
				</el-tab-pane> -->
			</el-tabs>
		</div>
	</basic-container>
</template>

<script>
import CouponCompensated from './CouponCompensated'
import AmountMade from './AmountMade'
import SupplyAmount from './SupplyWaitAmount'
import { checkFunctionCode } from '@/utils/auth'
// import AggregateAmountCompensated from './AggregateAmountCompensated'

export default {
	components: {
		CouponCompensated,
		AmountMade,
		SupplyAmount,
		// AggregateAmountCompensated,
	},
	name: 'FormTable',

	data() {
		return {
			activeName: 'couponCompensated',
			checkFunctionCode,
		}
	},

	methods: {},
}
</script>
