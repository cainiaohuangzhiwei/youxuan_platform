<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="转账到银行卡" name="WithdrawBankList">
				<withdraw-bank-list ref="WithdrawBankList"></withdraw-bank-list>
			</el-tab-pane>
			<el-tab-pane label="转账到微信零钱" name="WithdrawWechatList"
				><withdraw-wechat-list ref="WithdrawWechatList"></withdraw-wechat-list
			></el-tab-pane>
			<el-tab-pane label="转账到支付宝" name="WithdrawAlipayList"
				><withdraw-alipay-list ref="WithdrawAlipayList"></withdraw-alipay-list
			></el-tab-pane>
			<el-tab-pane label="原路返回" name="WithdrawBackList"
				><Withdraw-back-list ref="WithdrawBackList"></Withdraw-back-list
			></el-tab-pane>
			<el-tab-pane label="兑换优惠券" name="ExchangeCoupon"
				><exchange-coupon ref="ExchangeCoupon"></exchange-coupon
			></el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import WithdrawBankList from './components/WithdrawBankList'
import WithdrawWechatList from './components/WithdrawWechatList'
import WithdrawAlipayList from './components/WithdrawAlipayList'
import WithdrawBackList from './components/WithdrawBackList'
import ExchangeCoupon from './components/ExchangeCoupon'

export default {
	name: 'CompensationWithdrawList',
	components: {
		BasicContainer,
		WithdrawBankList,
		WithdrawWechatList,
		WithdrawAlipayList,
		WithdrawBackList,
		ExchangeCoupon,
	},
	data() {
		return {
			activeName: 'WithdrawBankList',
		}
	},
}
</script>
