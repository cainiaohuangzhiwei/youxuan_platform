<template>
	<div>
		<yx-form
			ref="ImportStFinanceDataForm"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</yx-form>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1，订单编号不许为空，若为空，则无法导入；
			<br />
			2、订单编号必须正确，若错误，则无法导入；
			<br />
			3、数据类型必须属于：营销费用、罚款、补款、其他；否则无法导入，订单类型的不允许导入；
			<br />
			4，文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小
			<br />
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { importStFinanceDataDetail } from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'ReconciliationData',
	components: { YxForm },
	data() {
		return {
			storeData: {
				brandId: '',
				warehouseId: '',
			},
			brandName: '',
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
						httpRequest: (file) =>
							this._importStFinanceDataDetail(file, 'excel'),
					},
					class: 'excel-upload',
				},
			],
			storeActions: [
				{
					title: '下载数据明细模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/supplier/数据明细表格导入格式2.0.xls')
					},
				},
			],
		}
	},
	methods: {
		async _importStFinanceDataDetail(file) {
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
			} = await importStFinanceDataDetail(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['ImportStFinanceDataForm'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>
