import fetchWithSign from '@/utils/interceptor/request'
// 店主上级更改列表
export const relationPage = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/org-relation-update/page',
		method: 'post',
		data,
		custom,
	})
}
// 店主上级更改新增
export const relationcreate = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/org-relation-update/create',
		method: 'post',
		data,
		custom,
	})
}
// 店主上级更改审核
export const relationModify = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/org-relation-update/modify',
		method: 'post',
		data,
		custom,
	})
}
// 查看日志
export const relationLog = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/org-relation-update/log',
		method: 'post',
		data,
		custom,
	})
}
// 获取店主信息
export const relationGetOrg = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/org-relation-update/get-org-info',
		method: 'post',
		data,
		custom,
	})
}

// 获取店主信息
export const relationTeamCount = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/org-relation-update/team-count',
		method: 'post',
		data,
		custom,
	})
}

// 机器人-调研反馈
export const researchFeedbackList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-bullet-shopkeeper-upms/research/page',
		method: 'post',
		data,
		custom,
	})
}

// 机器人-调研反馈-导出
export const researchFeedbackExport = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-shopkeeper-upms/research/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
}
// 获取用户注销记录列表
export const listByParam = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-shopkeeper-upms/shopkeeper/userCancellationRecord/listByParam',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
