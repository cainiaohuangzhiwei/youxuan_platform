// 资源位路由
const resourceNicheRouter = {
	path: '/resourceNiche',
	redirect: '/resourceNiche/bootPage',
	name: 'resourceNiche',
	component: () => import('@/layout'),
	meta: {
		title: '资源位',
		icon: 'el-icon-mini-program',
	},
	children: [
		{
			path: 'bootPage',
			name: 'BootPage',
			meta: {
				title: '启动页',
				functionCode: ['startPage'],
			},
			component: () => import('@/pages/resourceNiche/BootPage/index'),
		},
		{
			path: 'floating',
			name: 'Floating',
			meta: {
				title: '浮窗广告',
				functionCode: ['floatingWindow'],
			},
			component: () => import('@/pages/resourceNiche/Floating/index'),
		},
		{
			path: 'popUpsWindowPage',
			name: 'PopUpsWindowPage',
			meta: {
				title: '弹窗',
				functionCode: ['popup'],
			},
			component: () => import('@/pages/resourceNiche/PopUpsWindowPage/index'),
		},
	],
}
export default resourceNicheRouter
