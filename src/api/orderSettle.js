/*
 * @Description:商家结算规则
 * @Author: liqianwei
 * @Email: liqianwei@weeget.cn
 * @Date: 2021-01-15 16:04:10
 * @LastEditTime: 2021-01-16 13:46:58
 * @LastEditors: liqianwei
 */
import request from '@/utils/interceptor/request'

// 商家结算规则列表
export const getMerchantSettleRuleList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantSettleRuleList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 新增商家结算规则
export const merchantSettleRuleAdd = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantSettleRuleAdd.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑商家结算规则
export const merchantSettleRuleEdit = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantSettleRuleEdit.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商家结算规则历史
export const merchantSettleRuleHistory = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantSettleRuleHistory.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商家结算规则历史
export const merchantSettleRuleView = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantSettleRuleView.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商家订单结算列表
export const merchantOrderSettleList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantOrderSettleList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//导入结算规则
export const importSupplierSettleRule = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/supplierImportSettleRule/importSupplierSettleRule.action`,
		method: 'post',
		data,
		custom,
	})
}

//商家结算信息列表
export const merchantSettleList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantSettleList.action',
		method: 'post',
		data,
		custom,
	})
}

//商家结算信息列表
export const merchantSettleListDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/merchantSettleListDetail.action',
		method: 'post',
		data,
		custom,
	})
}

// 商家结算信息列表导出
export const merchantSettleExport = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/supplierImport/merchantSettleExport.action',
		method: 'post',
		data,
		custom,
	})
// 扣款确认列表导出
export const merchantDeductExport = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/supplierImport/merchantDeductExport.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
	})
//扣款确认驳回
export const rejectDeduct = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/merchantDeduct/rejectDeduct.action',
		method: 'post',
		data,
		custom,
	})
}
//扣款确认批量驳回
export const batchRejectDeduct = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/merchantDeduct/batchRejectDeduct.action',
		method: 'post',
		data,
		custom,
	})
}
//手动结算
export const orderSettleManual = (params, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderSettle/orderSettleManual.action',
		method: 'get',
		params,
		custom,
	})
}
