<template>
	<div class="heightBrandSet">
		<el-dialog
			width="500px"
			:title="dialogTitle"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="funData"
				:rules="funRules"
				:labelWidth="'110px'"
				:formAction="funAction"
			>
				<template #brandCategoryId>
					<el-autocomplete
						v-model="funData.brandCategoryName"
						debounce
						placeholder="请输入品牌品类"
						value-key="brandCategoryName"
						label="brandCategoryName"
						:fetch-suggestions="_getBrandCategoryList"
						@select="handleBrandName"
						@focus="handleFocusBrandName"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-autocomplete>
				</template>
			</yx-form>
			<!-- 品牌品类 -->
			<brandCategory-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import BrandCategoryDialog from './BrandCategoryDialog'
import { getBrandCategoryList, getBrandCategory } from '@/api/yhtPlusWebGoods'
import { addBrand, updateBrandById } from '@/api/brand'
import { supplierAccountNumberList } from '@/api/yhtPlusCmsSupplier'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		// 单条信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
		BrandCategoryDialog,
	},

	data() {
		return {
			dialogTitle: '',
			formsDialog: false,
			supplyRow: {}, // 当前行选中数据
			supplierList: [],
			item: [
				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'brandName',
					placeholder: '请输入会场名称',
				},

				{
					title: '品牌品类',
					type: 'custom',
					dataIndex: 'brandCategoryId',
				},
				{
					type: 'select',
					title: '商家名称',
					dataIndex: 'supplierAccountNumberId',
					label: 'value',
					options: this.supplierList,
					selectAttributes: {
						filterable: true,
						filterMmethod: (val) => {
							this.getSupplierAccountNumberList(val)
						},
					},
				},
				{
					type: 'input',
					title: '会场描述',
					dataIndex: 'description',
					placeholder: '请输入会场描述',
				},
				{
					type: 'uploadImage',
					title: '营业执照',
					dataIndex: 'businessLicenseImages',
					uploadAttributes: {
						limit: 3,
						imageName: 'businessLicenseImages',
						action: this.uploadImageList,
						httpRequest: (file) => this.uploadCertificate(file, 1),
					},
				},
				{
					type: 'uploadImage',
					title: '品牌授权书',
					dataIndex: 'brandAuthorizationUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png',
						action: this.uploadImageList,
						httpRequest: (file) => this.uploadCertificate(file, 2),
					},
				},
			],
			flag: true,
			funData: {
				brandId: '',
				brandName: '', //会场名称
				brandCategoryId: '', //品牌品类id
				supplierAccountNumberId: '', //商家id
				description: '', //会场描述
				brandCategoryName: '',
				businessLicenseImages: [], // 企业资质证明
				brandAuthorizationUrl: [], //品牌授权书
			},
			funRules: {
				brandName: [
					{ required: true, message: '请输入会场名称', trigger: 'blur' },
				],
				brandCategoryId: [
					{ required: true, message: '请输入品牌品类', trigger: 'change' },
				],
				supplierAccountNumberId: [
					{ required: true, message: '请输入商家', trigger: 'change' },
				],
			},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			queryParam: {},
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
		}
	},
	created() {
		this.getSupplierAccountNumberList('')
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	methods: {
		// 子组件传值
		fatherMethodInit(row = {}) {
			this.funData.brandCategoryName = row.brandCategoryName
			this.funData.brandCategoryId = row.brandCategoryId
			console.log('111', this.funData.brandCategoryName)
		},
		// 商家账号列表
		async getSupplierAccountNumberList(keyword) {
			const paramsData = {
				// selectionTag: 2,
				keyword,
				startIndex: 0,
				length: 20,
			}
			this.supplierList = []
			this.supplierListMap = {}
			const res = await supplierAccountNumberList(paramsData)
			const supplierAccountList = res.data.resultData.supplierAccountNumberList

			if (supplierAccountList.length > 0) {
				this.supplierList = supplierAccountList.map((item) => {
					return {
						value: item.supplierName,
						supplierName: item.supplierName,
						supplierAccountNumberId: item.supplierAccountNumberId,
					}
				})

				supplierAccountList.map((item, index) => {
					this.supplierListMap[supplierAccountList[index].supplierName] =
						supplierAccountList[index].supplierAccountNumberId
				})
				this.item[2].options = this.supplierList
			} else {
				this.item[2].options = []
			}
		},

		// 获取品牌品类
		handleFocusBrandName() {
			this.funData.brandCategoryName = ''
		},
		// 操作品牌品类
		handleBrandName(item) {
			this.funData.brandCategoryName = item.brandCategoryName
			this.funData.brandCategoryId = item.brandCategoryId
			// if (this.formDataOne.brandIdList.length > 0) {
			// 	this._getYouxuanGoodsList()
			// }
		},
		// 获取品牌品类列表
		async _getBrandCategoryList(queryString, callback) {
			const paramJson = {
				startIndex: 0,
				length: 20,
			}
			const {
				data: { resultCode, resultData },
				// eslint-disable-next-line no-undef
			} = await getBrandCategoryList(paramJson)

			if (resultCode == 0 && resultData.brandCategoryList.length > 0) {
				callback(resultData.brandCategoryList)
			}
		},

		// 回显
		async detail(row, type) {
			console.log(type, 'type', row)
			this.item.forEach((c) => {
				if (c.dataIndex == 'supplierAccountNumberId') {
					c.options =
						type == 2
							? [
									{
										value: row.supplierName,
										supplierName: row.supplierName,
										supplierAccountNumberId: row.supplierAccountNumberId,
									},
							  ]
							: this.supplierList
				}
			})
			if (type == 2) {
				this.dialogTitle = '编辑会场'
				this.item[0].disabled = true
				this.item[2].disabled = true
				this.funData.brandName = row.brandName ? row.brandName : ''
				this.funData.brandId = row.brandId ? row.brandId : ''
				this.funData.description = row.description ? row.description : ''
				this.funData.supplierName = row.supplierName ? row.supplierName : ''
				this.funData.supplierAccountNumberId = row.supplierAccountNumberId
					? row.supplierAccountNumberId
					: ''
				let businessArr = row.businessLicenseUrls
					? row.businessLicenseUrls.split(';')
					: ''
				//图片
				if (businessArr) {
					this.funData.businessLicenseImages = businessArr.map((v, index) => {
						return {
							businessLicenseImages: getBigImg(v),
							imageUrl: v,
							sortOrder: index,
						}
					})
				} else {
					this.funData.businessLicenseImages = []
				}
				if (row.brandAuthorizationUrl) {
					this.funData.brandAuthorizationUrl.push({
						imageUrlTemp: row.brandAuthorizationUrl,
						imageUrl: getBigImg(row.brandAuthorizationUrl),
					})
				}
				this.funData.brandCategoryId = row.brandCategoryId
				const {
					data: { resultCode, resultData },
				} = await getBrandCategory({
					brandCategoryIdList: [row.brandCategoryId],
				})
				if (resultCode == 0) {
					if (resultData.brandCategoryList.length > 0) {
						this.funData.brandCategoryName =
							resultData.brandCategoryList[0].brandCategoryName
						this.funData.brandParentId =
							resultData.brandCategoryList[0].brandParentId
						console.log(this.funData.brandCategoryName)
					}
				}
			} else {
				this.dialogTitle = '新增会场'
				this.funData = {
					brandName: '', //会场名称
					brandCategoryId: '', //品牌品类id
					supplierAccountNumberId: '', //商家id
					description: '', //会场描述
					brandCategoryName: '',
					businessLicenseImages: [], // 企业资质证明
					brandAuthorizationUrl: [], //品牌授权书
				}
				this.getSupplierAccountNumberList('')
			}
		},

		// 保存
		async submitForm() {
			if (this.title == '新增会场') {
				this.addBrandSave()
			} else {
				this.updateBrandById()
			}
		},

		// 新增
		async addBrandSave() {
			const paramsData = Object.assign({}, this.funData)
			let imageObject = this.funData.businessLicenseImages
			let arrImg = []
			imageObject.map(function (item) {
				arrImg.push({
					itemId: item.itemId,
					imageId: item.imageId,
					imageUrl: item.imageUrl,
					sortOrder: item.sortOrder,
					state: item.state,
					type: item.type,
				})
			})
			paramsData.businessLicenseImages = arrImg

			if (this.funData.brandAuthorizationUrl.length > 0) {
				paramsData.brandAuthorizationUrl = this.funData.brandAuthorizationUrl[0].imageUrlTemp
			} else {
				delete paramsData.brandAuthorizationUrl
			}
			// return
			const res = await addBrand(paramsData)

			if (res.data.resultCode === 0) {
				this.$message.success(res.data.resultMsg)
				this.resetForm()
				this.$emit('fatherMethodOne')
			}
		},

		// 编辑
		async updateBrandById() {
			const paramsData = Object.assign({}, this.funData)

			let imageObject = this.funData.businessLicenseImages
			let arrImg = []
			imageObject.map(function (item) {
				arrImg.push({
					imageUrl: item.imageUrl,
					sortOrder: item.sortOrder,
				})
			})
			paramsData.businessLicenseImages = imageObject ? imageObject : null
			if (paramsData.brandAuthorizationUrl.length > 0) {
				paramsData.brandAuthorizationUrl = this.funData.brandAuthorizationUrl[0].imageUrlTemp
				console.log('=========', 11111111111)
			} else {
				delete paramsData.brandAuthorizationUrl
			}
			let res = await updateBrandById(paramsData)

			if (res.data.resultCode === 0) {
				this.$message.success(res.data.resultMsg)
				this.resetForm()
				this.$emit('fatherMethodOne')
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.item[0].disabled = false
			this.item[2].disabled = false
			this.funData.brandName = ''
			this.funData.brandCategoryName = ''
			this.funData.description = ''
			this.funData.supplierName = ''
			this.funData.supplierAccountNumberId = ''
			this.funData.businessLicenseImages = ''
			this.funData.brandAuthorizationUrl = []
			this.$refs.form.$refs.YxForm.resetFields()
		},

		// 上传图片
		uploadCertificate: async function (params, v) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 69 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				if (v == 1) {
					res.data.resultData.imageList[0].businessLicenseImages = getBigImg(
						res.data.resultData.imageList[0].imageUrl
					)
					this.funData.businessLicenseImages.push(
						res.data.resultData.imageList[0]
					)
				} else {
					this.funData.brandAuthorizationUrl.push({
						imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
						imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
					})
				}
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>
<style lang="scss">
.heightBrandSet .el-dialog__body {
	max-height: 640px !important;
	overflow-y: auto;
}
</style>
