import request from '@/utils/interceptor/request'
// 领券中心列表
export const receiveCouponCenterList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsCouponCenter/cmsCouponCenterList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取优惠券列表
export const getCouponList = async (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsCouponCenter/findCouponListByCouponCenter.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 重构获取优惠券列表
export const newGetCouponList = async (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/coupon/getCanAddCouponListByCouponCenter',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 添加优惠券
export const addCoupon = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsCouponCenter/addCouponCenterData.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑优惠券
export const updateCoupon = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsCouponCenter/updateCouponCenterData.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除领券中心的优惠券
export const delCoupon = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsCouponCenter/delCouponCenterData.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// export const editCoupon = (data, formData = true) => {
// 	let requestData = {
// 		url: '/yhtplus/cmsCouponCenter/editCouponToCenter.action',
// 		method: 'post',
// 		data,
// 		custom: {},
// 	}
// 	if (formData) {
// 		requestData.dataType = 'form'
// 	}
// 	return request.request(requestData)
// }
