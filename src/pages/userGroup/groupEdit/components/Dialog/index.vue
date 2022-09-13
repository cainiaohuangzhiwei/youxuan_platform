<template>
	<el-dialog
		title="上传用户分群"
		:visible.sync="localVisible"
		width="50%"
		@open="open"
		:modal-append-to-body="false"
		:close-on-click-modal="false"
	>
		<el-form
			ref="YxForm"
			:model="ruleForm"
			inline="true"
			label-width="10"
			size="small"
			v-loading="isUploading"
			label-position="left"
			:rules="rules"
		>
			<el-form-item label="分群名称" prop="tagName">
				<el-input placeholder="请输入分群名称" v-model="ruleForm.tagName" />
			</el-form-item>

			<el-button
				icon="el-icon-download"
				@click="downloadImpostTemplate"
				size="small"
				type="primary"
				>下载用户分群模板</el-button
			>
			<br />
			<el-form-item label="分群业务" prop="bizType">
				<el-select
					:disabled="row && row.userTagId"
					v-model="ruleForm.bizType"
					placeholder="分群业务"
				>
					<template v-for="item in bizTypeList">
						<el-option
							:key="item.type"
							:label="item.desc"
							:value="item.type"
						></el-option>
					</template>
				</el-select>
			</el-form-item>
			<br />
			<el-form-item label="上传文件" prop="groupExcel">
				<el-upload
					accept=".xls, .xlsx"
					:multiple="false"
					ref="upload"
					action=""
					:http-request="uploadFileMethod"
					:fileList="fileList"
					:on-remove="removeFiles"
					limit="1"
				>
					<el-button slot="trigger" size="small" type="primary"
						>选取文件</el-button
					>
					<div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
				</el-upload>
			</el-form-item>

			<br />
			<el-form-item>
				<el-button type="primary" @click="submitForm('YxForm')">
					确认导入
				</el-button>
			</el-form-item>
		</el-form>
		<div>
			<p>导入说明:</p>
			<p>1. 文件后缀名必须为：xls或xlsx（Excel标准格式）</p>
			<p>2. 用户ID不能为空，且必须存在系统，否则该条数据导入失败</p>
		</div>
	</el-dialog>
</template>
<script>
import { downloadFile } from '@/utils/helper/common'
import { addUserTag, importUserTagRelation } from '@/api/platformUserGroupTag'
import { getUserTagConfig, clearUserTagRelation } from '@/api/questionNaire'

export default {
	name: 'editGroupDialog',
	components: {},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		successCallback: {
			type: Function,
			default: () => () => {},
		},
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
	data() {
		return {
			isUploading: false,
			ruleForm: {
				tagName: '',
				file: '',
				userTagId: '',
				bizType: 0,
			},
			bizTypeList: [],
			fileList: [],
			rules: {
				groupName: [
					{ required: true, message: '请输入分群名称', trigger: 'blur' },
				],
				// bizType: [
				// 	{
				// 		required: true,
				// 		message: '请选择分群类型',
				// 		trigger: ['blur', 'change'],
				// 	},
				// ],
				groupExcel: [
					// { required: true, message: '请选择文件'},
				],
			},
		}
	},

	mounted() {
		this._getUserTagConfig()
	},
	methods: {
		async _getUserTagConfig() {
			let {
				data: { resultData, resultCode },
			} = await getUserTagConfig()
			if (resultCode == 0) {
				this.bizTypeList = resultData.bizTypeList || []
				console.log('bizTypeList', this.bizTypeList)
			}
		},
		open() {
			const { row = {} } = this
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.fileList = []
			if (row.tagName && row.userTagId) {
				this.ruleForm.tagName = row.tagName
				this.ruleForm.userTagId = row.userTagId
				this.ruleForm.bizType = row.bizType
			} else {
				this.ruleForm.tagName = ''
				this.ruleForm.userTagId = ''
			}
		},
		_clearUserTagRelation(tagId) {
			return new Promise((resolve) => {
				// let {
				// 	data: { resultCode },
				// } = await clearUserTagRelation({
				// 	tagId,
				// })
				clearUserTagRelation({
					tagId,
				}).then(() => {
					resolve()
				})
			})
		},
		submitForm(formName) {
			this.$refs[formName].validate(async (valid) => {
				const { file, tagName, userTagId, bizType } = this.ruleForm
				if (!file) {
					this.$message.error('请选择上传文件')
					return
				}
				if (this.row && this.row.clearUserTag) {
					await this._clearUserTagRelation(userTagId)
				}
				if (userTagId) {
					this.uploadExcel(userTagId, file)
					return
				}
				if (valid) {
					const {
						data: { resultCode: resCode, resultData: tagId },
					} = await addUserTag({
						tagName,
						bizType,
					})
					if (resCode == 0) {
						this.uploadExcel(tagId, file)
					} else {
						this.isUploading = false
					}
				} else {
					this.isUploading = false
					this.$message.error('请填写完整上传信息！')
					return false
				}
			})
		},
		// 上传excel
		async uploadExcel(tagId, file) {
			const formData = new FormData()
			this.isUploading = true
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: Date.now(),
					groupId: 2,
					userId: this.$store.state?.user?.userInfo?.userId || '',
					tagId,
				})
			)
			formData.append('excel', file)
			const {
				data: { resultCode },
			} = await importUserTagRelation(formData)
			if (resultCode == 0) {
				this.$message.success('导入成功！')
				this.localVisible = false
				this.successCallback?.()
			}
			this.isUploading = false
		},
		//下载模板
		downloadImpostTemplate() {
			downloadFile('/excel/platform/用户分群-导入用户模板.xlsx')
		},
		// 更新文件
		uploadFileMethod(fileObject) {
			this.ruleForm.file = fileObject.file
		},
		removeFiles() {
			this.ruleForm.file = ''
		},
	},
}
</script>

<style lang="scss" scoped>
.mb20 {
	margin-bottom: 20px;
}
</style>
