import request from '@/utils/interceptor/request'
// 合同模板列表
export const listContractTemplate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/signCenter/listContractTemplate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增合同模板
export const createContractTemplate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/signCenter/createContractTemplate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 启用模板
export const enableTemplate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/signCenter/enableTemplate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 模板详情
export const getContractTemplateDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/signCenter/getContractTemplateDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 合同列表查询
export const listContract = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/signCenter/listContract.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 商家发送合同
export const supplierSendContract = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplierSettlementApply/supplier-send-contract',
		method: 'post',
		data,
		custom,
	})
}
// 商家发送合同-修改收费方案
export const updateSendContract = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplierSettlementApply/update-send-contract',
		method: 'post',
		data,
		custom,
	})
}
// 导出
export const contractExportByCondition = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplier/contractExportByCondition',
		method: 'post',
		data,
		custom,
	})
}

// 删除商家合同
export const deleteContract = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/supplier/contractSign/deleteContract',
		method: 'post',
		data,
		custom,
	})
}
