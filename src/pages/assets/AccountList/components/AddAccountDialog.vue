<template>
	<div>
		<el-dialog
			width="550px"
			title="银行卡信息"
			ref="form"
			:inline="true"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
			@close="close"
		>
			<yx-form
				ref="form"
				:inline="false"
				:data="formData"
				:rules="formRules"
				:items="searchCfg"
				:labelWidth="'110px'"
				:formAction="formAction"
				v-loading="loading"
			>
				<template #bankCityCode>
					<el-row :gutter="24">
						<el-col :span="7" class="bank_name">
							<el-select
								:disabled="lookState"
								v-model="formData.bankCityCode"
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
						<el-col :span="9" v-if="formData.bankCityCode == 820031">
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
						<el-col
							:span="7"
							v-if="formData.bankCityCode == 820031 && secondFlag"
						>
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
								<el-radio :label="201">否</el-radio>
								<el-radio :label="204">是</el-radio>
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

				<template #supplierAccountNumberId>
					<el-row :gutter="24">
						<el-col :span="20" class="bank_name">
							<el-input
								:disabled="lookState"
								v-model="formData.supplierAccountNumberId"
								placeholder="请在右侧按钮选择关联商家"
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
			</yx-form>

			<supplier-dialog
				:itemInfo="supplierRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { getAreaListByParentId } from '@/api/yhtPlusCmsSupplier'
import { getBankList, updateBankAccount } from '@/api/yhtPlusCmsFinance'
import { addBankAccount } from '@/api/weiXinUser'

