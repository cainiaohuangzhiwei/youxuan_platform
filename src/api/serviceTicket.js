import request from '@/utils/interceptor/request'
// 工单管理查询列表
export const ticketList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/serviceTicket/ticketList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 工单管理流转商家
export const ticketExchange = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/serviceTicket/ticketExchange.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 工单完结
export const ticketFinish = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/serviceTicket/ticketFinish.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 工单详情
export const ticketDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/serviceTicket/ticketDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 回复信息
export const ticketReply = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/serviceTicket/ticketReply.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
