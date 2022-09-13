import request from '@/utils/interceptor/request'
/*
 * -----------------------------------公共----------------------------------------
 */
// 发送短信验证码
// export const sendVerifyCode = (data, loadingOptions) =>
// 	http.form('/yhtplus/verifyCode/sendVerifyCode.action', data, loadingOptions)
// export const sendVerifyCode = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/verifyCode/sendVerifyCode.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// }

// 校验短信验证码
// export const checkVerifyCode = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/verifyCode/checkVerifyCodeNew.action',
// 		data,
// 		loadingOptions
// 	)
export const checkVerifyCode = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/verifyCode/checkVerifyCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 根据父级ID获取子地区
// export const getAreaListByParentId = (data, loadingOptions) =>
// 	http.form('/yhtplus/area/getAreaListByParentId.action', data, loadingOptions)
export const getAreaListByParentId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/area/getAreaListByParentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 获取地区列表(树结构)
// export const getAreaList = (data, loadingOptions) =>
// 	http.form('/yhtplus/area/getAreaList.action', data, loadingOptions)
// export const getAreaList = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/area/getAreaList.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// }

// 根据地区ID获取父地区列表(层叠嵌套)
// export const getParentAreaListByAreaId = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/area/getParentAreaListByAreaId.action',
// 		data,
// 		loadingOptions
// 	)
export const getParentAreaListByAreaId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/area/getParentAreaListByAreaId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取物流列表
// export const getExpressList = (data, loadingOptions) =>
// 	http.form('/yhtplus/express/getExpressList.action', data, loadingOptions)
export const getExpressList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/express/getExpressList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 微信url scheme
export const schemeLink = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/marketing/link/generate',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
