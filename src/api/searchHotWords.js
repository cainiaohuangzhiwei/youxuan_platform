import request from '@/utils/interceptor/request'

// 热词列表查询接口
export const getSearchHotWordsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/searchHotWords/queryList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 热词列表删除
export const deleteSearchHotWord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/searchHotWords/deleteById.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 热词列表保存、编辑
export const saveSearchHotWord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/searchHotWords/saveOrUpdate.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 热词列表详情
export const getSearchHotWordDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/searchHotWords/getDetail.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
