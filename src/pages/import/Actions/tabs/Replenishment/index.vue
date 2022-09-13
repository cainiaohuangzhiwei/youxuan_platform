<template>
	<div>
		<yx-form
			:inline="true"
			:data="downloadGoodsData"
			:items="downloadGoodsOptions"
			:formAction="downloadGoodsActions"
		>
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
						@click="openBrandDialog"
					></el-button>
				</el-autocomplete>
			</template>
		</yx-form>
		<!-- 上传补货数据 -->
		<yx-form
			:inline="true"
			:data="uploadFileData"
			:items="uploadFileOptions"
			:formAction="uploadFileActions"
		></yx-form>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getBrandList } from '@/api/brand.js'
import { generateWarehouseSpecByWarehouseId } from '@/api/webGoods.js'
import { downloadStockTaking, importReplenishStock } from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	name: 'Replenishment',
	components: { YxForm },
	props: {
		brandData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			goodsDialog: false,
			brandName: '',
			downloadGoodsData: {
				warehouseId: '',
				shelfState: '',
				selfStatus: '',
				stockStart: '',
				stockEnd: '',
				brandId: '',
				brandName: '',
			},
			downloadGoodsOptions: [
				{
					type: 'select',
					title: '补货仓库：',
					required: true,
					label: 'warehouseName',
					dataIndex: 'warehouseId',
					placeholder: '请选择仓库',
					options: this.$store.state.leadin.warehouseList,
				},
				{
					type: 'custom',
					title: '会场：',
					dataIndex: 'goodsbrand',
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
				{
					type: 'select',
					title: '商品状态：',
					dataIndex: 'shelfState',
					label: 'value',
					options: this.$store.state.app.constant.GOODS_STATE,
				},
				{
					type: 'select',
					title: '销售状态：',
					dataIndex: 'selfStatus',
					label: 'value',
					options: this.$store.state.app.constant.SALE_STATE,
				},
			],
			downloadGoodsActions: [
				{
					title: '下载商品库存数据',
					type: 'primary',
					click: () => {
						console.log(this.downloadGoodsData, 'downloadGoodsData')
						this._downloadStockTaking()
					},
				},
			],
			uploadFileData: {},
			uploadFileOptions: [
				{
					hide: !checkFunctionCode('importReplenishStock'),
					title: '上传补货数据',
					type: 'upload',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._importReplenishStock(file, 'excel'),
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
				this.downloadGoodsData.brandId = newValue.brandId
				this.downloadGoodsData.brandName = newValue.brandName
			},
		},
	},
	methods: {
		openBrandDialog() {
			this.$emit('openBrandDialog', 'ReplenishmentBrand')
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
		async _downloadStockTaking() {
			if (!this.brandData.brandId) {
				return this.$message.error('先请选择会场')
			}
			let params = this.downloadGoodsData
			let { data } = await downloadStockTaking(params)
			downloadFile(data, `${this.downloadGoodsData.brandName}补货库存表.xlsx`)
		},

		async _importReplenishStock(file, type) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					organizationId: 1,
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append(type, file.file)
			let {
				data: { resultCode, resultMsg },
			} = await importReplenishStock(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>
