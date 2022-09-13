import request from '@/utils/interceptor/request'

// 订单是否存在售后
export const orderDeliverConfirmChecking = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/weiXinOrder/orderDeliverConfirmChecking.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 订单确认收货相关api重构开关接口
export const getDeliverConfirmSwitch = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-order-rest/order/switch/getDeliverConfirmSwitch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const oOrderDeliverConfirm = (data = {}, custom = {}) => {
	return request.request({
		url: '/yhtplus/weiXinOrder/sOrderDeliverConfirm.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 订单确认收货
export const sOrderDeliverConfirm = async (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-order-rest/order/deliver/confirm',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
