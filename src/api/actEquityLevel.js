import fetchWithSign from '@/utils/interceptor/request'
// ----------权益发放------------
// 添加权益等级活动信息
export const addActivityConfiguration = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevel/add',
		method: 'post',
		data,
		custom,
	})
}
// 根据ID删除权益等级活动信息
export const deleteActivityById = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevel/deleteById',
		method: 'post',
		data,
		custom,
	})
}
// 查询权益等级活动列表
export const queryActivityList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevel/queryList',
		method: 'post',
		data,
		custom,
	})
}
// 根据ID修改权益等级活动信息
export const updateActivityById = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/actEquityLevel/updateById',
		method: 'post',
		data,
		custom,
	})
}
