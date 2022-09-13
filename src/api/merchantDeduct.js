import request from '@/utils/interceptor/request'

// 商家扣款确认表
export const merchantDeductList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/merchantDeduct/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
