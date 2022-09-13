const userGroupRouter = {
	path: '/userGroup',
	redirect: '/userGroup/groupEdit',
	name: 'userGroup',
	component: () => import('@/layout'),
	meta: {
		title: '标签系统',
		icon: 'el-icon-s-check',
	},
	children: [
		{
			path: 'groupEdit',
			name: 'groupEdit',
			meta: {
				title: '用户分群',
				functionCode: ['selectUserTagList'],
			},
			component: () => import('@/pages/userGroup/groupEdit/index'),
		},
		{
			path: 'importHistory',
			name: 'importHistory',
			meta: {
				title: '分群导入记录',
				functionCode: ['selectUserTagList'],
			},
			component: () => import('@/pages/userGroup/importHistory/index'),
		},
		{
			path: 'goodsTagList',
			name: 'goodsTagList',
			meta: {
				title: '商品标签',
				functionCode: ['goodsTag'],
			},
			component: () => import('@/pages/userGroup/goodsTagList/index'),
		},
		{
			path: 'goodsTagGoodsList/:goodsTagId',
			name: 'goodsTagGoodsList',
			hidden: true,
			meta: {
				title: '查看商品',
				functionCode: ['checkupGoodsFromGoodsTag'],
			},
			component: () => import('@/pages/userGroup/goodsTagList/goodsList'),
		},
		{
			path: 'goodsTagImportHistory',
			name: 'goodsTagImportHistory',
			meta: {
				title: '导入标签商品信息',
				functionCode: ['exportGoodsForGoodsTag'],
			},
			component: () => import('@/pages/userGroup/goodsTagImportHistory/index'),
		},
	],
}
export default userGroupRouter
