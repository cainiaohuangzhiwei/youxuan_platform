import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 新增孵化活动
export const addHatching = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/actHatching/addHatching.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 孵化活动列表
export const hatchingList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/actHatching/hatchingList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 孵化活动报名列表
export const findHatchingEnteredList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/actHatching/findHatchingEnteredList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 孵化活动配置详情
export const findHatchingDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/actHatching/findHatchingDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
