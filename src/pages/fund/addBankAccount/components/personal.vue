<template>
	<div class="container">
		<!-- -------------------------------------------------------对私--------------------------------- -->
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
								:disabled="true"
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
import { sendSmsVerifyCode, bindCardV2 } from '@/api/accountService'
import { bankAddressCode } from '@/api/weeget-bullet-payment-rest'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		YxForm,
	},
	computed: {
		submitShow() {
			return (
				(!this.isCheckDetail() ||
					this.infoData.bindCardStatus == 0 ||
					this.infoData.bindCardStatus == 1 ||
					this.infoData.bindCardStatus == 6) &&
				this.$route.params.type != 0
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
			formDisabled2: false,
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
				smsVerifyCode: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
				],
			},
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
		infoData() {
			this.initFormData()
		},
	},
	created() {
		this.initFormData()
		this._bankCodes('', (resultCode, resultData) => {
			if (resultCode == 0) {
				this.provinceList = resultData.bankAddressCodeBOS
			}
		})
	},
	methods: {
		async initFormData() {
			if (this.infoData.privateBankInfo) {
				this.formData2 = {
					bankName: this.infoData.privateBankInfo.bankAccountName,
					bankAccountName: this.infoData.privateBankInfo.bankName,
					bankAccountNo: this.infoData.privateBankInfo.bankAccountNo,
					phone: '',
					// smsVerifyCode: this.infoData.privateBankInfo.bankCityCode,
				}
			}
			if (
				this.infoData &&
				this.infoData.bindCardStatus &&
				this.infoData.bindCardStatus == 6 &&
				!this.infoData.toPublicBankAccount &&
				this.isCheckDetail()
			) {
				const h = this.$createElement
				this.$msgbox({
					title: '验证不通过',
					message: h('p', null, [
						h('span', null, '验证不通过，原因是 '),
						h(
							'span',
							{ style: 'color: red' },
							this.infoData.privateBankInfo.rejectReason
						),
					]),
					showCancelButton: false,
					showClose: false,
					closeOnClickModal: false,
					closeOnPressEscape: false,
					confirmButtonText: '确定',
				}).then(() => {
					if (!this.params.supplierId && this.$route.params.type != 0) {
						this.formDisabled2 = false
						this.formItems2.forEach((item) => {
							item.disabled = false
						})
					}
				})
			}
			if (this.infoData) {
				if (
					(this.infoData.bindCardStatus &&
						this.infoData.bindCardStatus != 0 &&
						this.infoData.bindCardStatus != 1 &&
						this.infoData.bindCardStatus != 6) ||
					!this.isCheckDetail()
				) {
					this.formItems2.forEach((item) => {
						if (
							item.dataIndex != 'phone' &&
							item.dataIndex != 'smsVerifyCode'
						) {
							item.disabled = this.isCheckDetail() ? true : false
						} else {
							item.hide =
								this.infoData.bindCardStatus &&
								this.infoData.bindCardStatus != 0 &&
								this.infoData.bindCardStatus != 1 &&
								this.infoData.bindCardStatus != 6 &&
								this.isCheckDetail()
						}
					})
					// this.formDisabled2 = this.isCheckDetail() ? true : false
				}
				if (this.isCheckDetail()) {
					this.formData2 = {
						bankName: this.infoData.privateBankInfo.bankName,
						bankAccountName: this.infoData.privateBankInfo.bankAccountName,
						bankAccountNo: this.infoData.privateBankInfo.bankAccountNo,
						phone: this.infoData.privateBankInfo.phone,
						smsVerifyCode: '',
					}
				}
				if (this.params.supplierId) {
					this.formDisabled2 = false
				}
				console.log('this.formItems2---', this.formItems2)
				this.changeBankAccountName()
			}
			if (this.$route.params.type == 0) {
				this.formDisabled2 = true
			}
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

		cancel() {
			console.log('this.$route.params>>', this.$route.params)
			this.$router.push({
				params: { keepAlive: true },
				path: `/fund/bankCardManagement/${this.$route.params.type}/${
					this.params.openAccountSn
						? this.params.openAccountSn
						: this.infoData.openAccountSn
				}`,
			})
		},
		isCheckDetail() {
			return this.params.suningOpenAccountBankInfoId !== 'null'
		},
		// 银行账户名称填入， 并致灰
		changeBankAccountName() {
			if (!this.isCheckDetail()) {
				this.formData2.bankAccountName = this.params.bankAccountName
				this.formItems2.find(
					(item) => item.dataIndex === 'bankAccountName'
				).disabled = true
			}
		},
		submit() {
			this.$refs.yxForm2.$refs.YxForm.validate(async (valid2) => {
				if (valid2) {
					let paramJson = {
						accountType: 1,
						userName: this.$store.state.user.userInfo.clerkName,
						bankName: this.formData2.bankName,
						bankAccountName: this.formData2.bankAccountName,
						bankAccountNo: this.formData2.bankAccountNo,
						smsVerifyCode: this.formData2.smsVerifyCode,
						phone: this.formData2.phone,
						businessType: 2,
						toPublicBankAccount: false,
						bankCityCode:
							this.bankInfo.areaCode ||
							this.bankInfo.cityCode ||
							this.bankInfo.provinceCode,
					}
					if (this.$route.params.openAccountSn) {
						paramJson.openAccountSn = this.$route.params.openAccountSn
						paramJson.outRequestNo =
							this.infoData.privateBankInfo &&
							this.infoData.privateBankInfo.outRequestNo
						paramJson.openAccountSn = this.$route.params.openAccountSn
					}
					paramJson.clerkId = this.$store.state.user.userInfo.clerkId
					paramJson.supplierId = 0
					const {
						data: { resultCode },
					} = await bindCardV2(paramJson)
					if (resultCode == 0) {
						this.$message.success('成功')
						this.$store
							.dispatch('tagsView/delVisitedView', this.$route)
							.then(() => {
								this.$router.push({
									path: `/fund/bankCardManagement/${this.$route.params.type}/${
										this.params.openAccountSn
											? this.params.openAccountSn
											: this.infoData.openAccountSn
									}`,
								})
							})
					} else {
						setTimeout(() => {
							this.$store
								.dispatch('tagsView/delVisitedView', this.$route)
								.then(() => {
									this.$router.push({
										path: `/fund/bankCardManagement/${
											this.$route.params.type
										}/${
											this.params.openAccountSn
												? this.params.openAccountSn
												: this.infoData.openAccountSn
										}`,
									})
								})
						}, 2000)
						// this.formData2 = {
						// 	bankName: '',
						// 	bankAccountNo: '',
						// 	bankSubbranch: '',
						// 	bankLinkNum: '',
						// }
					}
				}
			})
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
