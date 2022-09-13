<template>
	<div>
		<yx-form
			ref="importUpdateGoodsCategoryOperation"
			:inline="true"
			:data="{}"
			:items="[]"
			:formAction="storeActionsOperation"
		>
		</yx-form>
		<p>数据导入说明：</p>
		<p>
			<span style="color: red">特别留意：</span>
			导入商品类目调整数据，可能会影响商品所关联的扣点发生变化，导入前需要提前与商运同学进行确认。
			<br />
			<br />
			1，文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小 &lt;
			5M，不可超过5000行（如数据较多，请分批上传）。
			<br />
			2、三级类目ID、名称均不许为空且必须匹配，否则导入失败；
			<br />
			3、原二级类目名称、原一级类目名称非必填且不做校验，类目调整记录列表中展示的为调整前的关联关系；
			<br />
			4、新二级类目ID、名称均不许为空且必须匹配，否则导入失败；
			<br />
			5、新一级类目ID、名称均不许为空且必须匹配，否则导入失败；
			<br />
		</p>
		<br />
		<yx-form
			ref="importGoodsCategoryChange"
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
	downloadGoodsCategory,
	importGoodsCategoryChange,
} from '@/api/yhtPlusWebGoods'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'CategoryAdjustImport',
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
						httpRequest: (file) =>
							this._importUpdateGoodsCategory(file, 'excel'),
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
							this.$refs['importGoodsCategoryChange'].$refs.fileStream[0]
								.uploadFiles &&
							this.$refs['importGoodsCategoryChange'].$refs.fileStream[0]
								.uploadFiles.length === 0
						) {
							this.$message.error('请先添加文件后点击导入！')
							return
						}

						this.$refs['importGoodsCategoryChange'].$refs.fileStream[0].submit()
					},
				},
			],
			storeActionsOperation: [
				{
					title: '下载当前类目关系表',
					type: 'primary',
					click: (e) => {
						this._exportGoodsCategory(e)
					},
				},
				{
					title: '下载商品类目调整模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/goods/商品类目调整模板.xlsx?v=1.0')
					},
				},
				{
					title: '查看历史导入记录',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `/publicPage/importRecord/${46}/${'商品类目调整记录'}`,
						})
					},
				},
			],
			importing: false,
		}
	},
	methods: {
		async _exportGoodsCategory(e) {
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let paramJson = {}
			let { data } = await downloadGoodsCategory(paramJson, custom)
			data && downloadFile(data, '当前类目关系表.xlsx')
		},
		async _importUpdateGoodsCategory(file) {
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
			} = await importGoodsCategoryChange(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			this.importing = false
			loading.close()
			// 清空文件
			this.$refs['importGoodsCategoryChange'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>
