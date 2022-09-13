import fetchWithSign from '@/utils/interceptor/request'
// ----------权益规则------------
// 添加权益等级规则配置信息
export const addConfiguration = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevelRule/add',
		method: 'post',
		data,
		custom,
	})
}
// 根据ID删除权益等级规则配置信息
export const deleteById = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevelRule/deleteById',
		method: 'post',
		data,
		custom,
	})
}
// 根据ID查询权益等级规则配置信息
export const getById = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevelRule/getById',
		method: 'post',
		data,
		custom,
	})
}
// 根据ID修改权益等级规则配置信息
export const updateById = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevelRule/updateById',
		method: 'post',
		data,
		custom,
	})
}
// 查询权益等级规则配置列表
export const queryList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevelRule/queryList',
		method: 'post',
		data,
		custom,
	})
}
