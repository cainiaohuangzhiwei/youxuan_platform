import request from '@/utils/interceptor/request'
import fetchWithSign from '@/utils/interceptor/requestAct'
// 会场活动列表
export const searchBrandRecord = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/brandRecord/searchBrandRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 同步活动商品
export const syncGoods = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-genius-thirdparty-rest/biz/brandRecord/syncGoods',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 同步活动商品库存
export const syncGoodsInventory = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-genius-thirdparty-rest/biz/brandRecord/syncGoodsInventory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询爱库存不可操作
export const queryNotSelfBrandSupplierAccountIds = (data, custom = {}) => {
	return fetchWithSign.request({
		url:
			'/weeget-genius-thirdparty-rest/biz/brandRecord/queryNotSelfBrandSupplierAccountIds',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 是否存在未完结售后单
export const existUnFinishAfterSales = (data, custom = {}) => {
	return fetchWithSign.request({
		url:
			'/weeget-bullet-after-sale-rest-fors/afterSales/existUnFinishAfterSales',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 通过商品ID和供应商账号id获取分类的名称
export const getActivityDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/brandRecord/getActivityDetail',
		method: 'get',
		params: data,
		custom,
		dataType: 'json',
	})
}
// 查询一口价活动会场列表
export const queryFixedPriceBrandList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-genius-thirdparty-rest/thirdparty/fors/queryFixedPriceBrandList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询会场一口价商品列表
export const queryAkcBrandFixedPriceGoodsList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-genius-thirdparty-rest/thirdparty/fors/queryAkcBrandFixedPriceGoodsList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 批量同步一口价活动
export const createActFixedPrice = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/activity/createActFixedPrice',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 导出
export const exportAkcBrandFixedPriceGoodsList = (data, custom = {}) => {
	return request.request({
		url:
			'weeget-genius-thirdparty-rest/thirdparty/fors/exportAkcBrandFixedPriceGoodsList',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
}
// 查询会场详情
export const getAkcBrandDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/thirdparty/fors/getAkcBrandDetail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 出入群店主详情/店主详情-导出
export const akcBrandListExport = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/akc/brand/akcBrandListExport',
		method: 'post',
		data,
		custom,
	})
}

// 根据活动ID列表查询活动-实时查询
export const queryActivityList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/activity/queryActivityList',
		method: 'post',
		data,
		custom,
	})
}

// 根据活动ID同步活动
export const syncActivityList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/activity/syncActivityList',
		method: 'post',
		data,
		custom,
	})
}
