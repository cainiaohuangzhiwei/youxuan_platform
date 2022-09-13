import mainRouter from './index'
import store from '@/store'
import CONSOLE_STYLE from '@/utils/console.js'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '../utils/auth' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/auth/login'] // no redirect whitelist

// 全局路由守卫
mainRouter.beforeEach(async (to, from, next) => {
	NProgress.start()
	console.log(`%c 当前页面路由路径${to.path}`, CONSOLE_STYLE.success)
	// 拿用户数据
	let token = getToken()
	// 除login之外的页面，没有用户数据时，跳转到login让用户登录
	if (token) {
		if (to.path === '/auth/login') {
			// if is logged in, redirect to the home page
			next({ path: '/' })
			NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
		} else {
			// console.log(
			// 	'1-store.state.user.functionList',
			// 	store.state.user.functionList
			// )
			const permission =
				store.state.user.functionList &&
				store.state.user.functionList.length > 0
			// console.log('permission', permission)
			if (permission) {
				next()
			} else {
				await store.dispatch('user/setFunctionList')
				await store.dispatch('user/setRcAuthAccount')
				const accessRoutes = await store.dispatch(
					'permission/generateRoutes',
					{}
				)
				// console.log(to, 'accessRoutes', accessRoutes)
				mainRouter.addRoutes(accessRoutes)
				// console.log('mainRouter', mainRouter)
				next({ ...to, replace: true })
				// next()
			}
		}
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			// in the free login whitelist, go directly
			next()
		} else {
			// other pages that do not have permission to access are redirected to the login page.
			next(`/auth/login?redirect=${to.path}`)
			NProgress.done()
		}
	}
})

mainRouter.afterEach(() => {
	// finish progress bar
	NProgress.done()
})
