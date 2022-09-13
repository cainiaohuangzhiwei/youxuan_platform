import request from '@/utils/interceptor/request'

// MCN机构列表
export const getMcnList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveMcnControl/getMcnList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 添加Mcn
export const addMcn = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveMcnControl/addMcn.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 编辑Mcn
export const editMcn = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveMcnControl/editMcn.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
