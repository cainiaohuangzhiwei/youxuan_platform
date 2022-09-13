import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 新店主指引列表
export const getNewGuidelinesRecord = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/newGuidelines/getNewGuidelinesRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 操作店主指引记录
export const handlerNewGuidelinesRecord = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/newGuidelines/handlerNewGuidelinesRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
