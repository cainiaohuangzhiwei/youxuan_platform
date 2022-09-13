import request from '@/utils/interceptor/request'
/*
 * -----------------------------------邀请码-注册码----------------------------------------
 */
// 邀请码-注册码-获取海报
export const getPoster = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsRegisterCodePoster/getPoster.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})
//邀请码-注册码-新增海报
export const addPoster = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsRegisterCodePoster/addPoster.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})
//邀请码-注册码-编辑海报
export const editPoster = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsRegisterCodePoster/editPoster.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})
//邀请码-注册码-删除海报
export const deletePoster = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsRegisterCodePoster/deletePoster.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})
