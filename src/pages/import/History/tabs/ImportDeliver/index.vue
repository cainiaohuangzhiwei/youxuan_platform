<!--
 * @Description: 发货单导入记录
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-26 16:39:09
 * @LastEditTime: 2020-09-09 22:02:21
 * @LastEditors: Navi
-->
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
			v-loading="tableLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
		</YxTable>
	</div>
</template>
<script>
import moment from 'moment'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findImportRecordList } from '@/api/webImport.js'
export default {
	name: 'ImportDeliver',
	components: { YxForm, YxTable },
	data() {
		return {
			isShowDialog: false,
			tableLoading: false,
			dialogData: {},
			searchData: {
				status: '',
				fileName: '',
				clerkName: '',
				startTime: '',
				endTime: '',
				importType: 3,
				clerkId: this.$store.state.user.userInfo.clerkId,
				length: '',
				startIndex: '',
			},
			formOptions: [
				{
					title: '导入类型',
					placeholder: '发货单导入记录',
					disabled: true,
				},
				{
					type: 'select',
					title: '状态',
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
					title: '操作人',
					type: 'input',
					dataIndex: 'clerkName',
					placeholder: '请输入操作人',
				},
			],
			formActions: [
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
								this.$emit('details', row)
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
			this.tableLoading = true
			let params = this.searchData
			params = {
				...params,
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			}
			let {
				data: { resultCode, resultData },
			} = await findImportRecordList(params)
			if (resultCode === 0) {
				this.tableData = resultData.importDataList
				this.page.count = resultData.count
			}
			this.tableLoading = false
		},
	},
}
</script>
