<template>
	<div>
		<yx-table
			:select="false"
			v-loading="loading104"
			:columns="tableColumns104"
			:data="tableData104"
		>
			<template slot="versionName" slot-scope="scope">
				<div>
					<el-link
						:href="imgCosServerPath + scope.row.attachmentUrl"
						target="_blank"
						type="primary"
						>{{ scope.row.versionName }}</el-link
					>
				</div>
			</template>
		</yx-table>
		<Dialog
			:title="dialogTitle126"
			:visible.sync="dialogVisible126"
			:width="dialogWidth126"
			:bottomBtn="dialogBottomBtn126"
		>
			<yx-table
				:select="false"
				v-loading="loading105"
				:columns="tableColumns105"
				:data="tableData105"
			>
				<template slot="versionName" slot-scope="scope">
					<div>
						<el-link
							:href="imgCosServerPath + scope.row.attachmentUrl"
							target="_blank"
							type="primary"
							>{{ scope.row.versionName }}</el-link
						>
					</div>
				</template>
			</yx-table>
		</Dialog>
		<Dialog
			:title="dialogTitle127"
			:visible.sync="dialogVisible127"
			:width="dialogWidth127"
			:bottomBtn="dialogBottomBtn127"
		>
			<yx-form
				ref="dialog104"
				labelWidth="100px"
				:data="formData104"
				:items="formCfg104"
			></yx-form>
		</Dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import {
	agreementList,
	historyAgreementVersion,
	updateAgreementVersion,
} from '@/api/agreement'
import { uploadAttachmentList } from '@/api/attachment'
import { imgCosServerPath } from '@/utils/imageTool'
export default {
	components: {
		YxTable,
		YxForm,
		Dialog,
	},
	data() {
		return {
			imgCosServerPath,
			isShow: false,
			formData104: {
				htmlFile: [],
				agreementId: null,
			},
			formCfg104: [
				{
					type: 'upload',
					title: '上传文件',
					dataIndex: 'htmlFile',
					uploadAttributes: {
						action: '',
						accept: 'text/html',
						fileList: [],
						onChange: (item, files) => {
							this.formCfg104[0].uploadAttributes.fileList = []
							this.formCfg104[0].uploadAttributes.fileList.push(files)
						},
						httpRequest: (file) => this._uploadAttachmentList(file),
					},
				},
			],
			dialogTitle127: '上传文件',
			dialogVisible127: false,
			dialogWidth127: '500px',
			dialogBottomBtn127: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.saveUpdatedAgreement()
					},
				},
			],
			loading105: false,
			tableColumns105: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '版本更新时间',
					width: 200,
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
					width: 80,
				},
				{
					type: 'custom',
					dataIndex: 'versionName',
					title: '线上版本',
				},
			],
			tableData105: [],
			dialogTitle126: '《云货优选平台服务协议》历史版本',
			dialogVisible126: false,
			dialogWidth126: '800px',
			dialogBottomBtn126: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible126 = false
					},
				},
			],
			loading104: false,
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'agreementId',
					title: '协议ID',
					width: 80,
				},
				{
					type: 'string',
					dataIndex: 'agreementName',
					title: '协议名称',
					width: 200,
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '线上版本更新时间',
					width: 200,
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
					width: 80,
				},
				{
					type: 'custom',
					dataIndex: 'versionName',
					title: '线上版本',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '更新版本',
							auth: 'updateAgreementVersion',
							click: ({ agreementId }) => {
								this.formData104 = {
									htmlFile: [],
									agreementId,
								}
								this.formCfg104[0].uploadAttributes.fileList = []
								this.dialogVisible127 = true
							},
						},
						{
							title: '查看历史版本',
							auth: 'historyAgreementVersion',
							click: ({ agreementId, agreementName }) => {
								this.dialogVisible126 = true
								this.dialogTitle126 = `《${agreementName}》历史版本`
								this._historyAgreementVersion(agreementId)
							},
						},
					],
				},
			],
			tableData104: [],
		}
	},
	methods: {
		saveUpdatedAgreement: async function () {
			if (!this.formData104.htmlFile.length) {
				this.$message.warning('请上传文件')
				return
			}
			this.$confirm(
				'上传该文件后会立刻全量更新，届时会影响到所有在线用户，确定需要更新吗？',
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultCode },
							} = await updateAgreementVersion({
								agreementId: this.formData104.agreementId,
								attachment: this.formData104.htmlFile[0],
							})
							if (resultCode == 0) {
								this.dialogVisible127 = false
								this.init()
							}
						}
					},
				}
			)
		},
		_uploadAttachmentList: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: this.$store.state.user.userInfo.groupId || '',
					attachmentType: 4,
				})
			)
			formData.append('formId', '#htmlForm')
			formData.append('htmlFile', params.file)
			const {
				data: { resultData, resultCode },
			} = await uploadAttachmentList(formData)
			if (resultCode == 0) {
				this.formData104.htmlFile = resultData.attachmentList
			}
		},
		_historyAgreementVersion: async function (agreementId) {
			this.loading105 = true
			let {
				data: { resultCode, resultData },
			} = await historyAgreementVersion({
				agreementId,
			})
			this.loading105 = false
			if (resultCode == 0) {
				this.tableData105 = resultData || []
			}
		},
		init: async function () {
			this.loading104 = true
			let {
				data: { resultCode, resultData },
			} = await agreementList()
			this.loading104 = false
			if (resultCode == 0) {
				this.isShow = true
				this.tableData104 = resultData || []
			}
		},
	},
}
</script>
