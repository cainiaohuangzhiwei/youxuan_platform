import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商品属性----------------------------------------
 */

//基础属性列表
export const listBasicsAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsBasicsAttribute/listBasicsAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//新增基础属性
export const saveBasicsAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsBasicsAttribute/saveBasicsAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//编辑基础属性
export const updateBasicsAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsBasicsAttribute/updateBasicsAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//获取基础属性详情
export const getBasicsAttribute = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsBasicsAttribute/getBasicsAttribute.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//删除基础属性值
export const deleteBasicsAttributeItem = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsGoodsBasicsAttribute/item/deleteBasicsAttributeItem.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
