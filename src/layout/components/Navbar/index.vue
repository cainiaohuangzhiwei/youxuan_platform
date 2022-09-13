<!--
 * @Description: navibar
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 21:25:52
 * @LastEditTime: 2021-04-21 14:47:28
 * @LastEditors: 你的名字
-->
<template>
	<div class="navbar">
		<Hamburger
			id="hamburger-container"
			:is-active="sidebar.opened"
			class="hamburger-container pointer"
			@toggleClick="toggleSideBar"
		/>
		<Breadcrumb id="breadcrumb-container" />

		<div class="nav-right">
			<el-link type="primary" @click="groove">技术出来挨打</el-link>

			<div class="loader">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<el-link type="primary" class="satisfaction" @click="goQuestionnaire"
					>满意度调研</el-link
				>
			</div>
			<HeaderSearch id="header-search" class="" />
			<Screenfull id="screenfull" class="pointer hover-effect" />
			<el-dropdown
				class="avatar-container hover-effect"
				trigger="click"
				@command="handleCommandDetail"
			>
				<!-- 设置 -->
				<div
					class="un-selected pointer el-icon-s-tools"
					style="font-size: 20px"
				></div>
				<el-dropdown-menu slot="dropdown">
					<!-- <router-link to="/">
						<el-dropdown-item command="homePage">首页</el-dropdown-item>
					</router-link> -->
					<el-dropdown-item command="system">系统设置</el-dropdown-item>
					<el-dropdown-item command="department">部门与员工</el-dropdown-item>
					<el-dropdown-item command="operation" v-auth="'operationalLogsList'">
						操作记录
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-dropdown
				class="avatar-container hover-effect"
				trigger="click"
				@command="handleCommand"
			>
				<!-- 登录头像 -->
				<div class="avatar-wrapper un-selected pointer">
					{{ getUserNameFirstChat }}
				</div>
				<el-dropdown-menu slot="dropdown">
					<router-link to="/">
						<el-dropdown-item command="homePage">首页</el-dropdown-item>
					</router-link>
					<el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
					<el-dropdown-item command="resetMFA">重置MFA认证</el-dropdown-item>
					<el-dropdown-item command="bindPhone">修改手机号</el-dropdown-item>
					<el-dropdown-item command="logout">注销</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<!-- 提示修改密码 -->
		<MyDialog
			:title="myDialogInfo.title"
			:is-visible.sync="myDialogInfo.isVisible"
			:width="myDialogInfo.width"
			:className="myDialogInfo.className"
			:bt-loading="myDialogInfo.btLoading"
			:bt-list="myDialogInfo.btList"
			@handleClick="handleClick"
			@handleClose="handleClose"
		>
			<div style="height: auto">
				<div class="solt_content">
					<div>您好，为了您的账号安全，请您修改账户默认密码</div>
				</div>
			</div>
		</MyDialog>
		<!-- 修改密码 -->
		<MyDialog
			:title="changePasswordDialogInfo.title"
			:is-visible.sync="changePasswordDialogInfo.isVisible"
			:width="changePasswordDialogInfo.width"
			:bt-loading="changePasswordDialogInfo.btLoading"
			:bt-list="changePasswordDialogInfo.btList"
			@handleClick="handleClick"
			@handleClose="handleClose"
		>
			<div style="height: auto">
				<div class="solt_content">
					<el-form
						:model="formInline"
						status-icon
						:rules="rules"
						ref="changePasswordDialogfrom"
						label-width="100px"
						class="demo-ruleForm"
					>
						<p style="font-size: 12px; color: red">
							温馨提示：新密码为数字+大小写字母+特殊符号，长度大于等于8位且小于等于16位，与旧密码相识度不能超过60%
						</p>
						<el-form-item label="用户名称" prop="headName">
							<el-input
								disabled
								type="test"
								v-model="$store.state.user.userInfo.clerkName"
								autocomplete="off"
							></el-input>
						</el-form-item>
						<el-form-item label="原始密码" prop="newOriginalPassword">
							<el-input
								type="password"
								v-model="formInline.newOriginalPassword"
								autocomplete="off"
							></el-input>
						</el-form-item>
						<el-form-item prop="newPassword">
							<span slot="label">
								<span class="span-box">
									<span>新密码</span>
									<el-tooltip
										class="item"
										effect="dark"
										content="数字+大小写字母+特殊符号且长度大于等于8位且小于等于16位"
										placement="top"
									>
										<i class="el-icon-warning ico-pre"></i>
									</el-tooltip>
								</span>
							</span>
							<el-input
								type="password"
								v-model="formInline.newPassword"
								id="inputValue"
								auto-complete="off"
							/>
						</el-form-item>

						<div style="margin-left: 80px" class="input_span">
							<span ref="veryWeak" id="veryWeak"></span>
							<span ref="weak" id="weak"></span>
							<span ref="general" id="general"></span>
							<span ref="strong" id="strong"></span>
							<span ref="safety" id="safety"></span>
						</div>
						<div style="margin-left: 40px; display: flex" id="font">
							<div>非常弱</div>
							<div>弱</div>
							<div>一般</div>
							<div>强</div>
							<div>安全</div>
						</div>
						<el-form-item label="确认密码" prop="originalPassword">
							<el-input
								type="password"
								v-model="formInline.originalPassword"
								autocomplete="off"
							></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</MyDialog>
		<MFADialog
			:MFADialogVisible="MFADialogVisible"
			@ctrlMFADialog="ctrlMFADialog"
			:ownMode="ownMode"
		/>
	</div>
