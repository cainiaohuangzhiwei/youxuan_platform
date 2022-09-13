import request from '@/utils/interceptor/request'
// 查看操作日志
export const operationalLogsList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusOperationalLogs/operationalLogsList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 操作对象搜索
export const findObjects = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusOperationalLogs/findObjects.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
