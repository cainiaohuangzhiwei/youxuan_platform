import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商品属性----------------------------------------
 */

//基础属性列表
export const listCategoryAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsCategoryAttribute/listCategoryAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//新增属性列表
export const saveCategoryAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsCategoryAttribute/saveCategoryAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//编辑属性列表
export const updateCategoryAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsCategoryAttribute/updateCategoryAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//删除属性列表
export const deleteCategoryAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsCategoryAttribute/deleteCategoryAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//禁、启用属性列表
export const disableCategoryAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsCategoryAttribute/disableCategoryAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//获取类目属性详情
export const getCategoryAttributeInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsCategoryAttribute/getCategoryAttributeInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导入类目属性
export const importCategoryAttribute = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/yhtPlusCmsGoodsCategoryAttribute/importCategoryAttribute.action`,
		method: 'post',
		data,
		custom,
	})
}
// 导入基础属性
export const importBasicsAttribute = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/yhtPlusCmsGoodsBasicsAttribute/importBasicsAttribute.action`,
		method: 'post',
		data,
		custom,
	})
}
//获取商品属性详情
export const listCategoryAttributeInfoByCategoryId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsCategoryAttribute/listCategoryAttributeInfoByCategoryId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//获取商品属性详情
export const getGoodsAttributeInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsAttribute/getGoodsAttributeInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//获取标签
export const getGroupTagListByType = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/groupTag/getGroupTagListByType.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 列表查询商品类目信息
export const listGoodsCategory = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/seven-days-without-reason-config/listGoodsCategory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 批量新增或更新七天无理由配置
export const saveOrUpdate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/seven-days-without-reason-config/batch/saveOrUpdate',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
