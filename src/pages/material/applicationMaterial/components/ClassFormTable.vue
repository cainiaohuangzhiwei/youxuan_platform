<template>
	<basic-container>
		<div>
			<WgForm
				v-loading="exportLoading"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:actionInline="true"
				labelWidth="6em"
			>
			</WgForm>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</el-row>

			<!-- 新增/编辑 -->
			<ClassEditDialog
				ref="form"
				:title="dialogTitle"
				:visible.sync="dialogVisible"
				:row="dialogformData"
				@initTable="queryMaterialClassifyListByPage()"
			/>
		</div>
	</basic-container>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { queryMaterialClassifyListByPage } from '@/api/newMaterial'
import ClassEditDialog from './ClassEditDialog'

export default {
	components: {
		BasicContainer,
		WgForm,
		YxTable,
		ClassEditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			//弹窗是否显示
			dialogVisible: false,
			//弹窗标题
			dialogTitle: '',
			//弹窗显示数据
			dialogformData: {},
			exportLoading: false,
			showLoading: false,
			searchData: {
				materialClassifyName: '', // 关键词
				status: '', //状态
			},
			searchCfg: [
				{
					title: '关键词',
					type: 'input',
					dataIndex: 'materialClassifyName',
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 2,
							value: '启用',
						},
						{
							status: 1,
							value: '禁用',
						},
					],
					label: 'value',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					auth: 'getMaterialClassifyByPage',
					align: 'right',
					click: () => {
						this.queryMaterialClassifyListByPage(true)
					},
				},
				{
					title: '新增',
					type: 'primary',
					auth: 'addMaterialClassify',
					align: 'right',
					click: () => {
						this.openDialog()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'materialClassifyId',
					title: '素材分类ID',
				},
				{
					type: 'string',
					dataIndex: 'materialClassifyName',
					title: '分类',
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
				},
				{
					type: 'map',
					dataIndex: 'status',
					title: '状态',
					options: {
						禁用: 1,
						启用: 2,
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							auth: 'updateMaterialClassify',
							click: (row) => {
								this.openDialog(row)
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
					this.queryMaterialClassifyListByPage()
				},
			},
			// gatewayEnable: false,
		}
	},
	created() {
		this.queryMaterialClassifyListByPage(true)
	},

	mounted() {},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		//查询列表数据
		queryMaterialClassifyListByPage: async function (flag) {
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await queryMaterialClassifyListByPage(paramJson)
			console.log(flag, 'flag')
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
		//打开弹窗
		openDialog(row) {
			this.dialogVisible = true
			if (row) {
				//编辑
				this.dialogTitle = '编辑'
				this.dialogformData = row
			} else {
				//新增
				this.dialogTitle = '新增'
				this.dialogformData = {}
			}
		},
	},
}
</script>

<style></style>
