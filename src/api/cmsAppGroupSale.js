import request from '@/utils/interceptor/request'

// 群销售列表
export const listAppGroupSale = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppGroupSale/listAppGroupSale.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 导出社群销售统计
export const exportAppGroupSale = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppGroupSale/exportAppGroupSale.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
