import request from '@/utils/interceptor/request'
/*
 * -----------------------------------   ----------------------------------------
 */
// 邀请码-注册码-获取基础设置
export const getRegisterCode = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsRegisterCode/getRegisterCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//邀请码-注册码-基础设置
export const addRegisterCode = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsRegisterCode/addRegisterCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
