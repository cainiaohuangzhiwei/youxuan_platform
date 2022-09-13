import request from '@/utils/interceptor/request'

// 商家素材列表
export const pageSupplierGoodsMaterialListFors = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/pageSupplierGoodsMaterialListFors',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取商家素材详情
export const supplierMaterialDetailFors = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 审核
export const auditForSupplier = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/auditForSupplier',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 编辑商家素材
export const updateForSupplier = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-shopkeeper-upms/activity/goods/material/updateForSupplier',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家素材上传权限白名单
export const listGoodsMaterialWhite = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/goodsMaterial/listGoodsMaterialWhite',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家素材上传权限更改
export const batchUpdateGoodsMaterialWhitelist = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/goodsMaterial/batchUpdateGoodsMaterialWhitelist',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
