/*
 * @Description: 档期管理路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:50:15
 * @LastEditTime: 2022-02-10 15:00:19
 * @LastEditors: Please set LastEditors
 */
const dzFinancingFile = {
	path: '/financingFile',
	redirect: '/financingFile/activityList',
	name: 'financingFile',
	component: () => import('@/layout'),
	meta: {
		title: '档期管理',
		icon: 'el-icon-collection',
	},
	children: [
		{
			path: 'reconciliationList',
			name: 'reconciliationList',
			meta: {
				title: '对账中心',
				functionCode: [
					'listFirstStFinancePage',
					'listEndStFinancePage',
					'listPreviousStFinancePage',
				],
			},
			component: () => import('@/pages/financingFile/reconciliationList/index'),
		},
		{
			path: 'billParticulars',
			name: 'billParticulars',
			hidden: true,
			meta: {
				title: '对账详情',
			},
			component: () => import('@/pages/financingFile/billParticulars/index'),
		},
		{
			path: 'accountDetail',
			name: 'AccountDetail',
			meta: {
				title: '数据明细',
				functionCode: ['pageStFinanceDataDetail'],
			},
			component: () => import('@/pages/financingFile/AccountDetail/index'),
		},
		{
			path: 'accountInformation',
			name: 'AccountInformation',
			meta: {
				title: '商家账户中心',
				functionCode: ['sPlatformSupplierBalanceList'],
			},
			component: () => import('@/pages/financingFile/AccountInformation/index'),
		},
		{
			path: 'merchantAccount',
			name: 'MerchantAccount',
			hidden: true,
			meta: {
				title: '商家账户详情',
				functionCode: ['sPlatformSupplierBalanceList'],
			},
			component: () => import('@/pages/financingFile/MerchantAccount/index'),
		},
		{
			path: 'withdrawDeposit',
			name: 'withdrawDeposit',
			meta: {
				title: '提现明细列表',
				functionCode: ['sPlatformSupplierWithdrawApplicationList'],
			},
			component: () => import('@/pages/financingFile/withdrawDeposit/index'),
		},
		{
			path: 'moneyProportion',
			name: 'moneyProportion',
			meta: {
				title: '打款比例设定',
				functionCode: ['supplierAccountNumberDownPaymentList'],
			},
			component: () => import('@/pages/financingFile/moneyProportion/index'),
		},
		{
			path: 'merchantImport',
			name: 'MerchantImport',
			hidden: true,
			meta: {
				title: '导入冲账数据',
				functionCode: ['importSupplierFlatBalanceList'],
			},
			component: () => import('@/pages/financingFile/MerchantImport/index'),
		},
		{
			path: 'merchantImportRecord',
			name: 'MerchantImportRecord',
			meta: {
				title: '导入冲账数据记录',
				functionCode: ['importSupplierFlatBalanceList'],
			},
			component: () =>
				import('@/pages/financingFile/MerchantImportRecord/index'),
		},
	],
}
export default dzFinancingFile
