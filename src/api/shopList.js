import request from '@/utils/interceptor/request'
/*
 * -----------------------------------店铺列表----------------------------------------
 */
// 获取店铺标签列表
export const getOrganizationTag = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/getOrganizationTag.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 店铺详情
export const getOrganizationDetails = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/getOrganizationDetails.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//获取店铺等级
// export const getLevelByCondition = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/yhtPlusCmsLevel/getLevelByCondition.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// }
//获取部门列表
export const getDepartmentList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/department/getDepartmentList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//获取店铺列表
export const getOrganizationListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/getOrganizationListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//店铺打标
export const addOrganizationTagToOrganization = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/systemConfiguration/addOrganizationTagToOrganization.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//生成邀请码
export const batchAddInviteCodeByOrganizationId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsInviteCode/batchAddInviteCodeByOrganizationId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//禁用/启用店铺
export const batchOperateOrganizationList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/batchOperateOrganizationList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//注销店铺
export const deleteOrganizations = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/deleteOrganizations.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//更新店铺等级
export const updateOrganizationLevel = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsLevel/updateOrganizationLevel.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//设置维护部门
export const bindDepartmentId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/bindDepartmentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

//导入维护部门
export const importToBindDepartmentId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importToBindDepartmentId.action',
		method: 'post',
		data,
		custom,
	})
}
//导入邀请二维码
export const impostInviteCodeBatch = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostInviteCodeBatch.action',
		method: 'post',
		data,
		custom,
	})
}
//导入店铺标签
export const importAddOrganizationTagToOrganization = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importAddOrganizationTagToOrganization.action',
		method: 'post',
		data,
		custom,
	})
}
