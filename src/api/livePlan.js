import request from '@/utils/interceptor/request'

// 直播计划列表
export const getLivePlanPageList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/getLivePlanPageList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 创建直播计划
export const addLivePlan = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/addLivePlan.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 直播计划详情
export const getLivePlanById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/getLivePlanById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑直播计划
export const updateLivePlan = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/updateLivePlan.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 删除直播计划
export const deleteLivePlan = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/deleteLivePlan.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 禁用直播
export const disableLivePlan = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/livePlan/disableLivePlan.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 人气值调整
export const addLiveCount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/livePlan/addPopularValue.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 获取有效的优惠券列表
export const getValidCouponPage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/getValidCouponPage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑商品
export const editLiveGoods = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/editLiveGoods.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑商品详情
export const getGroupAndCouponData = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/getGroupAndCouponData.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 导出直播数据
export const exportLiveDatas = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/exportLiveDatas.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 获取直播数据列表
export const getLiveDatas = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/getLiveDatas.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 直播计划导入文件
export const uploadUsers = (data, custom = {}) => {
	return request.request({
		// url: '/yhtplus/livePlan/uploadUsers.action',
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/livePlan/uploadUsers.action`,
		method: 'post',
		data,
		custom,
	})
}

// 获取小程序二维码图片路径
export const generateVieweCode = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/generateVieweCode.action',
		method: 'post',
		data,
		custom,
	})
}

// 编辑直播计划引流商品图片
export const drainageImage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/drainage-image/update.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 直播关联商品列表
export const goodsList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/goods/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 保存直播关联商品列表
export const saveGoods = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/goods/save.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 直播关联商品排序
export const goodsListSort = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/goods/list/sort.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 根据分组删除直播关联的商品
export const deleteByGoods = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/goods/delete/by-goods-group.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 直播营销工具气泡配置
export const editConfiguation = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/configuration/edit.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 禁用直播计划
export const disableLivePlanV2 = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/disableLivePlanV2.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//保存紧急维护内容
export const setHotfixContent = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/livePlan/switchLivePlan.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
