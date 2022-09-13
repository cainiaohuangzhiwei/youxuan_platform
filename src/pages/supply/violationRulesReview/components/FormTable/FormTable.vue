<template>
	<div class="downloadCenter">
		<basicContainer>
			<el-button
				style="margin-bottom: 20px"
				type="primary"
				icon="el-icon-upload"
				@click="violationRecords"
				>导入商家违规记录</el-button
			>
			<el-button icon="el-icon-bottom" @click="handleDownExcel"
				>下载违规单导入模板</el-button
			>

			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			>
			</yx-table>
			<!-- //导入 -->
			<Dialog
				title="导入商家违规记录"
				:visible="importViolationsLoding"
				width="20%"
				height="10%"
				@before-close="importViolationsLoding = false"
			>
				<yx-form
					style="margin-top: 60px"
					ref="ImportViolations"
					:inline="true"
					:items="importItem"
					:data="importData"
					labelWidth="80px"
				>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
import { importDataList, importViolation } from '@/api/supply'

export default {
	components: {
		BasicContainer,
		YxTable,
		YxForm,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			tableData104: [],
			importViolationsLoding: false,
			importData: {
				goodsFile: [],
			},
			importItem: [
				{
					type: 'upload',
					dataIndex: 'goodsFile',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._impostInvoice(file),
					},
					class: 'excel-upload',
				},
			],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'fileName',
					title: '导入文件名称',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '复核状态',
					customRender: (row) => {
						const arr = ['', '复核中', '复核完成', '复核失败']
						return arr[row.status] || '-'
					},
				},
				{
					type: 'date',
					dataIndex: 'createTime',
					title: '导入时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					actions: [
						{
							title: '查看详情',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								this.$router.push({
									path: `/supply/ImportViolationRecord/${row.importDataId}/${row.status}`,
								})
							},
						},
					],
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData104()
				},
			},
		}
	},

	created() {
		this.getData104(true)
	},

	methods: {
		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/goods/违规单复核导入模板.xlsx`)
		},
		//弹窗
		violationRecords() {
			this.importData.goodsFile = []
			this.importViolationsLoding = true
		},
		//导入
		async _impostInvoice(file) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,

					organizationId: this.$store.state.user.userInfo.organizationId,
				})
			)
			formData.append('formId', '#goodsForm')
			formData.append('file', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await importViolation(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.importViolationsLoding = false
				this.getData104(true)
			}
			// 清空文件
			this.$refs['ImportViolations'].$refs.fileStream[0].clearFiles()
		},
		async getData104(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			paramJson.userName = this.$store.state.user.userInfo.clerkName
			const {
				data: { resultCode, resultData },
			} = await importDataList(paramJson)
			if (resultCode == 0) {
				this.tableData104 = resultData.list
				this.page104.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page104.length,
					startIndex: (this.page104.currentPage - 1) * this.page104.length,
				}
			)
			return paramJson
		},
	},
}
</script>
