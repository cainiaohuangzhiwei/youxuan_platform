/*
 * @Description: 请求拦截器
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-06 10:11:05
 * @LastEditTime: 2021-05-25 10:39:43
 * @LastEditors: 你的名字
 */

import axios from 'axios'
import qs from 'qs'
import Message from '@/utils/message.js'
Message.setConfig({ max: 1, isQueue: false, showNewest: false })
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
import eggConfig from '../../../config/config.default'
// import alifeLogger from '@/utils/alifeLogger'
const youxuan_config = eggConfig({ name: 'youxuan_web' })

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
				? ''
				: document.cookie.match(regex)[1],
	},
	// 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
	validateStatus: (statusCode) => {
		// statusCode 必存在。此处示例为全局默认配置
		return (statusCode >= 200 && statusCode < 300) || statusCode == 400
	},
})
/**
 * @Description: 防重复提交
 * 使用案例：.vue文件中
<el-button @click.stop="_request"></el-buton>
...
import {testRequest} from '@api/test/request/js'
methods: {
	async _testRequest(e) {
		let params = {
			app_key: 'B16DCD9D4A2E953FD3827FDE7A524FC0',
			need_sex: '女'
		}
		// 自定义的请求属性，不带入请求体中，只会被axios识别
		// 必须将组件唯一id作为自定义请求属性custom.uid的属性值
		let custom = {uid: e.currentTarget.__vue__._uid}
		let res = await testRequest(params,custom)
	}
}
 */
const removePendingAjax = (config, cancel) => {
	const uidUrl = `${config.url}${config.custom.uid}`
	// console.log('config.custom', config.custom)
	const index = pendingAjax.findIndex((item) => item === uidUrl)
	// console.log(index, 'index')
	// 若pengdingAjax 中有对应元素
	if (index > -1) {
		cancel ? cancel(fastClickMsg) : pendingAjax.splice(index, 1)
		// 若peddingAjax无对应元素
	} else {
		cancel && pendingAjax.push(uidUrl)
	}
}
// 请求拦截
request.interceptors.request.use(
	(config) => {
		config.startTime = new Date()
		// console.log('axios请求体:', config)
		// 从config 中拿取自定义传入的custom对象数据，如果没有就给个空对象
		// 如果axios的请求状态带有custom.uid，就对该请求进行防重复提交限制
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
		config.headers['user_id'] = store.state.user.userInfo.userId
		// 判断data是否是formData类型
		let isFormData =
			Object.prototype.toString.call(config.data) === '[object FormData]'
		//传入公共参数
		if (isFormData) {
			let formData = new FormData()
			formData.append('userId', store.state.user.userInfo.userId || '')
			formData.append('groupId', store.state.user.userInfo.groupId || 2)
			for (let keys of config.data.keys()) {
				let dataItem = config.data.get(keys)
				if (Object.prototype.toString.call(dataItem) === '[object File]') {
					formData.append(keys, dataItem, dataItem.name)
				} else {
					formData.append(keys, dataItem)
				}
			}

			config.data = formData
		} else {
			console.log(config)
			if (
				config.responseType &&
				config.responseType == 'arraybuffer' &&
				!config.data.isLength
			) {
				delete config.data.length
			}
			// config.data = securityReplace(config.data, 'request')
			if (config.dataType && config.dataType !== 'json') {
				config.data = {
					timeStamp: new Date() * 1,
					groupId: store.state.user.userInfo.groupId,
					sortField: 0,
					...config.data,
					userId: store.state.user.userInfo.userId,
				}
			}
		}

		// 弥补后端技术债，定义的dataType，用于处理以前定义的 form 请求的数据结构
		// data: {"key":"value"},userId: 2234
		if (Reflect.has(config, 'dataType')) {
			if (config.dataType === 'form') {
				config.header = {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				}
				config.data = {
					data: JSON.stringify({
						...config.data,
					}),
					userId: store.state.user.userInfo.userId,
				}
			} else if (config.dataType === 'json') {
				config.headers['Content-Type'] = 'application/json;charset=UTF-8'
			}
		}
		// 定义data需要被qs序列化的method列表
		const qsList = ['post']
		// 携带默认参数
		// 如果method被包含在qsList中，则对data进行序列化
		if (config.dataType && config.dataType !== 'json') {
			if (!isFormData && qsList.includes(config.method.toLowerCase())) {
				config.data = qs.stringify({
					...config.data,
				})
			}
		}
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
		// 请求出错给予提示 导入奖励错误页面提示
		let messageUrl = ['/yhtplus/webImport/ckeckActBonus.action']
		if (response.data.resultCode != 0) {
			if (
				response.data.resultMsg &&
				messageUrl.indexOf(response.config.url) == -1
			) {
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
