/**
 * @description 编辑状态
 */
export const taskStatusMap = {
	CREATE: 1,
	EDIT: 2,
	DETAIL: 3,
}

/**
 * @description 推送渠道类型
 */
export const channelMap = {
	ALL: '',
	MINI: 'WECHAT_MINI_PROGRAM',
	OFFICIALACCOUNT_C: 'WECHAT_OFFIACCOUNT_C',
	OFFICIALACCOUNT_B: 'WECHAT_OFFIACCOUNT_B',
	SMS: 'SMS',
}

/**
 * @description 推送渠道名称
 */
export const channelNameMap = {
	[channelMap.ALL]: '推送渠道',
	[channelMap.SMS]: '短信',
	[channelMap.MINI]: '小程序',
	[channelMap.OFFICIALACCOUNT_C]: '公众号-云货优选',
	[channelMap.OFFICIALACCOUNT_B]: '公众号-云货优选店主',
}

/**
 * @description 推送筛选
 */

export const FILTER_STATUS_VALUE = {
	ALL: '',
	CREATED: 'CREATED',
	PROCESS: 'PROCESS',
	FINISH: 'FINISH',
	CANCEL: 'CANCEL',
	FAIL: 'FAIL',
}
export const FILTER_STATUS_MAP = {
	[FILTER_STATUS_VALUE.ALL]: '任务状态',
	[FILTER_STATUS_VALUE.CREATED]: '待推送',
	[FILTER_STATUS_VALUE.PROCESS]: '推送中',
	[FILTER_STATUS_VALUE.CANCEL]: '已取消',
	[FILTER_STATUS_VALUE.FINISH]: '推送完成',
	[FILTER_STATUS_VALUE.FAIL]: '推送失败',
}

export const BUTTONS_STATUS = {
	[FILTER_STATUS_VALUE.CREATED]: 'info',
	[FILTER_STATUS_VALUE.PROCESS]: 'primary',
	[FILTER_STATUS_VALUE.FINISH]: 'success',
	[FILTER_STATUS_VALUE.CANCEL]: 'warning',
	[FILTER_STATUS_VALUE.FAIL]: 'danger',
}

// 人群来源：USER_TAG-用户标签系统，USER_GROUP-用户规则系统，USER_OPERATION-用户运营中台
export const USER_SOURCE_TAG = {
	USER_TAG: '用户标签系统',
	USER_GROUP: '用户规则系统',
	USER_OPERATION: '用户运营中台',
}
