'use strict'

const Controller = require('egg').Controller
const buildSpace = require('../../config/buildSpace')
let serviceMap = buildSpace.serviceMap
class HomeController extends Controller {
	async index() {
		const { ctx } = this
		// 存入缓存
		for (let key in buildSpace) {
			if (key !== 'serviceMap') {
				ctx.cookies.set(key, buildSpace[key], {
					httpOnly: false,
					signed: false,
				})
			}
		}
		await ctx.render('index.html')
	}
	async proxy() {
		const { ctx } = this
		this.app.config.youxuan.apiServe.protocol = buildSpace.protocol
		this.app.config.youxuan.apiServe.url = buildSpace.domainName
		// 根据服务接口关键词匹配出对应的域名
		for (let key in serviceMap) {
			if (ctx.path.indexOf(key) > -1 && buildSpace[key]) {
				this.app.config.youxuan.apiServe.url = buildSpace[key]
			}
		}

		const res = await ctx.proxy()
		ctx.body = res.data
		ctx.status = res.status
	}
}
module.exports = HomeController
