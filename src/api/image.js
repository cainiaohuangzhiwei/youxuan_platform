import request from '@/utils/interceptor/request'
// 上传图片
export const uploadImageList = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action`,
		method: 'post',
		data,
		custom,
	})
}

// 批量上传logo图片
export const uploadMultipleFile = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/fileAction/uploadMultipleFile.action`,
		method: 'post',
		data,
		custom,
	})
}
// 根据itemId和type获取最新图片
export const getNewOneImage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/image/getNewOneImage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 上传APP软件安装包
export const uploadFile = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/fileAction/uploadFile.action`,
		method: 'post',
		data,
		custom,
	})
}