import SupplierDialog from '../components/SupplierDialog'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		type: {
			type: Number,
			defalut: 3,
		},
		options: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		SupplierDialog,
	},
	created() {
		//获取银行卡列表
		this.getBankList()
	},
	mounted() {
		// let outType = JSON.parse(
		// 	JSON.stringify(this.$store.state.app.constant.RECHARGE_ACCOUNT_TYPE)
		// ).splice(1, 4)
		// this.searchCfg[2].options = outType.map((item) => {
		// 	return {
		// 		outType: item.type,
		// 		value: item.value,
		// 	}
		// })
	},
	data() {
		return {
			formsDialog: false,
			loading: false,
			searchCfg: [
				{
					type: 'input',
					dataIndex: 'accountName',
					title: '银行账户名',
					placeholder: '请输入银行账户名',
				},
				{
					type: 'input',
					dataIndex: 'accountNumber',
					title: '银行账户号',
					placeholder: '请输入银行账户号',
				},
				{
					type: 'select',
					title: '银行名称',
					dataIndex: 'bankName',
					label: 'bankName',
					options: [],
				},
				{
					type: 'custom',
					title: '银行所在城市',
					dataIndex: 'bankCityCode',
				},

				{
					title: '银行开户支行',
					type: 'input',
					dataIndex: 'bankSubbranch',
					placeholder: '请输入银行开户支行',
				},
				{
					type: 'custom',
					dataIndex: 'bankType',
					title: '是否对公账户',
				},
				{
					title: '身份证号',
					type: 'input',
					dataIndex: 'cardNumber',
					placeholder: '请输入身份证号',
				},
				{
					title: '手机号',
					type: 'input',
					dataIndex: 'phone',
					placeholder: '请输入手机号',
				},
				{
					title: '所属设备',
					type: 'input',
					dataIndex: 'sourceName',
					placeholder: '请输入所属设备',
				},
				{
					title: '银行卡余额',
					type: 'inputNumber',
					dataIndex: 'usableAmount',
					placeholder: '请输入银行卡余额',
				},
				{
					title: '支付宝总额度',
					type: 'inputNumber',
					dataIndex: 'alipayAmount',
					placeholder: '请输入支付宝总额度',
				},
				{
					title: '微信总额度',
					type: 'inputNumber',
					dataIndex: 'wxpayAmount',
					placeholder: '请输入微信总额度',
				},
				{
					title: '关联商家',
					type: 'custom',
					dataIndex: 'supplierAccountNumberId',
				},
			],
			formData: {
				accountName: '', // 请输入银行账户名
				accountNumber: '', // 银行账户号
				bankName: '', // 请输入银行名称
				bankSubbranch: '', //银行开户支行
				bankCityCode: '', // 银行所在城市
				areaSecond: '', // 地址二级
				areaThirdly: '', // 地址三级
				bankType: 201, // 是否是对公账户 201 私户   204公户
				linkNum: '', // 联行号
				cardNumber: '', // 身份证号
				phone: '', // 手机号
				sourceName: '', // 所属设备
				usableAmount: '', // 银行卡余额
				alipayAmount: '', // 支付宝总额度
				wxpayAmount: '', // 微信总额度
				supplierAccountNumberId: '', // 关联商家
			},
			formRules: {
				accountName: [
					{ required: true, message: '请输入银行账户名!', trigger: 'blur' },
				],
				accountNumber: [
					{ required: true, message: '请输入银行账户号!', trigger: 'blur' },
				],
				bankName: [
					{ required: true, message: '请选择银行名称!', trigger: 'blur' },
				],
				// bankCityCode: [
				// 	{ required: true, message: '请选择银行所在城市!', trigger: 'blur' },
				// ],
				bankSubbranch: [
					{ required: true, message: '请输入银行开户支行!', trigger: 'blur' },
				],
				bankType: [
					{ required: true, message: '请选择是否对公账户!', trigger: 'blur' },
				],
				// cardNumber: [
				// 	{ required: true, message: '请输入身份证号!', trigger: 'blur' },
				// ],
				// phone: [{ required: true, message: '请输入手机号!', trigger: 'blur' }],
				// sourceName: [
				// 	{ required: true, message: '请输入所属设备!', trigger: 'blur' },
				// ],
				// usableAmount: [
				// 	{ required: true, message: '请输入银行卡余额!', trigger: 'blur' },
				// ],
				// alipayAmount: [
				// 	{ required: true, message: '请输入支付宝总额度!', trigger: 'blur' },
				// ],
				// wxpayAmount: [
				// 	{ required: true, message: '请输入微信总额度!', trigger: 'blur' },
				// ],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submit()
					},
				},
				{
					title: '取消',
					type: 'cancel',
					click: () => {
						this.resetForm()
					},
				},
			],
			supplierRow: {}, // 银行当前行选中数据
			secondFlag: false, // 二级地区状态
			areaList: [], // 银行所在城市列表
			supplierList: [], // 地区一级
			areaSecondList: [], // 地区二级
			areaThirdlyList: [], // 地区三级
			areaSecondListMap: {}, // 地区二级映射
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

	methods: {
		open() {
			this.getAreaProvinceNameList()
			if (this.type === 1) {
				this.searchCfg[12] = {
					title: '关联商家',
					type: 'input',
					dataIndex: 'supplierName',
					disabled: true,
				}
				let paramJson = Object.assign(this.formData, {
					...this.options,
					bankCityCode: this.options.bankCity,
					areaName: '',
				})
				this.formData = paramJson
			}
		},
		moment(value) {
			return moment(value)
		},
		submit() {
			let {
				linkNum,
				bankType,
				areaSecond,
				areaThirdly,
				bankCityCode,
			} = this.formData

			if (bankType == 204 && !linkNum) {
				return this.$message.warning('请输入银联号')
			}
			const areaSecondMap = this.areaSecondListMap[areaSecond]
			let bankCity = bankCityCode
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
				this.areaThirdlyList.forEach((item) => {
					if (item.value == areaThirdly) {
						bankCity = item.label
						this.formData.areaName = item.label
						this.formData.areaId = areaThirdly
					}
				})
			} else if (bankCity == '其他地区' || (!areaSecond && this.type == 3)) {
				bankCity = '其他地区'
			}
			// if (
			// 	bankCity == undefined ||
			// 	bankCity == '' ||
			// 	bankCity == '请选择' ||
			// 	bankCity == '其他地区'
			// ) {
			// 	return this.$message.warning('请选择地区到市级')
			// }

			let parmasData = {
				...this.formData,
				bankCity,
				bankOwner: 1, //归属: 0:用户; 1:平台
			}
			if (this.supplierRow.supplierAccountNumberId)
				parmasData.supplierId = this.supplierRow.supplierAccountNumberId
			if (parmasData.isUse == '') {
				parmasData.isUse = '0'
			}
			if (this.type == 3) {
				this.addBankAccount(parmasData)
			} else if (this.type == 1) {
				this.updateBankAccount(parmasData)
			}
		},
		// 新增
		async addBankAccount(parmasData) {
			const res = await addBankAccount(parmasData)
			const { resultCode, resultMsg } = res.data

			if (resultCode == 0) {
				this.$emit('updateList')
				this.resetForm()
				this.$message.success(resultMsg)
			}
		},
		// 编辑
		async updateBankAccount(parmasData) {
			const res = await updateBankAccount(parmasData)
			const { resultCode, resultMsg } = res.data

			if (resultCode == 0) {
				this.$emit('updateList')
				this.resetForm()
				this.$message.success(resultMsg)
			}
		},
		async getBankList() {
			let {
				data: { resultCode, resultData = {} },
			} = await getBankList()
			if (resultCode == 0) {
				this.searchCfg[2].options = resultData.bankList || []
			}
		},
		// 关闭弹窗
		resetForm() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.localVisible = false
			this.formData.areaSecond = ''
			this.formData.areaThirdly = ''
			this.searchCfg[12] = {
				title: '关联商家',
				type: 'custom',
				dataIndex: 'supplierAccountNumberId',
				hide: false,
			}
		},
		// 子组件传值
		fatherMethodInit(row = {}) {
			this.formData.supplierAccountNumberId = row.supplierName
			this.supplierRow = row
		},
		// 获取银行所在城市
		async getAreaProvinceNameList(areaId) {
			const paramsData = {
				parentId: areaId ? areaId : 0,
			}
			//	this.loading = true
			const res = await getAreaListByParentId(paramsData)
			//	this.loading = false
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
				} else if (this.formData.bankCityCode == 820031 && this.secondFlag) {
					this.areaThirdlyList = []
					this.formData.areaThirdly = ''
					this.areaThirdlyList = resultData.areaList.map((item) => {
						return {
							label: item.areaName,
							value: item.areaId,
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
	},
}
</script>

<style lang="scss" scoped>
.interval {
	width: 500px;
}

.bank_name {
	margin-left: -11px;
}
.list-msg {
	position: relative;
	font-size: 14px;
	line-height: 26px;
}
.red-color {
	position: absolute;
	color: brown;
	top: -32px;
	font-size: 15px;
}
</style>
