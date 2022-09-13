<template>
	<el-dialog
		width="720px"
		:title="options.title"
		:visible.sync="localVisible"
		@open="open"
		@close="close"
	>
		<yx-form
			:rules="rules"
			labelWidth="100px"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="formAction"
			ref="version_form"
		></yx-form>
	</el-dialog>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { addAppVersion, updateAppVersion } from '@/api/cmsAppChannel'
import { uploadFile } from '@/api/image'
export default {
	components: {
		YxForm,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		// 父组件内容
		options: {
			type: Object,
			default: () => ({}),
		},
	},

	data() {
		return {
			dialogData: {
				channelName: '', //APP系统类型
				updateType: 1, //更新类型
				version: '', //版本号
				auditMode: 1, //审核模式
				apk: [], // 安装包
				downloadUrl: '',
				content: '', //更新内容
			},
			dialogCfg: [
				{
					type: 'input',
					dataIndex: 'channelName',
					title: 'APP类型',
					disabled: true,
				},
				{
					type: 'radioMap',
					dataIndex: 'updateType',
					title: '更新类型',
					options: {
						强制更新: 1,
						非强制更新: 2,
					},
				},
				{
					type: 'input',
					dataIndex: 'version',
					title: '版本号',
				},
				{
					type: 'radioMap',
					dataIndex: 'auditMode',
					title: '审核模式',
					options: {
						开启: 1,
						关闭: 2,
					},
				},

				{
					type: 'upload',
					title: '软件安装包',
					dataIndex: 'apk',
					// hide:
					// 	this.$route.params.channelNo == 'IOS' ||
					// 	this.$route.params.channelNo == 'IOS-C',
					uploadAttributes: {
						limit: 1,
						imageName: 'apk',
						// accept: '.apk',
						fileList: [],
						httpRequest: (file) => {
							this.uploadCertificate(file)
						},
					},
				},

				{
					type: 'textarea',
					dataIndex: 'content',
					title: '更新内容',
				},
			],
			rules: {
				updateType: [
					{ required: true, message: '请选择更新类型', trigger: 'blur' },
				],
				version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
				content: [
					{ required: true, message: '请输入更新内容', trigger: 'blur' },
				],
				auditMode: [
					{ required: true, message: '请选择审核模式', trigger: 'blur' },
				],
				apk: [{ required: true, message: '请上传软件安装包', trigger: 'blur' }],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._confirm()
					},
				},
			],
		}
	},

	methods: {
		async _confirm() {
			if (this.dialogData.type == 'check') {
				this.localVisible = false
				return
			}
			const params = Object.assign(this.dialogData, {})
			params.appVersionId = this.options.appVersionId
			let res
			if (!params.appVersionId) {
				res = await addAppVersion(params)
			} else {
				res = await updateAppVersion(params)
			}
			const {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.localVisible = false
				this.$emit('saveAppVersion')
			}
		},
		close() {
			// 清除文件
			!this.dialogCfg[4].dataIndex === 'apk' &&
				this.$refs.version_form &&
				this.$refs.version_form.$refs['apk'][0].clearFiles()
			this.$refs.version_form &&
				this.$refs.version_form.$refs.YxForm.clearValidate()
			this.dialogCfg[4] = {
				type: 'upload',
				title: '软件安装包',
				dataIndex: 'apk',
				uploadAttributes: {
					limit: 1,
					imageName: 'apk',
					accept: '.apk',
					fileList: [],
					httpRequest: (file) => {
						this.uploadCertificate(file)
					},
				},
			}
		},
		// 重置
		open() {
			if (this.options.type == 'check') {
				this.dialogCfg[4] = {
					type: 'input',
					dataIndex: 'downloadUrl',
					title: '软件安装包',
					disable: true,
				}
				this.dialogCfg.forEach((item) => {
					item.disabled = true
				})
			} else if (this.options.type == 'edit') {
				this.dialogCfg.forEach((item) => {
					if (item.dataIndex == 'version') {
						item.disabled = true
					} else if (item.dataIndex == 'apk') {
						item.uploadAttributes.fileList = [
							{
								name: this.options.downloadUrl,
								url: this.options.downloadUrl,
							},
						]
					} else {
						if (item.dataIndex != 'channelName') item.disabled = false
					}
				})
			} else {
				this.dialogCfg.forEach((item) => {
					if (item.dataIndex != 'channelName') item.disabled = false
				})
			}
			// ios上传按钮必须关闭
			if (this.options.platform === 1) this.dialogCfg[4].hide = true

			this.dialogData = Object.assign(this.options, {})
		},
		// 上传安装包
		async uploadCertificate(file) {
			const formData = new FormData()
			formData.append('file', file.file)
			formData.append('filename', file.file.name)
			formData.append('name', 'file')
			// 文件类型：1-安卓安装包
			formData.append('fileType', 1)
			const {
				data: { resultCode, resultData },
			} = await uploadFile(formData)
			if (resultCode == 0 && resultData.url.length > 0) {
				this.$message.success('上传成功')
				this.dialogData.downloadUrl = resultData.url
				this.dialogData.apk = [resultData.url]
				this.dialogCfg[4].uploadAttributes.fileList = [
					{
						name: resultData.url,
						url: resultData.url,
					},
				]
			} else {
				this.$message.error('上传失败, 请重新上传')
			}
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
}
</script>
