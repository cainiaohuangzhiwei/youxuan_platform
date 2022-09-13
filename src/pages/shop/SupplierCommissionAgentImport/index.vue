<template>
	<div>
		<yx-form
			ref="uploadTaxImport"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</yx-form>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1、第一列为店主ID，第二列为代办类型。
			<br />
			2、一次导入最高不超过3000行。
			<br />
			3、如导入ID为已有身份的ID，则视为更新操作。
			<br />
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadTaxImport } from '@/api/taxAdministration'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'ReconciliationData',
	components: { YxForm },
	data() {
		return {
			storeData: {},
			// TODO： 控件渲染数据
			storeFormOptions: [
				{
					type: 'upload',
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
			storeActions: [
				{
					title: '导入',
					type: 'primary',
					click: () => {
						if (
							this.$refs['uploadTaxImport'].$refs.fileStream[0].uploadFiles &&
							this.$refs['uploadTaxImport'].$refs.fileStream[0].uploadFiles
								.length === 0
						) {
							this.$message.error('请先添加文件后点击导入！')
							return
						}

						this.$refs['uploadTaxImport'].$refs.fileStream[0].submit()
					},
				},
				{
					title: '下载模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/supplier/代办店主导入模板1.0.xlsx?v=0.01')
					},
				},
				{
					title: '查看导入历史记录',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `SupplierCommissionAgentImportLog`,
						})
					},
				},
			],
		}
	},
	methods: {
		async _uploadTaxImport(file) {
			let formData = new FormData()
			formData.append(
				'paramJsonStr',
				JSON.stringify({
					clerkId: this.$store.state.user.userInfo.clerkId,
					userId: this.$store.state.user.userInfo.userId,
					groupId: 2,
				})
			)
			formData.append('file', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await uploadTaxImport(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['uploadTaxImport'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>

<style></style>
