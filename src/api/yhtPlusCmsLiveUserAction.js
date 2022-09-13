import request from '@/utils/interceptor/request'

// 获取主播列表
export const getAnchor = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveUserAction/getAnchor.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 禁用/启用主播
export const setAnchorState = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveUserAction/setAnchorState.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 添加主播
export const addAnchor = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveUserAction/addUser.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 编辑主播
export const editUser = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveUserAction/editUser.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
