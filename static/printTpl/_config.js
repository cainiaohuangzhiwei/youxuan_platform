/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let host = '../../../' // 服务器
// let exportHost = host // 导出跨域-测试
// 项目名称
let projectOne = 'yhtplus/'
// let secondLevelOne = 'web/'

// 缓存信息
let sessionUserKey = 'yhtplusUserInfo'
let userId = 'yhtplusUserId'
let token = 'yhtplusSessionKey'

let success = 0

// 默认排序值
let defaultSortField = 0

// 打印平台类型
let PRINT_PLATFORM_TYPE = {
	WEB: 2,
	APP: 3,
}
// 打印大小
let PRINT_SIZE_TYPE = {
	// 1：80mm，2：110mm，3：A4，4：80列三联单(整张)，5：80列三联单(二等分)
	NORMAL_80: 1,
	NORMAL_110: 2,
	A4: 3,
	WHOLE_PAGE_210: 4,
	HALVE_210: 5,
	A5: 8,
}
// 打印样式
let TEMPLATE_TYPE = {
	// 1：80mm，2：110mm，3：双规格，4：单规格有图，5：单规格无图 6:定制模板
	BILL_80mm: 1,
	BILL_110mm: 2,
	DOUBLE_SKU: 3,
	SINGLE_SKU_IMG: 4,
	SINGLE_SKU_NO_IMG: 5,
	CUSTOM_MADE: 6,
}

let PrintConfig = {
	DEVICE_WEB: 'web',
	DEVICE_ANDROID: 'Android',
	DEVICE_IOS: 'Ios',
}

// 1：80mm，2：110mm，3：双规格，4：单规格有图，5：单规格无图
let url = {
	// 获取用户详情信息
	getUserDetail: host + projectOne + 'webUser/getUserDetail.action',
	// 获取打印机列表
	getPrinterList:
		host + projectOne + 'systemConfiguration/getPrinterList.action',
}

// 获取屏幕密度
function js_getDPI() {
	let arrDPI = new Array()
	if (window.screen.deviceXDPI) {
		arrDPI[0] = window.screen.deviceXDPI
		arrDPI[1] = window.screen.deviceYDPI
	} else {
		let tmpNode = document.createElement('DIV')
		tmpNode.style.cssText =
			'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
		document.body.appendChild(tmpNode)
		arrDPI[0] = parseInt(tmpNode.offsetWidth)
		arrDPI[1] = parseInt(tmpNode.offsetHeight)
		tmpNode.parentNode.removeChild(tmpNode)
	}
	return arrDPI
}

/*
 * 获得查询字符串参数
 */
function getQueryStringArgs(_url) {
	// 取得查询字符串并去掉开头的问号
	let qs = location.search.length > 0 ? location.search.substring(1) : ''
	if (!isNull(_url)) {
		qs = _url.substring(_url.indexOf('?') + '?'.length)
	}
	let args = {}
	// 取得每一项
	let items = qs.length ? qs.split('&') : []
	let item = null,
		name = null,
		value = null
	// 逐个将每一项新增到args对象中
	for (let i = 0; i < items.length; i++) {
		item = items[i].split('=')
		name = decodeURIComponent(item[0])
		value = decodeURIComponent(item[1])
		if (name.length) {
			args[name] = value
		}
	}
	return args
}

/*
 * 用途：检查输入字符串是否为空或者全部都是空格 输入：str 返回： 如果全是空返回true,否则返回false
 */
function isNull(str) {
	if (str === 0) {
		return false
	}
	if (
		str == '' ||
		str == null ||
		str == 'null' ||
		str == 'undefined' ||
		str == '&nbsp;'
	) {
		return true
	}
	let regu = '^[ ]+$'
	let re = new RegExp(regu)
	return re.test(str)
}

// 文字处理为p元素（每个换行新增一个p元素）,空格替换为&nbsp;
function replaceSpace(textareaStr) {
	let textareaStrPHtml = ''
	if (!isNull(textareaStr)) {
		let textareaStrArr = textareaStr.split('\n')
		for (let z = 0; z < textareaStrArr.length; z++) {
			textareaStrPHtml +=
				'<p>' + textareaStrArr[z].replace(/\s/g, '&nbsp;') + '</p>'
		}
	}
	return textareaStrPHtml
}

