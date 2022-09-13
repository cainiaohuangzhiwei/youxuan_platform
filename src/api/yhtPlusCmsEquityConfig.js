import request from '@/utils/interceptor/request'
import { getSwitchInfo } from './marketingSwitch'

//权益保费列表
export const equityConfigList = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquityConfig/equityConfigList.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityConfig/equityConfigList'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equityConfig/equityConfigList',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
//保费配置
export const equityConfig = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/yhtPlusCmsEquityConfig/equityConfig.action',
		'/weeget-bullet-marketing-rest-fors/marketing/equityConfig/equityConfig'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/equityConfig/equityConfig',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
