import request from '@/utils/interceptor/request'
/*
 * ----------------------------------消息中心----------------------------------------
 */
/**
 * @Description: 创建模板--done
 * @param {String} channelCode 参见推送渠道 https://weeget.feishu.cn/docs/doccnxOX9hlsWqOtxLxuxdlCaPg#qY4mtT
 * @param {String} templateName 模板名称 模板名称不能重复。
 * @param {String} keyword 关键词 可以在创建模板的时候自定义关键词，方便后续查询。
 * @param {String} templateContent 模板内容
 * @param {String} outTemplateId 第三方模板ID
 * @param {String} optName 操作人员
 * @return {type} {*}
 */
export const createTemplate = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/message-template/create',
		method: 'post',
		data,
		custom,
	})
}
// 修改模板--done
export const modifyTemplate = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/message-template/modify',
		method: 'post',
		data,
		custom,
	})
}

/**
 * @Description: 查询模板列表--done
 * @param {String} channelCode 推送渠道编码
 * @param {String} templateName 可输入名称模糊查找
 * @param {String} keyword 关键词 可输入关键词模糊查找
 * @param {String} templateStatus 模板状态 ENABLE：启用 DISABLE：禁用
 * @param {String} limit 最大资源条数 该次请求可返回的最大资源（消息模板）条数，最小20条，最大100条，不传则默认20条。不足20条按实际条数返回
 * @param {Number} offset 请求资源起始位置 该次请求资源（消息模板）的起始位置，从0开始，消息模板列表为空时不返回
 */
export const queryTemplateList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/message-template/query',
		method: 'post',
		data,
		custom,
	})
}

//推送任务恢复/取消
export const weixinPushTaskHandler = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/lightspeed/wechat-push-task/weixin-pushTask-handler',
		method: 'post',
		data,
		custom,
	})
}

//推送任务列表
export const weixinPushTaskList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/lightspeed/wechat-push-task/weixin-pushTask-list',
		method: 'post',
		data,
		custom,
	})
}
//订阅模板数据列表查询
export const weixinTemplateList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/lightspeed/wechat-template/weixin-template-list',
		method: 'post',
		data,
		custom,
	})
}
//订阅模板数据列表查询 - 重构接口
export const subscribeCountPage = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/subscribe-count/page',
		method: 'post',
		data,
		custom,
	})
}

//推送任务创建
export const weixinPushTaskCreate = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/lightspeed/wechat-push-task/weixin-pushTask-create',
		method: 'post',
		data,
		custom,
	})
}
//推送任务
export const weixinPushExecute = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/lightspeed/wechat-push-task/weixin-push-execute',
		method: 'post',
		data,
		custom,
	})
}

//编辑推送任务
export const weixinPushTaskEdit = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/lightspeed/wechat-push-task/weixin-pushTask-edit',
		method: 'post',
		data,
		custom,
	})
}
//修改模板状态
export const updateStatus = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/message-template/update-status',
		method: 'post',
		data,
		custom,
	})
}
//查询定制模板
export const queryTarget = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/message-template/query-target',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//定制任务-创建
export const customCreate = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/task/custom-create',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//定制任务-更新
export const customUpdate = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/task/custom-update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//定制任务-分页查询
export const customPage = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/task/custom-page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//定制任务-查看
export const customView = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/task/custom-view',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//定制任务-取消
export const customCancel = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/task/custom-modify-status',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//查看消息模板
export const customCiew = (data, custom = {}) => {
	return request.request({
		url: 'weeget-infinite-lightspeed-rest/message-template/view',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
