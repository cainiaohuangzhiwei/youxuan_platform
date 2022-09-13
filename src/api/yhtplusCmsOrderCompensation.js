//
import request from '@/utils/interceptor/request'
// /*
//  * -----------------------------------售后----------------------------------------
//  */
// //新增补款补偿记录
export const addOrderCompensation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtplusCmsOrderCompensation/addOrderCompensation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// //新增汇聚补款补偿记录
export const addOrderCompensationHJ = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtplusCmsOrderCompensation/addOrderCompensationHJ.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// //查询待补偿记录
export const findAllCompensation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtplusCmsOrderCompensation/findAllCompensation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// //关闭售后订单接口
// // export const closeAfterSales = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtplusCmsOrderCompensation/closeAfterSales.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const closeAfterSales = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtplusCmsOrderCompensation/closeAfterSales.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// //删除补款补偿记录
export const deleteCompensationAmount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtplusCmsOrderCompensation/deleteCompensationAmount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// //派发补款
export const batchDistributeCompensationAmount = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtplusCmsOrderCompensation/batchDistributeCompensationAmount.action ',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// //导出补款补偿记录
export const exportCompensationAmount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtplusCmsOrderCompensation/exportCompensationAmount.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
// //删除汇聚补款
export const deleteCompensationAmountHJ = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtplusCmsOrderCompensation/deleteCompensationAmountHJ.action ',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// /派发/汇聚待补款金额
export const batchDistributeCompensationAmountHJ = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtplusCmsOrderCompensation/batchDistributeCompensationAmountHJ.action ',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// //汇聚待补款金额
export const findCompensationHJ = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtplusCmsOrderCompensation/findCompensationHJ.action ',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
