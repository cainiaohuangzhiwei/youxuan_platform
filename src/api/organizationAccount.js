import request from '@/utils/interceptor/request'
/*
 * -----------------------------------店主账户---------------------------------------
 *
 */
// 店主账户列表
export const organizationQueryAccountList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/organizationAccount/organizationQueryAccountList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 店主账户详情
export const organizationQueryAccountDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/organizationAccount/organizationQueryAccountDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 店主余额变动列表
export const organizationBalanceChangeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/organizationAccount/organizationBalanceChangeList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
