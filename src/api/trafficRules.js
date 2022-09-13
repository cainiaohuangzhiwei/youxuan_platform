import request from '@/utils/interceptor/request'
// 流量规则系统API
// 查询商城场景审核列表【数据平台六期】
export const getRcShopSceneAuditList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopSceneAudit/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//审核商城场景审核信息【数据平台六期】
export const checkAction = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopSceneAudit/audit',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查询商城场景列表【数据平台六期】
export const getRcShopSceneList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopScene/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据ID查询权限账号信息【数据平台六期】
export const getRcAuthAccountById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcAuthAccount/getById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//添加权限账号信息
export const addRcAuthAccount = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcAuthAccount/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//添加权限账号信息
export const updateRcAuthAccountById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcAuthAccount/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查询权限账号列表【数据平台六期】
export const getRcAuthAccountList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcAuthAccount/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据ID删除权限账号信息
export const deleteRcAuthAccountById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcAuthAccount/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
