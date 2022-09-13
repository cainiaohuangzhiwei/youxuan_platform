<template>
	<!-- -------------------------------------------------------对公--------------------------------- -->

	<div class="container">
		<el-steps
			:active="activeStep"
			finish-status="success"
			simple
			style="margin-top: 20px"
		>
			<el-step title="提交资料"></el-step>
			<el-step title="待账户验证"></el-step>
			<el-step title="审核中"></el-step>
			<el-step title="签约完成"></el-step>
		</el-steps>

		<h3>开户银行信息（{{ titleType }}）</h3>
		<el-card shadow="never">
			<yx-form
				ref="yxForm3"
				:rules="formRules"
				:data="formData3"
				:items="formItems3"
				:formDisabled="formDisabled3"
				labelWidth="200px"
			>
				<template slot="tip">
					<div>银行账户名称必须与营业执照上的“商户名称”一致</div>
				</template>
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
		</el-card>

		<div class="footer-box" v-if="submitShow">
			<el-button @click="cancel">取消</el-button>
			<el-button @click="submit" type="primary">提交信息</el-button>
		</div>
		<el-dialog
			title="打款金额验证"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			:visible.sync="dialogVisible"
			width="30%"
			center
		>
			<p class="dialog-item">
				你提供的银行卡已收到一笔打款，请填入打款金额进行验证。
			</p>
			<div class="dialog-item">
				<span>打款金额</span>
				<el-input v-model="amount" placeholder="请输入">
					<template slot="append">元</template>
				</el-input>
			</div>
			<p
				class="dialog-item"
				v-if="
					infoData.publicBankInfo && infoData.publicBankInfo.payVerifyDeadline
				"
			>
				截止验证时间：{{ infoData.publicBankInfo.payVerifyDeadline }}
			</p>
			<span slot="footer" class="dialog-footer" v-auth="'suningPayVerify'">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="_payVerify">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { payVerify, bindCardV2 } from '@/api/accountService'
