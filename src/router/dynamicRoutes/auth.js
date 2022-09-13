/*
 * @Description: 鉴权校验模块路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 11:09:18
 * @LastEditTime: 2020-10-17 12:55:22
 * @LastEditors: linjing
 */
// import Layout from '@/layout'
const authRouter = {
	hidden: true,
	path: '/auth',
	redirect: '/auth/login',
	name: 'auth',
	// TODO: 使用第二套layout
	component: () => import('@/layout/LoginView.vue'),
	meta: {
		title: '验证',
		icon: 'el-icon-s-goods',
	},
	children: [
		{
			path: 'login',
			name: 'Login',
			meta: {
				title: '登录页面',
			},
			component: () => import('@/pages/auth/login'),
		},
	],
}
export default authRouter
