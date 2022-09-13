import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商家客服---------------------------------------
 *
 */
// 商家客服列表
export const supplierServiceList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusSupplierService/supplierServiceList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 添加商家客服
export const addSupplierService = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusSupplierService/addSupplierService.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑商家客服
export const editSupplierService = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusSupplierService/editSupplierService.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
