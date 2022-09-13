import request from '@/utils/interceptor/request'
//我方授权列表
export const getErpList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/YhtPlusCmsErpAction/getErpList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//对方授权列表
export const projectList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/accessSetting/projectList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//新增erp
export const addErp = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/YhtPlusCmsErpAction/addErp.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//对方授权新增erp
export const projectAdd = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/accessSetting/projectAdd.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//禁用启用erp
export const projectStatusUpdate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/accessSetting/projectStatusUpdate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//编辑对方erp
export const projectUpdate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/accessSetting/projectUpdate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
