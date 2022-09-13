/*
 * @Description  :
 * @Author       : 你的名字
 * @Email        : 你的邮箱
 * @Date         : 2020-12-30 17:38:41
 * @LastEditTime : 2021-01-05 14:19:44
 * @LastEditors  : 你的名字
 */
import fetchWithSign from '@/utils/interceptor/requestSignature'

export const getDotEventList = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-dot-rest/api/getDotEventConfig',
		method: 'post',
		data,
		custom,
	})
}

export const createDotEvent = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-dot-rest/api/addDotEventConfig',
		method: 'post',
		data,
		custom,
	})
}

export const getDotEvent = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-dot-rest/api/getDotEventConfigId',
		method: 'post',
		data,
		custom,
	})
}

export const editDotEvent = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-dot-rest/api/editDotEventConfig',
		method: 'post',
		data,
		custom,
	})
}

export const deleteDotEvent = (data, custom = {}) => {
	return fetchWithSign.request({
		url: 'weeget-infinite-dot-rest/api/dropDotEventConfig',
		method: 'post',
		data,
		custom,
	})
}
