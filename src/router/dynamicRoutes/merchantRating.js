/*
 * @Description: 商家模块路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:57:13
 * @LastEditTime: 2020-10-17 12:34:24
 * @LastEditors: linjing
 */

const rateRouter = {
	path: '/rate',
	redirect: '/rate/SupplyRating',
	name: 'rate',
	component: () => import('@/layout'),
	meta: {
		title: '商家评分',
		icon: 'el-icon-reading',
	},
	children: [
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
export default rateRouter
