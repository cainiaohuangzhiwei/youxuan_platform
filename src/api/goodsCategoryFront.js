import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商品属性----------------------------------------
 */

//前端类目管理列表
export const goodsCategoryFrontTree = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsCategoryFront/goodsCategoryFrontTree.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//新增前端类目
export const addGoodsCategoryFront = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsCategoryFront/addGoodsCategoryFront.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//编辑前端类目
export const updateGoodsCategoryFront = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsCategoryFront/updateGoodsCategoryFront.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//删除前端类目
export const deleteGoodsCategoryFront = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsCategoryFront/deleteGoodsCategoryFront.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//热词前端第三级类目
export const getThirdCategoryList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsCategoryFront/getThirdList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
