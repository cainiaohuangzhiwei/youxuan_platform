import request from '@/utils/interceptor/request'
// 上传附件
export const uploadAttachmentList = (data, custom = {}) =>
	request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/attachment/uploadAttachmentList.action`,
		method: 'post',
		data,
		custom,
	})
