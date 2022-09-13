import request from '@/utils/interceptor/request'
// 在售店主销售详情
export const listAppGroup = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppGroupShopkeeperSale/listAppGroup.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 在售店主销售详情-导出
export const exportAppGroup = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppGroupShopkeeperSale/exportAppGroup.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
// 出入群店主详情/店主详情
export const listAppGroupShopkeeper = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppGroupShopkeeperSale/listAppGroupShopkeeper.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 出入群店主详情/店主详情-导出
export const exportAppGroupShopkeeper = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppGroupShopkeeperSale/exportAppGroupShopkeeper.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
