import request from '@/utils/interceptor/request'

// 获取提现详情
export const detailUserCompensationWithdraw = (data, custom = {}) => {
	return request.request({
		url:
			'/yhtplus//yhtPlusCmsUserCompensationWithdraw/detailUserCompensationWithdraw.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
