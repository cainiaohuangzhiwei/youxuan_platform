import request from '@/utils/interceptor/request'
/*
 * -----------------------------------脚本----------------------------------------
 */
// 获取品牌预告信息
// export const getBrandReadyListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsMasterControl/getBrandReadyListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const getBrandReadyListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsMasterControl/getBrandReadyListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 取消预先爬取
// export const updateBrandReadyListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsMasterControl/updateBrandReadyListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const updateBrandReadyListByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsMasterControl/updateBrandReadyListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取品牌信息
// export const getBrandRecordListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsMasterControl/getBrandRecordListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const getBrandRecordListByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsMasterControl/getBrandRecordListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
