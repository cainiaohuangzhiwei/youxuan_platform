import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商品改价----------------------------------------
 */
// 类目树
export const goodsCategoryTree = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/grossMargins/goodsCategoryTree.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 类目树+禁用
export const goodsEnableCategoryTree = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/grossMargins/goodsEnableCategoryTree.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 类目树（提佣版本用的）
export const commissionGoodsCategoryTree = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/grossMargins/goodsEnableCategoryTree.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 三级类目列表毛利率
export const threeLevelGoodsCategoryList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/grossMargins/threeLevelGoodsCategoryList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑毛利率
export const updateGrossMargins = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/grossMargins/updateGrossMargins.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 品牌价格系数列表
export const brandParentClassList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/modulus/brandParentClassList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 修改品牌价格系数
export const updateBrandParentClass = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/modulus/updateBrandParentClass.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 价格区间系数列表
export const priceList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/modulus/priceList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 修改价格区间
export const updatePriceValList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/modulus/updatePriceValList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 修改价格区间系数
export const updatePriceModulus = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/modulus/updatePriceModulus.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
