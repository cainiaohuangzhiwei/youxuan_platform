const userOperation = {
	path: '/userOperation',
	redirect: '/userOperation/groupConfiguration',
	name: 'userOperation',
	component: () => import('@/layout'),
	meta: {
		title: '用户运营',
		icon: 'el-icon-user',
	},
	children: [
		{
			path: 'groupConfiguration',
			name: 'GroupConfiguration',
			meta: {
				title: '运营配置',
				functionCode: ['userOperationStrategyGroupQueryStrategyGroupBatch'],
			},
			component: () => import('@/pages/userOperation/groupConfiguration/index'),
		},
		{
			path: 'strategicManagement/:id/:groupName',
			name: 'StrategicManagement',
			hidden: true,
			meta: {
				title: '策略管理',
				functionCode: ['userOperationStrategyGroupQueryStrategyGroupBatch'],
			},
			component: () =>
				import('@/pages/userOperation/strategicManagement/index'),
		},
		{
			path: 'createGroupStrategic/:type/:uoStrategyGroupId/:groupName/:id',
			name: 'CreateGroupStrategic',
			hidden: true,
			meta: {
				title: '配置步骤',
				functionCode: ['userOperationStrategyGroupQueryStrategyGroupBatch'],
			},
			component: () =>
				import('@/pages/userOperation/createGroupStrategic/index'),
		},
		{
			path: 'dictionaryManagement',
			name: 'dictionaryManagement',
			meta: {
				title: '字典管理',
				functionCode: ['uoAttributeClassifyQueryUoAttributeClassifyBatch'],
			},
			component: () =>
				import('@/pages/userOperation/dictionaryManagement/index'),
		},
	],
}
export default userOperation
