import request from '@/utils/interceptor/request'

// 直播计划列表
export const getChildShopList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-backend-fors-rest/ka/getChildShopList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 业务组员工配置列表
export const queryListByPage = (data, custom = {}) => {
	return request.request({
		url: 'weeget-bullet-shopkeeper-upms/businessGroupClerk/queryListByPage',
		method: 'post',
		data,
		custom,
	})
}
// 新增业务组员工配置
export const addBusinessGroupClerk = (data, custom = {}) => {
	return request.request({
		url: 'weeget-bullet-shopkeeper-upms/businessGroupClerk/add',
		method: 'post',
		data,
		custom,
	})
}
// 删除业务组员工配置
export const deleteBusinessGroupClerk = (data, custom = {}) => {
	return request.request({
		url: 'weeget-bullet-shopkeeper-upms/businessGroupClerk/delete',
		method: 'post',
		data,
		custom,
	})
}
// 获取组别下拉列表
export const queryDownList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-bullet-shopkeeper-upms/businessGroupClerk/queryDownList',
		method: 'post',
		data,
		custom,
	})
}
// 查询ka看板列表
export const getKaBoardPage = (data, custom = {}) => {
	return request.request({
		url: 'weeget-bullet-shopkeeper-upms/kaBoard/getKaBoardPage',
		method: 'post',
		data,
		custom,
	})
}
// 查看店主信息
export const getLastMonthOrganization = (data, custom = {}) => {
	return request.request({
		url: 'weeget-bullet-shopkeeper-upms/kaBoard/getLastMonthOrganization',
		method: 'post',
		data,
		custom,
	})
}
