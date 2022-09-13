<template>
	<div>
		<el-dialog
			width="30%"
			title="导入Excel"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-form :label-position="'left'" label-width="85px">
				<el-form-item label="下载模板">
					<el-button type="primary" size="small" @click="handleDownExcel"
						>下载Excel模板</el-button
					>
				</el-form-item>
			</el-form>

			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="batchData"
				:rules="funRules"
				:formAction="funAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import {
	batchAddCusServiceTrusteeship,
	importCusServiceTrusteeship,
} from '@/api/service'
import { downloadFile } from '@/utils/helper/common'
import YxForm from '@wg-vue-materials/yx-form'

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
	},

	data() {
		return {
			item: [
				{
					type: 'upload',
					title: '上传Excel',
					dataIndex: 'cusServiceTrusteeshipList',
					uploadAttributes: {
						imageName: 'cusServiceTrusteeshipList',
						action: this.uploadImageList,
						fileList: [],
						beforeUpload: (item, files) => {
							this.item[0].uploadAttributes.fileList = []
							this.item[0].uploadAttributes.fileList.push(files)
						},
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'cusServiceTrusteeshipList'),
					},
				},
			],
			batchData: {
				cusServiceTrusteeshipList: [],
			},
			funRules: {
				cusServiceTrusteeshipList: [
					{ required: true, message: '请上传有数据的Excel', trigger: 'blur' },
				],
			},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			uploadImageList: '/yhtplus/webImport/importCusServiceTrusteeship.action',
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
		// 保存
		async submitForm() {
			const res = await batchAddCusServiceTrusteeship(this.batchData)

			if (res.data.resultCode === 0) {
				this.$message.success(res.data.resultMsg)
				this.$emit('fatherMethodInit')
				this.resetForm()
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},

		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/platform/客服托管模板.xlsx`)
		},

		// 上传Excel
		async uploadImageHttpRequest(params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ timeStamp: new Date().getTime(), groupId: 2 })
			)
			formData.append('formId', '#excelTrust')
			formData.append('excel', params.file)
			const res = await importCusServiceTrusteeship(formData)
			this.batchData.cusServiceTrusteeshipList = []
			if (
				res.data.resultData.cusServiceTrusteeshipList &&
				res.data.resultData.cusServiceTrusteeshipList.length > 0
			) {
				this.item[0].uploadAttributes.fileList = [params.file]
				this.batchData.cusServiceTrusteeshipList =
					res.data.resultData.cusServiceTrusteeshipList
			} else if (res.status == -4) {
				return this.$message.error(res.data.msg)
			} else if (res.data.resultCode != 0) {
				return this.$message.error(res.data.resultMsg)
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
