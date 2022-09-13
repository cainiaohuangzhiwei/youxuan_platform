<template>
	<basic-container>
		<div class="testList">
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</el-row>
		</div>
		<new-scene-dialog
			:visible.sync="newSceneDialog"
			:newSceneRow="newSceneRow"
			:dataType="this.name === 'toCheck' ? 1 : 2"
			@Refresh="Refresh"
			:name="name"
		></new-scene-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import NewSceneDialog from './NewDialog'
import { getRcShopSceneAuditList, checkAction } from '@/api/trafficRules'
export default {
	components: {
		BasicContainer,
		YxTable,
		NewSceneDialog,
	},
	name: 'FormTable',
	props: {
		name: {
			type: String,
		},
	},
	data() {
		const tableColumns = [
			{
				type: 'string',
				dataIndex: 'shopSceneName',
				title: '场景',
			},
			{
				type: 'string',
				dataIndex: 'abtId',
				title: '分流父ID',
			},
			{
				type: 'string',
				dataIndex: 'abtStrategyId',
				title: '分流子ID',
			},
			{
				type: 'string',
				dataIndex: 'addUserName',
				title: '提交人',
			},
			{
				type: 'date',
				dataIndex: 'addTime',
				title: '提交时间',
			},
			{
				type: 'action',
				title: '操作',
				actions: [
					{
						title: '查看',
						click: (row) => {
							this.openDialog(row)
						},
					},
				],
			},
		]
		//已审核
		const tableCheckInfo = [
			{
				type: 'string',
				dataIndex: 'lastAuditUserName',
				title: '审核人',
			},
			{
				type: 'date',
				dataIndex: 'lastAuditTime',
				title: '审核时间',
			},
		]
		//待审核
		const tableAction = {
			type: 'action',
			title: '审核',
			actions: [
				{
					title: '不通过',
					click: (row) => {
						let _this = this
						_this.$confirm('确定不通过？', '提示', {
							type: 'warning',
							async callback(action) {
								if (action === 'confirm') {
									_this._checkAction(row, false)
								}
							},
						})
					},
				},
				{
					title: '通过',
					click: (row) => {
						let _this = this
						_this.$confirm('确定通过？', '提示', {
							type: 'warning',
							async callback(action) {
								if (action === 'confirm') {
									_this._checkAction(row, true)
								}
							},
						})
					},
				},
			],
		}
		const newTableColumns =
			this.name === 'toCheck'
				? [...tableColumns, tableAction]
				: [...tableColumns, ...tableCheckInfo]

		return {
			newSceneDialog: false,
			newSceneRow: {},
			row: {},
			dialogState: false,
			state: '',
			showLoading: false,
			editDialog: false,
			EditDialogTitle: '',
			tableData: [],
			tableColumns: newTableColumns,
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._QueryList()
				},
			},
		}
	},
	created() {},

	async mounted() {
		this._QueryList()
	},

	methods: {
		openDialog(row) {
			if (row) {
				this.newSceneRow = row
			} else {
				this.newSceneRow = {}
			}
			this.newSceneDialog = true
		},
		Refresh() {
			this._QueryList(true)
		},
		handleChange(val) {
			console.log(val)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				status: this.name === 'toCheck' ? 1 : 2,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			if (this.tableData.length === 1) {
				this.page.currentPage = Math.max(1, this.page.currentPage - 1)
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		// 列表
		_QueryList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let { data } = await getRcShopSceneAuditList(paramJson)
			this.showLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData
				this.page.count = data.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//审核
		_checkAction: async function (row, check) {
			let paramJson = {
				sceneId: row.sceneId,
				shopSceneAuditId: row.shopSceneAuditId,
				shopSceneId: row.shopSceneId,
				abtStrategyId: row.abtStrategyId,
				status: check ? 2 : 3, //审核状态 1：待审核；2：审核通过；3：审核不通过
			}
			let {
				data: { resultCode },
			} = await checkAction(paramJson)
			if (resultCode == 0) {
				this.$message.success('操作成功')
				this._QueryList()
			}
		},
	},
}
</script>

<style>
.testList .el-table .cell {
	white-space: pre-wrap;
}
.box {
	text-align: right;
}
</style>
