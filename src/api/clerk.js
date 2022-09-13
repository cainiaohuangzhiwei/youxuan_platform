import request from '@/utils/interceptor/request'
/*
 * -----------------------------------员工----------------------------------------
 */
// 员工列表
// export const getClerkListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/clerk/getClerkListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const getClerkListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/clerk/getClerkListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// export const batchOperateClerkList = (data, loadingOptions) =>
// 	http.form('/yhtplus/clerk/batchOperateClerkList.action', data, loadingOptions)

// export const simulationSupplierByUserId = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/clerk/simulationSupplierByUserId.action',
// 		data,
// 		loadingOptions
// 	)
//禁用/启用S端账户
export const batchOperateClerkList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/clerk/batchOperateClerkList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//禁用/启用商家账户
export const updateSupplierClerkState = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsSupplierSetting/updateSupplierClerkState.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商家模拟账号
export const simulationSupplierByUserId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/clerk/simulationSupplierByUserId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 获取商家详情
// export const getClerkDetailByClerkId = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/clerk/getClerkDetailByClerkId.action',
// 		data,
// 		loadingOptions
// 	)
export const getClerkDetailByClerkId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/clerk/getClerkDetailByClerkId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//商家编辑员工
export const updateSupplierByUserId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/clerk/updateSupplierByUserId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//新增员工
export const addClerk = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/clerk/addClerk.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//编辑员工
export const updateClerkByClerkId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/clerk/updateClerkByClerkId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
