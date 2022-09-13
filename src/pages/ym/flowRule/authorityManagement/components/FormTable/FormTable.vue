<template>
	<basic-container>
		<div v-if="rcAuthAccount.accountType == 3" class="testList">
			<div class="box">
				<yx-form
					:inline="true"
					:data="searchData"
					:items="searchCfg"
					:formAction="searchAction"
				>
				</yx-form>
			</div>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<el-divider v-else>没有操作权限，请联系管理员！</el-divider>
		<new-scene-dialog
			:visible.sync="newSceneDialog"
			:newSceneRow="newSceneRow"
			@Refresh="Refresh"
		></new-scene-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import NewSceneDialog from './NewSceneDialog'
import {
	getRcAuthAccountList,
	deleteRcAuthAccountById,
} from '@/api/trafficRules'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		NewSceneDialog,
	},
	name: 'FormTable',
	data() {
		return {
			rcAuthAccount: this.$store.state.user.rcAuthAccount, //流量规则平台授权账户信息
			newSceneDialog: false,
			newSceneRow: {},
			row: {},
			dialogState: false,
			state: '',
			showLoading: false,
			searchData: {
				keyWord: '',
			},
			editDialog: false,
			EditDialogTitle: '',
			searchCfg: [
				{
					type: 'input',
					placeholder: '请输入账号',
					dataIndex: 'keyWord',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getRcAuthAccountList(true)
					},
				},
				{
					title: '账号授权',
					type: 'primary',
					click: () => {
						this.newSceneRow = {}
						this.newSceneDialog = true
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'userName',
					title: '账号',
				},
				{
					type: 'map',
					dataIndex: 'accountType',
					title: '类型',
					options: {
						普通账号: 1,
						管理员: 2,
						超级管理员: 3,
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.openDialog(row)
							},
						},
						{
							title: '删除',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._deleteRcAuthAccountById(row.authAccountId)
										}
									},
								})
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getRcAuthAccountList()
				},
			},
		}
	},
	created() {},

	mounted() {
		this._getRcAuthAccountList()
	},

	methods: {
		Refresh() {
			this._getRcAuthAccountList(true)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				userName: this.searchData.keyWord,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		// 权限管理列表
		_getRcAuthAccountList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let { data } = await getRcAuthAccountList(paramJson)
			this.showLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData
				this.page.count = data.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//删除
		_deleteRcAuthAccountById: async function (authAccountId) {
			let {
				data: { resultCode },
			} = await deleteRcAuthAccountById({ authAccountId })
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._getRcAuthAccountList()
			}
		},
		openDialog(row) {
			if (row) {
				this.newSceneRow = row
			} else {
				this.newSceneRow = {}
			}
			this.newSceneDialog = true
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
