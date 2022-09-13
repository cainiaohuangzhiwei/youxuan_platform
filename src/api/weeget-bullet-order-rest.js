import fetchWithSign from '@/utils/interceptor/request'

// 重构查询是否付款成功接口
export const checkPaymentResult = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-order-rest/payment/checkPaymentResult',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//人工退款(新)
export const handleProcess = (data, custom = {}) =>
	fetchWithSign.request({
		url: 'weeget-bullet-order-rest/refund/handleProcess',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
//查询汇聚退款状态(新)
export const checkRefundResult = (data, custom = {}) =>
	fetchWithSign.request({
		url: 'weeget-bullet-order-rest/refund/checkRefundResult',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 根据商户号获取订单支付信息
export const getPaymentInfoByTrxNo = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-order-rest/payment/getPaymentInfoByTrxNo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
