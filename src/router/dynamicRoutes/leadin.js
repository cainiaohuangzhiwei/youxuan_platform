const importRouter = {
	hidden: false,
	path: '/import',
	redirect: '/import/importHistory',
	name: 'import',
	component: () => import('@/layout'),
	meta: {
		title: '导入',
		icon: 'el-icon-import',
	},
	children: [
		{
			path: 'actions',
			name: 'Actions',
			meta: {
				title: '导入操作',
				functionCode: [
					'impostGoods',
					'impostStockTaking',
					'replenishment',
					'impostOrderDeliver',
					'importAuditedSupplierGoods',
					'impostSupplierBatchUpdateExpressSn',
					'importBatchUpdateGoods',
					'importUpdateGoodsPrice',
					'importStFinanceDataDetail',
				],
			},
			component: () => import('@/pages/import/Actions'),
		},
		{
			path: 'importHistory',
			name: 'GetInventory',
			meta: {
				title: '导入历史记录',
				functionCode: [
					'impostGoods',
					'impostStockTaking',
					'replenishment',
					'impostOrderDeliver',
					'importAuditedSupplierGoods',
					'impostSupplierBatchUpdateExpressSn',
					'importBatchUpdateGoods',
					'importUpdateGoodsPrice',
					'importStFinanceDataDetail',
					'pageAppMaterial',
					'selectList',
				],
			},
			component: () => import('@/pages/import/History/index'),
		},
		{
			path: 'categoryImportRecord',
			name: 'categoryImportRecord',
			hidden: true,
			meta: {
				title: '修改类目导入记录',
				// functionCode: [],
			},
			component: () => import('@/pages/import/categoryImportRecord/index'),
		},
	],
}

export default importRouter
