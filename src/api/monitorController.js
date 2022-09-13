import request from '@/utils/interceptor/request'
/*
 * -----------------------------------店主账户---------------------------------------
 *
 */
// 商家评分列表
export const getSupplierGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商家评分列表
export const getPlatformGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getPlatformGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 商家评分列表导出
export const getSupplierGradeListExport = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/monitorController/getSupplierGradeListExport',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})

// 发货详情
export const getSupplierOrderSendPackageGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierOrderSendPackageGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 揽收时长详情
export const getSupplierOrderGetPackageGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierOrderGetPackageGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 签收时间详情
export const getSupplierOrderSignForGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierOrderSignForGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 虚假发货率
export const getSupplierShamSendGoodGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierShamSendGoodGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 错发漏发率列表
export const getSupplierMissDeliverRateGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierMissDeliverRateGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 缺货率列表
export const getSupplierNoGoodRateGradeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierNoGoodRateGradeList',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 导出发货详情
export const getSupplierOrderSendPackageGradeListExport = (
	data,
	custom = {}
) => {
	return request.request({
		url:
			'/yhtplus/monitorController/getSupplierOrderSendPackageGradeListExport',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 导出揽收时长详情
export const getSupplierOrderGetPackageGradeListExport = (
	data,
	custom = {}
) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierOrderGetPackageGradeListExport',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 导出签收时间详情
export const getSupplierOrderSignForGradeListExport = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierOrderSignForGradeListExport',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 导出虚假发货率
export const getSupplierShamSendGoodGradeListExport = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierShamSendGoodGradeListExport',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 导出错发漏发率列表
export const getSupplierMissDeliverRateGradeListExport = (
	data,
	custom = {}
) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierMissDeliverRateGradeListExport',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}

// 导出缺货率
export const getSupplierNoGoodRateGradeListExport = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/monitorController/getSupplierNoGoodRateGradeListExport',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
