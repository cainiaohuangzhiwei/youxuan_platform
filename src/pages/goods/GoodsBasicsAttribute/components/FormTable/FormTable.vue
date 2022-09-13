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
		<add-and-edit-dialog
			:itemInfo="editRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				() => {
					this.callListBasicsAttribute(true)
				}
			"
		/>
		<batch-dialog
			:row="currentDta"
			:visible.sync="batchDialog"
			@fatherMethodInit="fatherMethodInit"
		/>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { listBasicsAttribute } from '@/api/yhtPlusCmsGoodsBasicsAttribute'
import AddAndEditDialog from '../AddAndEditDialog'
import BatchDialog from '../BatchDialog'

export default {
	components: {
		BasicContainer,
		AddAndEditDialog,
		YxForm,
		YxTable,
		BatchDialog,
	},
	name: 'FormTable',
	data() {
		return {
			formsDialog: false,
			showLoading: false,
			batchDialog: false,
			editRow: '',
			searchData: {
				attributeName: '', //属性名称
			},

			searchCfg: [
				{
					title: '属性名称',
					type: 'input',
					dataIndex: 'attributeName',
					placeholder: '请输入属性名称',
					enter: () => {
						this.callListBasicsAttribute(true)
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.callListBasicsAttribute(true, e)
					},
				},
				{
					title: '新增',
					type: 'primary',
					auth: 'saveBasicsAttribute',
					click: () => {
						this.editRow = ''
						this.formsDialog = true
					},
				},
				{
					title: '导入',
					type: 'primary',
					auth: 'importBasicsAttribute',
					click: () => {
						this.batchDialog = true
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsBasicsAttributeId',
					title: '属性ID',
				},
				{
					type: 'string',
					dataIndex: 'attributeName',
					title: '属性名称',
				},
				{
					type: 'date',
					dataIndex: 'updateTime',
					title: '修改时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '250',
					actions: [
						{
							title: '编辑',
							auth: 'updateBasicsAttribute',
							click: (row) => {
								this.editRow = row
								this.editRow.type = 'edit'
								this.formsDialog = true
							},
						},
						{
							title: '查看',
							click: (row) => {
								this.editRow = row
								this.editRow.type = 'check'
								this.formsDialog = true
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
					this.callListBasicsAttribute()
				},
			},
		}
	},

	created() {
		this.callListBasicsAttribute(true)
	},

	methods: {
		findSearchParams(flag) {
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
		callListBasicsAttribute: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listBasicsAttribute(paramJson, custom)

			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records || []
				this.page.count = resultData.total || 0
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
