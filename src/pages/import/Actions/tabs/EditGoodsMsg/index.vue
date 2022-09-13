<template>
	<div>
		<yx-form
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
			<template #custom>
				<el-autocomplete
					v-model="brandData.brandName"
					debounce
					:fetch-suggestions="_getBrandList"
					placeholder="请选择会场"
					value-key="brandName"
					label="brandName"
					@select="
						(item) => {
							brandData = item
						}
					"
				>
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="openBrandDialog"
					></el-button>
				</el-autocomplete>
				<!--  -->
			</template>
		</yx-form>

		<div>上传文件：</div>
		<yx-form
			:inline="true"
			:data="storeDownloadData"
			:items="storeDownloadOptions"
			:formAction="storeDownloadActions"
		></yx-form>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getBrandList } from '@/api/brand.js'
import { generateWarehouseSpecByWarehouseId } from '@/api/webGoods.js'
import {
	importBatchUpdateGoods,
	exportBatchUpdateGoodsDetails,
} from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'EditGoodsMsg',
	components: { YxForm },
	props: {
		brandData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			brandDialog: false,
			storeData: {
				brandId: '',
			},
			// TODO： 控件渲染数据
			storeFormOptions: [
				{
					type: 'custom',
					title: '会场：',
					dataIndex: 'custom',
				},
			],
			storeActions: [
				{
					title: '下载商品信息',
					type: 'primary',
					auth: 'exportBatchUpdateGoodsDetails',
					click: (e) => {
						this._exportBatchUpdateGoodsDetails(e)
					},
				},
				{
					title: '下载修改商品数据导入模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/platform/批量修改商品信息模板.xlsx')
					},
				},
			],
			//
			storeDownloadData: {},
			storeDownloadOptions: [
				{
					type: 'upload',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._importBatchUpdateGoods(file),
					},
					class: 'excel-upload',
				},
			],
			// storeDownloadActions: [
			// 	{
			// 		title: '上传',
			// 		type: 'primary',
			// 		click: () => {},
			// 	},
			// ],
		}
	},

	watch: {
		brandData: {
			immediate: true,
			deep: true,
			handler(newValue) {
				this.storeData.brandId = newValue.brandId
			},
		},
	},
	methods: {
		async _exportBatchUpdateGoodsDetails(e) {
			console.log(this.storeData)
			if (!this.brandData.brandId) {
				this.$message({
					message: '请选择会场',
					type: 'warning',
				})
				return
			}
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let paramJson = {
				brandId: this.brandData.brandId,
			}
			let { data } = await exportBatchUpdateGoodsDetails(paramJson, custom)
			downloadFile(data, '商品信息.xlsx')
			this.brandData = ''
		},
		openBrandDialog() {
			this.$emit('openBrandDialog', 'EditGoodsMsg')
		},
		async _getBrandList(queryString, cb) {
			let params = {
				selectionTag: 2,
				startIndex: 0,
				length: 20,
				keyword: queryString,
			}
			let {
				data: { resultCode, resultData },
			} = await getBrandList(params)
			if (resultCode === 0) {
				cb(resultData.brandList)
			}
		},
		async _generateWarehouseSpecByWarehouseId() {
			let params = this.storeData
			let { data } = await generateWarehouseSpecByWarehouseId(params)
			console.log(data, 'generateWarehouseSpecByWarehouseId,resultData')
		},
		async _importBatchUpdateGoods(file) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					importSource: 1,
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await importBatchUpdateGoods(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>
