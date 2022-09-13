import request from '@/utils/interceptor/request'

// 查看数据
export const listAppStatistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppStatistics/listAppStatistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 导出
export const exportAppStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsAppStatistics/exportAppStatistics.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
// 下载页uv统计
export const appDownloadStatisticsByDate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsStatistics/appDownloadStatisticsByDate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 下载页uv统计列表
export const appDownloadStatisticsList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsStatistics/appDownloadStatisticsList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
