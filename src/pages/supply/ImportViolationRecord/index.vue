<template>
	<div>
		<yx-form
			:inline="true"
			:data="formInline"
			:items="formCfg"
			:formAction="formAction"
		></yx-form>
		<el-row>
			<div class="el-form-item__label">
				导入文件:<span class="ml20">{{ this.fileName }}</span>
			</div>
		</el-row>
		<el-row>
			<div class="el-form-item__label">
				导入日期:<span class="ml20">{{ this.addTime | moment }}</span>
			</div>
		</el-row>
		<el-row>
			<div class="el-form-item__label">
				总行数:<span class="ml20" v-text="this.rowCount"></span>
			</div>
			<div class="el-form-item__label">
				导入成功数:<span class="ml20" v-text="this.successCount"></span>
			</div>
			<div class="el-form-item__label">
				导入失败数:<span class="ml20" v-text="this.errorCount"></span>
			</div>
			<div class="el-form-item__label">
				未导入数:<span class="ml20" v-text="this.noImportCount"></span>
			</div>
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
		<Dialog
			:title="'已创建导出任务，请稍后到下载列表下载数据'"
			:visible="exportTaskDialog"
			:width="'30%'"
			:bottomBtn="exportTaskBtn"
		>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { imgCosServerPath } from '@/utils/imageTool'
import Dialog from '@/components/Dialog'
import { importDataItemList, importItemExport } from '@/api/supply'
export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
	},

	data() {
		return {
			loading: false,
			exportTaskDialog: false,
			formInline: {
				status: '0',
			},
			fileName: '',
			addTime: '',
			rowCount: '',
			successCount: '',
			errorCount: '',
			noImportCount: '',
			selectionData: [],
			importDataId: this.$route.params.importDataId,
			exportTaskBtn: [
				{
					title: '进入下载中心',
					auth: '',
					click: () => {
						this.$router.push({
							path: `/business/downloadCenter`,
						})
						this.exportTaskDialog = false
					},
				},
			],
			formCfg: [
				{
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					label: 'label',
					options: [
						{
							status: '0',
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
						this._importDataItemList()
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
					this._importDataItemList()
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
				this.$emit('update:visible', val)
			},
		},
	},
	created() {
		this._importDataItemList()
	},
	methods: {
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
		_importDataItemList: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			paramJson.importDataId = this.importDataId
			paramJson.status = this.formInline.status
			let res = await importDataItemList(paramJson)

			res = res.data
			if (res.resultCode === 0) {
				this.list = res.resultData.list
				this.addTime = res.resultData.addTime
				this.fileName = res.resultData.fileName
				this.page.count = res.resultData.count
				this.rowCount = res.resultData.rowCount
				this.successCount = res.resultData.successCount
				this.errorCount = res.resultData.failCount
				this.noImportCount = res.resultData.ingCount
			}
			this.loading = false
		},
		exportExcel: async function () {
			let paramJson = this.findSearchParams()
			paramJson.importDataId = this.importDataId
			// paramJson.clerkId = this.row.clerkId
			paramJson.listPath = '商家管理<导入明细'
			paramJson.importDataItemIdList = this.selectionData.map(
				(item) => item.importDataItemId
			)

			let paramJson_ = { ...paramJson }
			let {
				data: { resultCode, resultData },
			} = await importItemExport(paramJson_)
			if (resultCode == 0) {
				if (resultData.remoteFilePath) {
					resultData.remoteFilePath = resultData.remoteFilePath.replace(
						'/data/yhtplusFile/',
						''
					)
					window.open(imgCosServerPath + resultData.remoteFilePath)
				} else {
					if (resultData.exportDelay) {
						this.exportTaskDialog = true
					}
				}
			}
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
	},
}
</script>

<style lang="scss" scoped></style>
