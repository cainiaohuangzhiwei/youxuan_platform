import request from '@/utils/interceptor/request'
/*
 * -----------------------------------APP---------------------------------------
 */
// 站内消息查询列表
export const getAppMessageList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppMessage/getAppMessageList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除站内消息
export const delCmsAppMessage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppMessage/delCmsAppMessage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增消息
export const addCmsAppMessage = (data, formData = true) => {
	let requestData = {
		// url: '/yhtplus/cmsAppMessage/addCmsAppMessage.action',
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/cmsAppMessage/addCmsAppMessage.action`,
		method: 'post',
		data,
		custom: {},
	}
	if (formData) {
		requestData.dataType = 'form'
	}
	return request.request(requestData)
}
// 回显
export const getCmsAppMessageDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppMessage/getCmsAppMessageDetails.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//编辑消息
export const updateCmsAppMessage = (data, formData = true) => {
	let requestData = {
		url: '/yhtplus/cmsAppMessage/updateCmsAppMessage.action',
		method: 'post',
		data,
		custom: {},
	}
	if (formData) {
		requestData.dataType = 'form'
	}
	return request.request(requestData)
}
