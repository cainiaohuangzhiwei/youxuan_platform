import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 小程序商学院-课程
export const getBusinessSchoolList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/getBusinessSchoolList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除商学院记录
export const deleteBusinessSchoolByCurriculumId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/deleteBusinessSchoolByCurriculumId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取商学院课程分类列表
export const getCurriculumClassifyList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/getCurriculumClassifyList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑商学院记录
export const updateBusinessSchoolByCurriculumId = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/updateBusinessSchoolByCurriculumId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增商学院记录
export const addBusinessSchoolCurriculum = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/addBusinessSchoolCurriculum.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取商学院banner列表
export const getBannerList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/getBannerList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增商学院banner记录
export const addBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/addBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑商学院banner记录
export const updateBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/updateBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除商学院banner记录
export const delBanner = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/delBanner.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 添加商学院课程分类
export const addCurriculumClassify = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/addCurriculumClassify.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑商学院课程分类
export const updateCurriculumClassify = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/updateCurriculumClassify.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除商学院课程分类
export const delCurriculumClassify = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/delCurriculumClassify.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取商学院每日分享列表
export const getBsDayShareList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/getBsDayShareList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 添加商学院每日分享
export const addBsDayShare = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/addBsDayShare.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除商学院每日分享
export const updateBsDayShare = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/updateBsDayShare.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除商学院每日分享
export const delBsDayShare = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/businessSchool/delBsDayShare.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
