import request from '@/utils/interceptor/request'

// 默认渠道查询列表
export const listAppChannel = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppChannel/listAppChannel.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 增加渠道
export const saveAppChannel = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppChannel/saveAppChannel.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 渠道查询
export const getAppVersionPage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppVersion/getAppVersionPage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 渠道删除
export const delAppVersion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppVersion/delAppVersion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 渠道编辑
export const updateAppVersion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppVersion/updateAppVersion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
export const addAppVersion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppVersion/addAppVersion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
