import request from '@/utils/interceptor/request'

// 功能区列表
export const functionalAreaList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
}

// 新增功能区记录
export const functionalAreaSave = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaSave.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
}

// 修改功能区记录
export const functionalAreaUpdate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaUpdate.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 删除功能区记录
export const functionalAreaDelete = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaDelete.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
}
