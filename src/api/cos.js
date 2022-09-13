import request from '@/utils/interceptor/request'

export const getCosToken = (data, custom = {}) => {
	return request.request({
		url:
			process.env.NODE_ENV === 'development'
				? `/egg-cos/api/auth`
				: `//${window.location.host}/egg-cos/api/auth`,
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
