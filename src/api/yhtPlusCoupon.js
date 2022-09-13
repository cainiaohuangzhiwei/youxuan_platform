import request from '@/utils/interceptor/request'
// 优惠券统计
export const findCouponListByParamNew = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/findCouponListByParamNew.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 导出优惠券统计
export const exportCMSYXCouponStatistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/exportCMSYXCouponStatistics.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
// 查询优惠券补偿记录
export const findCouponCompensationByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/findCouponCompensationByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增优惠券补偿记录
export const addCouponCompensation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/addCouponCompensation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 删除优惠券补偿记录
export const delCouponCompensation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/delCouponCompensation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 编辑优惠券补偿记录
export const editCouponCompensation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/editCouponCompensation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 派发优惠券记录
export const distributeCouponCompensation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/distributeCouponCompensation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 导出优惠券补偿记录
export const exportCouponCompensationByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/exportCouponCompensationByCondition.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
// 优惠券详情（详情）
export const getCouponDetail = async (data, custom = {}, couponSwitch) => {
	if (couponSwitch) {
		return request.request({
			url: '/weeget-bullet-coupon-rest-fors/coupon/getCouponById',
			method: 'post',
			data,
			custom,
			dataType: 'json',
		})
	} else {
		return request.request({
			url: '/yhtplus/yhtPlusCoupon/getCouponDetail.action',
			method: 'post',
			data,
			custom,
			dataType: 'form',
		})
	}
}
// 领取记录
export const receiveCouponRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/receiveCouponRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 使用记录
export const useCouponRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCoupon/useCouponRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
