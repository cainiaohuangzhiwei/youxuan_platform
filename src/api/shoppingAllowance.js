import request from '@/utils/interceptor/request'
import { getSwitchInfo } from './marketingSwitch'

/*
 * -----------------------------------审核商家商品----------------------------------------
 */
// 津贴领取计划列表
export const listAllowancePlan = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/cmsAllowancePlan/listAllowancePlan.action',
		'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/listAllowancePlan'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/listAllowancePlan',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 创建津贴领取计划
export const saveAllowancePlan = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/cmsAllowancePlan/saveAllowancePlan.action',
		'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/saveAllowancePlan'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/saveAllowancePlan',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 上传Excel
// export const importAuditedSupplierGoods = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/webImport/importAuditedSupplierGoods.action',
// 		method: 'post',
// 		data,
// 		custom,
// 	})
// }
// 更新津贴领取计划
export const cmsAllowancePlan = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/cmsAllowancePlan/updateAllowancePlan.action',
		'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/updateAllowancePlan'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/updateAllowancePlan',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
// 导出
// export const exportGoodsWaitingDetails = (data, custom = {}) => {
// 	return request.request({
// 		url: '/yhtplus/webImport/exportGoodsWaitingDetails.action',
// 		method: 'post',
// 		data,
// 		custom,
// 		responseType: 'arraybuffer',
// 		dataType: 'form',
// 	})
// }
// 结束津贴计划
export const endAllowancePlan = async (data, custom = {}) => {
	const switchInfo = await getSwitchInfo(
		'/yhtplus/cmsAllowancePlan/endAllowancePlan.action',
		'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/endAllowancePlan'
	)

	return request.request({
		// url:
		// 	'/weeget-bullet-marketing-rest-fors/marketing/allowancePlan/endAllowancePlan',
		method: 'post',
		data,
		custom,
		// dataType: 'json',
		...switchInfo,
	})
}
