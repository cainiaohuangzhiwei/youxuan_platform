/*
 * @Description: 工作台模块路由
 * @Author: linjing
 * @Date: 2020-07-09 11:09:18
 * @LastEditTime: 2020-10-17 13:27:09
 * @LastEditors: linjing
 */
// import Layout from '@/layout'
const indexRouter = {
	hidden: true,
	path: '/index',
	redirect: '/index/index',
	name: 'index',
	// TODO: 使用第二套layout
	component: () => import('@/layout'),
	meta: {
		title: '工作台',
		icon: 'el-icon-s-goods',
	},
	children: [
		{
			path: 'index',
			name: 'index',
			meta: {
				title: '工作台',
			},
			component: () => import('@/pages/index/index'),
		},
	],
}
export default indexRouter
