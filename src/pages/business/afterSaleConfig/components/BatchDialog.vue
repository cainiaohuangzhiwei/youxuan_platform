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
						>下载类目属性导入模板</el-button
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
			<span> 说明：请下载类目属性导入模板，按照属性导入模板说明进行导入 </span>
		</el-dialog>
	</div>
</template>

<script>
import { importCategoryAttribute } from '@/api/yhtPlusCmsGoodsCategoryAttribute'
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
			excel: '',
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
							this.$refs.form.$refs.YxForm.resetFields()
						},
						onRemove: () => {
							console.log(111111111)
							this.excel = ''
							this.batchData.cusServiceTrusteeshipList = []
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
			uploadImageList: '/yhtplus/webImport/importCategoryAttribute.action',
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
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ timeStamp: new Date().getTime(), groupId: 2 })
			)
			formData.append('formId', '#excelForm')
			formData.append('excel', this.excel)
			const res = await importCategoryAttribute(formData)
			console.log(res, 'ssfsdfsdfsdfsd')
			// const res = await batchAddCusServiceTrusteeship(this.batchData)

			if (res.data.resultCode == 0) {
				this.batchData.cusServiceTrusteeshipList = []
				this.item[0].uploadAttributes.fileList = []
				this.$message.success(res.data.resultMsg)
				this.$emit('fatherMethodInit')
				this.resetForm()
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
			this.excel = ''
			this.batchData.cusServiceTrusteeshipList = []
			this.item[0].uploadAttributes.fileList = []
		},

		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/goods/类目属性导入模板.xlsx`)
		},

		// 上传Excel
		async uploadImageHttpRequest(params) {
			this.excel = params.file
			this.item[0].uploadAttributes.fileList = [params.file]
			this.batchData.cusServiceTrusteeshipList = [params.file]
		},
	},
}
</script>

<style lang="scss" scoped></style>
