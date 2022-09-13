const BrowserLogger = require('alife-logger')
const jsCookie = require('js-cookie')
const version = require('../../package.json').version
const __bl = (() => {
	console.log('alife-logger init')
	try {
		return BrowserLogger.singleton({
			pid: 'i63onhebbm@57aef36790b9d98',
			appType: 'web',
			imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?',
			environment: jsCookie.get('environment') || 'local',
			release: version,
			sendResource: true,
			enableLinkTrace: true,
			behavior: true,
			enableConsole: true,
			useFmp: true,
			disableHook: true,
			enableSPA: true,
		})
	} catch (e) {
		console.error('alife-logger init error', e)
	}
})()
export default __bl
