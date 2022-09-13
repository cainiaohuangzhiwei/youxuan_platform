<template>
	<basic-container>
		<div class="testList">
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
				<div style="margin: 30px 0; text-align: center">
					<el-pagination
						background
						layout="prev, pager, next"
						:page-size="page.pageSize"
						:current-page="page.pageNum"
						:total="page.total"
						hide-on-single-page
						@current-change="page.tableChange"
					>
					</el-pagination>
				</div>
			</el-row>
			<edit-test-dialog
				:visible.sync="openEditTestDialog"
				:editRow="editRow"
				@Refresh="Refresh"
			></edit-test-dialog>
			<edit-white-list-dialog
				:visible.sync="openWhiteListDialog"
				:editRow="editRow"
				@Refresh="Refresh"
			></edit-white-list-dialog>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import editTestDialog from './editTestDialog'
import editWhiteListDialog from './editWhiteListDialog'
import { getTestList } from '@/api/abTest'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		editTestDialog,
		editWhiteListDialog,
	},
	name: 'FormTable',
	data() {
		return {
			searchCfg: [
				{
					type: 'input',
					title: '测试名称',
					dataIndex: 'testName',
				},
				{
					title: '测试时间:',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.findTestListByParam(true)
					},
				},
				{
					title: '新增测试',
					type: 'primary',
					click: () => {
						this.editRow = {}
						this.openEditTestDialog = true
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'id',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'testName',
					title: '测试名称',
				},
				{
					type: 'string',
					dataIndex: 'testTimeRange',
					title: '测试时间',
					width: 300,
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							' ~ ' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'createTime',
					title: '创建时间',
					customRender: (row) => {
						return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						let curTime = new Date().getTime()
						let startTime = new Date(
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
						).getTime()
						let endTime = new Date(
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						).getTime()
						if (endTime > curTime) {
							row.status = 0
						} else if (curTime > endTime) {
							row.status = 2
						}
						if (curTime >= startTime && curTime < endTime) {
							row.status = 1
						}
						return this.statusMap[row.status]
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.openEditTestDialog = true
								this.editRow = row
							},
						},
						{
							title: '编辑实验',
							click: (row) => {
								this.$router.push({
									name: 'abTestExpri',
									params: row,
								})
							},
						},
						{
							title: '白名单',
							click: (row) => {
								this.openWhiteListDialog = true
								this.editRow = row
							},
						},
					],
				},
			],
			editRow: {},
			openEditTestDialog: false,
			openWhiteListDialog: false,
			showLoading: false,
			searchData: {
				testName: '',
				startTime: '',
				endTime: '',
			},
			statusMap: ['未开始', '进行中', '已结束'],
			tableData: [],
			page: {
				total: 0,
				pageSize: 20,
				pageNum: 1,
				tableChange: (pageNum) => {
					this.page.pageNum = pageNum
					this.findTestListByParam()
				},
			},
		}
	},
	mounted() {
		this.findTestListByParam()
	},
	methods: {
		Refresh() {
			this.searchData = {
				testName: '',
				startTime: '',
				endTime: '',
			}
			this.findTestListByParam()
		},
		findTestListByParam: async function () {
			let sTime =
				(this.searchData.startTime &&
					moment(this.searchData.startTime).format('YYYY-MM-DD HH:mm:ss')) ||
				''
			let eTime =
				(this.searchData.endTime &&
					moment(this.searchData.endTime).format('YYYY-MM-DD HH:mm:ss')) ||
				''
			//搜索条件
			let param = {
				testName: this.searchData.testName,
				startTime: sTime,
				endTime: eTime,
				pageNum: this.page.pageNum,
				pageSize: this.page.pageSize,
			}

			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await getTestList(param)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.total = total
			} else {
				this.page.total = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style>
.testList .el-table .cell {
	white-space: pre-wrap;
}
</style>
