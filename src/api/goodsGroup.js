import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 获取分组列表
export const getGoodsGroupListByConditionForCMS = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/getGoodsGroupListByConditionForCMS.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取分组列表
export const getGoodsGroupListByConditionWithoutPrivilege = (
	data,
	custom = {}
) => {
	return request.request({
		url:
			'/yhtplus/goodsGroup/getGoodsGroupListByConditionWithoutPrivilege.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 获取活动专区选择列表
export const getGoodsGroupListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/getGoodsGroupListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 清除锁库
export const refreshGoodsGroupLockingStock = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/refreshGoodsGroupLockingStock.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取营销活动分组列表
export const getGoodsGroupListByConditionForPromotion = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/getGoodsGroupListByConditionForPromotion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 创建优口令
export const createWordCommand = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/createWordCommand.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除分组
export const deleteGoodsGroupByGoodsGroupId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/deleteGoodsGroupByGoodsGroupId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 合成封面图
export const createGoodsGroupComPositePicture = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/createGoodsGroupComPositePicture.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑分组
export const updateGoodsGroupByGoodsGroupId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/updateGoodsGroupByGoodsGroupId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增分组
export const addGoodsGroupByOrganizationId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/addGoodsGroupByOrganizationId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取分组中不发货地区列表
export const getGoodsGroupNotdeliverAreaList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/getGoodsGroupNotdeliverAreaList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 刷新营销活动缓存
export const handleActDiscountRedis = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/handleActDiscountRedis.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 分组换图片
export const exchangeImageByGoodsGroupId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/exchangeImageByGoodsGroupId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取促销活动标签列表
export const getCampaigns = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/campaigns.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

export const arbitrationExport = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesArbitration/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})

export const exportByCondition = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/goodsGroup/fors/exportByCondition',
		method: 'post',
		// responseType: 'arraybuffer',
		data,
		dataType: 'json',
		custom,
	})
}

export const importGoodsGroupSortOrder = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-genius-supplier-service/goodsGroup/fors/importGoodsGroupSortOrder`,
		method: 'post',
		data,
		custom,
	})
}
