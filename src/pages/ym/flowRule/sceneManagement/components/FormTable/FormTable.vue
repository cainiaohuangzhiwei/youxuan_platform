<template>
	<basic-container>
		<div v-if="rcAuthAccount.accountType" class="testList">
			<div class="box">
				<yx-form
					:inline="true"
					:data="searchData"
					:items="searchCfg"
					:formAction="searchAction"
				>
					<template #establish>
						<el-checkbox v-model="searchData.establish" @change="handleChange"
							>只看我创建</el-checkbox
						>
					</template>
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
import { rcBizSceneQueryList, rcBizSceneDeleteById } from '@/api/scene'

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
				establish: false,
			},
			editDialog: false,
			EditDialogTitle: '',
			searchCfg: [
				{
					type: 'custom',
					dataIndex: 'establish',
				},
				{
					type: 'input',
					placeholder: '请输入页面名称或场景名称',
					dataIndex: 'keyWord',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._rcBizSceneQueryList(true)
					},
				},
				{
					title: '新建场景',
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
					dataIndex: 'sceneName',
					title: '场景名称',
				},
				{
					type: 'string',
					dataIndex: 'pageName',
					title: '页面名称',
				},
				{
					type: 'string',
					dataIndex: 'testId',
					title: '分流ID',
				},
				{
					type: 'string',
					dataIndex: 'shopSceneCode',
					title: '商城场景ID',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.$router.push({
									path: `editScene/${row.sceneId}`,
								})
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
											_this._rcBizSceneDeleteById(row.sceneId)
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
					this._rcBizSceneQueryList()
				},
			},
		}
	},
	created() {},

	mounted() {
		if (!this.rcAuthAccount.accountType) return
		this._rcBizSceneQueryList()
	},

	methods: {
		Refresh() {
			this._rcBizSceneQueryList(true)
		},
		handleChange(val) {
			console.log(val)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				groupId: 2,
				keyWord: this.searchData.keyWord,
			}
			if (this.searchData.establish) {
				paramJson.addUser = this.$store.state.user.userInfo.userId
			}
			console.log(paramJson, 'asdfdsfdfdfdfdf')
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		// 场景中心列表
		_rcBizSceneQueryList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let { data } = await rcBizSceneQueryList(paramJson)
			this.showLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData
				this.page.count = data.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//删除优惠券
		_rcBizSceneDeleteById: async function (sceneId) {
			let paramJson = {
				id: sceneId,
			}
			let {
				data: { resultCode },
			} = await rcBizSceneDeleteById(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._rcBizSceneQueryList()
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
