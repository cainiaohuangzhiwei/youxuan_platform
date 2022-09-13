/*
 * @Description: 鉴权路由数据
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-26 15:06:10
 * @LastEditTime: 2020-09-10 11:01:34
 * @LastEditors: Navi
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { checkFunctionCode } from '@/utils/auth.js'
// /**
//  * Use meta.role to determine if the current user has permission
//  * @param roles
//  * @param route
//  */
function hasPermission(route) {
	if (route.meta && route.meta.functionCode) {
		let codes = route.meta.functionCode
		return codes.some((item) => {
			return checkFunctionCode(item)
		})
	} else if (route.meta && route.meta.functionList) {
		let list = route.meta.functionList
		return list.every((item) => {
			return checkFunctionCode(item)
		})
	} else {
		// 无任何权限配置则默认为true，代表有权限访问
		return true
	}
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
export function filterAsyncRoutes(routes) {
	const res = []

	routes.forEach((route) => {
		// if (route.children) {
		// 	console.log('hidden route', route)
		// 	// route.hidden = true
		// }
		const tmp = { ...route }
		if (hasPermission(tmp)) {
			if (tmp.children) {
				tmp.children = filterAsyncRoutes(tmp.children)
				// 如果所有子路由都没有权限，就不显示这个侧边栏选项
				if (tmp.children.length === 0) {
					tmp.hidden = true
				}
			}
			res.push(tmp)
		}
	})

	return res
}

const mutations = {
	SET_ROUTES: (state, routes) => {
		state.addRoutes = routes
		state.routes = constantRoutes.concat(routes)
	},
}

const actions = {
	generateRoutes({ commit }) {
		return new Promise((resolve) => {
			let accessedRoutes = asyncRoutes || []
			accessedRoutes = filterAsyncRoutes(asyncRoutes)
			// console.log('generateRoutes', accessedRoutes)
			commit('SET_ROUTES', accessedRoutes)
			resolve(accessedRoutes)
		})
	},
}

export default {
	namespaced: true,
	storage: {
		cache: ['routes', 'addRoutes'],
		cookies: [],
		sessionStorages: [],
		localStorages: [],
	},
	state: {
		routes: [],
		addRoutes: [],
	},
	mutations,
	actions,
}
