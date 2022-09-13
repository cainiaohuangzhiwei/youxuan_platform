import request from '@/utils/interceptor/request'

// 修改地址列表
export const getOrderRecordList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderRecord/getOrderRecordList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 查询订单修改记录
export const findOrderGoodsUpdateRecordsNew = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderRecord/findOrderGoodsUpdateRecordsNew.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 修改记录
export const findOrderGoodsUpdateRecords = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/orderRecord/findOrderGoodsUpdateRecords.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 修改地址列表 - 增加备注
export const updateOrderRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/orderRecord/updateOrderRecord.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})
