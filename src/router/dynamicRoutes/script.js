/*
 * @Description: 脚本系统
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:54:04
 * @LastEditTime: 2020-09-11 16:57:43
 * @LastEditors: lufengkai
 */
const scriptRouter = {
	path: '/script',
	redirect: '/script/BrandRecordList',
	name: 'script',
	component: () => import('@/layout'),
	meta: {
		title: '脚本系统',
		icon: 'el-icon-script',
	},
	children: [
		{
			path: 'priorityList',
			name: 'PriorityList',
			meta: {
				title: '优先爬取',
				functionCode: ['getBrandReadyListByCondition'],
			},
			component: () => import('@/pages/script/PriorityList/index'),
		},
		{
			path: 'brandRecordList',
			name: 'BrandRecordList',
			meta: {
				title: '品牌信息',
				functionCode: ['getBrandRecordListByCondition'],
			},
			component: () => import('@/pages/script/BrandRecordList/index'),
		},
		{
			path: 'platformAccount',
			name: 'PlatformAccount',
			meta: {
				title: '平台账号',
				functionCode: ['addPlatformUser'],
			},
			component: () => import('@/pages/script/PlatformAccount/index'),
		},
	],
}
export default scriptRouter
