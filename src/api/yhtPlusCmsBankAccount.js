import request from '@/utils/interceptor/request'
//根据提现流水号查询银行卡信息
export const getBankAccountByFlowWithdrawId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsBankAccount/getBankAccountByFlowWithdrawId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//商家-根据提现流水号查询银行卡信息
export const getMerchantBankAccountByFlowWithdrawId = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsBankAccount/getMerchantBankAccountByFlowWithdrawId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//平台-根据提现流水号查询银行卡信息
export const getPlatformBankAccountByFlowWithdrawId = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsBankAccount/getPlatformBankAccountByFlowWithdrawId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
