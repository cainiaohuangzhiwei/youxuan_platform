import fetchWithSign from '@/utils/interceptor/requestSignature'
import request from '@/utils/interceptor/request'
// 商家收付通开户列表
export const list = (params, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-funds-rest-fors/fundsFors/merchant/sft/sign/list',
		method: 'get',
		params,
		custom,
	})
}
// 商家收付通打开开户开关
export const switchOnOff = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-funds-rest-fors/fundsFors/merchant/sft/switch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
