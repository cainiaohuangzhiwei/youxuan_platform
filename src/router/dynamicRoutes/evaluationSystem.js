const scriptRouter = {
	path: '/evaluationSystem',
	redirect: '/evaluationSystem/orderEvaluationList',
	name: 'evaluationSystem',
	component: () => import('@/layout'),
	meta: {
		title: '评价系统',
		icon: 'el-icon-edit-outline',
	},
	children: [
		{
			path: 'appraise',
			name: 'Appraise',
			meta: {
				title: '售后评价列表',
				functionCode: ['pageAfterSalesEvaluationList'],
			},
			component: () => import('@/pages/business/appraise/index'),
		},
		{
			path: 'orderEvaluationList',
			name: 'OrderEvaluationList',
			meta: {
				title: '订单评价列表',
				functionCode: ['pageOrderEvaluationList'],
			},
			component: () =>
				import('@/pages/evaluationSystem/orderEvaluationList/index'),
		},
		{
			path: 'orderProductEvaluationList',
			name: 'OrderProductEvaluationList',
			meta: {
				title: '订单商品评价列表',
				functionCode: ['pageOrderGoodsEvaluationList'],
			},
			component: () =>
				import('@/pages/evaluationSystem/orderProductEvaluationList/index'),
		},
		{
			path: 'workOrderEvaluationList',
			name: 'WorkOrderEvaluationList',
			meta: {
				title: '工单评价列表',
				functionCode: ['pageServiceRecordEvaluationList'],
			},
			component: () =>
				import('@/pages/evaluationSystem/workOrderEvaluationList/index'),
		},
		{
			path: 'goodsGroupEvaluationList',
			name: 'goodsGroupEvaluationList',
			meta: {
				title: '档期评价列表',
				functionCode: ['closeGoodsGroupEvaluationList'],
			},
			component: () =>
				import('@/pages/evaluationSystem/goodsGroupEvaluationList/index'),
		},
		{
			path: 'publicEvaluateBrandList',
			name: 'publicEvaluateBrandList',
			meta: {
				title: '商品评价公开商家列表',
				functionCode: ['publicEvaluateBrandList'],
			},
			component: () =>
				import('@/pages/evaluationSystem/PublicEvaluateBrandList/index'),
		},
	],
}
export default scriptRouter
