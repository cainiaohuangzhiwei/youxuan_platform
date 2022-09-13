import request from '@/utils/interceptor/request'
/*
 * -----------------------------------邀请码----------------------------------------
 */
// 批量添加该店铺下的邀请码
// export const batchAddInviteCodeByOrganizationId = (data, loadingOptions) =>
// 	http.form(
// 		'yhtPlusCmsInviteCode/batchAddInviteCodeByOrganizationId.action',
// 		data,
// 		loadingOptions
// 	)
export const batchAddInviteCodeByOrganizationId = (data, custom = {}) =>
	request.request({
		url: 'yhtPlusCmsInviteCode/batchAddInviteCodeByOrganizationId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取邀请码列表
export const getInviteCodeListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsInviteCode/getInviteCodeListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 批量或单个添加邀请码
export const batchAddInviteCode = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsInviteCode/batchAddInviteCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 显示或者隐藏激活码
// export const displayOrHideByOrganizationId = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsInviteCode/displayOrHideByOrganizationId.action',
// 		data,
// 		loadingOptions
// 	)
export const displayOrHideByOrganizationId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsInviteCode/displayOrHideByOrganizationId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
