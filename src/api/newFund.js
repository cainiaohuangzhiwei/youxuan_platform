import request from '@/utils/interceptor/request'
/*
 * -----------------------------------账户总览---------------------------------------
 *
 */
// 实时余额数据
export const realTimeDataBalance = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/realTimeDataBalance',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 实时余额数据
export const platformRealTimeDataBalance = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/platformRealTimeDataBalance',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通商家账户-收支明细
export const merchantAccountPaymentDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/merchantAccountPaymentDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通基本账户-收支明细
export const baseAccountPaymentDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/baseAccountPaymentDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 收付通运营账户-收支明细
export const marketingAccountPaymentDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/marketingAccountPaymentDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通店主账户-收支明细
export const shopkeeperAccountPaymentDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/shopkeeperAccountPaymentDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 汇聚店主账户-收支明细
export const joinpayAllianceAccountPaymentDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/joinpayAllianceAccountPaymentDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 收付通店主账户-收支明细
export const allianceAccountPaymentDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/allianceAccountPaymentDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 账户类型-收支明细
export const paymentDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/paymentDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 运营账户-垫资记录
export const paymentAdvanceFundDetails = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/paymentAdvanceFundDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通店主账户列表
export const sftShopAccountList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/sftShopAccountList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通店主账户列表-启用或冻结
export const sftShopAccountEnableFreeze = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/sftShopAccountEnableFreeze',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家收付通账户列表
export const accountList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/fundsFors/merchant/sft/account/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 账户余额
export const balancePrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/balancePrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家收付通启用开关-启用
export const sftEnable = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/fundsFors/merchant/sft/enable',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家收付通开户详情
export const getAccountBySupplierId = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/fundsFors/merchant/sft/getAccountBySupplierId',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家收付体现记录
export const sftShopAccountWithdrawalRecordList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/sftShopAccountWithdrawalRecordList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通商家账户-启用或冻结
export const supplierEnableFreeze = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/supplierEnableFreeze',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通商家账户-启用或冻结
export const bankCodes = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/fundsFors/bankCodes',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 基本账户-账户余额
export const baseAccountBalancePrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/baseAccountBalancePrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 运营账户-账户余额
export const marketingAccountBalancePrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/marketingAccountBalancePrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 收付通店主联盟账户-账户余额
export const allianceAccountBalancePrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/allianceAccountBalancePrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 汇聚店主联盟账户-账户余额
export const joinpayAllianceAccountBalancePrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/joinpayAllianceAccountBalancePrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 商家账户-账户余额
export const merchantAccountBalancePrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/merchantAccountBalancePrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 店主账户-账户余额
export const shopkeeperAccountBalancePrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/accountOverview/shopkeeperAccountBalancePrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查询收付通账户列表
export const getSftListPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/fundsFors/merchant/sft/listPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 发起同步复制（苏宁账户到收付通账户）
export const launchSyncCopy = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/fundsFors/merchant/sft/launchSyncCopy',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
