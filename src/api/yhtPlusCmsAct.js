import request from '@/utils/interceptor/request'
/*
 * -----------------------------------活动----------------------------------------
 */
// 保存互助计划活动
// export const saveActMentoringProgram = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/saveActMentoringProgram.action',
// 		data,
// 		loadingOptions
// 	)
export const saveActMentoringProgram = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/saveActMentoringProgram.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取互助计划活动详情
// export const getActMentoringProgramDetail = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getActMentoringProgramDetail.action',
// 		data,
// 		loadingOptions
// 	)
export const getActMentoringProgramDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActMentoringProgramDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取互助计划活动店主列表
// export const getOrganizationListByActMentoringProgram = (
// 	data,
// 	loadingOptions
// ) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getOrganizationListByActMentoringProgram.action',
// 		data,
// 		loadingOptions
// 	)
export const getOrganizationListByActMentoringProgram = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsAct/getOrganizationListByActMentoringProgram.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取砍单活动
// export const getActChopList = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getActChopList.action',
// 		data,
// 		loadingOptions
// 	)
export const getActChopList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActChopList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 小程序营销活动
// export const getActDiscountListByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getActDiscountListByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const getActDiscountListByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActDiscountListByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取活动列表
// export const getActByCondition = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getActByCondition.action',
// 		data,
// 		loadingOptions
// 	)
export const getActByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 开启关闭活动
// export const updateActStatus = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/updateActStatus.action',
// 		data,
// 		loadingOptions
// 	)
export const updateActStatus = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/updateActStatus.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 云米记录
// export const getUserGoldAmount = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getUserGoldAmount.action',
// 		data,
// 		loadingOptions
// 	)
export const getUserGoldAmount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getUserGoldAmount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 云米数据统计
// export const getGoldAmountStatistics = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getGoldAmountStatistics.action',
// 		data,
// 		loadingOptions
// 	)
export const getGoldAmountStatistics = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getGoldAmountStatistics.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 冻结云米
// export const setGoldAmountFrozen = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/setGoldAmountFrozen.action',
// 		data,
// 		loadingOptions
// 	)
export const setGoldAmountFrozen = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/setGoldAmountFrozen.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取用户云米记录明细
// export const getUserGoldAmountDetail = (data, loadingOptions) =>
// 	http.form(
// 		'/yhtplus/yhtPlusCmsAct/getUserGoldAmountDetail.action',
// 		data,
// 		loadingOptions
// 	)
export const getUserGoldAmountDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getUserGoldAmountDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取限制加价活动详情
export const getActLimitMarkupDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActLimitMarkupDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 删除满减满折活动
export const delActDiscount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/delActDiscount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 新增满减满折活动
export const addActDiscount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/addActDiscount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 保存限制加价活动
export const saveActLimitMarkup = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/saveActLimitMarkup.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 编辑满减满折活动
export const editActDiscount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/editActDiscount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 保存奖励邀请码活动
export const saveActInviteCode = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/saveActInviteCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 保存拉新活动
export const saveActNew = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/saveActNew.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取拉新奖励详情
export const getActNewDetail = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActNewDetail.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取邀请码奖励活动列表
export const getActInviteCodeByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActInviteCodeByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 奖励邀请码达标用户列表
export const getActInviteCodeRecordByCondition = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActInviteCodeRecordByCondition.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
// 获取奖励邀请码活动
export const getActInviteCodeById = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsAct/getActInviteCodeById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
