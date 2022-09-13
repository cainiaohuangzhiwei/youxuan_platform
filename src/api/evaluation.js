import fetchWithSign from '@/utils/interceptor/request'

// 查询工单评价列表
export const pageEvaluationList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/serviceRecordEvaluation/pageEvaluationList',
		method: 'post',
		data,
		custom,
	})
}
// 导出工单评价列表
export const exportEvaluationList = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/serviceRecordEvaluation/exportEvaluationList',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
	})

// 查询订单商品评价列表
export const pageOrderGoodsEvaluationList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/orderGoodsEvaluation/pageEvaluationList',
		method: 'post',
		data,
		custom,
	})
}
// 导出订单商品评价列表
export const exportOrderGoodsEvaluationList = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/orderGoodsEvaluation/exportEvaluationList',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
	})

// 查询订单评价列表
export const pageOrderEvaluationList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/orderEvaluation/pageEvaluationList',
		method: 'post',
		data,
		custom,
	})
}
// 导出订单评价列表
export const exportOrderEvaluationList = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/orderEvaluation/exportEvaluationList',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
	})

// 档期关闭评价列表
export const pageGoodsGroupEvaluationList = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/closeGoodsGroupEvaluation/pageEvaluationList',
		method: 'post',
		data,
		custom,
	})
// 导出档期关闭评价列表
export const exportGoodsGroupEvaluationList = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/closeGoodsGroupEvaluation/exportEvaluationList',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
	})
// 屏蔽评价
export const orderGoodsEvaluationBlock = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/orderGoodsEvaluation/block',
		method: 'post',
		data,
		custom,
	})
// 回复评价
export const orderGoodsEvaluationReply = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/orderGoodsEvaluation/reply',
		method: 'post',
		data,
		custom,
	})

// 查看评价详情
export const orderGoodsEvaluationDetail = (data, custom = {}) =>
	fetchWithSign.request({
		url: '/weeget-bullet-evaluation-rest-fors/orderGoodsEvaluation/detail',
		method: 'post',
		data,
		custom,
	})
