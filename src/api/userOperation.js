import request from '@/utils/interceptor/request'

/**
 * ****************************  策略分群相关接口  ****************************
 */

// 查询用户运营策略分组列表
export const queryStrategyGroupBatch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategyGroup/queryStrategyGroupBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据ID删除用户运营策略分组信息
export const removeStrategyGroup = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategyGroup/removeStrategyGroup',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据ID修改用户运营策略分组信息
export const updateStrategyGroup = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategyGroup/updateStrategyGroup',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据ID修改用户运营策略分组信息
export const saveStrategy = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/saveStrategy',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

/**
 * ****************************  策略管理相关接口  ****************************
 */

// 查询用户运营策略列表
export const queryStrategyBatch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/queryStrategyBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据ID删除用户运营策略信息
export const removeStrategy = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/removeStrategy',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据ID修改用户运营策略信息名称
export const updateStrategyName = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/updateStrategyName',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 启用策略
export const enableStrategy = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/enableStrategy',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 禁用策略
export const disableStrategy = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/disableStrategy',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 分页获取人群
export const getUserGroupPageResult = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/getUserGroupPageResult',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 分页获取人群
export const seeConfig = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/seeConfig',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 保存草稿
export const saveDraft = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/saveDraft',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 保存并且校验
export const checkAndSaveStrategy = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/userOperation/strategy/checkAndSaveStrategy',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查看执行情况
export const seeImplementationPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/seeImplementation/seeImplementationPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 执行情况统计维度
export const getImplementationStatistics = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/seeImplementation/getImplementationStatistics',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 执行情况导出
export const exportImplementationExcel = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-operation-rest/seeImplementation/exportImplementationExcel',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
