import request from '@/utils/interceptor/request'
// 查询用户运营属性分类列表
export const queryUoAttributeClassifyBatch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttributeClassify/queryUoAttributeClassifyBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 查询可见用户运营属性分类列表
export const queryVisibleUoAttributeClassifyBatch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttributeClassify/queryVisibleUoAttributeClassifyBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 添加用户运营属性分类信息
export const saveUoAttributeClassify = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttributeClassify/saveUoAttributeClassify',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 添加用户运营属性信息
export const saveUoAttribute = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/saveUoAttribute',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 查询用户运营字典列表
export const queryUoOptionKeyBatch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoOptionKey/queryUoOptionKeyBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 添加用户运营字典信息
export const saveUoOptionKey = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoOptionKey/saveUoOptionKey',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 根据ID修改用户运营字典信息
export const updateUoOptionKey = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoOptionKey/updateUoOptionKey',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 根据ID修改用户运营属性信息
export const updateUoAttribute = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/updateUoAttribute',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 根据ID修改用户运营属性可见状态
export const updateVisibleStatus = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/updateVisibleStatus',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 查询用户运营属性列表
export const queryUoAttributeBatch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/queryUoAttributeBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 修改用户运营属性分类可见状态
export const updateAttributeClassifyVisibleType = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttributeClassify/updateAttributeClassifyVisibleType',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 根据ID修改用户运营属性分类信息
export const updateUoAttributeClassify = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttributeClassify/updateUoAttributeClassify',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 查询单个运营策略信息
export const getUoAttribute = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/getUoAttribute',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 查询可见用户运营属性列表
export const queryVisibleUoAttributeBatch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/queryVisibleUoAttributeBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 根据属性id查询关联类型列表
export const queryCorrelationTypeBatch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/queryCorrelationTypeBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 根据属性id查询关联类型列表
export const queryAttributeDictionariesBatch = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-user-operation-rest/uoAttribute/queryAttributeDictionariesBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
