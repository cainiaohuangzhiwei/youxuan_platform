import request from '@/utils/interceptor/request'
/*
 * -----------------------------------店铺列表----------------------------------------
 */
// 获取素材信息列表
export const pageAppMaterial = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppMaterial/pageAppMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 获取素材信息详情
export const getAppMaterial = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppMaterial/getAppMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//上下架
export const setDisable = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppMaterial/setDisable.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//阅读统计
export const getReadStatistical = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppMaterial/getReadStatistical.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//保存
export const saveAppMaterial = (data, formData = true) => {
	let requestData = {
		url: '/yhtplus/cmsAppMaterial/saveAppMaterial.action',
		method: 'post',
		data,
		custom: {},
	}
	if (formData) {
		requestData.dataType = 'form'
	}
	return request.request(requestData)
}
