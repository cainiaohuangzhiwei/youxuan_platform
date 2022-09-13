<template>
	<div>
		<el-dialog
			width="30%"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
			:destroy-on-close="true"
		>
			<yx-form
				ref="form"
				:inline="false"
				:data="formInline"
				:items="formCfg"
				:formAction="funAction"
				:rules="funRules"
			>
				<template #downloadTmp>
					<el-button
						class="mr20"
						icon="el-icon-download"
						@click="downloadImpostTemplate"
						size="small"
						type="primary"
						>下载模板</el-button
					>
				</template>
			</yx-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import {
	importToBindDepartmentId,
	impostInviteCodeBatch,
	importAddOrganizationTagToOrganization,
} from '@/api/shopList'
import { downloadFile } from '@/utils/helper/common'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		importType: {
			type: String,
			default: '',
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			impostUrl: '',
			formInline: {
				inviteCodeCount: '',
				usefulTime: '',
				remark: '',
				file: '',
			},
			formCfg: [
				{
					type: 'custom',
					title: '下载模板：',
					dataIndex: 'downloadTmp',
				},
				{
					type: 'upload',
					dataIndex: 'file',
					uploadAttributes: {
						limit: 1,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._upload(file),
					},
					class: 'excel-upload',
				},
			],
			funRules: {
				file: [{ required: true, message: '请上传Excel', trigger: 'blur' }],
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
	methods: {
		async _upload(params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					clerkId: this.$store.state.user.userInfo.clerkId,
				})
			)
			formData.append('fileToUpload', params.file)
			formData.append('formId', '#goodsForm')
			// this.uploadParam = formData
			let res = ''
			if (this.importType == 'importDepartment') {
				res = await importToBindDepartmentId(formData)
			} else if (this.importType == 'importInviteCode') {
				res = await impostInviteCodeBatch(formData)
			} else if (this.importType == 'importMarking') {
				res = await importAddOrganizationTagToOrganization(formData)
			}
			let {
				data: { resultCode, resultMsg, resultData },
			} = res
			if (resultCode === 0) {
				if (resultData.errorMsg) {
					this.$message.error(resultData.errorMsg)
				} else {
					this.$message.success(resultMsg)
				}
			}
		},
		downloadImpostTemplate() {
			if (this.importType == 'importDepartment') {
				downloadFile('/excel/platform/批量导入维护部门.xlsx')
			} else if (this.importType == 'importInviteCode') {
				downloadFile('/excel/platform/批量导入邀请码.xlsx')
			} else if (this.importType == 'importMarking') {
				downloadFile('/excel/platform/批量导入店铺标签.xlsx')
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
