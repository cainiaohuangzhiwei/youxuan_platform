/*
 * @Description: 邀请码路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:22:32
 * @LastEditTime: 2021-05-17 19:10:34
 * @LastEditors: 你的名字
 */

const inviteRouter = {
	path: '/invite',
	redirect: '/invite/inviteList',
	name: 'invite',
	component: () => import('@/layout'),
	meta: {
		title: '邀请码',
		icon: 'el-icon-invite-code',
	},
	children: [
		{
			path: 'inviteList',
			name: 'InviteList',
			meta: {
				title: '购买邀请码列表',
				functionCode: ['getInviteCodeListByCondition'],
			},
			component: () => import('@/pages/invite/InviteList/index'),
		},
		{
			path: 'inviteSystemList',
			name: 'InviteSystemList',
			meta: {
				title: '系统生成列表',
				functionCode: ['getInternalInviteCodeListByCondition'],
			},
			component: () => import('@/pages/invite/InviteSystemList/index'),
		},
		{
			path: 'registrationCode',
			name: 'RegistrationCode',
			meta: {
				title: '注册码',
				functionCode: ['getPoster'],
			},
			component: () => import('@/pages/invite/RegistrationCode/index'),
		},
	],
}
export default inviteRouter
