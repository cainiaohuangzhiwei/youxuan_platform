import request from '@/utils/interceptor/request'
// 场景管理列表
export const rcBizSceneQueryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizScene/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新增场景
export const rcBizSceneAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizScene/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 修改场景信息
export const rcBizSceneUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizScene/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取场景信息
export const rcBizSceneGetById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizScene/getById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 删除场景信息
export const rcBizSceneDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizScene/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据场景id查询场景策略记录列表
export const listBySceneId = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcFlowRuleRecord/listBySceneId',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 下拉对象集合
export const optionsGet = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/options/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询召回规则审核列表
export const rcRecallRuleAuditList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallRuleAudit/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 添加召回规则审核信息
export const rcRecallRuleAuditAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallRuleAudit/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID修改召回规则审核信息
export const rcRecallRuleAuditUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallRuleAudit/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID删除召回规则审核信息
export const rcRecallRuleAuditDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallRuleAudit/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID查询召回规则列表
export const rcRecallRuleList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcRecallRule/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询业务策略审核列表
export const rcBizStrategyAuditQueryList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizStrategyAudit/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 添加业务策略审核信息
export const rcBizStrategyAuditAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizStrategyAudit/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID删除业务策略审核信息
export const rcBizStrategyAuditDeleteById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizStrategyAudit/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID修改业务策略审核信息
export const rcBizStrategyAuditUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizStrategyAudit/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID查询业务策略列表
export const rcBizStrategyList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizStrategy/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 场景发布
export const rcBizSceneReleaseScene = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizScene/releaseScene',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询排序规则
export const rcSortRuleAuditGet = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortRuleAudit/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 添加排序规则审核信息
export const rcSortRuleAuditAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortRuleAudit/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID修改排序规则审核信息
export const rcSortRuleAuditUpdateById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortRuleAudit/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据ID查询排序列表
export const rcSortRuleById = (params, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortRule/getById',
		method: 'get',
		params,
		custom,
		dataType: 'json',
	})
}
// 召回、排序、业务策略修改后更新修改人
export const rcFlowRuleRecordUpdateUser = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcFlowRuleRecord/updateUser',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 操作日志查询
export const rcOptRecordList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcOptRecord/queryList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 清除场景相关信息
export const switchObjectType = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcBizScene/switchObjectType',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 最新的版本
export const newFlowRule = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcFlowRule/newFlowRule',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据flowRuleId查询排序规则
export const rcSortRuleGet = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSortRule/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 根据flowRuleId查询流量规则信息
export const rcFlowRuleGet = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcFlowRule/getById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 提交审核
export const rcShopSceneAuditAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopSceneAudit/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 编辑权限检查
export const shopSceneIsEditAuth = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopScene/shopSceneIsEditAuth',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 查询是否存在待审核版本
export const getByWaitingAudit = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcShopSceneAudit/getByWaitingAudit',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 搜索规则审核
export const auditAdd = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchRuleAudit/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 搜索规则审核
export const updateByIdSearch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchRuleAudit/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询搜索服务
export const rcSortRuleAuditGetSearch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchRuleAudit/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询搜索信息
export const rcSearchRuleSearch = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/rcSearchRule/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
//查询人群列表
export const userGroupConfigList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/userGroupConfig/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
