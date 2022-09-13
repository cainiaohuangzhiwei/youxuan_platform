import request from '@/utils/interceptor/request'
// 抽奖活动相关接口

// 新增/编辑奖品
export const savePrize = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/save/prize.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 抽奖活动列表
export const getLotteryList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 抽奖活动禁用/启动
export const setLottery = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery/set.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 创建抽奖
export const addLottery = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery/add.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 对应抽奖活动中奖名单列表
export const winnerList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery/winner/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 中奖名单导出excel表格
export const winnerExport = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery/winner/export.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}

// 创建抽奖-奖品列表按过滤条件
export const prizeListWithFilter = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/prize-list/with-filter.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 奖品列表
export const queryPrizeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/page/query/prize-list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 禁用之前的已启动抽奖活动，开启当前选择的抽奖活动
// export const confirmLottery = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/lottery/confirm.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// }

//查询是否存在启动中的活动
export const getProgress = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery/getProgress.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 直播关联抽奖-条件过滤后的抽奖活动分页列表
export const lotteryListWithFilter = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery-list/with-filter.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 直播关联抽奖详情
export const lotteryActivityGetDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery-activity/getDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 保存直播关联抽奖活动
export const lotteryActivitySave = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/lottery-tool/lottery-activity/lotteryActivitySave.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
