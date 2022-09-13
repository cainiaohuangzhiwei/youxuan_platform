import request from '@/utils/interceptor/request'

// 小额补款配置列表
export const querySupplierCompensationConfigList = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-after-sale-rest-fors/supplierCompensationConfig/querySupplierCompensationConfigList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 小额补款配置记录
export const queryCompensationConfigRecord = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-after-sale-rest-fors/supplierCompensationConfig/queryCompensationConfigRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 小额补款配置修改
export const updateSupplierCompensationConfig = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-after-sale-rest-fors/supplierCompensationConfig/updateSupplierCompensationConfig',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 小额补款配置导出
export const exportSupplierCompensationConfig = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-after-sale-rest-fors/supplierCompensationConfig/export',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'json',
	})

// 小额补款配置导入
export const supplierConfigImportExcel = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-infinite-backend-gateway/yhtplus/supplierCompensationConfigImport/importExcel.action`,
		method: 'post',
		data,
		custom,
	})
}

// 小额查询补款列表
export const supplierCompensationAmountList = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-after-sale-rest-fors/supplierCompensationAmount/queryPage',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 待补偿-派发
export const batchDistribute = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-after-sale-rest-fors/supplierCompensationAmount/batchDistribute',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 待补偿-删除
export const supplierDelete = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-after-sale-rest-fors/supplierCompensationAmount/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 待补偿-导出
export const supplierExport = (data, custom = {}) =>
	request.request({
		url: 'weeget-bullet-after-sale-rest-fors/supplierCompensationAmount/export',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'json',
	})
// 待补偿-结果
export const queryApplyResult = (data, custom = {}) =>
	request.request({
		url:
			'weeget-bullet-after-sale-rest-fors/supplierCompensationAmount/queryApplyResult',
		method: 'post',
		data,
		custom,

		dataType: 'json',
	})
// 提现申请列表
export const sPlatformSupplierWithdrawApplicationList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierWithdraw/sPlatformSupplierWithdrawApplicationList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 驳回申请
export const withdrawReject = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplierWithdraw/withdrawReject.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 确认打款申请
export const payConfirm = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplierWithdraw/payConfirm.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 查看记录
export const supplierWithdrawOperationRecordList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierWithdraw/supplierWithdrawOperationRecordList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 首款列表
export const listFirstStFinancePage = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/listFirstStFinancePage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 往期未结算款项列表
export const listPreviousStFinancePage = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/listPreviousStFinancePage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 尾款列表
export const listEndStFinancePage = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/listEndStFinancePage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 修复对账
export const stFinanceRefundDataFix = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/fix/stFinanceRefundDataFix.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 首款对账单详情
export const getFirstStFinanceInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/getFirstStFinanceInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 首款对账单下载
export const getFirstStFinanceDownUrl = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/getFirstStFinanceDownUrl.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 尾款对账单下载
export const getEndStFinanceDownUrl = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/getEndStFinanceDownUrl.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 尾款对账单详情
export const getEndStFinanceInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/getEndStFinanceInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 往期对账单详情
export const getPreviousStFinanceInfo = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/getPreviousStFinanceInfo.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 往期对账单下载
export const getPreviousStFinanceDownUrl = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/getPreviousStFinanceDownUrl.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//查询尾款确认无误的款项
export const listEndStFinanceSureAmount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/listEndStFinanceSureAmount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//确认无误操作
export const confirmStFinanceAmount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/confirmStFinanceAmount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//首款提交商家对账
export const submitFirstSupplierStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/submitFirstSupplierStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//尾款提交商家对账
export const submitEndSupplierStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/submitEndSupplierStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//往期提交商家对账
export const submitPreviousSupplierStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/submitPreviousSupplierStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//首款初审
export const firstAuditStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/firstAuditStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//尾款初审
export const endAuditStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/endAuditStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//往期初审
export const previousAuditStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/previousAuditStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//首款三审
export const firstAuditStFinanceFinal = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/firstAuditStFinanceFinal.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//尾款三审
export const endAuditStFinanceFinal = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/endAuditStFinanceFinal.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//往期三审
export const previousAuditStFinanceFinal = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/previousAuditStFinanceFinal.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//首款复审
export const firstAuditStFinanceRepeat = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/firstAuditStFinanceRepeat.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//尾款复审
export const endAuditStFinanceRepeat = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/endAuditStFinanceRepeat.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//往期复审
export const previousAuditStFinanceRepeat = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/previousAuditStFinanceRepeat.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//首款重新发起对账
export const firstAgainStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/firstAgainStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//尾款重新发起对账
export const endAgainStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/endAgainStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//往期重新发起对账
export const previousAgainStFinance = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/previousAgainStFinance.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//首款查看处理记录
export const listFirstStFinanceOperation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/first/listFirstStFinanceOperation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//尾款查看处理记录
export const listEndStFinanceOperation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/end/listEndStFinanceOperation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//往期查看处理记录
export const listPreviousStFinanceOperation = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/stFinance/previous/listPreviousStFinanceOperation.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
