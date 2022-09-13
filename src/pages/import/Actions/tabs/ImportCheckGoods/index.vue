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
import { importAuditedSupplierGoods } from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'ImportCheckGoods',
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
							this._mportAuditedSupplierGoods(file, 'excel'),
					},
					class: 'excel-upload',
				},
			],
			storeActions: [
				{
					title: '下载商品批量审核模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/goods/商品批量审核模板.xlsx')
					},
				},
			],
		}
	},
	methods: {
		async _mportAuditedSupplierGoods(file) {
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
			} = await importAuditedSupplierGoods(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>
