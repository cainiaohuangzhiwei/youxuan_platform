import request from '@/utils/interceptor/request'

// 店主身份列表-FORS
export const listFors = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-organization-tax-identity/listFors',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 店主身份切换
export const updateTaxType = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-organization-tax-identity/updateTaxType',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 店主代办身份导入
export const uploadTaxImport = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-bullet-account-service/account/acc-organization-tax-identity/import`,
		method: 'post',
		data,
		custom,
	})
}

// 客户认证信息列表
export const getAccCustomerAuthInfoListFors = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-customer-auth-info/listFors',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 更新锁定状态
export const updateAccCustomerAuthInfoStatus = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-customer-auth-info/updateStatus',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 提现单批量审批（通过/驳回）
export const updateAccWithdrawalAuditLogBatchAudit = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-withdrawal-audit-log/batchAuditFors',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// S端:个体户认证列表-FORS
export const getAccAccountIndividualRelationListFors = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-account-individual-relation/listFors',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// S端:实时查询个体户信息
export const getRealTimeIndividualInfo = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-account-individual-relation/getRealTimeIndividualInfo',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// S端:禁用店主与当前个体工商户关联
export const updateDisableRelation = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-account-service/account/acc-account-individual-relation/disableRelation',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
