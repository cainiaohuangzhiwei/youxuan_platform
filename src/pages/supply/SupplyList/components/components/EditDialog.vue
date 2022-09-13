<template>
	<div>
		<el-dialog
			width="550px"
			class="supplier"
			:title="`${titleMap[type]}商家`"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="closeForm"
			@open="open"
		>
			<yx-form
				class="interval"
				ref="form"
				:inline="false"
				:data="formData"
				:rules="formRules"
				:items="searchCfg"
				:labelWidth="'110px'"
				:formAction="formAction"
				v-loading="editLoading"
			>
				<template #bankName>
					<el-row :gutter="24">
						<el-col :span="20" class="bank_name">
							<el-input
								:disabled="lookState"
								v-model="formData.bankName"
								placeholder="请在右侧按钮选择银行账户名称"
								@focus="formsDialog = true"
						/></el-col>
						<el-col :span="2">
							<el-button
								type="primary"
								icon="el-icon-more"
								:disabled="lookState"
								@click="formsDialog = true"
							/>
						</el-col>
					</el-row>
				</template>
				<template #bankCity>
					<el-row :gutter="24">
						<el-col :span="7" class="bank_name">
							<el-select
								:disabled="lookState"
								v-model="formData.bankCity"
								placeholder="请选择"
								@change="handleBankCity"
							>
								<el-option
									v-for="item in areaList"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-col>
						<el-col :span="9" v-if="formData.bankCity == 820031">
							<el-select
								:disabled="lookState"
								v-model="formData.areaSecond"
								placeholder="请选择"
								@change="handleSecondBankCity"
							>
								<el-option
									v-for="item in areaSecondList"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-col>
						<el-col :span="7" v-if="formData.bankCity == 820031 && secondFlag">
							<el-select
								:disabled="lookState"
								v-model="formData.areaThirdly"
								placeholder="请选择"
							>
								<el-option
									v-for="item in areaThirdlyList"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-col>
					</el-row>
				</template>
				<template #bankType>
					<el-row :gutter="24">
						<el-col :span="8">
							<el-radio-group v-model="formData.bankType" :disabled="lookState">
								<el-radio :label="204">是</el-radio>
								<el-radio :label="201">否</el-radio>
							</el-radio-group></el-col
						>
						<el-col :span="15" v-if="formData.bankType == 204"
							><el-input
								type="number"
								:disabled="lookState"
								v-model="formData.linkNum"
								placeholder="请输入银联号"
						/></el-col>
					</el-row>
				</template>
			</yx-form>

			<bank-dialog
				:itemInfo="bankRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</el-dialog>
	</div>
</template>

