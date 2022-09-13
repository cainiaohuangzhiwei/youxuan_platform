<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="formOptions"
			:formAction="formActions"
		>
		</yx-form>
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
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findImportRecordList } from '@/api/webImport.js'
import DetailDialog from './components/DetailDialog'
export default {
	name: 'ImportGoodsHistory',
	components: { YxForm, YxTable, DetailDialog },
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
				importType: 13,
				clerkId: this.$store.state.user.userInfo.clerkId,
				length: '',
				startIndex: '',
			},
			formOptions: [
				{
					type: 'select',
					title: '导入状态',
					label: 'name',
					dataIndex: 'status',
					placeholder: '请选择导入状态',
					options: this.$store.state.leadin.importStatus,
				},
				{
					title: '导入时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '文件名称',
					type: 'input',
					dataIndex: 'fileName',
					placeholder: '请输入文件名称',
				},
				{
					title: '创建人',
					type: 'input',
					dataIndex: 'clerkName',
					placeholder: '请输入创建人',
				},
			],
			formActions: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this._findImportRecordList(e)
					},
				},
			],
			tableColumns: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '导入时间',
				},
				{
					type: 'string',
					dataIndex: 'fileName',
					title: '导入文件名称',
				},
				{
					type: 'string',
					dataIndex: 'totalRowCount',
					title: '总行数/成功/失败',
					customRender: (row) => {
						return `${row.rowCount} / ${row.successCount} / ${row.errorCount}`
					},
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						const optionsArr = ['', '导入中', '导入完成', '导入失败']
						return optionsArr[row.status]
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
		async _findImportRecordList() {
			this.tableLoding = true
			let params = this.searchData
			params = {
				...params,
				length: this.page.length,
				startIndex: this.page.currentPage - 1,
			}
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
