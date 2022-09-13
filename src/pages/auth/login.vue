<template>
	<div class="container">
		<transition name="form-fade" mode="in-out">
			<div class="login_con_bg">
				<div class="login_con">
					<img src="../../assets/image/logo.png" />
					<h1 class="un-selected">欢迎登录云货优选后台系统</h1>
					<el-form
						:model="loginForm"
						:rules="rules"
						ref="loginForm"
						@submit.native.prevent
					>
						<!-- 登陆 -->
						<template
							v-if="
								actionType == 'login' ||
								actionType == 'bindPhone' ||
								actionType == 'resetPassword'
							"
						>
							<el-form-item prop="userName">
								<el-input
									v-model="loginForm.userName"
									placeholder="用户名"
									class="input_txt"
									prefix-icon="el-icon-user"
									@keyup.enter.native="submitForm('loginForm')"
								></el-input>
							</el-form-item>
							<el-form-item prop="password">
								<el-input
									prefix-icon="el-icon-lock"
									type="password"
									placeholder="密码"
									v-model="loginForm.password"
									class="input_txt"
									@keyup.enter.native="submitForm('loginForm')"
								>
								</el-input>
							</el-form-item>
							<el-form-item prop="otpVerifyCode">
								<el-input
									v-model="loginForm.otpVerifyCode"
									placeholder="MFA码"
									class="input_txt"
									prefix-icon="el-icon-postcard"
									@keyup.enter.native="submitForm('loginForm')"
								></el-input>
								<div class="footer-btn">
									<div class="mfaCode-tips">注：请在MFA时效内输入</div>
									<el-button @click="setDialogVisible194" type="text"
										>忘记密码</el-button
									>
								</div>
							</el-form-item>
						</template>
						<template v-if="actionType == 'verifyPhone'">
							<div class="phone-num">
								已向您的手机号{{ getUserPhone }}发送验证码
							</div>
							<el-form-item prop="code" class="verify-phone_box">
								<el-row style="width: 40%">
									<el-col :span="24"
										><el-input
											prefix-icon="el-icon-postcard"
											type="text"
											placeholder="验证码"
											v-model="loginForm.code"
											class="input_txt"
											@keyup.enter.native="submitForm('loginForm')"
										>
											<el-button
												slot="append"
												:class="code.style"
												:disabled="code.disabled"
												:loading="code.loading"
												type="primary"
												@click="sendVerifyCode()"
											>
												{{ code.text }}
											</el-button>
										</el-input></el-col
									>
								</el-row>
							</el-form-item>
						</template>
						<el-form-item>
							<el-button
								v-loading="loginLoading"
								:disabled="loginLoading"
								type="primary"
								@click="submitForm('loginForm')"
								class="submit_btn ripple"
							>
								登陆
							</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</transition>

		<yx-dialog
			title="手机号绑定"
			:bottomBtn="bottomBtn"
			:visible.sync="showBindDialog"
		>
			<div>
				<yx-form
					ref="bindPhoneForm"
					:data="dialogData"
					:items.sync="dialogCfg"
					:rules="rules"
				>
					<template slot="code">
						<el-input
							prefix-icon="el-icon-postcard"
							type="number"
							placeholder="验证码"
							v-model="dialogData.code"
							@keyup.enter.native="submitForm('loginForm')"
						>
							<el-button
								slot="append"
								:class="code.style"
								:disabled="code.disabled"
								:loading="code.loading"
								type="primary"
								@click="sendVerifyCode()"
							>
								{{ code.text }}
							</el-button>
						</el-input>
					</template>
				</yx-form>
			</div>
		</yx-dialog>
		<yx-dialog
			title="验证手机号"
			:visible.sync="dialogVisible194"
			:width="dialogWidth194"
			:bottomBtn="dialogBottomBtn194"
		>
			<yx-form
				ref="dialog189"
				labelWidth="80px"
				:data="formData189"
				:items="formCfg189"
				:rules="formRules189"
			>
				<template slot="code">
					<el-input
						prefix-icon="el-icon-postcard"
						type="number"
						placeholder="验证码"
						v-model="formData189.code"
					>
						<el-button
							slot="append"
							:class="code.style"
							:disabled="code.disabled"
							:loading="code.loading"
							type="primary"
							@click="sendVerifyCode()"
						>
							{{ code.text }}
						</el-button>
					</el-input>
				</template>
			</yx-form>
		</yx-dialog>
		<yx-dialog
			title="修改密码"
			:visible.sync="dialogVisible195"
			:width="dialogWidth194"
			:bottomBtn="dialogBottomBtn195"
		>
			<yx-form
				ref="dialog190"
				labelWidth="140px"
				:data="formData190"
				:items="formCfg190"
				:rules="formRules190"
			>
				<template slot="password">
					<div>
						<el-input
							type="password"
							v-model="formData190.password"
							id="inputValue"
							auto-complete="off"
						/>
						<div class="input_span">
							<span ref="veryWeak" id="veryWeak"></span>
							<span ref="weak" id="weak"></span>
							<span ref="general" id="general"></span>
							<span ref="strong" id="strong"></span>
							<span ref="safety" id="safety"></span>
						</div>
						<div style="margin-left: -40px" id="font">
							<span>非常弱</span>
							<span>弱</span>
							<span>一般</span>
							<span>强</span>
							<span>安全</span>
						</div>
					</div>
				</template>
				<template slot="tip">
					<div>数字+大小写字母+特殊符号且长度大于等于8位且小于等于16位</div>
				</template>
			</yx-form>
		</yx-dialog>
		<MFADialog
			:MFADialogVisible="MFADialogVisible"
			@ctrlMFADialog="ctrlMFADialog"
			:userIdForOtp="userIdForOtp"
		/>
	</div>
