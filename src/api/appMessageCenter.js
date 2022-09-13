import request from '@/utils/interceptor/request'
/*
 * ----------------------------------c端app消息中心----------------------------------------
 */
//新增消息
export const messageAdd = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/api/cms/app-message/add.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//消息列表
export const messageList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/api/cms/app-message/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//更新消息
export const messageUpdate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/api/cms/app-message/update.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//获取消息详情
export const messageGet = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/api/cms/app-message/get.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//删除消息
export const messageDel = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/api/cms/app-message/del.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
