import request from '@/utils/interceptor/request'

// 取消订单工单列表
export const cancelOrderList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/serviceRecord/cancelOrderList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 更新取消订单工单列表 - 增加备注
export const serviceRecordUpdate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/serviceRecord/update.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
