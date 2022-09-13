import request from '@/utils/interceptor/request'
/*
 * -----------------------------------店铺等级配置----------------------------------------
 */
// 店铺等级配置列表
// export const getLevelByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsLevel/getLevelByCondition.action',
// 		data,
// 		loadingOptions
// 	)
// export const getLevelByCondition = (data, custom = {}) =>
// 	request.request({
// 		url: '/yhtplus/yhtPlusCmsLevel/getLevelByCondition.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		dataType: 'form',
// 	})
// 店铺等级审核列表
// export const findToExamineByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsLevel/findToExamineByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const findToExamineByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLevel/findToExamineByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 手动升级组织等级
// export const updateOrganizationLevel = (data, loadingOptions) =>
// 	http.form(
// 		'yhtPlusCmsLevel/updateOrganizationLevel.action',
// 		data,
// 		loadingOptions
// 	)
export const updateOrganizationLevel = (data, custom = {}) =>
	request.request({
		url: 'yhtPlusCmsLevel/updateOrganizationLevel.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//批量审核升级店铺
export const updateOrganizationToExamineStatusByIdList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsLevel/updateOrganizationToExamineStatusByIdList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//批量设置寄件
export const batchMailing = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLevel/batchMailing.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//保存店铺等级设置
export const saveLevel = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsLevel/saveLevel.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
