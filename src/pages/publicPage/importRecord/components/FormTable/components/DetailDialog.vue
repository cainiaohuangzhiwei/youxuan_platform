<template>
	<div>
		<el-dialog
			width="70%"
			title="导入详情"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:modal-append-to-body="false"
			@open="open"
		>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<el-row class="detail-info">
				导入文件: <span>{{ this.fileName }}</span>
			</el-row>
			<el-row class="detail-info">
				导入日期: <span>{{ this.addTime | moment }}</span>
			</el-row>
			<el-row class="detail-info">
				总行数: <span class="mr30">{{ this.rowCount }}</span> 导入成功数:
				<span class="mr30">{{ this.successCount }}</span> 导入失败数:
				<span class="mr30">{{ this.errorCount }}</span> 未导入数:<span
					class="mr30"
					>{{ this.noImportCount }}</span
				>
			</el-row>
			<el-row>
				<yx-table
					v-loading="loading"
					:select="true"
					:columns="tableColumns"
					:pagination="page"
					:data="list"
					:selectionChange="selectionChange"
				></yx-table>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findImportRecordDetailList, exportDataItem } from '@/api/webImport'
import { downloadFile } from '@/utils/helper/common'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		row: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			loading: false,
			formInline: {
				status: '',
			},
			fileName: '',
			addTime: '',
			rowCount: '',
			successCount: '',
			errorCount: '',
			noImportCount: '',
			selectionData: [],
			formCfg: [
				{
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					label: 'label',
					options: [
						{
							status: '',
							label: '全部',
						},
						{
							status: '1',
							label: '导入中',
						},
						{
							status: '2',
							label: '导入成功',
						},
						{
							status: '3',
							label: '导入失败',
						},
					],
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'default',
					click: () => {
						this._callImportRecordDetailList(true)
					},
				},
				{
					title: '导出excel',
					type: 'primary',
					click: () => {
						this.exportExcel()
					},
				},
			],
			list: [],
			tableColumns: [
				{
					dataIndex: 'rowNumber',
					title: 'Excel表格行数',
				},
				{
					title: '状态',
					dataIndex: 'fileName',
					customRender: (row) => {
						if (row.status == 1) {
							return '导入中'
						} else if (row.status == 2) {
							return '导入成功'
						} else if (row.status == 3) {
							return '导入失败'
						}
					},
				},
				{
					dataIndex: 'tip',
					width: '500',
					title: '备注',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._callImportRecordDetailList()
				},
			},
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.formInline.status = ''
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		async open() {
			this.fileName = this.row.fileName || '无'
			this.addTime = this.row.addTime
			await this._callImportRecordDetailList()
		},
		findSearchParams(flag) {
			let paramJson = this.formInline
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_callImportRecordDetailList: async function (flag) {
			this.loading = true
			let parameters = this.findSearchParams(flag)
			parameters.importDataId = this.row.importDataId
			parameters.clerkId = this.row.clerkId
			delete parameters.importDataItemIdList
			let {
				data: { resultCode, resultData },
			} = await findImportRecordDetailList(parameters)

			if (resultCode == 0) {
				this.list = resultData.importDataItemList
				this.page.count = resultData.count
				this.rowCount = resultData.rowCount
				this.successCount = resultData.successCount
				this.errorCount = resultData.errorCount
				this.noImportCount = resultData.noImportCount
			}
			this.loading = false
		},
		exportExcel: async function () {
			let paramJson = this.findSearchParams()
			paramJson.importDataId = this.row.importDataId
			paramJson.clerkId = this.row.clerkId
			paramJson.importDataItemIdList = this.selectionData.map(
				(item) => item.importDataItemId
			)
			let { data } = await exportDataItem(paramJson)
			downloadFile(data, '导入记录.xlsx')
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
	},
}
</script>

<style lang="scss" scoped>
.detail-info {
	margin-bottom: 10px;
}
.detail-info .mr30 {
	margin-right: 30px;
}
</style>
