/*
 * @Description: APP路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:50:15
 * @LastEditTime: 2022-02-17 10:03:34
 * @LastEditors: Please set LastEditors
 */
const appRouter = {
	path: '/app',
	redirect: '/app/appMessage',
	name: 'app',
	component: () => import('@/layout'),
	meta: {
		title: 'APP',
		icon: 'el-icon-mobile-phone',
	},
	children: [
		{
			path: 'appMessage',
			name: 'AppMessage',
			meta: {
				title: '站内消息',
				functionCode: ['getAppMessageList'],
			},
			component: () => import('@/pages/app/appMessage/index'),
		},
		{
			path: 'communityCenter',
			name: 'communityCenter',
			meta: {
				title: '社群中心',
				functionCode: ['getImGroupPage'],
			},
			component: () => import('@/pages/app/communityCenter/index'),
		},
		{
			path: 'communityUserCenterDetail/:imUserId',
			name: 'communityUserCenterDetail',
			hidden: true,
			meta: {
				title: '用户详情',
			},
			component: () => import('@/pages/app/communityUserCenterDetail/index'),
		},
		{
			path: 'appMessageDetail/:appMessageId/:type',
			name: 'AppMessageDetail',
			hidden: true,
			meta: {
				title: '新建消息',
			},
			component: () => import('@/pages/app/AppMessageDetail/index'),
		},
		{
			path: 'versionControlB',
			name: 'VersionControlB',
			meta: {
				title: '版本管理-B',
				functionCode: ['getAppVersionPage'],
			},
			component: () => import('@/pages/app/VersionControlB/index'),
		},
		{
			path: 'versionManagement',
			name: 'VersionManagement',
			meta: {
				title: '版本管理-C',
				functionCode: ['getAppVersionPage'],
			},
			component: () => import('@/pages/app/VersionManagement/index'),
		},
		{
			path: 'defaultVersionHistory',
			name: 'DefaultVersionHistory',
			hidden: true,
			meta: {
				title: '版本/渠道管理',
				functionCode: ['getAppVersionPage'],
			},
			component: () => import('@/pages/app/DefaultVersionHistory/index'),
		},
		{
			path: 'inviteStatisticsList',
			name: 'InviteStatisticsList',
			meta: {
				title: '邀请统计',
				functionCode: ['listAppInvitation'],
			},
			component: () => import('@/pages/app/InviteStatisticsList/index'),
		},
		{
			path: 'banner',
			name: 'Banner',
			meta: {
				title: 'Banner',
				functionCode: ['selectList'],
			},
			component: () => import('@/pages/app/Banner/index'),
		},
		{
			path: 'salesDetails/:status/:groupId',
			name: 'SalesDetails',
			hidden: true,
			meta: {
				title: '社群在售店主销售详情',
				functionCode: ['listAppGroupSale'],
			},
			component: () => import('@/pages/app/SalesDetails/index'),
		},

		{
			path: 'accessDetails',
			name: 'AccessDetails',
			hidden: true,
			meta: {
				title: '出入群店主详情',
				functionCode: ['listAppGroupSale'],
			},
			component: () => import('@/pages/app/AccessDetails/index'),
		},
		{
			path: 'ownerDetails',
			name: 'OwnerDetails',
			hidden: true,
			meta: {
				title: '店主详情',
				functionCode: ['listAppGroupSale'],
			},
			component: () => import('@/pages/app/OwnerDetails/index'),
		},
		{
			path: 'materials',
			name: 'Materials',
			meta: {
				title: '发现页管理',
				functionCode: ['getSourceMaterialManageList'],
			},
			component: () => import('@/pages/app/Materials/index'),
		},
		{
			path: 'materialsDetail/:Id',
			name: 'MaterialsDetail',
			hidden: true,
			meta: {
				title: '新建内容管理',
			},
			component: () => import('@/pages/app/MaterialsDetail/index'),
		},
		{
			path: 'appMessageCenter',
			name: 'AppMessageCenter',
			meta: {
				title: '消息中心（C端APP）',
				functionCode: ['getCmsAppMessagePage'],
			},
			component: () => import('@/pages/app/messageCenter/index'),
		},
		{
			path: 'messageProcessing',
			name: 'MessageProcessing',
			hidden: true,
			meta: {
				title: '新增消息',
			},
			component: () => import('@/pages/app/messageProcessing/index'),
		},
		{
			path: 'messageEdit/:messagePlanId',
			name: 'MessageEdit',
			hidden: true,
			meta: {
				title: '编辑消息',
			},
			component: () => import('@/pages/app/messageEdit/index'),
		},
		{
			path: 'messageDetail',
			name: 'MessageDetail',
			hidden: true,
			meta: {
				title: '详情',
			},
			component: () => import('@/pages/app/messageDetail/index'),
		},
	],
}
export default appRouter
