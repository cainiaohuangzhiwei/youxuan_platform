import fetchWithSign from '@/utils/interceptor/requestAct'
// 刷新缓存
export const refreshCache = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/pay-route/refresh-cache',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 修改状态
export const modifyState = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/pay-route/modify-state',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 修改权重
export const modifyWeight = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/pay-route/modify-weight',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 分页查询
export const payRouteList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/pay-route/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询全部支付通道账户列表
export const listMerchantFundBalance = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/account-fund/list-merchant-fund-balance',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 分页查询账户调整记录
export const accountAdjustmentPage = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/account-adjustment/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 保存账户调账记录
export const accountAdjustmentSave = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/account-adjustment/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询银行地区编码
export const bankAddressCode = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/account/bank-address-code',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询支付通道明细统计
export const channelTradeStatisticalQuery = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest/channel-trade-statistical/query',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
