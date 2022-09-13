'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
	const { router, controller } = app
	router.all(`${app.config.youxuan.apiServe.prefix}/*`, controller.home.proxy)
	if (app.config.env == 'prod') {
		router.get('*', controller.home.index)
	}
}
