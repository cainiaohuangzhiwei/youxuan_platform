<template>
	<basic-container>
		<div class="testList">
			<el-button
				style="margin-bottom: 20px"
				type="primary"
				@click="openDialog()"
				>{{ name === 'scene' ? '新建' : '接入' }}{{ mapName[name] }}</el-button
			>

			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="name" slot-scope="scope">{{
						scope.row.algorithmModelName ||
						scope.row.recallModelName ||
						scope.row.sourceName
					}}</template>
					<template slot="source" slot-scope="scope">{{
						scope.row.algorithmModel ||
						scope.row.recallModel ||
						scope.row.sourceValue
					}}</template>
					<template slot="paramIds" slot-scope="scope">{{
						scope.row.rcParamRelationDTOList
							? scope.row.rcParamRelationDTOList
									.map((x) => x.rcParamPoolDTO.paramName)
									.join(',')
							: ''
					}}</template>
					<template slot="returnContentType" slot-scope="scope">{{
						returnContentList.length
							? returnContentList.find(
									(x) => x.value === scope.row.returnContentType
							  ).label
							: ''
					}}</template>
				</yx-table>
			</el-row>
		</div>
		<new-scene-dialog
			:visible.sync="newSceneDialog"
			:newSceneRow="newSceneRow"
			:returnContentList="returnContentList"
			@Refresh="Refresh"
			:name="name"
		></new-scene-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import NewSceneDialog from './NewDialog'
import {
	sortQueryList,
	sortDeleteById,
	recallQueryList,
	recallDeleteById,
	dataSourceQueryList,
	dataSourceDeleteById,
	sceneQueryList,
	sceneDeleteById,
	searchQueryList,
	searchDeleteById,
} from '@/api/metaData'
import { optionsGet } from '@/api/scene'
const mapName = {
	sort: '排序算法',
	recall: '召回服务',
	source: '数据源',
	scene: '商城场景',
	search: '搜索服务管理',
	traffic: '流量分发管理',
}
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
				type: 'custom',
				dataIndex: 'name',
				title: this.name === 'source' ? '数据源名称' : '算法名称',
			},
			{
				type: 'custom',
				dataIndex: 'source',
				title: '数据源',
			},
			{
				type: 'custom',
				dataIndex: 'returnContentType',
				title: '对象',
			},
		]
		const tableParam = {
			type: 'custom',
			dataIndex: 'paramIds',
			title: '必选参数',
		}
		const tableAction = {
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
									_this._DeleteById(
										row[
											_this.name === 'scene' ? 'shopSceneId' : _this.name + 'Id'
										]
									)
								}
							},
						})
					},
				},
			],
		}
		const newTableColumns =
			this.name === 'scene'
				? [
						{
							dataIndex: 'sceneId',
							title: '场景ID',
						},
						{
							dataIndex: 'shopSceneName',
							title: '商城场景名称',
						},
						tableAction,
				  ]
				: this.name === 'search'
				? [
						{
							dataIndex: 'algorithmModelName',
							title: '服务名称',
						},
						{
							dataIndex: 'algorithmModel',
							title: '数据源',
						},
						tableAction,
				  ]
				: this.name === 'source'
				? [...tableColumns, tableAction]
				: [...tableColumns, tableParam, tableAction]

		const methodList = (() => {
			let method
			let deleteMethod
			switch (this.name) {
				case 'sort':
					method = sortQueryList
					deleteMethod = sortDeleteById
					break
				case 'recall':
					method = recallQueryList
					deleteMethod = recallDeleteById
					break
				case 'source':
					method = dataSourceQueryList
					deleteMethod = dataSourceDeleteById
					break
				case 'scene':
					method = sceneQueryList
					deleteMethod = sceneDeleteById
					break
				case 'search':
					method = searchQueryList
					deleteMethod = searchDeleteById
					break
			}
			return { method, deleteMethod }
		})()

		return {
			mapName,
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
			QueryList: methodList.method,
			deleteMethod: methodList.deleteMethod,
			returnContentList: [],
		}
	},
	created() {},

	async mounted() {
		this._QueryList()
		if (this.name === 'scene') return
		// 数据源召回对象
		let { data } = await optionsGet()
		if (data.resultCode == 0) {
			this.returnContentList = data.resultData.returnContentList
		}
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
				groupId: 2,
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
			let { data } = await this.QueryList(paramJson)
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
		_DeleteById: async function (id) {
			let paramJson = {
				[this.name + 'Id']: id,
			}
			if (this.name === 'scene') {
				paramJson = { shopSceneId: id }
			}
			let {
				data: { resultCode },
			} = await this.deleteMethod(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
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
