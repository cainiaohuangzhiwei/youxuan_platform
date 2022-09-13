import request from '@/utils/interceptor/request'
/*
 * -----------------------------------订单流水业务查询---------------------------------------
 *
 */
// 订单流水业务查询列表
export const fundOrderFlowList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/fundOrderFlowList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 账户服务系统开关
export const fundSwitch = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/fundSwitch.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 订单转账业务列表
export const fundOrderTransferList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/fundOrderTransferList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 账户转账业务列表
export const forsTransferRecords = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-transfer/forsTransferRecords',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 转账操作记录
export const listOperationRecord = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-transfer/listOperationRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 审批转账记录
export const batchAuditTransferAmountRecord = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/transferAmount/batchAuditTransferAmountRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 导入待审核转账记录
export const importTransferAmountRecord = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-bullet-account-service/account/transferAmount/importTransferAmountRecord`,
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 单个新增待审核转账记录
export const saveTransferAmountRecord = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/transferAmount/saveTransferAmountRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 借支列表
export const fundLoanList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/fundLoanList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 偿还列表
export const fundRepayList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/fundRepayList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 退款业务列表
export const fundTransferRefundList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/fundTransferRefundList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 重新发起补差
export const retryMarketingToMerchant = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/retryMarketingToMerchant.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 资金账户余额统计
export const fundBalanceStatistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accountService/fundBalanceStatistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 推广账户账户详情
export const accPromotionAccountDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/account/acc-promotion-account/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 推广账户流水列表
export const accPromotionAccountList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-promotion-account-water/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 推广账户流水金额统计
export const accPromotionAccountAmountSum = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-promotion-account-water/amount-sum',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 苏宁提现账户列表
export const listPageAccount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/listPageAccount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取苏宁账号操作记录
export const listOperateRecord = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccountOperateRecord/listOperateRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 添加苏宁账户绑卡银行卡信息
export const addBindBank = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccountBankInfo/addBindBank',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 修改苏宁账户绑卡银行卡信息
export const modifyBindBank = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccountBankInfo/modifyBindBank',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取苏宁提现账户详细信息
export const getDetailByPlatform = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/getDetailByPlatform',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 苏宁提现账户银行卡列表
export const getBankListPageByPlatform = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/listPageByPlatform',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取平台有效的银行卡列表
export const platformBankAccount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccountBankInfo/platformBankAccount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 推广账户提现申请
export const promotionAccountApply = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/withdraw/promotionAccountApply',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 微革账户提现申请
export const weegetAccountApply = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/account/withdraw/weegetAccountApply',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 删除商户收付通记录
export const sftDeleteRecord = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/fundsFors/merchant/sft/deleteRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 提交开户/重新提交开户
export const openAccount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-suning-account/openAccount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 打款验证
export const payVerify = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/account/acc-suning-account/payVerify',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 提交绑卡/重新提交绑卡
export const bindCard = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/account/acc-suning-account/bindCard',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取验证码
export const sendSmsVerifyCode = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-suning-account/sendSmsVerifyCode',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取收付通详情信息
export const getSftDetail = (params, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/fundsFors/merchant/sft/getDetail',
		method: 'get',
		params,
		custom,
		dataType: 'json',
	})
}
// 获取收付通详情信息
export const sftAccount = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/fundsFors/merchant/sft/account',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家收付通查询开户状态(我已扫码)
export const sweptCodeState = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/fundsFors/merchant/sft/account/state',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 苏宁提现账户商家
export const listPageBySupplier = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/listPageBySupplier',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//店主结算明细列表
export const listPageOrderSettleItem = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/organizationOrderSettle/listPageOrderSettleItem',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询店主订单结算列表
export const listPageOrderSettle = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/organizationOrderSettle/listPageOrderSettle',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 店主结算明细的金额
export const organizationSettleCollectAmount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/organizationOrderSettle/organizationSettleCollectAmount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台奖励结算明细
export const oredrListManagerSettleItem = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/organizationOrderManageSettleItem/listManagerSettleItem',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台任务记录列表查询
export const organizationPlatformTaskRecord = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-shopkeeper-upms/organizationPlatformTaskRecord/pageList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台任务记录列表-设置状态
export const saveOrUpdatePlatformTaskRecord = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-shopkeeper-upms/organizationPlatformTaskRecord/saveOrUpdatePlatformTaskRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台任务记录列表-查看操作记录
export const getOperationListByRecordId = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-shopkeeper-upms/organizationPlatformTaskRecord/getOperationListByRecordId',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 运营账户账户详情
export const accOperationsAccountDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/account/acc-operations-account/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 运营账户流水列表
export const accOperationsAccountList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-operations-account-water/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 运营账户流水金额统计
export const accOperationsAccountAmountSum = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-operations-account-water/amount-sum',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 对公开户（新增开户、二次提交开户）
export const openAccountToPublic = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-suning-account/openAccountToPublic',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 对私开户（新增开户、二次提交开户）
export const openAccountToPrivate = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-suning-account/openAccountToPrivate',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台苏宁提现账户列表
export const listSuningWithdrawAccountPlaform = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/listSuningWithdrawAccountPlaform',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 苏宁提现账户详情
export const getSuningAccountInfo = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/getSuningAccountInfo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 银行卡管理列表
export const listPlaformSuningBankAccount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/listPlaformSuningBankAccount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 银行卡详情
export const getSuningBankAccountInfo = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accSuningOpenAccount/getSuningBankAccountInfo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 商家更换提现账户申请
export const merchantWithdrawa = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/suningAccountChangeApply/listPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 审批
export const examineApprove = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/suningAccountChangeApply/apply',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 修改苏宁提现账户
export const updateOpenAccount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-suning-account/updateOpenAccount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 提交绑卡/重新提交绑卡(v2版本)
export const bindCardV2 = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-suning-account/v2/bindCard',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查看文件信息
export const checkApplyFile = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/suningAccountChangeApply/checkApplyFile',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
