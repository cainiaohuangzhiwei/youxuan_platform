import request from '@/utils/interceptor/request'

// 商家管理列表
export const getCmsSupplierListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/getCmsSupplierListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 商家管理列表
export const addCmsSupplierClerk = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/addCmsSupplierClerk.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 同步商家商品列表
export const getBrandListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/getBrandListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 商家账户列表
export const getCmsSupplierClerkListByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplier/getCmsSupplierClerkListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 新增商家
export const addCmsSupplier = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/addCmsSupplier.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 根据父级ID获取子地区
export const getAreaListByParentId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/area/getAreaListByParentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 获取银行列表
export const getBankList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/bank/getBankList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 新增/修改/删除银行列表
export const aeBank = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/bank/aeBank.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 商家账号列表
export const supplierAccountNumberList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierAccountNumber/supplierAccountNumberList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 编辑商家
export const updateCmsSupplier = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/updateCmsSupplier.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 商家账户信息确认
export const accountInfoConfirm = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/accountInfoConfirm.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取品牌
export const getSupplierBrands = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/getSupplierBrands.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 批量查询商家名称和商家id商家列表
export const listSupplierInfo = (data, custom = {}) =>
	request.request({
		url: 'weeget-genius-supplier-service/supplier/listSupplierInfo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
