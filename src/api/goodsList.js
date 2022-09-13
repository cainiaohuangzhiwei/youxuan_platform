import request from '@/utils/interceptor/request'

// 商品列表
export const getYouxuanGoodsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getYouxuanGoodsList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 商品列表属性
export const getGoodsAttributeList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsAttribute/getGoodsAttributeList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 商品货号搜索
export const getYouxuanGoodsNumberList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getYouxuanGoodsNumberList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 商品列表特殊处理
export const getYouxuanGoodsListByHZ = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getYouxuanGoodsListByHZ.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 商品列表的商家查询
export const findSupplierAccountNumberForList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplierAccountNumber/findSupplierAccountNumberForList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 删除商品
export const deleteGroupGoods = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/deleteGroupGoods.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 删除规格
export const batchDeleteGoodsSpec = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webGoods/batchDeleteGoodsSpec.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量驳回商品
export const rejectGoods = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/rejectGoods.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 同步到小程序
export const removeGoodsRedis = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/removeGoodsRedis.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量上下架
export const batchOperateGoodsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/batchOperateGoodsList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量上下架 --重构
export const goodsOnOffShelves = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/goodsOnOffShelves.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 商品一级类目
export const getGoodsCategoryList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/getGoodsCategoryList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 编辑类目
export const updateGoodsCategoryRef = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/updateGoodsCategoryRef.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量导出修改价格
export const exportUpdateGoodsPrice = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportUpdateGoodsPrice.action',
		method: 'post',
		responseType: 'arraybuffer',
		dataType: 'form',
		data,
		custom,
	})

// 批量导出
export const exportGoodsOfPassDetails = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportGoodsOfPassDetails.action',
		method: 'post',
		responseType: 'arraybuffer',
		dataType: 'form',
		data,
		custom,
	})
// 批量导出杭州
export const exportGoodsOfPassDetailsByHz = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportGoodsOfPassDetailsByHz.action',
		method: 'post',
		responseType: 'arraybuffer',
		dataType: 'form',
		data,
		custom,
	})
// 批量导出
export const exportGoodsAttributeInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsAttribute/exportGoodsAttributeInfo.action',
		method: 'post',
		responseType: 'arraybuffer',
		dataType: 'form',
		data,
		custom,
	})

// 查询是否已修改分佣比例
export const checkCommissionRate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/checkCommissionRate.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量修改分佣比例
export const batchUpdateCommissionRate = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/batchUpdateCommissionRate.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
//查询类目
export const getGoodsCategoryDetailList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/getGoodsCategoryDetailList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
//编辑类目
export const editGoodsCategory = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/editGoodsCategory.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
//新增类目
export const addGoodsCategory = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/addGoodsCategory.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
//删除类目
export const delGoodsCategory = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/delGoodsCategory.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
//启用/禁用类目
export const enableGoodsCategory = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/enableGoodsCategory.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量定价
// export const batchFixPrice = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusWebGoods/batchFixPrice.action',
// 		method: 'post',
// 		dataType: 'form',
// 		data,
// 		custom,
// 	})
//导出批量修改类目
export const exportBatchGoodsCategoryDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusGoodsCategory/exportBatchGoodsCategoryDetails.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}
// 导入批量修改类目
export const batchEditGoodsCategory = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/yhtPlusGoodsCategory/batchEditGoodsCategory.action`,
		method: 'post',
		data,
		custom,
	})
}
// 佣金调价(商品)
export const commissionAdjustmentByGoods = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/commissionAdjustmentByGoods',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 佣金调价(商品)杭州
export const commissionAdjustmentByHZGoods = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/commissionAdjustmentByHZGoods',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 平台调价(商品)
export const platformAdjustmentByGoods = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/platformAdjustmentByGoods',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台调价(商品)杭州
export const platformAdjustmentByHZGoods = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/platformAdjustmentByHZGoods',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 批量修改商品限制加价状态
export const updateGoodsLimitMarkupStatusBatch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goods/updateGoodsLimitMarkupStatusBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新商品列表
export const yxGoodsList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goods/yxGoodsList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新商品列表-杭州
export const hzYxGoodsList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goods/hz/yxGoodsList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新商品列表-杭州
export const supplierPageByInfo = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplier/pageByInfo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 批量设置七天无理由
export const handleSevenDaysWithoutReason = (data) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/seven-days-without-reason-config/batch/saveOrUpdate',
		method: 'post',
		data,
		dataType: 'json',
	})
}
