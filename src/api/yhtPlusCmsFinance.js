import request from '@/utils/interceptor/request'
/*
 * -----------------------------------老财务----------------------------------------
 */
// 首页明细统计
export const getFinanceStatisticsInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getFinanceStatisticsInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取提现明细列表
export const getWithdrawListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getWithdrawListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取充值明细列表
export const findRechargeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/findRechargeListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 支付查询
export const getPayMentSnAndOrderSn = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getPayMentSnAndOrderSn.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增充值明细记录
export const addRechargeRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/addRechargeRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取银行列表
export const getBankList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/weiXinUser/getBankList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取银行账户列表
export const getBankAccountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getBankAccountListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 编辑银行账户的操作记录
export const findBankAccountRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/findBankAccountRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 银行卡记录列表
export const getFlowBankRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getFlowBankRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 添加充值或者提现记录等
export const addFlowBankRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/addFlowBankRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 更新银行卡余额等信息
export const updateBankUsableAmount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/updateBankUsableAmount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 编辑银行账户
export const updateBankAccount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/updateBankAccount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 获取订单交易记录
export const getFlowOrderListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getFlowOrderListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出订单交易记录
export const exportFlowOrderListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportFlowOrderListByCondition.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
// 获取订单流水记录接口
export const getFlowDetailListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getFlowDetailListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 店主提现明细列表
export const getWithdrawList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getWithdrawList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 店主提现明细列表（搜索条件）
export const getWithdrawListByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getWithdrawListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 提现明细详情
export const getWithdrawItem = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getWithdrawItem.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 商家提现业务列表
export const getMerchantAccountWithdrawList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getMerchantAccountWithdrawList.action',
		method: 'post',
		data,
		custom,
	})

// 商家提现业务列表导出
export const merchantWithdrawExport = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/supplierImport/merchantWithdrawExport.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})

// 商家提现金额/手术费接口
export const sumMerchantAccountWithdraw = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/sumMerchantAccountWithdraw.action',
		method: 'post',
		data,
		custom,
	})
// 平台提现业务列表
export const getPlatformAccountWithdrawList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getPlatformAccountWithdrawList.action',
		method: 'post',
		data,
		custom,
	})
// 平台提现金额/手术费接口
export const sumPlatformAccountWithdraw = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/sumPlatformAccountWithdraw.action',
		method: 'post',
		data,
		custom,
	})
// 发起提现
export const doPlatformWithdraw = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/doPlatformWithdraw.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 校验财务密码
export const checkFinancePassWord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/checkFinancePassWord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 根据提现类型查询对应账号余额
export const findRemainderByType = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/findRemainderByType.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 添加一条提现流水
export const doWithdraw = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/doWithdraw.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出提现明细列表
export const exportWithdrawListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportWithdrawListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
// 商家提现审批列表
export const supplierWithdrawAuditList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsFinance/supplierWithdrawAuditList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 商家提现审批操作
export const auditSupplierWithdrawApply = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/auditSupplierWithdrawApply.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取商家银行信息
export const getBankAccountInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getBankAccountInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取优惠券扣减明细列表
export const getCouponAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getCouponAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出优惠券扣减明细列表
export const exportCouponAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportCouponAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 权益保障收入
export const getEquityIncomeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getEquityIncomeListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 权益赔付费用
export const getEquityPayListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getEquityPayListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取上级店铺返佣明细列表
export const getCommissionChargeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getCommissionChargeListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出上级返佣明细列表
export const exportCommissionChargeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportCommissionChargeListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 获取订单收入总额明细
export const getOrderAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getOrderAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出订单收入总额明细
export const exportOrderAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportOrderAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 获取邀请码金额明细列表
export const getInviteCodeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getInviteCodeListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出邀请码金额明细列表
export const exportInviteCodeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportInviteCodeListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 获取返退金额明细列表
export const getRefundAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getRefundAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出返退金额明细列表
export const exportRefundAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportRefundAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 获取商家成本明细列表
export const getPlatformAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getPlatformAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出商家成本明细列表
export const exportPlatformAmountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportPlatformAmountListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 获取商家补贴记录
export const getPlatformRewardListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getPlatformRewardListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增商家补贴记录
export const addPlatformReward = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/addPlatformReward.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出商家补贴记录
export const exportPlatformRewardListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportPlatformRewardListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 获取活动返现记录
export const findFlowOrganizationBouns = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/findFlowOrganizationBouns.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出优惠券扣减明细列表
export const exportFlowOrganizationBouns = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/exportFlowOrganizationBouns.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 新增活动返现记录
export const addActiveBonus = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/addActiveBonus.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 查询提现开关
export const withdrawSwitch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-payment-rest/switch/query',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 提现查询
export const singleWithdrawCompenstate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/singleWithdrawCompenstate.action',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 余额查询
export const getWithdrawBalance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFinance/getWithdrawBalance.action',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
