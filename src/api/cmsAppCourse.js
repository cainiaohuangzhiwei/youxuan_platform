import request from '@/utils/interceptor/request'
/*
 * ----------------------------------B端app店主必修课----------------------------------------
 */
export const listAppCourse = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppCourse/listAppCourse.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}

export const updateAppCourse = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/cmsAppCourse/updateAppCourse.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
