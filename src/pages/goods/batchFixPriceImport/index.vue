<template>
	<div>
		<yx-form
			ref="initBatchFixPriceOperation"
			:inline="true"
			:data="{}"
			:items="[]"
			:formAction="storeActionsOperation"
		>
		</yx-form>
		<p>数据导入说明：</p>
		<p>
			1，文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小 &lt;
			5M，不可超过5000行（如数据较多，请分批上传）。
			<br />
			2、商家ID不许为空，若为空则不允许导入；
			<br />
			3、商家名称不许为空，若商家名称为空或者商家ID与商家名称不匹配，则不允许导入；
			<br />
			4、商家必须开通新扣点模式（扣点启用状态为启用）；
			<br />
		</p>
		<br />
		<yx-form
			ref="initBatchFixPrice"
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
import { initBatchFixPrice } from '@/api/yhtPlusWebGoods'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'BatchFixPriceImport',
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
						httpRequest: (file) => this._initBatchFixPrice(file, 'excel'),
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
							this.$refs['initBatchFixPrice'].$refs.fileStream[0].uploadFiles &&
							this.$refs['initBatchFixPrice'].$refs.fileStream[0].uploadFiles
								.length === 0
						) {
							this.$message.error('请先添加文件后点击导入！')
							return
						}

						this.$refs['initBatchFixPrice'].$refs.fileStream[0].submit()
					},
				},
			],
			storeActionsOperation: [
				{
					title: '下载导入批量定价模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/goods/批量定价模板.xlsx?v=0.01')
					},
				},
				{
					title: '查看历史导入记录',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: '/goods/batchFixPriceImportLog',
						})
					},
				},
			],
		}
	},
	methods: {
		async _initBatchFixPrice(file) {
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
			} = await initBatchFixPrice(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['initBatchFixPrice'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>

<style></style>
