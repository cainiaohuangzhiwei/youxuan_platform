import request from '@/utils/interceptor/request'
// 多件促销查询活动列表
export const getActMorePromotion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActMorePromotion/getActMorePromotion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 多件促销新增活动
export const saveActMorePromotion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActMorePromotion/saveActMorePromotion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 多件促销结束活动
export const updateActState = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActMorePromotion/updateActState.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 多件促销刷新缓存
export const handleMorePromotionRedis = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/handleMorePromotionRedis.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 多件促销编辑
export const updateActMorePromotion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActMorePromotion/updateActMorePromotion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 基础配置
export const getActMorePromotionImageAndContent = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus/weiXinMorePromotion/getActMorePromotionImageAndContent.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 保存基础配置
export const addActContentAndImage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActMorePromotion/addActContentAndImage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
