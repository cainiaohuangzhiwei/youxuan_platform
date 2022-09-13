import request from '@/utils/interceptor/request'
// 物流公司列表
export const getExpressList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/express/getExpressList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
