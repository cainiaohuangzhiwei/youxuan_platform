/*
 * @Author: your name
 * @Date: 2021-03-26 10:07:21
 * @LastEditTime: 2022-02-17 15:18:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \egg\src\api\cmsImUser.js
 */
import request from '@/utils/interceptor/request'
// 店主详情统计tab
export const listImUserShopkeeper = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImUser/listImUserShopkeeper.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 用户管理tab
export const getImUserPage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImUser/getImUserPage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增IM群组
export const addImUser = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImUser/addImUser.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑IM群组
export const updateImUser = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImUser/updateImUser.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 用户详情
export const getImUserDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImUser/getImUserDetails.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 所在群组
export const getImUserGroupPage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImUser/getImUserGroupPage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 好友
export const getImUserFriendPage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsImUser/getImUserFriendPage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