</template>

<script>
import Hamburger from '../Hamburger/index.vue'
import Breadcrumb from '../Breadcrumb/index.vue'
import Screenfull from '../Screenfull/index.vue'
import HeaderSearch from '../HeaderSearch/index.vue'
import MyDialog from '@/components/utils/MyDialog'
import MFADialog from '@/components/MFADialog'
import {
	hasMandatoryModifyPassword,
	getPublicKeyAndModel,
	modifyPasswordByOriginalPassword,
} from '../../../api/webUser'
import RSAUtils from 'js-rsa-dave'

export default {
	name: 'layout-header',
	components: {
		Breadcrumb,
		Hamburger,
		Screenfull,
		HeaderSearch,
		MyDialog,
		MFADialog,
	},
	data() {
		let validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入新密码'))
			} else {
				if (this.formInline.originalPassword !== '') {
					this.$refs.changePasswordDialogfrom.validateField('originalPassword')
				}
				callback()
			}
		}
		let validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'))
			} else if (value !== this.formInline.newPassword) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}
		}
		return {
			NODE_ENV: process.env.NODE_ENV,
			/* -------------修改密码弹窗信息----------------- */
			myDialogInfo: {
				width: '600px',
				title: '提示',
				isVisible: false,
				btLoading: false,
				className: 'page-custom',
				btList: [
					{
						label: '取消',
						type: '',
						icon: '',
						event: 'cancelBtn',
						show: false,
						disabled: false,
					},
					{
						label: '去修改密码',
						type: 'primary',
						icon: '',
						event: 'handleChangepassword',
						saveLoading: false,
						show: true,
						disabled: false,
					},
				],
			},
			changePasswordDialogInfo: {
				width: '600px',
				title: '修改密码',
				isVisible: false,
				btLoading: false,
				btList: [
					{
						label: '取消',
						type: '',
						icon: '',
						event: 'cancelBtn',
						show: true,
						disabled: false,
					},
					{
						label: '确定',
						type: 'primary',
						icon: '',
						event: 'saveBtn',
						saveLoading: false,
						show: true,
						disabled: false,
					},
				],
			},
			formInline: {
				// 原始密码
				newOriginalPassword: '',
				// 新密码
				newPassword: '',
				// 确认密码
				originalPassword: '',
			},
			// 密码强度分数
			strongScore: '',
			rules: {
				newOriginalPassword: [
					{ required: true, message: '请输入原始密码', trigger: 'blur' },
				],
				newPassword: [
					{ required: true, validator: validatePass, trigger: 'blur' },
				],
				originalPassword: [
					{ required: true, validator: validatePass2, trigger: 'blur' },
				],
			},
			MFADialogVisible: false,
			ownMode: '',
		}
	},
	computed: {
		sidebar() {
			return this.$store.state.app.sidebar
		},
		modifyPassword() {
			return this.$store.state.user.modifyPassword
		},
		getUserNameFirstChat() {
			let str = this.$store.state.user.userInfo.clerkName || ''
			return str[0]
		},
	},
	watch: {
		modifyPassword() {
			this.myDialogInfo.isVisible = this.$store.state.user.modifyPassword
		},
		'formInline.newPassword'(newname) {
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
	},
	created: function () {
		this.hasMandatoryModifyPassword()
	},
	methods: {
		goQuestionnaire() {
			window.open(`https://wenjuan.feishu.cn/m?t=ssLhkvgFSKDi-b88y`)
		},
		groove() {
			window.open(`https://wenjuan.feishu.cn/m?t=sMWQUE2wxUDi-dtdc`)
		},
		hasMandatoryModifyPassword: async function () {
			let paramJson = await hasMandatoryModifyPassword({ type: 1 })
			// 密码失效
			if (paramJson && paramJson.data.resultCode == 20006) {
				this.myDialogInfo.isVisible = true
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
			let srtArr = sValue.match(/[\d]+/)
			console.log('log: checkStrong -> srtArr', srtArr)
			if (srtArr) {
				// 只有1个数字
				if (srtArr[0].length >= 1 && srtArr[0].length <= 2) {
					numlScore = 10
				}
				// 大于等于3个数字
				if (srtArr[0].length >= 3) {
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
		strSimilarity2Percent: function (s, t) {
			let l = s.length > t.length ? s.length : t.length
			let d = this.strSimilarity2Number(s, t)
			return (1 - d / l).toFixed(4)
		},
		strSimilarity2Number(s, t) {
			let n = s.length,
				m = t.length,
				d = []
			let i, j, s_i, t_j, cost
			if (n == 0) return m
			if (m == 0) return n
			for (i = 0; i <= n; i++) {
				d[i] = []
				d[i][0] = i
			}
			for (j = 0; j <= m; j++) {
				d[0][j] = j
			}
			for (i = 1; i <= n; i++) {
				s_i = s.charAt(i - 1)
				for (j = 1; j <= m; j++) {
					t_j = t.charAt(j - 1)
					if (s_i == t_j) {
						cost = 0
					} else {
						cost = 1
					}
					d[i][j] = this.Minimum(
						d[i - 1][j] + 1,
						d[i][j - 1] + 1,
						d[i - 1][j - 1] + cost
					)
				}
			}
			return d[n][m]
		},
		Minimum(a, b, c) {
			return a < b ? (a < c ? a : c) : b < c ? b : c
		},
		async handleClick(event) {
			switch (event) {
				// 去修改密码
				case 'handleChangepassword':
					this.changePasswordDialogInfo.isVisible = true
					this.$store.dispatch('user/setModifyPassword', false)
					break
				case 'saveBtn':
					this.$refs['changePasswordDialogfrom'].validate(async (valid) => {
						if (!valid) return false
						if (this.strongScore < 60) {
							this.$message.warning('当前密码安全强度较弱,无法修改')
							return
						}
						if (
							this.formInline.newOriginalPassword == this.formInline.newPassword
						) {
							this.$message.warning('原始密码和新密码一致,无法修改')
							return
						}
						let compare = this.strSimilarity2Percent(
							this.formInline.newPassword,
							this.formInline.newOriginalPassword
						)
						if (compare >= 0.6) {
							this.$message.warning('原始密码和新密码相似度太高,无法修改')
							return
						}
						let paramJson = {
							newPassword: this.formInline.newPassword, // 新密码
							originalPassword: this.formInline.newOriginalPassword, // 原始密码
						}
						this.formInline = Object.assign(this.formInline)
						// 密码加密后
						paramJson = await this.getRSAPassword(paramJson)
						paramJson.userId = this.$store.state.user.userInfo.userId
						let res = await modifyPasswordByOriginalPassword(paramJson)
						if (res.data.resultCode !== 0) {
							this.$message.warning('修改密码失败')
						} else {
							this.$message.success('修改密码成功')
							this.$refs['changePasswordDialogfrom'].resetFields()
							this.myDialogInfo.isVisible = false
							this.changePasswordDialogInfo.isVisible = false
						}
					})
					break
				case 'cancelBtn':
					this.changePasswordDialogInfo.isVisible = false
					this.$refs['changePasswordDialogfrom'].resetFields()
					break
			}
		},
		handleClose() {
			this.$refs['changePasswordDialogfrom'].resetFields()
			this.changePasswordDialogInfo.isVisible = false
		},
		handleDropdown(command) {
			if (command === '1') {
				// this.showResetDialog = true// 弹框
				this.changePasswordDialogInfo.isVisible = true // 修改密码弹框
			} else if (command === '2') {
				this.goLogin() // 退出登录
			}
		},
		// 使用RSA加密
		getRSAPassword: async function (paramJson) {
			let psw = paramJson.originalPassword.split('').reverse().join('')
			let psy = paramJson.newPassword.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			RSAUtils.setMaxDigits(200)
			let publicKey = RSAUtils.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.originalPassword = RSAUtils.encryptedString(publicKey, psw)
			paramJson.newPassword = RSAUtils.encryptedString(publicKey, psy)
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		toggleSideBar() {
			this.$store.dispatch('app/toggleSideBar')
		},
		async handleCommand(command) {
			if (command === 'logout') {
				await this.$store.dispatch('user/clearLoginInfo', this.$route.path)
			}
			if (command === 'changePassword') {
				this.changePasswordDialogInfo.isVisible = true
			}
			if (command === 'resetMFA') {
				this.$confirm(
					'请确认是否需要重置mfa，重置后，需要重新绑定mfa后才可重新登录？',
					'提示',
					{
						type: 'warning',
						callback: (action) => {
							if (action === 'confirm') {
								this.ownMode = 'resetMFACode'
								this.ctrlMFADialog(true)
							}
						},
					}
				)
			}
			if (command === 'bindPhone') {
				this.ownMode = 'bindPhone'
				this.ctrlMFADialog(true)
			}
		},
		async handleCommandDetail(command) {
			if (command === 'system') {
				this.$router.push('/set/setSystemSet')
			}
			if (command === 'department') {
				this.$router.push('/set/setDepartment')
			}
			if (command === 'operation') {
				this.$router.push('/set/operatingRecord')
			}
		},
		// 关闭MFA绑定弹窗
		ctrlMFADialog(flag) {
			this.MFADialogVisible = flag
			if (!flag) {
				this.ownMode = ''
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.navbar {
	padding: 0 15px;
	display: flex;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
	box-shadow: 0 1px 4px #00152914;
	.nav-right {
		margin-left: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.avatar-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40px;
			width: 40px;
			border-radius: 50%;
			font-size: 18px;
			font-weight: bold;
			color: #000;
			opacity: 0.5;
			background: gray;
		}
	}
	.nav-right :nth-child(n) {
		margin: 0 6px;
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
#font div:nth-child(1) {
	color: #e44a4a;
	margin-left: 80px;
}
#font div:nth-child(2) {
	color: #e8a2a2;
	margin: 0 55px;
}
#font div:nth-child(3) {
	color: #fdca30;
}
#font div:nth-child(4) {
	color: #9ed8ad;
	margin: 0 60px;
}
#font div:nth-child(5) {
	color: #7dcd8e;
}
.satisfaction {
	margin-top: 10px !important;
	margin-left: 9px !important;
}
.loader {
	width: 100px;
	height: 40px;
	position: relative;
	overflow: hidden;
}
.loader:hover {
	background: #73ebf1;
	box-shadow: 0 0 5px #73ebf1, 0 0 25px #73ebf1, 0 0 50px #73ebf1,
		0 0 200px #73ebf1;
}
.loader span {
	position: absolute;
	display: block;
}
.loader span:nth-child(1) {
	top: 0;
	left: 90px;
	width: 100%;
	height: 6px;
	background: linear-gradient(90deg, transparent, #03e9f4);
	animation: animate1 3s linear infinite;
	animation-delay: 0;
	animation-iteration-count: 3;
}

@keyframes animate1 {
	0% {
		left: -100%;
	}

	100% {
		left: 100%;
	}
}

.loader span:nth-child(3) {
	bottom: 0;
	left: -100%;
	width: 100%;
	height: 6px;
	background: linear-gradient(270deg, transparent, #03e9f4);
	animation: animate3 3s linear infinite;
	animation-delay: 0;
	animation-iteration-count: 3;
}

@keyframes animate3 {
	0% {
		left: 100%;
	}

	100% {
		left: -100%;
	}
}
@keyframes animate1 {
	0% {
		left: -100%;
	}

	100% {
		left: 100%;
	}
}
.loader span:nth-child(2) {
	right: -10px;
	top: -100%;
	width: 10px;
	height: 100%;
	background: linear-gradient(180deg, transparent, #03e9f4);
	animation: animate2 3s linear infinite;
	animation-delay: 0.5;
	animation-iteration-count: 3;
}
@keyframes animate2 {
	0% {
		top: -100%;
	}

	100% {
		top: 100%;
	}
}
.loader span:nth-child(4) {
	left: -10px;
	top: 100%;
	width: 10px;
	height: 100%;
	background: linear-gradient(0deg, transparent, #03e9f4);
	animation: animate4 3s linear infinite;
	animation-delay: 0.5s;
	animation-iteration-count: 3;
}
@keyframes animate4 {
	0% {
		top: 100%;
	}

	100% {
		top: -100%;
	}
}
</style>
