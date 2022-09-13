const statisticsRouter = {
	path: '/statistics',
	redirect: '/statistics/shopStatistics',
	name: 'statistics',
	component: () => import('@/layout'),
	meta: {
		title: '统计',
		icon: 'el-icon-s-data',
	},
	children: [
		{
			path: 'shopStatistics',
			name: 'shopStatistics',
			meta: {
				title: '平台订单统计',
				functionCode: ['getCMSOrganizationStatistics'],
			},
			component: () => import('@/pages/statistics/shopStatistics/index'),
		},
		{
			path: 'brandStatistics',
			name: 'brandStatistics',
			meta: {
				title: '档期销售统计',
				functionCode: ['getCMSGoodsGroupOrderStatistics'],
			},
			component: () => import('@/pages/statistics/brandStatistics/index'),
		},
		{
			path: 'groupGoodsSaleStatistics/:goodsGroupId',
			name: 'groupGoodsSaleStatistics',
			hidden: true,
			meta: {
				title: '分组商品销售统计',
			},
			component: () =>
				import('@/pages/statistics/groupGoodsSaleStatistics/index'),
		},
		{
			path: 'groupStatistics',
			name: 'groupStatistics',
			meta: {
				title: '档期销售统计(普通)',
				functionCode: ['getGoodsGroupStatistics'],
			},
			component: () => import('@/pages/statistics/groupStatistics/index'),
		},
		{
			path: 'inviteStatistics',
			name: 'inviteStatistics',
			meta: {
				title: '邀请码统计',
				functionCode: ['getCMSInviteCodeStatistics'],
			},
			component: () => import('@/pages/statistics/inviteStatistics/index'),
		},
		{
			path: 'couponStatistics',
			name: 'couponStatistics',
			meta: {
				title: '优惠券统计',
				functionCode: ['findCouponListByParamNew'],
			},
			component: () => import('@/pages/statistics/couponStatistics/index'),
		},
		{
			path: 'brandEvaluteDetails/:id',
			name: 'brandEvaluteDetails',
			hidden: true,
			meta: {
				title: '品牌评价详情',
				functionCode: ['getBrandEvaluateStatistics'],
			},
			component: () => import('@/pages/statistics/brandEvaluteDetails/index'),
		},
		{
			path: 'registerStatistics',
			name: 'registerStatistics',
			meta: {
				title: '新增店主统计',
				functionCode: ['getCMSOrganizationForRigester'],
			},
			component: () => import('@/pages/statistics/registerStatistics/index'),
		},
		{
			path: 'refundRateStatistics',
			name: 'refundRateStatistics',
			meta: {
				title: '退货率统计',
				functionCode: ['findOrganizationRefundCountByparam'],
			},
			component: () => import('@/pages/statistics/refundRateStatistics/index'),
		},
		{
			path: 'shopLossStatistics',
			name: 'shopLossStatistics',
			meta: {
				title: '店主留存率统计',
				functionCode: ['getCMSOrganizationLossStatistics'],
			},
			component: () => import('@/pages/statistics/shopLossStatistics/index'),
		},
		{
			path: 'brandRecommend',
			name: 'brandRecommend',
			meta: {
				title: '品牌预约统计',
				functionCode: ['brandSubscribeStatistics'],
			},
			component: () => import('@/pages/statistics/brandRecommend/index'),
		},
		{
			path: 'afterSalesBusinessStatistics',
			name: 'afterSalesBusinessStatistics',
			meta: {
				title: '售后业务统计',
				functionCode: ['afterSalesStatusStatistical'],
			},
			component: () =>
				import('@/pages/statistics/afterSalesBusinessStatistics/index'),
		},
		{
			path: 'commodityCategory',
			name: 'commodityCategory',
			meta: {
				title: '商品类目利润统计',
				functionCode: ['getCMSClassifyReservationList'],
			},
			component: () => import('@/pages/statistics/commodityCategory/index'),
		},
		{
			path: 'buriedCenter',
			name: 'buriedCenter',
			meta: {
				title: '埋点配置中心',
				functionCode: ['addDotEventConfig'],
			},
			component: () => import('@/pages/statistics/buriedCenter/index'),
		},
		{
			path: 'shopFamilyTree',
			name: 'shopFamilyTree',
			meta: {
				title: 'KA看板',
				functionCode: ['getKaBoardPage', 'businessGroupClerkPage'],
			},
			component: () => import('@/pages/statistics/shopFamilyTree/index'),
		},
	],
}
export default statisticsRouter
