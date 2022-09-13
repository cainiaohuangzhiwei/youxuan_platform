import fetchWithSign from '@/utils/interceptor/request'
/*
 * -----------------------------------ab测试业务查询---------------------------------------
 *
 */
// 查询测试列表
export const getTestList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/test/queryList',
		method: 'post',
		data,
		custom,
	})
}

// 查询测试下的实验列表
export const getExprimentList = (params, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/experiment/getListByTestId',
		method: 'post',
		params,
		data: params,
		custom,
	})
}

// 查询实验的详细内容
export const getExprimentInfo = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/experiment/get',
		method: 'get',
		data,
		custom,
	})
}

// 查询策略列表
export const getStrategyListByExperimentId = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/strategy/getListByExperimentId',
		method: 'post',
		data,
		custom,
	})
}

// 新增修改测试
export const addOrUpdate = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/test/addOrUpdate',
		method: 'post',
		data,
		custom,
	})
}

// 添加或修改策略信息
export const addOrUpdateStrategy = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/strategy/addOrUpdate',
		method: 'post',
		data,
		custom,
	})
}

// 查询策略变量列表
export const getVariableListByExperimentId = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/variable/getListByExperimentId',
		method: 'post',
		data,
		custom,
	})
}

// 添加或修改策略变量信息
export const addOrUpdateVariable = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/variable/addOrUpdate',
		method: 'post',
		data,
		custom,
	})
}

//更新实验
export const addOrUpdateExperiment = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/experiment/addOrUpdate',
		method: 'post',
		data,
		custom,
	})
}

//删除实验
export const deleteExperiment = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/experiment/delete',
		method: 'post',
		data,
		custom,
	})
}

//删除策略
export const deleteStrategy = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/strategy/deleteByExperimentId',
		method: 'post',
		data: data,
		custom,
	})
}

//删除变量
export const deleteVariable = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/variable/delete',
		method: 'post',
		data: data,
		custom,
	})
}
// 保存主测试设置的白名单
export const whiteListSave = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/enabledList/save',
		method: 'post',
		data,
		custom,
	})
}
// 查询白名单列表
export const getWihteListByTestId = (params, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-abtest-rest/enabledList/listByTestId',
		method: 'post',
		// params,
		data: params,
		custom,
	})
}
