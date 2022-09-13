import request from '@/utils/interceptor/request'
// 商家违规审核文件上传
export const auditFileUpload = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-genius-violation-rest-fors/merchantViolation/auditFileUpload`,
		method: 'post',
		data,
		custom,
	})
}
// 商家违规审核
export const merchantViolationAudit = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/audit',
		method: 'post',
		data,
		custom,
	})
}
// 商家违规导入
export const violationImportExcel = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/violationImport/violationImportExcel.action`,
		method: 'post',
		data,
		custom,
	})
}
// 商家违规导入确认
export const importConfirm = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/importConfirm',
		method: 'post',
		data,
		custom,
	})
}
// 商家违规作废
export const violationInvalid = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/invalid',
		method: 'post',
		data,
		custom,
	})
}
// 商家违规记录列表
export const merchantViolationList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/forsPage',
		method: 'post',
		data,
		custom,
	})
}
// 商家处理时效列表
export const processList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantProcessMonitor/processList',
		method: 'post',
		data,
		custom,
	})
}
// 商家处理时效列表
export const violationImportHistory = (data, custom = {}) => {
	return request.request({
		url:
			'weeget-genius-violation-rest-fors/violationImport/importHistory.action',
		method: 'post',
		data,
		custom,
	})
}
// 违规记录详情
export const merchantViolationDetail = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/detail',
		method: 'post',
		data,
		custom,
	})
}
// 违规记录详情-申诉记录列表(
export const forsOperateList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/forsOperateList',
		method: 'post',
		data,
		custom,
	})
}
// 批量关闭/驳回
export const batchAudit = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/batchAudit',
		method: 'post',
		data,
		custom,
	})
}
// 导出
export const exportByCondition = (data, custom = {}) => {
	return request.request({
		url:
			'weeget-genius-violation-rest-fors/merchantViolation/exportByCondition',
		method: 'post',
		data,
		custom,
	})
}
// 批量作废
export const batchInvalid = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-violation-rest-fors/merchantViolation/batchInvalid',
		method: 'post',
		data,
		custom,
	})
}
//  下载任务列表
export const violationDownLoadList = (data, custom = {}) => {
	return request.request({
		url:
			'weeget-genius-violation-rest-fors/merchantViolationImport/violationDownLoadList',
		method: 'post',
		data,
		custom,
	})
}
//   商家违规规则复核列表
export const importDataList = (data, custom = {}) => {
	return request.request({
		url:
			'weeget-genius-violation-rest-fors/merchantViolationImport/importDataList',
		method: 'post',
		data,
		custom,
	})
}
// 导入违规记录
export const importViolation = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-genius-violation-rest-fors/merchantViolation/importViolation`,
		method: 'post',
		data,
		custom,
	})
}
// 导入商家违规记录列表
export const importDataItemList = (data, custom = {}) => {
	return request.request({
		url:
			'weeget-genius-violation-rest-fors/merchantViolationImport/importDataItemList',
		method: 'post',
		data,
		custom,
	})
}
//  导出
export const importItemExport = (data, custom = {}) => {
	return request.request({
		url:
			'weeget-genius-violation-rest-fors/merchantViolationImport/importItemExport',
		method: 'post',
		data,
		custom,
	})
}
