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
			</template>
		</yx-form>
		<div>上传文件：</div>
		<yx-form
			ref="impost"
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
import { downloadFile } from '@/utils/helper/common'
import {
	exportUpdateGoodsPrice,
	importUpdateGoodsPrice,
} from '@/api/webImport.js'
export default {
	name: 'EditGoodsPrice',
	components: { YxForm },
	props: {
		brandData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			repetition: false,
			brandDialog: false,
			storeData: {
				brandId: '',
				warehouseId: '',
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
					title: '下载商品价格表',
					type: 'primary',
					auth: 'exportUpdateGoodsPrice',
					click: (e) => {
						this._exportUpdateGoodsPrice(e)
					},
				},
				{
					title: '下载批量修改商品价格模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/goods/批量修改价格模板.xlsx')
					},
				},
			],
			//
			storeDownloadData: {
				shelfState: '',
				selfStatus: '',
				stockStart: '',
				stockEnd: '',
				brandId: '',
			},
			goodsDownloadBrandName: '',
			storeDownloadOptions: [
				{
					type: 'upload',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._importUpdateGoodsPrice(file),
					},
					class: 'excel-upload',
				},
			],
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
		openBrandDialog() {
			this.$emit('openBrandDialog', 'EditGoodsPrice')
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

		/**
		 * @Description: 下载商品模板
		 * @param {event}}:e 事件对象
		 * @return {type}:
		 */
		async _exportUpdateGoodsPrice(e) {
			if (!this.brandData.brandId) {
				return this.$message.error('请先选择会场')
			}
			let params = {
				timeStamp: new Date() * 1,
				groupId: 2,
				brandIdList: [`${this.brandData.brandId}`],
				userId: this.$store.state.user.userInfo.userId,
				viewType: 2,
			}
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let { data } = await exportUpdateGoodsPrice(params, custom)
			downloadFile(data, '商品价格.xlsx')
		},

		async _importUpdateGoodsPrice(file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
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
			} = await importUpdateGoodsPrice(formData)
			this.repetition = resultMsg
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['impost'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>
