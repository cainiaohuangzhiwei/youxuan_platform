import request from '@/utils/interceptor/request'
/*
 * -----------------------------------仓库----------------------------------------
 */
// 获取仓库列表
// export const getWarehouseList = (data, loadingOptions) =>
// 	http.form('/yhtplus/warehouse/getWarehouseList.action', data, loadingOptions)
export const getWarehouseList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/warehouse/getWarehouseList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑仓库列表
export const updateWarehouseByWarehouseId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/warehouse/updateWarehouseByWarehouseId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
