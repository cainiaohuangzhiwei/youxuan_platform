import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商品----------------------------------------
 */
// 根据输入条件获取仓库商品规格列表
// export const getWarehouseSpecListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webGoods/getWarehouseSpecListByCondition.action',
// 		data,
// 		loadingOptions
// 	)

//出入库操作详情
export const getStockUpdateListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webGoods/getStockUpdateListByCondition.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
//出入库操作
export const inventoryOperate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webGoods/inventoryOperate.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
export const getWarehouseSpecListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webGoods/getWarehouseSpecListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 根据输入条件获取仓库商品规格列表
// export const findWarehouseSpecListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webGoods/findWarehouseSpecListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const findWarehouseSpecListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webGoods/findWarehouseSpecListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 根据条件获取库存操作列表
// export const getInventoryChangeListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webGoods/getInventoryChangeListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const getInventoryChangeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webGoods/getInventoryChangeListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 根据库存操作ID获取库存记录详情
export const getInventoryChangeDetailByInventoryChangeId = (
	data,
	custom = {}
) =>
	request.request({
		url: '/yhtplus/webGoods/getInventoryChangeDetailByInventoryChangeId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 批量删除集团商品规格(上游)
export const batchDeleteGoodsSpec = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webGoods/batchDeleteGoodsSpec.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

export const generateWarehouseSpecByWarehouseId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webGoods/generateWarehouseSpecByWarehouseId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
