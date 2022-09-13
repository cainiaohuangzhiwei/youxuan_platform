import request from '@/utils/interceptor/request'
/*
 * -----------------------------------脚本----------------------------------------
 */
// 平台订单
// export const getPlatformUserList = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/platformUser/getPlatformUserList.action',
// 		data,
// 		loadingOptions
// 	)
export const getPlatformUserList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformUser/getPlatformUserList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 删除平台账号
// export const deletePlatformUserById = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/platformUser/deletePlatformUserById.action',
// 		data,
// 		loadingOptions
// 	)
export const deletePlatformUserById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformUser/deletePlatformUserById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑第三方平台账号
// export const updatePlatformUserById = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/platformUser/updatePlatformUserById.action',
// 		data,
// 		loadingOptions
// 	)
export const updatePlatformUserById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformUser/updatePlatformUserById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 新增平台账号信息
// export const addPlatformUser = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/platformUser/addPlatformUser.action',
// 		data,
// 		loadingOptions
// 	)
export const addPlatformUser = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/platformUser/addPlatformUser.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
