import request from '@/utils/interceptor/request'
// 获取系统设置-店铺标签
export const getOrganizationTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getOrganizationTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取系统设置-敏感词配置
export const getSensitiveWordFilteringList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getSensitiveWordFilteringList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取系统设置-商品配置
export const getGoodsConfiguration = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getGoodsConfiguration.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//品牌列表
export const getBrandListConfiguration = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getBrandListConfiguration.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取系统设置-订单配置
export const getOrderConfiguration = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getOrderConfiguration.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取系统设置-退款单标签
export const getRefundTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getRefundTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新系统设置商品
export const updateGoodsConfiguration = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/updateGoodsConfiguration.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新店铺标签信息
export const updateOrganizationTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/updateOrganizationTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新订单配置信息
export const updateOrderConfiguration = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/updateOrderConfiguration.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新退款单标签信息
export const updateRefundTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/updateRefundTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 更新敏感词
export const updateSensitiveWordFiltering = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/updateSensitiveWordFiltering.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 添加退款单标签
export const addRefundTagToRefund = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/systemConfiguration/addRefundTagToRefund.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
