/*
 * @Description: APP路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:50:15
 * @LastEditTime: 2020-08-31 14:00:55
 * @LastEditors: Navi
 */
const staticRouter = {
	hidden: true,
	path: '/transfixion',
	redirect: '/transfixion/reload',
	name: 'transfixion',
	component: () => import('@/layout'),
	meta: {},
	children: [
		{
			path: 'reload',
			meta: {},
			component: () => import('@/pages/staticPages/Reload/index.vue'),
		},
	],
}
export default staticRouter
