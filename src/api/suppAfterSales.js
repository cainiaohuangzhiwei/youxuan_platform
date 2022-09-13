import request from '@/utils/interceptor/request'
/*
 * -----------------------------------售后单----------------------------------------
 */
// 售后单是否同意退款操作校验
export const suppConfirmRefundChecking = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/suppAfterSales/suppConfirmRefundChecking.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
