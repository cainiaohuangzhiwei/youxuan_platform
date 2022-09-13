/*****************  STEP 2 ******************* */
// 触发类型映射， 定时型: 1, 触发型-完成某动作: 2
export const TRIGGER_TYPE = {
	TIMING: 0,
	ACTION: 1,
}

// 选择类型 单次: 0, 重复: 1
export const EXECUTE_TYPE = {
	ONCE: 0,
	REPEAT: 1,
}

// 触发执行限制时间指标 0：每日 1：每周 2：每月 3: 每用户
export const LIMITTRIGGER = {
	DAY: 0,
	WEEK: 1,
	MONTH: 2,
	USER: 3,
}

export const LIMITTRIGGER_MAP = {
	[LIMITTRIGGER.DAY]: '每日',
	[LIMITTRIGGER.WEEK]: '每周',
	[LIMITTRIGGER.MONTH]: '每月',
	[LIMITTRIGGER.USER]: '每用户',
}

/*****************  STEP 3 ******************* */
// 营销时间(发送类型)0：实时发送，1：定时发送
export const SEND_TYPE = {
	IMMEDIATELY: 0,
	TIMING: 1,
}

// 编辑类型， 1：奖励 2：触达
export const EDIT_TYPE = {
	AWARD: 1,
	REACH: 2,
}

// 奖励类型映射
export const AWARD_TYPE = {
	COUPON: 0,
}

// 触达类型映射, 1: 短信, 2: 模板信息
export const REACH_TYPE = {
	SMS: 0,
	TEMPLATE: 1,
}
