/*
 * @Description:add
 * @Author: liqianwei
 * @Email: liqianwei@weeget.cn
 * @Date: 2020-12-04 16:23:13
 * @LastEditTime: 2020-12-04 18:24:16
 * @LastEditors: liqianwei
 */
import request from '@/utils/interceptor/request'
//新增银行账户
export const addBankAccount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/weiXinUser/addBankAccount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//编辑银行账户
export const updateBankAccount = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/weiXinUser/updateBankAccount.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//获取小程序登录小程序码
export const getCodeImage = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/weiXinUser/getCodeImage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})

//获取活动预览二维码
export const getActiveActivityCode = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/yhtPlusCmsActMorePromotion/getActiveActivityCode.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
