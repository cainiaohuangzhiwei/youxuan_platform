// 0等于/1大于/2大于等于/3小于/4小于等于/5不等于/6有值/7无值
export const CONDITION_STATUS = {
	EQUAL: 0,
	GREATER: 1,
	GREATER_EQUAL: 2,
	LESS: 3,
	LESS_EQUAL: 4,
	NOT_EQUAL: 5,
	HAS_VALUE: 6,
	NO_VALUE: 7,
}

// 普通条件类型映射
export const NORMAL_CONDITION = [
	{
		label: '等于',
		value: CONDITION_STATUS.EQUAL,
	},
	{
		label: '大于',
		value: CONDITION_STATUS.GREATER,
	},
	{
		label: '大于等于',
		value: CONDITION_STATUS.GREATER_EQUAL,
	},
	{
		label: '小于',
		value: CONDITION_STATUS.LESS,
	},
	{
		label: '小于等于',
		value: CONDITION_STATUS.LESS_EQUAL,
	},
	{
		label: '不等于',
		value: CONDITION_STATUS.NOT_EQUAL,
	},
	// {
	// 	label: '有值',
	// 	value: CONDITION_STATUS.HAS_VALUE,
	// },
	// {
	// 	label: '无值',
	// 	value: CONDITION_STATUS.NO_VALUE,
	// },
]

// 字典条件类型映射
export const DICT_CONDITION = [
	{
		label: '等于',
		value: CONDITION_STATUS.EQUAL,
	},
	{
		label: '不等于',
		value: CONDITION_STATUS.NOT_EQUAL,
	},
	// {
	// 	label: '有值',
	// 	value: CONDITION_STATUS.HAS_VALUE,
	// },
	// {
	// 	label: '无值',
	// 	value: CONDITION_STATUS.NO_VALUE,
	// },
]

// 属性类型映射 属性类型：0：整数 ，1：小数，2：日期，3：字典'
export const ATTRIBUTE_TYPE = {
	INTEGER: 0,
	DECIMAL: 1,
	DATE: 2,
	DICT: 3,
}

// 关联类型映射
export const RELATION_TYPE = {
	OR: 0,
	AND: 1,
	NOT: 2,
}

// 关联选项映射
export const RELATION_OPTION = [
	{
		label: '或',
		value: RELATION_TYPE.OR,
	},
	// {
	// 	label: '且',
	// 	value: RELATION_TYPE.AND,
	// },
	{
		label: '非',
		value: RELATION_TYPE.NOT,
	},
]

// 关联项映射 关联项 商品值0 档期值1 鲁班页值2
export const CORRELATION_TYPE = {
	GOODS: 0,
	BRANDS: 1,
	LUBAN_ACTIVITY: 2,
}

export const CORRELATION_OPTION = {
	[CORRELATION_TYPE.GOODS]: '商品',
	[CORRELATION_TYPE.BRANDS]: '档期',
	[CORRELATION_TYPE.LUBAN_ACTIVITY]: '鲁班活动页',
}

// 字典值 1实习/2正式/3进阶/4优服/5签服
export const DICT_VALUE = {
	PRACTICE: 1,
	FORMAL: 2,
	ADVANCED: 3,
	EXCELLENT: 4,
	SIGNED: 5,
}

export const DICT_OPTION = {
	[DICT_VALUE.PRACTICE]: '实习店主',
	[DICT_VALUE.FORMAL]: '正式店主',
	[DICT_VALUE.ADVANCED]: '进阶店主',
	[DICT_VALUE.EXCELLENT]: '优服服务商',
	[DICT_VALUE.SIGNED]: '签服服务商',
}
