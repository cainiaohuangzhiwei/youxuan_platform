/*
 * @Description: 自定义elementui Message
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-25 10:51:03
 * @LastEditTime: 2020-08-25 11:18:50
 * @LastEditors: Navi
 */

import { Message } from 'element-ui'

const messageTypes = ['success', 'warning', 'error', 'info']

function ZMessage(options) {
	if (!(this instanceof ZMessage)) {
		return new ZMessage(options)
	}
	this.init(options)
}

ZMessage.queue = [] // 未展示数据的消息队列

ZMessage.instances = [] // 消息体实例列表

// 配置项
ZMessage.config = {
	max: 0, // 最大显示数
	isQueue: false, // 是否以队列形式存储为展示消息
	showNewest: true, // 是否后添加的消息覆盖前面的消息
}

// 配置参数
ZMessage.setConfig = function (config = {}) {
	ZMessage.config = { ...ZMessage.config, ...config }
}

ZMessage.close = Message.close

ZMessage.closeAll = Message.closeAll

// 各消息类型静态方法
messageTypes.forEach((type) => {
	ZMessage[type] = (options) => {
		let opts = options
		if (typeof options === 'string') {
			opts = {
				message: options,
			}
		}
		return new ZMessage({ ...opts, type })
	}
})

// 初始化
ZMessage.prototype.init = function (options) {
	const { max, isQueue, showNewest } = ZMessage.config
	// 判断如果超出最大消息数时，删除消息
	if (max > 0 && ZMessage.instances.length >= max && showNewest && !isQueue) {
		this.removeMessages()
	}

	if (ZMessage.instances.length >= max && isQueue) {
		// 添加队列元素
		ZMessage.queue.push(this.saveToQueue(options))
	} else if (ZMessage.instances.length < max || !max) {
		this.setMessage(options)
	}
}

// 移除消息
ZMessage.prototype.removeMessages = function () {
	const {
		instances,
		config: { max },
	} = ZMessage
	ZMessage.instances = instances.filter((instance, index) => {
		if (index < instances.length - max + 1) {
			instance && instance.close()
			return false
		}
		return true
	})
}

// 获取消息实例和添加事件监听
ZMessage.prototype.setMessage = function (options) {
	const instance = Message(options)
	// 监听消息消失事件，从实例列表移除当前消息实例
	instance.$watch('visible', () => {
		ZMessage.instances = ZMessage.instances.filter((item) => item !== instance)
		if (ZMessage.config.isQueue && ZMessage.queue.length) {
			ZMessage.queue.shift()()
		}
	})
	ZMessage.instances.push(instance)
}

// 生成队列元素，延迟执行
ZMessage.prototype.saveToQueue = function (options) {
	return () => {
		this.setMessage(options)
	}
}

export default ZMessage