// 设置请求参数中的userId与sessionKey
function setPostSessionKey(data) {
	data = data || {}
	data.data = data.data || '{}'
	data.userId = localStorage[userId]
	data.sessionKey = localStorage[token]
	data.token = localStorage[token]
	let tempData = JSON.parse(data.data)
	tempData.timeStamp = new Date().getTime() // 每个页面请求接口的唯一标识;
	if (tempData.addTimeEnd) {
		tempData.addTimeEnd = tempData.addTimeEnd + 999
	}
	if (tempData.endTime) {
		tempData.endTime = tempData.endTime + 999
	}
	if (tempData.orderEndTime) {
		tempData.orderEndTime = tempData.orderEndTime + 999
	}
	// 云货优选groupId(默认为集团2);
	let getUserInfo = JSON.parse(localStorage[sessionUserKey])
	if (!isNull(getUserInfo) && !tempData.groupId) {
		tempData.groupId = getUserInfo.groupId || 2
	}
	console.log('--data', tempData)
	data.data = JSON.stringify(tempData)
}

// 设置特定的数据
function setDataAdapter(_url, res) {
	// 员工的仓库权限相关
	if (_url == url.getWarehouseList) {
		if (res.resultData.warehouseList.length == 0) {
			let warehouseItem = {
				warehouseName: '--- 暂无可见仓库，请联系管理员设置 ---',
			}
			res.resultData.warehouseList.push(warehouseItem)
		}
	}
}

// 轻提示框
;(function (global) {
	let root =
		(typeof self === 'object' && self.self === self && self) ||
		(typeof global === 'object' && global.global === global && global) ||
		this
	root.D = {} // 在根对象下创建D
	D.dialog = {}
	D.fn = {}
	D.fn.dialog = {}
	let content, title, settings, $dialogPopup, showHeight

	D._renderDOM = function () {
		// 最多存在一个模态框
		if ($dialogPopup != null && $dialogPopup.length > 0) {
			return
		} else if ($('.dialog-popup, .modal, .little-popup, .popup').length > 0) {
			let zIndex =
				parseInt(
					$(
						'.dialog-popup:visible, .modal:visible, .little-popup:visible, .popup:visible'
					)
						.last()
						.css('z-index')
				) + 10
			$('body').append(
				($dialogPopup = $(
					'<div class="dialog-popup" style="margin-left: -200px; left: 50%; width: auto; position: absolute; z-index: ' +
						zIndex +
						'"></div>'
				))
			)
		} else {
			$('body').append(
				($dialogPopup = $(
					'<div class="dialog-popup" style="margin-left: -200px; left: 50%; width: auto; position: absolute;" ></div>'
				))
			)
		}
		$dialogPopup.append(
			(content = $(
				'<div style="  background-color: #000;opacity:0.6;filter: alpha(opacity=60); -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;"></div>'
			))
		)
		// 内容的id
		let confirmContentId = parseFloat(Math.random() * 100000).toFixed(0)
		content.append(
			(title = $(
				'<div style="border-bottom-width: 0px;" class="popup-title"><i style=" float:right; padding: 19.5px 21px; background-color: #000 !important;opacity:0.1;filter: alpha(opacity=10); border-radius: 5px;" class="fa popup-close-button"></i></div>'
			))
		)
		content.append(
			(content = $(
				'<div id="' +
					confirmContentId +
					'" style="border-bottom-width: 0px; color: #FFFFFF; padding: 10px 45px 10px 30px; text-align: center;">' +
					settings.contentText +
					'</div>'
			))
		)
		// 模态框的jquery对象
		$dialogPopup = $('body #' + confirmContentId).parents('.dialog-popup')
		// x按钮变色
		$dialogPopup.find('.popup-close-button').hover(
			function () {
				$(this).attr(
					'style',
					' float: right; padding: 19.5px 21px;  background-color: #000 !important;opacity:0.3;filter: alpha(opacity=30); border-radius: 5px;'
				)
			},
			function () {
				$(this).attr(
					'style',
					' float: right; padding: 19.5px 21px;  background-color: #000 !important;opacity:0.1;filter: alpha(opacity=10); border-radius: 5px;'
				)
			}
		)
		setTimeout(function () {
			// 显示模态框
			D.dialog.show()
			// 是否自动关闭
			if (settings.time > 0) {
				window.setTimeout(function () {
					D.dialog.close()
				}, settings.time)
			}
		}, 1)
	}
	D._bindEvent = function () {
		// 点击关闭
		$dialogPopup.one('click', '.popup-close-button', function (e) {
			D.dialog.close()
			return false
		})
	}
	D.dialog.show = function () {
		// body高度
		let bodyHeight = $('html').height()
		// 显示模态框
		$dialogPopup.show()
		// 显示的高度位置
		showHeight = '20%'
		// 移动后的位置
		let showMoveHeight = '25%'
		// 调整位置
		$dialogPopup.css({
			top: showHeight,
		})
		// 移动位置
		// 模态框的效果
		$dialogPopup.animate(
			{
				top: showMoveHeight,
				opacity: 1,
			},
			150
		)
	}
	D.toast = function (contentText, closeFn, titleText, time) {
		if (closeFn != null) {
			D.fn.dialog.defaults.closeFn = closeFn // 关闭后回调
		} else {
			D.fn.dialog.defaults.closeFn = function () {} // 关闭后回调
		}
		let options = {
			contentText: contentText,
			titleText: titleText,
			time: time,
		}
		settings = $.extend({}, D.fn.dialog.defaults, options)
		D._renderDOM()
		D._bindEvent()
		return this
	}
	D.fn.dialog.defaults = {
		titleText: '提示',
		contentText: '空',
		time: 1000,
		closeFn: function () {},
	}
	D.dialog.close = function () {
		if ($dialogPopup != null) {
			// 关闭模态框的效果
			$dialogPopup.animate(
				{
					top: showHeight,
					opacity: 0.1,
				},
				150,
				function () {
					$dialogPopup.hide()

					$dialogPopup.remove()
					$dialogPopup = null
					settings.closeFn()
				}
			)
		}
	}
})(window)
// 轻提示框

