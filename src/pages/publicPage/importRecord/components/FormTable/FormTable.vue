<template>
	<div>
		<div class="title_css">导入类型：{{ searchData.title }}</div>
		<wg-form
			:inline="true"
			:data="searchData"
			:items="formOptions"
			:formAction="formActions"
			labelWidth="6em"
		>
		</wg-form>
		<YxTable
			v-loading="tableLoding"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
		</YxTable>
		<DetailDialog :visible.sync="DetailDialog" :row="row" />
	</div>
</template>
<script>
import moment from 'moment'
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import DetailDialog from './components/DetailDialog'
import { findImportRecordList } from '@/api/webImport.js'
export default {
	name: 'publicPage',
	components: { WgForm, YxTable, DetailDialog },
	data() {
		return {
			isShowDialog: false,
			tableLoding: false,
			DetailDialog: false,
			dialogData: {},
			searchData: {
				status: '',
				fileName: '',
				clerkName: '',
				startTime: '',
				endTime: '',
				importType: this.$route.params.type, //查询导入详情类型
				title: decodeURIComponent(this.$route.params.title),
				clerkId: this.$store.state.user.userInfo.clerkId,
				length: '',
				startIndex: '',
			},
			formOptions: [
				{
					type: 'select',
					title: '状态',
					label: 'name',
					dataIndex: 'status',
					placeholder: '请选择导入状态',
					options: this.$store.state.leadin.importStatus,
					colSpan: 6,
				},
				{
					title: '导入时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
					colSpan: 12,
				},
				{
					title: '文件名称',
					type: 'input',
					dataIndex: 'fileName',
					placeholder: '请输入文件名称',
					colSpan: 6,
				},
				{
					title: '操作人',
					type: 'input',
					dataIndex: 'clerkName',
					placeholder: '请输入操作人',
					colSpan: 6,
				},
			],
			formActions: [
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._findImportRecordList(true)
					},
				},
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '导入生成时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'fileName',
					title: '导入文件名称',
					customRender: (row) => {
						return row.fileName
					},
				},
				{
					type: 'string',
					dataIndex: 'totalRowCount',
					title: '总行数/成功/失败',
					customRender: (row) => {
						return `${row.rowCount}/${row.successCount}/${row.errorCount}`
					},
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
					customRender: (row) => {
						return row.clerkName
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						let str = ''
						if (row.status === 1) {
							str = '导入中'
						} else if (row.status === 2) {
							str = '导入完成'
						} else if (row.status === 3) {
							str = '导入失败'
						}
						return str
					},
				},
				{
					type: 'action',
					width: 150,
					title: '操作',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.DetailDialog = true
								this.row = row
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
					this._findImportRecordList()
				},
			},
			tableData: [],
		}
	},
	created() {
		this.searchData.startTime = moment().startOf('day').valueOf()
		this.searchData.endTime = moment().endOf('day').valueOf()
	},
	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		async _findImportRecordList(flag) {
			this.tableLoding = true
			let params = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await findImportRecordList(params)
			if (resultCode === 0) {
				this.tableData = resultData.importDataList
				this.page.count = resultData.count
			}
			this.tableLoding = false
		},
	},
}
</script>

<style>
.title_css {
	font-weight: 700;
	margin-bottom: 30px;
}
</style>
