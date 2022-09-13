import request from '@/utils/interceptor/request'

// 店铺详情
export const shopDetailList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/getOrganizationDetails.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 店铺详情信息
export const findOrganizationDetails = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/findOrganizationDetails.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 店铺等级配置列表
// export const levelByCondition = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsLevel/getLevelByCondition.action',
// 		method: 'post',
// 		dataType: 'form',
// 		data,
// 		custom,
// 	})

// 获取店铺余额流水
export const balanceLogList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/findIntoAccountDetailsByCondition.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 获取直接邀请开通情况列表
export const directList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/getExtractList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 店铺详情-销售订单列表
export const getOrderListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderListByCondition.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 店铺详情-销售订单统计图表
export const findCMSOrganizationDetailsStatistics = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/findCMSOrganizationDetailsStatistics.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 店铺详情-小程序登录图片
export const getCodeImage = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/weiXinUser/getCodeImage.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
