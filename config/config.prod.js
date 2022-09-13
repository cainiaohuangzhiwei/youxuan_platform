/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = (exports = {})

	config.view = {
		root: path.join(appInfo.baseDir, 'app/public'),
		mapping: {
			'.html': 'nunjucks',
		},
	}

	config.alinode = {
		appid: '86183',
		secret: 'd7618698b381976f53bbe0a3f1973a1cfad21413',
		agentidMode: 'IP',
	}

	// config.security = {
	//   csrf: false
	// };

	return {
		...config,
	}
}
