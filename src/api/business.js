import request from '@/utils/interceptor/request'
// import { getDeliveSwitch } from './marketingSwitch'
/*
 * -----------------------------------业务----------------------------------------
 */
// 获取订单列表
export const getOrderListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 订单列表打标
export const addOrderTagByOrderIdList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrder/addOrderTagByOrderIdList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 订单列表导出
export const orderListOutput = (data, custom = {}) => {
	return request.request({
		url: '',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取订单标签
export const getOrderConfiguration = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getOrderConfiguration.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 批量同步物流
export const logisticQuery = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/accessSetting/logisticQuery.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 批量设置拣货中
export const batchUpdateOrderDeliverSign = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/order/deliver/batchUpdateOrderDeliverSign',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 批量标记
export const tagOrder = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrder/tagOrder.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 申请取消发货
export const applyCancelOrderDeliver = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/order/applyCancelOrderDeliver',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 商家自动审核/验货配置列表
export const afterSaleAutoAuditConfigList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSales/afterSaleAutoAuditConfigList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询审核状态
export const getOrderApproveRecordById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/order/getOrderApproveRecordById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 超时未审核售后单列表
export const queryUnAuditAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSales/queryUnAuditAfterSales',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 上游取消发货申请列表
export const queryOrderApproveRecord = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/order/queryOrderApproveRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 超时未验货售后单列表
export const queryUnCheckingAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSales/queryUnCheckingAfterSales',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 超时审核验货售后单列表导出
export const exportOverTimeAfterSales = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSales/exportOverTimeAfterSales',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})

// 商家自动审核配置列表-启用/禁用
export const afterSaleAutoAuditConfigCtrl = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSales/afterSaleAutoAuditConfigCtrl',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查询订单评价列表【分页】
export const getPageSupplierEvaluationList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-evaluation-rest-fors/evaluation/supplier-evaluation/pageSupplierEvaluationList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 订单评价更新状态
export const setSupplierEvaluationsaveStatus = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-evaluation-rest-fors/evaluation/supplier-evaluation/saveStatus',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询店主id转换用户id任务列表
export const queryOrganizationConvertTaskList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-rest-fors/organization/convert/queryOrganizationConvertTaskList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新增店主id转换用户id任务
export const addOrganizationConvertTask = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/weeget-bullet-user-rest-fors/organization/convert/addOrganizationConvertTask`,
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 删除店主id转换用户id任务
export const deleteOrganizationConvertTask = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-user-rest-fors/organization/convert/deleteOrganizationConvertTask',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询商家秒退配置列表
export const queryMerchantRefundList = (data) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplierAfterSales/secRefundConfig/list',
		method: 'post',
		data,
		dataType: 'json',
	})
}
// 切换商家秒退配置开关
export const merchantRefundSwitchChange = (data) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplierAfterSales/secRefundConfig/updateSwitch',
		method: 'post',
		data,
		dataType: 'json',
	})
}
