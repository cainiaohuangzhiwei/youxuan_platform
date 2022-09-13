const materialManagement = {
	path: '/material',
	redirect: '/material/commodity',
	name: 'material',
	component: () => import('@/layout'),
	meta: {
		title: '素材管理',
		icon: 'el-icon-s-management',
	},
	children: [
		{
			path: 'commodity',
			name: 'commodity',
			meta: {
				title: '商品素材库',
				functionCode: ['goodsMaterialPage'],
			},
			component: () => import('@/pages/material/commodity/index'),
		},
		{
			path: 'material/commodityDetail/:goodsId?',
			name: 'commodityDetail',
			hidden: true,
			meta: {
				title: '商品素材库详情',
				functionCode: ['goodsMaterialAll'],
			},
			component: () => import('@/pages/material/commodityDetail/index'),
		},
		{
			path: 'brandMaterialLib',
			name: 'brandMaterialLib',
			meta: {
				title: '品牌素材库',
				functionCode: ['brandParentMaterialList'],
			},
			component: () => import('@/pages/material/brandMaterialLib/index'),
		},
		{
			path: 'activeMaterialLib',
			name: 'activeMaterialLib',
			meta: {
				title: '活动素材库',
				functionCode: ['materialContentList'],
			},
			component: () => import('@/pages/material/activeMaterialLib/index'),
		},
		{
			path: 'material/activeDetail/:id?',
			name: 'activeDetail',
			hidden: true,
			meta: {
				title: '活动素材详情',
				functionCode: ['materialContentDetail'],
			},
			component: () => import('@/pages/material/activeDetail/index'),
		},
		{
			path: 'material/activeAdd/:activityMaterialInfoId?/:id?',
			name: 'activeAdd',
			hidden: true,
			meta: {
				title: '新增/编辑场次素材',
				functionCode: ['materialInfoAdd'],
			},
			component: () => import('@/pages/material/activeAdd/index'),
		},
		{
			path: 'material/robotMaterial',
			name: 'robotMaterial',
			meta: {
				title: '机器人素材',
				functionCode: ['robotMaterial'],
			},
			component: () =>
				import('@/pages/material/materialApplication/robotMaterial/index'),
		},
		{
			path: 'material/scheduleMaterial',
			name: 'scheduleMaterial',
			meta: {
				title: '档期素材管理',
				functionCode: ['goodsGroupMaterial'],
			},
			component: () =>
				import('@/pages/material/materialApplication/scheduleMaterial/index'),
		},
		{
			path: 'material/applicationMaterial',
			name: 'applicationMaterial',
			meta: {
				title: '素材中心（应用层）',
				functionCode: ['queryListByPage'],
			},
			component: () => import('@/pages/material/applicationMaterial/index'),
		},
		{
			path: 'businessMaterial',
			name: 'businessMaterial',
			meta: {
				title: '商家素材',
				functionCode: ['pageSupplierGoodsMaterialListFors'],
			},
			component: () => import('@/pages/material/businessMaterial/index'),
		},

		{
			path: 'businessMaterialWhitelist',
			name: 'businessMaterialWhitelist',
			meta: {
				title: '商家素材白名单',
				functionList: ['listGoodsMaterialWhite'],
			},
			component: () =>
				import('@/pages/material/businessMaterialWhitelist/index'),
		},
	],
}
export default materialManagement
