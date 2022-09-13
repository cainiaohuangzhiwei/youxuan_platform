<template>
	<div>
		<basicContainer>
			<yx-form
				:inline="true"
				:data="storeData"
				:items="storeFormOptions"
				:formAction="storeActions"
			>
				<template #brandName>
					<el-input
						v-model="storeData.brandName"
						placeholder="请选择会场"
						value-key="brandName"
						label="brandName"
						@focus="selectBrand"
						clearable
						@clear="
							() => {
								storeData.brandName = ''
								storeData.brandId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<div>上传文件：</div>
			<yx-form
				:inline="true"
				v-if="showForm"
				:data="storeDownloadData"
				:items="storeDownloadOptions"
				:formAction="storeDownloadActions"
			></yx-form>
			<!-- 会场列表 -->
			<brand-dialog
				:itemInfo="brandRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						storeData.brandName = row.brandName
						storeData.brandId = row.brandId
					}
				"
			/>
		</basicContainer>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import BasicContainer from '@wg-vue-materials/basic-container'
// import { getBrandList } from '@/api/brand.js'
import { downloadFile } from '@/utils/helper/common'
import BrandDialog from '@/components/BrandDialog'
import { checkFunctionCode } from '@/utils/auth'
import {
	// importUpdateGoodsPrice,
	exportUpdateGoodsPriceByGz,
	exportUpdateGoodsPriceByHz,
	importUpdateGoodsPriceByHz,
	importUpdateGoodsPriceByGz,
} from '@/api/webImport.js'
export default {
	name: 'batchesModifyPrices',
	components: { YxForm, BrandDialog, BasicContainer },
	computed: {
		showForm() {
			return (
				(!this.region && this.importUpdateGoodsPriceByHz) ||
				(this.region && this.importUpdateGoodsPriceByGz)
			)
		},
	},
	// props: {
	// 	brandData: {
	// 		type: Object,
	// 		default: () => ({}),
	// 	},
	// },
	data() {
		return {
			exportUpdateGoodsPriceByHz: !checkFunctionCode(
				'exportUpdateGoodsPriceByHz'
			),
			exportUpdateGoodsPriceByGz: !checkFunctionCode(
				'exportUpdateGoodsPriceByGz'
			),
			importUpdateGoodsPriceByHz: checkFunctionCode(
				'importUpdateGoodsPriceByHz'
			),
			importUpdateGoodsPriceByGz: checkFunctionCode(
				'importUpdateGoodsPriceByGz'
			),
			brandRow: {},
			region: null,
			// brandDialog: false,
			formsDialog: false,
			storeData: {
				brandId: '',
				brandName: '',
				warehouseId: '',
			},
			// TODO： 控件渲染数据
			storeFormOptions: [
				{
					type: 'custom',
					title: '会场：',
					dataIndex: 'brandName',
				},
			],
			storeActions: [
				{
					title: '下载商品价格表',
					type: 'primary',
					// auth: 'exportUpdateGoodsPriceByHz',
					click: (e) => {
						this._exportUpdateGoodsPrice(e)
					},
					customRender: (action) => {
						action.hide =
							(this.region && !exportUpdateGoodsPriceByGz) ||
							(!this.region && !exportUpdateGoodsPriceByHz)
						return action
					},
				},
				{
					title: '下载修改商品数据导入模板',
					type: 'primary',
					click: () => {
						if (this.region) {
							downloadFile('/excel/goods/批量修改价格模板-广州.xlsx')
						} else {
							downloadFile('/excel/goods/批量修改价格模板-杭州.xlsx')
						}
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
	async created() {
		this.region = this.$route.params.region == 'false' || false
	},
	// watch: {
	// 	brandData: {
	// 		immediate: true,
	// 		deep: true,
	// 	},
	// },
	methods: {
		selectBrand(e) {
			e.target.blur()
			this.formsDialog = true
		},
		openBrandDialog() {
			this.$emit('openBrandDialog', 'EditGoodsPrice')
		},
		// async _getBrandList(queryString, cb) {
		// 	let params = {
		// 		selectionTag: 2,
		// 		startIndex: 0,
		// 		length: 20,
		// 		keyword: queryString,
		// 	}
		// 	let {
		// 		data: { resultCode, resultData },
		// 	} = await getBrandList(params)
		// 	if (resultCode === 0) {
		// 		cb(resultData.brandList)
		// 	}
		// },
		// async _generateWarehouseSpecByWarehouseId() {
		// 	let params = this.storeData
		// 	let { data } = await generateWarehouseSpecByWarehouseId(params)
		// 	console.log(data, 'generateWarehouseSpecByWarehouseId,resultData')
		// },

		/**
		 * @Description: 下载商品模板
		 * @param {event}}:e 事件对象
		 * @return {type}:
		 */
		async _exportUpdateGoodsPrice(e) {
			if (!this.storeData.brandId) {
				return this.$message.error('请先选择会场')
			}
			let params = {
				timeStamp: new Date() * 1,
				groupId: 2,
				brandIdList: [`${this.storeData.brandId}`],
				userId: this.$store.state.user.userInfo.userId,
				viewType: 2,
			}
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let Url = this.region
				? exportUpdateGoodsPriceByGz
				: exportUpdateGoodsPriceByHz
			let { data } = await Url(params, custom)
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
			let Url = this.region
				? importUpdateGoodsPriceByGz
				: importUpdateGoodsPriceByHz
			let {
				data: { resultCode, resultMsg },
			} = await Url(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>