</template>

<script>
import RSA from 'js-rsa-dave'
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import MFADialog from '@/components/MFADialog'
import {
	getPublicKeyAndModel,
	sendVerifyCodeByPhone,
	bindPhone,
	resetPassword,
} from '@/api/webUser.js'
import { checkVerifyCode } from '@/api/public.js'
// import { AES } from '@/utils/crypto.js'
// const { encode } = new AES()
export default {
	name: 'Login',
	components: {
		YxDialog,
		YxForm,
		MFADialog,
	},
	data() {
		let validatePhoneNumber = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号'))
			} else if (!/^1[3456789][0-9]{9}$/.test(value)) {
				callback(new Error('请输入正确的手机号'))
			} else {
				callback()
			}
		}
		return {
			formData190: {
				password: '',
				passwordNew: '',
				userName: '',
				phoneMob: '',
				verifyCodeId: '',
			},
			formCfg190: [
				{
					type: 'custom',
					title: '新密码',
					dataIndex: 'password',
				},
				{
					type: 'inputPassword',
					title: '重复输入新密码',
					dataIndex: 'passwordNew',
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'tip',
				},
			],
			formRules190: {
				password: [
					{
						required: true,
						trigger: 'blur',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入密码'))
							} else if (this.strongScore < 60) {
								callback(new Error('当前密码安全强度较弱,无法修改'))
							} else {
								callback()
							}
						},
					},
				],
				passwordNew: [
					{
						required: true,
						trigger: 'blur',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请再次输入密码'))
							} else if (this.formData190.password != value) {
								callback(new Error('两次密码不一致'))
							} else {
								callback()
							}
						},
					},
				],
			},
			dialogVisible195: false,
			dialogBottomBtn195: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.dialog190.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._resetPassword()
							}
						})
					},
				},
			],
			formData189: {
				userName: '',
				phoneMob: '',
				code: '',
			},
			formCfg189: [
				{
					type: 'input',
					title: '账号',
					dataIndex: 'userName',
				},
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'phoneMob',
				},
				{
					type: 'custom',
					title: '验证码',
					dataIndex: 'code',
				},
			],
			formRules189: {
				userName: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				code: [
					{ required: true, message: '请输入手机验证码', trigger: 'blur' },
				],
				phoneMob: [{ validator: validatePhoneNumber, trigger: 'blur' }],
			},
			dialogVisible194: false,
			dialogWidth194: '800px',
			dialogBottomBtn194: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.dialog189.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._checkVerifyCode()
							}
						})
					},
				},
			],
			loginLoading: false,
			actionType: 'login', // 操作类型 login:登录, verifyPhone: 校验手机号, bindPhone: 绑定手机号
			loginForm: {
				userName: '', // 用户名
				password: '', // 密码
				phoneMob: '', //手机号
				verifyType: 20, //S端登陆验证码
				code: '', //手机验证码
				otpVerifyCode: '', // MFAQrCode
			},
			code: {
				text: '发送验证码',
				disabled: false,
				style: 'btn_sendCode',
				loading: false,
			},
			rules: {
				userName: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				code: [
					{ required: true, message: '请输入手机验证码', trigger: 'blur' },
				],
				phoneMob: [{ validator: validatePhoneNumber, trigger: 'blur' }],
			},
			dialogData: {
				userName: '', // 用户名
				password: '', // 密码
				imageId: '', // 图片验证码id
				imageCode: '', // 图片验证码
				phoneMob: '', //手机号
				verifyType: 21, //S端手机号绑定
				code: '', //手机验证码
			},
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.postBindPhone()
					},
				},
			],
			dialogCfg: [
				// 品牌搜索项
				{
					type: 'text',
					dataIndex: '',
					title:
						'随着公司迅速发展，在公司数据安全方面也需要同步升级。现在需要所有微革同学完善员工账号绑定个人手机号流程',
				},
				{
					type: 'input',
					title: '用户名',
					disabled: true,
					dataIndex: 'userName',
				},
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'phoneMob',
				},
				{
					type: 'custom',
					title: '验证码',
					dataIndex: 'code',
				},
			],
			showBindDialog: false,
			timeInterval: '',
			// MFA弹窗
			MFADialogVisible: false,
			// MFA需要的userId
			userIdForOtp: 0,
			// 密码强度分数
			strongScore: '',
		}
	},
	watch: {
		'formData190.password'(newname) {
			this.strongScore = this.checkStrong(newname)
			console.log('log: 总分', this.strongScore)
			// 非常弱
			if (this.strongScore >= 1 && this.strongScore < 25) {
				this.$refs.veryWeak.style.background = '#e44a4a'
			} else {
				this.$refs.veryWeak.style.background = '#eee'
			}
			// 弱
			if (this.strongScore >= 26 && this.strongScore <= 45) {
				this.$refs.veryWeak.style.background = '#e44a4a'
				this.$refs.weak.style.background = '#e8a2a2'
			} else {
				this.$refs.weak.style.background = '#eee'
			}
			// 一般
			if (this.strongScore >= 46 && this.strongScore <= 60) {
				this.$refs.veryWeak.style.background = '#e44a4a'
				this.$refs.weak.style.background = '#e8a2a2'
				this.$refs.general.style.background = '#fdca30'
			} else {
				this.$refs.general.style.background = '#eee'
			}
			// 强
			if (this.strongScore >= 61 && this.strongScore <= 80) {
				this.$refs.veryWeak.style.background = '#e44a4a'
				this.$refs.weak.style.background = '#e8a2a2'
				this.$refs.general.style.background = '#fdca30'
				this.$refs.strong.style.background = '#bae8c4'
			} else {
				this.$refs.strong.style.background = '#eee'
			}
			// 安全
			if (this.strongScore >= 81) {
				this.$refs.veryWeak.style.background = '#e44a4a'
				this.$refs.weak.style.background = '#e8a2a2'
				this.$refs.general.style.background = '#fdca30'
				this.$refs.strong.style.background = '#bae8c4'
				this.$refs.safety.style.background = '#7dcd8e'
			} else {
				this.$refs.safety.style.background = '#eee'
			}
		},
		showBindDialog(newValue) {
			if (!newValue && this.actionType == 'bindPhone') {
				this.actionType == 'login'
			}
		},
	},
	computed: {
		getUserPhone() {
			let str = this.loginForm.phoneMob || ''
			if (str) {
				let pat = /(\d{3})\d*(\d{4})/
				return str.replace(pat, '$1****$2')
			} else {
				return ''
			}
		},
	},
	methods: {
		async _resetPassword() {
			let paramJson = {
				newPassword: this.formData190.password,
				userName: this.formData190.userName,
				phoneMob: this.formData190.phoneMob,
				verifyCodeId: this.formData190.verifyCodeId,
			}
			let psw = paramJson.newPassword.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.newPassword = RSA.encryptedString(publicKey, psw)
			console.log()
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			let {
				data: { resultCode },
			} = await resetPassword(paramJson)
			if (resultCode == 0) {
				this.$message.success('修改成功')
				this.dialogVisible195 = false
				this.formData190 = {
					password: '',
					passwordNew: '',
					userName: '',
					phoneMob: '',
					verifyCodeId: '',
				}
				this.actionType = 'login'
			}
		},
		async _checkVerifyCode() {
			let {
				data: { resultCode, resultData },
			} = await checkVerifyCode({
				phoneMob: this.formData189.phoneMob,
				verifyType: 26,
				code: this.formData189.code,
			})
			if (resultCode == 0) {
				this.formData190 = {
					password: '',
					passwordNew: '',
					userName: '',
					phoneMob: '',
					verifyCodeId: '',
				}
				this.dialogVisible194 = false
				this.formData190.verifyCodeId = resultData.verifyCodeId
				this.formData190.phoneMob = this.formData189.phoneMob
				this.formData190.userName = this.formData189.userName
				this.formData189 = { userName: '', phoneMob: '', code: '' }
				this.dialogVisible195 = true
			}
		},
		checkStrong(sValue) {
			// 长度
			let pawLengthScore = 0
			// 字母
			let letterScore = 0
			// 数字
			let numlScore = 0
			// 符号
			let symbolScore = 0
			// 奖励
			let awardScore = 0

			// 正则表达式验证符合要求的
			if (sValue.length < 1) return 0
			/* --------- 长度------------ */
			// 0分小于等于5个字符
			// if (sValue.length <= 5) {
			// 	pawLengthScore = 0
			// }
			// 10分：6（包含）到7（包含）字符
			if (
				(sValue.length >= 6 && sValue.length <= 7 && /[a-z]/.test(sValue)) ||
				(sValue.length >= 6 && sValue.length <= 7 && /\d/.test(sValue)) ||
				(sValue.length >= 6 && sValue.length <= 7 && /[A-Z]/.test(sValue)) ||
				(sValue.length >= 6 && sValue.length <= 7 && /\W/.test(sValue))
			) {
				pawLengthScore = 10
			}
			// 大于等于8个字符
			if (
				(sValue.length >= 8 && /[a-z]/.test(sValue)) ||
				(sValue.length >= 8 && /\d/.test(sValue)) ||
				(sValue.length >= 8 && /[A-Z]/.test(sValue)) ||
				(sValue.length >= 8 && /\W/.test(sValue))
			) {
				pawLengthScore = 25
			}
			/* --------- 字母------------ */
			// 没有字母
			// if (!/[a-z]/.test(sValue) || !/[A-Z]/.test(sValue)) {
			// 	letterScore = 0
			// }
			// 全都是小写字母
			if (/[a-z]/.test(sValue)) {
				letterScore = 10
			}
			// 全都是（大）写字母
			if (/[A-Z]/.test(sValue)) {
				letterScore = 10
			}
			// 大小写混合字母
			if (/[a-z]/.test(sValue) && /[A-Z]/.test(sValue)) {
				letterScore = 20
			}
			/* --------- 数值------------ */
			// 没有教字
			// if (!/\d/.test(sValue)) {
			// 	numlScore = 0
			// }
			// 计算数字有几个
			let srtArr = sValue.match(/[\d]+/g)
			console.log('log: checkStrong -> srtArr', srtArr)
			if (srtArr) {
				// 只有1个数字
				if (srtArr.join('').length <= 1) {
					numlScore = 10
				}
				// 大于等于3个数字
				if (srtArr.join('').length >= 3) {
					numlScore = 20
				}
			}

			/* --------- 符号------------ */
			// 没有符号
			// if (!/\W/.test(sValue)) {
			// 	symbolScore = 0
			// }
			// 计算符号有几个
			let symbolArr = sValue.match(/[\W]+/)
			console.log('log: checkStrong -> symbolArr', symbolArr)
			if (symbolArr) {
				// 只有1个字符
				if (symbolArr[0].length == 1) {
					symbolScore = 10
				}
				// 大于1个字符
				if (symbolArr[0].length > 1) {
					symbolScore = 25
				}
			}

			/* --------- 奖励------------ */
			// 字母和数字
			if (
				(/\d/.test(sValue) && /[a-z]/.test(sValue)) ||
				(/\d/.test(sValue) && /[A-Z]/.test(sValue))
			) {
				awardScore = 2
			}
			// 字母、数字和符号
			if (/\d/.test(sValue) && /[a-z]/.test(sValue) && /\W/.test(sValue)) {
				awardScore = 3
			}
			// 字母、数字和符号
			if (/\d/.test(sValue) && /[A-Z]/.test(sValue) && /\W/.test(sValue)) {
				awardScore = 3
			}
			// 大小字母、数字和符号
			if (
				/\d/.test(sValue) &&
				/[a-z]/.test(sValue) &&
				/[A-Z]/.test(sValue) &&
				/\W/.test(sValue)
			) {
				awardScore = 5
			}
			// 累加分数
			let sumScore =
				pawLengthScore * 1 +
				letterScore * 1 +
				numlScore * 1 +
				awardScore * 1 +
				symbolScore * 1
			console.log('log: checkStrong -> sum', sumScore)
			return sumScore
		},
		postBindPhone() {
			/** 绑定手机号 */
			this.$refs.bindPhoneForm.$refs.YxForm.validate(async (valid) => {
				if (valid) {
					// 密码加密
					let params = await this.getRSAPassword(
						Object.assign({}, this.dialogData)
					)
					let rsaData = await bindPhone(params)
					if (rsaData.data.resultCode == 0) {
						this.showBindDialog = false
					}
				}
			})
		},
		sendVerifyCode() {
			/** 发送验证码 */
			// 获取验证码

			this.getVerifyCode(() => {
				let title = 60
				this.code = {
					text: title + 's',
					disabled: true,
					style: 'btn_sendCode_d',
					loading: false,
				}
				this.timeInterval = setInterval(() => {
					title--
					this.code.text = title + 's'
					if (title <= 0) {
						this.code = {
							text: '重新发送',
							disabled: false,
							style: 'btn_sendCode',
							loading: false,
						}
						clearInterval(this.timeInterval)
					}
				}, 1000)
			})
		},
		async getVerifyCode(callback) {
			/** 获取手机验证码 */
			let data = {}
			if (this.actionType == 'verifyPhone') {
				// 验证手机号
				data = {
					verifyType: 20,
					phoneMob: this.loginForm.phoneMob,
				}
			} else if (this.actionType == 'bindPhone') {
				// 绑定手机号
				data = {
					verifyType: 21,
					phoneMob: this.dialogData.phoneMob,
					userName: this.dialogData.userName,
				}
			} else if (this.actionType == 'resetPassword') {
				// 验证手机号
				data = {
					verifyType: 26,
					phoneMob: this.formData189.phoneMob,
					userName: this.formData189.userName,
				}
			}
			if (!data.phoneMob) {
				this.$message.error({
					title: '错误',
					message: '请输入手机号',
				})
				return
			}

			this.code = {
				text: '',
				disabled: true,
				style: 'btn_sendCode',
				loading: true,
			}
			let rsaData = await sendVerifyCodeByPhone(data)
			if (rsaData && rsaData.data && rsaData.data.resultCode == '0') {
				callback && callback()
			} else {
				this.code = {
					text: '重新发送',
					disabled: false,
					style: 'btn_sendCode',
					loading: false,
				}
			}
		},
		getVerifyCodeImage() {
			/** 获取图形验证码 */
			this.$refs.codeImage.src =
				'/yhtplus/egg/api/yhtplus/verifyCode/getPlatformValidateCode.action?id=' +
				this.loginForm.imageId +
				'&h=50&w=100&t=' +
				new Date().getTime()
		},
		guid2() {
			return (
				this.S4() +
				this.S4() +
				this.S4() +
				this.S4() +
				this.S4() +
				this.S4() +
				this.S4() +
				this.S4()
			)
		},
		S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
		},
		setDialogVisible194() {
			this.actionType = 'resetPassword'
			this.dialogVisible194 = true
			this.formData189 = {
				userName: '',
				phoneMob: '',
				code: '',
			}
		},
		async submitForm(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					// 密码加密
					this.loginLoading = true
					let params = await this.getRSAPassword(
						Object.assign({}, this.loginForm)
					)
					this.loginLoading = false
					let loginFlag = await this.$store
						.dispatch('user/setTokenAndUserId', params)
						.catch(() => {
							if (this.actionType == 'login') {
								this.getVerifyCodeImage()
							}
						})
					if (loginFlag && loginFlag.resultCode === 1401) {
						// 绑定手机号
						if (this.timeInterval) {
							clearInterval(this.timeInterval)
							this.code = {
								text: '发送验证码',
								disabled: false,
								style: 'btn_sendCode',
							}
						}
						this.dialogData = Object.assign({}, this.loginForm)
						this.dialogData.verifyType = 21
						this.actionType = 'bindPhone'
						this.showBindDialog = true
						return
					} else if (loginFlag && loginFlag.resultCode === 1403) {
						// 手机号码验证
						if (this.timeInterval) {
							clearInterval(this.timeInterval)
							this.code = {
								text: '发送验证码',
								disabled: false,
								style: 'btn_sendCode',
							}
						}
						this.actionType = 'verifyPhone'
						this.loginForm.phoneMob = loginFlag.resultData
						this.sendVerifyCode()
						return
					} else if (loginFlag && loginFlag.resultCode === 1407) {
						// 首次登录未绑定MFA码用户弹窗绑定
						if (loginFlag.resultData.userId) {
							this.userIdForOtp = loginFlag.resultData.userId
							this.ctrlMFADialog(true)
						}
						return
					} else if (!loginFlag) {
						return
					}
					let flag = await this.$store.dispatch('user/setUserInfo')
					if (!flag) {
						// TODO: 如果是商家账号，就不进行后续的逻辑
						this.$message.error('该账号为商家账号, 请前往商家端进行登入')
						return
					}
					// 返回原页面或首页
					this.$router.push(this.$route.query.redirect || '/')
				} else {
					this.$message.error('请输入正确的用户名密码')
					return false
				}
			})
		},
		async getRSAPassword(paramJson) {
			let psw = paramJson.password.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.password = RSA.encryptedString(publicKey, psw)
			console.log()
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		// 关闭MFA绑定弹窗
		ctrlMFADialog(flag) {
			this.MFADialogVisible = flag
		},
	},
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;
	background: url('../../assets/image/login_bg.jpg') no-repeat center;
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.form-fade-enter-active,
.form-fade-leave-active {
	transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
	transform: translate3d(0, -50px, 0);
	opacity: 0;
}
.login_con_bg {
	background: url('../../assets/image/login_con.png') no-repeat center;
	background-size: 100% 100%;
	width: 900px;
	height: 510px;
	display: flex;
	justify-content: center;
	padding-top: 20px;
}
.login_con {
	flex: 1;
	padding: 20px;
	h1 {
		font-size: 24px;
		color: #666;
		font-weight: normal;
		// margin-bottom: 30px;
	}
}
::v-deep .input_txt .el-input__inner {
	width: 40%;
	height: 46px;
	line-height: 46px;
	border-radius: 46px;
	border: 1px solid #e6e6e6;
	box-sizing: border-box;
}
.submit_btn {
	width: 40%;
	font-size: 18px;
	height: 46px;
	border-radius: 46px;
	background: #f7544b;
	color: #fff;
}
.verify_box {
	::v-deep .input_txt .el-input__inner {
		width: 100%;
	}
	::v-deep .el-input-group__append {
		padding: 0 23px;
		border-radius: 46px;
		font-size: 0;
		border: 1px solid #dcdfe6;
		background-color: #fff;
	}
	img {
		width: 88px;
		height: 44px;
	}
	::v-deep .el-col {
		height: 46px;
	}
}
.footer-btn {
	display: flex;
	align-items: center;
}
.mfaCode-tips {
	color: #666;
	font-size: 14px;
	margin-right: 14%;
}

