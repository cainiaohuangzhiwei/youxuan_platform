import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商城管理----------------------------------------
 */
// 查询功能区表
// export const functionalAreaList = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaList.action',
// 		data,
// 		loadingOptions
// 	)
export const functionalAreaList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增功能区记录
// export const functionalAreaSave = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaSave.action',
// 		data,
// 		loadingOptions
// 	)
export const functionalAreaSave = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaSave.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 修改功能区记录
// export const functionalAreaUpdate = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaUpdate.action',
// 		data,
// 		loadingOptions
// 	)
export const functionalAreaUpdate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaUpdate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 删除功能区记录
// export const functionalAreaDelete = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaDelete.action',
// 		data,
// 		loadingOptions
// 	)
export const functionalAreaDelete = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsFunctionalArea/functionalAreaDelete.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
