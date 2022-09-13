/*
 * @Description:设置路由
 * @Author: WG-yangzhencheng
 * @Email: yangzhencheng@weeget.cn
 * @Date: 2020-12-15 15:49:54
 * @LastEditTime: 2020-12-23 11:14:58
 * @LastEditors: WG-yangzhencheng
 */
const setRouter = {
	path: '/set',
	redirect: '/set/operatingRecord',
	name: 'set',
	component: () => import('@/layout'),
	meta: {
		title: '设置',
		icon: 'el-icon-notebook-2',
	},
	children: [
		{
			path: 'operatingRecord',
			name: 'operatingRecord',
			hidden: true,
			meta: {
				title: '操作记录',
				functionCode: ['operationalLogsList'],
			},
			component: () => import('@/pages/set/OperatingRecord/index'),
		},
		{
			path: 'setSystemSet',
			name: 'setSystemSet',
			hidden: true,
			meta: {
				title: '系统设置',
			},
			component: () => import('@/pages/set/setSystemSet/index'),
		},
		{
			path: 'setDepartment',
			name: 'setDepartment',
			hidden: true,
			meta: {
				title: '部门与员工',
			},
			component: () => import('@/pages/set/setDepartment/index'),
		},
		{
			path: 'setStaffAdd/:clerkId?',
			name: 'setStaffAdd',
			hidden: true,
			meta: {
				title: '新增员工',
			},
			component: () => import('@/pages/set/setStaffAdd/index'),
		},
		{
			path: 'operatingRecordOld',
			name: 'operatingRecordOld',
			meta: {
				title: '操作记录',
				functionCode: ['operationalLogsList'],
			},
			component: () => import('@/pages/set/operatingRecordOld/index'),
		},
	],
}
export default setRouter
