<template>
	<div>
		<yx-form
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</yx-form>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import {
	impostBatchUpdateExpressSn,
	deliveSwitch,
	deliverImportExpressSn,
} from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'EditLogisticsNo',
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
						httpRequest: (file) => this._switchDeliver(file),
					},
					class: 'excel-upload',
				},
			],
			storeActions: [
				{
					title: '下载批量修改物流单号模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/supplier/批量修改快递单号模板2.2.xlsx')
					},
				},
			],
		}
	},
	methods: {
		async _switchDeliver(file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					clerkId: this.$store.state.user.userInfo.clerkId,
					organizationId: 1,
					timeStamp: new Date() * 1,
					groupId: 2,
					userId: this.$store.state.user.userInfo.userId,
				})
			)
			try {
				let {
					data: { resultData },
				} = await deliveSwitch({})
				if (resultData) {
					formData.append('file', file.file)
					this._deliverImportExpressSn(formData)
				} else {
					formData.append('excel', file.file)
					this._impostBatchUpdateExpressSn(formData)
				}
			} catch (e) {
				console.log(e)
				formData.append('excel', file.file)
				this._impostBatchUpdateExpressSn(formData)
			}
		},
		async _impostBatchUpdateExpressSn(formData) {
			let {
				data: { resultCode, resultMsg },
			} = await impostBatchUpdateExpressSn(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
		async _deliverImportExpressSn(formData) {
			let {
				data: { resultCode, resultMsg },
			} = await deliverImportExpressSn(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>
