/*
 * @Author       : linjing
 * @Date         : 2020-07-06 09:32:30
 * @LastEditors: linjing
 * @LastEditTime: 2020-11-25 18:10:22
 * @Description  :
 */
'use strict'
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path')

module.exports = (appInfo) => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = (exports = {})

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1592294759959_3891'

	// add your middleware config here
	let prefix = '/yhtplus/egg/'
	config.middleware = []
	config.static = {
		prefix: `${prefix}static`,
		dir: [
			path.join(`${appInfo.baseDir}`, '/app/public'),
			path.join(`${appInfo.baseDir}`, '/static'),
		],
	}
	config.httpclient = {
		request: {
			// 默认 request 超时时间
			timeout: 200000,
		},
	}
	config.multipart = {
		// will append to whilelist
		fileExtensions: ['.xlsx', '.xls', '.txt', '.pdf', '.doc'],
	}
	/**
	 * The option of `bodyParser` middleware
	 *
	 * @member Config#bodyParser
	 * @property {Boolean} enable - enable bodyParser or not, default is true
	 * @property {String | RegExp | Function | Array} ignore - won't parse request body when url path hit ignore pattern, can not set `ignore` when `match` presented
	 * @property {String | RegExp | Function | Array} match - will parse request body only when url path hit match pattern
	 * @property {String} encoding - body's encoding type，default is utf8
	 * @property {String} formLimit - limit of the urlencoded body. If the body ends up being larger than this limit, a 413 error code is returned. Default is 1mb
	 * @property {String} jsonLimit - limit of the json body, default is 1mb
	 * @property {String} textLimit - limit of the text body, default is 1mb
	 * @property {Boolean} strict - when set to true, JSON parser will only accept arrays and objects. Default is true
	 * @property {Number} queryString.arrayLimit - urlencoded body array's max length, default is 100
	 * @property {Number} queryString.depth - urlencoded body object's max depth, default is 5
	 * @property {Number} queryString.parameterLimit - urlencoded body maximum parameters, default is 1000
	 */
	config.bodyParser = {
		enable: true,
		encoding: 'utf8',
		formLimit: '10mb',
		jsonLimit: '10mb',
		textLimit: '10mb',
		queryString: {
			arrayLimit: 1000,
			depth: 50,
			parameterLimit: 10000,
		},
		onerror(err) {
			err.message += ', check bodyParser config'
			throw err
		},
	}

	// add your user config here
	const userConfig = {
		youxuan: {
			apiServe: {
				prefix: `${prefix}api`,
			},
		},
	}

	return {
		...config,
		...userConfig,
	}
}
