import request from '@/utils/interceptor/request'

// 退款失败同步列表
export const userCompensationWithdrawRefundList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/cmsCompensationWithdrawRefund/userCompensationWithdrawRefundList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 删除退款失败的列表
export const removeUserCompensationWithdrawRefund = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/cmsCompensationWithdrawRefund/removeUserCompensationWithdrawRefund.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
