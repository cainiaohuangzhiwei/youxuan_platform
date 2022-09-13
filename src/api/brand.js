import request from '@/utils/interceptor/request'
/*
 * -----------------------------------品牌----------------------------------------
 */
// 获取品牌列表
// export const getBrandList = (data, loadingOptions) =>
// 	http.form('/yhtplus/brand/getBrandList.action', data, loadingOptions)
export const getBrandList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/getBrandList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 新增品牌
// export const addBrand = (data, loadingOptions) =>
// 	http.form('/yhtplus/brand/addBrand.action', data, loadingOptions)
export const addBrand = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/addBrand.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑品牌
export const updateBrandById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/updateBrandById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//批量标记选品
export const tagSelection = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/tagSelection.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//取消标记选品
export const cancelTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/cancelTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//删除选品
export const deleteBrandByBrandId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/deleteBrandByBrandId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//编辑购物需知
export const updateBrandShoppingNoticeById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/brand/updateBrandShoppingNoticeById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
