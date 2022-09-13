import fetchWithSign from '@/utils/interceptor/requestAct'
import request from '@/utils/interceptor/request'
// 用户风控列表
export const listUserRiskControl = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-user-rest-fors/user/risk-control/listUserRiskControl',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 用户风控类型禁用
export const enableUserRiskControl = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-user-rest-fors/user/risk-control/enableUserRiskControl',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 用户风控类型编辑
export const updateUserRiskControl = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-user-rest-fors/user/risk-control/updateUserRiskControl',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 用户风控类型创建
export const createUserRiskControl = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-user-rest-fors/user/risk-control/createUserRiskControl',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 用户风控明细列表
export const listUserRiskControlItem = (data, custom = {}) => {
	return fetchWithSign.request({
		url:
			'weeget-bullet-user-rest-fors/user/risk-control-item/listUserRiskControlItem',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 批量移除用户风控明细
export const batchRemoveUserRiskControlItem = (data, custom = {}) => {
	return fetchWithSign.request({
		url:
			'	weeget-bullet-user-rest-fors/user/risk-control-item/batchRemoveUserRiskControlItem',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 导出
export const riskControlItemExportByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/weeget-genius-supplier-service/riskControl/riskControlItemExportByCondition',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// // 导入
export const importUserRiskControlItem = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-genius-supplier-service/riskControl/importUserRiskControlItem`,
		method: 'post',
		data,
		custom,
	})
}
