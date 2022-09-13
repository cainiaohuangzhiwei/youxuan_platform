import request from '@/utils/interceptor/request'

// 活动氛围-分页列表
export const pageQuery = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/act-atmosphere/pageQuery',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动氛围-插入
export const addActivityAmbient = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/marketing/act-atmosphere/insert',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动氛围-更新记录
export const updateActivityAmbient = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/marketing/act-atmosphere/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动氛围-结束操作
export const finishOperation = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/act-atmosphere/finishOperation',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
