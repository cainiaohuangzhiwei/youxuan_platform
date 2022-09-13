import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 添加商品到分组
export const addGoodsListByGoodsGroupId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/adminGoods/addGoodsListByGoodsGroupId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 从分组移除商品
export const deleteGoodsListByGoodsGroupId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/adminGoods/deleteGoodsListByGoodsGroupId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
