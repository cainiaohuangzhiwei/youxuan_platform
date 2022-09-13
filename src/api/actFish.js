import request from '@/utils/interceptor/request'

// 列表
export const addActFishAd = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actFishCoupon/addAdvertisement.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

export const getActFishAdList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actFishCoupon/getAdvertisement.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

export const getActFishCouponList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actFishCoupon/getActFishCouponList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 删除优惠券
export const delActFishCouponList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actFishCoupon/delActFishCoupon.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 新增/编辑优惠券
export const saveActFishCouponList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/actFishCoupon/saveActFishCouponList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
