import request from '@/utils/interceptor/request'
// 优惠券列表接口
export const findCouponListByParam = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/findCouponListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 新增优惠券
export const addCoupon = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/addCoupon.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 优惠券相关api重构开关接口
export const couponSwitchPart14 = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/coupon/switch/part14',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 编辑优惠券
export const updateCoupon = async (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/updateCoupon.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 优惠券启用禁用
export const closeOrOpenCoupon = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/coupon/closeOrOpenCoupon',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 优惠券上下架
export const updateCouponShelfState = async (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/updateCouponShelfState.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 修改优惠发放数量
export const updateGrantQuantity = async (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/updateGrantQuantity.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 选择店主接口
export const getOrganizationListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/getOrganizationListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 选择用户接口
export const getWeixinUserListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsUser/getWeixinUserListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 导入excel接口
export const impostCouponExcel = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/couponImport/impostCouponExcel.action`,
		method: 'post',
		data,
		custom,
	})
}

// 派发优惠券
export const distributeCouponManual = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/distributeCouponManual.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// new派发优惠券
export const distributeCouponManualForAudit = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/distributeCouponManualForAudit.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

export const getGoodsGroupListByConditionForCMS = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/getGoodsGroupListByConditionForCMS.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//找某个商家下面的会场
export const getSupplierBrandList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/getSupplierBrandList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//S端优惠券-查询商品列表
export const getGoodsListByAddCoupon = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/getGoodsListByAddCoupon.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 同步AKC优惠卷
export const syncCoupon = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/coupon/syncCoupon',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 修改AKC优惠卷名称
export const updateCouponName = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/coupon/updateCouponName',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新-优惠券列表
export const queryYxCouponInfoBatch = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/couponInfo/queryYxCouponInfoBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新-添加优惠券
export const addYxCouponInfoToYhtPlus = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/couponInfo/addYxCouponInfoToYhtPlus',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新-编辑优惠券
export const updateYxCouponInfoToYhtPlus = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/couponInfo/updateYxCouponInfoToYhtPlus',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 优惠券详情
export const getYxCouponInfoToYhtPlus = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/couponInfo/getYxCouponInfoToYhtPlus',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新-查询档期
export const queryGoodsGroupInfoBySupplierId = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-goods-rest-fors/goodsGroup/queryGoodsGroupInfoBySupplierId',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//优惠券-校验密码
export const checkCouponPassword = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCoupon/checkCouponPassword.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 用户运营可派发优惠券列表(只查启用并处于上架状态的优惠券)
export const queryUoStrategyYxCouponInfoBatch = (data = {}, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-coupon-rest-fors/couponInfo/queryUoStrategyYxCouponInfoBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
