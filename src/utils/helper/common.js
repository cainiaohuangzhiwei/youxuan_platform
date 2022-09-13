const _ = require('lodash')
import moment from 'moment'
import eggConfig from '../../../config/config.default'
const youxuan_config = eggConfig({ name: 'youxuan_web' })

export function getCsrf() {
	let regex = /.*csrfToken=([^;.]*).*$/
	return document.cookie.match(regex) === null
		? ''
		: document.cookie.match(regex)[1]
}
/**
 *  获取时间信息
 *  @return
 *  getCurrentStartDate(当天开始时间)
 *  getCurrentEndDate(当天结束时间)
 *  getYesterdayStartDate(昨天开始时间)
 *  getYesterdayEndDate(昨天结束时间)
 *  getSevenStartDate(七天前开始时间)
 *  getFourteendayStartDate(十四天前开始时间)
 *  getWeekStartDate(本周开始时间)
 *  getWeekEndDate(本周结束时间)
 *  getUpWeekStartDate(上周开始时间)
 *  getUpWeekEndDate(上周结束时间)
 *  getTwoWeekStartDate(两周前开始时间)
 *  getFourWeekStartDate(四周前开始时间)
 *  getMonthStartDate(本月开始时间)
 *  getMonthEndDate(本月结束时间)
 *  getUpMonthStartDate(上月开始时间)
 *  getUpMonthEndDate(上月结束时间)
 *  getTwoMonthStartDate(上两个月开始时间)
 */
export function wgGetDate() {
	let now = new Date() // 当前日期
	let nowDayOfWeek = now.getDay() // 今天本周的第几天
	let nowDay = now.getDate() // 当前日
	let nowMonth = now.getMonth() // 当前月
	let nowYear = now.getYear() // 当前年
	nowYear += nowYear < 2000 ? 1900 : 0
	// 周日期从周一到周日
	if (nowDayOfWeek === 0) {
		nowDayOfWeek = 7
	}

	return {
		getCurrentStartDate: new Date(nowYear, nowMonth, nowDay),
		getCurrentEndDate: new Date(nowYear, nowMonth, nowDay, 23, 59, 59, 999),
		getYesterdayStartDate: new Date(nowYear, nowMonth, nowDay - 1),
		getYesterdayEndDate: new Date(
			nowYear,
			nowMonth,
			nowDay - 1,
			23,
			59,
			59,
			999
		),
		getSixStartDate: new Date(nowYear, nowMonth, nowDay - 6),
		getThirtyStartDate: new Date(nowYear, nowMonth, nowDay - 29),
		getNinetyStartDate: new Date(nowYear, nowMonth, nowDay - 89),
		getSevenStartDate: new Date(nowYear, nowMonth, nowDay - 7),
		getFourteendayStartDate: new Date(nowYear, nowMonth, nowDay - 14),
		getWeekStartDate: new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1),
		getWeekEndDate: new Date(
			nowYear,
			nowMonth,
			nowDay - nowDayOfWeek + 7,
			23,
			59,
			59,
			999
		),
		getUpWeekStartDate: new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6),
		getUpWeekEndDate: new Date(
			nowYear,
			nowMonth,
			nowDay - nowDayOfWeek,
			23,
			59,
			59,
			999
		),
		getTwoWeekStartDate: new Date(
			nowYear,
			nowMonth,
			nowDay - nowDayOfWeek - 2 * 7 + 1
		),
		getFourWeekStartDate: new Date(
			nowYear,
			nowMonth,
			nowDay - nowDayOfWeek - 3 * 7 + 1
		),
		getMonthStartDate: new Date(nowYear, nowMonth, 1),
		getMonthEndDate: new Date(
			nowYear,
			nowMonth,
			getMonthDays(nowMonth),
			23,
			59,
			59,
			999
		),
		getUpMonthStartDate: new Date(nowYear, nowMonth - 1, 1),
		getUpMonthEndDate: new Date(
			nowYear,
			nowMonth - 1,
			getMonthDays(nowMonth),
			23,
			59,
			59,
			999
		),
		getTwoMonthStartDate: new Date(nowYear, nowMonth - 2, 1),
	}
}
/**
 * @Description: 今年某月有几天
 * @param {type}
 * @return:
 */
