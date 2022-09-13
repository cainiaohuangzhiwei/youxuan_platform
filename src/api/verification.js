import request from '@/utils/interceptor/request'

// 获取验证码列表
export const getVerifyCodeList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsUser/getVerifyCodeListByCondition.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
