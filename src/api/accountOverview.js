import request from '@/utils/interceptor/request'
// 退款流水明细
export const refundRetails = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-funds-rest-fors/accountOverview/refundRetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 订单结算明细
export const orderSettlementDetails = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-funds-rest-fors/accountOverview/orderSettlementDetails',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 订单待结算流水明细
export const orderPendingSettlementFlowAccount = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-funds-rest-fors/accountOverview/orderPendingSettlementFlowAccount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 店主提现流水明细
export const sftShopSettlementFlowAccount = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-funds-rest-fors/accountOverview/sftShopSettlementFlowAccount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 店主提现流水明细-查看详情
export const sftShopSettlementFlowAccountDetail = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-funds-rest-fors/accountOverview/sftShopSettlementFlowAccountDetail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
