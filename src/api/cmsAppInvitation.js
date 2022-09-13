import request from '@/utils/interceptor/request'
// 邀请统计
export const listAppInvitation = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppInvitation/listAppInvitation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 导出
export const exportAppInvitation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsAppInvitation/exportAppInvitation.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
// 查看数据
export const invitationStatisticsList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsInvitationStatistics/invitationStatisticsList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 查看数据
export const invitationStatisticsByDate = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsInvitationStatistics/invitationStatisticsByDate	.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
