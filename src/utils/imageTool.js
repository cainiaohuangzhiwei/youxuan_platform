/*
 * @Description: 图片工具类
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-06 21:23:14
 * @LastEditTime: 2020-12-28 16:59:15
 * @LastEditors: huwenpiao
 */

const jsCookie = require('js-cookie')
// 图片加速服务器
let imgServer = 'https://imagecos.yunhuotong.net/yhtplusFile/' //cos加速服务器
// let imgTyyServer = 'https://image-tianyi.yunhuotong.net/yhtplusFile/' //天翼云加速服务器
if (
	jsCookie.get('environment') !== 'prod' &&
	jsCookie.get('environment') !== 'gray'
) {
	imgServer = 'https://image-test.weeget.cn/yhtplusFile/' //图片加速服务器
	// imgTyyServer = 'https://image-test.weeget.cn/yhtplusFile/' //图片加速服务器
}

export const imgCosServerPath = imgServer
/**
 * @Description: 获取原比例大图 不拼后缀
 * @param {type}
 * @return:
 */
export function getBigImg(imageUrl) {
	// 是否使用天翼云cdn
	// isTyy = isTyy || false
	let cdnUrl = imgServer
	// if (isTyy) {
	// 	cdnUrl = imgTyyServer
	// }
	if (!imageUrl) {
		imageUrl = require('../assets/goods_default.jpg')
	} else if (imageUrl.indexOf('http') == -1) {
		if (/.(png|jpg|jpeg|gif)$/g.test(imageUrl)) {
			imageUrl = cdnUrl + imageUrl
			return imageUrl
		}
		if (imageUrl.lastIndexOf('.jpg') === -1) {
			imageUrl = imageUrl + '.jpg'
		}
		if (imageUrl.lastIndexOf('s') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('s')) + '.jpg'
		} else if (imageUrl.lastIndexOf('c') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('c')) + '.jpg'
		} else if (imageUrl.lastIndexOf('m') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('m')) + '.jpg'
		} else if (imageUrl.lastIndexOf('d') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('d')) + '.jpg'
		}
		if (imageUrl.indexOf(cdnUrl) == -1) {
			imageUrl = cdnUrl + imageUrl
		}
	}
	return imageUrl
}

/**
 * @Description: 获取原比例中图
 */
export function getMiddleImg(imageUrl) {
	if (!imageUrl) {
		imageUrl = require('../assets/goods_default.jpg')
	} else if (imageUrl.indexOf('http') == -1) {
		if (/.(png|jpg|jpeg|gif)$/g.test(imageUrl)) {
			imageUrl = imgServer + imageUrl
			return imageUrl
		}
		if (imageUrl.lastIndexOf('.jpg') === -1) {
			imageUrl = imageUrl + 'd.jpg'
		}
		if (imageUrl.lastIndexOf('s') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('s')) + 'd.jpg'
		} else if (imageUrl.lastIndexOf('m') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('m')) + 'd.jpg'
		}
		if (imageUrl.indexOf(imgServer) == -1) {
			imageUrl = imgServer + imageUrl
		}
	}
	return imageUrl
}

/**
 * @Description: 获取原比例小图
 */
export function getSmallImg(imageUrl) {
	if (!imageUrl) {
		imageUrl = require('../assets/goods_default.jpg')
	} else if (imageUrl.indexOf('http') == -1) {
		if (/.(png|jpg|jpeg|gif)$/g.test(imageUrl)) {
			imageUrl = imgServer + imageUrl
			return imageUrl
		}
		if (imageUrl.lastIndexOf('.jpg') === -1) {
			imageUrl = imageUrl + 'c.jpg'
		}
		if (imageUrl.lastIndexOf('s') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('s')) + 'c.jpg'
		} else if (imageUrl.lastIndexOf('m') === imageUrl.length - 5) {
			imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('m')) + 'c.jpg'
		}
		if (imageUrl.indexOf(imgServer) == -1) {
			imageUrl = imgServer + imageUrl
		}
	}
	return imageUrl
}
