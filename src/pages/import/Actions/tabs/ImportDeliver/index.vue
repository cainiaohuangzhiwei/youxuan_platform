<template>
	<div>
		<yx-form
			:inline="true"
			:rules="rules"
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

		<yx-form
			:inline="true"
			:data="storeDownloadData"
			:items="storeDownloadOptions"
			:formAction="storeDownloadActions"
		>
			<template #goodsbrand>
				<el-autocomplete
					v-model="goodsDownloadBrandName"
					debounce
					:fetch-suggestions="_getBrandList"
					placeholder="请选择会场"
					value-key="brandName"
					label="brandName"
					@select="
						(item) => {
							storeData.brandId = item.brandId
						}
					"
				>
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-autocomplete>
			</template>
		</yx-form>
		<yx-form
			:inline="true"
			:data="uploadDownloadData"
			:items="uploadFileOptions"
			:formAction="uploadFileActions"
		>
		</yx-form>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getBrandList } from '@/api/brand.js'
import {
	exportNotDeliverGoodsOrderDetails,
	impostOrderDeliver,
	deliveSwitch,
	delverImportOrderDeliver,
} from '@/api/webImport.js'
import { downloadFile } from '@/utils/helper/common'
export default {
	name: 'ImportDeliver',
	components: { YxForm },
	props: {
		brandData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			rules: {
				warehouseId: [
					{ required: true, message: '请选择出库仓库', trigger: 'blur' },
				],
			},
			goodsDialog: false,
			storeData: {
				brandId: '',
				warehouseId: '',
				userId: this.$store.state.user.userInfo.userId,
			},
			// TODO： 控件渲染数据
			storeDownloadData: {},
			storeFormOptions: [
				{
					type: 'select',
					title: '出库仓库：',
					label: 'warehouseName',
					dataIndex: 'warehouseId',
					placeholder: '请选择仓库',
					options: this.$store.state.leadin.warehouseList,
				},
				{
					type: 'custom',
					title: '会场：',
					dataIndex: 'custom',
				},
			],
			storeActions: [
				{
					title: '下载未发货订单',
					type: 'primary',
					auth: 'exportNotDeliverGoodsOrderDetails',
					click: (e) => {
						this._exportNotDeliverGoodsOrderDetails(e)
					},
				},
			],
			uploadDownloadData: {},
			uploadFileOptions: [
				{
					type: 'upload',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 9,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => {
							return this._switchDeliver(file)
						},
					},
					class: 'excel-upload',
				},
			],
			uploadFileActions: [
				{
					title: '下载未发货订单导入模板',
					type: 'primary',
					click() {
						downloadFile('/excel/supplier/未发货订单导入模板4.2.xlsx')
					},
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
		brandSelect(item) {
			this.storeData.brandId = item.brandId
		},
		openBrandDialog() {
			this.$emit('openBrandDialog', 'ImportDeliver')
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
		async _exportNotDeliverGoodsOrderDetails(e) {
			let params = this.storeData
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let { data } = await exportNotDeliverGoodsOrderDetails(params, custom)
			downloadFile(data, '未发货订单.xlsx')
		},
		async _switchDeliver(file) {
			if (!this.storeData.warehouseId) {
				return this.$message('请选择出库仓库')
			}
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					organizationId: 1,
					timeStamp: new Date() * 1,
					groupId: 2,
					warehouseId: `${this.storeData.warehouseId}`,
					clerkId: this.$store.state.user.userInfo.clerkId,
					importSource: 1,
					userId: this.$store.state.user.userInfo.userId,
				})
			)
			try {
				let {
					data: { resultData },
				} = await deliveSwitch({})
				if (resultData) {
					formData.append('file', file.file)
					this._delverImportOrderDeliver(formData)
				} else {
					formData.append('excel', file.file)
					this._impostOrderDeliver(formData)
				}
			} catch (e) {
				console.log(e)
				formData.append('excel', file.file)
				this._impostOrderDeliver(formData)
			}
		},
		async _impostOrderDeliver(formData) {
			let {
				data: { resultCode, resultMsg },
			} = await impostOrderDeliver(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
		async _delverImportOrderDeliver(formData) {
			let {
				data: { resultCode, resultMsg },
			} = await delverImportOrderDeliver(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>
