import request from '@/utils/interceptor/request'

// 小程序活动专区
export const list = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区新增活动
export const add = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/add.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区编辑活动
export const editActivity = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/editActivity.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区预览二维码
export const generateQRCode = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/generateQRCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 楼层列表
export const activityFloorListForHome = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/activityFloorListForHome.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区获取楼层列表
export const activityFloorList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/activityFloorList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区删除楼层
export const deleteActivityFloor = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/deleteActivityFloor.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区添加楼层
export const addActivityFloor = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/addActivityFloor.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区编辑楼层
export const editActivityFloor = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/editActivityFloor.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区预览二维码(首页使用
export const generateQRCodeForHome = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/generateQRCodeForHome.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 首页楼层图片数据同步到小程序
export const addSyncAppletForHome = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/addSyncAppletForHome.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 小程序活动专区楼层详情
export const getActivityFloor = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/getActivityFloor.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增楼层
export const addActivityFloorForHome = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/addActivityFloorForHome.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 修改楼层
export const editActivityFloorForHome = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsActArea/editActivityFloorForHome.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取活动列表
export const yhtPlusCmsActArea = (data, custom = {}) => {
	return request.request({
		url: 'yhtplus/yhtPlusCmsActArea/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
