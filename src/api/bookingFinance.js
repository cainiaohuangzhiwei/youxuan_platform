import request from '@/utils/interceptor/request'
/*
 * -----------------------------------拼团流水记录----------------------------------------
 */
export const findBookingFinanceList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/bookingFinance/findBookingFinanceList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
