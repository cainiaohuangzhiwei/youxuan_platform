<template>
	<div class="MFADialog">
		<Dialog
			:title="DialogTitle"
			:visible="MFADialogVisible"
			width="50%"
			@before-close="
				() => {
					$emit('ctrlMFADialog', false)
				}
			"
		>
			<el-steps :active="stepsActive" finish-status="success" v-if="!ownMode">
				<el-step title="绑定手机号"></el-step>
				<el-step title="绑定MFA"></el-step>
			</el-steps>
			<div v-if="stepsActive === 0">
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
							@keyup.enter.native="submitForm()"
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
			<div v-if="stepsActive >= 1" class="mfaQrcodeBox" v-loading="mfaLoading">
				<div class="title">
					请打开“阿里云”app，点击“管控”，扫下面二维码后添加MFA码绑定，否则将不能登录后台使用
				</div>
				<div>
					<img
						v-if="MFAQRcodeImgUrl"
						class="qrcodeImg"
						:src="MFAQRcodeImgUrl"
						alt=""
					/>
					<div class="sk-qrcodeImg" v-else>获取失败</div>
				</div>
			</div>
			<el-button
				style="margin-top: 12px"
				@click="handleSubmit('bindPhone')"
				v-if="ownMode === 'bindPhone'"
			>
				提交
			</el-button>
			<el-button
				style="margin-top: 12px"
				@click="handleSubmit('resetMFACode')"
				v-else-if="ownMode === 'resetMFACode'"
			>
				已完成
			</el-button>
			<el-button style="margin-top: 12px" @click="next" v-else>
				{{ stepsActive >= 1 ? '已完成' : '下一步' }}
			</el-button>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import {
	sendVerifyCodeForUpdateMobile,
	firstLogin,
	modifyMobile,
	resetOtpSecretKeyOwn,
	queryMFAQrCode,
} from '@/api/webUser.js'
export default {
	components: {
		YxForm,
		Dialog,
	},
	props: {
		MFADialogVisible: {
			type: Boolean,
			default: false,
		},
		ownMode: {
			type: String,
			default: '',
		},
		userIdForOtp: {
			type: Number,
			default: 0,
		},
	},
	watch: {
		ownMode(val) {
			if (val === 'bindPhone') {
				this.stepsActive = 0
				this.DialogTitle = '绑定手机号'
			} else if (val === 'resetMFACode') {
				this.stepsActive = 1
				this.DialogTitle = 'MFA认证绑定'
				this.resetMFAKey()
			}
		},
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
			DialogTitle: 'MFA认证绑定',
			stepsActive: 0,
			MFAQRcodeImgUrl: '',
			code: {
				text: '发送验证码',
				disabled: false,
				style: 'btn_sendCode',
				loading: false,
			},
			dialogData: {
				mobile: '', //手机号
				code: '', //手机验证码
			},
			rules: {
				code: [
					{ required: true, message: '请输入手机验证码', trigger: 'blur' },
				],
				mobile: [{ validator: validatePhoneNumber, trigger: 'blur' }],
			},
			dialogCfg: [
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'mobile',
				},
				{
					type: 'custom',
					title: '验证码',
					dataIndex: 'code',
				},
			],
			mfaLoading: false,
		}
	},
	methods: {
		next() {
			if (this.stepsActive === 0) {
				this.submitForm(() => {
					this.stepsActive++
				})
			} else if (this.stepsActive >= 1) {
				this.$confirm('确定已经扫码绑定？', '提示', {
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							this.stepsActive++
							this.$emit('ctrlMFADialog', false)
						}
					},
				})
			}
		},
		async submitForm(cb, update = false) {
			this.$refs.bindPhoneForm.$refs.YxForm.validate(async (valid) => {
				if (valid) {
					if (update) {
						modifyMobile(this.dialogData).then(
							({ data: { resultCode, resultMsg } }) => {
								if (resultCode == 0) {
									this.$message.success(resultMsg)
									typeof cb === 'function' && cb()
								}
							}
						)
					} else {
						firstLogin({
							userIdForOtp: this.userIdForOtp,
							...this.dialogData,
						}).then(({ data: { resultCode, resultData } }) => {
							if (resultCode == 0) {
								this.MFAQRcodeImgUrl = resultData
								typeof cb === 'function' && cb()
							}
						})
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
			let params = {
				mobile: this.dialogData.mobile,
			}
			if (!params.mobile) {
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

			sendVerifyCodeForUpdateMobile(params).then(({ data: { resultCode } }) => {
				if (resultCode == '0') {
					typeof callback === 'function' && callback()
				} else {
					this.code = {
						text: '重新发送',
						disabled: false,
						style: 'btn_sendCode',
						loading: false,
					}
				}
			})
		},
		handleSubmit(type) {
			switch (type) {
				case 'bindPhone':
					this.submitForm(() => {
						this.$emit('ctrlMFADialog', false)
					}, true)
					break
				case 'resetMFACode':
					this.$emit('ctrlMFADialog', false)
					this.$store.dispatch('user/clearLoginInfo', this.$route.path)
					break
				default:
					break
			}
		},
		resetMFAKey() {
			this.mfaLoading = true
			// 重置MFA
			resetOtpSecretKeyOwn({
				userIdForOtp: this.$store.state.user.userInfo.userId || '',
			}).then(({ data: { resultCode, resultMsg } }) => {
				if (resultCode == 0) {
					this.$message.success(resultMsg)
					// 重新获取MFA二维码
					queryMFAQrCode({
						userIdForOtp: this.$store.state.user.userInfo.userId || '',
					}).then((res) => {
						if (res.data?.resultCode == 0) {
							this.MFAQRcodeImgUrl = res.data.resultData || ''
							this.mfaLoading = false
						}
					})
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.mfaQrcodeBox {
	padding: 10px 0;
	text-align: center;
	.title {
		color: #f6435f;
	}
	.qrcodeImg {
		margin: 10px 0;
		width: 200px;
		height: 200px;
	}
	.sk-qrcodeImg {
		display: inline-block;
		margin: 10px 0;
		width: 200px;
		height: 200px;
		line-height: 200px;
		color: #999;
		background-color: #f8f8f8;
	}
}
</style>
