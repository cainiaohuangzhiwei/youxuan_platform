import request from '@/utils/interceptor/request'
/*
 * -----------------------------------商品----------------------------------------
 */
// 获取分组店主
export const getDepartmentAmiBaList = (data, custom = {}) =>
	request.request({
		url: '/yhtplus/cmsOrganizationAdmin/getDepartmentAmiBaList.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
