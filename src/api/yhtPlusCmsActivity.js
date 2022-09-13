import request from '@/utils/interceptor/request'
/*
 * -----------------------------------统计----------------------------------------
 */
// 小程序品牌评价

export const getBrandEvaluateStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsActivity/getBrandEvaluateStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})
//推荐标签统计
export const getBrandEvaluateTag = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsActivity/getBrandEvaluateTag.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

//配置评价标签
export const getGroupTagListByType = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/groupTag/getGroupTagListByType.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

//更新标签
export const updateGroupTag = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/groupTag/updateGroupTag.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

//品牌评价详情
export const getBrandEvaluateList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsActivity/getBrandEvaluateList.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

/* -----------------------------------小程序---------------------------------------- */

// 编辑小程序弹窗
export const updateActivity = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/updateActivity.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增小程序弹窗
export const addActivity = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/addActivity.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 开启或关闭弹窗
export const openOrCloseActivity = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/openOrCloseActivity.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取活动Banner列表
export const getActBannerList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/getActBannerList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除活动Banner
export const delActBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/delActBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增活动Banner
export const addActBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/addActBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新活动Banner
export const updateActBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/updateActBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取小程序图片
export const getWeixinImageList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/getWeixinImageList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新小程序图片
export const updateWeixinImage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/updateWeixinImage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取小程序活动海报素材列表
export const getActivityBannerList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/getActivityBannerList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新小程序活动海报素材
export const updateActivityBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/updateActivityBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增小程序活动海报素材
export const addActivityBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/addActivityBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除小程序活动海报素材
export const delActivityBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActivity/delActivityBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
