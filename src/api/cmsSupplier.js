import request from '@/utils/interceptor/request'
// 商家账号提现接口
export const doSupplierCashOut = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsSupplier/doSupplierCashOut.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
