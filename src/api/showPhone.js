import request from '@/utils/interceptor/request'

// 展示手机号-店铺管理-店铺详情
export const findOrganizationPhoneById = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/findOrganizationPhoneById.action',
		method: 'post',
		data,
		custom,
	})
// 展示手机号-订单详情
export const findOrderPhoneById = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/findOrderPhoneById.action',
		method: 'post',
		data,
		custom,
	})

// 展示手机号-直播/主播列表 直播计划列表
export const findAnchorPhoneById = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLiveUserAction/findAnchorPhoneById.action',
		method: 'post',
		data,
		custom,
	})
// 展示手机号-财务/补偿转账列表 转账到微信零钱
export const findUserCompensationPhoneById = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsUserCompensationWithdraw/findUserCompensationPhoneById.action',
		method: 'post',
		data,
		custom,
	})
// 展示手机号-发票详情
export const findInvoicePhoneById = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/invoice/findInvoicePhoneById.action',
		method: 'post',
		data,
		custom,
	})
