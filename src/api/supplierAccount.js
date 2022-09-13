import request from '@/utils/interceptor/request'
/*
 * -----------------------------------资金/商家账户列表----------------------------------------
 */
// 商家账户列表
export const supplierQueryAccountList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/supplierAccount/supplierQueryAccountList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 商家账户冻结/解冻
export const supplierFrozenAccount = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/supplierAccount/supplierFrozenAccount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 商家账户详情
export const supplierQueryAccountDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/supplierAccount/supplierQueryAccountDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 商家余额变动列表
export const supplierBalanceChangeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/supplierAccount/supplierBalanceChangeList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 商家账户提现页面
export const supplierWithdrawView = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/supplierAccount/supplierWithdrawView.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
