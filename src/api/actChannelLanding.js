import request from '@/utils/interceptor/request'

// 获取渠道落地页列表
export const getActChannelLandingList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actChannelLanding/getActChannelLandingList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除渠道落地页
export const deleteActChannelLanding = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actChannelLanding/deleteActChannelLanding.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新渠道落地页
export const updateActChannelLanding = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actChannelLanding/updateActChannelLanding.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 保存渠道落地页
export const saveActChannelLanding = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actChannelLanding/saveActChannelLanding.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
