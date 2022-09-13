import request from '@/utils/interceptor/request'
import Vue from 'vue'
const userId = Vue.prototype.$store.state.user.userInfo.userId || ''
// 规则列表
export const queryGoodsPoolRuleDetailList = (data, custom = {}) => {
	data.userId = userId
	return request.request({
		url: 'weeget-bullet-rule-rest-fors/rcGoodsPoolRule/queryRuleDetailList',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

//新增规则
export const addRule = (data, custom = {}) => {
	data.userId = userId
	return request.request({
		url: 'weeget-bullet-rule-rest-fors/rcGoodsPoolRule/addPoolAndRule',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 删除规则
export const deleteRuleById = (data, custom = {}) => {
	data.userId = userId
	return request.request({
		url: 'weeget-bullet-rule-rest-fors/rcGoodsPoolRule/deleteById',
		method: 'get',
		params: data,
		custom,
		dataType: 'json',
	})
}

// 修改规则
export const updateRuleById = (data, custom = {}) => {
	data.userId = userId
	return request.request({
		url: 'weeget-bullet-rule-rest-fors/rcGoodsPoolRuleGroupDetail/updateById',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 商品明细
export const queryGoodsDetailsListByRule = (data, custom = {}) => {
	data.userId = userId
	return request.request({
		url: 'weeget-bullet-rule-rest-fors/rcGoodsPool/queryGoodsListByRule',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 会场明细
export const queryGoodsGroupListByRule = (data, custom = {}) => {
	data.userId = userId
	return request.request({
		url: 'weeget-bullet-rule-rest-fors/rcGoodsPool/queryGoodsGroupListByRule',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
