import request from '@/utils/interceptor/request'
/*
 * -----------------------------------部门----------------------------------------
 */
// 部门列表
export const getDepartmentList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/department/getDepartmentList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 根据id查部门微信号
export const getDepartmentWechatCode = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/department/getDepartmentWechatCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 修改部门微信号
export const updateDepartmentWechatCode = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/department/updateDepartmentWechatCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑部门
export const updateDepartmentByDepartmentId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/department/updateDepartmentByDepartmentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除部门
export const deleteDepartmentByDepartmentId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/department/deleteDepartmentByDepartmentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增部门
export const addDepartment = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/department/addDepartment.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
