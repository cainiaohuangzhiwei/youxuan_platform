import request from '@/utils/interceptor/request'

// 在线客服列表
export const findCsListByParam = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cs/findCsListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑在线客服
export const saveOrUpdateCs = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cs/saveOrUpdateCs.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 在线客服禁用启用
export const changeStatusCs = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cs/changeStatusCs.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
