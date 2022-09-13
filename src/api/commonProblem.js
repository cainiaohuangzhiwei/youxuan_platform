import request from '@/utils/interceptor/request'
// 常见问题列表
export const commonProblemList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/commonProblem/commonProblemList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 问题分类列表
export const categoryList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/commonProblem/categoryList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 创建问题分类
export const createCategory = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/commonProblem/createCategory.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 更新常见问题分类
export const updateCategory = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/commonProblem/updateCategory.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 查看常见问题详情
export const commonProblemDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/commonProblem/commonProblemDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 创建常见问题
export const createCommonProblem = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/commonProblem/createCommonProblem.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新常见问题
export const updateCommonProblem = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/commonProblem/updateCommonProblem.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