export function getMonthDays(month) {
	let currentYear = moment().get('year')
	let days = Number(moment([currentYear, '0', '31']).month(month).format('DD'))
	return days
}

/**
 * @Description: 下载文件
 * @param {String} fileName 文件名
 * @param {ArrayBuffer} blob 下载的数据
 */
export function downloadFile(blob, fileName) {
	if (!blob) return
	// 动态创建一个标签
	let a = document.createElement('a')
	if (typeof blob == 'string') {
		a.href = youxuan_config.static.prefix + blob
	} else {
		blob = new Blob([blob])
		a.href = window.URL.createObjectURL(blob)
		// 设置文件名称
		a.download = fileName
	}
	a.click()
}
/**
 * @Description: 校验字符串是否符合金额的格式，最多可以到小数点后5位
 * @param {String} str 要检验的字符串
 * @return: boolean
 */
export function isMoney(str) {
	let regu = '^[0-9]+[//.]{0,1}[0-9]{0,5}$'
	let re = new RegExp(regu)
	if (re.test(str)) {
		return true
	} else {
		return false
	}
}
/**
 * @Description: 获取保留小数点的Str，不能少于0
 * @param {String} str 要检验的字符串
 * @param {String} str 小数点位数
 * @return: string
 */
export function retainDecimalPoint(str, num) {
	if (parseFloat(str) < 0 || isNaN(str)) {
		return '0.00'
	}
	if (parseFloat(num) < 0 || isNaN(num)) {
		num = 2
	}
	return parseFloat(str).toFixed(num)
}
/**
 * @Description: 是否是整数
 * @param {type}
 * @return:
 */
export function isInteger(str) {
	let regu = /^[-]{0,1}[0-9]{1,}$/
	return regu.test(str)
}
/**
 *  用途：检查输入字符串是否为空或者全部都是空格 输入：str 返回：
 *
 *  @isNull 检验字符串
 *  @return 如果全是空返回true,否则返回false
 */
export function isNull(str) {
	if (str === 0) {
		return false
	}
	if (
		str === '' ||
		str === null ||
		str === 'null' ||
		str === 'undefined' ||
		str === undefined
	) {
		return true
	}
	let regu = /^[ ]+$/
	return regu.test(str)
}
export function getCookie(name) {
	let arr,
		reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
	if ((arr = document.cookie.match(reg))) return arr[2]
	else return null
}
export function delCookie(name) {
	let exp = new Date()
	exp.setTime(exp.getTime() - 1)
	let arr,
		reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
	if ((arr = document.cookie.match(reg)))
		if (arr[2] != null)
			document.cookie =
				name + '=' + arr[2] + ';expires=' + exp.toGMTString() + ';path=/'
		else return null
}
/**
 *  通过键值获取常量内容
 *
 *  @list 查询数组
 *  @key 查询键值
 *  @defaultValue 默认返回值
 *  @keyName 查询键值名称
 *  @valueName 查询内容名称
 *
 *  @return 返回查询内容
 */
export function getConstantValueByKey(
	list,
	key,
	defaultValue,
	keyName,
	valueName
) {
	// list 进行深拷贝
	list = JSON.parse(JSON.stringify(list))
	key += ''
	if (isNull(defaultValue)) defaultValue = ''
	if (isNull(key)) return defaultValue
	if (list == '' || list == null || list == 'undefined' || list.length == 0)
		return defaultValue
	if (isNull(keyName)) keyName = 'key'
	if (isNull(valueName)) valueName = 'value'
	let result = list.filter((item) => {
		return item[keyName] + '' !== '' && item[keyName] + '' === key
	})
	if (result.length > 0) {
		return result[0][valueName]
	} else {
		return defaultValue
	}
}
/**
 *  设置已访问视图标题
 *
 *  @store store方法
 *  @routes 路由
 *  @id ID
 *
 *  @return 返回视图标题
 */
