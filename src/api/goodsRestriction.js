import request from '@/utils/interceptor/request'
//确定限购
export const createGoodsRestriction = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsRestriction/createGoodsRestriction.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//编辑限购
export const modifyGoodsRestriction = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsRestriction/modifyGoodsRestriction.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//删除限购
export const deleteGoodsRestriction = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsRestriction/deleteGoodsRestriction.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//批量限购
export const batchCreateGoodsRestriction = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsRestriction/batchCreateGoodsRestriction.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//批量删除
export const batchDeleteGoodsRestriction = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/goodsRestriction/batchDeleteGoodsRestriction.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
