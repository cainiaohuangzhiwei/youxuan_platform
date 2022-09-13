import request from '@/utils/interceptor/request'
/*
 * -----------------------------------售后----------------------------------------
 */
// 退货单列表-申请补款物流信息
export const prepaymentList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSalesPrepayment/prepaymentList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 退货单列表-申请补款物流信息
export const afterSalesPrepayment = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSalesPrepayment/prepaymentOperate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 开启优先赔付
export const createPrepayment = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSalesPrepayment/createPrepayment.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 售后单列表手动赔付（s端）
export const equityCompensation = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsEquity/equityCompensation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
