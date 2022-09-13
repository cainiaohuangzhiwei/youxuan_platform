<template>
	<div>
		<yx-form
			:inline="true"
			:data="formData181"
			:items="formCfg181"
			:formAction="formAction181"
		>
		</yx-form>
		<yx-table
			v-loading="loading"
			:select="false"
			:columns="tableColumns182"
			:pagination="page182"
			:data="tableData182"
		>
		</yx-table>
		<Dialog
			:title="dialogTitle183"
			:visible.sync="dialogVisible183"
			:width="dialogWidth183"
			:bottomBtn="dialogBottomBtn183"
		>
			<yx-table
				v-loading="loading183"
				:select="false"
				:columns="tableColumns183"
				:data="tableData183"
				:pagination="page183"
			>
			</yx-table>
		</Dialog>
		<Dialog
			:title="dialogTitle184"
			:visible.sync="dialogVisible184"
			:width="dialogWidth183"
			:bottomBtn="dialogBottomBtn184"
		>
			<yx-form
				ref="yxForm184"
				labelWidth="120px"
				:inline="false"
				:rules="formRules184"
				:data="formData184"
				:items="formCfg184"
			>
				<template slot="area">
					<div>
						<el-select
							v-model="bankInfo.provinceCode"
							placeholder="请选择省"
							@change="
								(code) => {
									this.getAreaList(code, 'cityList')
								}
							"
						>
							<el-option
								v-for="item in provinceList"
								:key="item.code"
								:label="item.simpleName"
								:value="item.code"
							>
							</el-option>
						</el-select>
						<el-select
							style="margin-left: 20px"
							v-if="cityList.length"
							v-model="bankInfo.cityCode"
							placeholder="请选择市"
							@change="
								(code) => {
									this.getAreaList(code, 'areaList')
								}
							"
						>
							<el-option
								v-for="item in cityList"
								:key="item.code"
								:label="item.simpleName"
								:value="item.code"
							>
							</el-option>
						</el-select>
						<el-select
							style="margin-left: 20px"
							v-if="areaList.length"
							v-model="bankInfo.areaCode"
							placeholder="请选择市"
						>
							<el-option
								v-for="item in areaList"
								:key="item.code"
								:label="item.simpleName"
								:value="item.code"
							>
							</el-option>
						</el-select>
					</div>
				</template>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	// getBankListPageByPlatform,
	// listPageBySupplier,
	listOperateRecord,
	addBindBank,
	modifyBindBank,
	listSuningWithdrawAccountPlaform,
} from '@/api/accountService'
import { bankAddressCode } from '@/api/weeget-bullet-payment-rest'
export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	data() {
		return {
			dialogTitle184: '新增银行卡',
			dialogVisible184: false,
			bankInfo: {
				provinceCode: '',
				cityCode: '',
				areaCode: '',
			},
			provinceList: [],
			cityList: [],
			areaList: [],
			formRules184: {
				bankName: [
					{ required: true, message: '请输入银行名称', trigger: 'blur' },
				],
				bankAccountNo: [
					{ required: true, message: '请输入银行账户号', trigger: 'blur' },
				],
				bankAccountName: [
					{ required: true, message: '请输入开户名称', trigger: 'blur' },
				],
				bankSubbranch: [
					{ required: true, message: '请输入开户支行', trigger: 'blur' },
				],
				toPublicBankAccount: [
					{ required: true, message: '请选择是否对公银行', trigger: 'change' },
				],
				area: [
					{
						validator: (rule, value, callback) => {
							if (!this.bankInfo.provinceCode && this.provinceList.length) {
								callback(new Error('请选择地区'))
							} else if (!this.bankInfo.cityCode && this.cityList.length) {
								callback(new Error('请选择地区'))
							} else if (!this.bankInfo.areaCode && this.areaList.length) {
								callback(new Error('请选择地区'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				bankLinkNum: [
					{
						validator: (rule, value, callback) => {
							if (value === '' && this.formData184.toPublicBankAccount) {
								callback(new Error('请输入联行号'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				businessType: [
					{
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择是否变更主体'))
							} else if (
								this.rowBandInfo.toPublicBankAccount !=
									this.formData184.toPublicBankAccount &&
								this.formData184.businessType != 1
							) {
								callback(new Error('修改类型请选择更改主体'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
					// { required: true, message: '请选择是否变更主体', trigger: 'change' },
				],
			},
			formData184: {
				bankName: '',
				bankAccountNo: '',
				bankAccountName: '',
				toPublicBankAccount: true,
				bankLinkNum: '',
				bankSubbranch: '',
				businessType: 2,
				supplierId: '',
				opreator: '', // 操作人
			},
			formCfg184: [
				{
					title: '银行名称',
					type: 'input',
					dataIndex: 'bankName',
					label: 'value',
					class: 'input-box-bind-account',
				},
				{
					title: '银行账户号',
					type: 'input',
					dataIndex: 'bankAccountNo',
					class: 'input-box-bind-account',
				},
				{
					title: '开户名称',
					type: 'input',
					dataIndex: 'bankAccountName',
					class: 'input-box-bind-account',
				},
				{
					title: '开户支行',
					type: 'input',
					dataIndex: 'bankSubbranch',
					class: 'input-box-bind-account',
				},
				{
					title: '',
					type: 'radio',
					dataIndex: 'toPublicBankAccount',
					label: 'value',
					disabled: false,
					class: 'input-box-bind-account',
					options: [
						{
							toPublicBankAccount: true,
							value: '对公银行卡',
						},
						{
							toPublicBankAccount: false,
							value: '对私银行卡',
						},
					],
					change: (toPublicBankAccount) => {
						this.setItems(toPublicBankAccount)
					},
				},
				{
					title: '银行所在城市',
					type: 'custom',
					dataIndex: 'area',
					hide: false,
				},
				{
					title: '联行号',
					type: 'input',
					dataIndex: 'bankLinkNum',
					class: 'input-box-bind-account',
					hide: false,
				},
				{
					title: '是否变更主体',
					type: 'radio',
					dataIndex: 'businessType',
					label: 'value',
					disabled: false,
					class: 'input-box-bind-account',
					options: [
						{
							businessType: 2,
							value: '否',
						},
						{
							businessType: 1,
							value: '是',
						},
					],
				},
			],
			rowBandInfo: {},
			isAdd: false,
			dialogBottomBtn184: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.yxForm184.$refs.YxForm.validate((valid) => {
							if (valid) {
								if (this.isAdd) {
									this._addBindBank()
								} else {
									this._modifyBindBank()
								}
							}
						})
					},
				},
			],
			loading183: false,
			tableColumns183: [
				{
					type: 'date',
					dataIndex: 'updateTime',
					title: '变更时间',
				},
				{
					type: 'string',
					dataIndex: 'operateRemark',
					title: '变更记录',
				},
				{
					type: 'string',
					dataIndex: 'opreator',
					title: '变更人',
				},
			],
			page183: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listOperateRecord()
				},
			},
			tableData183: [],
			dialogTitle183: '操作记录',
			dialogVisible183: false,
			dialogWidth183: '850px',
			dialogBottomBtn183: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.dialogVisible183 = false
					},
				},
			],
			bindCardStatus: [
				'未提交',
				'初始化',
				'资料校验中',
				'待汇款校验中',
				'汇款校验中',
				'审核中',
				'已驳回',
				'已通过',
				'已关闭',
			],
			supplierId: '',
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'enableOpenAccountName',
					title: '启用开户名称',
					// customRender: (row) => {
					// 	return row.bandInfo.bankAccountName
					// },
				},
				{
					type: 'string',
					dataIndex: 'outRequestNo',
					title: '进件单号',
					// customRender: (row) => {
					// 	return row.bandInfo.outRequestNo
					// },
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'bankAccountNo',
				// 	title: '银行账号',
				// 	customRender: (row) => {
				// 		return row.bandInfo.bankAccountNo
				// 	},
				// },
				// {
				// 	type: 'string',
				// 	dataIndex: 'bankName',
				// 	title: '银行名称',
				// 	customRender: (row) => {
				// 		return row.bandInfo.bankName
				// 	},
				// },
				{
					type: 'string',
					dataIndex: 'bindCardStatus',
					title: '苏宁签约状态',
					customRender: (row) => {
						return this.bindCardStatus[row.bindCardStatus]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看账户详情',
							auth: 'getSuningAccountInfoForMerchant',
							click: (row) => {
								this.$router.push({
									path: `cashAccountDetails/${row.openAccountSn}/${
										row.suningOpenAccountBankInfoId
									}/${row.supplierId}/${'supplier'}`,
								})
							},
						},
						// {
						// 	title: '修改记录',
						// 	auth: 'listSuningOperateRecord',
						// 	click: ({ supplierId }) => {
						// 		this.supplierId = supplierId
						// 		this.dialogVisible183 = true
						// 		this.tableData183 = []
						// 		this._listOperateRecord(true)
						// 	},
						// },
						{
							title: '查看银行卡',
							auth: 'listSupplierSuningBankAccount',
							click: (row) => {
								this.$router.push({
									path: `bankCardManagement/${0}/${row.openAccountSn}`,
								})
							},
						},
						// {
						// 	title: '编辑',
						// 	auth: 'modifySuningBindBank',
						// 	click: ({ supplierId, openAccountSn, bandInfo }) => {
						// 		this.formData184 = {
						// 			bankName: bandInfo.bankName,
						// 			bankAccountNo: bandInfo.bankAccountNo,
						// 			bankAccountName: bandInfo.bankAccountName,
						// 			toPublicBankAccount: bandInfo.toPublicBankAccount,
						// 			bankLinkNum: bandInfo.bankLinkNum,
						// 			bankSubbranch: bandInfo.bankSubbranch,
						// 			businessType: 2,
						// 			supplierId,
						// 			openAccountSn,
						// 			suningOpenAccountBankInfoId:
						// 				bandInfo.suningOpenAccountBankInfoId,
						// 			opreator: this.$store.state.user.userInfo.clerkName, // 操作人
						// 		}
						// 		this.formCfg184.forEach((item) => {
						// 			if (
						// 				item.dataIndex == 'toPublicBankAccount' ||
						// 				item.dataIndex == 'businessType'
						// 			) {
						// 				item.disabled = true
						// 			}
						// 		})
						// 		this._bankCodes('', (resultCode, resultData) => {
						// 			if (resultCode == 0) {
						// 				this.provinceList = resultData.bankAddressCodeBOS
						// 			}
						// 		})
						// 		if (bandInfo.bankCityCode) {
						// 			let municipalityList = [
						// 				'110000',
						// 				'120000',
						// 				'310000',
						// 				'500000',
						// 				'810000',
						// 				'820000',
						// 			]
						// 			let provinceCode = `${bandInfo.bankCityCode.slice(0, 2)}0000`
						// 			let cityCode =
						// 				municipalityList.indexOf(provinceCode) != -1
						// 					? bandInfo.bankCityCode
						// 					: `${bandInfo.bankCityCode.slice(0, 4)}00`
						// 			let bankInfo = {
						// 				provinceCode,
						// 				cityCode,
						// 				areaCode: bandInfo.bankCityCode,
						// 			}

						// 			this._bankCodes(
						// 				bankInfo.provinceCode,
						// 				(resultCode, resultData) => {
						// 					if (resultCode == 0) {
						// 						this.cityList = resultData.bankAddressCodeBOS
						// 					}
						// 				}
						// 			)
						// 			this._bankCodes(
						// 				bankInfo.cityCode,
						// 				(resultCode, resultData) => {
						// 					if (resultCode == 0) {
						// 						this.areaList = resultData.bankAddressCodeBOS
						// 					}
						// 				}
						// 			)
						// 			this.bankInfo = bankInfo
						// 		}
						// 		this.isAdd = false
						// 		this.rowBandInfo = bandInfo
						// 		this.setItems(bandInfo.toPublicBankAccount)
						// 		this.dialogTitle184 = '编辑银行卡'
						// 		this.dialogVisible184 = true
						// 	},
						// 	customRender: (action, row) => {
						// 		action.hide = row.bindCardStatus != 6 && row.bindCardStatus != 0
						// 		return action
						// 	},
						// },
						// {
						// 	title: '新增',
						// 	auth: 'addSuningBindBank',
						// 	click: ({ supplierId, openAccountSn, bandInfo }) => {
						// 		this.formData184 = {
						// 			bankName: '',
						// 			bankAccountNo: '',
						// 			bankAccountName: '',
						// 			toPublicBankAccount: bandInfo.toPublicBankAccount,
						// 			bankLinkNum: '',
						// 			bankSubbranch: '',
						// 			businessType: 2,
						// 			supplierId,
						// 			openAccountSn,
						// 			opreator: this.$store.state.user.userInfo.clerkName, // 操作人
						// 		}
						// 		this.rowBandInfo = bandInfo
						// 		this.isAdd = true
						// 		this.formCfg184.forEach((item) => {
						// 			if (
						// 				item.dataIndex == 'toPublicBankAccount' ||
						// 				item.dataIndex == 'businessType'
						// 			) {
						// 				item.disabled = false
						// 			}
						// 		})
						// 		this.setItems(bandInfo.toPublicBankAccount)
						// 		this._bankCodes('', (resultCode, resultData) => {
						// 			if (resultCode == 0) {
						// 				this.provinceList = resultData.bankAddressCodeBOS
						// 			}
						// 		})
						// 		this.cityList = []
						// 		this.areaList = []
						// 		this.bankInfo = {
						// 			provinceCode: '',
						// 			cityCode: '',
						// 			areaCode: '',
						// 		}
						// 		this.dialogTitle184 = '新增银行卡'
						// 		this.dialogVisible184 = true
						// 	},
						// 	customRender: (action, row) => {
						// 		action.hide = row.bindCardStatus != 7
						// 		return action
						// 	},
						// },
					],
				},
			],
			page182: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listPageByPlatform()
				},
			},
			tableData182: [],
			loading: false,
			formData181: {
				// 商家名称
				supplierName: '',
				// 进件单号
				outRequestNo: '',
				// 签约状态
				bindCardStatus: '',
			},
			formCfg181: [
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					type: 'input',
					title: '进件单号',
					dataIndex: 'outRequestNo',
				},
				{
					type: 'select',
					dataIndex: 'bindCardStatus',
					title: '签约状态',
					label: 'value',
					options: [
						{
							bindCardStatus: '',
							value: '全部',
						},
						{
							bindCardStatus: 0,
							value: '未提交',
						},
						{
							bindCardStatus: 1,
							value: '初始化',
						},
						{
							bindCardStatus: 2,
							value: '资料校验中',
						},
						{
							bindCardStatus: 3,
							value: '汇款处理中',
						},
						{
							bindCardStatus: 4,
							value: '汇款验证成功',
						},
						{
							bindCardStatus: 7,
							value: '审核通过',
						},
						{
							bindCardStatus: 6,
							value: '已驳回',
						},
						{
							bindCardStatus: 8,
							value: '已关闭',
						},
					],
				},
			],
			formAction181: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._listPageByPlatform(true)
					},
				},
			],
		}
	},
	methods: {
		setItems(hide) {
			const dataIndexList = ['bankLinkNum']
			this.formCfg184.forEach((item) => {
				if (dataIndexList.indexOf(item.dataIndex) != -1) {
					item.hide = !hide
				}
			})
		},
		getAreaList(code, key) {
			if (key == 'cityList') {
				this.bankInfo.cityCode = ''
				this.bankInfo.areaCode = ''
				this.areaList = []
			} else {
				this.bankInfo.areaCode = ''
			}
			this._bankCodes(code, (resultCode, resultData) => {
				if (resultCode == 0) {
					this[key] = resultData.bankAddressCodeBOS
				}
			})
		},
		async _bankCodes(code = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await bankAddressCode({
				code,
				channel: 'SU_NING',
				sign: 'a29c832d825365aba30267d0c6209156',
				developerId: 10001,
				signType: 'MD5',
				version: '1.0',
			})
			if (cb) {
				cb(resultCode, resultData)
			}
		},
		async _modifyBindBank() {
			let {
				data: { resultCode },
			} = await modifyBindBank({
				bankCityCode:
					this.bankInfo.areaCode ||
					this.bankInfo.cityCode ||
					this.bankInfo.provinceCode,
				...this.formData184,
			})
			if (resultCode == 0) {
				this.bankInfo.provinceCode = ''
				this.bankInfo.cityCode = ''
				this.bankInfo.areaCode = ''
				this.areaList = []
				this.cityList = []
				this.dialogVisible184 = false
				this._listPageByPlatform()
			}
		},
		async _addBindBank() {
			let {
				data: { resultCode },
			} = await addBindBank({
				bankCityCode:
					this.bankInfo.areaCode ||
					this.bankInfo.cityCode ||
					this.bankInfo.provinceCode,
				...this.formData184,
			})
			if (resultCode == 0) {
				this.bankInfo.provinceCode = ''
				this.bankInfo.cityCode = ''
				this.bankInfo.areaCode = ''
				this.areaList = []
				this.cityList = []
				this.dialogVisible184 = false
				this._listPageByPlatform()
			}
		},
		findSearchParams138(flag) {
			let paramJson = {
				pageSize: 10,
				pageNum: 1,
			}
			paramJson.pageSize = this.page183.length
			// 当前页的条数开始
			if (flag) {
				this.page183.currentPage = 1
			}
			paramJson.pageNum = this.page183.currentPage
			return paramJson
		},
		async _listOperateRecord(flag) {
			this.loading183 = true
			let paramJson = this.findSearchParams138(flag)
			let {
				data: { resultCode, resultData },
			} = await listOperateRecord(paramJson)
			this.loading183 = false
			if (resultCode == 0) {
				this.tableData183 = resultData
			} else {
				this.tableData183 = []
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData181, {
				accountType: 2,
				pageSize: 10,
				pageNum: 1,
			})
			paramJson.pageSize = this.page182.length
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			paramJson.pageNum = this.page182.currentPage
			return paramJson
		},
		_listPageByPlatform: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			paramJson.accountType = 2
			let {
				data: { resultCode, resultData },
			} = await listSuningWithdrawAccountPlaform(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData182 = resultData.resultData
				this.page182.count = resultData.total
			} else {
				this.page182.count = 0
				this.tableData182 = []
			}
		},
	},
}
</script>

<style></style>
