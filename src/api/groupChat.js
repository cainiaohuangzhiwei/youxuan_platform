import request from '@/utils/interceptor/request'
// 查询企微群列表
export const searchGroupChat = (data, custom = {}) => {
	return request.request({
		url: 'weeget-bullet-user-rest-fors/qwUser/searchGroupChat',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
