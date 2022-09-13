import request from '@/utils/interceptor/request'
//获取提现路由配置
export const getWithdrawalConfig = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/withdrawalConfig/getWithdrawalConfig.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//编辑店主提现路由配置
export const updateOrgWithdrawalConfig = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/withdrawalConfig/updateOrgWithdrawalConfig.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//编辑提现限额路由配置
export const updateAmountWithdrawalConfig = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/withdrawalConfig/updateAmountWithdrawalConfig.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
