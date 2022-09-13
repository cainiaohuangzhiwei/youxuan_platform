/*
 * @Description: 加密解密
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-14 16:43:58
 * @LastEditTime: 2020-08-18 18:01:43
 * @LastEditors: Navi
 */
import crypto from 'crypto-js'
/**
 * @Description: AES加密
 */
export class AES {
	// 类的静态属性
	key = 'weeget_youxuan_navi_wong' // 24位密钥
	iv = 'a1231231234bcdef' // 十六位十六进制秘钥偏移量
	constructor() {
		// console.log('Encode_AES init')
	}
	/**
	 * @Description: AES加密方法
	 * @param {string} payload 加密内容
	 * @param {string} key 24位秘钥
	 * @param {string} iv 16位16进制秘钥偏移量
	 * @return {string}
	 */
	encode(payload, key = this.key, iv = this.iv) {
		if (Object.prototype.toString.call(payload) === '[object String]') {
			let data = crypto.enc.Utf8.parse(payload)
			const _key = crypto.enc.Utf8.parse(key)
			const _iv = crypto.enc.Utf8.parse(iv)
			let encrypted = crypto.AES.encrypt(data, _key, {
				iv: _iv,
				mode: crypto.mode.CBC,
			})
			return encrypted.ciphertext.toString().toUpperCase()
		}
	}
	/**
	 * @Description: AES解密方法
	 * @param {string} payload 解密内容
	 * @param {string} key 24位秘钥
	 * @param {string} iv 16位16进制秘钥偏移量
	 * @return {string}
	 */
	decode(payload, key = this.key, iv = this.iv) {
		if (Object.prototype.toString.call(payload) === '[object String]') {
			const _key = crypto.enc.Utf8.parse(key)
			const _iv = crypto.enc.Utf8.parse(iv)
			let dataHexStr = crypto.enc.Hex.parse(payload)
			let dataBase64 = crypto.enc.Base64.stringify(dataHexStr)
			// 接收的数据是 base64
			let decrypt = crypto.AES.decrypt(dataBase64, _key, {
				iv: _iv,
				mode: crypto.mode.CBC,
			})
			let decryptedStr = decrypt.toString(crypto.enc.Utf8)
			return decryptedStr.toString()
		}
	}
}
