const waterSubsidiaryRouter = {
	path: '/waterSubsidiary',
	redirect: '/waterSubsidiary/waterSubsidiaryList',
	name: 'waterSubsidiary',
	component: () => import('@/layout'),
	meta: {
		title: '流水明细',
		icon: 'el-icon-s-marketing',
	},
	children: [
		{
			path: 'waterSubsidiaryRefund',
			name: 'WaterSubsidiaryRefund',
			meta: {
				title: '退款流水明细',
				functionCode: ['refundRetails'],
			},
			component: () => import('@/pages/waterSubsidiary/waterSubsidiary/index'),
		},
		{
			path: 'waterSubsidiaryClose',
			name: 'WaterSubsidiaryClose',
			meta: {
				title: '订单结算明细',
				functionCode: ['orderSettlementDetails'],
			},
			component: () => import('@/pages/waterSubsidiary/waterSubsidiary/index'),
		},
		{
			path: 'waterSubsidiaryWithdraw',
			name: 'WaterSubsidiaryWithdraw',
			meta: {
				title: '店主提现流水明细',
				functionCode: ['sftShopSettlementFlowAccount'],
			},
			component: () => import('@/pages/waterSubsidiary/waterSubsidiary/index'),
		},
		{
			path: 'waterSubsidiaryStay',
			name: 'WaterSubsidiaryStay',
			meta: {
				title: '订单待结算流水账户',
				functionCode: ['orderPendingSettlementFlowAccount'],
			},
			component: () => import('@/pages/waterSubsidiary/waterSubsidiary/index'),
		},
	],
}
export default waterSubsidiaryRouter
