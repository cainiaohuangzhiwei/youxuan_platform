<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form
		><el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			></yx-table>
		</el-row>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import {
	getSourceMaterialManageList,
	delSourceMaterialManage,
} from '@/api/sourceMaterial'

export default {
	components: {
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			Id: null,
			showLoading: false,
			searchData: {
				keyWord: '',
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'input',
					title: '标题',
					dataIndex: 'keyWord',
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.getSourceMaterialManageList(true)
					},
				},
				{
					title: '新增',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `materialsDetail/${encodeURIComponent(this.Id)}`,
						})
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'sourceMaterialManageId',
					title: '内容id',
				},
				{
					type: 'string',
					dataIndex: 'title',
					title: '标题',
				},
				{
					field: 'status',
					title: '状态',
					align: 'center',
					valign: 'middle',
					customRender: (row) => {
						if (row.status == 0) {
							return '禁用'
						} else if (row.status == 1) {
							return '启用'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.$router.push({
									name: 'MaterialsDetail',
									params: { Id: row.sourceMaterialManageId },
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
											_this._messageDel(row.sourceMaterialManageId)
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
					this.getSourceMaterialManageList()
				},
			},
		}
	},

	created() {
		this.getSourceMaterialManageList(true)
	},

	methods: {
		//删除
		_messageDel: async function (sourceMaterialManageId) {
			let paramJson = {
				sourceMaterialManageId,
			}
			let {
				data: { resultCode },
			} = await delSourceMaterialManage(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this.getSourceMaterialManageList()
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		getSourceMaterialManageList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getSourceMaterialManageList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData =
					resultData && resultData.sourceMaterialManageList
						? resultData.sourceMaterialManageList
						: []
				this.page.count = resultData && resultData.count ? resultData.count : 0
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
