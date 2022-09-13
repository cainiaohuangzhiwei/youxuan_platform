import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 礼包列表
export const findGiftListByParam = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/findGiftListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增礼包
export const addGift = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/addGift.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 修改礼包
export const updateGift = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/updateGift.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 删除礼包
export const delGift = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/delGift.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 派发计划列表
export const findGiftShareListByParam = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/findGiftShareListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 礼包领取记录
export const findGiftShareRecord = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/findGiftShareRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 修改派发计划状态
export const updateGiftShareState = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/updateGiftShareState.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 派发小程序码
export const getGiftShareCode = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/getGiftShareCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 新增派发计划
export const addGiftShare = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/gift/addGiftShare.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
