const scriptRouter = {
	path: '/payment',
	redirect: '/payment/platformAccountSummaryList',
	name: 'payment',
	component: () => import('@/layout'),
	meta: {
		title: '支付',
		icon: 'el-icon-coin',
	},
	children: [
		{
			path: 'platformAccountSummaryList',
			name: 'platformAccountSummaryList',
			meta: {
				title: '平台账户汇总列表',
				functionCode: ['summaryList'],
			},
			component: () =>
				import('@/pages/payment/platformAccountSummaryList/index'),
		},
		{
			path: 'platformAccountsRealTimeList',
			name: 'platformAccountsRealTimeList',
			meta: {
				title: '平台账户实时列表',
				functionCode: ['realTimeList'],
			},
			component: () =>
				import('@/pages/payment/platformAccountsRealTimeList/index'),
		},
		{
			path: 'accountTransferRecord',
			name: 'accountTransferRecord',
			meta: {
				title: '苏宁账户转账记录',
				functionCode: ['transferInfoPage'],
			},
			component: () => import('@/pages/payment/accountTransferRecord/index'),
		},
		{
			path: 'paymentSettings',
			name: 'PaymentSettings',
			meta: {
				title: '支付设置',
				functionCode: ['/pay-route/page'],
			},
			component: () => import('@/pages/payment/paymentSettings/index'),
		},
		{
			path: 'paymentChannelWithdrawalList',
			name: 'paymentChannelWithdrawalList',
			meta: {
				title: '支付通道提现列表',
				functionCode: ['paymentChannleWithdrawPageList'],
			},
			component: () =>
				import('@/pages/payment/paymentChannelWithdrawalList/index'),
		},
	],
}
export default scriptRouter
