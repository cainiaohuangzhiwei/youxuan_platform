const publicPage = {
	path: '/publicPage',
	redirect: '/publicPage/publicPage',
	name: 'publicPage',
	hidden: true,
	component: () => import('@/layout'),
	meta: {
		// 公共页面
	},
	children: [
		{
			path: 'importRecord/:type/:title',
			name: 'importRecord',
			meta: {
				title: '导入详情',
			},
			component: () => import('@/pages/publicPage/importRecord/index'),
		},
	],
}
export default publicPage
