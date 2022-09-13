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
	MINI: 1,
	OFFICIALACCOUNT_C: 2,
	OFFICIALACCOUNT_B: 3,
}

/**
 * @description 推送渠道名称
 */
export const channelNameMap = {
	[channelMap.MINI]: '小程序',
	[channelMap.OFFICIALACCOUNT_C]: '公众号-云货优选',
	[channelMap.OFFICIALACCOUNT_B]: '公众号-云货优选店主',
}