import { getBigImg } from '@/utils/imageTool'
import { bankAddressCode } from '@/api/weeget-bullet-payment-rest'
export default {
	components: {
		YxForm,
	},
	computed: {
		submitShow() {
			return (
				this.params.type == 1 &&
				(!this.isCheckDetail() ||
					this.infoData.bindCardStatus == 0 ||
					this.infoData.bindCardStatus == 1 ||
					this.infoData.bindCardStatus == 6)
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
			titleType: '对公',
			activeStep: 1,
			amount: '',
			// infoData: {},
			params: this.$route.params,
			formDisabled3: false,
			bankInfo: {
				provinceCode: '',
				cityCode: '',
				areaCode: '',
			},
			getBigImg: getBigImg,
			dialogVisible: false,
			formRules: {
				bankName: [
					{
						required: true,
						message: '请输入银行名称',
						trigger: 'blur',
					},
				],
				contactEmail: [
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
				],
				bankAccountName: [
					{ required: true, message: '请输入银行账户名称', trigger: 'blur' },
				],
				bankAccountNo: [
					{ required: true, message: '请输入银行账户号', trigger: 'blur' },
				],
				bankSubbranch: [
					{ required: true, message: '请输入开户支行', trigger: 'blur' },
				],
				bankLinkNum: [
					{ required: true, message: '请输入联行号', trigger: 'blur' },
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
						trigger: 'change',
					},
				],
			},

			formData3: {
				bankName: '',
				bankAccountName: '',
				bankAccountNo: '',
				bankSubbranch: '',
				bankLinkNum: '',
			},
			formItems3: [
				{
					title: '银行名称',
					type: 'input',
					dataIndex: 'bankName',
					class: 'input-box-bind-account',
				},
				{
					title: '银行账户名称',
					type: 'input',
					dataIndex: 'bankAccountName',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					dataIndex: 'tip',
				},
				{
					title: '银行账户号',
					type: 'input',
					dataIndex: 'bankAccountNo',
					class: 'input-box-bind-account',
				},
				{
					title: '开户支行',
					type: 'input',
					dataIndex: 'bankSubbranch',
					class: 'input-box-bind-account',
				},
				{
					title: '银行所在城市',
					type: 'custom',
					dataIndex: 'area',
				},
				{
					title: '联行号',
					type: 'input',
					dataIndex: 'bankLinkNum',
					class: 'input-box-bind-account',
				},
			],
			provinceList: [],
			cityList: [],
			areaList: [],
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
			this.formDisabled3 = this.infoData.bindCardStatus === 7
			console.log('11111111')
			if (!this.params.openAccountSn) {
				return
			}
			if (this.infoData.publicBankInfo) {
				if (this.isCheckDetail()) {
					this.formData3 = {
						bankName: this.infoData.publicBankInfo.bankName,
						bankAccountName: this.infoData.publicBankInfo.bankAccountName,
						bankAccountNo: this.infoData.publicBankInfo.bankAccountNo,
						bankSubbranch: this.infoData.publicBankInfo.bankSubbranch,
						bankLinkNum: this.infoData.publicBankInfo.bankLinkNum,
					}
					if (
						this.infoData.bindCardStatus &&
						this.infoData.bindCardStatus == 3
					) {
						this.dialogVisible = true
					}

					if (this.infoData.bindCardStatus && this.isCheckDetail()) {
						switch (this.infoData.bindCardStatus) {
							case 0:
							case 1:
							case 2:
							case 6:
							case 8:
								this.activeStep = 1
								break
							case 3:
								this.activeStep = 2
								break
							case 4:
							case 5:
								this.activeStep = 3
								break
							default:
								this.activeStep = 4
								break
						}
					}
				}
				console.log('6666666', this.infoData.publicBankInfo)
				if (this.infoData.publicBankInfo.bankCityCode) {
					let municipalityList = [
						'110000',
						'120000',
						'310000',
						'500000',
						'810000',
						'820000',
					]
					let provinceCode = `${this.infoData.publicBankInfo.bankCityCode.slice(
						0,
						2
					)}0000`
					let cityCode =
						municipalityList.indexOf(provinceCode) != -1
							? this.infoData.publicBankInfo.bankCityCode
							: `${this.infoData.publicBankInfo.bankCityCode.slice(0, 4)}00`
					let bankInfo = {
						provinceCode,
						cityCode,
						areaCode: this.infoData.publicBankInfo.bankCityCode,
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
				if (
					this.infoData.bindCardStatus !== 0 &&
					this.infoData.bindCardStatus !== 1 &&
					this.infoData.bindCardStatus !== 6 &&
					this.infoData.bindCardStatus
				) {
					this.formDisabled3 = true
				}

				if (this.infoData.bindCardStatus && this.isCheckDetail()) {
					switch (this.infoData.bindCardStatus) {
						case 0:
						case 1:
						case 2:
						case 6:
						case 8:
							this.activeStep = 1
							break
						case 3:
							this.activeStep = 2
							break
						case 4:
						case 5:
							this.activeStep = 3
							break
						default:
							this.activeStep = 4
							break
					}
				}
			}

			if (
				this.infoData.publicBankInfo &&
				this.infoData.bindCardStatus &&
				this.infoData.bindCardStatus == 6 &&
				this.infoData.toPublicBankAccount &&
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
							this.infoData.publicBankInfo.rejectReason
						),
					]),
					showCancelButton: false,
					showClose: false,
					closeOnClickModal: false,
					closeOnPressEscape: false,
					confirmButtonText: '确定',
				}).then(() => {
					if (!this.params.type == 1) {
						this.formDisabled3 = false
					}
				})
			}
			if (this.params.type != 1) {
				this.formDisabled3 = true
			}
			if (this.$route.params.type == 0) {
				this.formDisabled3 = true
			}
			this.changeBankAccountName()
		},
		async _payVerify() {
			if (!this.amount || this.amount <= 0) {
				return this.$message.warning('请输入正确金额')
			}
			if (this.amount >= 10) {
				return this.$message.warning('金额不能大于等于10')
			}
			let {
				data: { resultCode },
			} = await payVerify({
				amount: this.amount,
				openAccountSn: this.params.openAccountSn,
				outRequestNo: this.infoData.publicBankInfo.outRequestNo,
				operator: this.$store.state.user.userInfo.clerkName || '',
				operatorUserId: this.$store.state.user.userInfo.userId,
			})
			if (resultCode == 0) {
				this.dialogVisible = false
				this.cancel()
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
		submit() {
			this.$refs.yxForm3.$refs.YxForm.validate(async (valid3) => {
				if (valid3) {
					const paramJson = {
						bankName: this.formData3.bankName,
						bankAccountName: this.formData3.bankAccountName,
						bankAccountNo: this.formData3.bankAccountNo,
						businessType: 2,
						bankSubbranch: this.formData3.bankSubbranch,
						bankLinkNum: this.formData3.bankLinkNum,
						toPublicBankAccount: true,
						bankCityCode:
							this.bankInfo.areaCode ||
							this.bankInfo.cityCode ||
							this.bankInfo.provinceCode,
					}

					if (this.infoData.publicBankInfo) {
						paramJson.outRequestNo =
							this.infoData.publicBankInfo &&
							this.infoData.publicBankInfo.outRequestNo
						paramJson.openAccountSn = this.infoData.openAccountSn
					} else {
						paramJson.openAccountSn = this.params.openAccountSn
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
					}
				}
			})
		},
		isCheckDetail() {
			return this.params.suningOpenAccountBankInfoId !== 'null'
		},

		// 银行账户名称填入， 并致灰
		changeBankAccountName() {
			if (!this.isCheckDetail()) {
				this.formData3.bankAccountName = this.params.bankAccountName
			}
			this.formItems3.find(
				(item) => item.dataIndex === 'bankAccountName'
			).disabled = true
		},
		cancel() {
			this.$router.push({
				path: `/fund/bankCardManagement/${this.$route.params.type}/${
					this.params.openAccountSn
						? this.params.openAccountSn
						: this.infoData.openAccountSn
				}`,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.tip {
	margin-bottom: 10px;
}

.footer-box {
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	.el-button {
		margin: 0 50px;
	}
}
.dialog-item {
	display: flex;
	align-items: center;
	margin: 10px 0;
	span {
		width: 100px;
	}
	.el-input {
		width: 100%;
	}
}
</style>
<style>
.input-box-bind-account {
	width: 500px;
}
.cash-account-details-upload .el-upload-dragger {
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: transparent;
	float: left;
	text-align: center;
	line-height: 20px;
}
</style>