export function setViewTitle(store, routes, id, title) {
	const tempRoute = _.pickBy(routes, (value, key) => {
		return !key.startsWith('matched')
	})

	const route = Object.assign({}, tempRoute, {
		title: title ? title : `${tempRoute.meta.title}-${id}`,
	})

	return store.dispatch('tagsView/updateVisitedView', route)
}
/**
 *  金额处理方法
 *
 * @number 要格式化的数字
 * @decimals 保留几位小数
 * @dec_point 小数点符号
 * @thousands_sep 千分位符号
 * @roundtag 舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
 *
 *  @return 返回视图标题
 */
export function numberFormat(
	number,
	decimals,
	dec_point,
	thousands_sep,
	roundtag
) {
	/*
	 * 参数说明：
	 * number：要格式化的数字
	 * decimals：保留几位小数
	 * dec_point：小数点符号
	 * thousands_sep：千分位符号
	 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
	 * */
	number = (number + '').replace(/[^0-9+-Ee.]/g, '')
	roundtag = roundtag || 'floor' //"ceil","floor","round"
	let n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
		dec = typeof dec_point === 'undefined' ? '.' : dec_point,
		s = '',
		toFixedFix = function (ns, precs) {
			let k = Math.pow(10, prec)

			return (
				'' +
				parseFloat(
					Math[roundtag](parseFloat((ns * k).toFixed(precs * 2))).toFixed(
						precs * 2
					)
				) /
					k
			)
		}
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
	let re = /(-?\d+)(\d{3})/
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, '$1' + sep + '$2')
	}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || ''
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}
	return s.join(dec)
}
/**
 * @description: 安全替换
 * @param {} res 替换的数据
 * @return {} res
 */
