/*
 * @Description: 用户相关状态机
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-06 15:23:40
 * @LastEditTime: 2020-10-16 20:19:39
 * @LastEditors: linjing
 */
import router from '@/router'
import {
	aPLogin,
	getFunctionListByUserId,
	getUserDetail,
	getRcAuthAccountByUserId,
} from '@/api/webUser.js'
import { goodsEnableCategoryTree } from '@/api/grossMargins'
import {
	getToken,
	setToken,
	setUserId,
	removeToken,
	removeUserId,
} from '@/utils/auth'
import { resetRouter } from '@/router'
const user = {
	namespaced: true,
	storage: {
		cache: ['functionList'],
		cookies: ['token'],
		sessionStorages: [],
		localStorages: ['userInfo'],
	},
	state: {
		token: getToken(),
		userInfo: {},
		functionList: [],
		rcAuthAccount: {},
		modifyPassword: false,
		treeData: [], // 类目树
	},
	mutations: {
		SET_TOKEN(state, val) {
			state.token = val
		},
		SET_USER_INFO(state, val) {
			state.userInfo = val
		},
		SET_FUNCTION_LIST(state, val) {
			state.functionList = val
		},
		SET_TREE_DATA(state, val) {
			state.treeData = val
		},
		SET_MODIFY_PASSWORD(state, val) {
			state.modifyPassword = val
		},
		SET_RC_AUTH_ACCOUNT(state, val) {
			state.rcAuthAccount = val
		},
	},
	actions: {
		setModifyPassword({ commit }, flag) {
			commit('SET_MODIFY_PASSWORD', flag)
		},
		async setTreeData({ commit }) {
			let res = await goodsEnableCategoryTree()
			let {
				data: { resultCode, resultData },
			} = res
			if (resultCode == 0) {
				commit('SET_TREE_DATA', resultData.goodsCategoryList || [])
			}
		},
		async setTokenAndUserId({ commit }, val) {
			let res = await aPLogin(val)
			let {
				data: { resultCode, resultData },
			} = res
			if (resultCode == 0) {
				commit('SET_TOKEN', resultData['X-AUTH-TOKEN'])
				setToken(resultData['X-AUTH-TOKEN'])
				setUserId(resultData.userId)
				return Promise.resolve(true)
			} else if (
				resultCode === 1401 ||
				resultCode === 1403 ||
				resultCode === 1407
			) {
				return Promise.resolve({ resultCode, resultData })
			} else {
				return Promise.reject(Error)
			}
		},

		/**
		 * @Description: 设置用户信息
		 * @param {type}:
		 * @return {type}:
		 */
		async setUserInfo({ commit }) {
			let {
				data: { resultCode, resultData },
			} = await getUserDetail()
			if (resultCode === 0) {
				if (resultData.userSimple && resultData.userSimple.type == 8) {
					return false
				} else {
					localStorage['yhtplus/_user'] = JSON.stringify(resultData.userSimple)
					localStorage['yhtplus/_company'] = JSON.stringify(resultData.company)
					commit('SET_USER_INFO', resultData.userSimple)
					return true
				}
			}
		},

		/**
		 * @Description: 设置functionList
		 * @param {type}:
		 * @return {type}:
		 */
		async setFunctionList({ commit }) {
			let {
				data: { resultCode, resultData, resultMsg },
			} = await getFunctionListByUserId()
			if (resultCode == 0) {
				localStorage['yhtplus/_function_list'] = JSON.stringify(
					resultData.functionList
				)
				commit('SET_FUNCTION_LIST', resultData.functionList)
				resetRouter()
				return Promise.resolve()
			} else {
				return Promise.reject(new Error(resultMsg))
			}
		},
		/**
		 * @Description: 设置RcAuthAccount 流量规则授权账户信息
		 * @param {type}:
		 * @return {type}:
		 */
		async setRcAuthAccount({ commit }) {
			let {
				data: { resultCode, resultData, resultMsg },
			} = await getRcAuthAccountByUserId()
			if (resultCode == 0) {
				localStorage['yhtplus/_rc_auth_account'] = JSON.stringify(
					resultData || {}
				)
				commit('SET_RC_AUTH_ACCOUNT', resultData || {})
				resetRouter()
				return Promise.resolve()
			} else {
				return Promise.reject(new Error(resultMsg))
			}
		},
		async clearLoginInfo({ dispatch, commit }, path) {
			localStorage['yhtplus/_user'] = null
			localStorage['vuex'] = null
			commit('SET_USER_INFO', {})
			commit('SET_TOKEN', '')
			commit('SET_FUNCTION_LIST', [])
			commit('SET_RC_AUTH_ACCOUNT', {})
			await dispatch('tagsView/delAllVisitedViews')
			await dispatch('tagsView/delAllCachedViews')
			removeToken()
			removeUserId()
			router.push({ path: '/auth/login', query: { redirect: path } })
			window.localStorage.removeItem('vuex')
			window.sessionStorage.removeItem('vuex')
			// 添加清空vuex数据，重新登录可以重新获取状态
			return Promise.resolve()
		},
	},
}

export default user
