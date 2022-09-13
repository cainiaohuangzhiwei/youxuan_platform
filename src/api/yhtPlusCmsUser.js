import request from '@/utils/interceptor/request'

// 添加权限
export const addFuctionToMethods = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsUser/addFuctionToMethods.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 根据条件查找用户列表
export const getWeixinUserListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsUser/getWeixinUserListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
