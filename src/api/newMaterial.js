import request from '@/utils/interceptor/request'
// 品牌素材列表查询
export const brandParentMaterialList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/brandParent/material/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 品牌素材删除
export const brandParentMaterialDelete = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/brandParent/material/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 分页搜索品牌是否关联素材
export const searchBrandParent = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/brandParent/material/searchBrandParent',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 品牌素材详情
export const brandParentDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/brandParent/material/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 品牌素材新增/编辑
export const brandParentSave = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/brandParent/material/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动列表
export const activityInfoList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/info/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动删除
export const activityInfoDelete = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/info/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动统计
export const activityInfoStatistics = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/info/statistics',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动新增
export const activityInfoAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/info/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动编辑
export const activityInfoEdit = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/info/edit',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材列表
export const activityContentList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/content/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动名称详情
export const activityInfoDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/info/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材详情
export const activityContentDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/content/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材新增
export const activityContentAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/content/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 品牌列表分页
export const brandParentList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/brandParent/material/listForActivityMaterialInfo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 商品列表查询
export const goodsList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/listForActivityMaterialInfo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 活动素材删除
export const activityContentDelete = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/content/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 活动素材编辑
export const activityContentEdit = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/material/content/edit',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// S端 商品素材管理-顶部通用数据统计返回对象
export const goodsMaterialStatistics = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/statistics',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// S端 商品素材管理-分页查询商品素材
export const goodsMaterialPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// S端 商品素材管理-查看商品所有组素材详情
export const goodsMaterialAll = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/all',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//会场
export const getGoodsGroupListByConditionForCMS = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/goodsGroup/getGoodsGroupListByConditionForCMS.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// S端 商品素材管理-批量新增商品素材所有组素材
export const goodsMaterialSave = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/save/batch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// S端 商品素材管理-删除商品素材单组素材
export const goodsMaterialDelSingle = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/delete/single',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// S端 商品素材管理-编辑商品素材单组素材
export const goodsMaterialUpdate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
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
//S端 分页查询虚拟店主
export const virtualShopkeeperPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/virtual/shopkeeper/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//S端 虚拟店主新增/编辑
export const virtualShopkeeperSave = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/virtual/shopkeeper/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//S端 虚拟店主 删除
export const virtualShopkeeperDel = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/virtual/shopkeeper/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//S端 商品素材库->机器人素材-群聊名称列表
export const robotMaterialNameList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/robot/material/queryGroupChatNameList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//S端 商品素材库->机器人素材-分页查询机器人素材
export const robotMaterialList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/robot/material/queryRobotMaterialList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//S端 商品素材库->档期素材管理列表
export const goodsGroupMaterialPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goodsGroup/material/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//S端 商品素材批量同步第三方异步
export const materialSynchrodataBatch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/synchrodata/batch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//S端 商品素材同步第三方异步
export const materialSynchrodata = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/synchrodata',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 家族群配置列表
export const mentorList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/mentor/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 家族群配置编辑、删除码
export const mentorUpdate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/mentor/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 素材信息列表查询（分页）
export const queryListByPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/queryListByPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 批量新增素材信息
export const addMaterialToBatch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/addToBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 删除素材信息
export const deleteMaterial = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 批量查询活动素材信息
export const queryActivityListToBatch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/queryActivityListToBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 批量查询商品素材信息
export const queryGoodsListToBatch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/queryGoodsListToBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 修改素材信息
export const updateMaterial = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新增素材分类
export const addMaterialClassify = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/materialClassify/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 素材分类列表查询（分页）
export const queryMaterialClassifyListByPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/materialClassify/queryListByPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 素材应用置顶
export const materialUseUpdateTop = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/materialUseUpdateTop',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 修改素材分类
export const updateMaterialClassify = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/materialClassify/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 导出素材
export const exportGoodsMaterialWord = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/exportGoodsMaterialWord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
		responseType: 'arraybuffer',
	})
}

// 素材应用统计信息
export const materialUseStatistical = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/material/materialUseStatistical',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
