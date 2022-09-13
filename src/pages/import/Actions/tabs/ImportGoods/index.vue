<template>
	<el-container>
		<el-header height="auto" class="wg_form_box">
			<yx-form
				ref="form"
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="funAction"
				:rules="rules"
			>
				<template #supplier>
					<el-autocomplete
						v-model="supplierName"
						debounce
						:fetch-suggestions="_getCmsSupplierListByCondition"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@select="
							(item) => {
								supplierName = item.supplierName
							}
						"
					>
					</el-autocomplete>
				</template>
				<template #brand>
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
			<el-button
				icon="el-icon-download"
				@click="downloadImpostTemplate"
				size="small"
				type="primary"
				>下载商品导入模板</el-button
			>
			<p class="mtb20">商品导入说明：</p>
			<p class="lh26">
				1，文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小
				&lt;5M，不可超过1000行（如商品较多，请分批上传）。
				<br />
				2，货号不许为空且不可重复，若为空，则该商品无法导入；若重复，系统只导入其中一款商品；
				<br />
				3，商品名称、一级分类、品牌、计量单位、价格1（价格1必须为数字）不许为空，若空该商品无法导入；
				<br />
				4，是否上架允许为空，若为空，则系统均设置为否； <br />
				5，商品规格不可为空，名称格式要求统一，不同的规格名称之间以“|”分隔；且多规格字段设置、规格1内容不可为空，否则商品无法导入；
				<br />
				6，排序值可为空，若为空系统设置为0； <br />
				7，条形码可为空； <br />
				8，商品信息如果与已有数据重复，系统将自动覆盖历史数据（货号相同的则为重复商品）。
				<br />
			</p>
		</el-header>
	</el-container>
</template>

<script>
import {
	impostGoods,
	getCmsSupplierListByCondition,
	getBrandList,
} from '@/api/webImport'
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
export default {
	components: {
		YxForm,
	},
	props: {
		brandData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			uploadMsg: {},
			activeName: 'one',
			showImpostTwoTab: false,
			impostGoods: '',
			uploadParam: {},
			batchDialog: false,
			supplierName: '',
			formInline: {
				goodsFile: [],
				supplier: '',
			},
			rules: {
				supplier: [{ required: true, message: ' ', trigger: 'blur' }],
			},
			formCfg: [
				{
					type: 'custom',
					title: '商家名称：',
					dataIndex: 'supplier',
				},
				{
					type: 'custom',
					title: '会场：',
					dataIndex: 'brand',
				},
				{
					type: 'upload',
					dataIndex: 'goodsFile',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._impostGoods(file),
					},
					class: 'excel-upload',
				},
			],
		}
	},

	methods: {
		async _getCmsSupplierListByCondition(queryString, cb) {
			let params = {
				selectionTag: 2,
				startIndex: 0,
				length: 20,
				supplierName: queryString,
			}
			let {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(params)
			if (resultCode === 0) {
				cb(resultData.supplierList)
			}
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
		openBrandDialog() {
			this.$emit('openBrandDialog', 'importGoods')
		},
		async _impostGoods(file) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					organizationId: this.$store.state.user.userInfo.organizationId,
					brandName: this.brandData.brandName,
					supplierName: this.supplierName,
				})
			)
			formData.append('formId', '#goodsForm')
			formData.append('fileToUpload', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await impostGoods(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
		},
		//下载模板
		downloadImpostTemplate() {
			downloadFile('/excel/goods/商品导入-扫码版.xlsx')
		},
	},
}
</script>
<style lang="scss" scoped>
.w182 {
	width: 182px;
}

.con_flex {
	display: flex;
	align-items: center;
}

.mr10 {
	margin-right: 10px;
}
.mr20 {
	margin-right: 20px;
}
.mtb20 {
	margin: 20px 0;
}
</style>
