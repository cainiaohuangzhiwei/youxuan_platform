import request from '@/utils/interceptor/request'
// 商家违规白名单列表
export const getViolationWhitelist = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/violationWhitelist/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 商家违规白名单启用
export const violationWhitelistEnable = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/violationWhitelist/enable',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
