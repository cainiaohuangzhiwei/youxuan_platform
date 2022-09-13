import request from '@/utils/interceptor/request'
// 数据分析列表接口
export const goodsGroupDataAnalysisList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/preheat/preConfig/goodsGroupDataAnalysisList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 保存预热配置接口
export const savePreheatConfig = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/preheat/preConfig/savePreheatConfig.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 预热配置详情接口
export const preheatConfigDetail = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/preheat/preConfig/preheatConfigDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 预告日期列表接口
export const goodsGroupNoticeDateList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/preheat/preGoodsGroup/goodsGroupNoticeDateList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

// 分组预告列表接口
export const goodsGroupNoticeList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/preheat/preGoodsGroup/goodsGroupNoticeList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
