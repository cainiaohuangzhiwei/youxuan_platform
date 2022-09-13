<template>
	<div>
		<!-- <yx-form
			:inline="true"
			:rules="rules"
			:data="storeDownloadData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
			<template #custom>
				<el-form>
					<el-autocomplete
						v-model="brandName"
						debounce
						:fetch-suggestions="_getBrandList"
						placeholder="请选择会场"
						value-key="brandName"
						label="brandName"
						@select="
							(item) => {
								brandSelect(item)
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
							@click="openGoodsBrandDialog"
						></el-button>
					</el-autocomplete>
				</el-form>
			</template>
		</yx-form>-->
		<yx-form
			:inline="true"
			:data="storeDownloadData"
			:items="storeDownloadOptions"
			:formAction="storeDownloadActions"
		>
			<!-- <template #custom>
				<el-form>
					<el-autocomplete
						v-model="brandName"
						debounce
						:fetch-suggestions="_getBrandList"
						placeholder="请选择会场"
						value-key="brandName"
						label="brandName"
						@select="
							(item) => {
								brandData = item
								console.log(brandData)
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
							@click="openGoodsBrandDialog"
						></el-button>
					</el-autocomplete>
				</el-form>
			</template>-->
			<template #goodsbrand>
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
						@click="opengoodsDownloadBrandDialog"
					></el-button>
				</el-autocomplete>
			</template>
		</yx-form>
		<div>3. 上传盘点数据</div>
		<yx-form
			:inline="true"
			:data="uploadFileData"
			:items="uploadFileOptions"
			:formAction="uploadFileActions"
		></yx-form>
		<BrandDialog
			:visible.sync="warehouseDialog"
			@chooseBrand="chooseWarehouseBrand"
		/>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getBrandList } from '@/api/brand.js'
import { generateWarehouseSpecByWarehouseId } from '@/api/webGoods.js'
import { downloadStockTaking, impostStockTaking } from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	name: 'StockTaking',
	components: { YxForm },
	props: {
		brandData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			storeDownloadData: {
				warehouseId: '',
				shelfState: '',
				selfStatus: '',
				stockStart: '',
				stockEnd: '',
				brandName: '',
				brandId: '',
			},
			storeDownloadOptions: [
				{
					type: 'select',
					title: '盘点仓库：',
					label: 'warehouseName',
					dataIndex: 'warehouseId',
					placeholder: '请输入仓库',
					options: this.$store.state.leadin.warehouseList,
				},
				{
					type: 'custom',
					title: '会场：',
					dataIndex: 'goodsbrand',
				},
				{
					type: 'select',
					title: '商品状态：',
					dataIndex: 'shelfState',
					label: 'value',
					options: this.$store.state.app.constant.GOODS_STATE,
				},
				{
					type: 'select',
					title: '销售状态',
					dataIndex: 'selfStatus',
					label: 'value',
					options: this.$store.state.app.constant.SALE_STATE,
				},
				{
					type: 'inputNumber',
					title: '库存:',
					dataIndex: 'stockStart',
				},
				{
					type: 'inputNumber',
					title: '-',
					dataIndex: 'stockEnd',
				},
			],
			storeDownloadActions: [
				{
					title: '生成仓库规格',
					type: 'primary',
					click: (e) => {
						this._generateWarehouseSpecByWarehouseId(e)
					},
				},
				{
					title: '下载商品库存数据',
					type: 'primary',
					click: (e) => {
						this._downloadStockTaking(e)
					},
				},
			],
			uploadFileData: {},
			uploadFileOptions: [
				{
					hide: !checkFunctionCode('impostStockTaking'),
					type: 'upload',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => {
							return this._impostStockTaking(file)
						},
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
				this.storeDownloadData.brandId = newValue.brandId
				this.storeDownloadData.brandName = newValue.brandName
			},
		},
	},
	methods: {
		openGoodsBrandDialog() {
			this.$emit('openBrandDialog', 'stockTakingGoodsBrand')
		},
		opengoodsDownloadBrandDialog() {
			this.$emit('openBrandDialog', 'stockTakingGoodsDownloadBrand')
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
		async _generateWarehouseSpecByWarehouseId(e) {
			let params = this.storeDownloadData
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			await generateWarehouseSpecByWarehouseId(params, custom)
		},
		/**
		 * @Description: 下载库存盘点数据表格
		 * @param {e}: 浏览器事件对象
		 * @return {type}:
		 */
		async _downloadStockTaking(e) {
			if (!this.storeDownloadData.brandId) {
				return this.$message.error('先请选择会场')
			}
			let payload = this.storeDownloadData
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let { data } = await downloadStockTaking(payload, custom)
			downloadFile(data, `商品库存数据.xlsx`)
			this.brandData = ''
		},

		async _impostStockTaking(file) {
			let formData = new FormData()
			formData.append('formId', '#goodsForm')
			formData.append(
				'data',
				JSON.stringify({
					organizationId: 1,
					warehouseId: this.storeDownloadData.warehouseId,
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await impostStockTaking(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>
