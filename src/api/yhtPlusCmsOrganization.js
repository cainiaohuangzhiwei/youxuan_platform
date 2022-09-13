import request from '@/utils/interceptor/request'
/*
 * -----------------------------------店铺管理----------------------------------------
 */
// 店铺列表
// export const getOrganizationListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/getOrganizationListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const getOrganizationListByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/getOrganizationListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 店铺详情
// export const getOrganizationDetails = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/getOrganizationDetails.action',
// 		data,
// 		loadingOptions
// 	)
export const getOrganizationDetails = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/getOrganizationDetails.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增店铺
// export const addOrganization = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/addOrganization.action',
// 		data,
// 		loadingOptions
// 	)
export const addOrganization = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/addOrganization.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 编辑店铺
// export const updateOrganizationByOrganizationId = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/updateOrganizationByOrganizationId.action',
// 		data,
// 		loadingOptions
// 	)
export const updateOrganizationByOrganizationId = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/updateOrganizationByOrganizationId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 店铺详情数据
// export const findOrganizationDetails = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/findOrganizationDetails.action',
// 		data,
// 		loadingOptions
// 	)
export const findOrganizationDetails = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/findOrganizationDetails.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取店铺入账详情
// export const findIntoAccountDetailsByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/findIntoAccountDetailsByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const findIntoAccountDetailsByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/findIntoAccountDetailsByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 店铺详情销售统计
// export const findCMSOrganizationDetailsStatistics = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/findCMSOrganizationDetailsStatistics.action',
// 		data,
// 		loadingOptions
// 	)
export const findCMSOrganizationDetailsStatistics = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/findCMSOrganizationDetailsStatistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取下级店铺树
// export const getOrganizationTree = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/getOrganizationTree.action',
// 		data,
// 		loadingOptions
// 	)
export const getOrganizationTree = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/getOrganizationTree.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 设置身份
// export const updateOrganizationRoleByOrganizationId = (data, loadingOptions) =>
// 	http.form(
// 		'yhtPlusCmsOrganization/updateOrganizationRoleByOrganizationId.action',
// 		data,
// 		loadingOptions
// 	)
export const updateOrganizationRoleByOrganizationId = (data, custom = {}) =>
	request.request({
		url: 'yhtPlusCmsOrganization/updateOrganizationRoleByOrganizationId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 设置店铺维护部门
// export const bindDepartmentId = (data, loadingOptions) =>
// 	http.form(
// 		'yhtPlusCmsOrganization/bindDepartmentId.action',
// 		data,
// 		loadingOptions
// 	)
export const bindDepartmentId = (data, custom = {}) =>
	request.request({
		url: 'yhtPlusCmsOrganization/bindDepartmentId.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 客服托管列表
// export const findCusServiceTrusteeship = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/findCusServiceTrusteeship.action',
// 		data,
// 		loadingOptions
// 	)
export const findCusServiceTrusteeship = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/findCusServiceTrusteeship.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 批量插入客服托管信息
// export const batchAddCusServiceTrusteeship = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/batchAddCusServiceTrusteeship.action',
// 		data,
// 		loadingOptions
// 	)
export const batchAddCusServiceTrusteeship = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/batchAddCusServiceTrusteeship.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 批量控制（启用/禁用）客服托管信息
// export const batchCtrlCusServiceTrusteeship = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/batchCtrlCusServiceTrusteeship.action',
// 		data,
// 		loadingOptions
// 	)
export const batchCtrlCusServiceTrusteeship = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/batchCtrlCusServiceTrusteeship.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 批量删除客服托管信息
// export const batchDelCusServiceTrusteeship = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/batchDelCusServiceTrusteeship.action',
// 		data,
// 		loadingOptions
// 	)
export const batchDelCusServiceTrusteeship = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/batchDelCusServiceTrusteeship.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 退货率统计列表
// export const findOrganizationRefundCountByparam = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsOrganization/findOrganizationRefundCountByparam.action',
// 		data,
// 		loadingOptions
// 	)
export const findOrganizationRefundCountByparam = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/findOrganizationRefundCountByparam.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 导出店主退货率统计
// export const exportOrganizationRefundCountByCondition = (
// 	data,
// 	loadingOptions
// ) =>
// 	http.download(
// 		'/yhtplus/yhtPlusCmsOrganization/exportOrganizationRefundCountByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const exportOrganizationRefundCountByCondition = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsOrganization/exportOrganizationRefundCountByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//操作记录
export const cusServiceTrusteeshipRecord = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/cusServiceTrusteeshipRecord.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//开启
export const cusServiceTrusteeshipOnForC = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/cusServiceTrusteeshipOnForC.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//关闭
export const cusServiceTrusteeshipOffForC = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsOrganization/cusServiceTrusteeshipOffForC.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
