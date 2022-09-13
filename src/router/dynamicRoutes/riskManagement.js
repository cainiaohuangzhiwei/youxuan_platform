/*
 * @Description: 消息中心
 * @Author: Navi
 * @Email: email@navi.wang
 * @Date: 2021-08-04 16:37:41
 */
const riskManagement = {
	path: '/riskManagement',
	redirect: '/riskManagement/userRiskManagement',
	name: 'riskManagement',
	component: () => import('@/layout'),
	meta: {
		title: '用户风控',
		icon: 'el-icon-s-release',
	},
	children: [
		{
			path: 'userRiskManagement',
			name: 'userRiskManagement',
			meta: {
				functionCode: ['listUserRiskControl'],
				title: '用户风控列表',
			},
			component: () =>
				import('@/pages/riskManagement/userRiskManagement/index'),
		},
	],
}
export default riskManagement
