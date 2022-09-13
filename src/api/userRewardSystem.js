import request from '@/utils/interceptor/request'

// 活动奖励规则列表
export const actSaleRewardList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/actSaleRewardList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 创建活动奖励规则
export const createActSaleReward = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/createActSaleReward.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑活动奖励规则
export const editActSaleReward = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/editActSaleReward.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 结束活动奖励规则
export const finishActSaleReward = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/finishActSaleReward.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 查看活动奖励规则
export const viewActSaleReward = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/viewActSaleReward.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 活动奖励规则-参与用户
export const viewActSaleRewardUser = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/viewActSaleRewardUser.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 活动奖励规则-参与用户明细
export const viewActSaleRewardUserDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/viewActSaleRewardUserDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 活动奖励规则详情列表
export const detailsList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/actSaleRewardDetailList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商家列表
export const getSupplierList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/getSupplierList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商品列表
export const getGoodsList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/getGoodsList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 查看活动奖励参与范围
export const viewActSaleRewardTargetList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActSaleReward/viewActSaleRewardTargetList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 活动奖励配置列表
export const queryActSaleRewardEntrancePage = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus/yhtPlusActSaleRewardEntrance/queryActSaleRewardEntrancePage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 活动入口列表
export const queryActEntrancePage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActEntrance/queryActEntrancePage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 启动、结束活动入口
export const operateActEntranceStatus = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActEntrance/operateActEntranceStatus.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 查询活动入口信息
export const getPlatformActEntrance = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActEntrance/getPlatformActEntrance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑活动入口
export const updateActEntrance = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusActEntrance/updateActEntrance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取品牌列表
export const getBrandParentList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusWebGoods/getBrandParentList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 创建活动奖励配置
export const createActSaleRewardEntrance = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus/yhtPlusActSaleRewardEntrance/createActSaleRewardEntrance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 编辑活动奖励配置
export const updateActSaleRewardEntrance = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus/yhtPlusActSaleRewardEntrance/updateActSaleRewardEntrance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 查看活动奖励配置
export const getActSaleRewardEntrance = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus/yhtPlusActSaleRewardEntrance/getActSaleRewardEntrance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 结束活动奖励配置
export const closeActSaleRewardEntrance = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus/yhtPlusActSaleRewardEntrance/closeActSaleRewardEntrance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

export const platformActList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/kb-platform-activity/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

export const platformActUpdate = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/kb-platform-activity/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

export const platformActSave = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/kb-platform-activity/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//平台活动配置分页列表
export const getPlatActPageConfList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/platActPageConf/getPlatActPageConfList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//新增平台活动配置
export const addPlatActPageConf = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/platActPageConf/addPlatActPageConf',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//编辑平台活动配置
export const updatePlatActPageConf = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/platActPageConf/updatePlatActPageConf',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//平台活动配置详情
export const getPlatActPageConfDetail = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/platActPageConf/getPlatActPageConfDetail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//关闭平台活动配置
export const closePlatActPageConf = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/platActPageConf/closePlatActPageConf',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//平台活动奖励列表
export const platFormList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/marketing/act-sale-reward/platFormList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询店主活动奖励记录
export const activityRewardRecord = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userRewardRecord/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询店主活动结算明细列表
export const getListPageOrderSettleItem = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/organizationActivitySettle/listPageOrderSettleItem',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询店主活动奖励结算汇总金额
export const getOrganizationSettleCollectAmount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service//account/organizationActivitySettle/organizationSettleCollectAmount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询账户增加调账记录
export const getAccountWaterList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/accAccountRegulation/marketingRegulation',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//订单奖励活动列表分页
export const listPageMarketingReward = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/listPageMarketingReward',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询奖励活动数据列表分页（聚合）
export const listPageActivityReward = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/listPageActivityReward',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询用户活动详情列表
export const listActivityOrderReward = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/listActivityOrderReward',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

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

// 获取商品分组信息(过滤爱库存和百丽)
export const queryGoodsGroupInfoFilterAKCBatch = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-goods-rest-fors/goodsGroup/queryGoodsGroupInfoFilterAKCBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//保存活动奖励
export const saveActivityReward = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/saveActivityReward',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//通过商品id列表查询会场，档期信息
export const getGoodsGroupSimplerInfoList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/userRewardRecord/getGoodsGroupSimplerInfoList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//关闭活动奖励
export const closeActivityReward = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/closeActivityReward',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//删除活动奖励
export const deleteActivityReward = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/deleteActivityReward',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//修改活动奖励
export const modifyActivityReward = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/modifyActivityReward',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查询订单奖励活动详情
export const getMarketingRewardById = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/getMarketingRewardById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//活动奖励结算列表
export const activityRewardSettlePageList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/activityRewardSettlePageList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//活动奖励结算明细列表
export const activityRewardSettleDetailPageList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/activityRewardSettleDetailPageList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//获取汇总活动奖励金额
export const getSummaryActivityRewardAmount = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/getSummaryActivityRewardAmount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//活动奖励明细导出
export const exportRewardDetailByPlatform = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/exportRewardDetailByPlatform',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'json',
	})
}
// 查询活动结算列表
export const getListActivitySettlement = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/getListActivitySettlement',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询活动结算汇总金额信息
export const getActivitySettlementSummary = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/getActivitySettlementSummary',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询订单奖励活动总金额信息
export const getOrderActivityRewardSummary = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingReward/getOrderActivityRewardSummary',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询销售奖励活动明细
export const getSaleRewardSupplierDetail = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors//activity/marketingSaleReward/getSaleRewardDetail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//销售奖励明细导出
export const exportActivityDetailRecordList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/activity-detail-record-list-export/exportActivityDetailRecordList',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'json',
	})
}
//现金奖励结算明细列表
export const actRewardDetailsToCashBatch = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingSaleReward/actRewardDetailsToCashBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//现金奖励结算明细列表
export const actRewardDetailsToCashSum = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingSaleReward/actRewardDetailsToCashSum',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//优惠券奖励结算明细列表
export const actRewardDetailsToCouponBatch = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingSaleReward/actRewardDetailsToCouponBatch',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//优惠券奖励结算明细列表
export const actRewardDetailsToCouponSum = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingSaleReward/actRewardDetailsToCouponSum',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//现金奖励结算明细导出
export const exportActRewardDetailsToCash = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingSaleReward/exportActRewardDetailsToCash',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})
}
//优惠券奖励结算明细导出
export const exportActRewardDetailsToCoupon = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/activity/marketingSaleReward/exportActRewardDetailsToCoupon',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})
}
