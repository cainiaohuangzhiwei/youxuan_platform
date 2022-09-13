import request from '@/utils/interceptor/request'
// 库存盘点&重新爬取
// export const priorityLoad = (data, loadingOptions) =>
// 	http.form('/priority/priorityLoad.action', data, loadingOptions)
export const priorityLoad = (data, custom = {}) => {
	return request.request({
		url: '/priority/priorityLoad.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
