<template>
	<div>
		<WgForm
			ref="importGoodsRejectBatchOperation"
			:inline="true"
			:data="{}"
			:items="[]"
			:formAction="storeActionsOperation"
		>
		</WgForm>
		<p>数据导入说明：</p>
		<p>
			1，文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小 &lt;
			5M，不可超过5000行（如数据较多，请分批上传）。
			<br />
			2、商家ID、商家名称不许为空，若为空或不匹配则否则导入失败；
			<br />
			3、品牌名称必须正确，且此商家必须关联此品牌，否则导入失败；
			<br />
			4、商品三级类目ID和名称不允许为空，且必须正确且匹配，否则导入失败；
			<br />
			5、此商家+品牌+类目下所有商品必须全部处于下架状态，否则导入失败；
			<br />
		</p>
		<br />
		<WgForm
			ref="importGoodsRejectBatch"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</WgForm>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
import { importGoodsRejectBatch } from '@/api/yhtPlusWebGoods'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'BatchRejectGoodsImport',
	components: { WgForm },
	data() {
		return {
			storeData: {},
			// TODO： 控件渲染数据
			storeFormOptions: [
				{
					type: 'upload',
					dataIndex: 'fileStream',
					colSpan: 4,
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						showBtn: true,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._importGoodsRejectBatch(file, 'excel'),
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
							this.$refs['importGoodsRejectBatch'].$refs.fileStream[0]
								.uploadFiles &&
							this.$refs['importGoodsRejectBatch'].$refs.fileStream[0]
								.uploadFiles.length === 0
						) {
							this.$message.error('请先添加文件后点击导入！')
							return
						}
						this.$refs['importGoodsRejectBatch'].$refs.fileStream[0].submit()
					},
				},
			],
			storeActionsOperation: [
				{
					title: '下载批量驳回商品信息模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/goods/批量驳回商品模板.xlsx?v=0.0.2')
					},
				},
				{
					title: '查看历史导入记录',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `/publicPage/importRecord/${45}/${'批量驳回商品记录'}`,
						})
					},
				},
			],
			importing: false,
		}
	},
	methods: {
		async _importGoodsRejectBatch(file) {
			if (this.importing) {
				this.$message.error('请不要重复操作！')
				return
			}
			this.importing = true
			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let formData = new FormData()
			formData.append('file', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await importGoodsRejectBatch(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			this.importing = false
			loading.close()
			// 清空文件
			this.$refs['importGoodsRejectBatch'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>
