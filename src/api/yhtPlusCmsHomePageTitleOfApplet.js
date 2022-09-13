import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
//获取小程序首页标题列表
export const homePageTitleOfAppletList = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsHomePageTitleOfApplet/homePageTitleOfAppletList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//修改获取小程序首页标题记录
export const homePageTitleOfAppletUpdate = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsHomePageTitleOfApplet/homePageTitleOfAppletUpdate.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//新增小程序首页标题记录
export const homePageTitleOfAppletSave = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsHomePageTitleOfApplet/homePageTitleOfAppletSave.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//删除小程序首页标题记录
export const homePageTitleOfAppletDelete = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsHomePageTitleOfApplet/homePageTitleOfAppletDelete.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
//刷新小程序标题缓存
export const refreshHomePageTitleOfAppletCache = (data, custom = {}) =>
	request.request({
		url:
			'/yhtplus/yhtPlusCmsHomePageTitleOfApplet/refreshHomePageTitleOfAppletCache.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
