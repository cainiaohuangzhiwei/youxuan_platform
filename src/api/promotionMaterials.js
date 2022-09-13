import request from '@/utils/interceptor/request'
// 活动素材列表接口
export const materialList = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/main/material/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材查询接口
export const materialPage = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/main/material/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材内容更新接口
export const materialUpdate = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/main/material/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材内容保存接口
export const materialSave = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/main/material/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材内容删除接口
export const materialDelete = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/main/material/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材内容保存预览接口
export const materialSavePreview = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/main/material/save/preview',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材保存图片接口
export const materialSavePicture = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/main/material/save/picture',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材资源表接口
export const materialSourcePage = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/material/source/page',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材资源表删除接口
export const materialSourceDelete = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/material/source/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材资源表保存接口
export const materialSourceSave = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/material/source/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动素材资源表更新接口
export const materialSourceUpdate = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/material/source/update',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动商品素材表查询接口
export const goodsMaterialGet = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/goods/material/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动商品素材表保存接口
export const goodsMaterialSave = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/goods/material/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动会场素材表查询接口
export const brandMaterialGet = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/brand/material/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}

// 活动会场素材表保存接口
export const brandMaterialSave = (data, custom = {}) => {
	return request.request({
		url: '/upms/activity/brand/material/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 品牌关联素材模板列表
export const brandTemplateList = (data, custom = {}) => {
	return request.request({
		url: '/upms/brand/material/template/list',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 删除品牌关联素材模板
export const brandTemplateDelete = (data, custom = {}) => {
	return request.request({
		url: '/upms/brand/material/template/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新增/编辑素材模板
export const brandTemplateSave = (data, custom = {}) => {
	return request.request({
		url: '/upms/brand/material/template/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 新增/编辑素材内容模板
export const brandTemplateInfoSave = (data, custom = {}) => {
	return request.request({
		url: '/upms/brand/material/template/info/save',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取素材模板详细内容
export const brandTemplateInfoGet = (data, custom = {}) => {
	return request.request({
		url: '/upms/brand/material/template/info/get',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
// 获取素材模板详细内容
export const brandTemplateInfoDelete = (data, custom = {}) => {
	return request.request({
		url: '/upms/brand/material/template/info/delete',
		method: 'post',
		data,
		custom,
		dataType: 'json',
	})
}
