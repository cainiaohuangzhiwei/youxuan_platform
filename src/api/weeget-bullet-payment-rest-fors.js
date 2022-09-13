import fetchWithSign from '@/utils/interceptor/requestAct'
// 苏宁账户转账记录
export const transferInfoQuery = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/transfer-info/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 发起转账
export const transferInfoCreate = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/transfer-info/create',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查找账户
export const accountQuery = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/account/query',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 统计资金看板列表
export const summaryList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-payment-rest-fors/fund-summary/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 实时资金看板列表
export const realTimeList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/account/balance',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据通道更新报表
export const updateSummaryByCode = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/fund-summary/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询提现记录
export const withdrawPage = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/withdraw/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 提现账号银行记录
export const withdrawPageBank = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/withdraw/pageBank',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 发起提现
export const withdrawCreate = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-payment-rest-fors/withdraw/create',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
