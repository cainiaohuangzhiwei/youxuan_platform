import request from '@/utils/interceptor/request'
/*
 * -----------------------------------档期管理----------------------------------------
 */

// 商家账户中心列表
export const sPlatformSupplierBalanceList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierBalance/sPlatformSupplierBalanceList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 商家账户中心详情
export const sPlatformSupplierBalanceDetail = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierBalance/sPlatformSupplierBalanceDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 商家账户中心详情-余额明细
export const sPlatformSupplierBalanceRecordList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierBalanceRecord/sPlatformSupplierBalanceRecordList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 商家账户中心详情-提现记录
export const sPlatformSupplierWithdrawList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierWithdraw/sPlatformSupplierWithdrawList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
