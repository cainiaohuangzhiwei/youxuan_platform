import request from '@/utils/interceptor/request'
import fetchWithSign from '@/utils/interceptor/request'
/*
 * -----------------------------------商品----------------------------------------
 */
// // 驳回商品列表列表
export const getRejectGoodsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getRejectGoodsList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
// // 获取品牌品类列表
export const getBrandCategoryList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getBrandCategoryList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
// 编辑品牌列表
export const getBrandCategory = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getBrandCategory.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
//   出入库操作列表
export const getNewGoodsInventoryList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getNewGoodsInventoryList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
// 品牌列表
export const getBrandParentList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getBrandParentList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 分类列表
export const findBrandCategoryClassifyByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/findBrandCategoryClassifyByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 新增品牌品类列表
export const saveBrandCategory = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/saveBrandCategory.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 分类列表同步小程序
export const refreshBrandCategoryClassifyCache = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/refreshBrandCategoryClassifyCache.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//新增分类
export const addOrUpdateBrandCategoryClassify = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/addOrUpdateBrandCategoryClassify.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//删除分类
export const deleteBrandCategoryClassify = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/deleteBrandCategoryClassify.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//删除分品牌品类
export const delBrandCategory = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/delBrandCategory.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//删除分品牌
export const delBrandParent = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/delBrandParent.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//新增品牌
export const saveBrandParent = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/saveBrandParent.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//新增Logo
export const batchUpdateBrandParentLogo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/batchUpdateBrandParentLogo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// // 根据商品规格ID获取组织商品详情
export const getGoodsDetailByOrganizationSpecIdPlus = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getGoodsDetailByOrganizationSpecId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 订单进入商品详情调起接口
export const getGoodsDetailBySnapshot = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getGoodsDetailBySnapshot.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 根据商品ID修改集团商品信息
export const updateGroupGoodsByGoodsIdPlus = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/updateGroupGoodsByGoodsId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 选品系统
export const findBrandInfoByBrandName = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/findBrandInfoByBrandName.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 清除缓存
export const removeGoodsRedis = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/removeGoodsRedis.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//同步ERP
export const verifyErp = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/verifyErp.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//获取ERP信息
export const getUploadGoodsTime = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getUploadGoodsTime.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 无商品货号列表
export const getYouxuanGoodsNumberList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getYouxuanGoodsNumberList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//同步ERP信息
export const uploadBrandGoodsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/uploadBrandGoodsList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//调价操作记录
export const findAdjustRecordByBrandId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/findAdjustRecordByBrandId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//一键调价
export const batchUpdateGoodsPrice = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/batchUpdateGoodsPrice.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//商品限购
export const getGoodsRestrictionYouxuanGoodsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getGoodsRestrictionYouxuanGoodsList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//商品审核详情
export const getGoodsDetailByGoodsId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getGoodsDetailByGoodsId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//审核商品
export const checkGoodsFromSupplier = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/checkGoodsFromSupplier.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//商品变更记录
// export const getChangeOfContrastByGoodsId = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusWebGoods/getChangeOfContrastByGoodsId.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
//商品列表
export const getYouxuanGoodsListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getYouxuanGoodsListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//商品审核/批量
export const checkGoodsPrice = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/checkGoodsPrice.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//商品审核资料
export const checkGoodsListFromSupplier = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/checkGoodsListFromSupplier.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

export const getChangeOfContrastByGoodsId = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/mgr/goods/getChangeOfContrastByGoodsId',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//导出商品信息
export const exportGoodsAndGroupInfoList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-goods-rest-fors/goods/exportGoodsAndGroupInfoList',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
}

// 批量处理定价记录
export const initBatchFixPriceRecord = async (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/goods/import/initBatchFixPriceRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 导入批量定价
export const initBatchFixPrice = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-genius-supplier-service/goods/pricing/import-goods-pricing`,
		method: 'post',
		data,
		custom,
	})
}

// 查询商品标签列表
export const goodsTagList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/mgr/goodsTag/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 禁用/启用商品标签
export const switchGoodsTagStatus = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/mgr/goodsTag/disableAndEnable',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新增/编辑商品标签
export const editGoodsTag = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/mgr/goodsTag/edit',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询标签商品列表
export const goodsPageList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/mgr/goodsTag/goodsPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 导入商品到标签
export const uploadGoodsToTag = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/weeget-bullet-goods-rest-fors/mgr/goodsTag/upload`,
		method: 'post',
		data,
		custom,
	})
}

// 从商品标签中移除商品
export const removeGoodsFromGoodsTag = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/mgr/goodsTag/deleteGoodsRelation',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 导出商品标签商品
export const exportGoodsFromGoodsTag = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/mgr/goodsTag/exportGoods',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})
}
// 批量定价
export const batchFixPrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goods/batchFixPrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查询批量驳回商品列表
export const goodsRejectBatchPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goodsRejectBatch/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询驳回商品明细列表
export const goodsRejectBatchItemPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goodsRejectBatchItem/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 导出批量驳回商品列表
export const exportGoodsRejectBatch = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-goods-rest-fors/goodsRejectBatch/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
}

// 导入批量驳回商品
export const importGoodsRejectBatch = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/weeget-bullet-goods-rest-fors/goodsRejectBatch/import`,
		method: 'post',
		data,
		custom,
	})
}

// 查询商品类目调整列表
export const goodsCategoryChangePage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goodsCategoryChange/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 导出商品类目调整列表
export const exportGoodsCategoryChange = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goodsCategoryChange/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})
}

// 导出商品类目列表
export const downloadGoodsCategory = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goodsCategoryChange/downloadGoodsCategory',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})
}

// 导入商品类目更新列表
export const importGoodsCategoryChange = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/weeget-bullet-goods-rest-fors/goodsCategoryChange/imports`,
		method: 'post',
		data,
		custom,
	})
}
