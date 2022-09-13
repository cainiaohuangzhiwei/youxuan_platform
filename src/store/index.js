/*
 * @Description: vuex总状态机
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-06 15:19:37
 * @LastEditTime: 2020-08-28 02:33:06
 * @LastEditors: Navi
 */
import Vue from 'vue'
import Vuex from 'vuex'
import persistedstate from 'vuex-persistedstate'
import Cookies from 'js-cookie'
import { AES } from '@/utils/crypto.js'
const crypto_aes = new AES()
Vue.use(Vuex)
const localStoragePaths = []
const sessionStoragePaths = []
const cookiePaths = []
// 模块化自动抽离
function loadModules() {
	const context = require.context('./modules', true, /\.js$/)
	const modules = {}
	context.keys().forEach((key) => {
		let fileName = key.replace(/(\.\/|\.js)/g, '')
		// console.log(fileName)
		modules[fileName] = context(key).default
		if (context(key).default.storage) {
			// console.log(context(key).default.storage, 'context(key).default')
			// 组装每个模块的storage
			context(key).default.storage.localStorages.map((local) => {
				localStoragePaths.push(`${fileName}.${local}`)
				// console.log(localStoragePaths, 'localStoragePaths')
				return `${fileName}.${local}`
			})
			// 组装每个模块的session
			context(key).default.storage.sessionStorages.map((session) => {
				sessionStoragePaths.push(`${fileName}.${session}`)
				// console.log(sessionStoragePaths, 'sessionStoragePaths')
				return `${fileName}.${session}`
			})
			// 组装每个模块的cookie
			context(key).default.storage.cookies.map((cookie) => {
				cookiePaths.push(`${fileName}.${cookie}`)
				// console.log(cookiePaths, 'cookiePaths')
				return `${fileName}.${cookie}`
			})
		}
	})
	return { context, modules }
}
const { context, modules } = loadModules()
const store = new Vuex.Store({
	modules,
	strict: process.env.NODE_ENV !== 'production',
	plugins: [
		// local存储
		persistedstate({
			storage: {
				getItem: (key) => {
					return crypto_aes.decode(window.localStorage.getItem(key))
				},
				setItem: (key, value) => {
					return window.localStorage.setItem(key, crypto_aes.encode(value))
				},
				removeItem: (key) => window.localStorage.removeItem(key),
			},
			paths: localStoragePaths,
		}),
		// session存储
		persistedstate({
			storage: {
				getItem: (key) => {
					return crypto_aes.decode(window.sessionStorage.getItem(key))
				},
				setItem: (key, value) => {
					return window.sessionStorage.setItem(key, crypto_aes.encode(value))
				},
				removeItem: (key) => window.sessionStorage.removeItem(key),
			},
			paths: sessionStoragePaths,
		}),
		// cookie存储
		persistedstate({
			storage: {
				getItem: (key) => {
					return crypto_aes.decode(Cookies.get(key))
				},
				setItem: (key, value) => {
					return Cookies.set(key, crypto_aes.encode(value), {
						expires: 30,
						secure: true,
						path: '/',
					})
				},
				removeItem: (key) => {
					Cookies.remove(key)
				},
			},
			paths: cookiePaths,
		}),
	],
})

// 开发环境,vuex 热重载
if (module.hot) {
	module.hot.accept(context.id, () => {
		store.hotUpdate({
			modules,
		})
	})
}
export default store
