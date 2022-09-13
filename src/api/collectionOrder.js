// 上门揽退
import request from '@/utils/interceptor/request'
// 揽件订单列表
export const collectionOrderList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrder/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 导出
export const collectionOrderExport = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrder/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})

// 导出
export const collectionOrderExpensesExport = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderExpenses/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})
// 取消揽件订单列表
export const collectionOrderCancel = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrder/cancel',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 揽件订单详情-处理记录 （s端）
export const collectionOrderRecord = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderRecord/operator/record',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 揽件订单列表-详情信息 （s端）
export const collectionOrderDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderDetail/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 修改揽件订单信息(s端)
export const collectionOrderChange = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderDetail/change',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 获取快递服务时间(s端)

export const searchPickTime = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderDetail/searchPickTime',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 导入城市接口（s端）
export const impostCityService = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus-import/yhtplus/webImport/importCity.action`,
		method: 'post',
		data,
		custom,
	})
}

// 小程序/小程序首页设置-上门揽退服务城市维护 （s端）

export const collectionOrderCityConfig = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderCityConfig/pageQuery',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 删除城市（s端）

export const deleteCity = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderCityConfig/deleteCity',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 订单支付列表 （s端）
export const collectionOrderExpenses = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderExpenses/pageQuery',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 订单支付列表-查询 （s端）
export const selectData = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/collectionOrderExpenses/selectData',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
