/*
 * @Description: 营销中心重构开关
 * @Author: 吴豪
 * @Email: wuhao@weeget.cn
 * @Date: 2021-05-19 09:26:09
 * @LastEditTime: 2021-05-19 10:44:33
 * @LastEditors: 吴豪
 */

import request from '@/utils/interceptor/request'

// 营销中心一期重构开关  默认false
export const getSwitchInfo = async (oldUrl, newUrl) => {
	let bl = false
	try {
		const res = await request.request({
			url: '/weeget-bullet-marketing-rest-fors/marketing/switch/versionSwitch',
			method: 'post',
			dataType: 'json',
		})

		const { data: resData } = res || {}
		const { resultData = false } = resData || {}
		bl = resultData
	} catch (e) {
		console.error('营销中心重构开发请求失败', e)
	}

	if (bl) {
		return {
			url: newUrl,
			dataType: 'json',
		}
	}

	return {
		url: oldUrl,
		dataType: 'form',
	}
}

// 发货下沉重构开关  默认false
export const getDeliveSwitch = async (oldUrl, newUrl) => {
	let bl = false
	try {
		const res = await request.request({
			url: '/weeget-genius-supplier-service/order/deliver/switch',
			method: 'get',
			// dataType: 'json',
		})

		const { data: resData } = res || {}
		const { resultData = false } = resData || {}
		bl = resultData
	} catch (e) {
		console.error('发货下沉重构开发请求失败', e)
		return {
			url: newUrl,
			dataType: 'json',
		}
	}

	if (bl) {
		return {
			url: newUrl,
			dataType: 'json',
		}
	}

	return {
		url: oldUrl,
		dataType: 'form',
	}
}
