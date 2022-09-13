import request from '@/utils/interceptor/request'

// 小程序首页刷新缓存
export const handleGoodsGroupListRedis = (data, custom = {}) => {
	return request.request({
		url: '/yhtplus/redis/handleGoodsGroupListRedis.action',
		method: 'post',
		data,
		custom,
		dataType: 'form',
	})
}
