import request from '@/utils/interceptor/request'
/*
 * -----------------------------------发货----------------------------------------
 */
// 发货单列表-提交申请补款
// export const exportBatchUpdateExpressSnDetails = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webImport/exportBatchUpdateExpressSnDetails.action',
// 		data,
// 		loadingOptions
// 	)
export const deliveSwitch = (params, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/order/deliver/switch',
		method: 'get',
		params,
		custom,
		dataType: 'form',
	})
}
export const exportBatchUpdateExpressSnDetails = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportBatchUpdateExpressSnDetails.action',
		method: 'post',
		responseType: 'arraybuffer',
		data,
		custom,
		dataType: 'form',
	})

export const exportLogistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportLogistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//下载尾款对账单
export const exportReconciliationByBrandEnd = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportReconciliationByBrandEnd.action',
		method: 'post',
		responseType: 'arraybuffer',
		data,
		dataType: 'form',
		custom,
	})
}
//下载尾款对账单明细
export const exportReconciliationDetailsEnd = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportReconciliationDetailsEnd.action',
		method: 'post',
		responseType: 'arraybuffer',
		data,
		dataType: 'form',
		custom,
	})
}
//下载首款对账单明细
export const exportReconciliationDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportReconciliationDetails.action',
		method: 'post',
		responseType: 'arraybuffer',
		data,
		dataType: 'form',
		custom,
	})
}
//下载首款对账单
export const exportReconciliationByBrandFirst = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportReconciliationByBrandFirst.action',
		method: 'post',
		responseType: 'arraybuffer',
		data,
		dataType: 'form',
		custom,
	})
}
// 导入收货物流
// export const importTakeDeliveryLogistics = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webImport/importTakeDeliveryLogistics.action',
// 		data,
// 		loadingOptions
// 	)
export const importTakeDeliveryLogistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/importTakeDeliveryLogistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导入寄出物流
// export const importSendOutLogistics = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webImport/importSendOutLogistics.action',
// 		data,
// 		loadingOptions
// 	)
export const importSendOutLogistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/importSendOutLogistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出互助表格
// export const exportActMentoringProgramList = (data, loadingOptions) =>
// 	http.download(
// 		'/yhtplus/webImport/exportActMentoringProgramList.action',
// 		data,
// 		loadingOptions
// 	)
export const exportActMentoringProgramList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportActMentoringProgramList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 客服托管信息导入解析
export const importCusServiceTrusteeship =
	'/yhtplus/webImport/importCusServiceTrusteeship.action'
// 下载导入商品模板
export const downloadImpostGoodsTemplate =
	'/yhtplus/webImport/downloadImpostGoodsTemplate.action'
// 导入获取选品关键词
// export const impostBrandKeyWord = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webImport/impostBrandKeyWord.action',
// 		data,
// 		loadingOptions
// 	)
export const impostBrandKeyWord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/impostBrandKeyWord.action',
		method: 'post',
		data,
		custom,
	})
// 导出获取选品
// export const exportBrandInfoExcel = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/webImport/exportBrandInfoExcel.action',
// 		data,
// 		loadingOptions
// 	)
export const exportBrandInfoExcel = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportBrandInfoExcel.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
// 导入获取推手活动参数
export const importActPromotersOrganizations =
	'/yhtplus/webImport/importActPromotersOrganizations.action'
// 导出自有品牌结算列表
// export const exportPrivateBrandSettlement = (data, loadingOptions) =>
// 	http.download(
// 		'/yhtplus/webImport/exportPrivateBrandSettlement.action',
// 		data,
// 		loadingOptions
// 	)
export const exportPrivateBrandSettlement = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportPrivateBrandSettlement.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导入自有品牌结算列表
export const importPrivateBrandSettlement =
	'/yhtplus/webImport/importPrivateBrandSettlement.action'

//导入历史记录
export const findImportRecordList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/findImportRecordList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//批量导出导入历史记录详情
export const exportDataItem = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportDataItem.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
//导入记录详情
export const findImportRecordDetailList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/findImportRecordDetailList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//获取商家列表
export const getCmsSupplierListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplier/getCmsSupplierListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//获取会场列表
export const getBrandList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/brand/getBrandList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//导出待审核店铺
export const exportMailing = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportMailing.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})

//导入历史记录
export const downloadStockTaking = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/downloadStockTaking.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}

export const exportNotDeliverGoodsOrderDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportNotDeliverGoodsOrderDetails.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}

export const exportBatchUpdateGoodsDetails = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportBatchUpdateGoodsDetails.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}

export const importUpdateGoodsPrice = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importUpdateGoodsPrice.action',
		method: 'post',
		data,
		custom,
	})
}

export const impostStockTaking = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostStockTaking.action',
		method: 'post',
		data,
		custom,
	})
}

export const exportUpdateGoodsPrice = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportUpdateGoodsPrice.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}

export const importBatchUpdateGoods = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importBatchUpdateGoods.action',
		method: 'post',
		data,
		custom,
	})
}

export const impostBatchUpdateExpressSn = async (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostBatchUpdateExpressSn.action',
		method: 'post',
		data,
		custom,
	})
}

export const deliverImportExpressSn = async (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/order/deliver/importExpressSn',
		method: 'post',
		data,
		custom,
	})
}
// export const impostBatchUpdateExpressSn = async (data, custom = {}) => {
// 	const switchInfo = await getDeliveSwitch(
// 		'/yhtplus/webImport/impostBatchUpdateExpressSn.action',
// 		'/weeget-genius-supplier-service/order/deliver/importExpressSn'
// 	)
// 	return request.request({
// 		method: 'post',
// 		data,
// 		custom,
// 		...switchInfo,
// 	})
// }

