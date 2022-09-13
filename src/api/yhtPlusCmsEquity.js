import request from '@/utils/interceptor/request'
import { getSwitchInfo } from './marketingSwitch'

// 权益中心列表
export const getEquity = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/getEquity.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquity'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equity/getEquity',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 权益详情
export const getEquityMore = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/getEquityMore.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityMore'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityMore',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 新增权益中心
export const addEquity = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/addEquity.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/addEquity'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equity/addEquity',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 编辑权益中心
export const editEquity = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/editEquity.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/editEquity'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equity/editEquity',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 获取权益卡领取的数量
export const getEquityReceivedCount = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/getEquityReceivedCount.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityReceivedCount'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityReceivedCount',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 权益卡已领取
export const getEquityReceived = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/getEquityReceived.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityReceived'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityReceived',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 获取权益卡使用的数量
export const getEquityUsedCount = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/getEquityUsedCount.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityUsedCount'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityUsedCount',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 权限卡已使用
export const getEquityUsed = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquity/getEquityUsed.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityUsed'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equity/getEquityUsed',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
