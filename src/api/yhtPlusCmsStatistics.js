import request from '@/utils/interceptor/request'
/*
 * -----------------------------------统计----------------------------------------
 */
// 店铺销售统计

export const getCMSOrganizationStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSOrganizationStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 导出销售额
export const exportCMSOrganizationStatistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/exportCMSOrganizationStatistics.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

//品牌销售统计
export const getCMSGoodsGroupOrderStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSGoodsGroupOrderStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 导出品牌销售统计
export const exportCMSGoodsGroupOrderStatistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/exportCMSGoodsGroupOrderStatistics.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

//分组商品销售统计
export const getCMSGoodsGroupSalesStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSGoodsGroupSalesStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

//规格销售统计
export const getSpecSaleStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getSpecSaleStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 导出规格销售统计
export const exportCMSGoodsGroupSalesStatistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/exportCMSGoodsGroupSalesStatistics.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

//分组销售统计
export const getGoodsGroupStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getGoodsGroupStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 导出分组销售统计
export const exportGoodsGroupStatistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/exportGoodsGroupStatistics.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 邀请码统计
export const getCMSInviteCodeStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSInviteCodeStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 邀请码使用列表
export const getInviteCodeUseList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getInviteCodeUseList.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 用户群ID
export const getWechatUserGroupListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getWechatUserGroupListByCondition.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 导出用户群ID
export const exportWechatUserGroupListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/exportWechatUserGroupListByCondition.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 注册店主统计
export const getCMSOrganizationForRigester = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSOrganizationForRigester.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 店主留存率统计
export const getCMSOrganizationLossStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSOrganizationLossStatistics.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 店主留存率统计
export const getOrganizationConversionKanban = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getOrganizationConversionKanban.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// 导出用户群ID
export const exportOrganizationConversion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportOrganizationConversion.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 商品类目利润统计

export const getCMSClassifyReservationList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSClassifyReservationList.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

//服务商/VIP统计
export const getCMSOrganizationVIPAndServiceForRigester = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/getCMSOrganizationVIPAndServiceForRigester.action',
		method: 'post',
		data: data,
		custom: custom,
		dataType: 'form',
	})

// // 品牌预约统计列表
// export const getCMSBrandReservationStatistics = (data, custom = {}) =>
// 	request.request({
// 		url:
// 			'/yhtplus/yhtPlusCmsStatistics/getCMSBrandReservationStatistics.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 品牌预约详情
// export const getCMSBrandReservationList = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsStatistics/getCMSBrandReservationList.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// 导出优惠券统计
export const exportCMSYXCouponStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsStatistics/exportCMSYXCouponStatistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
