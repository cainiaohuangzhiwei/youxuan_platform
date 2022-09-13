import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 获取评价素材
export const getEvaluationMaterialListByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsEvaluationMaterial/getEvaluationMaterialListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 发布或者删除评价素材
export const releaseOrDelEvaluationMaterial = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsEvaluationMaterial/releaseOrDelEvaluationMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增评价素材
export const addEvaluationMaterial = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsEvaluationMaterial/addEvaluationMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增评价素材
export const editEvaluationMaterial = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsEvaluationMaterial/editEvaluationMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
