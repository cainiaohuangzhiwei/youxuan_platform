const newLiveRouter = {
	path: '/live',
	redirect: '/live/liveProjectList',
	name: 'newLive',
	component: () => import('@/layout'),
	meta: {
		title: '直播',
		icon: 'el-icon-video-camera-solid',
	},
	children: [
		{
			path: 'liveProjectList',
			name: 'LiveProjectList',
			meta: {
				title: '直播计划列表',
				functionCode: ['getLivePlanPageList'],
			},
			component: () => import('@/pages/newLive/LiveProjectList/index'),
		},
		{
			path: 'anchorList',
			name: 'AnchorList',
			meta: {
				title: '主播列表',
				functionCode: ['getAnchor'],
			},
			component: () => import('@/pages/newLive/AnchorList/index'),
		},
		{
			path: 'mcnOrganizationList',
			name: 'McnOrganizationList',
			meta: {
				title: '机构列表',
				functionCode: ['getMcnList'],
			},
			component: () => import('@/pages/newLive/McnOrganizationList/index'),
		},
		{
			path: 'liveData',
			name: 'LiveData',
			meta: {
				title: '直播数据列表',
				functionCode: ['getLiveDatas'],
			},
			component: () => import('@/pages/newLive/LiveData/index'),
		},
		{
			path: 'goodsInfo/:livePlanId',
			name: 'GoodsInfo',
			hidden: true,
			meta: {
				title: '编辑商品信息',
			},
			component: () =>
				import('@/pages/newLive/LiveProjectList/components/GoodsInfo/index'),
		},
		{
			path: 'goodsInfo',
			name: 'GoodsInfo',
			hidden: true,
			meta: {
				title: '编辑商品信息',
			},
			component: () =>
				import('@/pages/newLive/LiveProjectList/components/GoodsInfo/index'),
		},
	],
}
export default newLiveRouter
