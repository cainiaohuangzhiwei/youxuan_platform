import request from '@/utils/interceptor/request'

// 刷新小程序图片缓存
export const refreshWeixinImageList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsWeixinImage/refreshWeixinImageList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
