import request from '@/utils/interceptor/request'
/*
 * -----------------------------------档期管理-数据明细查询---------------------------------------
 *
 */
// 查询列表
export const pageStFinanceDataDetail = (data, custom = {}) => {
	return request.request({
		url: 'yhtplus/sfFinance/dataDetail/pageStFinanceDataDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

export const deleteStFinanceDataDetail = (data, custom = {}) => {
	return request.request({
		url: 'yhtplus/sfFinance/dataDetail/deleteStFinanceDataDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 批量删除
export const batchDeleteStFinanceDataDetail = (data, custom = {}) => {
	return request.request({
		url: 'yhtplus/sfFinance/dataDetail/batchDeleteStFinanceDataDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 导出
export const exportStFinanceDataDetail = (data, custom = {}) => {
	return request.request({
		url: 'yhtplus/webImport/exportStFinanceDataDetail.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}
