import request from '@/utils/interceptor/request'

// 用户奖励活动列表分页
export const listPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userCashReward/listPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查询用户奖励活动详情
export const getDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userCashReward/getDetail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 保存或修改活动
export const saveOrUpdate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userCashReward/saveOrUpdate',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动数据记录列表
export const userListPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userCashReward/user/listPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动数据汇总数据
export const sumCashRewardAmount = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userCashReward/user/sumCashRewardAmount',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动数据汇总数据导出
export const sumCashRewardAmountExport = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userCashReward/user/sumCashRewardAmount/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
}

// 修改活动结算时间
export const updateActSettleTime = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/activity/userCashReward/updateActSettleTime',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 分页-查询签到兑换表
export const signinExchangeList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/signin/act-sign-in-exchange/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 批量审核
export const signinExchangeAudit = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/signin/act-sign-in-exchange/audit',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新增或修改广告位信息
export const advertisingSaveOrUpdate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertising/saveOrUpdate',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询广告位信息
export const advertisingSelectAdvertising = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertising/selectAdvertising',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 弹窗广告列表查询
export const getPopUpsWindowPageList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/popUpsWindowPage/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 更新弹窗广告
export const updatePopUpsWindow = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/popUpsWindowPage/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 添加弹窗广告
export const addPopUpsWindow = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/popUpsWindowPage/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 首页广告列表
export const getStartPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/startPage/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 首页广告数据
export const getStartPageActivityDate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/startPage/getActivityDate',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 添加首页广告列表
export const addStartPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/startPage/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 更新首页广告列表
export const updateStartPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/startPage/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取首页广告详情
export const getStartPageDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/startPage/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新增浮窗广告
export const addFloatWindowPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/floatWindowPage/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取浮窗广告详情
export const getFloatWindowDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/floatWindowPage/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取浮窗广告列表
export const getFloatWindowPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/floatWindowPage/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 更新浮窗广告
export const updateFloatWindowPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/floatWindowPage/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新增启动广告
export const addPopUpsWindowPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/popUpsWindowPage/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取启动广告详情
export const getPopUpsWindowDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/popUpsWindowPage/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取启动广告列表
export const getPopUpsWindowPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/popUpsWindowPage/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 更新启动广告
export const updatePopUpsWindowPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/advertisement/popUpsWindowPage/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
