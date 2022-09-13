//
// import request from '@/utils/interceptor/request'
// /*
//  * -----------------------------------仓库汇总----------------------------------------
//  */
// // 仓库列表汇总
// // export const findAllLogisticsByParams = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusWareHouseWork/findAllLogisticsByParams.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const findAllLogisticsByParams = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusWareHouseWork/findAllLogisticsByParams.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
