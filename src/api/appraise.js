import request from '@/utils/interceptor/request'

// 评价列表
export const getAppraiseList = (data, custom = {}) => {
	return request.request({
		url:
			'/weeget-bullet-evaluation-rest-fors/afterSalesEvaluation/pageEvaluationList',
		method: 'post',
		data,
		custom,
	})
}
// // 导出
export const exportAppraise = (data, custom = {}) =>
	request.request({
		url:
			'/weeget-bullet-evaluation-rest-fors/afterSalesEvaluation/exportEvaluationList',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
	})
