/*
 * @Description: vue-router
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-14 23:18:45
 * @LastEditTime: 2021-08-04 16:45:09
 */

/* Router Modules */
import business from './dynamicRoutes/business'
import shop from './dynamicRoutes/shop'
import userOperation from './dynamicRoutes/userOperation'
import goods from './dynamicRoutes/goods'
import invite from './dynamicRoutes/invite'
import statistics from './dynamicRoutes/statistics'
import finance from './dynamicRoutes/finance'
import material from './dynamicRoutes/material'
import xcx from './dynamicRoutes/xcx'
import ym from './dynamicRoutes/ym'
import leadin from './dynamicRoutes/leadin'
import script from './dynamicRoutes/script'
import supply from './dynamicRoutes/supply'
// import merchantRating from './dynamicRoutes/merchantRating'
import set from './dynamicRoutes/set'
// import mall from './dynamicRoutes/mall'
import app from './dynamicRoutes/app'
import live from './dynamicRoutes/live'
import auth from './dynamicRoutes/auth'
import index from './dynamicRoutes/index'
import financingFile from './dynamicRoutes/financingFile'
import fund from './dynamicRoutes/fund'
import payment from './dynamicRoutes/payment'
// import newFund from './dynamicRoutes/newFund'
import evaluationSystem from './dynamicRoutes/evaluationSystem.js'
// import waterSubsidiary from './dynamicRoutes/waterSubsidiary'
import userGroup from './dynamicRoutes/userGroup'
import pickUp from './dynamicRoutes/pickUp'
import messageCenter from './dynamicRoutes/messageCenter'
import robot from './dynamicRoutes/robot'
import riskManagement from './dynamicRoutes/riskManagement.js'
import publicPage from './dynamicRoutes/publicPage.js'
import resourceNiche from './dynamicRoutes/resourceNiche.js'
import staticPages from './constantRoutes/static.js'
import Vue from 'vue'
import Router from 'vue-router'
import 'nprogress/nprogress.css' // progress bar style
import eggConfig from '../../config/config.default'
const youxuan_config = eggConfig({ name: 'youxuan_web' })

export const constantRoutes = [
	{
		path: '/',
		redirect: 'index',
	},
	auth,
	staticPages,
]

export const asyncRoutes = [
	index,
	business,
	shop,
	userOperation,
	goods,
	invite,
	statistics,
	finance,
	material,
	xcx,
	resourceNiche,
	ym,
	leadin,
	script,
	supply,
	// merchantRating,
	// mall,
	app,
	live,
	financingFile,
	fund,
	payment,
	// newFund,
	// waterSubsidiary,
	set,
	userGroup,
	pickUp,
	evaluationSystem,
	messageCenter,
	robot,
	publicPage,
	riskManagement,
]
Vue.use(Router)

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err)
}
const createRouter = () => {
	window.YOUXUAN_CONFIG = youxuan_config
	return new Router({
		base: youxuan_config.static.prefix.replace('static', ''),
		mode: 'history', // require service support
		scrollBehavior: () => ({ y: 0 }),
		routes: constantRoutes,
	})
}

const mainRouter = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	mainRouter.matcher = newRouter.matcher // reset router
}

export default mainRouter
