<template>
	<div>
		<yx-form
			ref="impostSupplierService"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</yx-form>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1，文件后缀名必须为：xls或xlsx（Excel标准格式），不可超过65535行。<br />
			2，商家名称必须存在系统，且没有绑定过七鱼ID，否则导入失败;<br />
			3，七鱼账号ID必须正确，否则导入失败；<br />
			4，状态不可为空；<br />
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { impostSupplierService } from '@/api/webImport.js'
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
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._impostSupplierService(file, 'excel'),
					},
					class: 'excel-upload',
				},
			],
			storeActions: [
				{
					title: '下载导入商家客服模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/supplier/批量导入商家客服模板.xlsx')
					},
				},
			],
		}
	},
	methods: {
		async _impostSupplierService(file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					organizationId: 1,
					clerkId: this.$store.state.user.userInfo.clerkId,
					userId: this.$store.state.user.userInfo.userId,
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await impostSupplierService(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['impostSupplierService'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>
