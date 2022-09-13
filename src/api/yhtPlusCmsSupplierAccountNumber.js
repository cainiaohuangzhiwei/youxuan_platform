import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商家----------------------------------------
 */
// 商家账号列表
// export const supplierAccountNumberList = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberList.action',
// 		data,
// 		loadingOptions
// 	)
export const supplierAccountNumberList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 删除商家账号
// export const supplierAccountNumberDelete = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberDelete.action',
// 		data,
// 		loadingOptions
// 	)
export const supplierAccountNumberDelete = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberDelete.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增商家账号
// export const supplierAccountNumberSave = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberSave.action',
// 		data,
// 		loadingOptions
// 	)
export const supplierAccountNumberSave = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberSave.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 其他功能选择商家的查询
export const findSupplierAccountNumberForList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierAccountNumber/findSupplierAccountNumberForList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 打款比例设定查询
export const supplierAccountNumberDownPaymentList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberDownPaymentList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 打款比例设定编辑
export const updateSupplierDownPayment = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierAccountNumber/updateSupplierDownPayment.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 余额明细
export const sPlatformSupplierBalanceRecordList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierBalanceRecord/sPlatformSupplierBalanceRecordList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
