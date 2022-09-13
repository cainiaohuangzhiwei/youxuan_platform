<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<add-an-edit-dialog
			:dialogVisible.sync="dialogVisible"
			:itemInfo="selectedItem"
			@updateList="_getMcnList(true)"
		></add-an-edit-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import addAnEditDialog from './addAnEditDialog'
import { getMcnList } from '@/api/yhtPlusCmsLiveMcnControl'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		addAnEditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			selectedItem: {}, // 选中项
			dialogVisible: false, // 新建编辑弹框开关
			searchData: {
				mcnId: '', // 机构id
				mcnName: '', // 机构名称
			},
			searchCfg: [
				{
					type: 'inputNumber',
					title: '机构ID',
					dataIndex: 'mcnId',
				},
				{
					type: 'input',
					title: '机构名称',
					dataIndex: 'mcnName',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getMcnList(true)
					},
				},
				{
					title: '新建机构',
					type: 'primary',
					click: () => {
						this.addAndEditMcn(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'mcnId',
					title: '机构ID',
				},
				{
					type: 'string',
					dataIndex: 'mcnName',
					title: '机构名称',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.addAndEditMcn(true, row)
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
					this._getMcnList()
				},
			},
		}
	},

	created() {
		this._getMcnList(true)
	},

	methods: {
		addAndEditMcn(flag, row = {}) {
			this.selectedItem = row
			this.dialogVisible = flag
		},
		findMcnParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_getMcnList: async function (flag) {
			// 获取机构列表
			this.showLoading = true
			let paramJson = this.findMcnParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getMcnList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.datalist
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
