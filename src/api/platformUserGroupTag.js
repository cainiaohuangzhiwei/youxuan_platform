import request from '@/utils/interceptor/request'

// 获取用户分群列表
export const getUserTagList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsBackendBase/selectUserTagList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 新增用户分群
export const addUserTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsBackendBase/addUserTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 用户分群导入excel
export const importUserTagRelation = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus-import/yhtplus/webImport/importUserTagRelation.action`,
		method: 'post',
		data,
		custom,
	})
}

// 更新状态
export const updateUserTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsBackendBase/updateUserTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 刷新缓存
export const refreshRedisCache = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cms/user-tag/refreshUserTagsRedisCache.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 查询人群列表
export const userGroupConfigList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/userGroupConfig/list',
		method: 'post',
		data,
		custom,
	})
}

// 新增或编辑用户分群规则
export const saveOrUpdate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/userGroupConfig/saveOrUpdate',
		method: 'post',
		data,
		custom,
	})
}

// 人群画像分布预估
export const viewProfile = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/userGroupConfig/viewProfile',
		method: 'post',
		data,
		custom,
	})
}

// 通过id删除人群
export const removeById = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-rule-rest-fors/userGroupConfig/removeById',
		method: 'post',
		data,
		custom,
	})
}
