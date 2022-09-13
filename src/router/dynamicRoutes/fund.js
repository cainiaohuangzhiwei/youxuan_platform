/*
 * @Description: 资金路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:50:15
 * @LastEditTime: 2021-11-02 14:50:10
 * @LastEditors: Please set LastEditors
 */
const contentRouter = {
	path: '/fund',
	redirect: '/fund/fundDetails',
	name: 'fund',
	component: () => import('@/layout'),
	meta: {
		title: '资金',
		icon: 'el-icon-s-finance',
	},
	children: [
		{
			path: 'fundDetails',
			name: 'FundDetails',
			meta: {
				title: '明细统计',
				functionCode: ['getFinanceStatisticsInfo', 'fundBalanceStatistics'],
			},
			component: () => import('@/pages/fund/fundDetails/index'),
		},
		{
			path: 'merchantAccountList',
			name: 'MerchantAccountList',
			meta: {
				title: '商家账户列表',
				functionCode: ['supplierQueryAccountList'],
			},
			component: () => import('@/pages/fund/merchantAccountList/index'),
		},
		{
			path: 'merchantAccountDetails/:merchantAccountId',
			name: 'MerchantAccountDetails',
			hidden: true,
			meta: {
				title: '商家账户详情',
				functionCode: ['supplierQueryAccountDetail'],
			},
			component: () => import('@/pages/fund/merchantAccountDetails/index'),
		},
		{
			path: 'shopAccountList',
			name: 'ShopAccountList',
			meta: {
				title: '店主账户列表',
				functionCode: ['organizationQueryAccountList'],
			},
			component: () => import('@/pages/fund/shopAccountList/index'),
		},
		{
			path: 'shopAccountDetails/:organizationId',
			name: 'ShopAccountDetails',
			hidden: true,
			meta: {
				title: '店主账户详情',
				functionCode: [
					'organizationQueryAccountDetail',
					'organizationBalanceChangeList',
				],
			},
			component: () => import('@/pages/fund/shopAccountDetails/index'),
		},
		{
			path: 'shopSettlementList',
			name: 'shopSettlementList',
			meta: {
				title: '店主结算列表',
				functionCode: ['listOrganizationSettleStatistics'],
			},
			component: () => import('@/pages/fund/shopSettlementList/index'),
		},
		{
			path: 'shopSettlementDetails/:monthSettleStatisticsId',
			name: 'shopSettlementDetails',
			hidden: true,
			meta: {
				title: '店主结算明细',
				functionCode: ['listOrganizationSettleStatistics'],
			},
			component: () => import('@/pages/fund/shopSettlementDetails/index'),
		},
		{
			path: 'shopMonthlyStatement',
			name: 'shopMonthlyStatement',
			meta: {
				title: '店主月结扣款',
				functionCode: ['importOrgDeductRecord'],
			},
			component: () => import('@/pages/fund/shopMonthlyStatement/index'),
		},
		{
			path: 'shopMonthlyStatementList',
			name: 'shopMonthlyStatementList',
			hidden: true,
			meta: {
				title: '店主月结扣款历史记录',
				functionCode: ['importOrgDeductRecord'],
			},
			component: () => import('@/pages/fund/shopMonthlyStatementList/index'),
		},
		{
			path: 'shopReconciliationList',
			name: 'shopReconciliationList',
			meta: {
				title: '店主余额调账列表明细',
				functionCode: ['listAccOrganizationReconcilation'],
			},
			component: () => import('@/pages/fund/shopReconciliationList/index'),
		},
		{
			path: 'shopBalanceTopUp',
			name: 'shopBalanceTopUp',
			hidden: true,
			meta: {
				title: '店主余额充值',
				functionCode: [
					'listAccOrganizationReconcilation',
					'importOrgReconciliation',
				],
			},
			component: () => import('@/pages/fund/shopBalanceTopUp/index'),
		},
		{
			path: 'shopBalanceTopUpList',
			name: 'shopBalanceTopUpList',
			hidden: true,
			meta: {
				title: '店主余额充值历史记录',
				functionCode: ['listAccOrganizationReconcilation'],
			},
			component: () => import('@/pages/fund/shopBalanceTopUpList/index'),
		},
		{
			path: 'orderTransferList',
			name: 'OrderTransferList',
			meta: {
				title: '订单转账业务列表',
				functionCode: ['fundOrderTransferList'],
			},
			component: () => import('@/pages/fund/orderTransferList/index'),
		},
		{
			path: 'accountTransferList',
			name: 'AccountTransferList',
			meta: {
				title: '账户转账业务列表',
				functionCode: ['forsTransferRecords'],
			},
			component: () => import('@/pages/fund/accountTransferList/index'),
		},
		{
			path: 'borrowingList',
			name: 'BorrowingList',
			meta: {
				title: '借支业务',
				functionCode: ['fundLoanList'],
			},
			component: () => import('@/pages/fund/borrowingList/index'),
		},
		{
			path: 'platformAccountList',
			name: 'PlatformAccountList',
			meta: {
				title: '平台账户列表',
				functionCode: ['platformQueryAccountList'],
			},
			component: () => import('@/pages/fund/platformAccountList/index'),
		},
		{
			path: 'platformAccountDetails/:accountId',
			name: 'PlatformAccountDetails',
			hidden: true,
			meta: {
				title: '微革账户详情',
				functionCode: ['platformWeegetAccountDetail'],
			},
			component: () => import('@/pages/fund/platformAccountDetails/index'),
		},
		{
			path: 'marketAccountDetails/:accountId',
			name: 'MarketAccountDetails',
			hidden: true,
			meta: {
				title: '微革营销账户详情',
				functionCode: ['platformMarketingAccountDetail'],
			},
			component: () => import('@/pages/fund/marketAccountDetails/index'),
		},
		{
			path: 'promotionAccountDetails',
			name: 'PromotionAccountDetails',
			hidden: true,
			meta: {
				title: '推广账户详情',
				functionCode: ['promotionAccountDetail'],
			},
			component: () => import('@/pages/fund/promotionAccountDetails/index'),
		},
		{
			path: 'operationAccountDetail',
			name: 'OperationAccountDetail',
			hidden: true,
			meta: {
				title: '运营账户详情',
				functionCode: ['operationsAccountDetail'],
			},
			component: () => import('@/pages/fund/operationAccountDetail/index'),
		},
		{
			path: 'merchantWithdrawList',
			name: 'MerchantWithdrawList',
			meta: {
				title: '商家提现业务列表',
				functionCode: ['getMerchantAccountWithdrawList'],
			},
			component: () => import('@/pages/fund/merchantWithdrawList/index'),
		},
		{
			path: 'platformWithdrawList',
			name: 'PlatformWithdrawList',
			meta: {
				title: '平台提现业务列表',
				functionCode: ['getPlatformAccountWithdrawList'],
			},
			component: () => import('@/pages/fund/platformWithdrawList/index'),
		},
		{
			path: 'merchantSettleList',
			name: 'MerchantSettleList',
			meta: {
				title: '商家结算信息导出',
				functionCode: ['merchantSettleList'],
			},
			component: () => import('@/pages/fund/merchantSettleList/index'),
		},
		{
			path: 'orderFlowList',
			name: 'OrderFlowList',
			meta: {
				title: '订单流水业务查询',
				functionCode: ['fundOrderFlowList'],
			},
			component: () => import('@/pages/fund/orderFlowList/index'),
		},
		{
			path: 'withdraw/:merchantAccountId?/:supplierId?',
			name: 'withdraw',
			hidden: true,
			meta: {
				title: '账户提现',
				functionCode: [
					'doSupplierCashOut',
					'supplierWithdrawView',
					'platformWithdrawView',
					'promotionAccountApply',
					'paymentChannleCreateWithdraw',
				],
			},
			component: () => import('@/pages/fund/withdraw/index'),
		},
		{
			path: 'platformAccountTransfer/:accountId',
			name: 'PlatformAccountTransfer',
			hidden: true,
			meta: {
				title: '平台账户转账',
				functionCode: [
					'platformAccountTransferView',
					'platformAccountTransfer',
					'platformAccountTransferOrganization',
				],
			},
			component: () => import('@/pages/fund/platformAccountTransfer/index'),
		},
		{
			path: 'reconciliation/:accountId',
			name: 'Reconciliation',
			hidden: true,
			meta: {
				title: '调账',
				functionCode: ['marketingAccountRegulation'],
			},
			component: () => import('@/pages/fund/Reconciliation/index'),
		},
		{
			path: 'merchantWithdrawAuditList',
			name: 'MerchantWithdrawAuditList',
			meta: {
				title: '商家提现审批列表',
				functionCode: ['supplierWithdrawAuditList'],
			},
			component: () => import('@/pages/fund/merchantWithdrawAuditList/index'),
		},
		{
			path: 'merchantWithholdImport',
			name: 'MerchantWithholdImport',
			meta: {
				title: '商家扣款数据导入',
				functionCode: ['impostMerchantDeductList'],
			},
			component: () => import('@/pages/fund/merchantWithholdImport/index'),
		},
		{
			path: 'merchantWithholdImportLog',
			name: 'MerchantWithholdImportLog',
			meta: {
				title: '商家扣款数据导入历史',
				functionCode: ['impostMerchantDeductList'],
			},
			component: () => import('@/pages/fund/merchantWithholdImportLog/index'),
		},
		{
			path: 'merchantWithholdCheckList',
			name: 'MerchantWithholdCheckList',
			meta: {
				title: '商家扣款确认列表',
				functionCode: ['getMerchantDeductList'],
			},
			component: () => import('@/pages/fund/merchantWithholdCheckList/index'),
		},
		{
			path: 'merchantOrderSettleList',
			name: 'MerchantOrderSettleList',
			meta: {
				title: '商家订单结算列表',
				functionCode: ['merchantOrderSettleList'],
			},
			component: () => import('@/pages/fund/merchantOrderSettleList/index'),
		},
		{
			path: 'settlementRulesConfig',
			name: 'SettlementRulesConfig',
			meta: {
				title: '商家结算规则配置',
				functionCode: ['merchantSettleRuleList'],
			},
			component: () => import('@/pages/fund/settlementRulesConfig/index'),
		},
		{
			path: 'importsettlementRules',
			name: 'ImportsettlementRules',
			hidden: true,
			meta: {
				title: '规则导入历史',
				// functionCode: ['merchantSettleRuleList'],
			},
			component: () => import('@/pages/fund/ImportsettlementRules/index'),
		},
		{
			path: 'accountTransferImportLog',
			name: 'AccountTransferImportLog',
			hidden: true,
			meta: {
				title: '导入历史',
			},
			component: () => import('@/pages/fund/accountTransferImportLog/index'),
		},
		{
			path: 'paymentsSmallRecordList',
			name: 'PaymentsSmallRecordList',
			meta: {
				title: '小额打款记录列表',
				functionCode: ['accountSmallRemitPage'],
			},
			component: () => import('@/pages/fund/PaymentsSmallRecordList/index'),
		},
		{
			path: 'paymentsSmallDetails',
			name: 'PaymentsSmallDetails',
			hidden: true,
			meta: {
				title: '小额打款记录',
			},
			component: () => import('@/pages/fund/paymentsSmallDetails/index'),
		},
		{
			path: 'cashAccountList',
			name: 'cashAccountList',
			meta: {
				title: '提现账户列表',
				functionCode: [
					'listSuningWithdrawAccountPlaform',
					'listSuningWithdrawAccountMerchant',
				],
			},
			component: () => import('@/pages/fund/cashAccountList/index'),
		},
		{
			path:
				'cashAccountDetails/:openAccountSn?/:accountBankInfoId?/:supplierId?/:skipType?',
			name: 'cashAccountDetails',
			hidden: true,
			meta: {
				title: '新增提现账户',
			},
			component: () => import('@/pages/fund/cashAccountDetails/index'),
		},
		{
			path:
				'addBankAccount/:openAccountSn?/:suningOpenAccountBankInfoId?/:skipType?/:bankAccountName?/:type?',
			name: 'addBankAccount',
			hidden: true,
			meta: {
				title: '新增银行卡',
			},
			component: () => import('@/pages/fund/addBankAccount/index'),
		},
		{
			path: 'paymentChannelDetails',
			name: 'paymentChannelDetails',
			meta: {
				title: '支付通道明细统计',
				functionCode: ['queryChannelTradeStatistical'],
			},
			component: () => import('@/pages/fund/paymentChannelDetails/index'),
		},
		{
			path: 'paymentChannelBusinessEntry',
			name: 'paymentChannelBusinessEntry',
			meta: {
				title: '支付通道商户进件',
				functionCode: ['listSftPageByPlatform'],
			},
			component: () => import('@/pages/fund/paymentChannelBusinessEntry/index'),
		},
		{
			path: 'payMerchandon/:accountRecordNo',
			name: 'payMerchandon',
			hidden: true,
			meta: {
				title: '新增支付商户',
			},
			component: () => import('@/pages/fund/payMerchandon/index'),
		},
		{
			path: 'paymentChannelAccountList',
			name: 'paymentChannelAccountList',
			meta: {
				title: '支付通道账户列表',
				functionCode: ['listMerchantFundBalance'],
			},
			component: () => import('@/pages/fund/paymentChannelAccountList/index'),
		},
		{
			path: 'accountTransfer',
			name: 'accountTransfer',
			hidden: true,
			meta: {
				title: '苏宁账户转账',
				// functionCode: ['listMerchantFundBalance'],
			},
			component: () => import('@/pages/fund/accountTransfer/index'),
		},
		{
			path: 'bankCardManagement/:type?/:openAccountSn?',
			name: 'bankCardManagement',
			hidden: true,
			meta: {
				title: '银行卡管理',
				// functionCode: ['listMerchantFundBalance'],
			},
			component: () => import('@/pages/fund/bankCardManagement/index'),
		},
		{
			path: 'wthdrawalAccountApplication',
			name: 'wthdrawalAccountApplication',
			meta: {
				title: '商家更换提现账户申请',
				functionCode: ['suningAccountChangeApplyListPage'],
			},
			component: () => import('@/pages/fund/wthdrawalAccountApplication/index'),
		},
	],
}
export default contentRouter
