<template>
	<div class="container">
		<h3>个人基本信息</h3>
		<el-card shadow="never">
			<div class="form-box">
				<yx-form
					ref="yxForm1"
					:rules="formRules1"
					:data="formData1"
					:items="formItems1"
					:formDisabled="formDisabled1"
					labelWidth="130px"
				>
					<template slot="validityPeriod">
						<div>
							<el-radio-group v-model="formData1.type" class="radio-group">
								<el-radio :label="1" class="radio-item">
									<div class="radio-item">
										<el-date-picker
											v-model="formData1.validityPeriod"
											type="daterange"
											range-separator="至"
											start-placeholder="开始日期"
											end-placeholder="结束日期"
											@change="validityPeriodChange"
										>
										</el-date-picker>
									</div>
								</el-radio>
								<el-radio style="margin-top: 20px" :label="2">
									<el-date-picker
										v-model="formData1.certificateValidDateStart"
										type="date"
										placeholder="选择日期"
									>
									</el-date-picker>
									- 长期</el-radio
								>
							</el-radio-group>
							<div>
								注：证件有效期到期时间必须大于 60 天，即到期时间距当前时间需超过
								60 天
							</div>
						</div>
					</template>
				</yx-form>
			</div>
		</el-card>
		<h3>个人银行卡基本信息</h3>
		<el-card shadow="never">
			<div class="form-box">
				<yx-form
					ref="yxForm2"
					:rules="formRules2"
					:data="formData2"
					:items="formItems2"
					:formDisabled="formDisabled2"
					labelWidth="130px"
				>
					<template slot="bankAccountName">
						<div class="item-box">
							<el-input
								class="input-name"
								:disabled="formItems2[1].disabled"
								v-model="formData2.bankAccountName"
								placeholder="请输入开户名称"
							></el-input>
							<span class="right-box"
								>注：开户名称必须与姓名一致，否则无法绑定</span
							>
						</div>
					</template>
					<template slot="area">
						<div>
							<el-select
								v-model="bankInfo.provinceCode"
								:disabled="formItems2[3].disabled"
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
								:disabled="formItems2[3].disabled"
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
								:disabled="formItems2[3].disabled"
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
					<template slot="phone">
						<div class="item-box">
							<el-input
								v-model="formData2.phone"
								class="input-name"
								placeholder="请输入预留手机号"
							></el-input>
							<div class="right-box">
								<el-button
									v-auth="'suningSendSmsVerifyCode'"
									@click="getVerifyCode"
									type="primary"
									>{{ codeText }}</el-button
								>
							</div>
						</div>
					</template>
				</yx-form>
			</div>
		</el-card>
		<div class="footer-box" v-if="submitShow">
			<el-button @click="cancel">取消</el-button>
			<el-button @click="submit" type="primary">提交信息</el-button>
		</div>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import {
	sendSmsVerifyCode,
	// openAccount,
	// bindCard,
	openAccountToPrivate,
	updateOpenAccount,
} from '@/api/accountService'
import { bankAddressCode } from '@/api/weeget-bullet-payment-rest'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		YxForm,
	},
	computed: {
		// showBtn() {
		// 	return (
		// 		(!this.params.openAccountSn && this.suningOpenAccount) ||
		// 		(this.infoData &&
		// 			(this.infoData.bindCardStatus == 0 ||
		// 				this.infoData.bindCardStatus == 6) &&
		// 			this.infoData.accountType == 1 &&
		// 			((this.suningOpenAccount && this.infoData.businessType == 1) ||
		// 				(this.suningBindCard && this.infoData.businessType == 2)))
		// 	)
		// },
		submitShow() {
			return (
				(this.params.skipType != 'supplier' &&
					this.params.skipType == 'platformCheck' &&
					(this.infoData.bindCardStatus == 0 ||
						this.infoData.bindCardStatus == 1 ||
						this.infoData.bindCardStatus == 6)) ||
				(this.params.skipType == 'platform' &&
					this.infoData.bindCardStatus == 7) ||
				this.params.openAccountSn == '2'
			)
		},
	},
	props: {
		infoData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			suningOpenAccount: checkFunctionCode('suningOpenAccount'),
			suningBindCard: checkFunctionCode('suningBindCard'),
			bankInfo: {
				provinceCode: '',
				cityCode: '',
				areaCode: '',
			},
			provinceList: [],
			cityList: [],
			areaList: [],
			params: this.$route.params,
			formDisabled1: false,
			formDisabled2: false,
			formData1: {
				contactName: '',
				certificateNo: '',
				type: 1,
				certificateValidDateStart: '',
				validityPeriod: [],
				certificateType: '',
				gender: 0,
				nationality: 0,
				workAddress: '',
			},
			formRules2: {
				bankName: [
					{
						required: true,
						message: '请输入银行名称',
						trigger: 'blur',
					},
				],
				bankAccountName: [
					{ required: true, message: '请输入开户名称', trigger: 'blur' },
				],
				bankAccountNo: [
					{ required: true, message: '请输入银行卡账号', trigger: 'blur' },
				],
				phone: [
					{
						validator: (rule, value, callback) => {
							const pattern = /^1[3456789][0-9]{9}$/
							if (value === '') {
								callback(new Error('请输入预留手机号'))
							} else {
								if (!pattern.test(value)) {
									callback(new Error('请输入正确手机号码'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				// area: [
				// 	{
				// 		validator: (rule, value, callback) => {
				// 			if (!this.bankInfo.provinceCode && this.provinceList.length) {
				// 				callback(new Error('请选择地区'))
				// 			} else if (!this.bankInfo.cityCode && this.cityList.length) {
				// 				callback(new Error('请选择地区'))
				// 			} else if (!this.bankInfo.areaCode && this.areaList.length) {
				// 				callback(new Error('请选择地区'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		required: true,
				// 		trigger: 'change',
				// 	},
				// ],
				smsVerifyCode: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
				],
			},
			formRules1: {
				contactName: [
					{ required: true, message: '请输入姓名', trigger: 'blur' },
				],
				certificateNo: [
					{
						validator: (rule, value, callback) => {
							const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
							if (value === '') {
								callback(new Error('请输入身份证号'))
							} else {
								if (
									!pattern.test(value) &&
									this.formData1.certificateType == 1
								) {
									callback(new Error('身份证号码错误'))
								} else if (
									this.formData1.certificateType != 1 &&
									value.length > 18
								) {
									callback(new Error('证件号码不可大于18位'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				validityPeriod: [
					{
						validator: (rule, value, callback) => {
							if (this.formData1.type == 1) {
								if (!this.formData1.validityPeriod.length) {
									callback(new Error('请选择时间'))
								} else {
									callback()
								}
							} else {
								if (!this.formData1.certificateValidDateStart) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				certificateType: [
					{
						required: true,
						message: '请选择证件人类型',
						trigger: 'change',
					},
				],
				nationality: [
					{
						validator: (rule, value, callback) => {
							if (value == 0) {
								callback(new Error('请选择国籍'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				gender: [
					{
						validator: (rule, value, callback) => {
							if (value == 0) {
								callback(new Error('请选择性别'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				workAddress: [
					{
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入联系地址'))
							} else if (value.length > 50) {
								callback(new Error('联系地址不可大于50字符长度'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
			},
			formItems1: [
				{
					title: '姓名',
					type: 'input',
					dataIndex: 'contactName',
					class: 'input-box-bind-account',
				},
				{
					title: '证件类型',
					type: 'select',
					dataIndex: 'certificateType',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							certificateType: 1,
							value: '身份证',
						},
						{
							certificateType: 2,
							value: '其他国家或地区居民护照',
						},
						{
							certificateType: 3,
							value: '香港居民来往内地通行证',
						},
						{
							certificateType: 4,
							value: '澳门居民来往内地通行证',
						},
						{
							certificateType: 5,
							value: '台湾居民来往内地通行证',
						},
					],
				},
				{
					title: '证件号',
					type: 'input',
					dataIndex: 'certificateNo',
					class: 'input-box-bind-account',
				},
				{
					title: '国籍',
					type: 'select',
					dataIndex: 'nationality',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							nationality: 0,
							value: '请选择',
						},
						{
							nationality: 1,
							value: '中国',
						},
						{
							nationality: 2,
							value: '其他国家或地区',
						},
					],
				},
				{
					title: '性别',
					type: 'select',
					dataIndex: 'gender',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							gender: 0,
							value: '请选择',
						},
						{
							gender: 1,
							value: '男',
						},
						{
							gender: 2,
							value: '女',
						},
					],
				},
				{
					title: '联系地址',
					type: 'input',
					dataIndex: 'workAddress',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '身份证有效期',
					dataIndex: 'validityPeriod',
				},
			],
			formData2: {
				bankName: '',
				bankAccountName: '',
				bankAccountNo: '',
				phone: '',
				smsVerifyCode: '',
			},
			formItems2: [
				{
					title: '银行名称',
					type: 'input',
					dataIndex: 'bankName',
					disabled: false,
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '开户名称',
					disabled: false,
					dataIndex: 'bankAccountName',
				},
				{
					title: '银行卡账号',
					type: 'input',
					disabled: false,
					dataIndex: 'bankAccountNo',
					class: 'input-box-bind-account',
				},
				// {
				// 	title: '银行所在城市',
				// 	type: 'custom',
				// 	disabled: false,
				// 	dataIndex: 'area',
				// },
				{
					type: 'custom',
					title: '预留手机号',
					dataIndex: 'phone',
					hide: false,
				},
				{
					title: '验证码',
					type: 'input',
					dataIndex: 'smsVerifyCode',
					hide: false,
					class: 'input-box-bind-account',
				},
			],
			timeInterval: null,
			codeText: '获取验证码',
		}
	},
	watch: {
		'formData1.type'() {
			if (this.formData1.type == 1) {
				this.formData1.certificateValidDateStart = ''
			} else {
				this.formData1.validityPeriod = []
			}
		},
		infoData() {
			if (this.infoData.basicContactInformation) {
				this.formData1 = {
					contactName: this.infoData.basicContactInformation.contactName,
					certificateType: this.infoData.basicContactInformation
						.certificateType,
					nationality: this.infoData.basicContactInformation.nationality,
					gender: this.infoData.basicContactInformation.gender,
					workAddress: this.infoData.basicContactInformation.workAddress,
					certificateNo: this.infoData.basicContactInformation.certificateNo,
					type:
						this.infoData.basicContactInformation.certificateValidDateEnd ==
						'长期'
							? 2
							: 1,
					certificateValidDateStart:
						this.infoData.basicContactInformation.certificateValidDateEnd ==
						'长期'
							? this.infoData.basicContactInformation.certificateValidDateStart
							: '',
					validityPeriod:
						this.infoData.basicContactInformation.certificateValidDateEnd ==
						'长期'
							? []
							: [
									this.infoData.basicContactInformation
										.certificateValidDateStart,
									this.infoData.basicContactInformation.certificateValidDateEnd,
							  ],
				}
				console.log('11111111111', this.formData1)
			}
			if (this.infoData.accountBankInformation) {
				this.formData2 = {
					bankName: this.infoData.accountBankInformation.bankAccountName,
					bankAccountName: this.infoData.accountBankInformation.bankName,
					bankAccountNo: this.infoData.accountBankInformation.bankAccountNo,
					phone: '',
					smsVerifyCode: this.infoData.accountBankInformation.bankCityCode,
				}
			}
			if (
				this.infoData &&
				this.infoData.bindCardStatus &&
				this.infoData.bindCardStatus == 6 &&
				!this.infoData.toPublicBankAccount &&
				this.params.accountBankInfoId
			) {
				const h = this.$createElement
				this.$msgbox({
					title: '验证不通过',
					message: h('p', null, [
						h('span', null, '验证不通过，原因是 '),
						h(
							'span',
							{ style: 'color: red' },
							this.infoData.accountBankInformation.rejectReason
						),
					]),
					showCancelButton: false,
					showClose: false,
					closeOnClickModal: false,
					closeOnPressEscape: false,
					confirmButtonText: '确定',
				}).then(() => {
					if (!this.params.supplierId) {
						this.formDisabled1 = false
						this.formDisabled2 = false
						this.formItems2.forEach((item) => {
							item.disabled = false
						})
					}
				})
			}
			if (this.infoData) {
				this.formDisabled2 = this.infoData.bindCardStatus == 7 ? true : false

				if (
					this.infoData.toPublicBankAccount == 0 &&
					this.infoData.bindCardStatus == 7 &&
					this.params.skipType != 'supplier'
				) {
					this.formItems2.forEach((item) => {
						if (item.dataIndex == 'smsVerifyCode') {
							item.hide = true
						}
					})
				}

				if (this.params.accountBankInfoId) {
					this.formData2 = {
						bankName: this.infoData.accountBankInformation.bankName,
						bankAccountName: this.infoData.accountBankInformation
							.bankAccountName,
						bankAccountNo: this.infoData.accountBankInformation.bankAccountNo,
						phone: this.infoData.accountBankInformation.phone,
						smsVerifyCode: '',
					}
					if (this.infoData.accountBankInformation.bankCityCode) {
						let municipalityList = [
							'110000',
							'120000',
							'310000',
							'500000',
							'810000',
							'820000',
						]
						let provinceCode = `${this.infoData.accountBankInformation.bankCityCode.slice(
							0,
							2
						)}0000`
						let cityCode =
							municipalityList.indexOf(provinceCode) != -1
								? this.infoData.accountBankInformation.bankCityCode
								: `${this.infoData.accountBankInformation.bankCityCode.slice(
										0,
										4
								  )}00`
						let bankInfo = {
							provinceCode,
							cityCode,
							areaCode: this.infoData.accountBankInformation.bankCityCode,
						}
						this._bankCodes(bankInfo.provinceCode, (resultCode, resultData) => {
							if (resultCode == 0) {
								this.cityList = resultData.bankAddressCodeBOS
							}
						})
						this._bankCodes(bankInfo.cityCode, (resultCode, resultData) => {
							if (resultCode == 0) {
								this.areaList = resultData.bankAddressCodeBOS
							}
						})
						this.bankInfo = bankInfo
					}
				}
				if (this.params.supplierId && this.infoData.bindCardStatus != 7) {
					this.formDisabled1 = false
					this.formDisabled2 = false
				}
			}
			if (this.params.skipType == 'platform') {
				this.formItems1[1].disabled = true
				this.formItems1[2].disabled = true
			}
			//商家账户进入 || 平台账户查看账户详情进入 并且可修改状态
			if (
				this.params.skipType == 'supplier' ||
				(this.params.skipType == 'platformCheck' &&
					this.infoData.bindCardStatus != 0 &&
					this.infoData.bindCardStatus != 1 &&
					this.infoData.bindCardStatus != 6) ||
				this.infoData.modifyOpenAccount
			) {
				this.formDisabled1 = true
				this.formDisabled2 = true
			}
			if (
				this.params.openAccountSn == '1' ||
				this.params.openAccountSn == '2'
			) {
				if (!this.infoData.isFirstOpenAccount) {
					this.accountNameDisabled = true
					this.formItems2.forEach((item) => {
						if (
							item.dataIndex == 'bankAccountNo' ||
							item.dataIndex == 'bankAccountName' ||
							item.dataIndex == 'bankName'
						) {
							item.disabled = true
						}
					})
				} else {
					this.formData2 = {
						bankName: '',
						bankAccountName: '',
						bankAccountNo: '',
						phone: '',
						smsVerifyCode: '',
					}
				}
			}
		},
	},
	created() {
		this._bankCodes('', (resultCode, resultData) => {
			if (resultCode == 0) {
				this.provinceList = resultData.bankAddressCodeBOS
			}
		})
	},
	methods: {
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
		async getVerifyCode() {
			const pattern = /^1[3456789][0-9]{9}$/
			if (!pattern.test(this.formData2.phone)) {
				return this.$message.warning('请输入正确手机号码!')
			}
			if (this.codeText == '获取验证码' || this.codeText == '重新发送') {
				let rsaData = await sendSmsVerifyCode({
					phone: this.formData2.phone,
				})
				if (rsaData && rsaData.data && rsaData.data.resultCode == 0) {
					let title = 60
					this.timeInterval = setInterval(() => {
						title--
						this.codeText = title + 's'
						if (title <= 0) {
							this.codeText = '重新发送'
							clearInterval(this.timeInterval)
						}
					}, 1000)
				}
			}
		},
		validityPeriodChange() {
			this.formData1.type = 1
			if (this.formData1.validityPeriod.length) {
				console.log(
					moment(this.formData1.validityPeriod[0]).valueOf(),
					moment(this.formData1.validityPeriod[1]).valueOf()
				)
			}
		},
		cancel() {
			this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
				this.$router.push({
					path: '/fund/cashAccountList',
				})
			})
		},
		submit() {
			// if (
			// 	this.$route.params.openAccountSn &&
			// 	(!this.params.accountBankInfoId ||
			// 		(this.params.accountBankInfoId &&
			// 			this.infoData.accountBankInformation.businessType == 2))
			// ) {
			// 	this.$refs.yxForm2.$refs.YxForm.validate(async (valid3) => {
			// 		if (valid3) {
			// 			let paramJson = {
			// 				userName: this.$store.state.user.userInfo.clerkName,
			// 				bankAccountName: this.formData2.bankAccountName,
			// 				bankAccountNo: this.formData2.bankAccountNo,
			// 				businessType: 2,
			// 				bankName: this.formData2.bankName,
			// 				toPublicBankAccount: false,
			// 				openAccountSn: this.$route.params.openAccountSn,
			// 				smsVerifyCode: this.formData2.smsVerifyCode,
			// 				phone: this.formData2.phone,
			// 				bankCityCode:
			// 					this.bankInfo.areaCode ||
			// 					this.bankInfo.cityCode ||
			// 					this.bankInfo.provinceCode,
			// 				// outRequestNo: this.infoData.accountBankInformation.outRequestNo,
			// 			}
			// 			if (
			// 				this.params.accountBankInfoId &&
			// 				this.infoData.accountBankInformation.businessType == 2
			// 			) {
			// 				paramJson.outRequestNo = this.infoData.accountBankInformation.outRequestNo
			// 			}
			// 			let {
			// 				data: { resultCode },
			// 			} = await bindCard(paramJson)
			// 			if (resultCode == 0) {
			// 				this.$store
			// 					.dispatch('tagsView/delVisitedView', this.$route)
			// 					.then(() => {
			// 						this.$router.push({
			// 							path: '/fund/cashAccountList',
			// 						})
			// 					})
			// 			}
			// 		}
			// 	})
			// bindCard
			// } else {
			this.$refs.yxForm1.$refs.YxForm.validate((valid1) => {
				this.$refs.yxForm2.$refs.YxForm.validate(async (valid2) => {
					let verify = valid1 && valid2
					if (!verify) {
						return this.$message.error('请检查信息未填写完整!')
					}
					if (verify) {
						let certificateValidDateStart =
							this.formData1.type == 1
								? moment(this.formData1.validityPeriod[0]).format('YYYY-MM-DD')
								: moment(this.formData1.certificateValidDateStart).format(
										'YYYY-MM-DD'
								  )
						let certificateValidDateEnd =
							this.formData1.type == 1
								? moment(this.formData1.validityPeriod[1]).format('YYYY-MM-DD')
								: '长期'
						let paramJson = {
							accountType: 1,
							companyName: this.formData1.contactName,
							userName: this.$store.state.user.userInfo.clerkName,
							contacts: [
								{
									contactName: this.formData1.contactName,
									certificateNo: this.formData1.certificateNo,
									certificateType: 1,
									certificateValidDateStart,
									certificateValidDateEnd,
									contactType: 3,
									nationality: this.formData1.nationality,
									gender: this.formData1.gender,
									workAddress: this.formData1.workAddress,
								},
							],
							bankInfo: {
								bankName: this.formData2.bankName,
								bankAccountName: this.formData2.bankAccountName,
								bankAccountNo: this.formData2.bankAccountNo,
								smsVerifyCode: this.formData2.smsVerifyCode,
								phone: this.formData2.phone,
								businessType: 1,
								supplierId: this.params.supplierId ? this.params.supplierId : 0,
								toPublicBankAccount: false,
								bankCityCode:
									this.bankInfo.areaCode ||
									this.bankInfo.cityCode ||
									this.bankInfo.provinceCode,
							},
						}
						if (this.infoData.openAccountSn) {
							paramJson.openAccountSn = this.infoData.openAccountSn
							paramJson.bankInfo.outRequestNo =
								this.infoData.accountBankInformation &&
								this.infoData.accountBankInformation.outRequestNo
							paramJson.bankInfo.openAccountSn = this.infoData.openAccountSn
						}
						// 修改账户
						if (
							this.params.skipType == 'platform' &&
							this.params.skipType == 'platformCheck'
						) {
							paramJson.bankInfo.businessType = 3
						}
						paramJson.clerkId = this.$store.state.user.userInfo.clerkId
						paramJson.supplierId = this.params.supplierId
							? this.params.supplierId
							: 0
						let Url =
							this.infoData.bindCardStatus == 7 ||
							this.infoData.modifyOpenAccount
								? updateOpenAccount
								: openAccountToPrivate
						let {
							data: { resultCode },
						} = await Url(paramJson)
						if (resultCode == 0) {
							this.$message.success('成功')
							setTimeout(() => {
								this.$store
									.dispatch('tagsView/delVisitedView', this.$route)
									.then(() => {
										this.$router.push({
											path: '/fund/cashAccountList',
										})
									})
							}, 2000)
						} else {
							setTimeout(() => {
								this.$store
									.dispatch('tagsView/delVisitedView', this.$route)
									.then(() => {
										this.$router.push({
											path: '/fund/cashAccountList',
										})
									})
							}, 2000)
						}
					}
				})
			})
			// }
		},
	},
}
</script>

<style lang="scss" scoped>
// .container {
// 	padding-bottom: 200px;
// }
.radio-group {
	display: flex;
	flex-direction: column;
}
.radio-item {
	display: flex;
	align-items: center;
	span {
		margin-left: 20px;
	}
}
.item-box {
	display: flex;
	.right-box {
		flex: 1;
		margin-left: 20px;
	}
}
.input-name {
	width: 370px;
}
.footer-box {
	// position: fixed;
	// right: 0;
	// bottom: 30px;
	height: 120px;
	width: 100%;
	margin-top: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	.el-button {
		margin: 0 50px;
	}
}
</style>
<style>
.input-box-bind-account {
	width: 500px;
}
</style>