// 手机号校验样式

.phone-num {
	padding-bottom: 10px;
	padding-left: 5px;
}
.verify-phone_box {
	::v-deep .input_txt .el-input__inner {
		width: 100%;
	}
	::v-deep .el-input-group__append {
		width: 120px;
		padding: 0;
		border-radius: 46px;
		font-size: 0;
		overflow: hidden;
		border: 1px solid #dcdfe6;
	}
	.btn_sendCode {
		width: 120px;
		height: 44px;
		padding: 0;
		margin: 0;
		font-size: 14px;
		background: white;
	}
	.btn_sendCode_d {
		width: 120px;
		height: 44px;
		padding: 0;
		margin: 0;
		font-size: 14px;
		background: #dcdfe6 !important;
	}
}
#inputValue {
	width: 240px;
	margin-left: 20px;
	padding-left: 10px;
	border-radius: 3px;
}
.input_span span {
	display: inline-block;
	width: 85px;
	height: 10px;
	background: #eee;
	line-height: 20px;
}

#veryWeak {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border-right: 0px solid;
	margin-left: 20px;
	margin-right: 3px;
}

#weak {
	border-left: 0px solid;
	border-right: 0px solid;
	margin-left: -5px;
	margin-right: 3px;
}

#general {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	border-left: 0px solid;
	margin-left: -5px;
}

#strong {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	border-left: 0px solid;
	margin-left: -5px;
}
#safety {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	border-left: 0px solid;
	margin-left: -5px;
}

#font span:nth-child(1) {
	color: #e44a4a;
	margin-left: 80px;
}
#font span:nth-child(2) {
	color: #e8a2a2;
	margin: 0 55px;
}
#font span:nth-child(3) {
	color: #fdca30;
}
#font span:nth-child(4) {
	color: #9ed8ad;
	margin: 0 60px;
}
#font span:nth-child(5) {
	color: #7dcd8e;
}
</style>
