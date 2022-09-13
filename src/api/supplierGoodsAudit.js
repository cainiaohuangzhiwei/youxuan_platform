import request from '@/utils/interceptor/request'
/*
 * -----------------------------------审核商家商品----------------------------------------
 */
// 获取会场列表
export const getBrandByGoodsStatus = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/getBrandByGoodsStatus.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 审核商家商品列表
export const getYouxuanGoodsAuditListByParam = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/getYouxuanGoodsAuditListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 审核商家商品列表
export const getYouxuanGoodsNumberAuditListByParam = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus/yhtPlusWebGoods/getYouxuanGoodsNumberAuditListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 上传Excel
export const importAuditedSupplierGoods = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importAuditedSupplierGoods.action',
		method: 'post',
		data,
		custom,
	})
}
// 审核不通过
export const checkGoodsPrice = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/checkGoodsPrice.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 导出
export const exportGoodsWaitingDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportGoodsWaitingDetails.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}
//查询商品价格审核方式
export const autoCheckFlag = (params, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/autoCheckFlag.action',
		method: 'get',
		params,
		custom,
		dataType: 'form',
	})
}
// 审核商家商品，自动计算价格
export const autoCalculatePrice = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/autoCalculatePrice.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 审查询是否已修改分佣比例
export const checkCommissionRate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/checkCommissionRate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 批量修改分佣比例(审核列表)
export const updateCheckListCommissionRate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/updateCheckListCommissionRate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
