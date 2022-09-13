/*
 * @Description: 鉴权工具方法
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-24 16:29:36
 * @LastEditTime: 2020-10-12 16:59:26
 * @LastEditors: lufengkai
 */
import Cookies from 'js-cookie'
import store from '@/store'
/**
 * @Description: 检查functionList
 * @param {String}: str 要检测的字符串
 * @return {Boolean}
 */
const TokenKey = 'yhtplus/web/yxToken2020'
const userIdKey = 'yhtplus/web/userId'

export function getToken() {
	return Cookies.get(TokenKey)
}

export function setToken(token) {
	return Cookies.set(TokenKey, token, { expires: 30 })
}

export function setUserId(userId) {
	return Cookies.set(userIdKey, userId, {
		expires: 30,
	})
}

export function removeToken() {
	return Cookies.remove(TokenKey)
}
export function removeUserId() {
	return Cookies.remove(userIdKey)
}
export const checkFunctionCode = function (str) {
	const functionList = store.state.user.functionList.map((item) => {
		return item.functionCode
	})
	return functionList.includes(str)
}

export const checkFunctionCodeList = function (arr) {
	let flag = arr.every((item) => {
		checkFunctionCode(item)
	})
	return flag
}
