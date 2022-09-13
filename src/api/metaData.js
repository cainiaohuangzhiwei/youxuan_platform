import request from '@/utils/interceptor/request'
// 排序算法管理列表
export const sortQueryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortPool/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const sortAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortPool/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const sortUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortPool/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const sortDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortPool/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 字段列表
export const sortParamList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcParamPool/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 召回管理列表
export const recallQueryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallPool/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const recallAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallPool/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const recallUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallPool/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const recallDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallPool/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 数据源管理列表
export const dataSourceQueryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSourcePool/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const dataSourceAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSourcePool/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const dataSourceUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSourcePool/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const dataSourceDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSourcePool/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 场景管理列表
export const sceneQueryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopScene/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const sceneQueryGetById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopScene/getById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const sceneAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopScene/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const sceneUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopScene/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const sceneDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopScene/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 修改搜索池信息
export const searchUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchPool/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询搜索池列表
export const searchQueryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchPool/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 添加搜索池信息
export const searchAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchPool/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 删除搜索池信息
export const searchDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchPool/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 流量分发管理
export const trafficGetOne = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcFlowHandle/getOne',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新增或编辑流量分发管理
export const trafficSaveOrUpdate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcFlowHandle/saveOrUpdate',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
