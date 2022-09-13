import request from '@/utils/interceptor/request'

// 添补偿转账列表
export const listUserCompensationWithdraw = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsUserCompensationWithdraw/listUserCompensationWithdraw.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 导出补偿转账列表
export const exportListUserCompensationWithdraw = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsUserCompensationWithdraw/exportListUserCompensationWithdraw.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})

// 导出补偿转账列表
export const userWithdrawAccount = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusUserCompensationWithdrawAccount/userWithdrawAccount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 操作微信提现转账 - 转账失败
export const transferFailedUserCompensationWithdraw = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsUserCompensationWithdraw/transferFailedUserCompensationWithdraw.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 操作微信提现转账 - 转账成功
export const transferSuccessUserCompensationWithdraw = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsUserCompensationWithdraw/transferSuccessUserCompensationWithdraw.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 操作微信提现转账 - 锁定
export const lockUserCompensationWithdraw = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsUserCompensationWithdraw/lockUserCompensationWithdraw.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
