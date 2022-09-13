import request from '@/utils/interceptor/request'
/*
 * -----------------------------------小程序----------------------------------------
 */
// 指引素材列表
export const getDirectMaterialList = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/directMaterial/getDirectMaterialList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
// 编辑指引素材记录
export const updateDirectMaterialById = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/directMaterial/updateDirectMaterialById.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
