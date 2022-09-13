import request from '@/utils/interceptor/request'
/*
 * -----------------------------------用户----------------------------------------
 */
// 获取用于RSA加密的模和公钥指数
// export const getPublicKeyAndModel = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webUser/getPublicKeyAndModel.action',
// 		data,
// 		loadingOptions
// 	)
export const getPublicKeyAndModel = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/getPublicKeyAndModel.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 使用帐号密码登录
// export const aPLogin = (data, loadingOptions) =>
// 	http.form('/yhtplus/webUser/aPLogin.action', data, loadingOptions)
export const aPLogin = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/aPLoginForOtp.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 退出登录
// export const exitLogin = (data, loadingOptions) =>
// 	http.form('/yhtplus/webUser/exitLogin.action', data, loadingOptions)
export const exitLogin = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/exitLogin.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取手机验证码
export const sendVerifyCodeByPhone = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/verifyCode/sendVerifyCodeByPhone.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 获取手机验证码（针对MFA新增的）
export const sendVerifyCodeForUpdateMobile = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/verifyCode/sendVerifyCodeForUpdateMobile.action',
		method: 'post',
		data,
		custom,
	})

// 首次登录绑定手机号并获取MFA二维码
export const firstLogin = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/modifyMobile/firstLogin.action',
		method: 'post',
		data,
		custom,
	})

// 更新绑定的手机
export const modifyMobile = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/modifyMobile.action',
		method: 'post',
		data,
		custom,
	})

// 重置当前账号MFA
export const resetOtpSecretKeyOwn = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/resetOtpSecretKeyOwn.action',
		method: 'post',
		data,
		custom,
	})

// 查看MFA密钥二维码
export const queryMFAQrCode = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/queryMFAQrCode.action',
		method: 'post',
		data,
		custom,
	})

// 重置他人MFA
export const resetOtpSecretKey = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/resetOtpSecretKeyOther.action',
		method: 'post',
		data,
		custom,
	})
// 绑定手机号
export const bindPhone = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/bindPhone.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取用户详情
// export const getUserDetail = (data, loadingOptions) =>
// 	http.form('/yhtplus/webUser/getUserDetail.action', data, loadingOptions)
export const getUserDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/getUserDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 根据用户ID获取权限列表
// export const getFunctionListByUserId = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/privilege/getFunctionListByUserId.action',
// 		data,
// 		loadingOptions
// 	)
export const getFunctionListByUserId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/privilege/getFunctionListByUserId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 清除缓存
// export const removeGoodsRedis = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusWebGoods/removeGoodsRedis.action',
// 		data,
// 		loadingOptions
// 	)
export const removeGoodsRedis = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/removeGoodsRedis.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//获取角色权限列表
// export const getRoleList = (data, loadingOptions) =>
// 	http.form('/yhtplus/privilege/getRoleList.action', data, loadingOptions)
export const getRoleList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/privilege/getRoleList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 登陆密码是否过期
export const hasMandatoryModifyPassword = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/hasMandatoryModifyPassword.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 登陆密码是否过期
export const modifyPasswordByOriginalPassword = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webUser/modifyPasswordByOriginalPassword.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//修改密码
export const resetPassword = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-backend-fors-rest/cms/clerk/resetPassword',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取apptoken
export const simulation = (data, custom = {}) =>
	request.request({
		url: '/app/login/simulation',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

//获取流量规则平台账户授权信息
export const getRcAuthAccountByUserId = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcAuthAccount/getByUserId',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
