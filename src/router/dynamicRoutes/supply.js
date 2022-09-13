/*
 * @Description: 商家模块路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:57:13
 * @LastEditTime: 2021-11-30 13:48:31
 * @LastEditors: Please set LastEditors
 */
const supplyRouter = {
	path: '/supply',
	redirect: '/supply/supplyList',
	name: 'supply',
	component: () => import('@/layout'),
	meta: {
		title: '商家管理',
		icon: 'el-icon-supplier',
	},
	children: [
		{
			path: 'supplyList',
			name: 'SupplyList',
			meta: {
				title: '商家列表',
				functionCode: ['getCmsSupplierListByCondition'],
			},
			component: () => import('@/pages/supply/SupplyList/index'),
		},
		{
			path: 'supplyMarkList',
			name: 'SupplyMarkList',
			meta: {
				title: '商家登录账号列表',
				functionCode: ['getCmsSupplierListByCondition'],
			},
			component: () => import('@/pages/supply/SupplyMarkList/index'),
		},
		{
			path: 'supplyAccountList',
			name: 'SupplyAccountList',
			meta: {
				title: '商家账号列表',
				functionList: [
					'supplierAccountNumberList',
					'supplierAccountNumberListEntrance',
				],
			},
			component: () => import('@/pages/supply/SupplyAccountList/index'),
		},
		{
			path: 'ErpList',
			name: 'ErpList',
			meta: {
				title: 'ERP管理',
				functionCode: ['supplierErp'],
			},
			component: () => import('@/pages/supply/ErpList/index'),
		},
		{
			path: 'customerServiceList',
			name: 'CustomerServiceList',
			meta: {
				title: '商家客服列表',
				functionCode: ['supplierServiceList'],
			},
			component: () => import('@/pages/supply/CustomerServiceList/index'),
		},
		{
			path: 'importCustomer',
			name: 'ImportCustomer',
			hidden: true,
			meta: {
				title: '导入商家客服',
				functionCode: ['impostSupplierService'],
			},
			component: () => import('@/pages/supply/ImportCustomer/index'),
		},
		{
			path: 'importCustomerRecord',
			name: 'ImportCustomerRecord',
			meta: {
				title: '商家客服导入记录',
				// functionCode: ['violationMerchantProcessList'],
			},
			component: () => import('@/pages/supply/ImportCustomerRecord/index'),
		},
		{
			path: 'aging',
			name: 'aging',
			meta: {
				title: '商家处理时效看板',
				functionCode: ['violationMerchantProcessList'],
			},
			component: () => import('@/pages/supply/aging/index.vue'),
		},
		{
			path: 'violationRecordList',
			name: 'violationRecordList',
			meta: {
				title: '商家违规记录列表',
				functionCode: ['violationForsPage'],
			},
			component: () => import('@/pages/supply/violationRecordList/index.vue'),
		},
		{
			path: 'violationRecordDetails/:supplierId/:violationSn',
			name: 'violationRecordDetails',
			hidden: true,
			meta: {
				functionCode: ['violationDetail'],
				title: '商家违规详情',
			},
			component: () =>
				import('@/pages/supply/violationRecordDetails/index.vue'),
		},
		{
			path: 'violationRecordImport',
			name: 'violationRecordImport',
			meta: {
				title: '商家违规记录导入',
				functionCode: ['violationImportExcel'],
			},
			component: () => import('@/pages/supply/violationRecordImport/index.vue'),
		},
		{
			path: 'violationRecordImportLog',
			name: 'violationRecordImportLog',
			meta: {
				functionCode: ['violationImportExcel'],
				title: '商家违规记录导入历史',
			},
			component: () =>
				import('@/pages/supply/violationRecordImportLog/index.vue'),
		},
		{
			path: 'whiteListConfiguration',
			name: 'whiteListConfiguration',
			meta: {
				title: '商家违规白名单配置',
				functionCode: ['violationWhitelist'],
			},
			component: () => import('@/pages/supply/whiteListConfiguration/index'),
		},
		{
			path: 'contractList',
			name: 'ContractList',
			meta: {
				title: '合同管理',
				functionCode: ['listContract'],
			},
			component: () => import('@/pages/supply/contractList/index'),
		},
		{
			path: 'contractTemplate',
			name: 'ContractTemplate',
			meta: {
				title: '合同模板管理',
				functionCode: ['listContractTemplate'],
			},
			component: () => import('@/pages/supply/contractTemplate/index'),
		},
		{
			path: 'violationsDownloaded',
			name: 'violationsDownloaded',
			meta: {
				title: '违规单下载列表',
				functionCode: ['violationDownLoadList'],
			},
			component: () => import('@/pages/supply/violationsDownloaded/index'),
		},
		{
			path: 'violationRulesReview',
			name: 'violationRulesReview',
			meta: {
				title: '商家违规规则复核',
				functionCode: ['importDataList'],
			},
			component: () => import('@/pages/supply/violationRulesReview/index'),
		},
		{
			path: 'ImportViolationRecord/:importDataId/:status',
			name: 'ImportViolationRecord',
			hidden: true,
			meta: {
				title: '导入商家违规记录',
			},
			component: () => import('@/pages/supply/ImportViolationRecord/index.vue'),
		},
		{
			path: 'supplyAmount',
			name: 'supplyAmount',
			meta: {
				title: '商家补款金额',
			},
			component: () => import('@/pages/supply/SupplyAmount/index'),
			children: [
				{
					path: 'SmallSubsidy',
					name: 'SmallSubsidy',
					meta: {
						functionCode: ['supplierCompensationConfigPage'],
						title: '小额补款配置列表',
					},
					component: () => import('@/pages/supply/SupplyAmount/SmallSubsidy'),
				},
				{
					path: 'SmallSubsidyImport',
					name: 'SmallSubsidyImport',
					meta: {
						functionCode: ['importSupplierCompensationConfig'],
						title: '导入商家小额补款配置',
					},
					component: () =>
						import('@/pages/supply/SupplyAmount/SmallSubsidyImport'),
				},
				{
					path: 'SmallSubsidyImportLog',
					name: 'SmallSubsidyImportLog',
					meta: {
						functionCode: ['supplierCompensationConfigImportRecord'],
						title: '导入商家小额补款历史',
					},
					component: () =>
						import('@/pages/supply/SupplyAmount/SmallSubsidyImportLog'),
				},
			],
		},
		{
			path: 'supplyRating',
			name: 'SupplyRating',
			meta: {
				functionCode: ['monitorLogisticsList'],
				title: '商家评分',
			},
			component: () => import('@/pages/rate/SupplyRating/index'),
		},
		{
			path: 'supplyRatingDetail/:supplierId',
			name: 'SupplyRatingDetail',
			hidden: true,
			meta: {
				functionCode: ['monitorLogisticsList'],
				title: '商家评分详情',
			},
			component: () => import('@/pages/rate/SupplyRatingDetail/index'),
		},
	],
}
export default supplyRouter
