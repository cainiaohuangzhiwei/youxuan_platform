/*
 * @Description: 商城管理模块路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 11:01:58
 * @LastEditTime: 2020-09-11 17:00:08
 * @LastEditors: lufengkai
 */

const mallRouter = {
	path: '/mall',
	redirect: '/mall/functionalAreas',
	name: 'mall',
	component: () => import('@/layout'),
	meta: {
		title: '商城管理',
		icon: 'el-icon-menu',
	},
	children: [
		{
			path: 'functionalAreas',
			name: 'FunctionalAreas',
			meta: {
				title: '功能区',
				functionCode: ['functionalAreaList'],
			},
			component: () => import('@/pages/mall/index'),
		},
	],
}
export default mallRouter
