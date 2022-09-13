/*
 * @Description:	店铺路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:14:40
 * @LastEditTime: 2022-04-12 18:27:11
 * @LastEditors: Please set LastEditors
 */

const shopOrder = {
	path: '/shop',
	redirect: '/shop/shopList',
	name: 'shop',
	component: () => import('@/layout'),
	meta: {
		title: '店铺管理',
		icon: 'el-icon-s-shop',
	},
	children: [
		{
			path: 'shopList',
			name: 'ShopList',
			meta: {
				title: '店铺列表',
				functionCode: ['getOrganizationListByCondition'],
			},
			component: () => import('@/pages/shop/ShopList/index'),
		},
		{
			path: 'shop/shopDetail/:organizationId',
			name: 'shopDetail',
			hidden: true,
			meta: {
				title: '店铺详情',
				functionCode: ['getOrganizationListByCondition'],
			},
			component: () => import('@/pages/shop/ShopDetail/index'),
		},
		{
			path: 'shopLinkList',
			name: 'ShopLinkList',
			meta: {
				title: '店铺树形列表',
				functionCode: ['getOrganizationTree'],
			},
			component: () => import('@/pages/shop/ShopLinkList/index'),
		},
		{
			path: 'verifyCodeList',
			name: 'Verification',
			meta: {
				title: '验证码列表',
				functionCode: ['getVerifyCodeListByCondition'],
			},
			component: () => import('@/pages/shop/Verification/index'),
		},
		{
			path: 'customerTrust',
			name: 'CustomerTrust',
			meta: {
				title: '客服托管',
				functionCode: ['findCusServiceTrusteeship'],
			},
			component: () => import('@/pages/shop/CustomerTrust/index'),
		},
		{
			path: 'shopOrderSettlement',
			name: 'shopOrderSettlement',
			meta: {
				title: '店主订单结算列表',
				functionCode: ['listPageOrganizationOrderSettle'],
			},
			component: () => import('@/pages/shop/shopOrderSettlement/index'),
		},
		{
			path: 'shopkeeperAccount',
			name: 'ShopkeeperAccount',
			hidden: true,
			meta: {
				title: '店主销售权益结算明细列表',
				functionCode: ['listPageOrganizationOrderSettleItem'],
			},
			component: () => import('@/pages/shop/shopkeeperAccount/index'),
		},
		{
			path: 'shopPlatformRewardList',
			name: 'ShopPlatformRewardList',
			hidden: true,
			meta: {
				title: '店主平台奖励结算明细列表',
				functionCode: ['listOrderManagerSettleItem'],
			},
			component: () => import('@/pages/shop/shopPlatformRewardList/index'),
		},
		{
			path: 'supplierCommissionAgentList',
			name: 'SupplierCommissionAgentList',
			meta: {
				title: '代办店主列表',
				functionCode: ['accOrganizationTaxIdentityListFors'],
			},
			component: () =>
				import('@/pages/shop/SupplierCommissionAgentList/index.vue'),
		},
		{
			path: 'supplierCommissionAgentImport',
			name: 'SupplierCommissionAgentImport',
			hidden: true,
			meta: {
				title: '导入代办店主',
			},
			component: () =>
				import('@/pages/shop/SupplierCommissionAgentImport/index.vue'),
		},
		{
			path: 'supplierCommissionAgentImportLog',
			name: 'SupplierCommissionAgentImportLog',
			hidden: true,
			meta: {
				title: '导入代办店主历史',
			},
			component: () =>
				import('@/pages/shop/SupplierCommissionAgentImportLog/index.vue'),
		},
		{
			path: 'merchantsCertificationList',
			name: 'MerchantsCertificationList',
			meta: {
				title: '个体户认证列表',
				functionCode: ['accAccountIndividualRelationListFors'],
			},
			component: () =>
				import('@/pages/shop/MerchantsCertificationList/index.vue'),
		},
		{
			path: 'bankLockList',
			name: 'BankLockList',
			meta: {
				title: '客户银行卡信息解锁',
				functionCode: ['accCustomerAuthInfoListFors'],
			},
			component: () => import('@/pages/shop/BankLockList/index.vue'),
		},
		{
			path: 'familyGroup',
			name: 'FamilyGroup',
			meta: {
				title: '家族群配置列表',
				functionCode: ['mentorList'],
			},
			component: () => import('@/pages/shop/familyGroup/index.vue'),
		},
		{
			path: 'shopEquityConfiguration',
			name: 'ShopEquityConfiguration',
			meta: {
				title: '店主权益配置',
				functionCode: ['equityAllocation'],
			},
			component: () => import('@/pages/shop/shopEquityConfiguration/index'),
		},
		{
			path: 'changeOwnerSuperior',
			name: 'changeOwnerSuperior',
			meta: {
				title: '店主上级更改',
				functionCode: ['relationPage'],
			},
			component: () => import('@/pages/shop/changeOwnerSuperior/index'),
		},
		{
			path: 'addChange',
			name: 'addChange',
			hidden: true,
			meta: {
				title: '新增更改',
			},
			component: () => import('@/pages/shop/addChange/index'),
		},
		{
			path: 'platformTaskLogList',
			name: 'PlatformTaskLogList',
			meta: {
				title: '平台任务记录列表',
				functionCode: ['orgPlatformTaskRecordPageList'],
			},
			component: () => import('@/pages/shop/platformTaskLogList/index.vue'),
		},
		{
			path: 'cancellationApplication',
			name: 'cancellationApplication',
			meta: {
				title: '店主注销申请',
				functionCode: ['userCancellationRecordListByParam'],
			},
			component: () => import('@/pages/shop/cancellationApplication/index.vue'),
		},
		{
			path: 'obtainUserIdsBatches',
			name: 'ObtainUserIdsBatches',
			meta: {
				title: '批量获取用户ID',
				functionCode: ['queryOrganizationConvertTaskList'],
			},
			component: () => import('@/pages/shop/obtainUserIdsBatches/index.vue'),
		},
	],
}
export default shopOrder
