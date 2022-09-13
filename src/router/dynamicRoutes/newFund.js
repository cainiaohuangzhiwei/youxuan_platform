/*
 * @Description: 供应商模块路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:57:13
 * @LastEditTime: 2021-06-28 11:33:49
 * @LastEditors: 你的名字
 */

const rateRouter = {
	path: '/newFund',
	redirect: '/newFund/account',
	name: 'rate',
	component: () => import('@/layout'),
	meta: {
		title: '账户总览',
		icon: 'el-icon-s-finance',
	},
	children: [
		{
			path: 'account',
			name: 'account',
			meta: {
				functionCode: ['realTimeDataBalance'],
				title: '实时余额数据',
			},
			component: () => import('@/pages/newFund/account/index'),
		},
		{
			path: 'platformAccountList',
			name: 'platformAccountListNew',
			meta: {
				functionCode: ['platformRealTimeDataBalance'],
				title: '平台账户列表',
			},
			component: () => import('@/pages/newFund/platformAccountList/index'),
		},
		{
			path: 'platformAccountDetails/:id/:type',
			name: 'platformAccountDetailsNew',
			hidden: true,
			meta: {
				// functionCode: ['monitorLogisticsList'],
				title: '收付通基本账户',
			},
			component: () => import('@/pages/newFund/platformAccountDetails/index'),
		},
		{
			path: 'sftAccountList',
			name: 'SftAccountList',
			meta: {
				functionCode: ['sftAccountList'],
				title: '收付通商家账户列表',
			},
			component: () => import('@/pages/newFund/merchantAccountList/index'),
		},
		{
			path: 'signingInformation/:id',
			name: 'signingInformation',
			hidden: true,
			meta: {
				// functionCode: ['monitorLogisticsList'],
				title: '收付通商家签约资料',
			},
			component: () => import('@/pages/newFund/signingInformation/index'),
		},
		{
			path: 'sftAccountDetails/:id',
			name: 'SftAccountDetails',
			hidden: true,
			meta: {
				// functionCode: ['monitorLogisticsList'],
				title: '商家账户详情',
			},
			component: () => import('@/pages/newFund/merchantAccountDetails/index'),
		},
		{
			path: 'shopkeeperAccountList',
			name: 'shopkeeperAccountList',
			meta: {
				functionCode: ['sftShopAccountList'],
				title: '收付通店主账户列表',
			},
			component: () => import('@/pages/newFund/shopkeeperAccountList/index'),
		},
		{
			path: 'cashFluxSupplierList',
			name: 'CashFluxSupplierList',
			meta: {
				title: '收付通商家开户列表',
				functionCode: ['sftSignList'],
			},
			component: () => import('@/pages/newFund/cashFluxSupplierList/index'),
		},
		{
			path: 'shopkeeperAccountDetails/:id/:type',
			name: 'shopkeeperAccountDetails',
			hidden: true,
			meta: {
				// functionCode: ['monitorLogisticsList'],
				title: '店主账户详情',
			},
			component: () => import('@/pages/newFund/shopkeeperAccountDetails/index'),
		},
	],
}
export default rateRouter
