import request from '@/utils/interceptor/request'
/*
 * -----------------------------------APPbanner----------------------------------------
 */
// 列表
export const selectList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppBanner/selectList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑
export const updateAppBanner = (data, formData = true) => {
	let requestData = {
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/cmsAppBanner/updateAppBanner.action`,
		method: 'post',
		data,
		custom: {},
	}
	if (formData) {
		requestData.dataType = 'form'
	}
	return request.request(requestData)
}
//新增
export const saveAppBanner = (data, formData = true) => {
	let requestData = {
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/cmsAppBanner/saveAppBanner.action`,
		method: 'post',
		data,
		custom: {},
	}
	if (formData) {
		requestData.dataType = 'form'
	}
	return request.request(requestData)
}
