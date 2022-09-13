import request from '@/utils/interceptor/request'

// const userId = Vue.prototype.$store.state.user.userInfo.userId || ''

// 导出红包记录
export const exportCompletedList = (data) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/exportCompletedList',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		dataType: 'json',
	})
}

// 新人专区活动列表
export const shopkeeperActivityList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/new-register/activity/list',
		method: 'post',
		data,
		custom,
	})
}

// 新人专区活动列表 - 删除
export const shopkeeperActivityDelete = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-shopkeeper-upms/shopkeeper/new-register/activity/delete',
		method: 'post',
		data,
		custom,
	})
}

// 新人专区活动列表 - 新增、编辑
export const shopkeeperActivitySave = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/new-register/activity/save',
		method: 'post',
		data,
		custom,
	})
}

// 新人专区优惠券列表
export const shopkeeperCouponList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/new-register/coupon/list',
		method: 'post',
		data,
		custom,
	})
}

// 新人专区优惠券列表 - 保存
export const shopkeeperCouponSave = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/new-register/coupon/save',
		method: 'post',
		data,
		custom,
	})
}

// 新人专区优惠券列表 - 移除
export const shopkeeperCouponRemove = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/new-register/coupon/remove',
		method: 'post',
		data,
		custom,
	})
}
