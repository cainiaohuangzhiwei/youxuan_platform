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
			1、文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小
			<span>&lt; </span> 5M，不可超过100行（如数据较多，请分批上传）；<br />
			2、商家名称不许为空，若为空，则无法导入；<br />
			3、商家名称必须正确，若错误，则无法导入；<br />
			4、金额不能为空，最多支持两个小数点；<br />
			5、备注最多支持100个字符；<br />
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { importSupplierFlatBalanceList } from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
export default {
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
					title: '下载档期管理-冲账明细模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/supplier/档期对账-平账数据导入模板.xlsx')
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
			} = await importSupplierFlatBalanceList(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['impostSupplierService'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>
