import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 根据父级ID获取子地区
export const getAreaListByParentId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/area/getAreaListByParentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 根据父级ID获取所有子地区的树状结构
export const getAreaTreeListByParentId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/area/getAreaTreeListByParentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取地区列表(树结构)
export const getAreaList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/area/getAreaList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 编辑地区
export const updateAreaByAreaId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/area/updateAreaByAreaId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增地区
export const addArea = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/area/addArea.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 删除地区
export const deleteAreaByAreaId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/area/deleteAreaByAreaId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
