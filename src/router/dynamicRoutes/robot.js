const robot = {
	path: '/robot',
	redirect: '/robot/researchFeedback',
	name: 'robot',
	component: () => import('@/layout'),
	meta: {
		title: '机器人',
		icon: 'el-icon-cpu',
	},
	children: [
		{
			path: 'researchFeedback',
			name: 'ResearchFeedback',
			meta: {
				title: '调研反馈',
				functionCode: ['researchFeedbackList'],
			},
			component: () => import('@/pages/robot/researchFeedback/index'),
		},
	],
}
export default robot
