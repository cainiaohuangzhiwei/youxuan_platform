import request from '@/utils/interceptor/request'
// 批量查询订单拼团状态
export const batchQueryOrderGroupBuyingStatus = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/groupBuying/batchQueryOrderGroupBuyingStatus',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 创建活动配置接口
export const addCreate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/create',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询活动配置详情接口
export const detailCreate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 编辑活动配置接口
export const editCreate = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/edit',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查看活动配置列表接口
export const groupBuyingList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询店铺活动拼团数据明细接口
export const organizationDetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/organizationDetail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 按店铺维度查询活动拼团统计数据接口
export const organizationStatistics = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-marketing-rest-fors/groupBuying/organizationStatistics',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询商品价格范围接口
export const priceRange = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/priceRange',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 取消活动
export const cancelActivity = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/cancelActivity',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询拼团活动商品价格范围
export const goodsPriceRange = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-marketing-rest-fors/groupBuying/goodsPriceRange',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
