import request from '@/utils/interceptor/request'

// 发票列表
export const getInvoiceList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/invoice/getInvoiceList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// // 导出
export const exportInvoice = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportInvoice.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
// // 导入
export const impostInvoice = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus-import/yhtplus/webImport/impostInvoice.action`,
		method: 'post',
		data,
		custom,
	})
}
// 审核
export const updateStatus = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/invoice/updateStatus.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 上传文件
export const uploadAttachmentList = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/attachment/uploadAttachmentList.action`,
		method: 'post',
		data,
		custom,
	})
}
// 新增发票
export const addInvoice = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/invoice/addInvoice.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 发票详情
export const findIncludeZeroById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/invoice/findIncludeZeroById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 票据信息
export const findInvoiceFile = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/invoice/findInvoiceFile.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 处理记录
export const findInvoiceById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/invoiceRecord/findInvoiceById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 上传票据信息
export const updateInvoiceFile = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/invoice/updateInvoiceFile.action`,
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
