/*
 * @Description: 小程序模块路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:48:01
 * @LastEditTime: 2022-02-17 14:29:38
 * @LastEditors: Please set LastEditors
 */

const xcxRouter = {
	path: '/xcx',
	redirect: '/xcx/goodsGroupList',
	name: 'xcx',
	component: () => import('@/layout'),
	meta: {
		title: '小程序',
		icon: 'el-icon-mini-program',
	},
	children: [
		{
			path: 'goodsGroupList',
			name: 'goodsGroupList',
			meta: {
				title: '小程序首页设置',
				functionCode: ['getGoodsGroupListByConditionForCMS'],
			},
			component: () => import('@/pages/xcx/goodsGroupList/index'),
		},
		{
			path: 'selectionGoods',
			name: 'selectionGoods',
			meta: {
				title: '小程序选品系统',
				functionCode: ['findBrandInfoByBrandName'],
			},
			component: () => import('@/pages/xcx/selectionGoods/index'),
		},
		{
			path: 'xcxImgList',
			name: 'xcxImgList',
			meta: {
				title: '小程序图片设置',
				functionCode: ['getWeixinImageList'],
			},
			component: () => import('@/pages/xcx/xcxImgList/index'),
		},
		{
			path: 'materialList',
			name: 'materialList',
			meta: {
				title: '小程序活动素材',
				functionCode: ['getActivityBannerList'],
			},
			component: () => import('@/pages/xcx/materialList/index'),
		},
		{
			path: 'bannerList',
			name: 'bannerList',
			meta: {
				title: '小程序banner',
				functionCode: ['getActBannerList'],
			},
			component: () => import('@/pages/xcx/bannerList/index'),
		},
		{
			path: 'marketList',
			name: 'marketList',
			meta: {
				title: '小程序满折满减活动',
				functionCode: ['getActDiscountListByCondition'],
			},
			component: () => import('@/pages/xcx/marketList/index'),
		},
		{
			path: 'schoolList',
			name: 'schoolList',
			meta: {
				title: '小程序商学院',
				functionCode: ['getBusinessSchoolList'],
			},
			component: () => import('@/pages/xcx/schoolList/index'),
		},
		{
			path: 'xcxMaterialList',
			name: 'xcxMaterialList',
			meta: {
				title: '小程序评价素材',
				functionCode: ['getEvaluationMaterialListByCondition'],
			},
			component: () => import('@/pages/xcx/xcxMaterialList/index'),
		},
		{
			path: 'importMaterial',
			name: 'importMaterial',
			hidden: true,
			meta: {
				title: '导入评价素材',
			},
			component: () => import('@/pages/xcx/importMaterial/index'),
		},
		{
			path: 'importMaterialImage',
			name: 'importMaterialImage',
			hidden: true,
			meta: {
				title: '导入评价素材图片',
			},
			component: () => import('@/pages/xcx/importMaterialImage/index'),
		},
		{
			path: 'commonProblems',
			name: 'commonProblems',
			meta: {
				title: '常见问题设置',
				functionCode: ['commonProblemList'],
			},
			component: () => import('@/pages/xcx/commonProblems/index'),
		},
		{
			path: 'activityArea',
			name: 'activityArea',
			meta: {
				title: '活动专区',
				functionCode: ['activityAreaList'],
			},
			component: () => import('@/pages/xcx/activityArea/index'),
		},
		{
			path: 'onlineService',
			name: 'onlineService',
			meta: {
				title: '在线客服',
				functionCode: ['customerServiceInterface'],
			},
			component: () => import('@/pages/xcx/onlineService/index'),
		},
		{
			path: 'activityFloor',
			name: 'activityFloor',
			meta: {
				title: '自定义首页',
				functionCode: ['activityFloorListForHome'],
			},
			component: () => import('@/pages/xcx/activityFloor/index'),
		},
		{
			path: 'goodsGroupDetails/:goodsGroupId/:brandId?/:groupName?',
			name: 'goodsGroupDetails',
			hidden: true,
			meta: {
				title: '分组商品',
			},
			component: () => import('@/pages/xcx/goodsGroupDetails/index'),
		},
		{
			path: 'activityAreaFloor/:id',
			name: 'activityAreaFloor',
			hidden: true,
			meta: {
				title: '楼层信息列表',
			},
			component: () => import('@/pages/xcx/activityAreaFloor/index'),
		},
		{
			path: 'activityAreaFloorDetails/:activityId/:floorId?',
			name: 'activityAreaFloorDetails',
			hidden: true,
			meta: {
				title: '楼层信息',
			},
			component: () => import('@/pages/xcx/activityAreaFloorDetails/index'),
		},
		{
			path: 'activityFloorDetails/:floorId?',
			name: 'activityFloorDetails',
			hidden: true,
			meta: {
				title: '楼层信息',
			},
			component: () => import('@/pages/xcx/activityFloorDetails/index'),
		},
		{
			path: 'searchKeyword',
			name: 'SearchKeyword',
			meta: {
				title: '搜索热词管理',
				functionCode: ['queryList'],
			},
			component: () => import('@/pages/xcx/SearchKeyword/index'),
		},
		{
			path: 'noticeManage',
			name: 'noticeManage',
			meta: {
				title: '公告管理',
				functionCode: ['getNoticeManagementList'],
			},
			component: () => import('@/pages/xcx/noticeManage/index'),
		},
		{
			path: 'questionnaire',
			name: 'questionnaire',
			meta: {
				title: '问卷调查',
			},
			component: () => import('@/pages/xcx/questionnaire/index'),
		},
		{
			path: 'scheduling',
			name: 'scheduling',
			meta: {
				title: '档期排序导入记录',
				functionCode: ['updateGoodsGroupImportRecord'],
			},
			component: () => import('@/pages/xcx/scheduling/index'),
		},
	],
}
export default xcxRouter