/* 发送ajax_post默认请求 */
function sendQuiescePost(_url, data, fn, errorFn, beforeSendFn) {
	// 用户ID与sessionKey
	setPostSessionKey(data)
	let tempData = JSON.parse(data.data == null ? '{}' : data.data)
	if (tempData.sortField == null) {
		tempData.sortField = defaultSortField
	}
	tempData.userId = data.userId
	// data.data = JSON.stringify(tempData);
	$.ajax({
		url: _url,
		type: 'POST',
		data: JSON.stringify(tempData),
		contentType: 'application/json',
		headers: {
			'X-AUTH-TOKEN': data.token,
		},
		timeout: 3600000, // 超时时间：1小时
		beforeSend: function () {
			if (beforeSendFn) {
				beforeSendFn()
			}
		},
		success: function (res) {
			if (res.resultCode == '0100000') {
				fn(res)
			} else {
				if (errorFn) {
					errorFn(res)
				}
			}
		},
	})
}

/* 发送ajax_post请求 */
function sendPost(_url, data, fn, errorFn, beforeSendFn) {
	// 用户ID与sessionKey
	setPostSessionKey(data)

	let tempData = JSON.parse(data.data == null ? '{}' : data.data)
	if (tempData.sortField == null) {
		tempData.sortField = defaultSortField
	}
	data.data = JSON.stringify(tempData)
	$.ajax({
		url: _url,
		type: 'POST',
		async: true,
		data: data,
		headers: {
			'X-AUTH-TOKEN': data.token,
		},
		timeout: 3600000, // 超时时间：1小时
		//      contentType: "application/x-www-form-urlencoded; charset=utf-8",
		beforeSend: function () {
			if (beforeSendFn) {
				beforeSendFn()
			}
		},
		success: function (res) {
			res = JSON.parse(res)
			if (res.resultCode == success) {
				setDataAdapter(_url, res)
				fn(res)
			} else {
				if (errorFn) {
					errorFn(res)
				}
				switch (res.resultCode) {
					case -3:
						window.location.href = 'login.html'
						break
					case -4:
					case -10:
						D.toast(res.resultMsg, function () {
							window.location.href = 'login.html'
						})
						break
					case 232:
					case 269:
					case 270:
					case 547:
						fn(res)
						break
					default:
						D.toast(res.resultMsg)
						break
				}
			}
		},
		error: function (e) {
			//    window.console.log(e);
			D.toast('网络不给力，刷新试试')
		},
	})
}
