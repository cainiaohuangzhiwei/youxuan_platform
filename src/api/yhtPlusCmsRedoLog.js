import request from '@/utils/interceptor/request'

// 审计记录
export const getCmsRedoLogList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsRedoLog/list.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
