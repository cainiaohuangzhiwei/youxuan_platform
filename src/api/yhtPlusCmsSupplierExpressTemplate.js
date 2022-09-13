import request from '@/utils/interceptor/request'

//白名单列表
export const expressAccessList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplierExpressTemplate/expressAccessList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//启/禁用商家
export const expressAccess = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsSupplierExpressTemplate/expressAccess.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//商家运费模板列表
export const expressTemplateList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierExpressTemplate/expressTemplateList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//获取商家运费模板详情
export const getFeeTemplateDetail = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierExpressTemplate/getFeeTemplateDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

// 导出
export const exportSupplier = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/yhtPlusCmsSupplierExpressTemplate/exportSupplier.action',
		method: 'post',
		data,
		custom,
		responseType: 'arraybuffer',
		dataType: 'form',
	})
}

// 运费模板审核
export const settingFeeTemplateAudit = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsSupplierExpressTemplate/settingFeeTemplateAudit.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
