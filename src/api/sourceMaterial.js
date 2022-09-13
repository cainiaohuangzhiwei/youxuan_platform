import request from '@/utils/interceptor/request'
// 发现页管理
export const getSourceMaterialManageList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/getSourceMaterialManageList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//删除
export const delSourceMaterialManage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/delSourceMaterialManage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//内容分类
export const getSourceMaterialList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/getSourceMaterialList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//新增
export const addSourceMaterial = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/addSourceMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//删除
export const delSourceMaterial = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/delSourceMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//编辑内容Table展示
export const getSourceMaterialManageListById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/getSourceMaterialManageListById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//编辑内容
export const operationSourceMaterial = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/operationSourceMaterial.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
//新增内容管理
export const addSourceMaterialManage = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/sourceMaterial/addSourceMaterialManage.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
