import request from '@/utils/interceptor/request'

// 导入扣款信息
export const importBrandParent = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/supplierBrandParent/importBrandParent.action`,
		method: 'post',
		data,
		custom,
	})
}
// 导出
export const exportBrandParentList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/supplierBrandParent/exportBrandParentList.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