export function securityReplace(res, type) {
	if (res instanceof Array) {
		// 先判断是否为数组，如果是数组就检索再执行一遍
		res.forEach(function (item) {
			securityReplace(item, type)
		})
	} else if (typeof res == 'object') {
		// 如果不是数组就判断是否为json
		for (let key in res) {
			if (res[key] instanceof Array) {
				//json内如果再有数组，就再检索一遍
				res[key].forEach(function (item) {
					securityReplace(item, type)
				})
			} else {
				//这一步将过滤的值返回给key
				res[key] = securityReplace(res[key], type)
			}
		}
	} else {
		if (res && isNaN(res)) {
			//对接收的数据进行解码
			if (type == 'request') {
				res = res
					.replace(/&/gi, '&amp;')
					.replace(/</gi, '&lt;')
					.replace(/>/gi, '&gt;')
					.replace(/"/gi, '&quot;')
					.replace(/'/gi, '&apos;')
					.replace(/\//gi, '&#x2F;')
			} else if (type == 'respone') {
				res = res
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&quot;/g, '"')
					.replace(/&apos;/g, "'")
					.replace(/&amp;/g, '&')
					.replace(/&#x2F;/g, '/')
			}
		}
		return res
	}
	return res
}

/*
 * @desc   现金额转大写
 * @param  {Number} dValue
 * @return {String}
 */
export function digitUppercase(dValue) {
	let maxDec = 2
	// 验证输入金额数值或数值字符串：
	dValue = dValue.toString().replace(/,/g, '')
	dValue = dValue.replace(/^0+/, '') // 金额数值转字符、移除逗号、移除前导零
	if (dValue == '') {
		return '零元整'
	} // （错误：金额为空！）
	else if (isNaN(dValue)) {
		return '错误：金额不是合法的数值！'
	}
	let minus = '' // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
	let CN_SYMBOL = '' // 币种名称（如“人民币”，默认空）
	if (dValue.length > 1) {
		if (dValue.indexOf('-') == 0) {
			dValue = dValue.replace('-', '')
			minus = '负'
		} // 处理负数符号“-”
		if (dValue.indexOf('+') == 0) {
			dValue = dValue.replace('+', '')
		} // 处理前导正数符号“+”（无实际意义）
	}
	let vInt = ''
	let vDec = '' // 字符串：金额的整数部分、小数部分
	let resAIW // 字符串：要输出的结果
	let parts // 数组（整数部分.小数部分），length=1时则仅为整数。
	let digits, radices, bigRadices, decimals // 数组：数字（0~9——零~玖）；基（十进制记数系统中每个数字位的基是10——拾,佰,仟）；大基（万,亿,兆,京,垓,杼,穰,沟,涧,正）；辅币（元以下，角/分/厘/毫/丝）。
	let zeroCount // 零计数
	let i, p, d // 循环因子；前一位数字；当前位数字。
	let quotient, modulus // 整数部分计算用：商数、模数。
	// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
	let NoneDecLen =
		typeof maxDec == 'undefined' ||
		maxDec == null ||
		Number(maxDec) < 0 ||
		Number(maxDec) > 5 // 是否未指定有效小数位（true/false）
	parts = dValue.split('.') // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
	if (parts.length > 1) {
		vInt = parts[0]
		vDec = parts[1] // 变量赋值：金额的整数部分、小数部分
		if (NoneDecLen) {
			maxDec = vDec.length > 5 ? 5 : vDec.length
		} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
		let rDec = Number('0.' + vDec)
		rDec *= Math.pow(10, maxDec)
		rDec = Math.round(Math.abs(rDec))
		rDec /= Math.pow(10, maxDec) // 小数四舍五入
		let aIntDec = rDec.toString().split('.')
		if (Number(aIntDec[0]) == 1) {
			vInt = (Number(vInt) + 1).toString()
		} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
		if (aIntDec.length > 1) {
			vDec = aIntDec[1]
		} else {
			vDec = ''
		}
	} else {
		vInt = dValue
		vDec = ''
		if (NoneDecLen) {
			maxDec = 0
		}
	}
	if (vInt.length > 44) {
		return (
			'错误：金额值太大了！整数位长【' +
			vInt.length.toString() +
			'】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！'
		)
	}
	// 准备各字符数组 Prepare the characters corresponding to the digits:
	digits = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖') // 零~玖
	radices = new Array('', '拾', '佰', '仟') // 拾,佰,仟
	bigRadices = new Array(
		'',
		'万',
		'亿',
		'兆',
		'京',
		'垓',
		'杼',
		'穰',
		'沟',
		'涧',
		'正'
	) // 万,亿,兆,京,垓,杼,穰,沟,涧,正
	decimals = new Array('角', '分', '厘', '毫', '丝') // 角/分/厘/毫/丝
	resAIW = '' // 开始处理
	// 处理整数部分（如果有）
	if (Number(vInt) > 0) {
		zeroCount = 0
		for (i = 0; i < vInt.length; i++) {
			p = vInt.length - i - 1
			d = vInt.substr(i, 1)
			quotient = p / 4
			modulus = p % 4
			if (d == '0') {
				zeroCount++
			} else {
				if (zeroCount > 0) {
					resAIW += digits[0]
				}
				zeroCount = 0
				resAIW += digits[Number(d)] + radices[modulus]
			}
			if (modulus == 0 && zeroCount < 4) {
				resAIW += bigRadices[quotient]
			}
		}
		resAIW += '元'
	}
	// 处理小数部分（如果有）
	for (i = 0; i < vDec.length; i++) {
		d = vDec.substr(i, 1)
		if (d != '0') {
			resAIW += digits[Number(d)] + decimals[i]
		} else {
			resAIW += '零'
		}
	}
	// 处理结果
	if (resAIW == '') {
		resAIW = '零元'
	} // 零元
	if (vDec == '') {
		resAIW += '整'
	} // 元整
	resAIW = CN_SYMBOL + minus + resAIW // 人民币/负元角分/整
	return resAIW
}
export function highPrecisionMul(data1, data2) {
	let m = 0,
		s1 = data1.toString(),
		s2 = data2.toString()
	if (s1 && s1.length) {
		m += s1.split('.')[1] ? s1.split('.')[1].length : 0
	}
	if (s2 && s2.length) {
		m += s2.split('.')[1] ? s2.split('.')[1].length : 0
	}
	// 替换掉小数点转为数字相乘再除以10的次幂值
	return (
		(Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
		Math.pow(10, m)
	)
}
export function accDiv(value1, value2) {
	if (value1 == 0) {
		return 0
	}

	let v1 = value1.toString()

	let v2 = value2.toString()

	let m1 = v1.split('.')[1] ? v1.split('.')[1].length : 0

	let m2 = v2.split('.')[1] ? v2.split('.')[1].length : 0

	let _v1 = Number(v1.replace('.', ''))

	let _v2 = Number(v2.replace('.', ''))

	return highPrecisionMul(_v1 / _v2, Math.pow(10, m2 - m1))
}
/*详细的收货人信息*/
export function getDetailConsigneeInfo(itemJson, orderDetail) {
	let consigneeInfo =
		'联系人：' +
		(itemJson.consignee || '无') +
		', 电话：' +
		(itemJson.phoneMob || '无') +
		'，所在区域：' +
		assembleAreaName(orderDetail) +
		' ' +
		(itemJson.address || '无')
	return consigneeInfo
}
/**
 * 组装后台返回的地区名称
 * row地区名称对象
 */
export function assembleAreaName(row) {
	let areaName = ''
	if (row != null) {
		if (!isNull(row.grandAreaName)) {
			areaName += row.grandAreaName
		}
		if (!isNull(row.parentAreaName)) {
			areaName += row.parentAreaName
		}
		if (!isNull(row.areaName)) {
			areaName += row.areaName
		}
		if (!isNull(row.addressCountiesFourthStageName)) {
			areaName += row.addressCountiesFourthStageName
		}
		if (row.areaName == '其他地区') {
			return '其他地区'
		}
		if (isNull(areaName)) {
			return '未设置'
		}
		if (
			areaName.lastIndexOf('-') != -1 &&
			areaName.lastIndexOf('-') == areaName.length - 1
		) {
			areaName = areaName.substring(0, areaName.length - 1)
		}
		return areaName
	}
	return '未设置'
}
// 商品名称截取
export function goodsNameCut(str) {
	let goodsName = ''
	if (!isNull(str)) {
		let goodsNameNew = str
		if (str.length > 39) {
			goodsName =
				goodsNameNew.substring(0, 20) +
				'<br />' +
				goodsNameNew.substring(20, 39) +
				'...'
		} else if (str.length > 20) {
			goodsName =
				goodsNameNew.substring(0, 20) +
				'<br />' +
				goodsNameNew.substring(20, 40)
		} else {
			goodsName = str
		}
	}
	return goodsName
}
/**
 *  限制表单选择时间段
 *
 * @startTime 开始时间
 * @endTime 结束时间
 * @limitTime 最长选择时间段(天)
 */
export function limitFormChooseTimes(startTime, endTime, limitTime) {
	return new Promise((resolve) => {
		if (!startTime || !endTime) {
			resolve({
				code: 201,
				msg: '请选择订单时间区间！',
			})
			return
		}
		if (limitTime * 24 * 60 * 60 * 1000 < endTime - startTime) {
			resolve({
				code: 201,
				msg: `时间区间不能大于${limitTime}天！`,
			})
			return
		}
		if (endTime < startTime) {
			resolve({
				code: 201,
				msg: '结束时间不能小于开始时间！',
			})
			return
		}
		resolve({
			code: 200,
			msg: '通过',
		})
	})
}
// 跳转并打开新tab封装
export function openNewTab(url) {
	let a = document.createElement('a')
	a.setAttribute('href', url)
	a.setAttribute('target', '_blank')
	a.setAttribute('id', 'camnpr')
	document.body.appendChild(a)
	a.click()
}

/**
 * @constructor
 * @Author: panweibin
 * @description: 防抖函数
 * @param {function} fun 方法
 * @param {delay} delay 时间
 */
export function debounce(fun, delay = 300) {
	return function (args) {
		let that = this
		let _args = args
		clearTimeout(fun.time)
		fun.time = setTimeout(function () {
			fun.call(that, _args)
		}, delay)
	}
}
/**
 * @constructor
 * @Author: panweibin
 * @description: 节流函数
 * @param {function} fun 方法
 * @param {delay} delay 时间
 */
export function throttle(fun, delay = 300) {
	let last, deferTimer
	return function (...parms) {
		let that = this
		let _args = parms
		let now = +new Date()
		if (last && now < last + delay) {
			clearTimeout(deferTimer)
			deferTimer = setTimeout(function () {
				last = now
				fun.apply(that, _args)
			}, delay)
		} else {
			last = now
			fun.apply(that, _args)
		}
	}
}
export function scrollEven(scrollFunc) {
	// 火狐浏览器

	// if (document.addEventListener) {
	let isRemove = false

	document.addEventListener('DOMMouseScroll', scroll, false)

	// }// W3C

	document.addEventListener('mousewheel', scroll, false) // IE/Opera/Chrome/Safari

	function scroll(e) {
		// direct 是 1 向上，是 -1 向下

		let direct = 0

		e = e || window.event

		if (e.wheelDelta) {
			//IE/Opera/Chrome

			direct = e.wheelDelta > 0 ? 1 : -1
		} else if (e.detail) {
			//Firefox

			direct = e.detail < 0 ? 1 : -1
		}

		if (isRemove) {
			document.removeEventListener('DOMMouseScroll', scroll, false)

			document.removeEventListener('mousewheel', scroll, false) // IE/Opera/Chrome/Safari
		}

		scrollFunc(direct, removeScroll, e)
	}

	function removeScroll() {
		isRemove = true
	}
}
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1减上arg2的精确结果
 **/
export function accSub(arg1, arg2) {
	let r1, r2, m, n
	try {
		r1 = arg1.toString().split('.')[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split('.')[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2)) //last modify by deeka //动态控制精度长度
	n = r1 >= r2 ? r1 : r2
	return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
	let r1, r2, m, c
	try {
		r1 = arg1.toString().split('.')[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split('.')[1].length
	} catch (e) {
		r2 = 0
	}
	c = Math.abs(r1 - r2)
	m = Math.pow(10, Math.max(r1, r2))
	if (c > 0) {
		let cm = Math.pow(10, c)
		if (r1 > r2) {
			arg1 = Number(arg1.toString().replace('.', ''))
			arg2 = Number(arg2.toString().replace('.', '')) * cm
		} else {
			arg1 = Number(arg1.toString().replace('.', '')) * cm
			arg2 = Number(arg2.toString().replace('.', ''))
		}
	} else {
		arg1 = Number(arg1.toString().replace('.', ''))
		arg2 = Number(arg2.toString().replace('.', ''))
	}
	return (arg1 + arg2) / m
}

// 复制文字
export const copyText = (text, cb) => {
	if (text.indexOf('-') !== -1) {
		const arr = text.split('-')
		text = arr[0] + arr[1]
	}
	const textArea = document.createElement('textarea')
	textArea.style.position = 'fixed'
	textArea.style.top = '0'
	textArea.style.left = '0'
	textArea.style.width = '2em'
	textArea.style.height = '2em'
	textArea.style.padding = '0'
	textArea.style.border = 'none'
	textArea.style.outline = 'none'
	textArea.style.boxShadow = 'none'
	textArea.style.background = 'transparent'
	textArea.value = text
	textArea.readOnly = true
	document.body.appendChild(textArea)
	textArea.select()

	try {
		const successful = document.execCommand('copy')
		successful ? cb(true) : cb(false)
	} catch (e) {
		cb(false)
	}

	document.body.removeChild(textArea)
}
