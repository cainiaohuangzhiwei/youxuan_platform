const pickUpRouter = {
	path: '/pickUp',
	redirect: '/pickUp/expressBill',
	name: 'pickUp',
	component: () => import('@/layout'),
	meta: {
		title: '上门取件',
		icon: 'el-icon-reading',
	},
	children: [
		{
			path: 'expressBill',
			name: 'ExpressBill',
			meta: {
				functionCode: ['/collectionOrder/list'],
				title: '揽件订单',
			},
			component: () => import('@/pages/pickUp/ExpressBill/index'),
		},
		{
			path: 'expressBillDetail/:id',
			name: 'ExpressBillDetail',
			hidden: true,
			meta: {
				functionCode: ['/collectionOrderDetail/detail'],
				title: '揽件订单详情',
			},
			component: () => import('@/pages/pickUp/ExpressBillDetail/index'),
		},
		{
			path: 'collectionOrderExpenses',
			name: 'CollectionOrderExpenses',
			meta: {
				functionCode: ['/pageQuery'],
				title: '订单支付列表',
			},
			component: () => import('@/pages/pickUp/CollectionOrderExpenses/index'),
		},
		{
			path: 'collectionOrderCity',
			name: 'CollectionOrderCity',
			meta: {
				functionCode: ['city/pageQuery'],
				title: '设置城市',
			},
			component: () => import('@/pages/pickUp/CollectionOrderCity/index'),
		},
		{
			path: 'importCity',
			name: 'ImportCity',
			hidden: true,
			meta: {
				functionCode: ['/webImport/importCity.action'],
				title: '批量导入上门揽件城市',
			},
			component: () => import('@/pages/pickUp/ImportCity/index'),
		},
		{
			path: 'importCityRecord',
			name: 'ImportCityRecord',
			meta: {
				// functionCode: ['monitorLogisticsList'],
				title: '设置城市导入记录',
			},
			component: () => import('@/pages/pickUp/ImportCityRecord/index'),
		},
	],
}
export default pickUpRouter
