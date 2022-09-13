import request from '@/utils/interceptor/request'
/*
 * -----------------------------------店主结算---------------------------------------
 *
 */
// 店主扣款导入
export const orgDeductRecordImport = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-bullet-account-service/account/acc-organization-deduct-record/import`,
		method: 'post',
		data,
		custom,
	})
}

// 店主结算明细列表-FORS
export const orgMonthSettleDetail = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-organization-month-settle-detail/fors-list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 店主结算汇总列表查询
export const orgMonthSettleStatisticsList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-organization-month-settle-statistics/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 确认发放
export const orgMonthSettleStatisticsConfirm = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-organization-month-settle-statistics/confirm',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 店主余额调账明细导入
export const orgReconciliationImport = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-bullet-account-service/account/acc-account-reconciliation/import`,
		method: 'post',
		data,
		custom,
	})
}

// 店主调账明细
export const orgReconciliationList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-account-service/account/acc-account-reconciliation/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