export const delverImportOrderDeliver = async (data, custom = {}) => {
	return request.request({
		url: '/weeget-genius-supplier-service/order/deliver/importOrderDeliver',
		method: 'post',
		data,
		custom,
	})
}

export const impostOrderDeliver = async (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostOrderDeliver.action',
		method: 'post',
		data,
		custom,
	})
}

export const importReplenishStock = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importReplenishStock.action',
		method: 'post',
		data,
		custom,
	})
}

export const importAuditedSupplierGoods = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importAuditedSupplierGoods.action',
		method: 'post',
		data,
		custom,
	})
}

// 导入商品Excel
export const impostGoods = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostGoods.action',
		method: 'post',
		data,
		custom,
	})
}
// 导入商品图片
export const uploadPictures = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/upload_pictures.do`,
		// url: '/yhtplus/upload_pictures.do',
		method: 'post',
		data,
		custom,
	})
}
// 导出店主提现列表
export const exportWithdrawList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportWithdrawList.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}
//导入数据明细
export const importStFinanceDataDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importStFinanceDataDetail.action',
		method: 'post',
		data,
		custom,
	})
}

// 导入扣款信息
export const importAuditLog = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus-import/yhtplus/webImport/impostMerchantDeductList.action`,
		method: 'post',
		data,
		custom,
	})
}
// 孵化活动报名列表导出
export const exportHatchingEntered = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportHatchingEntered.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}
// 导入excel获取孵化活动参数
export const importActHatchingOrganizations = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importActHatchingOrganizations.action',
		method: 'post',
		data,
		custom,
	})
}
// 导入扣款信息
export const importEquityReceived = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importEquityReceived.action',
		method: 'post',
		data,
		custom,
	})
}
// 礼包领取记录导出excel
export const exportGiftShareRecord = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportGiftShareRecord.action',
		method: 'post',
		responseType: 'arraybuffer',
		data,
		custom,
		dataType: 'form',
	})
}
// 导入派发优惠券
export const impostCouponExcel = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostCouponExcel.action',
		method: 'post',
		data,
		custom,
	})
}
// 解析导入奖励内容
export const ckeckActBonus = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/ckeckActBonus.action',
		method: 'post',
		data,
		custom,
	})
}
// 导入活动返现记录
export const impostActBonus = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostActBonus.action',
		method: 'post',
		data,
		custom,
	})
}

// 商家客服导入
export const impostSupplierService = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/impostSupplierService.action',
		method: 'post',
		data,
		custom,
	})
}

// 导出售后业务统计（超时统计）
export const exportSuppUnHandle = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportSuppUnHandle.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}

// 导出商品类目利润统计
export const exportCMSClassifyReservationList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportCMSClassifyReservationList.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}
// 导入获取用户ID
export const importActBannerUserIds = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importActBannerUserIds.action',
		method: 'post',
		data,
		custom,
	})
}
// 导出售后单列表
export const exportAfterSales = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportAfterSales.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}
// 导出优先赔付列表
export const exportAfterSalesPrepayment = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportAfterSalesPrepayment.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}

// 导入平账数据
export const importSupplierFlatBalanceList = (data, custom = {}) => {
	return request.request({
		// url: '/yhtplus/yhtPlusCmsSupplierBalance/importSupplierFlatBalanceList.action',
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/yhtPlusCmsSupplierBalance/importSupplierFlatBalanceList.action`,
		method: 'post',
		data,
		custom,
	})
}
// 下载商品价格表(广州)
export const exportUpdateGoodsPriceByGz = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportUpdateGoodsPriceByGz.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}
// 下载商品价格表(杭州)
export const exportUpdateGoodsPriceByHz = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportUpdateGoodsPriceByHz.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}
// 批量修改导入（杭州）
export const importUpdateGoodsPriceByHz = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importUpdateGoodsPriceByHz.action',
		method: 'post',
		data,
		custom,
	})
}
// 批量修改导入（广州）
export const importUpdateGoodsPriceByGz = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importUpdateGoodsPriceByGz.action',
		method: 'post',
		data,
		custom,
	})
}
//提现申请列表导出
export const exportSupplierWithdrawList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportSupplierWithdrawList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}
//首款导出
export const exportFirstStFinanceList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/webImport/exportFirstStFinanceList.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
//尾款导出
export const exportEndStFinanceList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportEndStFinanceList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}
//往期未结算款项导出
export const exportPreviousStFinanceList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportPreviousStFinanceList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
		responseType: 'arraybuffer',
	})
}
// 商家余额导出
export const exportSupplierBalanceList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/exportSupplierBalanceList.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
// 首款下载对账单
export const downloadFirstStFinance = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/downloadFirstStFinance.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
// 尾款下载对账单
export const downloadLastStFinance = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/downloadLastStFinance.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
} // 往期下载对账单
export const downloadPastStFinance = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/downloadPastStFinance.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
}
// 导入评价素材
export const importEvaluation = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus-import/yhtplus/webImport/importEvaluation.action`,
		method: 'post',
		data,
		custom,
	})
}
// 导入评价素材图片
export const impostEvaluationImage = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus-import/yhtplus/webImport/impostEvaluationImage.action`,
		method: 'post',
		data,
		custom,
	})
}