<script>
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import YxForm from '@wg-vue-materials/yx-form'
import BankDialog from '../components/BankDialog'
import {
	addCmsSupplier,
	updateCmsSupplier,
	getAreaListByParentId,
	supplierAccountNumberList,
	getCmsSupplierListByCondition,
} from '@/api/yhtPlusCmsSupplier'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		delType: {
			type: Number,
		},
	},

	components: {
		YxForm,
		BankDialog,
	},

	data() {
		return {
			editLoading: false,
			timer: null,
			type: '',
			formData: {
				supplierName: '', // 商家名称
				supplierAccountNumberId: '', // 商家名称ID
				name: '', // 姓名
				mobPhone: '', // 手机号
				accountName: '', // 银行账户名
				bankName: '', // 银行账户名称
				bankSubbranch: '', // 开户支行
				bankCity: '', // 银行所在城市
				bankType: 204, // 是否是对公账户 201 私户   204公户
				areaSecond: '', // 地址二级
				areaThirdly: '', // 地址三级
				linkNum: '', // 银联号
				businessLicenseImage: [], // 企业营业执照
				credentialsImage: [], // 企业资质证明
				brandAuthorizationImage: [], // 品牌授权书
				inspectionReportImage: [], // 商品检测报告
			},
			supplierId: '', // 编辑ID
			bankRow: {}, // 银行当前行选中数据
			lookState: false, // 查看状态
			secondFlag: false, // 二级地区状态
			areaList: [], // 银行所在城市列表
			supplierList: [], // 地区一级
			areaSecondList: [], // 地区二级
			areaThirdlyList: [], // 地区三级
			areaSecondListMap: {}, // 地区二级映射
			supplierListMap: {}, // 商家映射
			imageList: [],
			searchCfg: [
				{
					type: 'select',
					title: '商家名称',
					dataIndex: 'supplierName',
					label: 'value',
					options: this.supplierList,
					selectAttributes: {
						filterable: true,
						filterMmethod: (val) => {
							if (this.timer) clearTimeout(this.timer)
							this.timer = setTimeout(() => {
								this.getSupplierAccountNumberList(val)
							}, 800)
						},
					},
				},
				{
					title: '姓名',
					dataIndex: 'name',
					placeholder: '请输入姓名',
				},
				{
					title: '手机号',
					type: 'inputNumber',
					dataIndex: 'mobPhone',
					placeholder: '请输入手机号',
				},
				{
					title: '银行账户名',
					dataIndex: 'accountName',
					placeholder: '请输入银行账户名',
				},
				{
					title: '银行账户号',
					type: 'inputNumber',
					dataIndex: 'accountNumber',
					placeholder: '请输入银行账户号',
				},
				{
					title: '银行账户名称',
					type: 'custom',
					dataIndex: 'bankName',
				},
				{
					type: 'custom',
					title: '银行所在城市',
					dataIndex: 'bankCity',
				},
				{
					title: '开户支行',
					dataIndex: 'bankSubbranch',
					placeholder: '请输入开户支行',
				},
				{
					type: 'custom',
					title: '是否是对公账户',
					dataIndex: 'bankType',
				},
				{
					type: 'uploadImage',
					title: '企业营业执照',
					dataIndex: 'businessLicenseImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'businessLicenseImage',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'businessLicenseImage',
								'addSupplierCredentials',
								44
							),
					},
				},
				{
					type: 'uploadImage',
					title: '企业资质证明',
					dataIndex: 'credentialsImage',
					uploadAttributes: {
						limit: 20,
						imageName: 'credentialsImage',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'credentialsImage',
								'addSupplierCredentials',
								45
							),
					},
				},
				{
					type: 'uploadImage',
					title: '品牌授权书',
					dataIndex: 'brandAuthorizationImage',
					uploadAttributes: {
						limit: 40,
						imageName: 'brandAuthorizationImage',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'brandAuthorizationImage',
								'addBrandAuthorization',
								46
							),
					},
				},
				{
					type: 'uploadImage',
					title: '商品检测报告',
					dataIndex: 'inspectionReportImage',
					uploadAttributes: {
						limit: 20,
						imageName: 'inspectionReportImage',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'inspectionReportImage',
								'addSupplierReport',
								47
							),
					},
				},
				{
					type: 'custom',
					dataIndex: 'submit',
				},
			],
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
				{
					title: '取消',
					cancel: true,
					click: () => {
						this.closeForm()
					},
				},
			],
			titleMap: {
				1: '编辑',
				3: '新增',
				2: '查看',
			},
			formsDialog: false,
			formRules: {
				supplierName: [
					{ required: true, message: '请输入商家名称', trigger: 'blur' },
				],
				name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
				mobPhone: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
				],
				accountName: [
					{ required: true, message: '请选择银行账户名', trigger: 'blur' },
				],
				accountNumber: [
					{ required: true, message: '请输入银行账户号', trigger: 'blur' },
				],
				bankCity: [
					{ required: true, message: '请选择银行所在城市', trigger: 'blur' },
				],
				bankSubbranch: [
					{ required: true, message: '请输入开户支行', trigger: 'blur' },
				],
				businessLicenseImage: [
					{ required: true, message: '请上传企业营业执照', trigger: 'blur' },
				],
				credentialsImage: [
					{ required: true, message: '请上传企业资质证明', trigger: 'blur' },
				],
				brandAuthorizationImage: [
					{ required: true, message: '请上传品牌授权书', trigger: 'blur' },
				],
				inspectionReportImage: [
					{ required: true, message: '请上传商品检测报告', trigger: 'blur' },
				],
			},
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
		}
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
	watch: {
		delType(val) {
			if (val == 2) {
				this.searchCfg[9].uploadAttributes.canNotBeModified = true
				this.searchCfg[10].uploadAttributes.canNotBeModified = true
				this.searchCfg[11].uploadAttributes.canNotBeModified = true
				this.searchCfg[12].uploadAttributes.canNotBeModified = true
			} else {
				this.searchCfg[9].uploadAttributes.canNotBeModified = false
				this.searchCfg[10].uploadAttributes.canNotBeModified = false
				this.searchCfg[11].uploadAttributes.canNotBeModified = false
				this.searchCfg[12].uploadAttributes.canNotBeModified = false
			}
		},
	},
	methods: {
		open() {
			this.formAction = [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
				{
					title: '取消',
					cancel: true,
					click: () => {
						this.closeForm()
					},
				},
			]
		},
		// 回显
		detail(type, row) {
			this.type = type
			this.supplierId = row.supplierId

			if (this.type == 1 || this.type == 2) {
				this.handleLook(this.type, this.supplierId)
			} else {
				for (let k = 0; k < this.searchCfg.length; k++) {
					this.searchCfg[k].disabled = false
				}
				this.lookState = false
			}

			this.getAreaProvinceNameList()
			this.getSupplierAccountNumberList()
		},

		// 关闭弹窗
		closeForm() {
			this.localVisible = false
			this.formData = {
				supplierName: '', // 商家名称
				supplierAccountNumberId: '', // 商家名称ID
				name: '', // 姓名
				mobPhone: '', // 手机号
				accountName: '', // 银行账户名
				bankName: '', // 银行账户名称
				bankSubbranch: '', // 开户支行
				bankCity: '', // 银行所在城市
				bankType: 204, // 是否是对公账户 201 私户   204公户
				areaSecond: '', // 地址二级
				areaThirdly: '', // 地址三级
				linkNum: '', // 银联号
				businessLicenseImage: [], // 企业营业执照
				credentialsImage: [], // 企业资质证明
				brandAuthorizationImage: [], // 品牌授权书
				inspectionReportImage: [], // 商品检测报告
			}
			this.$refs.form.$refs.YxForm.resetFields()
		},

		// 查看
		async handleLook(type, supplierId) {
			this.lookState = false

			if (supplierId) {
				this.editLoading = true
				const res = await getCmsSupplierListByCondition({ supplierId })
				this.editLoading = false
				const { count, supplierList } = res.data.resultData

				if (supplierList[0].businessLicenseImage) {
					supplierList[0].businessLicenseImage = [
						supplierList[0].businessLicenseImage,
					]
				} else {
					supplierList[0].businessLicenseImage = []
				}

				if (count > 0) {
					for (let i = 0; i < supplierList.length; i++) {
						const item = supplierList[i]

						// 企业营业执照图片转换
						if (item.businessLicenseImage.length > 0) {
							for (let j = 0; j < item.businessLicenseImage.length; j++) {
								item.businessLicenseImage[j].businessLicenseImage = getBigImg(
									item.businessLicenseImage[j].imageUrl
								)
							}
						}

						// 企业资质证明图片转换
						if (item.credentialsImage.length > 0) {
							for (let j = 0; j < item.credentialsImage.length; j++) {
								item.credentialsImage[j].credentialsImage = getBigImg(
									item.credentialsImage[j].imageUrl
								)
							}
						}

						// 品牌授权书图片转换
						if (item.brandAuthorizationImage.length > 0) {
							for (let j = 0; j < item.brandAuthorizationImage.length; j++) {
								item.brandAuthorizationImage[
									j
								].brandAuthorizationImage = getBigImg(
									item.brandAuthorizationImage[j].imageUrl
								)
							}
						}

						// 商品检测报告图片转换
						if (item.inspectionReportImage.length > 0) {
							for (let j = 0; j < item.inspectionReportImage.length; j++) {
								item.inspectionReportImage[j].inspectionReportImage = getBigImg(
									item.inspectionReportImage[j].imageUrl
								)
							}
						}
					}

					this.formData = supplierList[0]
					this.formData.supplierId = supplierList[0].supplierId
					this.formData.supplierName = supplierList[0].supplierName

					// 查看
					if (type == 2) {
						this.lookState = true
						for (let k = 0; k < this.searchCfg.length; k++) {
							this.searchCfg[k].disabled = true
						}
						this.formAction = []
					} else if (type == 1) {
						// 编辑
						for (let k = 0; k < this.searchCfg.length; k++) {
							this.searchCfg[k].disabled = false
						}
						this.searchCfg[3].disabled = true
						this.searchCfg[4].disabled = true
						this.searchCfg[5].disabled = true
						this.searchCfg[6].disabled = true
						this.searchCfg[7].disabled = true
						this.lookState = true
					}
				}
			}
		},

		// 商家账号列表
		async getSupplierAccountNumberList(val) {
			this.lookState = false
			const paramsData = {
				selectionTag: 2,
				startIndex: 0,
				length: 20,
			}

			if (val) {
				paramsData.keyword = val
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
					}
				})

				supplierAccountList.map((item, index) => {
					this.supplierListMap[supplierAccountList[index].supplierName] =
						supplierAccountList[index].supplierAccountNumberId
				})
				this.searchCfg[0].options = this.supplierList
			} else {
				this.searchCfg[0].options = []
			}
		},

		// 获取银行所在城市
		async getAreaProvinceNameList(areaId) {
			const paramsData = {
				parentId: areaId ? areaId : 0,
			}

			const res = await getAreaListByParentId(paramsData)
			const { resultData } = res.data

			if (resultData.areaList.length > 0) {
				if (paramsData.parentId === 0) {
					this.areaList = resultData.areaList.map((item) => {
						return {
							label: item.areaName,
							value: item.areaId,
						}
					})
				} else if (paramsData.parentId == 820031) {
					this.areaSecondList = resultData.areaList.map((item) => {
						return {
							label: item.areaName,
							value: item.areaId,
						}
					})

					resultData.areaList.map((item, index) => {
						this.areaSecondListMap[resultData.areaList[index].areaId] =
							resultData.areaList[index].areaName
					})
				} else if (this.formData.bankCity == 820031 && this.secondFlag) {
					this.areaThirdlyList = []
					this.formData.areaThirdly = ''
					this.areaThirdlyList = resultData.areaList.map((item) => {
						return {
							label: item.areaName,
							value: item.areaName,
						}
					})
				}
			}
		},

		// 地区一级
		handleBankCity(val) {
			if (val != 820031) {
				this.areaSecondList = []
				this.areaThirdlyList = []
				this.formData.areaSecond = ''
				this.formData.areaThirdly = ''
			}

			this.getAreaProvinceNameList(val)
		},

		// 地区二级
		handleSecondBankCity(val) {
			this.secondFlag = val ? true : false
			const areaSecond = this.areaSecondListMap[val]

			if (areaSecond == '香港特别行政区' || areaSecond == '澳门特别行政区') {
				this.secondFlag = false
			}

			this.getAreaProvinceNameList(val)
		},

		// 子组件传值
		fatherMethodInit(row = {}) {
			this.formData.bankName = row.bankName
			this.bankRow = row
		},

		// 新增
		async addCmsSupplier(parmasData) {
			const res = await addCmsSupplier(parmasData)
			const { resultCode, resultMsg } = res.data

			if (resultCode == 0) {
				this.$emit('onSubmit')
				this.closeForm()
				this.$message.success(resultMsg)
			}
		},

		// 编辑
		async updateCmsSupplier(parmasData) {
			const res = await updateCmsSupplier(parmasData)
			const { resultCode, resultMsg } = res.data

			if (resultCode == 0) {
				this.$emit('onSubmit')
				this.closeForm()
				this.$message.success(resultMsg)
			}
		},

		// 确定
		submitForm() {
			let {
				supplierName,
				name,
				mobPhone,
				accountName,
				accountNumber,
				bankName,
				bankSubbranch,
				bankCity,
				bankType,
				linkNum,
				areaSecond,
				areaThirdly,
				businessLicenseImage,
				credentialsImage,
				brandAuthorizationImage,
				inspectionReportImage,
			} = this.formData

			const areaSecondMap = this.areaSecondListMap[areaSecond]
			let supplierAccountNumberId = this.supplierListMap[
				this.formData.supplierName
			]

			if (!supplierAccountNumberId) {
				return this.$message.warning('请在下拉框选择一个商家')
			}

			if (bankType == 204 && !linkNum) {
				return this.$message.warning('请输入银联号')
			}

			if (
				areaSecondMap == '北京市' ||
				areaSecondMap == '天津市' ||
				areaSecondMap == '上海市' ||
				areaSecondMap == '重庆市' ||
				areaSecondMap == '香港特别行政区' ||
				areaSecondMap == '澳门特别行政区'
			) {
				bankCity = areaSecondMap
			} else if (areaThirdly) {
				bankCity = areaThirdly
			} else if (bankCity == '其他地区' || (!areaSecond && this.type == 3)) {
				bankCity = '其他地区'
			}

			let imageList
			if (this.type == 1 || this.type == 3) {
				imageList = this.handleImgData(
					businessLicenseImage,
					credentialsImage,
					brandAuthorizationImage,
					inspectionReportImage
				)
			}

			const parmasData = Object.assign(
				{},
				{
					supplierName: supplierName,
					supplierAccountNumberId: supplierAccountNumberId,
					name: name.replace(/(^\s*)|(\s*$)/g, ''),
					mobPhone: mobPhone.replace(/(^\s*)|(\s*$)/g, ''),
					accountName: accountName.replace(/(^\s*)|(\s*$)/g, ''),
					accountNumber: accountNumber.replace(/(^\s*)|(\s*$)/g, ''),
					bankId: this.bankRow.bankId || '',
					bankName: bankName,
					bankSubbranch: bankSubbranch,
					bankCity: bankCity,
					bankType: bankType,
					linkNum: linkNum,
					imageList: imageList,
				}
			)
			if (this.type == 3) {
				this.addCmsSupplier(parmasData)
			} else if (this.type == 1) {
				parmasData.supplierId = this.supplierId
				this.updateCmsSupplier(parmasData)
			}
		},

		// 图片上传数据处理
		handleImgData(
			businessLicenseImage,
			credentialsImage,
			brandAuthorizationImage,
			inspectionReportImage
		) {
			let imageList = []

			// type: 1是编辑, 3是新增
			if (this.type == 3) {
				const imgTwo = this.handleAddImageData(credentialsImage)
				const imgThree = this.handleAddImageData(brandAuthorizationImage)
				const imgFour = this.handleAddImageData(inspectionReportImage)

				imageList = imageList
					.concat(businessLicenseImage)
					.concat(imgTwo)
					.concat(imgThree)
					.concat(imgFour)
			} else if (this.type == 1) {
				const imgOne = this.handleEditImageData(businessLicenseImage)
				const imgTwo = this.handleEditImageData(credentialsImage)
				const imgThree = this.handleEditImageData(brandAuthorizationImage)
				const imgFour = this.handleEditImageData(inspectionReportImage)

				imageList = imageList
					.concat(imgOne)
					.concat(imgTwo)
					.concat(imgThree)
					.concat(imgFour)
			}

			return imageList
		},

		// 新增图片数据处理
		handleAddImageData(item) {
			const imageList = []
			if (item.length > 0) {
				for (let i = 0; i < item.length; i++) {
					const first = item[i]

					if (first.length > 0) {
						for (let j = 0; j < first.length; j++) {
							imageList.push(first[j])
						}
					}
				}
			}

			return imageList
		},

		// 编辑图片数据处理
		handleEditImageData(item) {
			const imageList = []
			if (item.length > 0) {
				for (let i = 0; i < item.length; i++) {
					if (Array.isArray(item[i])) {
						const arr = item[i]
						for (let j = 0; j < item.length; j++) {
							imageList.push(arr[j])
						}
					} else {
						imageList.push(item[i])
					}
				}
			}

			return imageList.filter(Boolean)
		},

		// 上传图片
		async uploadCertificate(params, key, name, imageType) {
			const formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: `#${name}`, imageType: imageType })
			)
			formData.append('image', params.file)
			const res = await uploadImageList(formData)

			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				if (imageType == 44) {
					this.formData[key] = res.data.resultData.imageList
					this.formData[key][0][key] = getBigImg(
						res.data.resultData.imageList[0].imageUrl
					)
				} else {
					this.formData[key].push(res.data.resultData.imageList)
					console.log('jsdlgkjnsodg', res.data.resultData.imageList)
					for (let i = 0; i < this.formData[key].length; i++) {
						const item = this.formData[key][i]
						for (let j = 0; j < item.length; j++) {
							if (item[j].imageUrl) {
								this.formData[key][i][key] = getBigImg(item[j].imageUrl)
							}
						}
					}
				}

				this.flag = false
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.supplier {
	.interval {
		width: 500px;
	}

	.bank_name {
		margin-left: -11px;
	}
}
</style>
