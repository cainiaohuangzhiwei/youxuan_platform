import request from '@/utils/interceptor/request'
import fetchWithSign from '@/utils/interceptor/requestSignature'
// 新增项目
export const createProject = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsFunctionProject/createProject.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 查询项目列表
export const projectList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsFunctionProject/projectList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 删除项目
export const delProject = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsFunctionProject/delProject.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 刷新商家权限
// http://backend-gateway.cfb15885d772c4d0483994936910dff06.cn-shenzhen.alicontainer.com/weeget-genius-sundry-club-rest/supplier/user/base/function/refreshSupplierProjectFunctionRedisCache
// 刷新权限
export const refreshSupplier = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-genius-backend-auth-rest/supplier/user/base/function/refreshSupplierProjectFunctionRedisCache',
		method: 'post',
		data,
		custom,
	})
}
