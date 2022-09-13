import request from '@/utils/interceptor/request'
export const queryGoodsPriceComparison = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/supplierPrice/queryGoodsPriceComparison.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//商品详情查询多规格接口
export const queryGoodsPriceComparisonMoreSpec = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/supplierPrice/queryGoodsPriceComparisonMoreSpec.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//商品比价商品详细信息接口
export const queryGoodsPriceComparisonDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/supplierPrice/queryGoodsPriceComparisonDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
