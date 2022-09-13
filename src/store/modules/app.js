/*
 * @Description: 应用相关信息-app状态机
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-07 10:15:57
 * @LastEditTime: 2022-03-25 15:35:17
 * @LastEditors: Please set LastEditors
 */
const app = {
	namespaced: true,
	storage: {
		cache: [],
		cookies: [],
		sessionStorages: ['constant'],
		localStorages: ['sidebar', 'systemInfo'],
	},
	state: {
		sidebar: {
			opened: true,
			withoutAnimation: false,
		},
		// 应用系统信息
		systemInfo: {},
		// 应用所使用的常量
		constant: {
			IMAGE_TYPE: {
				imageTypeOne: 1, // 商品图片类型
				imageTypeTwo: 2, // 客户仓库图片类型
				imageTypeThree: 3, // 规格图片类型
				imageTypeFour: 4, // 客户跟进图片类型
				imageTypeFive: 5, // 订单反馈图片类型
				imageTypeSix: 6, // 品牌Logo图片
				imageTypeSeven: 7, // 组织Logo图片
				imageTypeBanner: 11, // 广告图图片
				imageTypeCustomLogin: 12, // 自定义登录
				ImageTypeRichText: 18, // 富文本图片类型
				ImageIdCardFrontal: 19, // 法人身份证正面照
				ImageIdCardReverse: 20, // 法人身份证反面照
				ImageLincense: 21, // 营业执照
				ImageShopPortrait: 22, // 店铺头像
				ImageTypeScate: 24, // 分类图片
				ImageScreenshot: 25, // 小程序富文本图片
				ImageMarkIcon: 27, // 设置标志图片
				ImageTypeGroup: 28, // 设置分组图片
				imageTypeBrandQrcode: 31, // 品牌二维码广告图片
				ImageTypeBrandRichText: 32, // 品牌富文本图片类型
				imageTypeBrandCover: 33, // 品牌内购会封面图片
				imageTypeDialogSet: 34, // 弹窗活动图片
				imageTypeXCXSet: 35, // 小程序图片
				imageTypeUdesk: 36, // Udesk工单图片
				imageTypeSuggest: 37, // 品牌建议图片
				imageTypeActivityBanner: 38, // 活动Banner图片
				imageTypeActivityPoster: 39, // 活动海报素材图片
				imageTypePersonalPoster: 40, // 个人海报素材图片
				imageTypeActivityHelp: 41, // 活动教程素材图片
				imageTypeParent: 42, // 品牌父类图片
				imageTypeSupply: 43, // 商家商品图片
				imageTypeSupplyLicense: 44, // 商家企业营业执照
				imageTypeSupplyProof: 45, // 商家企业资质证明
				imageTypeSupplyAuth: 46, // 商家品牌授权书
				imageTypeSupplyReport: 47, // 商家商品检测报告
				imageTypeActBanner: 48, // 活动Banner
				imageTypeActDiscount: 49, // 营销活动
				imageTypeSchool: 50, // 商学院图片
				imageTypeSchoolBanner: 51, // 商学院Banner
				imageTypeDepartment: 52, // 部门图片
				imageTypeActBannerPage: 53, // banner预告图片
				imageTypeMaterial: 54, // 评价头像
				imageTypeActPromoters: 55, // 推手活动
				imageTypePopover: 56, // 小C弹窗
				imageTypeLivePage: 57, // 直播页面海报
				imageTypeLiveShare: 58, // 直播分享海报
				imageTypeLiveBanner: 59, // 直播领券海报
				imageTypeLiveCoupon: 60, // 直播优惠券海报
				imageTypeGroupCover: 61, // 分组封面
				imageTypeChannel: 62, // 渠道落地页海报
				imageTypeFunction: 63, // 功能区图片
				imageTypeClassify: 64, // 品牌分类图片
				imageTypeInForm: 65, // 消息推送图片
				imageTypeInFormRichText: 66, // 消息推送富文本图片
				imageTypeLiveShareImage: 67, // 直播分享图
				ImageTypeProblemRichText: 68, // 常见问题富文本图片
				imageTypeBrandBusiness: 69, // 会场营业执照
				imageTypeActRole: 71, // 互助计划活动图片
				imageTypeAct: 70, // 互助计划活动规则
			},
			//商家审核状态
			GOODS_STATUS: [
				{
					goodsStatus: '',
					value: '全部',
				},
				{
					goodsStatus: '2',
					value: '待审核',
				},
				{
					goodsStatus: '7',
					value: '待审核(商品基本信息审核通过)',
				},
			],
			//是或否
			YES_OR_NO: [
				{
					isAutoOrder: 0,
					value: '否',
				},
				{
					isAutoOrder: 1,
					value: '是',
				},
			],
			CHANNEL_lIST: [
				{
					name: '亿远UV_B',
				},
				{
					name: '百度搜索',
				},
				{
					name: '凌希2',
				},
				{
					name: '橙陨首购CPA',
				},
				{
					name: '繁笙首购CPA',
				},
				{
					name: '凌希首购CPA',
				},
				{
					name: '正西首购CPA',
				},
				{
					name: '宏创首购CPA',
				},
				{
					name: '小谷机器人公众号',
				},
				{
					name: '渠道示例',
				},
				{
					name: '西瓜皮公众号',
				},
				{
					name: '亿远UV_A',
				},
				{
					name: '百姓网wap_BD',
				},
				{
					name: '新先视CPS微信',
				},
				{
					name: '微信群',
				},
				{
					name: '朋友圈广告',
				},
				{
					name: 'TZ',
				},
				{
					name: '斗米兼职',
				},
				{
					name: 'JNY',
				},
				{
					name: 'mmg',
				},
				{
					name: 'ytt',
				},
				{
					name: '头条渠道',
				},
				{
					name: '孩教圈推广',
				},
				{
					name: '小程序引导页',
				},
				{
					name: '推广渠道',
				},
				{
					name: '渠道代理商',
				},
				{
					name: '腾讯广告推广',
				},
				{
					name: '邀请码注册',
				},
				{
					name: '未知',
				},
			],
			// 销售状态
			SALE_STATE: [
				{
					selfStatus: '0',
					value: '全部',
				},
				{
					selfStatus: '1',
					value: '在售',
				},
				{
					selfStatus: '2',
					value: '待售',
				},
			],
			// 平台订单- 品牌渠道
			CARETSORCE_TYPE: [
				{
					sourceType: '',
					value: '全部',
				},
				{
					sourceType: 1,
					value: 'AKC',
				},
				{
					sourceType: 2,
					value: 'HYK',
				},
				{
					sourceType: 3,
					value: 'BBC',
				},
				{
					sourceType: 4,
					value: 'WPC',
				},
			],
			// 爬取场次-类型
			TIMESEQUENCE_TYPE: [
				{
					timeSequence: '',
					value: '全部',
				},
				{
					timeSequence: 8,
					value: '8点',
				},
				{
					timeSequence: 12,
					value: '12点',
				},
				{
					timeSequence: 15,
					value: '15点',
				},
				{
					timeSequence: 17,
					value: '17点',
				},
				{
					timeSequence: 20,
					value: '20点',
				},
			],
			CRAWLING_STATE: [
				{
					brandState: 1,
					value: '同步商品中',
				},
				{
					brandState: 2,
					value: '同步图片中',
				},
				{
					brandState: 3,
					value: '同步库存中',
				},
				{
					brandState: 4,
					value: '已完成',
				},
			],
			SUPPLIER_LIST: [],
			// 脚本-平台账号
			EQUIPMENTCODE_STATE: [
				{
					equipmentCode: '',
					value: '全部',
				},
				{
					equipmentCode: 'mi-01',
					value: 'mi-01',
				},
				{
					equipmentCode: 'mi-02',
					value: 'mi-02',
				},
				{
					equipmentCode: 'mi-03',
					value: 'mi-03',
				},
				{
					equipmentCode: 'mi-04',
					value: 'mi-04',
				},
				{
					equipmentCode: 'mi-05',
					value: 'mi-05',
				},
				{
					equipmentCode: 'mi-06',
					value: 'mi-06',
				},
				{
					equipmentCode: 'mi-07',
					value: 'mi-07',
				},
				{
					equipmentCode: 'mi-08',
					value: 'mi-08',
				},
				{
					equipmentCode: 'mi-09',
					value: 'mi-09',
				},
			],
			// 脚本-平台账号-渠道
			SOURCETYPE_STATE: [
				{
					sourceType: 0,
					value: '全部',
				},
				{
					sourceType: 1,
					value: '爱库存',
				},
				{
					sourceType: 2,
					value: '好衣库',
				},
				{
					sourceType: 3,
					value: '宝贝仓',
				},
				{
					sourceType: 4,
					value: '唯品仓',
				},
				{
					sourceType: 6,
					value: '海带',
				},
				{
					sourceType: 11,
					value: '购拉拉',
				},
				{
					sourceType: 12,
					value: '超链',
				},
				{
					sourceType: 13,
					value: '贝仓',
				},
				{
					sourceType: 88,
					value: '优选',
				},
				{
					sourceType: 89,
					value: '代理',
				},
			],
			// 直播-直播计划列表-渠道
			SOURCE_NAME: [
				{
					sourceType: 1,
					value: 'AKC',
				},
				{
					sourceType: 2,
					value: 'HYK',
				},
				{
					sourceType: 3,
					value: 'BBC',
				},
				{
					sourceType: 4,
					value: 'WPC',
				},
				{
					sourceType: 5,
					value: '京东联盟',
				},
				{
					sourceType: 6,
					value: '海外购',
				},
				{
					sourceType: 7,
					value: '砍单活动',
				},
				{
					sourceType: 8,
					value: '奥买家',
				},
				{
					sourceType: 9,
					value: '自有品牌',
				},
				{
					sourceType: 10,
					value: '商家',
				},
				{
					sourceType: 11,
					value: '购拉拉',
				},
				{
					sourceType: 12,
					value: '超链',
				},
				{
					sourceType: 13,
					value: '自有品牌-海外',
				},
			],
			// 邀请码状态
			INVITATION_CODE_STATUS: [
				{
					status: '',
					value: '全部',
				},
				{
					status: 1,
					value: '待支付',
				},
				{
					status: 2,
					value: '未使用',
				},
				{
					status: 3,
					value: '已使用',
				},
				{
					status: 4,
					value: '其它',
				},
			],
			// 直播状态
			LIVE_STATUS: [
				{
					planStatus: '',
					value: '全部',
				},
				{
					planStatus: '0',
					value: '未开始',
				},
				{
					planStatus: '2',
					value: '进行中',
				},
				{
					planStatus: '1',
					value: '已结束',
				},
			],
			NEW_GUIDELINES_STATUS: [
				{
					state: '',
					value: '全部',
				},
				{
					state: 1,
					value: '启用',
				},
				{
					state: 0,
					value: '禁用',
				},
			],
			// 功能区状态
			IS_HIDE: [
				{
					state: 1,
					value: '是',
				},
				{
					state: 0,
					value: '否',
				},
			],
			// 验证码类型状态
			VERIFICATION_TYPE: [
				{
					state: 5,
					value: '微信注册',
				},
				{
					state: 6,
					value: '提现账号认证',
				},
				{
					state: 7,
					value: '忘记提现密码',
				},
			],
			// 验证码状态
			VERIFY_STATE: [
				{
					state: 1,
					value: '未验证',
				},
				{
					state: 2,
					value: '已验证',
				},
				{
					shelfState: '1',
					value: '下架',
				},
			],
			// 库存销售状态
			GOODS_STATE: [
				{
					shelfState: '',
					value: '全部',
				},
				{
					shelfState: 0,
					value: '禁用',
				},
				{
					shelfState: 1,
					value: '启用',
				},
			],
			// 切换权限状态选项
			TRUSTEESHIP_STATE_OPTION: [
				{
					trusteeshipState: '',
					value: '全部',
				},
				{
					trusteeshipState: 0,
					value: '禁用',
				},
				{
					trusteeshipState: 1,
					value: '启用',
				},
			],
			// 真实托管状态选项
			REAL_MANAGED_STATE: [
				{
					entranceState: '',
					value: '全部',
				},
				{
					entranceState: 0,
					value: '关闭',
				},
				{
					entranceState: 1,
					value: '开启',
				},
			],
			// 销售排序
			SORT_FIELD: [
				{
					sortField: 0,
					value: '全部',
				},
				{
					sortField: 1,
					value: '销售额⬇',
				},
				{
					sortField: 2,
					value: '销售额⬆',
				},
			],
			// 待审核店铺列表-审核状态
			SHOP_AUDIT_STATUS: [
				{
					organizationState: '',
					value: '全部',
				},
				{
					organizationState: 1,
					value: '待审核',
				},
				{
					organizationState: 2,
					value: '审核通过',
				},
				{
					organizationState: 3,
					value: '审核不通过',
				},
			],
			// 待审核店铺列表-等级
			SHOP_AUDIT_LEVEL_TYPE: [
				{
					levelType: '',
					value: '全部',
				},
				{
					levelType: 1,
					value: '服务商',
				},
				{
					levelType: 2,
					value: 'VIP店主',
				},
			],
			// 待审核店铺列表-审核方式
			SHOP_AUDIT_EXAMINE_TYPE: [
				{
					examineType: '',
					value: '全部',
				},
				{
					examineType: 1,
					value: '手动审核',
				},
				{
					examineType: 2,
					value: '人工审核',
				},
				{
					examineType: 3,
					value: '自动审核',
				},
			],
			// 待审核店铺列表-证书状态
			SHOP_AUDIT_RECEIPT_STATE: [
				{
					receiptState: '',
					value: '全部',
				},
				{
					receiptState: 0,
					value: '未填写',
				},
				{
					receiptState: 1,
					value: '未寄出',
				},
				{
					receiptState: 2,
					value: '已寄出',
				},
			],
			// 待审核店铺列表-导出表头
			EXPORT_MAILING_HEAD: [
				{
					key: 'organizationId',
					value: '店铺ID',
				},
				{
					key: 'userName',
					value: '用户昵称',
				},
				{
					key: 'organizationName',
					value: '店铺名称',
				},

				{
					key: 'receiptPhone',
					value: '手机号',
				},
				{
					key: 'addTime',
					value: '申请时间',
				},
				{
					key: 'fatherName',
					value: '上级',
				},
				{
					key: 'levelType',
					value: '等级',
				},
				{
					key: 'directCount',
					value: '直推人数',
				},
				{
					key: 'teamCount',
					value: '团队人数',
				},
				{
					key: 'indirectCount',
					value: '间推人数',
				},
				{
					key: 'directVipOrganizationCount',
					value: '直接VIP店主数',
				},
				{
					key: 'teamVipOrganizationCount',
					value: '团队VIP店主数',
				},
				{
					key: 'sumEarnAmount',
					value: '店铺累计可赚金',
				},
				{
					key: 'sumTeamAmount',
					value: '团队累积可赚金',
				},
				{
					key: 'accumulate5ToIndirectCount',
					value: '出5单直推店主数',
				},
				{
					key: 'auditStashName',
					value: '审核状态',
				},
				{
					key: 'operatorName',
					value: '操作人',
				},
				{
					key: 'auditMethodName',
					value: '审核方式',
				},
				{
					key: 'auditDate',
					value: '审核时间',
				},
				{
					key: 'certificateStashName',
					value: '证书状态',
				},
				{
					key: 'receiptUser',
					value: '收件人',
				},
				{
					key: 'receiptAddress',
					value: '收件地址',
				},
			],
			// 店铺状态
			SHOP_STATUS: [
				{
					organizationState: '',
					value: '全部',
				},
				{
					organizationState: '1',
					value: '正常',
				},
				{
					organizationState: '2',
					value: '禁用',
				},
			],
			// 店铺详情-间接开通情况类型
			PAY_TYPE: [
				{
					state: 1,
					value: '自己付费加入',
				},
				{
					state: 2,
					value: '付费',
				},
				{
					state: 3,
					value: '组织创建',
				},
				{
					state: 4,
					value: '系统生成',
				},
				{
					state: 5,
					value: '手动生成',
				},
				{
					state: 6,
					value: '渠道生成',
				},
			],
			// 直接邀请开通情况-使用状态
			EMPLOY_STATE: [
				{
					state: 2,
					value: '未使用',
				},
				{
					state: 3,
					value: '已使用',
				},
				{
					state: -1,
					value: '已过期',
				},
			],
			// 直接邀请开通情况-店铺等级
			LEVEL_TYPE: [
				{
					state: 0,
					value: '普通店主',
				},
				{
					state: 1,
					value: '服务商',
				},
				{
					state: 2,
					value: 'VIP店主',
				},
			],
			// 收款状态
			RECEIVE_STATE: [
				{
					state: 1,
					value: '待付款',
				},
				{
					state: 2,
					value: '付款中',
				},
				{
					state: 3,
					value: '已付款',
				},
			],
			// 标记状态
			HANDLE_TAG: [
				{
					state: 1,
					value: '待处理',
				},
				{
					state: 2,
					value: '系统处理',
				},
				{
					state: 3,
					value: '人工处理',
				},
			],
			// 销售订单统计-时间
			TYPE_TIME_ONE: [
				{
					timeSelect: '1',
					value: '今日',
				},
				{
					timeSelect: '2',
					value: '昨日',
				},
				{
					timeSelect: '3',
					value: '本周',
				},
				{
					timeSelect: '4',
					value: '上周',
				},
				{
					timeSelect: 5,
					value: '本月',
				},
			],
			// 销售订单统计-时间类型
			TYPE_TIME_TWO: [
				{
					type: '1',
					value: '按小时',
					disabled: false,
				},
				{
					type: '2',
					value: '按天',
					disabled: false,
				},
				{
					type: '3',
					value: '按周',
					disabled: true,
				},
				{
					type: '4',
					value: '按月',
					disabled: true,
				},
			],
			//店主身份
			ORGANIZATION_IDENTITY: [
				{
					organizationIdentity: '',
					value: '全部',
				},
				{
					organizationIdentity: '1',
					value: '上级店主',
				},
				// {
				// 	organizationIdentity: '2',
				// 	value: 'VIP店主',
				// },
				// {
				// 	organizationIdentity: '3',
				// 	value: '间接VIP',
				// },
				// {
				// 	organizationIdentity: '4',
				// 	value: '服务商',
				// },
				// {
				// 	organizationIdentity: '5',
				// 	value: '间接服务商',
				// },
			],
			//店等级
			SHOP_LEVEL: [
				{
					levelType: '',
					value: '全部',
				},
				{
					levelType: '0',
					value: '普通店主',
				},
				{
					levelType: '2',
					value: 'VIP店主',
				},
				{
					levelType: '1',
					value: '服务商',
				},
			],
			//渠道
			SHOP_CHANNEL_LIST: [
				{
					key: 1,
					channelList: '渠道服务商3',
				},
				{
					key: 2,
					channelList: '百度搜索',
				},
				{
					key: 3,
					channelList: '360搜索',
				},
				{
					key: 4,
					channelList: '凌希2',
				},
				{
					key: 5,
					channelList: '橙陨首购CPA',
				},
				{
					key: 6,
					channelList: '繁笙首购CPA',
				},
				{
					key: 7,
					channelList: '凌希首购CPA',
				},
				{
					key: 8,
					channelList: '正西首购CPA',
				},
				{
					key: 9,
					channelList: '宏创首购CPA',
				},
				{
					key: 10,
					channelList: '渠道示例',
				},
				{
					key: 11,
					channelList: '西瓜皮公众号',
				},
				{
					key: 12,
					channelList: '亿远UV_A',
				},
				{
					key: 13,
					channelList: '百姓网wap_BD',
				},
				{
					key: 14,
					channelList: '新先视CPS微信',
				},
				{
					key: 15,
					channelList: '微信群',
				},
				{
					key: 16,
					channelList: '朋友圈广告',
				},
				{
					key: 17,
					channelList: 'TZ',
				},
				{
					key: 18,
					channelList: '斗米兼职',
				},
				{
					key: 19,
					channelList: 'JNY',
				},
				{
					key: 20,
					channelList: 'mmg',
				},
				{
					key: 21,
					channelList: 'ytt',
				},
				{
					key: 22,
					channelList: '头条渠道',
				},
				{
					key: 23,
					channelList: '孩教圈推广',
				},
				{
					key: 24,
					channelList: '小程序引导页',
				},
				{
					key: 25,
					channelList: '推广渠道',
				},
				{
					key: 26,
					channelList: '渠道代理商',
				},
				{
					key: 27,
					channelList: '腾讯广告推广',
				},
				{
					key: 28,
					channelList: '邀请码注册',
				},
				{
					key: 29,
					channelList: '未知',
				},
				{
					key: 30,
					channelList: '淘客-黄蜂',
				},
				{
					key: 31,
					channelList: '淘客-野蛮',
				},
				{
					key: 32,
					channelList: '淘客-核桃',
				},
				{
					key: 33,
					channelList: '备用1',
				},
				{
					key: 34,
					channelList: '备用2',
				},
				{
					key: 35,
					channelList: '备用3',
				},
				{
					key: 36,
					channelList: '备用4',
				},
				{
					key: 37,
					channelList: '备用5',
				},
				{
					key: 38,
					channelList: '备用6',
				},
				{
					key: 39,
					channelList: '备用7',
				},
				{
					key: 40,
					channelList: '备用8',
				},
				{
					key: 41,
					channelList: '备用9',
				},
				{
					key: 42,
					channelList: '备用10',
				},
			],
			// 余额类型
			BALANCE_TYPE: {
				0: '全部',
				1: '余额冲账',
				2: '可赚金',
				3: '推广分成',
				4: '提现成功',
				5: '提现失败',
				6: '发起提现',
				8: '邀请返佣',
				12: '余额退款',
				24: '砍价返佣',
				26: '京东可赚金',
				28: '京东分销分佣',
				30: '平台奖励',
				31: '订单补款',
				32: '首单奖励',
				33: '余额冲账-权益卡',
			},
			// 二级分佣
			SECOND_BALANCE_TYPE: {
				1: '分销分佣(一级)',
				2: '分销分佣(二级',
				3: '分销分佣(三级)',
				4: '分销分佣(四级)',
			},
			// 店铺详情-订单类型
			ORDER_TYPE: {
				0: '上游开单',
				1: '小B下单',
				3: 'C端下单',
				4: 'B端下单',
				5: '京东下单',
				6: '砍单专区下单',
			},
			// 店铺详情-订单类型标签颜色
			ORDER_TAG_TYPE: {
				0: 'success',
				1: 'danger',
				3: 'success',
				4: '',
				5: 'warning',
				6: 'warning',
			},
			// 店铺详情-收款状态标签颜色
			RECEIVE_STATE_TAG: {
				1: 'danger',
				2: 'warning',
				3: 'success',
			},
			// 店铺详情-审核状态标签颜色
			ORDER_STATE_TAG: {
				待审核: 'warning',
				审核通过: 'success',
				审核不通过: 'danger',
				其他: '',
			},
			// 店铺详情-渠道
			SOURCE_TYPE: {
				1: 'AKC',
				2: 'HYK',
				3: 'BBC',
				4: 'WPC',
				5: '京东联盟',
				6: '海外购',
				7: '砍单活动',
				8: '奥买家',
				9: '自有品牌',
				10: '商家',
				11: '购拉拉',
				12: '超链',
				13: '自有品牌-海外',
			},
			// 店铺详情-订单发货状态
			DELIVER_STATE: [
				{
					state: 1,
					value: '待发货(未拣货)',
				},
				{
					state: 2,
					value: '待发货(已拣货)',
				},
				{
					state: 3,
					value: '已发货(部分商品发货)',
				},
				{
					state: 4,
					value: '已发货(全部商品发货)',
				},
				{
					state: 5,
					value: '已确认收货',
				},
			],
			// 店铺详情-订单发货状态标签
			DELIVER_STATE_TAG: {
				1: 'danger',
				2: '',
				3: 'success',
				4: 'success',
				5: 'success',
			},
			// 店铺详情-订单状态标签
			ORDER_STATE_TAG_MAP: {
				待付款: 'danger',
				正在抢购: 'danger',
				其他: 'info',
				等待分拣: 'danger',
				发货中: '',
				等待签收: '',
				已完成: 'success',
				已退款: 'success',
				抢购失败: 'success',
			},
			// 店铺详情-直接邀请开通情况-类型
			DIRECT_PAY_STATE: [
				{
					payType: '0',
					value: '全部',
				},
				{
					payType: '2',
					value: '付费',
				},
				{
					payType: '4',
					value: '系统生成',
				},
				{
					payType: '5',
					value: '手动生成',
				},
				{
					payType: '6',
					value: '渠道生成',
				},
				{
					payType: '7',
					value: '活动奖励',
				},
				{
					payType: '8',
					value: '活动兑换',
				},
			],
			// 店铺详情-间接邀请开通情况-类型
			INDIRECT_PAY_STATE: [
				{
					payType: '0',
					value: '全部',
				},
				{
					payType: '2',
					value: '付费',
				},
				{
					payType: '5',
					value: '手动生成',
				},
				{
					payType: '6',
					value: '渠道生成',
				},
			],
			// 店铺详情-间接邀请开通情况-店铺等级
			LEVEL_SELECT: [
				{
					levelId: '-1',
					value: '全部',
				},
				{
					levelId: '0',
					value: '普通店主',
				},
				{
					levelId: '4',
					value: '服务商',
				},
				{
					levelId: '3',
					value: 'VIP店主',
				},
			],
			// 店铺详情-邀请开通情况-状态
			INDIRECT_STATE: [
				{
					status: '0',
					value: '全部',
				},
				{
					status: '2',
					value: '未使用',
				},
				{
					status: '3',
					value: '已使用',
				},
				{
					status: '',
					value: '已过期',
				},
			],
			// APP-社群销售统计-群组类型
			GROUP_TYPE: {
				全部: '',
				实习店主: 1,
				正式店主: 2,
				进阶店主: 3,
				优秀店主: 4,
				副本群: 5,
				vip店主团队群: 6,
				服务商团队群: 7,
			},
			// APP-社群中心-群组类型
			ADD_GROUP_TYPE: {
				全部: '',
				实习店主: 1,
				正式店主: 2,
				进阶店主: 3,
				优秀店主: 4,
				副本群: 5,
			},
			// APP:店主销售详情时间选择
			SALE_TIME_SELECTION: [
				{
					status: '0',
					value: '昨日',
				},
				{
					status: '2',
					value: '近三日(昨日,前日,大前日)',
				},
				{
					status: '3',
					value: '本周',
				},
				{
					status: '4',
					value: '上周',
				},
				{
					status: '5',
					value: '本月',
				},
				{
					status: '6',
					value: '上月',
				},
			],
			// APP:素材群对谁可见
			TARGER_TYPE: [
				{
					targetType: '',
					value: '全部',
				},
				{
					targetType: '3',
					value: '单个店主',
				},
				{
					targetType: '2',
					value: '部分店主',
				},
				{
					targetType: '1',
					value: '全部店主',
				},
			],
			// APP:消息中心发送状态
			SENDOUT_TYPE: [
				{
					sendState: '',
					value: '全部',
				},
				{
					sendState: '0',
					value: '未发送',
				},
				{
					sendState: '2',
					value: '发送中',
				},
				{
					sendState: '1',
					value: '已发送',
				},
			],
			// 鲁班通用跳转类型
			ATTRMAP: [
				{
					skipType: '',
					value: '不跳',
				},
				{
					skipType: '2',
					value: '领券中心',
				},
				{
					skipType: '3',
					value: '商品详情页',
				},
				{
					skipType: '4',
					value: '品牌特卖页',
				},
				{
					skipType: '5',
					value: '小程序/APP',
				},
				{
					skipType: '6',
					value: 'H5页面',
				},
				{
					skipType: '7',
					value: '多件促销',
				},
				{
					skipType: '8',
					value: '满折满减/营销活动',
				},
				{
					skipType: '9',
					value: '活动专区',
				},
				{
					skipType: '17',
					value: '活动页',
				},
				{
					skipType: '18',
					value: '切换首页',
				},
			],
			// APP:素材上下架
			MATERIAL_ENABLE: [
				{
					enable: '',
					value: '全部',
				},
				{
					enable: '1',
					value: '上架',
				},
				{
					enable: '2',
					value: '下架',
				},
				{
					enable: '3',
					value: '正在上架',
				},
			],
			// APP:素材内容类型
			MATERIAL_TYPE: [
				{
					type: '',
					value: '全部',
				},
				{
					type: '1',
					value: '发文字和表情',
				},
				{
					type: '2',
					value: '发图片',
				},
				{
					type: '3',
					value: '发优口令',
				},
			],
			// APP:首单专区分组状态
			FIRST_ORDER_STATUS: [
				{
					status: '1',
					value: '全部',
				},
				{
					status: '2',
					value: '未开始',
				},
				{
					status: '3',
					value: '进行中',
				},
				{
					status: '4',
					value: '已结束',
				},
			],
			//APP_BANNER跳转类型
			APP_BANNER_JUMPTYPE: [
				{
					jumpType: 0,
					value: '不跳',
				},
				{
					jumpType: 1,
					value: '跳转至H5',
				},
			],
			//分组状态
			GOODS_GROUP_STATE: [
				{
					goodsGroupState: 1,
					value: '进行中',
				},
				{
					goodsGroupState: 2,
					value: '未开始',
				},
				{
					goodsGroupState: 3,
					value: '已结束',
				},
			],
			// 财务-店主提现明细列表-提现状态
			WITHDRAW_STATUS: {
				全部: 0,
				提现中: 1,
				提现成功: 2,
				提现失败: 3,
				'T+1提现中': 4,
				等待回调中: 5,
				提现审核中: 7,
			},
			// 财务-店主提现明细列表-提现类型
			WITHDRAW_TYPE: {
				全部: '',
				店主提现: 1,
				vip店主提现: 2,
				服务商提现: 3,
			},
			// 财务-店主提现明细列表-提现通道
			WITHDRAW_CHANNEL: {
				全部: '',
				YJB: 1,
				HJ: 2,
				YL: 4,
				YB: 3,
				WGZF: 5,
				XZB: 6,
				SN: 7,
				其他: 0,
			},
			// 商品状态
			GOODS_TYPE: [
				{
					shelfState: '',
					value: '全部',
				},
				{
					shelfState: '2',
					value: '上架',
				},
				{
					shelfState: '1',
					value: '下架',
				},
			],
			// 商品排序sort
			GOODS_SORT: [
				{
					sortField: '1',
					value: '上架时间 ↓',
				},
				{
					sortField: '2',
					value: '上架时间 ↑',
				},
				{
					sortField: '3',
					value: '排序值 ↓',
				},
				{
					sortField: '4',
					value: '排序值 ↑',
				},
				{
					sortField: '5',
					value: '结算价 ↓',
				},
				{
					sortField: '6',
					value: '结算价 ↑',
				},
				{
					sortField: '7',
					value: '库存 ↓',
				},
				{
					sortField: '8',
					value: '库存 ↑',
				},
				{
					sortField: '9',
					value: '供货价 ↓',
				},
				{
					sortField: '10',
					value: '供货价 ↑',
				},
				{
					sortField: '11',
					value: '建议零售价 ↓',
				},
				{
					sortField: '12',
					value: '建议零售价 ↑',
				},
				{
					sortField: '13',
					value: '市场价 ↓',
				},
				{
					sortField: '14',
					value: '市场价 ↑',
				},
				{
					sortField: '15',
					value: '利润率（平台） ↓',
				},
				{
					sortField: '16',
					value: '利润率（平台） ↑',
				},
				{
					sortField: '17',
					value: '利润率（店主） ↓',
				},
				{
					sortField: '18',
					value: '利润率（店主） ↑',
				},
			],
			// 商家确认收款信息状态
			PAYMENT_INFORMATION: [
				{
					accountInfoConfirm: 0,
					value: '待确认',
				},
				{
					accountInfoConfirm: 1,
					value: '已确认',
				},
			],
			// 店铺详情状态
			ORGANIZATION_STATUS: [
				{
					state: 1,
					value: '启用',
				},
				{
					state: 2,
					value: '禁用',
				},
			],
			// 资金转账状态
			TRANSFER_STATUS: [
				{
					status: '',
					value: '全部',
				},
				{
					status: 1,
					value: '转账中',
				},
				{
					status: 3,
					value: '转账成功',
				},
				{
					status: 2,
					value: '转账失败',
				},
			],
			// 资金转账状态
			TRANSFER_STATE: [
				{
					transferStatus: '',
					value: '全部',
				},
				{
					transferStatus: 1,
					value: '待转账',
				},
				{
					transferStatus: 2,
					value: '转账中',
				},
				{
					transferStatus: 3,
					value: '转账成功',
				},
				{
					transferStatus: 4,
					value: '转账失败',
				},
			],
			// 处理状态
			PROCESS_STATE: [
				{
					processState: '',
					value: '全部',
				},
				{
					processState: 1,
					value: '待商家处理',
				},
				{
					processState: 2,
					value: '待平台处理',
				},
				{
					processState: 3,
					value: '已完成',
				},
				{
					processState: 4,
					value: '已关闭',
				},
			],
			// 资金转账审核状态
			APPROVAL_STATUS: [
				{
					approvalStatus: '',
					value: '全部',
				},
				{
					approvalStatus: 1,
					value: '待审核',
				},
				{
					approvalStatus: 2,
					value: '审核通过',
				},
				{
					approvalStatus: 3,
					value: '审核不通过',
				},
			],
			TRANSFER_IN_ACC_TYPE: [
				{
					transferInAccType: 1,
					value: '微革账户',
				},
				{
					transferInAccType: 2,
					value: '商家账户',
				},
				{
					transferInAccType: 3,
					value: '店主账户',
				},
				{
					transferInAccType: 4,
					value: '营销账户',
				},
			],
			// 资金转账类型
			TRANSFER_TYPE: [
				{
					type: '',
					value: '全部',
				},
				{
					type: 1,
					value: '订单分账',
				},
				{
					type: 2,
					value: '订单补差',
				},
				// {
				// 	type: 3,
				// 	value: '账户转账',
				// },
			],
			// 资金借出状态
			LENDING_STATUS: [
				{
					status: 0,
					value: '全部',
				},
				{
					status: 1,
					value: '借出中',
				},
				{
					status: 2,
					value: '借支失败',
				},
				{
					status: 3,
					value: '借支成功，退款中',
				},
				{
					status: 4,
					value: '归还完成',
				},
				{
					status: 5,
					value: '待偿还（退款完结）',
				},
			],
			// 资金到账方式
			HOW_TO_ARRIVE: [
				{
					type: 2,
					value: '实时到账',
				},
				{
					type: 1,
					value: 'T+1到账',
				},
			],
			// 资金-商家账户列表-账户状态
			MERCHANT_ACCOUNT_STATUS: [
				{
					status: '',
					value: '全部',
				},
				{
					status: 0,
					value: '冻结',
				},
				{
					status: 1,
					value: '正常',
				},
			],
			// 资金-商家账户列表-资金系统开关
			FUNDINF_SYSTEM: [
				{
					switchStatus: '',
					value: '全部',
				},
				{
					switchStatus: 0,
					value: '关闭',
				},
				{
					switchStatus: 1,
					value: '开启',
				},
			],
			// 资金-商家账户列表-收付通开户开关
			SWITCH_THROUGH_PAYMENT: [
				{
					sftChannelSwitch: 0,
					value: '关闭',
				},
				{
					sftChannelSwitch: 1,
					value: '开启',
				},
			],
			// 资金提现账户类型
			ACCOUNT_TYPE: [
				{
					type: 11,
					value: '微革账户',
				},
				{
					type: 13,
					value: '微革营销账户',
				},
				{
					type: 14,
					value: '推广账户',
				},
			],
			// 资金偿还状态
			REPAY_STATUS: [
				{
					status: 1,
					value: '偿还中',
				},
				{
					status: 2,
					value: '偿还失败',
				},
				{
					status: 3,
					value: '偿还成功',
				},
			],
			// 商家账户详情余额变动表-备注
			ACCOUNT_DETAILS_WATER_TYPE: [
				{
					waterType: '',
					value: '全部',
				},
				{
					waterType: 1,
					value: '订单结算',
				},
				{
					waterType: 2,
					value: '订单补偿',
				},
				{
					waterType: 3,
					value: '订单收款',
				},
				{
					waterType: 4,
					value: '订单退款',
				},
				{
					waterType: 5,
					value: '平台服务费',
				},
				{
					waterType: 6,
					value: '推广费',
				},
				{
					waterType: 7,
					value: '平台补贴',
				},
				{
					waterType: 8,
					value: '备用金借支',
				},
				{
					waterType: 10,
					value: '提现成功',
				},
				{
					waterType: 11,
					value: '平台优惠补贴',
				},
				{
					waterType: 12,
					value: '罚款扣减',
				},
				{
					waterType: 13,
					value: '补款扣减',
				},
				{
					waterType: 14,
					value: '运费结算',
				},
				{
					waterType: 15,
					value: '其他扣款',
				},
				{
					waterType: 16,
					value: '商家违规扣款',
				},
				{
					waterType: 17,
					value: '账户转账',
				},
				{
					waterType: 18,
					value: '小额打款扣款',
				},
			],
			// 账户余额类型
			ACCOUNT_BALANCE_TYPE: [
				{
					balanceType: 1,
					value: '可用余额账户',
				},
				{
					balanceType: 2,
					value: '待结算账户',
				},
			],
			// 平台账户详情业务(流水)类型
			BUSINESS_TYPE_PLATFORM_ACCOUNT: [
				{
					status: 1,
					value: '订单',
				},
				{
					status: 2,
					value: '业务',
				},
				{
					status: 3,
					value: '提现',
				},
				{
					status: 4,
					value: '充值',
				},
			],
			// 平台账户详情备注类型
			WATER_TYPE_PLATFORM_ACCOUNT_DETAILS: [
				{
					waterType: null,
					value: '全部',
				},
				{
					waterType: 1,
					value: '平台服务费',
				},
				{
					waterType: 2,
					value: '权益保障费用',
				},
				{
					waterType: 3,
					value: '备用金',
				},
				{
					waterType: 4,
					value: '提现成功',
				},
				{
					waterType: 5,
					value: '个人所得税',
				},
				{
					waterType: 6,
					value: '账户转账',
				},
				{
					waterType: 7,
					value: '罚款扣回',
				},
				{
					waterType: 8,
					value: '补款扣回',
				},
				{
					waterType: 9,
					value: '其他款项扣回',
				},
				{
					waterType: 10,
					value: '商家违规扣回',
				},
				{
					waterType: 11,
					value: '账户转账',
				},
				{
					waterType: 12,
					value: '小额打款扣回',
				},
			],
			// 营销账户详情备注类型
			WATER_TYPE_PLATFORM_MARKETING_ACCOUNT_DETAILS: [
				{
					waterType: null,
					value: '全部',
				},
				{
					waterType: 1,
					value: '平台优惠补贴',
				},
				{
					waterType: 2,
					value: '备用金',
				},
				{
					waterType: 3,
					value: '提现成功',
				},
				{
					waterType: 4,
					value: '充值成功',
				},
				{
					waterType: 6,
					value: '账户转账',
				},
				{
					waterType: 7,
					value: '调账(增)',
				},
				{
					waterType: 8,
					value: '调账(减)',
				},
				{
					waterType: 9,
					value: '活动订单销售提成结算',
				},
				{
					waterType: 10,
					value: '活动订单权益奖结算',
				},
				{
					waterType: 11,
					value: '活动奖励金',
				},
			],
			// 店主账户详情备注类型
			WATER_TYPE_ORGANIZATION_ACCOUNT_DETAILS: [
				{
					waterType: null,
					value: '全部',
				},
				{
					waterType: 1,
					value: '可赚金结算',
				},
				{
					waterType: 2,
					value: '余额下单',
				},
				{
					waterType: 3,
					value: '余额退款',
				},
				{
					waterType: 4,
					value: '备用金',
				},
				{
					waterType: 5,
					value: '提现成功',
				},
				{
					waterType: 6,
					value: '个人所得税',
				},
				{
					waterType: 7,
					value: '可赚金结算',
				},
				{
					waterType: 8,
					value: '账户转账',
				},
				{
					waterType: 9,
					value: '活动奖励',
				},
				{
					waterType: 11,
					value: '余额充值',
				},
				{
					waterType: 10,
					value: '结算[月度收益]',
				},
				{
					waterType: 12,
					value: '调账[月度收益]',
				},
				{
					waterType: 13,
					value: '卖货佣金',
				},
				{
					waterType: 14,
					value: '好友奖励',
				},
				{
					waterType: 15,
					value: '活动订单卖货佣金',
				},
				{
					waterType: 16,
					value: '活动订单好友奖励',
				},
				{
					waterType: 17,
					value: '活动奖励金',
				},
				{
					waterType: 18,
					value: '余额扣回',
				},
			],
			// 运营账户详情备注类型
			WATER_TYPE_OPERATION_ACCOUNT_DETAIL: [
				{
					waterType: null,
					value: '全部',
				},
				{
					waterType: 1,
					value: '罚款扣回',
				},
				{
					waterType: 2,
					value: '补款扣回',
				},
				{
					waterType: 3,
					value: '其他款项扣回',
				},
				{
					waterType: 4,
					value: '商家违规扣回',
				},
				{
					waterType: 5,
					value: '小额打款扣回',
				},
				{
					waterType: 6,
					value: '营销活动扣回',
				},
				{
					waterType: 7,
					value: '店主余额扣回',
				},
			],
			// 资金提现状态
			COMMON_WITHDRAW_STATUS: [
				{
					status: '',
					value: '全部',
				},
				{
					status: 1,
					value: '提现中',
				},
				{
					status: 2,
					value: '提现成功',
				},
				{
					status: 3,
					value: '提现失败',
				},
				{
					status: 4,
					value: 'T+1提现中',
				},
				{
					status: 5,
					value: '已发起提现待回调',
				},
				{
					status: 6,
					value: '异常',
				},
			],
			// 资金借支列表类型
			BORROWER_TYPE: [
				{
					borrowerType: '',
					value: '全部',
				},
				{
					borrowerType: 1,
					value: '商家账户',
				},
				{
					borrowerType: 2,
					value: '店主账户',
				},
			],
			// 订单流水业务-账户类型
			ORDER_FLOW_SERVICE: [
				{
					accountType: 1,
					value: '商家账户',
				},
				{
					accountType: 2,
					value: '店主账户',
				},
				{
					accountType: 3,
					value: '平台账户',
				},
			],
			// 支付渠道
			CHANNEL_DISBURSEMENT: [
				{
					payChannel: 1,
					value: '汇聚',
				},
				{
					payChannel: 2,
					value: '收付通',
				},
			],
			// 订单结算明细-账户类型,
			ORDER_SETTLEMENT_ACCOUNT_TYPE: [
				{
					accountType: 1,
					value: '商家账户',
				},
				{
					accountType: 2,
					value: '店主账户',
				},
				{
					accountType: 3,
					value: '基本账户',
				},
				{
					accountType: 4,
					value: '营销账户',
				},
				{
					accountType: 5,
					value: '联盟账户',
				},
			],
			// 订单转账业务-业务类型
			REFIND_BUSINESS_TYPE: [
				{
					status: 1,
					value: '发起中',
				},
				{
					status: 2,
					value: '退款失败',
				},
				{
					status: 3,
					value: '退款成功',
				},
			],
			// 流水记录列表业务类型
			FLOWORDER_BUSINESS_TYPE: [
				{
					itemType: 1,
					value: '订单',
				},
				{
					itemType: 2,
					value: '邀请码',
				},
				{
					itemType: 3,
					value: '提现',
				},
				{
					itemType: 4,
					value: '平台返佣',
				},
				{
					itemType: 5,
					value: '业务充值',
				},
				{
					itemType: 6,
					value: '店主营销费用',
				},
			],
			// 流水记录列表流水类型
			FLOWORDER_TYPE: [
				{
					flowType: 0,
					value: '全部',
				},
				{
					flowType: 1,
					value: '订单付款',
				},
				{
					flowType: 2,
					value: '余额冲账',
				},
				{
					flowType: 3,
					value: '邮费流水',
				},
				{
					flowType: 4,
					value: '优惠券流水',
				},
				{
					flowType: 5,
					value: '手续费',
				},
				{
					flowType: 6,
					value: '订单成本',
				},
				{
					flowType: 6,
					value: '订单成本',
				},
				{
					flowType: 7,
					value: '佣金',
				},
				{
					flowType: 8,
					value: '服务奖励',
				},
				{
					flowType: 9,
					value: '营销费用',
				},
				{
					flowType: 10,
					value: '盈利结算',
				},
				{
					flowType: 11,
					value: '邮费退款',
				},
				{
					flowType: 12,
					value: '订单退款',
				},
				{
					flowType: 13,
					value: '订单补款',
				},
				{
					flowType: 14,
					value: '运营奖励',
				},
				{
					flowType: 16,
					value: '平台保障费',
				},
				{
					flowType: 17,
					value: '保障核销',
				},
				{
					flowType: 18,
					value: '用户购买保障费',
				},
				{
					flowType: 20,
					value: '推广服务费',
				},
			],
			// 流水记录列表流水出入
			FLOWORDER_ORIEMTATOIN: [
				{
					orientation: 0,
					value: '全部',
				},
				{
					orientation: 1,
					value: '进',
				},
				{
					orientation: 2,
					value: '出',
				},
			],
			FLOWORDER_GROUP: [
				{
					groupId: 2,
					value: '云货优选',
				},
				{
					groupId: 7,
					value: '古岭优选',
				},
				{
					groupId: 8,
					value: '袋鼠之选',
				},
				{
					groupId: 10,
					value: '焦点生活',
				},
			],
			BOOKING_TYPE: [
				{
					flowType: 1,
					value: '拼团订单金额',
				},
				{
					flowType: 2,
					value: '拼团店主余额',
				},
				{
					flowType: 3,
					value: '拼团订单成功',
				},
				{
					flowType: 4,
					value: '拼团订单失败',
				},
			],
			// 平台提现明细列表-类型
			WITHDRAW_PAY_TYPE: [
				{
					withdrawType: 0,
					value: '全部',
				},
				{
					withdrawType: 1,
					value: '返退提现',
				},
				{
					withdrawType: 2,
					value: '商家成本提现',
				},
				{
					withdrawType: 3,
					value: '盈利提现',
				},
				{
					withdrawType: 7,
					value: '营销提现',
				},
				{
					withdrawType: 9,
					value: '微革待收提现',
				},
				{
					withdrawType: 10,
					value: '档期商家提现',
				},
			],
			// 平台提现明细列表-状态
			WITHDRAW_PAY_STATUS: [
				{
					status: 0,
					value: '全部',
				},
				{
					status: 1,
					value: '提现中',
				},
				{
					status: 2,
					value: '提现成功',
				},
				{
					status: 3,
					value: '提现失败',
				},
				{
					status: 4,
					value: 'T+1提现中',
				},
			],
			// 银行卡记录-记录类型
			BANK_CARD_RECORD_TYPE: [
				{
					recordType: 0,
					value: '全部',
				},
				{
					recordType: 1,
					value: '第三方充值',
				},
				{
					recordType: 2,
					value: '银行卡提现',
				},
			],
			// 银行卡记录-渠道
			BANK_CARD_RECHARGE_TYPE: [
				{
					rechargeType: '',
					value: '全部',
				},
				{
					rechargeType: 1,
					value: '支付宝',
				},
				{
					rechargeType: 2,
					value: '微信',
				},
			],
			// 运费模板审核状态
			EXPRESS_TEMP_AUDIT_STATUS: [
				{
					auditStatus: 1,
					value: '待提交',
				},
				{
					auditStatus: 2,
					value: '已提交',
				},
				{
					auditStatus: 3,
					value: '审核通过',
				},
				{
					auditStatus: 4,
					value: '驳回',
				},
			],
			// 充值明细记录-转账账户
			RECHARGE_ACCOUNT_TYPE: [
				{
					type: 0,
					value: '全部',
				},
				{
					type: 1,
					value: '流水账号',
				},
				{
					type: 2,
					value: '成本账号',
				},
				{
					type: 3,
					value: '盈利账号',
				},
				{
					type: 4,
					value: '返退账号',
				},
			],
			// 明细统计-提现类型
			FINANCE_DETAILS_WITHDRAW_TYPE: [
				{
					withdrawType: 1,
					value: '返退账号提现',
				},
				{
					withdrawType: 2,
					value: '成本账号提现',
				},
				{
					withdrawType: 3,
					value: '盈利账号提现',
				},
				{
					withdrawType: 7,
					value: '营销账号提现',
				},
				{
					withdrawType: 8,
					value: '权益保障费用账号提现',
				},
				{
					withdrawType: 9,
					value: '微革待收帐户',
				},
			],
			// 明细统计-到账方式
			ARRIVAL_TYPE: [
				{
					arrivalType: 0,
					value: '普通提现(T+1日)',
				},
				{
					arrivalType: 1,
					value: '快速提现(马上到账)',
				},
			],
			// 客服托管操作记录-状态
			OPERATING_RECORD_STATUS: [
				{
					item: 1,
					value: '开启店铺托管',
				},
				{
					item: 2,
					value: '关闭店铺托管',
				},
				{
					item: 3,
					value: '导入',
				},
				{
					item: 4,
					value: '启用',
				},
				{
					item: 5,
					value: '禁用',
				},
			],
			//商品比价商品状态
			COMPARISON_GOOD_STATUS: [
				{
					shelfState: 0,
					value: '全部',
				},
				{
					shelfState: 2,
					value: '上架',
				},
				{
					shelfState: 1,
					value: '下架',
				},
			],
			//商品比价销售状态
			COMPARISON_SALE_STATUS: [
				{
					isSales: 0,
					value: '全部',
				},
				{
					isSales: 1,
					value: '待售',
				},
				{
					isSales: 2,
					value: '在售',
				},
			],
			//商品比价售价走势
			COMPARISON_PRICE_TREND_STATUS: [
				{
					priceTrend: 0,
					value: '全部',
				},
				{
					priceTrend: 1,
					value: '价格上升',
				},
				{
					priceTrend: 2,
					value: '价格平稳',
				},
				{
					priceTrend: 2,
					value: '价格下降',
				},
			],
			//商家提现审批状态
			MERCHANT_WITHDRAW_AUDIT_STATUS: [
				{
					status: '',
					value: '全部',
				},
				{
					status: 1,
					value: '待审批',
				},
				{
					status: 2,
					value: '审批不通过',
				},
				{
					status: 3,
					value: '审批通过',
				},
			],

			//文件导入状态
			FILE_IMPORT_STATUS: [
				{
					importStatus: '',
					value: '全部',
				},
				{
					importStatus: 0,
					value: '导入中',
				},
				{
					importStatus: 1,
					value: '导入成功',
				},
				{
					importStatus: 2,
					value: '导入失败',
				},
			],
			//扣款类型
			WITHHOLD_TYPE: [
				{
					deductType: '',
					value: '全部',
				},
				{
					deductType: 1,
					value: '罚款',
				},
				{
					deductType: 2,
					value: '补款',
				},
				{
					deductType: 3,
					value: '其他',
				},
				{
					deductType: 4,
					value: '商家违规扣款',
				},
				{
					deductType: 5,
					value: '小额扣款',
				},
				{
					deductType: 6,
					value: '营销活动结算',
				},
			],
			//扣款类型
			WITHHOLD_STATUS: [
				{
					verifyState: '',
					value: '全部',
				},
				{
					verifyState: 1,
					value: '待确认',
				},
				{
					verifyState: 2,
					value: '已确认',
				},
				{
					verifyState: 3,
					value: '已拒绝',
				},
				{
					verifyState: 4,
					value: '待二次确认',
				},
				{
					verifyState: 5,
					value: '二次拒绝',
				},
			],
			//商家结算,结算状态
			SETTLE_STATUS_SUPPLIER: [
				{
					settleStatus: '',
					value: '全部',
				},
				{
					settleStatus: 0,
					value: '已关闭',
				},
				{
					settleStatus: 1,
					value: '未结算',
				},
				{
					settleStatus: 2,
					value: '已结算',
				},
				{
					settleStatus: 3,
					value: '结算中',
				},
			],
			//结算单类型
			SETTLE_STATUS_SETTLE_TYPE: [
				{
					settleType: 0,
					value: '全部',
				},
				{
					settleType: 1,
					value: '订单结算',
				},
				{
					settleType: 2,
					value: '运费结算',
				},
			],
			//商家结算规则配置，状态
			RULE_ORDER_STATE: [
				{
					value: 1,
					label: 'L1：订单全部发货',
				},
				{
					value: 2,
					label: 'L2：物流已签收',
				},
				{
					value: 3,
					label: 'L3：确认收货',
				},
			],
			//商品类目属性管理属性状态  0-删除，1-正常，2-禁用
			CATEGORY_ATTRIBUTE_ATTRIBUTE_STATE: [
				{
					attributeState: null,
					value: '全部',
				},
				// {
				// 	attributeState: 0,
				// 	value: '删除',
				// },
				{
					attributeState: 1,
					value: '正常',
				},
				{
					attributeState: 2,
					value: '禁用',
				},
			],
			//商品类目属性管理是否必填  0-否，1-是
			CATEGORY_ATTRIBUTE_REQUIRED_TYPE: [
				{
					requiredType: 1,
					value: '是',
				},
				{
					requiredType: 0,
					value: '否',
				},
			],
			//商品类目属性管理是否多选  0-否，1-是
			CATEGORY_ATTRIBUTE_MULTIPLE_TYPE: [
				{
					multipleType: 1,
					value: '是',
				},
				{
					multipleType: 0,
					value: '否',
				},
			],
			//商品类目属性管理级别  级别(1：一级，2：二级，3：三级)
			CATEGORY_ATTRIBUTE_GOODS_CATEGORY_LEVEL: [
				{
					goodsCategoryLevel: 1,
					value: '一级',
				},
				{
					goodsCategoryLevel: 2,
					value: '二级',
				},
				{
					goodsCategoryLevel: 3,
					value: '三级',
				},
			],
			// 绑定七鱼账户ID状态
			SEVEN_FISH_ACCOUNT: [
				{
					supplierStatus: 0,
					value: '全部',
				},
				{
					supplierStatus: 1,
					value: '启用',
				},
				{
					supplierStatus: 2,
					value: '禁用',
				},
			],
			// 活动奖励规则-完成指标
			FINISH_TYPE: [
				{
					value: 1,
					label: '出单商品数量',
				},
			],
			// 活动奖励规则-目标类型
			TARGE_TYPE: [
				{
					value: 1,
					label: '商品',
				},
				{
					value: 3,
					label: '品牌',
				},
			],
			// 领券中心优惠券状态
			COUPON_CENTER_STATUS: [
				{
					status: '',
					value: '全部',
				},
				{
					status: '1',
					value: '未开始',
				},
				{
					status: '2',
					value: '进行中',
				},
				{
					status: '3',
					value: '已结束',
				},
			],
			// 拼团活动状态
			GROUP_ACTIVITIES_STATUS: [
				{
					activityStatus: '',
					value: '全部',
				},
				{
					activityStatus: '1',
					value: '未开始',
				},
				{
					activityStatus: '2',
					value: '进行中',
				},
				{
					activityStatus: '3',
					value: '已结束',
				},
				{
					activityStatus: '4',
					value: '已取消',
				},
			],
			// 标记状态
			FLAG_STATE_ROOM: [
				{
					selectionTag: '',
					value: '全部',
				},
				{
					selectionTag: '2',
					value: '已选',
				},
				{
					selectionTag: '1',
					value: '未选',
				},
			],
			// 标记状态
			FORCED_UPDATING: [
				{
					updateType: '',
					value: '全部',
				},
				{
					updateType: '2',
					value: '强制更新',
				},
				{
					updateType: '1',
					value: '非强制更新',
				},
			],
			OPERATION_TYPE_CODE: [
				{
					updateType: '',
					value: '全部',
				},
				{
					updateType: 1,
					value: '普通入库',
				},
				{
					updateType: 2,
					value: '普通出库',
				},
				{
					updateType: 3,
					value: '订单出库',
				},
				{
					updateType: 4,
					value: '采购单入库',
				},
				{
					updateType: 5,
					value: '变体调货出库',
				},
				{
					updateType: 6,
					value: '变体调货入库',
				},
				{
					updateType: 7,
					value: '退货单入库',
				},
				{
					selectiupdateTypeonTag: 8,
					value: '盘盈入库',
				},
				{
					updateType: 9,
					value: '盘亏出库',
				},
				{
					updateType: 10,
					value: '采购退货出库',
				},
				{
					updateType: 11,
					value: '订单入库',
				},
			],

			REFUND_REASON: [
				{
					remarkType: 0,
					value: '全部',
				},
				{
					remarkType: 1,
					value: '质量问题',
				},
				{
					remarkType: 2,
					value: '缺货退款',
				},
				{
					remarkType: 3,
					value: '特殊处理',
				},
				{
					remarkType: 4,
					value: '拒收退款',
				},
				{
					remarkType: 5,
					value: '取消订单',
				},
				{
					remarkType: 11,
					value: '七天无理由',
				},
				{
					remarkType: 12,
					value: '漏发/少发/未收到货',
				},

				{
					remarkType: 13,
					value: '错发退款',
				},
				{
					remarkType: 14,
					value: '物流停滞/异常/丢件',
				},
				{
					remarkType: 15,
					value: '大小/尺码与描述不符',
				},
				{
					remarkType: 16,
					value: '商家同意退款',
				},
			],
			EXPORT_RETURN_ORDER: [
				{
					key: 'returnSn',
					value: '退货单号',
				},
				{
					key: 'addTime',
					value: '生成退货单时间',
				},
				{
					key: 'orderSn',
					value: '订单号',
				},
				{
					key: 'orderAddTime',
					value: '下单时间',
				},
				{
					key: 'organizationName',
					value: '店铺名称',
				},
				{
					key: 'sourceType',
					value: '渠道',
				},
				{
					key: 'sourceName',
					value: '下单号',
				},
				{
					key: 'brandName',
					value: '品牌',
				},
				{
					key: 'customerExpressFee',
					value: '客户退货运费',
				},
				{
					key: 'goodsRecovery',
					value: '货物是否收回',
				},
				{
					key: 'platformExpressSn',
					value: '返回第三方物流单',
				},
				{
					key: 'refundAmount',
					value: '退款金额',
				},
				{
					key: 'costPrice',
					value: '结算价',
				},
				{
					key: 'platformPrice',
					value: '第三方返退金额',
				},
				{
					key: 'difference',
					value: '差额',
				},
				{
					key: 'returnStatus',
					value: '状态',
				},
				{
					key: 'clerkName',
					value: '操作人',
				},
				{
					key: 'remark',
					value: '退款原因',
				},
			],
			// 主播类型
			ANCHOR_TYPE: [
				{
					type: '0',
					value: '普通主播',
				},
				{
					type: '1',
					value: '优选主播',
				},
			],
			// 问卷投放的平台
			QUESTION_CHANNEL: [
				{
					launchProduct: 1,
					value: '云货优选小程序',
				},
				// {
				// 	launchProduct: 1,
				// 	value: '芊鱼APP',
				// },
				// {
				// 	launchProduct: 2,
				// 	value: '云货优选公众号',
				// },
				// {
				// 	launchProduct: 3,
				// 	value: '云货优选店主公众号',
				// },
			],
			// 奖励方式
			REWARD_WAY: [
				{
					bonusType: '',
					value: '全部',
				},
				{
					bonusType: 1,
					value: '奖励到微信领钱',
				},
				{
					bonusType: 2,
					value: '奖励到店余额',
				},
				{
					bonusType: 3,
					value: '用户自行转账',
				},
			],
			// 上门揽退
			collection_status: [
				{
					collectionStatus: '',
					value: '全部',
				},
				{
					collectionStatus: 0,
					value: '已取消',
				},
				{
					collectionStatus: 1,
					value: '待确认',
				},
				{
					collectionStatus: 2,
					value: '待接单',
				},
				{
					collectionStatus: 3,
					value: '待揽件',
				},
				{
					collectionStatus: 4,
					value: '开始揽件',
				},
				{
					collectionStatus: 5,
					value: '已揽件',
				},
				{
					collectionStatus: 6,
					value: '已关闭',
				},
				{
					collectionStatus: 7,
					value: '下单失败',
				},
			],
			//权益卡锁定状态
			equity_reduction_flag: [
				{
					equityReductionFlag: '',
					value: '全部',
				},
				{
					equityReductionFlag: 0,
					value: '未锁定',
				},
				{
					equityReductionFlag: 1,
					value: '已锁定',
				},
			],
			withdrawDeposit: [
				{
					withdrawStatus: '',
					value: '全部',
				},
				{
					withdrawStatus: 1,
					value: '发起提现',
				},
				{
					withdrawStatus: 2,
					value: '提现成功',
				},
				{
					withdrawStatus: 3,
					value: '提现失败',
				},
			],
			// 开户状态: 1-资料校验中,2-待账户验证,3-审核中,4-已驳回,5-待签约,6-完成,7-已冻结
			sftState: [
				{
					sftState: '',
					value: '全部',
				},
				{
					sftState: 1,
					value: '资料校验中',
				},
				{
					sftState: 2,
					value: '待账户验证',
				},
				{
					sftState: 3,
					value: '审核中',
				},
				{
					sftState: 4,
					value: '已驳回',
				},
				{
					sftState: 5,
					value: '待签约',
				},
				{
					sftState: 6,
					value: '完成',
				},
				{
					sftState: 7,
					value: '已冻结',
				},
			],
			// 活动氛围-状态
			ACTIVITY_AMBIENT_STATE: [
				{
					actState: 0,
					value: '未开始',
				},
				{
					actState: 1,
					value: '进行中',
				},
				{
					actState: 2,
					value: '已结束',
				},
			],
			// 合同签署状态
			SIGN_STATUS: [
				{
					value: '待签署',
					signStatus: 'WAIT_SIGN',
				},
				{
					value: '签署中',
					signStatus: 'SIGN_ING',
				},
				{
					value: '签署成功',
					signStatus: 'SIGN_SUCCESS',
				},
				{
					value: '签署失败',
					signStatus: 'SIGN_FAIL',
				},
				{
					value: '签署关闭',
					signStatus: 'SIGN_CLOSE',
				},
			],
			EFFECT_STATUS: [
				{
					value: '已创建',
					effectStatus: 'CREATED',
				},
				{
					value: '生效中',
					effectStatus: 'VALID',
				},
				{
					value: '已过期',
					effectStatus: 'INVALID',
				},
			],
		},
	},
	mutations: {
		TOGGLE_SIDEBAR: (state) => {
			state.sidebar.opened = !state.sidebar.opened
			state.sidebar.withoutAnimation = false
		},
		CLOSE_SIDEBAR: (state, withoutAnimation) => {
			state.sidebar.opened = false
			state.sidebar.withoutAnimation = withoutAnimation
		},
		SET_SUPPLIER_LIST(state, val) {
			state.constant.SUPPLIER_LIST = val
		},
	},
	actions: {
		toggleSideBar({ commit }) {
			commit('TOGGLE_SIDEBAR')
		},
		closeSideBar({ commit }, { withoutAnimation }) {
			commit('CLOSE_SIDEBAR', withoutAnimation)
		},
		async setSupplierList({ commit }) {
			return Promise((resolve) => {
				setTimeout(() => {
					commit('SET_SUPPLIER_LIST')
					resolve()
				}, 1000)
			})
		},
	},
}

export default app
