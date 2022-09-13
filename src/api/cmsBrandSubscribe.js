import request from '@/utils/interceptor/request'

//品牌预约统计
export const brandSubscribeStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsBrandSubscribe/brandSubscribeStatistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
