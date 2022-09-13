import request from '@/utils/interceptor/request'

// 查询公告列表
export const getNoticeManagementList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/notice-management/getNoticeManagementList.action',
		method: 'post',
		data,
		custom,
	})
}

// 根据id查询详情
// export const getNotice = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/notice-management',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// }

// 更新公告
export const updateNoticeManagement = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/notice-management/updateNoticeManagement.action',
		method: 'post',
		data,
		custom,
	})
}

// 添加公告管理信息
// export const addNotice = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/notice-management/add.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// }
