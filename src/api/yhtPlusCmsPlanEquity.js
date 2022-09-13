// import request from '@/utils/interceptor/request'
import request from '@/utils/interceptor/request'
import { getSwitchInfo } from './marketingSwitch'

// 获取用户列表
// export const getUser = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsPlanEquity/getUser.action',
// 		method: 'post',
// 		data,
// 		custom,
// 	})
export const getUser = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsPlanEquity/getUser.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getUser'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getUser',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 查看计划
export const getPlan = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsPlanEquity/getPlan.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getPlan'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getPlan',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 获取派发数量
export const getReceivedCountByPlanId = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsPlanEquity/getReceivedCountByPlanId.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getReceivedCountByPlanId'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getReceivedCountByPlanId',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 获取已使用数量
export const getUsedCountByPlanId = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsPlanEquity/getUsedCountByPlanId.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getUsedCountByPlanId'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/getUsedCountByPlanId',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}

// 新建、编辑计划
export const addPlan = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsPlanEquity/addPlan.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/addPlan'
	)

	return request.request({
		// url: '/weeget-bullet-marketing-rest-fors/marketing/equityPlan/addPlan',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 删除计划
export const deleteEquityPlan = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsPlanEquity/deleteEquityPlan.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/deleteEquityPlan'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equityPlan/deleteEquityPlan',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
