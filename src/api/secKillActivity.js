import request from '@/utils/interceptor/request'
/*
 * -----------------------------------ab测试业务查询---------------------------------------
 *
 */
//查询秒杀活动列表
export const queryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivity/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//保存活动
export const querySave = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivity/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//修改秒杀活动信息
export const updateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivity/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询分享设置
export const sharingSettings = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivity/sharingSettings',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//修改分享设置
export const updateSharingSettings = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/secKillActivity/updateSharingSettings',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询秒杀活动商品列表
export const queryListGoods = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivityGoods/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 导入
export const secKillActivityGoodsImport = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/weeget-bullet-marketing-rest-fors/secKillActivityGoods/import`,
		method: 'post',
		data,
		custom,
	})
}
// 导出活动商品
export const secKillActivityGoodsExport = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivityGoods/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})

//批量商品上/下架 单个上下架
export const batchGoodsShelves = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/secKillActivityGoods/batchGoodsShelves',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//修改秒杀商品
export const updateGoodsSpec = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/secKillActivityGoods/updateGoodsSpec',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//删除秒杀商品
export const deleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivityGoods/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//查询秒杀活动订单列表
export const querySeckillOrder = async (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-order-rest-fors/order/querySeckillOrder',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//查询秒杀活动汇总信息
export const totalSeckillOrder = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-order-rest-fors/order/totalSeckillOrder',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 结束活动
export const endingActivity = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/secKillActivity/endingActivity',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
