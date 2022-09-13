/*
 * @Description: 中间层local配置
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-02 16:39:04
 * @LastEditTime: 2020-07-16 15:56:23
 * @LastEditors: Navi
 */

/* eslint valid-jsdoc: "off" */

'use strict'
// 导入环境配置文件
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = () => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = (exports = {})

	config.assets = {
		devServer: {
			command: 'vue-cli-service serve',
			port: 8080,
		},
	}

	config.security = {
		csrf: false,
	}
	const userConfig = {
		youxuan: {
			apiServe: {
				protocol: 'http',
			},
		},
	}
	return {
		...config,
		...userConfig,
	}
}
