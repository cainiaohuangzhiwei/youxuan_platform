import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 兑换中心
// export const getExchangeGoodsList = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsExchange/getExchangeGoodsList.action',
// 		data,
// 		loadingOptions
// 	)
export const getExchangeGoodsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsExchange/getExchangeGoodsList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
