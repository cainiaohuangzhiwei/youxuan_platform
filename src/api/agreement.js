import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 协议管理列表
export const agreementList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/agreement/agreementList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 历史版本
export const historyAgreementVersion = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/agreement/historyAgreementVersion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 确认更新协议
export const updateAgreementVersion = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/agreement/updateAgreementVersion.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
