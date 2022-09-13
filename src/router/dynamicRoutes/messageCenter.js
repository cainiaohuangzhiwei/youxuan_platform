/*
 * @Description: 消息中心
 * @Author: Navi
 * @Email: email@navi.wang
 * @Date: 2021-08-04 16:37:41
 */
const messageCenter = {
	path: '/messageCenter',
	redirect: '/messageCenter/templateManagement',
	name: 'messageCenter',
	component: () => import('@/layout'),
	meta: {
		title: '消息中心',
		icon: 'el-icon-message-solid',
	},
	children: [
		{
			path: 'templateManagement',
			name: 'templateManagement',
			meta: {
				title: '短信模板',
				functionCode: ['/message-template/query'],
			},
			component: () => import('@/pages/messageCenter/templateManagement/index'),
		},
		{
			path: 'subscribeManagement',
			name: 'subscribeManagement',
			meta: {
				title: '订阅数据',
				functionCode: ['subscribeTemplateList'],
			},
			component: () =>
				import('@/pages/messageCenter/subscribeManagement/index'),
		},
		{
			path: 'subscribePushTaskList',
			name: 'subscribePushTaskList',
			meta: {
				title: '定向推送',
				functionCode: ['pushTaskList'],
			},
			component: () =>
				import('@/pages/messageCenter/subscribeManagement/pushTask'),
		},
		{
			path: 'subscribePushTaskListOld',
			name: 'subscribePushTaskListOld',
			meta: {
				title: '定向推送(旧)',
				functionCode: ['pushTaskList'],
			},
			component: () =>
				import('@/pages/messageCenter/subscribeManagement/pushTaskOld'),
		},
	],
}
export default messageCenter
