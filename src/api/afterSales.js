import request from '@/utils/interceptor/request'
/*
 * -----------------------------------售后----------------------------------------
 */

// 查询上游售后单
export const queryAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/afterSale/queryAfterSales',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询上游售后订单赔付列表
export const queryAfterSalesOrderCompensateList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/afterSale/queryAfterSalesOrderCompensateList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 退货单列表-申请补款物流信息
export const getCompensationInfo = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/getCompensationInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//售后业务统计（超时统计）
export const afterSalesOverTimeStatistical = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/afterSales/afterSalesOverTimeStatistical.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//售后业务统计（状态统计）
export const afterSalesStatusStatistical = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/afterSales/afterSalesStatusStatistical.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 查询售后单详情
export const findAfterSalesDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/findAfterSalesDetails.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 售后单详情-修改退货记录
export const updateAsRefund = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/updateAsRefund.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 订单详情-售后记录
export const findOrderAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/findOrderAfterSales.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 订单详情-开启申请售后
export const turnOnAfterSalesEntrance = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/turnOnAfterSalesEntrance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取汇聚待补偿信息（物流单发起的补款）
export const getCompensationInfoHJ = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/getCompensationInfoHJ.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取售后单列表
export const listAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/listAfterSales.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取售后单列表
export const updateCustomerWarehouseRemark = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSalesRemarks/updateCustomerWarehouseRemark.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 获取售后商品信息
export const findAsProduct = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/findAsProduct.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 商家审核
export const updateAfterSalesSuppCheck = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/updateAfterSalesSuppCheck.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 售后单是否同意退款操作校验
export const goodsChecking = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/goodsChecking.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 售后单验收通过操作
export const updateAfterSalesWareCheck = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/updateAfterSalesWareCheck.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 录入反退金额
export const fillReturnAmount = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/fillReturnAmount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 关闭售后订单接口
export const closeAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/closeAfterSales.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 填写物流
export const updateAfterSalesfillLogistics = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/updateAfterSalesfillLogistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 脚本立即同步物流
export const syncAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/aftersale/syncAfterSales.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 手动同步上游售后单
export const syncAfterSalesManual = (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-thirdparty-rest/biz/afterSale/syncAfterSalesManual',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 更新第三方返退金额
export const updaterefundbylist = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/aftersale/updaterefundbylist.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 售后商家地址列表
export const afterSalesAddressList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSales/afterSalesAddressList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 更改售后类型信息
export const modifyAfterTypeInfo = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/modifyAfterTypeInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 更改售后类型
export const modifyAfterType = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/afterSales/modifyAfterType.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 仲裁单列表导出
export const arbitrationExport = (data, custom = {}) =>
	request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesArbitration/export',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'json',
	})
// 平台仲裁失败
export const platformArbitrateFail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesArbitration/platformArbitrateFail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台仲裁成功
export const platformArbitrateSuccess = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesArbitration/platformArbitrateSuccess',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 平台转交至商家处理
export const platformForwardToSupplier = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesArbitration/platformForwardToSupplier',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询仲裁单
export const afterSalesArbitrationPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesArbitration/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 查询仲裁单
export const afterSalesArbitrationdetail = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesArbitration/detail',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 售后商家仲裁配置列表
export const afterSalesSupplierArbitrateConfigPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesSupplierArbitrateConfig/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 更新售后商家仲裁配置
export const updateArbitrationConfig = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSalesSupplierArbitrateConfig/updateArbitrationConfig',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商家开启售后单列表
export const supplierTurnonAfterSalesPage = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/supplierTurnonAfterSales/queryPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const supplierTurnonAfterSalesExport = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/supplierTurnonAfterSales/export',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'json',
	})
}
// 延长回寄时间
export const extendMailTime = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/afterSales/extendMailTime',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 补款原因列表
export const getCompensationResonList = (data, custom = {}) => {
	return request.request({
		url: '/weeget-bullet-after-sale-rest-fors/yxCompensationAmount/compensationReson/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
