/*
 * @Description: 导入模块状态机
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-20 11:27:45
 * @LastEditTime: 2020-08-28 02:43:15
 * @LastEditors: Navi
 */
const leadin = {
	namespaced: true,
	storage: {
		cache: ['warehouseList', 'importHistoryType', 'importStatus', 'groupRow'],
		cookies: [],
		sessionStorages: [],
		localStorages: [],
	},
	state: {
		groupRow: '',
		warehouseList: [],
		importHistoryType: [
			{
				importType: '1',
				name: '商品历史导入记录',
			},
			{
				importType: '2',
				name: '库存历史导入记录',
			},
			{
				importType: '3',
				name: '发货单导入记录',
			},
			// {
			// 	importType: '4',
			// 	name: '修改商品信息导入记录',
			// },
			{
				importType: '5',
				name: '商品审核导入记录',
			},
			{
				importType: '6',
				name: '修改物流单号导入记录',
			},
			{
				importType: '7',
				name: '修改商品信息导入记录',
			},
			{
				importType: '8',
				name: '修改商品价格导入记录',
			},
			{
				importType: '11',
				name: '批量导入数据明细',
			},
		],
		importStatus: [
			{
				status: '',
				name: '全部',
			},
			{
				status: '1',
				name: '导入中',
			},
			{
				status: '2',
				name: '导入完成',
			},
			{
				status: '3',
				name: '导入失败',
			},
		],
	},
	actions: {
		setMaterId({ commit }, groupRow) {
			commit('setMater', groupRow)
		},
	},
	mutations: {
		SET_WAREHOUSE_LIST(state, val) {
			state.warehouseList = val
		},
		setMater(state, groupRow) {
			state.groupRow = groupRow //将传参设置给state的groupRow
		},
	},
}

export default leadin
