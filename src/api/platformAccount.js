import request from '@/utils/interceptor/request'
/*
 * -----------------------------------平台账户---------------------------------------
 *
 */
// 平台账户列表
export const platformQueryAccountList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformQueryAccountList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 微革账户详情
export const platformWeegetAccountDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformWeegetAccountDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 微革账户余额变动列表
export const platformWeegetBalanceChangeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformWeegetBalanceChangeList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 营销账户详情
export const platformMarketingAccountDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformMarketingAccountDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 营销账户余额变动列表
export const platformMarketingBalanceChangeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformMarketingBalanceChangeList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 平台账户转账页面,账户列表
export const platformAccountTransferView = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformAccountTransferView.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 平台账户转账
export const platformAccountTransfer = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformAccountTransfer.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 平台账户转账至店主账户
export const platformAccountTransferOrganization = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformAccountTransferOrganization.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 平台账户提现页面
export const platformWithdrawView = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/platformWithdrawView.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 营销账户调账
export const marketingAccountRegulation = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformAccount/marketingAccountRegulation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
