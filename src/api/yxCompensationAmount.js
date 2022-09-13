/*
 * @Author: your name
 * @Date: 2021-10-11 10:30:10
 * @LastEditTime: 2021-10-11 17:01:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \egg\src\api\yxCompensationAmount.js
 */
import request from '@/utils/interceptor/request'
// 创建补款单
export const addPayment = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/yxCompensationAmount/add',
		method: 'post',
		data,
		custom,
	})
}
// 查询补款
export const subsidyQueryPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/yxCompensationAmount/queryPage',
		method: 'post',
		data,
		custom,
	})
}
// 删除补款单
export const subsidyDelete = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/yxCompensationAmount/delete',
		method: 'post',
		data,
		custom,
	})
}
// 导出补款记录
export const subsidyExport = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/yxCompensationAmount/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
}
// 补款派发
export const subsidyBatchDistribute = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-after-sale-rest-fors/yxCompensationAmount/batchDistribute',
		method: 'post',
		data,
		custom,
	})
}
// 查询打款结果
export const subsidyQueryApplyResult = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-after-sale-rest-fors/yxCompensationAmount/queryApplyResult',
		method: 'post',
		data,
		custom,
	})
}
// 小额打款处理列表
export const search = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/smallPaymentProcess/search',
		method: 'post',
		data,
		custom,
	})
}
// 小额打款处理详情
export const detail = (params, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/smallPaymentProcess/detail',
		method: 'get',
		params,
		custom,
		dataType: 'form',
	})
}
// 小额打款处理驳回
export const reject = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/smallPaymentProcess/reject',
		method: 'post',
		data,
		custom,
	})
}
// 小额打款处理关闭
export const close = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/smallPaymentProcess/close',
		method: 'post',
		data,
		custom,
	})
}
// 小额打款导出
export const smallMoneyExport = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/smallPaymentProcess/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
}
// 小额打款处理批量关闭
export const batchClose = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/smallPaymentProcess/batchClose',
		method: 'post',
		data,
		custom,
	})
}
// 小额打款处理批量驳回
export const batchReject = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/smallPaymentProcess/batchReject',
		method: 'post',
		data,
		custom,
	})
}
// 小额打款记录
export const smallRemitPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-account-service/account/smallRemit/page',
		method: 'post',
		data,
		custom,
	})
}
//查询赔付结果
export const inquireQueryApplyResult = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/equityCompensation/queryApplyResult',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
