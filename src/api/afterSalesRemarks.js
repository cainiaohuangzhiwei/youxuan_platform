import request from '@/utils/interceptor/request'

// 售后单详情-寄回地址或结果反馈
export const updateRemarksInRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/afterSalesRemarks/updateRemarksInRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
