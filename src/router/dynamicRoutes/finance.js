/*
 * @Description: 新财务模块路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:59:51
 * @LastEditTime: 2021-12-29 15:14:49
 * @LastEditors: Please set LastEditors
 */
const financeRouter = {
	path: '/finance',
	redirect: '/finance/financeCenter',
	name: 'finance',
	component: () => import('@/layout'),
	meta: {
		title: '财务',
		icon: 'el-icon-new-finance',
	},
	children: [
		{
			path: 'financeDetails',
			name: 'FinanceDetails',
			meta: {
				title: '明细统计',
				functionCode: ['getFinanceStatisticsInfo'],
			},
			component: () => import('@/pages/assets/FinanceDetails/index'),
		},
		{
			path: 'reconciliationList',
			name: 'ReconciliationList',
			meta: {
				title: '对账列表',
				functionCode: ['selectReconciliationRecordList'],
			},
			component: () => import('@/pages/assets/ReconciliationList/index'),
		},
		{
			path: 'ReconciliationRecordDetail/:reconciliationRecordId',
			name: 'ReconciliationRecordDetail',
			hidden: true,
			meta: {
				title: '对账详情',
			},
			component: () =>
				import('@/pages/assets/ReconciliationRecordDetail/index'),
		},
		{
			path: 'paymentQuery',
			name: 'PaymentQuery',
			meta: {
				title: '支付查询',
			},
			component: () => import('@/pages/assets/PaymentQuery/index'),
		},
		{
			path: 'redliningList',
			name: 'RedliningList',
			meta: {
				title: '银行列表',
				functionCode: ['getBankList'],
			},
			component: () => import('@/pages/assets/RedliningList/index'),
		},
		{
			path: 'withdrawPayList',
			name: 'WithdrawPayList',
			meta: {
				title: '平台提现明细列表',
				functionCode: ['getWithdrawListByCondition'],
			},
			component: () => import('@/pages/assets/WithdrawPayList/index'),
		},
		{
			path: 'rechargeList',
			name: 'RechargeList',
			meta: {
				title: '充值明细记录',
				functionCode: ['findRechargeListByCondition'],
			},
			component: () => import('@/pages/assets/RechargeList/index'),
		},
		{
			path: 'accountList',
			name: 'AccountList',
			meta: {
				title: '提现账户列表',
				functionCode: ['getBankAccountListByCondition'],
			},
			component: () => import('@/pages/assets/AccountList/index'),
		},
		{
			path: 'bankCardDetail/:bankAccountId',
			name: 'BankCardDetail',
			hidden: true,
			meta: {
				title: '银行卡记录',
				functionCode: ['getFlowBankRecord'],
			},
			component: () => import('@/pages/assets/BankCardDetail/index'),
		},
		{
			path: 'flowOrderList',
			name: 'FlowOrderList',
			meta: {
				title: '优选订单交易记录',
				functionCode: ['getFlowOrderListByCondition'],
			},
			component: () => import('@/pages/assets/FlowOrderList/index'),
		},
		{
			path: 'flowDetailsList',
			name: 'FlowDetailsList',
			meta: {
				title: '优选流水记录',
				functionCode: ['getFlowDetailListByCondition'],
			},
			component: () => import('@/pages/assets/FlowDetailsList/index'),
		},
		{
			path: 'shopWithdrawalDetailsList',
			name: 'ShopWithdrawalDetailsList',
			meta: {
				title: '店主提现明细列表',
				functionCode: ['getWithdrawList'],
			},
			component: () => import('@/pages/assets/ShopWithdrawalDetailsList/index'),
		},
		{
			path: 'shopBalanceAwardImportList',
			name: 'ShopBalanceAwardImportList',
			meta: {
				title: '店主余额奖励导入记录',
			},
			component: () =>
				import('@/pages/assets/ShopBalanceAwardImportList/index'),
		},
		{
			path: 'configureWithdrawalRouting',
			name: 'ConfigureWithdrawalRouting',
			hidden: true,
			meta: {
				title: '配置提现路由',
			},
			component: () =>
				import('@/pages/assets/ConfigureWithdrawalRouting/index'),
		},
		{
			path: 'financeWithdraw/:withdrawType',
			name: 'FinanceWithdraw',
			hidden: true,
			meta: {
				title: '提现',
			},
			component: () => import('@/pages/assets/Withdraw/index'),
		},
		{
			path: 'supplierSubsibyList',
			name: 'SupplierSubsibyList',
			hidden: true,
			meta: {
				title: '商家补贴',
			},
			component: () => import('@/pages/assets/supplierSubsibyList/index'),
		},
		{
			path: 'incomeTotalList',
			name: 'IncomeTotalList',
			hidden: true,
			meta: {
				title: '收入总额明细',
			},
			component: () => import('@/pages/assets/incomeTotalList/index'),
		},
		{
			path: 'refundTotalList',
			name: 'RefundTotalList',
			hidden: true,
			meta: {
				title: '返退总额明细',
			},
			component: () => import('@/pages/assets/refundTotalList/index'),
		},
		{
			path: 'inviteCodeTotalList',
			name: 'InviteCodeTotalList',
			hidden: true,
			meta: {
				title: '邀请码金额明细',
			},
			component: () => import('@/pages/assets/inviteCodeTotalList/index'),
		},
		{
			path: 'equityIncomeList',
			name: 'EquityIncomeList',
			hidden: true,
			meta: {
				title: '权益保障收入',
			},
			component: () => import('@/pages/assets/equityIncomeList/index'),
		},
		{
			path: 'equityPayList',
			name: 'EquityPayList',
			hidden: true,
			meta: {
				title: '权益赔付费用',
			},
			component: () => import('@/pages/assets/equityPayList/index'),
		},
		{
			path: 'supplierCostList',
			name: 'SupplierCostList',
			hidden: true,
			meta: {
				title: '商家成本明细',
			},
			component: () => import('@/pages/assets/supplierCostList/index'),
		},
		{
			path: 'higherRebateList',
			name: 'HigherRebateList',
			hidden: true,
			meta: {
				title: '服务奖励明细',
			},
			component: () => import('@/pages/assets/higherRebateList/index'),
		},
		{
			path: 'couponDeductionList',
			name: 'CouponDeductionList',
			hidden: true,
			meta: {
				title: '优惠券扣减明细',
			},
			component: () => import('@/pages/assets/couponDeductionList/index'),
		},
		{
			path: 'storeActRebateList',
			name: 'StoreActRebateList',
			hidden: true,
			meta: {
				title: '店主营销费用',
			},
			component: () => import('@/pages/assets/storeActRebateList/index'),
		},
		{
			path: 'compensationWithdrawList',
			name: 'CompensationWithdrawList',
			meta: {
				title: '补偿转账列表',
				functionCode: ['listUserCompensationWithdraw'],
			},
			component: () => import('@/pages/assets/CompensationWithdrawList/index'),
		},
	],
}
export default financeRouter
