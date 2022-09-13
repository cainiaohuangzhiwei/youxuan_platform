import request from '@/utils/interceptor/requestAct'

// 获取鲁班直播页面列表
export const getActServerPagesList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-luban-rest-fors/actPages/queryActPagesList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取鲁班直播页面详情
export const getActServerPagesInfo = (params, custom = {}) => {
	return request.request({
		url: '/weeget-genius-luban-rest-fors/actPages/getById',
		method: 'get',
		params,
		custom,
		dataType: 'json',
	})
}
