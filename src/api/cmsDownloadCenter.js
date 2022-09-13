import request from '@/utils/interceptor/request'
// 下载中心列表
export const cmsDownloadCenterList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsDownloadCenter/cmsDownloadCenterList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
