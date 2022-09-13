import request from '@/utils/interceptor/request'
/*
 * ----------------------------------风控退款处理----------------------------------------
 */
// 风控列表
export const listFillingChannels = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/fillingDispose/listFillingChannels.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 渠道号列表
export const listPayChannels = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/fillingDispose/listPayChannels.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增渠道
export const saveFillingChannels = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/fillingDispose/saveFillingChannels.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除渠道
export const delFillingChannels = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/fillingDispose/delFillingChannels.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 手动触发退款定时器
export const disposeFilling = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/fillingDispose/disposeFilling.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
