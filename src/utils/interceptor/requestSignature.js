import axios from 'axios'
import Message from '@/utils/message.js'
Message.setConfig({ max: 1, isQueue: false, showNewest: false })
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
import eggConfig from '../../../config/config.default'
// import alifeLogger from '@/utils/alifeLogger'
import crypto from 'crypto-js'

/**
 * 指定长度的随机数
 * @param {number} len 长度
 * @return {string} 随机数（0-9a-z）
 */
function rondomLen(len) {
	const r = Math.floor(Math.random() * 2742745743360 + 78364164096)
	const rondom8 = r.toString(36)

	const time = Math.ceil(len / 8)
	let result = ''
	for (let i = 0; i < time; i++) {
		result += rondom8
	}
	return result.slice(0, len)
}

/**按ascii码从小到大排序
 *
 * @param {object} obj 对象
 * @return {string} 排序后的字符串
 */
function sortAscii(obj) {
	let arr = Object.keys(obj)
	let sortArr = arr.sort()
	const result = sortArr
		.reduce((res, key) => {
			res.push(`${key}=${obj[key]}`)
			return res
		}, [])
		.join('&')
	return result
}

/**
 * 对象扁平化，过滤空字符和null
 * @param {Object} data 对象
 * @return {Object} 扁平化后的对象
 */
function flatten(data) {
	let result = {}
	/**
	 * 递归对象扁平化
	 * @param {Object} cur 对象
	 * @param {Object} prop 属性值
	 * @return {Object} 扁平化后的对象
	 */
	function recurse(cur) {
		for (let prop in cur) {
			if (prop === 'param') {
				recurse(cur[prop])
			} else if (
				typeof cur[prop] !== 'object' &&
				cur[prop] !== null &&
				cur[prop] !== ''
			) {
				result[prop] = cur[prop]
			}
		}
	}
	recurse(data)
	return result
}

const youxuan_config = eggConfig({ name: 'youxuan_web' })
// 网关验签秘钥
const secretKey = 'UER9oXBfDvdIm7G6Gz9O'
// 网关验签sid，32位随机数
const sid = rondomLen(32)

// 防重复提交
let pendingAjax = []
const fastClickMsg = '数据请求中，请勿重复操作'
const CancelToken = axios.CancelToken

// 用于从cookie中匹配 csrftoken值
let regex = /.*csrfToken=([^;.]*).*$/
const request = axios.create({
	// timeout: 10000,
	baseURL: `${youxuan_config.youxuan.apiServe.prefix}`,
	headers: {
		'x-csrf-token':
			document.cookie.match(regex) === null
				? 'null'
				: document.cookie.match(regex)[1],
	},
	// 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
	validateStatus: (statusCode) => {
		// statusCode 必存在。此处示例为全局默认配置
		return (statusCode >= 200 && statusCode < 300) || statusCode == 400
	},
})

const removePendingAjax = (config, cancel) => {
	const uidUrl = `${config.url}${config.custom.uid}`
	const index = pendingAjax.findIndex((item) => item === uidUrl)
	if (index > -1) {
		cancel ? cancel(fastClickMsg) : pendingAjax.splice(index, 1)
	} else {
		cancel && pendingAjax.push(uidUrl)
	}
}
// 请求拦截
request.interceptors.request.use(
	(config) => {
		config.startTime = new Date()
		const custom = config.custom || {}
		if (Reflect.has(custom, 'uid')) {
			config.cancelToken = new CancelToken((cancel) => {
				removePendingAjax(config, cancel)
			})
		}
		if (getToken() || store.state.user.token) {
			config.headers['X-AUTH-TOKEN'] = getToken() || store.state.user.token
		}
		// 平台标识1:APP,2:小程序,3:公众号,4:S端,5社群平台端, 6c端app, 7商家
		config.headers['WEEGET_PLATFORM_TYPE'] = 4
		config.headers['sid'] = sid
		config.headers['user_id'] = store.state.user.userInfo.userId

		let { data: param = {}, url } = config
		// param.userId = store.state.user.userInfo.userId
		// param.groupId = store.state.user.userInfo.groupId
		param.timeStamp = new Date().getTime()
		param.sortField = 0
		const data = {}
		data.param = param
		data.api = url
		data.caller = 'yhyx-miniprogram'
		data.requestId = rondomLen(8)
		data.time = (new Date().getTime() / 1000) >>> 0
		data.sign = crypto
			.MD5(sortAscii(flatten(data)) + '&secretKey=' + secretKey)
			.toString()

		config.data = data
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)
// 响应拦截
request.interceptors.response.use(
	(response) => {
		// try {
		// 	alifeLogger.api(
		// 		response.config.url,
		// 		true,
		// 		Date.now() - response.config.startTime,
		// 		Number(`10068${response.data.resultCode}`),
		// 		response.data.resultMsg
		// 	)
		// } catch (e) {
		// 	console.error('alife-logger api error', e)
		// }
		// console.log('axios响应体', response)
		// 从config中拿取自定义的custom对象，如果没有，给个空对象
		let custom = response.config.custom || {}
		if (Reflect.has(custom, 'uid')) {
			removePendingAjax(response.config)
		}
		// 打印后端状态码
		// console.log('response.data.resultCode', response.data.resultCode)
		// 请求出错给予提示
		if (response.data.resultCode != 0) {
			if (response.data.resultMsg) {
				Message.error(response.data.resultMsg)
			}
		}
		// console.log(response)
		// console.log(Object.prototype.toString.call(response.data))
		if (
			Object.prototype.toString.call(response.data) === '[object ArrayBuffer]'
		) {
			try {
				let enc = new TextDecoder('utf-8')
				let res = JSON.parse(enc.decode(new Uint8Array(response.data))) // 转化成json对象
				if (res && res.resultCode) {
					Message.error(res.resultMsg)
					return false
				}
			} catch (err) {
				// let blob = new Blob([response.data])
				return response
			}
		}
		// 单点登录则回到登录页面
		// switch (response.data.resultCode) {
		// }
		if (response.data.resultCode == -12) {
			store.dispatch('user/setModifyPassword', true)
		}
		if (
			response.data.resultCode == -4 ||
			response.data.resultCode == -3 ||
			response.data.resultCode == -10
		) {
			if (response.data.resultMsg) {
				Message.error(response.data.resultMsg)
			}
			store.dispatch('user/clearLoginInfo', router.currentRoute.path || '/')
		}
		// 对数据进行过滤
		// if (response.data.resultData) {
		// 	response.data.resultData = securityReplace(
		// 		response.data.resultData,
		// 		'respone'
		// 	)
		// 	console.log(response.data.resultData, 'response.data.resultData')
		// }
		if (
			response.data.resultData == null ||
			response.data.resultData == undefined
		) {
			response.data.resultData = {}
		}
		return response
	},
	// TODO: 测试请求出错的清空防提交
	(error) => {
		// try {
		// 	alifeLogger.api(
		// 		error.config.url,
		// 		true,
		// 		Date.now() - error.config.startTime,
		// 		error.status,
		// 		error.statusText
		// 	)
		// } catch (e) {
		// 	console.error('alife-logger api error', e)
		// }
		let custom = error.config.custom || {}
		if (Reflect.has(custom, 'uid')) {
			removePendingAjax(error.config)
		}

		Message.error(error.message)
		return Promise.reject(error)
	}
)
export default request
