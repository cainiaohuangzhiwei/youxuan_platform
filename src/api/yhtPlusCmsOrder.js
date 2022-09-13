//
import request from '@/utils/interceptor/request'
import { getDeliveSwitch } from './marketingSwitch'
// /*
//  * -----------------------------------订单----------------------------------------
//  */
// // 订单列表
// // export const getOrderListByCondition = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderListByCondition.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const getOrderListByCondition = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/getOrderListByCondition.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 导出订单列表

// // 导出订单列表
export const exportOrderListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/exportOrderListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
// export const exportOrderListByCondition =
// 	'/yhtplus/yhtPlusCmsOrder/exportOrderListByCondition.action'
// // 添加订单标签
// // export const addOrderTagByOrderIdList = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/addOrderTagByOrderIdList.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const addOrderTagByOrderIdList = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/addOrderTagByOrderIdList.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 审核订单
// // export const auditOrder = (data, loadingOptions) =>
// // 	http.form('/yhtplus/yhtPlusCmsOrder/auditOrder.action', data, loadingOptions)
export const auditOrder = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/auditOrder.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 添加订单退款(新)
export const addNewOrderRefundByOrderIdNews = (params, custom = {}) =>
	request.request({
		url: 'weeget-bullet-order-rest/refund/launch',
		method: 'post',
		data: params,
		custom,
	})
