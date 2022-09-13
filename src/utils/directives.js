/*
 * @Description: 自定义指令
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-23 11:30:06
 * @LastEditTime: 2020-12-10 20:23:40
 * @LastEditors: huwenpiao
 */
import Vue from 'vue'
import { checkFunctionCode } from './auth.js'
/**
 * @Description: 自动focus
 */
Vue.directive('focus', {
	inserted: function (el) {
		el.focus()
	},
})

/**
 * @Description: 金额输入框
 * <el-input type="number" v-amount="amount" v-model="amount"></el-input>
 */
Vue.directive('amount', {
	bind: function (el, binding, vnode) {
		const element = el.getElementsByTagName('input')[0]
		element.addEventListener('blur', function () {
			if (!element.value || isNaN(element.value)) {
				vnode.data.model.callback('')
			} else {
				vnode.data.model.callback(
					Math.abs(Number((parseInt(element.value * 1000) / 1000).toFixed(2)))
				)
			}
		})
	},
})
/**
 * @Description: 凡是使用该指令的dom，若无权限则dom隐藏
 * <div v-auth="['/schoolStaff']">Array</div>
 * <div v-auth="'/schoolStaff'">String</div>
 * 注意： 传空数组也会返回删除节点
 */
Vue.directive('auth', {
	inserted: function (el, binding) {
		// 无有效值则退出
		if (!binding.value) return
		// binding.value === Array
		if (Object.prototype.toString.call(binding.value) === '[object Array]') {
			let authList = binding.value
			let flag = authList.some((item) => {
				return checkFunctionCode(item)
			})
			if (!flag) {
				el.parentNode.removeChild(el)
			}
		}
		// binding.value === String
		if (Object.prototype.toString.call(binding.value) === '[object String]') {
			if (!checkFunctionCode(binding.value)) {
				el.parentNode.removeChild(el)
			}
		}

		// const s = JSON.stringify
		// el.innerHTML =
		// 	'name: ' +
		// 	s(binding.name) +
		// 	'<br>' +
		// 	'value: ' +
		// 	s(binding.value) +
		// 	'<br>' +
		// 	'expression: ' +
		// 	s(binding.expression) +
		// 	'<br>' +
		// 	'argument: ' +
		// 	s(binding.arg) +
		// 	'<br>' +
		// 	'modifiers: ' +
		// 	s(binding.modifiers) +
		// 	'<br>' +
		// 	'vnode keys: ' +
		// 	Object.keys(vnode).join(', ')
	},
})
