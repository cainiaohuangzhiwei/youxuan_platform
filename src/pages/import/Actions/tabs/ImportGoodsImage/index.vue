<template>
	<el-container>
		<el-header height="auto" class="wg_form_box">
			<p class="mtb20"><b>批量新增商品图片</b></p>
			<yx-form
				ref="form"
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="funAction"
				:rules="funRules"
			>
				<template #supplier>
					<el-autocomplete
						v-model="formInline.supplierName"
						debounce
						:fetch-suggestions="_getCmsSupplierListByCondition"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@select="
							(item) => {
								formInline.supplierName = item.supplierName
								formInline.supplierId = item.supplierId
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
			<div>
				<!-- :formAction="funAction" -->
				<p class="mtb20">导入商品图片说明：</p>
				<p class="lh26">
					1、所有的商品图片必须压缩在一个ZIP文件里面。
					<br />
					2、若该商品只有一张图片，该图片以货号命名即可，例如商品编码为SP-001，则对应图片文件名应为：SP-001。
					<br />
					3、若该商品有多张图片，需把所有的图片放在一个文件夹里面，该文件夹以商品货号命名。
					<br />
					4、多图商品的主图必须以商品货号命名，图册按照展示顺序从小到大命名（如上传图片未设置主图，系统将自动指定（后续可手工修改）。<br />
					5、新上传的图片会替代商品的所有旧图片。
					<br />
					6、每个商品最多支持20张图片，图片格式仅支持JPG,JPEG,BMP,PNG格式。
					<br />
					7、单一商品图片如果超过20张，无法导入成功。 <br />
					8、单张图片不得大于2M，大于2M无法上传成功。<br />
					9、压缩文件大小不可超过60M。
					<br />
				</p>
			</div>
		</el-header>
	</el-container>
</template>

<script>
import {
	getCmsSupplierListByCondition,
	getBrandList,
	uploadPictures,
} from '@/api/webImport'
import { mapGetters } from 'vuex'
import YxForm from '@wg-vue-materials/yx-form'
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
			formInline: {
				goodsImg: [],
				supplierName: '',
				supplierId: 0,
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
					dataIndex: 'goodsImg',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept: 'aplication/zip',
						httpRequest: (file) => this._uploadPictures(file),
					},
					class: 'excel-upload',
				},
			],
			batchData: {
				goodsFile: [],
			},
			funRules: {
				goodsFile: [
					{ required: true, message: '请上传Excel', trigger: 'blur' },
				],
			},
		}
	},
	computed: {
		...mapGetters(['getUserId', 'getSessionKey']),
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
				console.log('resultData', resultData)
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
			this.$emit('openBrandDialog', 'importGoodsImage')
		},
		async _uploadPictures(file) {
			let formData = new FormData()
			formData.append('formId', '#goodsZipForm')
			formData.append('importSource', 1)
			formData.append('supplierId', this.formInline.supplierId)
			formData.append('brandId', this.brandData.brandId)
			formData.append(
				'organizationId',
				this.$store.state.user.userInfo.organizationId
			)
			formData.append(
				'data',
				JSON.stringify({
					importSource: 1,
					supplierId: this.formInline.supplierId,
					organizationId: this.$store.state.user.userInfo.organizationId,
					brandId: this.brandData.brandId,
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append('upload_picture', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await uploadPictures(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
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
