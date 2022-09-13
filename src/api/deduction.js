import request from '@/utils/interceptor/request'
// 商家扣点白名单列表
export const listByCondition = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/whitelist/listByCondition',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 批量启用商家扣点白名单
export const batchEnable = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/whitelist/batchEnable',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 批量禁用商家扣点白名单
export const batchDisable = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/whitelist/batchDisable',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 商家扣点规则列表
export const regulationListByCondition = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/listByCondition',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 新增扣点规则
export const addSave = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 编辑扣点规则
export const compileUpdate = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 删除扣点规则
export const removeRule = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/remove',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 根据商家id获取品牌列表
export const getSupplierBrandParentList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusWebGoods/getSupplierBrandParentList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 商家扣点白名单列表
export const listByConditionHZ = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/hz/listByCondition',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 新增扣点规则
export const addSaveHZ = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/hz/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 修改扣点规则
export const updateHZ = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/hz/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 删除扣点规则
export const removeHZ = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/hz/remove',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 批量/单个修改店主比例
export const batchUpdateProportion = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/whitelist/batchUpdateProportion',
		method: 'post',
		data,
		custom,
	})

// 白名单操作记录
export const updateProportionRecord = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/whitelist/updateProportionRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 导出平台调价(商家类目扣点)
export const exportPlatformAdjustmentByCategory = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/exportPlatformAdjustmentByCategory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 导出平台调价(商品)
export const exportPlatformAdjustmentByGoods = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/exportPlatformAdjustmentByGoods',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 平台调价(商家品牌类目)
export const platformAdjustmentByCategory = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/platformAdjustmentByCategory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 平台调价(商家品牌类目)杭州
export const platformAdjustmentByHZCategory = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/platformAdjustmentByHZCategory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})

// 平台调价(商家品牌类目)杭州
export const commissionAdjustmentByHZCategory = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/commissionAdjustmentByHZCategory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 平台调价(商家品牌类目)
export const commissionAdjustmentByCategory = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/commissionAdjustmentByCategory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 扣点操作记录
export const deductionRuleRecord = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/deductionRuleRecord',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 平台调价(商家类目扣点)列表
export const pagePlatformAdjustmentByCategory = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/pagePlatformAdjustmentByCategory',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 平台调价(商品)列表
export const pagePlatformAdjustmentByGoods = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/supplier/platformAdjustment/pagePlatformAdjustmentByGoods',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 导入平台调价(商家类目扣点)
export const importPlatformAdjustmentByCategory = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-genius-supplier-service/supplier/platformAdjustment/importPlatformAdjustmentByCategory`,
		method: 'post',
		data,
		custom,
	})
}
// 导入平台调价(商品)
export const importPlatformAdjustmentByGoods = (data, custom = {}) => {
	return request.request({
		url: `https://${window.location.host}/weeget-genius-supplier-service/supplier/platformAdjustment/importPlatformAdjustmentByGoods`,
		method: 'post',
		data,
		custom,
	})
}
// 导出扣点列表-广州
export const exportDeductionRule = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/exportDeductionRule',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
// 导出扣点列表-杭州
export const exportHzDeductionRule = (data, custom = {}) =>
	request.request({
		url: '/weeget-genius-supplier-service/deduction/rule/exportHzDeductionRule',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
