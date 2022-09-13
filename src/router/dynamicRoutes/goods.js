/*
 * @Description: 商品路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:18:26
 * @LastEditTime: 2021-11-17 14:05:42
 * @LastEditors: Please set LastEditors
 */
const goodsRouter = {
	path: '/goods',
	redirect: '/goods/goodsList',
	name: 'goods',
	component: () => import('@/layout'),
	meta: {
		title: '商品',
		icon: 'el-icon-s-goods',
	},
	children: [
		{
			path: 'goodsList',
			name: 'GoodsList',
			meta: {
				title: '商品列表',
				functionCode: ['getYouxuanGoodsList'],
			},
			component: () => import('@/pages/goods/GoodsList/index'),
		},
		{
			path: 'GoodsEdit/:goodsSpecId/:shelfState/:goodsId',
			name: 'GoodsEdit',
			hidden: true,
			meta: {
				title: '编辑商品',
			},
			component: () => import('@/pages/goods/GoodsEdit/index'),
		},
		{
			path:
				'GoodsDetail/:goodsId/:goodsSpecId/:orderCommodity?/:goodsSnapshotId?/:goodsSpecSnapshotId?',
			name: 'GoodsDetail',
			hidden: true,
			meta: {
				title: '商品详情',
			},
			component: () => import('@/pages/goods/GoodsDetail/index'),
		},
		{
			path: 'goodsPrice',
			name: 'GoodsPrice',
			meta: {
				title: '商品列表 (杭州)',
				functionList: ['getYouxuanGoodsListByHZ'],
			},
			component: () => import('@/pages/goods/GoodsPrice/index'),
		},
		{
			path: 'goodsListAttribute',
			name: 'GoodsListAttribute',
			meta: {
				title: '商品列表（属性查询）',
				functionCode: ['getGoodsAttributeList'],
			},
			component: () => import('@/pages/goods/GoodsListAttribute/index'),
		},
		{
			path: 'upstreamEventVenue',
			name: 'UpstreamEventVenue',
			meta: {
				title: '上游活动会场',
				functionCode: ['searchBrandRecord'],
			},
			component: () => import('@/pages/goods/upstreamEventVenue/index'),
		},
		{
			path: 'fixedPriceEventVenue',
			name: 'fixedPriceEventVenue',
			meta: {
				title: '上游一口价活动会场',
				functionCode: ['queryFixedPriceBrandList'],
			},
			component: () => import('@/pages/goods/fixedPriceEventVenue/index'),
		},
		{
			path: 'fixedPriceProductList/:actId/:refBrandId/:marketId',
			name: 'fixedPriceProductList',
			hidden: true,
			meta: {
				title: '一口价商品列表',
			},
			component: () => import('@/pages/goods/fixedPriceProductList/index'),
		},

		{
			path: 'brandSet',
			name: 'BrandSet',
			meta: {
				title: '品牌列表',
				functionCode: [
					'getBrandParentList',
					'getBrandCategoryList',
					'getBrandListConfiguration',
				],
			},
			component: () => import('@/pages/goods/brandSet/index'),
		},
		{
			path: 'materialTemplate/:brandParentId',
			name: 'MaterialTemplate',
			hidden: true,
			meta: {
				title: '会场素材',
			},
			component: () => import('@/pages/goods/materialTemplate/index'),
		},
		{
			path: 'goodsStockList',
			name: 'goodsStockList',
			meta: {
				title: ' 库存列表',
				functionCode: ['getWarehouseSpecListByCondition'],
			},
			component: () => import('@/pages/goods/goodsStockList/index'),
		},
		{
			path: 'goodsStockOperationList',
			name: 'goodsStockOperationList',
			meta: {
				title: '出入库列表',
				functionCode: ['getInventoryChangeListByCondition'],
			},
			component: () => import('@/pages/goods/goodsStockOperationList/index'),
		},
		{
			path: 'newStockOperationOperation',
			name: 'newStockOperationOperation',
			meta: {
				title: '出入库操作',
				functionCode: ['getNewGoodsInventoryList'],
			},
			component: () => import('@/pages/goods/newStockOperationOperation/index'),
		},
		{
			path: 'argueCommodityList',
			name: 'ArgueCommodityList',
			meta: {
				title: '驳回商品列表',
				functionCode: ['getRejectGoodsList'],
			},
			component: () => import('@/pages/goods/argueCommodityList/index'),
		},
		{
			path: 'commodityCategories',
			name: 'commodityCategories',
			meta: {
				title: '商品类目表',
				functionCode: ['getGoodsCategoryList'],
			},
			component: () => import('@/pages/goods/commodityCategories/index'),
		},
		{
			path: 'supplierGoodsAudit',
			name: 'supplierGoodsAudit',
			meta: {
				title: '审核商家商品',
				functionCode: ['getYouxuanGoodsAuditListByParam'],
			},
			component: () => import('@/pages/goods/supplierGoodsAudit/index'),
		},
		{
			path:
				'commodityAudit/:goodsId/:goodsSpecId/:checkTime/:idx/:oCount/:startIndex/:goodsSt/:goodsCategoryId',
			name: 'CommodityAudit',
			hidden: true,
			meta: {
				title: '商品审核',
			},
			component: () => import('@/pages/goods/CommodityAudit/index'),
		},
		{
			path: 'categoriesInterest',
			name: 'categoriesInterest',
			meta: {
				title: '商品类目毛利率配置',
				functionCode: ['threeLevelGoodsCategoryList'],
			},
			component: () => import('@/pages/goods/categoriesInterest/index'),
		},
		{
			path: 'categoryAttribute',
			name: 'categoryAttribute',
			meta: {
				title: '商品类目属性管理',
				functionCode: ['listCategoryAttribute'],
			},
			component: () => import('@/pages/goods/CategoryAttribute/index'),
		},
		{
			path: 'goodsBasicsAttribute',
			name: 'goodsBasicsAttribute',
			meta: {
				title: '商品属性库',
				functionCode: ['listBasicsAttribute'],
			},
			component: () => import('@/pages/goods/GoodsBasicsAttribute/index'),
		},
		{
			path: 'priceCoefficient',
			name: 'priceCoefficient',
			meta: {
				title: '价格系数设置',
				functionCode: ['brandParentClassList', 'priceList'],
			},
			component: () => import('@/pages/goods/priceCoefficient/index'),
			children: [
				{
					path: 'brandCoefficient',
					name: 'brandCoefficient',
					meta: {
						functionCode: ['brandParentClassList'],
						title: '品牌等级系数',
					},
					component: () => import('@/pages/goods/priceCoefficient/brand/index'),
				},
				{
					path: 'intervalCoefficient',
					name: 'intervalCoefficient',
					meta: {
						functionCode: ['priceList'],
						title: '价格区间系数',
					},
					component: () => import('@/pages/goods/priceCoefficient/price/index'),
				},
			],
		},
		{
			path: 'goodsPriceComparison',
			name: 'goodsPriceComparison',
			meta: {
				title: '商品比价查询',
				functionCode: ['queryGoodsPriceComparison'],
			},
			component: () => import('@/pages/goods/GoodsPriceComparison/index'),
		},
		{
			path: 'goodsPriceDetails/:goodsNumber',
			name: 'GoodsPriceDetails',
			hidden: true,
			meta: {
				title: '详细信息',
				functionCode: ['queryGoodsPriceComparisonDetail'],
			},
			component: () => import('@/pages/goods/GoodsPriceDetails/index'),
		},
		{
			path: 'expressManage',
			name: 'expressManage',
			meta: {
				title: '运费模板管理',
				functionCode: ['expressTempList'],
			},
			component: () => import('@/pages/goods/ExpressManage/index'),
		},
		{
			path: 'expressAccessList',
			name: 'expressAccessList',
			meta: {
				title: '运费模板白名单配置',
				functionCode: ['expressTempAccessList'],
			},
			component: () => import('@/pages/goods/ExpressAccessList/index'),
		},
		{
			path: 'goodsCategoryFront',
			name: 'goodsCategoryFront',
			meta: {
				title: '前端类目管理',
				functionCode: ['goodsCategoryFrontTree'],
			},
			component: () => import('@/pages/goods/GoodsCategoryFront/index'),
		},
		{
			path: 'supplierConfiguringWhitelist',
			name: 'SupplierConfiguringWhitelist',
			meta: {
				title: '商家扣点白名单',
				functionList: ['whitelistListByCondition'],
			},
			component: () =>
				import('@/pages/goods/supplierConfiguringWhitelist/index'),
		},
		{
			path: 'supplierBucklePoint',
			name: 'supplierBucklePoint',
			meta: {
				title: '商家扣点配置',
				functionList: ['ruleListByCondition'],
			},
			component: () => import('@/pages/goods/supplierBucklePoint/index'),
		},
		{
			path: 'supplierBucklePointHZ',
			name: 'supplierBucklePointHZ',
			meta: {
				title: '杭州商家扣点配置',
				functionList: ['hzDeductionRuleListByCondition'],
			},
			component: () => import('@/pages/goods/supplierBucklePointHZ/index'),
		},
		{
			path: 'priceAdjustmentRecordList',
			name: 'priceAdjustmentRecordList',
			meta: {
				title: '平台调价记录列表',
				functionCode: [
					'pagePlatformAdjustmentByCategory',
					'pagePlatformAdjustmentByGoods',
				],
			},
			component: () => import('@/pages/goods/priceAdjustmentRecordList/index'),
		},
		{
			path: 'platformPricingImport/:type',
			name: 'platformPricingImport',
			meta: {
				title: '导入批量平台调价数据',
			},
			hidden: true,
			component: () => import('@/pages/goods/platformPricingImport/index'),
		},
		{
			path: 'batchesModifyPrices/:region',
			name: 'batchesModifyPrices',
			hidden: true,
			meta: {
				title: '批量修改商品价格',
			},
			component: () => import('@/pages/goods/batchesModifyPrices/index'),
		},
		{
			path: 'batchFixPriceList',
			name: 'BatchFixPriceList',
			meta: {
				title: '批量定价处理记录列表',
				functionCode: ['initBatchFixPriceRecord'],
			},
			component: () => import('@/pages/goods/batchFixPriceList/index'),
		},
		{
			path: 'batchFixPriceImport',
			name: 'BatchFixPriceImport',
			hidden: true,
			meta: {
				title: '导入批量定价',
			},
			component: () => import('@/pages/goods/batchFixPriceImport/index'),
		},
		{
			path: 'batchFixPriceImportLog',
			name: 'BatchFixPriceImportLog',
			hidden: true,
			meta: {
				title: '导入批量定价历史记录',
			},
			component: () => import('@/pages/goods/batchFixPriceImportLog/index'),
		},
		{
			path: 'categoryAdjustList',
			name: 'CategoryAdjustList',
			meta: {
				title: '商品类目调整记录',
				functionCode: ['goodsCategoryChangePage'],
			},
			component: () => import('@/pages/goods/categoryAdjustList/index'),
		},
		{
			path: 'categoryAdjustImport',
			name: 'CategoryAdjustImport',
			hidden: true,
			meta: {
				title: '导入商品类目调整',
			},
			component: () => import('@/pages/goods/categoryAdjustImport/index'),
		},
		{
			path: 'batchRejectGoodsList',
			name: 'BatchRejectGoodsList',
			meta: {
				title: '批量驳回商品列表',
				functionCode: ['goodsRejectBatchPage'],
			},
			component: () => import('@/pages/goods/batchRejectGoodsList/index'),
		},
		{
			path: 'batchRejectGoodsImport',
			name: 'BatchRejectGoodsImport',
			hidden: true,
			meta: {
				title: '导入批量驳回商品',
			},
			component: () => import('@/pages/goods/batchRejectGoodsImport/index'),
		},
	],
}
export default goodsRouter
