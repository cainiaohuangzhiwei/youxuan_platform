import request from '@/utils/interceptor/request'
/*
 * -----------------------------------新店主首单专区----------------------------------------
 */
// 列表
export const getFirstOrderZonePage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/firstOrderZone/getFirstOrderZonePage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 分组列表
export const getGoodsGroupList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/firstOrderZone/getGoodsGroupList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑
export const updateFirstOrderZoneSort = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/firstOrderZone/updateFirstOrderZoneSort.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//新增
export const addFirstOrderZone = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/firstOrderZone/addFirstOrderZone.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//批量新增
export const batchAddFirstOrderZone = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/firstOrderZone/batchAddFirstOrderZone.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//移出专区
export const updateFirstOrderZoneState = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/firstOrderZone/updateFirstOrderZoneState.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
