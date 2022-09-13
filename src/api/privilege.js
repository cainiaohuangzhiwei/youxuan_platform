import request from '@/utils/interceptor/request'

// 角色列表
export const getRoleList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/privilege/getRoleList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 权限列表
export const getRoleFunctionListByRoleId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/privilege/getRoleFunctionListByRoleId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑角色权限
export const updateRoleFunctionListByRoleId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/privilege/updateRoleFunctionListByRoleId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 根据角色ID删除角色
export const deleteRoleByRoleId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/privilege/deleteRoleByRoleId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 根据角色ID编辑角色
export const updateRoleByRoleId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/privilege/updateRoleByRoleId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 添加角色
export const addRole = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/privilege/addRole.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
