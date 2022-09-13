import request from '@/utils/interceptor/request'
/*
 * -----------------------------------APP ---------------------------------------
 *
 */
// 社群中心查询列表
export const getImGroupPage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImGroup/getImGroupPage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增群组
export const addImGroup = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImGroup/addImGroup.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑群组
export const updateImGroup = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImGroup/updateImGroup.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 员工选择
export const joinImgroupByEmployees = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImGroup/joinImgroupByEmployees.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 解散群组
export const groupDismiss = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImGroup/groupDismiss.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
