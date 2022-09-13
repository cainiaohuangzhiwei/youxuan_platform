import request from '@/utils/interceptor/request'

// 客服托管
export const cusServiceList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/findCusServiceTrusteeship.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量控制（启用/禁用）客服托管信息
export const batchCtrlCusServiceTrusteeship = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/batchCtrlCusServiceTrusteeship.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量删除客服托管信息
export const batchDelCusServiceTrusteeship = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/batchDelCusServiceTrusteeship.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 批量插入客服托管信息
export const batchAddCusServiceTrusteeship = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/batchAddCusServiceTrusteeship.action',
		method: 'post',
		dataType: 'form',
		data,
		custom,
	})

// 上传Excel
export const importCusServiceTrusteeship = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/webImport/importCusServiceTrusteeship.action',
		method: 'post',
		data,
		custom,
	})
}