// // 获取退款店主余额记录
// // export const getRefundOrganizationBalance = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getRefundOrganizationBalance.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const getRefundOrganizationBalance = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/getRefundOrganizationBalance.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 冻结解冻订单
// // export const freezeOrUnfreezeOrderByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/freezeOrUnfreezeOrderByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const freezeOrUnfreezeOrderByOrderId = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/freezeOrUnfreezeOrderByOrderId.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 订单发货
// // export const addFastOrderDeliver = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/addFastOrderDeliver.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const addFastOrderDeliver = async (data, custom = {}) => {
	const switchInfo = await getDeliveSwitch(
		'/yhtplus/yhtPlusCmsOrder/addFastOrderDeliver.action',
		'/weeget-genius-supplier-service/order/deliver/sendOrderDeliver'
	)
	return request.request({
		method: 'post',
		data,
		custom,
		// dataType: 'form',
		...switchInfo,
	})
	// request.request({
	// 	url: '/yhtplus/yhtPlusCmsOrder/addFastOrderDeliver.action',
	// 	method: 'post',
	// 	data,
	// 	custom,
	// 	dataType: 'form',
	// })
}
// // 修改订单
// // export const updateOrderByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/updateOrderByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const updateOrderByOrderId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/updateOrderByOrderId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 订单售后退换
// // export const exchangeOrderGoodsByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/exchangeOrderGoodsByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const exchangeOrderGoodsByOrderId = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/exchangeOrderGoodsByOrderId.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 订单补款
// // export const addOrderSupplementByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/addOrderSupplementByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const addOrderSupplementByOrderId = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/addOrderSupplementByOrderId.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 查询微信退款状态
// // export const queryWechatRefundByRefundSn = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/queryWechatRefundByRefundSn.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const queryWechatRefundByRefundSn = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/queryWechatRefundByRefundSn.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 订单详情
// // export const getOrderDetailByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderDetailByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getOrderDetailByOrderId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderDetailByOrderId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 根据订单ID获取订单商品列表
// // export const getOrderGoodsByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderGoodsByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getOrderGoodsByOrderId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderGoodsByOrderId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 退款单列表
// // export const getRefundOrderListByParam = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getRefundOrderListByParam.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getRefundOrderListByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getRefundOrderListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 确定退返记录
// // export const updateRefundOrderByRefundId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/updateRefundOrderByRefundId.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const updateRefundOrderByRefundId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/updateRefundOrderByRefundId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// // 退货单列表
export const getRetrunOrderListByParam = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getRetrunOrderListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// // 导出退货单excel
export const exportRetrunOrderListByCondition = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsOrder/exportRetrunOrderListByCondition.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}
// // 取消退款
export const cancelRetrunOrderByRefundId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/cancelRetrunOrderByRefundId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 退货单列表->点击同意退款 获取退货信息详情
export const getRetrunOrderDetailByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getRetrunOrderDetailByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 根据订单ID获取退款记录列表
// // export const getOrderRefundListByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderRefundListByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getOrderRefundListByOrderId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderRefundListByOrderId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 根据订单ID获取收款记录列表
// // export const getOrderPaymentListByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderPaymentListByOrderId.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getOrderPaymentListByOrderId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderPaymentListByOrderId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 退货单保存记录 编辑退货单
export const updateRetrunOrderByRefundId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/updateRetrunOrderByRefundId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 退货单保存记录 校验退货单物流
// // export const getRetrunExpressSnByParam = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getRetrunExpressSnByParam.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getRetrunExpressSnByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getRetrunExpressSnByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 发货单列表
// // export const getOrderDeliverListByCondition = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderDeliverListByCondition.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getOrderDeliverListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderDeliverListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 业务统计
// // export const getOrderGoodsStatisticsList = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderGoodsStatisticsList.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const getOrderGoodsStatisticsList = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/getOrderGoodsStatisticsList.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 客服限制补款列表
// // export const getRefundLimitListByParam = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getRefundLimitListByParam.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getRefundLimitListByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getRefundLimitListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 新增客服补款限制
// // export const addRefundLimit = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/addRefundLimit.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const addRefundLimit = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/addRefundLimit.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 编辑客服补款限制
// // export const updateRefundLimit = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/updateRefundLimit.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const updateRefundLimit = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/updateRefundLimit.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 新增客服临时补款限制记录
// // export const addRefundLimitRecord = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/addRefundLimitRecord.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const addRefundLimitRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/addRefundLimitRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 获取客服临时补款限制列表
// // export const getRefundLimitRecordListByParam = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getRefundLimitRecordListByParam.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getRefundLimitRecordListByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getRefundLimitRecordListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// // 获取订单预警记录列表
// // export const getOrderWarningRecordByCondition = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderWarningRecordByCondition.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getOrderWarningRecordByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderWarningRecordByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 获取订单预警设置
// // export const getOrderWarningSettings = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getOrderWarningSettings.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const getOrderWarningSettings = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/getOrderWarningSettings.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 保存订单预警设置
// // export const saveOrderWarningSettings = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/saveOrderWarningSettings.action',
// // 		data,
// // 		loadingOptions
// // 	)
export const saveOrderWarningSettings = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/saveOrderWarningSettings.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// // 分组订单统计
// // export const getGoodsGroupOrderStatisticsList = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getGoodsGroupOrderStatisticsList.action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const getGoodsGroupOrderStatisticsList = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/getGoodsGroupOrderStatisticsList.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// // 拼团流水详情
// // export const getBookingOrderPaymentListByOrderId = (data, loadingOptions) =>
// // 	http.form(
// // 		'/yhtplus/yhtPlusCmsOrder/getBookingOrderPaymentListByOrderId..action',
// // 		data,
// // 		loadingOptions
// // 	)
// export const getBookingOrderPaymentListByOrderId = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/getBookingOrderPaymentListByOrderId..action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// 订单详情-发货记录-待发货清单
export const findOrderNoDeliverGoods = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/findOrderNoDeliverGoods.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 发货记录
export const findOrderDeliverRecordByOrderId = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/findOrderDeliverRecordByOrderId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 查看物流轨迹接口
export const queryExpressInfoForPlatform = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/queryExpressInfoForPlatform.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 更新物流信息
// export const updateDeliverExpress = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsOrder/updateDeliverExpress.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})

export const updateDeliverExpress = async (data, custom = {}) => {
	const switchInfo = await getDeliveSwitch(
		'/yhtplus/yhtPlusCmsOrder/updateDeliverExpress.action',
		'/weeget-genius-supplier-service/order/deliver/updateDeliverExpress'
	)
	return request.request({
		method: 'post',
		data,
		custom,
		...switchInfo,
	})
}

// 导出发货单订单列表
export const exportRefundOrderListByParam = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/exportRefundOrderListByParam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
// 导出发货单订单列表
export const exportOrderDeliverListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrder/exportOrderDeliverListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
