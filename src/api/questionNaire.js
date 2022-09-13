import request from '@/utils/interceptor/request'
import Vue from 'vue'
const userName = Vue.prototype.$store.state.user.userInfo.clerkName || ''
// 问卷首页
export const questionNaireList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/pageQuery',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 新增问卷
export const questionNaireCreate = (data, custom = {}) => {
	data.userName = userName
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/add',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 修改问卷
export const questionNaireUpdate = (data, custom = {}) => {
	data.userName = userName
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/updateQueQuestionnaire',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 删除问卷
export const questionNaireDelete = (data, custom = {}) => {
	data.userName = userName
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/deleteById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 问卷详情
export const questionNaireDetail = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/getQuestionnaireDetailFors',
		method: 'post',
		data: data,
		custom,
		dataType: 'json',
	})
}

// 开启投放
export const questionNaireOpen = (data, custom = {}) => {
	data.userName = userName
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/launchQuestionnaire',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 关闭投放
export const questionNaireClose = (data, custom = {}) => {
	data.userName = userName
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/closeQuestionnaire',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 数据导出
export const questionNaireExport = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-service/questionnaire/que-questionnaire/v2/exportDataById',
		method: 'post',
		data,
		dataType: 'json',
		responseType: 'arraybuffer',
		custom,
	})
}

// 问卷复制
export const questionNaireCopy = (data, custom = {}) => {
	data.userName = userName
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/que-questionnaire/v2/copy',
		method: 'post',
		data,
		dataType: 'json',
		responseType: 'arraybuffer',
		custom,
	})
}

export const transformMsgLink = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/transform',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const getUserTagConfig = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/cms/base/user/tag/getUserTagConfig',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
export const clearUserTagRelation = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/cms/base/user/tag/clearUserTagRelation',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新增或更新档期与用户分群关系
export const goodsGroupUserTagRelation = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/cms/base/goods-group-user-tag-relation/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 根据档期id获取档期与用户分群关系
export const getListByGoodsGroupId = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/cms/base/goods-group-user-tag-relation/listByGoodsGroupId',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取指定业务类型的所有分群信息
export const getTagsByBizType = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/cms/base/user/tag/getTagsByBizType',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 问卷调查 （获取问卷入口列表）
export const questionnaireEntranceList = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/entrance/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 问卷调查 （更新问卷入口）
export const questionnaireEntranceUpdate = (data, custom = {}) => {
	return request.request({
		url: 'weeget-genius-backend-fors-rest/questionnaire/entrance/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
