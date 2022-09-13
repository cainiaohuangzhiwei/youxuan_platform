import request from '@/utils/interceptor/request'

// 获取互助计划活动店主列表
export const storekeeperMentoringStatisticsMP = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/storekeeper/storekeeperMentoringStatisticsMP.action',
		method: 'post',
		data,
		dataType: 'form',
		custom,
	})

// 互助店主列表导出
export const storekeeperMentoringExport = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/storekeeper/storekeeperMentoringExport.action',
		method: 'post',
		data,
		responseType: 'arraybuffer',
		custom,
		dataType: 'form',
	})
