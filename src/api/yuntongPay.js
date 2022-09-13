import request from '@/utils/interceptor/request'
// 薪宝提现查询第三方接口（薪宝通道）
export const xinbaoTransQuery = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yuntongPay/xinbaoTransQuery.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 刷新支付权重分布的缓存
export const refreshPayTypeWeightCache = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yuntongPay/refreshPayTypeWeightCache.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 查询汇聚退款状态
export const queryJoinpayRefund = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yuntongPay/queryJoinpayRefund.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
