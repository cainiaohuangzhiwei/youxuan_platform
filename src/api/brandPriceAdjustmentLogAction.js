import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商品----------------------------------------
 */
// // 获取品牌品类列表
export const brandPriceAdjustmentLogList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/brandPriceAdjustmentLogAction/brandPriceAdjustmentLogList.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
