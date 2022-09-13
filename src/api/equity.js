import request from '@/utils/interceptor/request'
import { getSwitchInfo } from './marketingSwitch'
/*
 * -----------------------------------权益卡----------------------------------------
 */
// 权益卡列表
export const listEquityOrder = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/equity/listEquityOrder.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/listEquityOrder'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equity/listEquityOrder',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}

// 权益卡列表
export const listEquityCompensation = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/equity/listEquityCompensation.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/listEquityCompensation'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equity/listEquityCompensation',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 导出赔付列表
export const exportEquityCompensationList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportEquityCompensationList.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})

// 手动补款赔付
export const compensationManual = (data, custom = {}) =>
	request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/equity/compensationManual',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 订单关联的权益保障卡订单
export const getEquityOrderByOrderId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/equity/getEquityOrderByOrderId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
