/*
 * @Description: 营销活动路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:50:15
 * @LastEditTime: 2022-01-24 13:59:12
 * @LastEditors: Please set LastEditors
 */
const ymRouter = {
	path: '/ym',
	redirect: '/ym/activeList',
	name: 'ym',
	component: () => import('@/layout'),
	meta: {
		title: '营销活动',
		icon: 'el-icon-activity',
	},
	children: [
		{
			path: 'activeList',
			name: 'activeList',
			meta: {
				title: '活动设置',
				functionCode: ['activeSetteing'],
			},
			component: () => import('@/pages/ym/activeList/index'),
		},
		{
			path: 'couponList',
			name: 'couponList',
			meta: {
				title: '优惠券',
				functionCode: ['queryYxCouponInfoBatch'],
			},
			component: () => import('@/pages/ym/couponList/index'),
		},
		{
			path: 'couponDetails/:yxCouponId',
			name: 'couponDetails',
			hidden: true,
			meta: {
				title: '优惠券详情',
			},
			component: () => import('@/pages/ym/couponDetails/index'),
		},
		{
			path: 'newGuidelines',
			name: 'newGuidelines',
			meta: {
				title: '新手指引',
				functionCode: ['getActChannelLandingList'],
			},
			component: () => import('@/pages/ym/newGuidelines/index'),
		},
		{
			path: 'channelPage',
			name: 'channelPage',
			meta: {
				title: '渠道落地页',
				functionCode: ['getActChannelLandingList'],
			},
			component: () => import('@/pages/ym/channelPage/index'),
		},
		{
			path: 'package',
			name: 'package',
			meta: {
				title: '礼包系统',
				functionCode: ['findGiftListByParam'],
			},
			component: () => import('@/pages/ym/package/index'),
		},
		{
			path: 'multiplePromotions',
			name: 'MultiplePromotions',
			meta: {
				title: '多件促销',
				functionCode: ['getActMorePromotion'],
			},
			component: () => import('@/pages/ym/MultiplePromotions/index'),
		},
		{
			path: 'equityCenter',
			name: 'EquityCenter',
			meta: {
				title: '权益中心',
				functionCode: ['getEquity'],
			},
			component: () => import('@/pages/ym/equityCenter/index'),
		},
		{
			path: 'historyLeadRecord',
			name: 'historyLeadRecord',
			hidden: true,
			meta: {
				title: '派发计划用户导入记录',
			},
			component: () => import('@/pages/ym/historyLeadRecord/index'),
		},
		{
			path: 'equityDetail/:equityId',
			name: 'equityDetail',
			hidden: true,
			meta: {
				title: '权益卡详情',
			},
			component: () => import('@/pages/ym/equityDetail/index'),
		},
		{
			path: 'shoppingAllowance',
			name: 'shoppingAllowance',
			meta: {
				title: '购物津贴',
				functionCode: ['listAllowancePlan'],
			},
			component: () => import('@/pages/ym/shoppingAllowance/index'),
		},
		{
			path: 'userRewardSystem',
			name: 'userRewardSystem',
			meta: {
				title: '活动奖励系统',
				functionCode: [
					'listPageMarketingReward',
					'actSaleRewardList',
					'queryActSaleRewardEntrancePage',
				],
			},
			component: () => import('@/pages/ym/userRewardSystem/index'),
		},
		{
			path: 'orderReward',
			name: 'orderReward',
			hidden: true,
			meta: {
				title: '订单奖励活动',
				// functionCode: ['actSaleRewardList', 'queryActSaleRewardEntrancePage'],
			},
			component: () => import('@/pages/ym/userRewardSystem/orderReward/index'),
		},
		{
			path: 'platformReward',
			name: 'platformReward',
			hidden: true,
			meta: {
				title: '自定义活动',
				// functionCode: ['actSaleRewardList', 'queryActSaleRewardEntrancePage'],
			},
			component: () =>
				import('@/pages/ym/userRewardSystem/platformReward/index'),
		},
		{
			path: 'liveReward',
			name: 'liveReward',
			hidden: true,
			meta: {
				title: '直播奖励',
				// functionCode: ['actSaleRewardList', 'queryActSaleRewardEntrancePage'],
			},
			component: () => import('@/pages/ym/userRewardSystem/liveReward/index'),
		},
		{
			path: 'activityRewardRecord',
			name: 'activityRewardRecord',
			meta: {
				title: '店主活动奖励记录',
				functionCode: ['listMarketingUserRewardRecordGoods'],
			},
			component: () => import('@/pages/ym/activityRewardRecord/index'),
		},
		{
			path: 'activitySettlementDetails',
			name: 'activitySettlementDetails',
			meta: {
				title: '店主活动结算明细列表',
				functionCode: ['listPageAccountOrderSettleItem'],
			},
			component: () => import('@/pages/ym/activitySettlementDetails/index'),
		},
		{
			path: 'CommodityPurchase',
			name: 'CommodityPurchase',
			meta: {
				title: '商品限购',
				functionCode: ['getGoodsRestrictionYouxuanGoodsList'],
			},
			component: () => import('@/pages/ym/CommodityPurchase/index'),
		},
		{
			path: 'receiveCouponCenter',
			name: 'ReceiveCouponCenter',
			meta: {
				title: '领券中心',
				functionCode: ['cmsCouponCenterList'],
			},
			component: () => import('@/pages/ym/receiveCouponCenter/index'),
		},
		{
			path: 'shopkeeperHatch',
			name: 'shopkeeperHatch',
			hidden: true,
			meta: {
				title: 'vip店主孵化计划',
			},
			component: () => import('@/pages/ym/shopkeeperHatch/index'),
		},
		{
			path: 'codeReward',
			name: 'codeReward',
			hidden: true,
			meta: {
				title: '奖励邀请码活动数据',
			},
			component: () => import('@/pages/ym/codeReward/index'),
		},
		{
			path: 'abTest',
			name: 'abTest',
			meta: {
				title: 'A/B测试',
				functionCode: ['abTest'],
			},
			component: () => import('@/pages/ym/abTest/index'),
		},
		{
			path: 'abTestExpri',
			name: 'abTestExpri',
			hidden: true,
			meta: {
				title: '实验',
				noCache: true,
			},
			component: () => import('@/pages/ym/abTestExpri/index'),
		},
		{
			path: 'gameSign',
			name: 'gameSign',
			meta: {
				title: '养鱼签到',
			},
			component: () => import('@/pages/ym/gameSign/index'),
			redirect: '/pages/ym/gameSign/rewardSetting/index',
			children: [
				{
					path: 'rewardSetting',
					component: () => import('@/pages/ym/gameSign/rewardSetting/index'),
					name: 'rewardSetting',
					meta: { title: '奖励设置' },
				},
				{
					path: 'adSetting',
					component: () => import('@/pages/ym/gameSign/adSetting/index'),
					name: 'adSetting',
					meta: { title: '广告位设置' },
				},
			],
		},
		{
			path: 'lotteryTools',
			name: 'lotteryTools',
			meta: {
				title: '抽奖工具',
				functionCode: ['LotteryTool'],
			},
			component: () => import('@/pages/ym/lotteryTools/index'),
			redirect: '/pages/ym/lotteryTools/luckyDraw/index',
			children: [
				{
					path: 'luckyDraw',
					component: () => import('@/pages/ym/lotteryTools/luckyDraw/index'),
					name: 'luckyDraw',
					meta: {
						title: '抽奖活动',
						functionCode: ['LotteryActivity'],
					},
				},
				{
					path: 'prizeSet',
					component: () => import('@/pages/ym/lotteryTools/prizeSet/index'),
					name: 'prizeSet',
					meta: {
						title: '奖品设置',
						functionCode: ['PrizeSetting'],
					},
				},
				{
					path: 'winningList/:id',
					name: 'winningList',
					hidden: true,
					meta: {
						title: '中奖名单',
						noCache: true,
					},
					component: () => import('@/pages/ym/lotteryTools/winningList/index'),
				},
			],
		},
		{
			path: 'multiplePromotionList/:goodsGroupIds',
			name: 'multiplePromotionList',
			hidden: true,
			meta: {
				title: '多件促销活动商品',
			},
			component: () => import('@/pages/ym/multiplePromotionList/index'),
		},
		{
			path: 'questionEdit/:id',
			name: 'questionEdit',
			hidden: true,
			meta: {
				title: '问卷编辑',
				functionCode: [
					'/questionnaire/que-questionnaire/v2/getQuestionnaireDetailFors', // 获取详情
					'/questionnaire/que-questionnaire/v2/add', // 新增
					'/questionnaire/que-questionnaire/v2/updateQueQuestionnaire', // 编辑
				],
			},
			component: () => import('@/pages/questionNaire/questionEdit/index'),
		},
		{
			path: 'myOuestionNaire',
			name: 'myOuestionNaire',
			meta: {
				title: '调研问卷',
				functionCode: ['/questionnaire/que-questionnaire/v2/pageQuery'],
			},
			component: () => import('@/pages/questionNaire/questionList/index'),
		},
		{
			path: 'warmUp',
			name: 'warmUp',
			meta: {
				title: '活动预热',
				functionCode: ['preheatConfigDetail'],
			},
			component: () => import('@/pages/ym/warmUp/index'),
		},
		{
			path: 'activityAmbient',
			name: 'activityAmbient',
			meta: {
				title: '活动氛围',
				functionCode: ['/marketing/act-atmosphere/pageQuery'],
			},
			component: () => import('@/pages/ym/activityAmbient/index'),
		},
		{
			path: 'goodsRule',
			name: 'goodsRule',
			meta: {
				title: '货品规则',
			},
			component: () => import('@/pages/ym/goodsRule/index'),
			redirect: 'goodsRule/goodsPool',
			children: [
				{
					path: 'goodsPool',
					name: 'goodsPool',
					component: () => import('@/pages/ym/goodsRule/goodsPool/index'),
					meta: {
						title: '商品池管理',
						// functionCode: ['LotteryActivity'],
					},
				},
				{
					path: 'groupPool',
					name: 'groupPool',
					component: () => import('@/pages/ym/goodsRule/groupPool/index'),
					meta: {
						title: '会场池管理',
						// functionCode: ['LotteryActivity'],
					},
				},
			],
		},
		{
			path: 'flowRule',
			name: 'flowRule',
			meta: {
				title: '流量规则',
			},
			component: () => import('@/pages/ym/flowRule/index'),
			redirect: 'flowRule/sceneManagement',
			children: [
				{
					path: 'sceneManagement',
					name: 'sceneManagement',
					meta: {
						title: '场景管理',
					},
					component: () => import('@/pages/ym/flowRule/sceneManagement/index'),
				},
				{
					path: 'editScene/:sceneId',
					name: 'editScene',
					hidden: true,
					meta: {
						title: '编辑场景',
					},
					component: () => import('@/pages/ym/flowRule/editScene/index'),
				},
				{
					path: 'metaDataManagement',
					name: 'metaData',
					meta: {
						title: '元数据管理',
					},
					component: () =>
						import('@/pages/ym/flowRule/metaDataManagement/index'),
				},
				{
					path: 'checkList',
					name: 'checkList',
					meta: {
						title: '审核',
					},
					component: () => import('@/pages/ym/flowRule/checkList/index'),
				},
				{
					path: 'authorityManagement',
					name: 'authorityManagement',
					meta: {
						title: '权限管理',
					},
					component: () =>
						import('@/pages/ym/flowRule/authorityManagement/index'),
				},
			],
		},
		{
			path: 'userRule',
			name: 'userRule',
			meta: {
				title: '用户规则',
			},
			component: () => import('@/pages/ym/userRule/index'),
			redirect: 'userRule/groupManage',
			children: [
				{
					path: 'groupManage',
					name: 'groupManage',
					component: () => import('@/pages/ym/userRule/groupManage/index'),
					meta: {
						title: '用户规则',
						// functionCode: ['LotteryActivity'],
					},
				},
			],
		},
		{
			path: 'groupActivities',
			name: 'groupActivities',
			meta: {
				title: '拼团',
				functionCode: ['groupBuyingList'],
			},
			component: () => import('@/pages/ym/groupActivities/index'),
		},
		{
			path: 'newComerArea',
			name: 'newComerArea',
			meta: {
				title: '新人专区',
			},
			redirect: '/ym/newComerArea/newComerAreaIndex',
			component: () => import('@/pages/ym/newComerArea/index'),
			children: [
				{
					path: 'newComerAreaIndex',
					name: 'newComerAreaIndex',
					meta: {
						title: '入口配置',
						functionCode: ['newShopkeeperActivityList'],
					},
					component: () =>
						import('@/pages/ym/newComerArea/newComerAreaList/index'),
				},
				{
					path: 'newComerCouponList',
					name: 'newComerCouponList',
					meta: {
						title: '新人优惠劵',
						functionCode: ['newShopkeeperCouponList'],
					},
					component: () =>
						import('@/pages/ym/newComerArea/newComerCouponList/index'),
				},
			],
		},
		{
			path: 'marketingLink',
			name: 'marketingLink',
			meta: {
				title: '营销链接生成',
			},
			component: () => import('@/pages/ym/marketingLink/index'),
		},
		{
			path: 'activityReward',
			name: 'ActivityReward',
			meta: {
				title: '营销活动奖励系统',
				functionCode: ['userCashRewardListPage'],
			},
			component: () => import('@/pages/ym/activityReward/index'),
		},
		{
			path: 'activityRewardData/:actId',
			name: 'activityRewardData',
			hidden: true,
			meta: {
				title: '活动数据',
			},
			component: () => import('@/pages/ym/activityReward/data/index'),
		},
		{
			path: 'signin',
			name: 'signin',
			meta: {
				title: '签到有奖',
				functionCode: ['actSignInExchangePage'],
			},
			component: () => import('@/pages/ym/signin/index'),
		},
		{
			path: 'activitySeckillList',
			name: 'activitySeckillList',
			meta: {
				title: '秒杀活动列表',
				functionCode: ['secKillActivityQueryList'],
			},
			component: () => import('@/pages/ym/activitySeckillList/index'),
		},
		{
			path: 'activitiesGoods/:secKillActivityId/:activityStatus',
			name: 'activitiesGoods',
			hidden: true,
			meta: {
				title: '活动商品',
				functionCode: ['queryListGoods'],
			},
			component: () => import('@/pages/ym/activitiesGoods/index'),
		},
		{
			path: 'activitiesGoodsImport/:secKillActivityId',
			name: 'activitiesGoodsImport',
			hidden: true,
			meta: {
				title: '导入添加活动商品',
			},
			component: () => import('@/pages/ym/activitiesGoodsImport/index'),
		},
		{
			path: 'activitySettlementList',
			name: 'ActivitySettlementList',
			meta: {
				title: '活动结算列表',
				functionCode: ['marketingActivityRewardSettlePageList'],
			},
			component: () => import('@/pages/ym/activitySettlementList/index'),
		},
		{
			path: 'activitySettlementDetail/:activitySn',
			name: 'ActivitySettlementDetail',
			hidden: true,
			meta: {
				title: '活动结算明细',
				functionCode: ['marketingActivityRewardSettleDetailPageList'],
			},
			component: () => import('@/pages/ym/activitySettlementDetail/index'),
		},
		{
			path: 'checkActivityDetail/:actId',
			name: 'checkActivityDetail',
			hidden: true,
			meta: {
				title: '活动明细记录',
				// functionCode: ['marketingActivityRewardSettleDetailPageList'],
			},
			component: () =>
				import(
					'@/pages/ym/activitySettlementList/components/checkActivityDetail'
				),
		},
		{
			path: 'checkRewardDetail/:actId',
			name: 'checkRewardDetail',
			hidden: true,
			meta: {
				title: '奖励明细记录',
				// functionCode: ['marketingActivityRewardSettleDetailPageList'],
			},
			component: () =>
				import(
					'@/pages/ym/activitySettlementList/components/checkRewardDetail'
				),
		},
		{
			path: 'limitPriceList',
			name: 'limitPriceList',
			meta: {
				title: '限时/量降价',
				functionCode: ['secKillActivityQueryListInfo'],
			},
			component: () => import('@/pages/ym/limitPriceList/index'),
		},
		{
			path: 'limitPriceGoods/:secKillActivityId/:activityStatus/:activityType',
			name: 'limitPriceGoods',
			hidden: true,
			meta: {
				title: '活动商品',
				functionCode: ['secKillActivityGoodsQueryList'],
			},
			component: () => import('@/pages/ym/limitPriceGoods/index'),
		},
		{
			path: 'limitPriceGoodsImport/:secKillActivityId/:activityType',
			name: 'limitPriceGoodsImport',
			hidden: true,
			meta: {
				title: '导入添加活动商品',
				functionCode: ['secKillActivityGoodsImportInfo'],
			},
			component: () => import('@/pages/ym/limitPriceGoodsImport/index'),
		},
	],
}
export default ymRouter
