import request from '@/utils/interceptor/request'
// 对账列表
export const selectReconciliationRecordList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/reconciliation/selectReconciliationRecordList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 审批记录
export const selectExaminationRecordList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/examination/selectExaminationRecordList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 对账单详情
export const selectReconciliationRecordById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/reconciliation/selectReconciliationRecordById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 对账单首款审核
export const saveReconciliationExamination = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/examinationInfo/saveReconciliationExamination.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//审批记录同意/拒绝
export const updateReconciliationStatusById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/reconciliation/updateReconciliationStatusById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
