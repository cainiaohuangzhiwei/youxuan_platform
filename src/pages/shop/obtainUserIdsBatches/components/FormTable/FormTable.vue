<template>
	<div class="downloadCenter">
		<basicContainer>
			创建人：
			<el-input
				style="width: 380px; margin-bottom: 20px"
				placeholder="模糊搜索"
				v-model="addUserName"
				class="input-with-select"
			>
				<el-button
					slot="append"
					@click="getData104"
					icon="el-icon-search"
				></el-button>
			</el-input>
			<el-button
				style="float: right"
				v-auth="'addOrganizationConvertTask'"
				type="primary"
				@click="addTaskLoding = true"
				>新建</el-button
			>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			>
				<template slot="successNum" slot-scope="scope">
					<div v-if="scope.row.status === 1">未执行</div>
					<div v-if="scope.row.status === 2">执行中</div>
					<div v-if="scope.row.status === 3">
						成功：{{ scope.row.successNum }}<br />
						失败：{{ scope.row.failNum }}
					</div>
					<div v-if="scope.row.status === 4">执行失败</div>
				</template>
			</yx-table>
			<!-- //新建任务 -->
			<Dialog
				title="新建任务"
				:visible="addTaskLoding"
				width="40%"
				height="10%"
				:bottomBtn="addTaskBottomBtn"
				@before-close="close"
			>
				<yx-form
					ref="form"
					:inline="false"
					:items="uploadItem"
					:data="uploadData"
					:formAction="storeActions"
					:rules="funRules"
					labelWidth="150px"
				>
				</yx-form>
				<el-button
					style="margin-left: 150px"
					type="primary"
					@click="downloadFile('/excel/platform/批量导入名单.xlsx')"
					>下载模板</el-button
				>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
// import { uploadAttachmentList } from '@/api/invoice'

import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import {
	queryOrganizationConvertTaskList,
	addOrganizationConvertTask,
	// deleteOrganizationConvertTask,
} from '@/api/business'
import { imgCosServerPath } from '@/utils/imageTool'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxTable,
		Dialog,
		YxForm,
	},
	props: [],
	data() {
		return {
			loading: false,
			// uploadAttachmentList: uploadAttachmentList,
			downloadFile,
			addTaskLoding: false,
			uploadData: {
				taskName: '',
			},
			funRules: {
				taskName: [
					{ required: true, message: '请填写任务名称!', trigger: 'blur' },
					{ max: 20, message: '任务名称长度不超过20个字符', trigger: 'blur' },
				],
				fileStream: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.$refs['form'].$refs.fileStream[0].uploadFiles &&
								this.$refs['form'].$refs.fileStream[0].uploadFiles.length === 0
							) {
								callback(new Error('请添加文件!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			uploadItem: [
				{
					title: '任务名称',
					type: 'input',
					dataIndex: 'taskName',
				},
				{
					type: 'upload',
					title: '导入名单',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						showBtn: true,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._uploadTaxImport(file, 'excel'),
					},
					class: 'excel-upload',
				},
			],
			addTaskBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						if (
							this.$refs['form'].$refs.fileStream[0].uploadFiles &&
							this.$refs['form'].$refs.fileStream[0].uploadFiles.length === 0
						) {
							this.$message.error('请先添加文件后点击确定！')
							return
						}
						if (!this.uploadData.taskName) {
							this.$message.error('请填写任务名称后点击确定！')
							return
						}
						this.$refs.form.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.$refs['form'].$refs.fileStream[0].submit()
							}
						})
					},
				},
			],
			tableData104: [],
			addUserName: '',
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'taskName',
					title: '任务名称',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'string',
					dataIndex: 'addUserName',
					title: '创建人',
				},
				{
					type: 'custom',
					dataIndex: 'successNum',
					title: '状态',
				},

				{
					type: 'action',
					title: '操作',
					width: '120',
					actions: [
						{
							title: '下载结果',
							click: (row) => {
								row.convertResultUrl = row.convertResultUrl.replace(
									'/data/',
									''
								)

								window.open(imgCosServerPath + row.convertResultUrl)
							},
							customRender: (action, row) => {
								action.hide =
									row.addUserId != this.$store.state.user.userInfo.userId ||
									row.status != 3
								return action
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
	computed: {
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
	},
	created() {
		this.getData104(true)
	},

	methods: {
		async _uploadTaxImport(file) {
			let formData = new FormData()
			formData.append('taskName', this.uploadData.taskName)
			formData.append('addUserId', this.$store.state.user.userInfo.userId)
			formData.append('file', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await addOrganizationConvertTask(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.addTaskLoding = false
				this.getData104(true)
				this.close()
			}
			// 清空文件
			this.$refs['form'].$refs.fileStream[0].clearFiles()
		},
		async getData104(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			paramJson.addUserName = this.addUserName
			const {
				data: { resultCode, resultData, total },
			} = await queryOrganizationConvertTaskList(paramJson)
			if (resultCode == 0) {
				this.tableData104 = resultData
				this.page104.count = total
			}
			this.loading = false
		},
		// 搜索条件
		findSearchParams104(flag) {
			let paramJson = {
				pageSize: 10,
				pageNum: 1,
			}
			paramJson.pageSize = this.page104.length
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			paramJson.pageNum = this.page104.currentPage
			return paramJson
		},
		close() {
			this.$refs['form'].$refs.fileStream[0].clearFiles()
			this.uploadData.taskName = ''
			this.addTaskLoding = false
		},
	},
}
</script>
