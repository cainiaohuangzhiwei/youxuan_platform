<template>
	<div class="setDepartment">
		<basicContainer>
			<yx-form
				v-loading="loading"
				class="form-box"
				labelWidth="100px"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
				:rules="formRules101"
			>
				<template slot="title1">
					<div class="title">
						账号信息<span v-if="!this.params.clerkId" class="tips"
							>（若无法添加员工，请联系客服。客服热线400-8015-415）</span
						>
					</div>
				</template>
				<template slot="passwordNormal">
					<div class="password-box">
						<div>
							<el-input
								type="password"
								v-model="formData101.passwordNormal"
								auto-complete="off"
								:disabled="params.clerkId"
							/>
							<template v-if="!params.clerkId">
								<div class="input_span">
									<span ref="veryWeak" id="veryWeak"></span>
									<span ref="weak" id="weak"></span>
									<span ref="general" id="general"></span>
									<span ref="strong" id="strong"></span>
									<span ref="safety" id="safety"></span>
								</div>
								<div id="font">
									<span>非常弱</span>
									<span>弱</span>
									<span>一般</span>
									<span>强</span>
									<span>安全</span>
								</div>
							</template>
						</div>
						<el-button
							class="reset-btn"
							@click="reset"
							v-if="params.clerkId"
							type="text"
							>重置</el-button
						>
					</div>
				</template>
				<template slot="title2">
					<div class="title">个人信息</div>
				</template>
				<template slot="department">
					<el-select
						ref="departmentName"
						v-model="formData101.departmentName"
						placeholder="请选择"
					>
						<el-option :value="mineStatusValue" style="height: auto">
							<el-tree
								:data="departmentTree"
								node-key="departmentId"
								ref="tree"
								class="department-tree"
								highlight-current
								:expand-on-click-node="false"
								:props="defaultProps"
								@node-click="handleNodeClick"
							></el-tree>
						</el-option>
					</el-select>
				</template>
				<template slot="title3">
					<div class="title">权限设置</div>
				</template>
			</yx-form>
			<Dialog
				:title="dialogTitle127"
				:visible.sync="dialogVisible127"
				:width="dialogWidth127"
				:bottomBtn="dialogBottomBtn127"
			>
				<yx-form
					ref="dialog104"
					labelWidth="100px"
					:data="formData104"
					:items="formCfg104"
					:rules="formRules104"
				></yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import { getDepartmentList } from '@/api/department'
import { getRoleList } from '@/api/privilege'
import {
	addClerk,
	updateClerkByClerkId,
	getClerkDetailByClerkId,
} from '@/api/clerk'
import { setViewTitle } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxForm,
		Dialog,
	},
	props: [],
	data() {
		return {
			formData104: {
				newPassword: '',
			},
			formRules104: {
				newPassword: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value.replace(/\s+/g, '')) {
								callback(new Error('请输入密码'))
							} else if (
								!/^.*(?=.{8,15})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9a-zA-Z]).*$/.test(
									value
								)
							) {
								callback(
									new Error(
										'必须含有数字、符号、大写字母和小写字母组合成长度为8-15位的密码'
									)
								)
							} else if (/<|>/g.test(value)) {
								callback(new Error('密码不能带有特殊符号"<",">"'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg104: [
				{
					title: '新密码',
					type: 'inputPassword',
					dataIndex: 'newPassword',
				},
			],
			dialogTitle127: '重置密码',
			dialogVisible127: false,
			dialogWidth127: '500px',
			dialogBottomBtn127: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog104.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.formData101.passwordNormal = this.formData104.newPassword
								this.dialogVisible127 = false
							}
						})
					},
				},
			],
			loading: false,
			params: this.$route.params,
			defaultProps: {
				children: 'childDepartmentList',
				label: 'departmentName',
			},
			mineStatusValue: [],
			departmentTree: [],
			formData101: {
				userName: '',
				passwordNormal: '',
				passwordConfirm: '',
				departmentName: '',
				clerkName: '',
				department: '',
				realName: '',
				phoneMob: '',
				position: '',
				email: '',
				qq: '',
				wechat: '',
				roleId: '',
				syncSupplier: [],
				departmentId: null,
			},
			formRules101: {
				userName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value.replace(/\s+/g, '')) {
								callback(new Error('请输入账号'))
							} else if (!/^[0-9a-zA-Z]+$/.test(value)) {
								callback(new Error('输入的账号不正确（字母与数字组成）'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				passwordNormal: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.params.clerkId) {
								if (!value.replace(/\s+/g, '')) {
									callback(new Error('请输入密码'))
								} else if (
									!/^.*(?=.{8,15})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9a-zA-Z]).*$/.test(
										value
									)
								) {
									callback(
										new Error(
											'必须含有数字、符号、大写字母和小写字母组合成长度为8-15位的密码'
										)
									)
								} else if (/<|>/g.test(value)) {
									callback(new Error('密码不能带有特殊符号"<",">"'))
								} else {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				passwordConfirm: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入确认密码'))
							} else if (value != this.formData101.passwordNormal) {
								callback(new Error('请输入密码与确认密码不一致'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				clerkName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
				realName: [
					{ required: true, message: '请输入真实姓名', trigger: 'blur' },
				],
				department: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData101.departmentId) {
								callback(new Error('请选择部门'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				phoneMob: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!/[0-9-+]{6,20}$/.test(value)) {
								callback(new Error('请输入正确的手机号码'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg101: [
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'title1',
				},
				{
					type: 'text',
					dataIndex: 'userName',
					title: '账号',
					hide: !this.$route.params.clerkId,
				},
				{
					type: 'input',
					title: '账号',
					dataIndex: 'userName',
					placeholder: '请输入账号',
					hide: this.$route.params.clerkId,
				},
				{
					title: '密码',
					type: 'custom',
					dataIndex: 'passwordNormal',
				},
				{
					title: '确认密码',
					type: 'inputPassword',
					dataIndex: 'passwordConfirm',
					hide: this.$route.params.clerkId,
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'title2',
				},
				{
					title: '昵称',
					type: 'input',
					dataIndex: 'clerkName',
				},
				{
					title: '部门',
					type: 'custom',
					dataIndex: 'department',
				},
				{
					title: '真实姓名',
					type: 'input',
					dataIndex: 'realName',
				},
				{
					title: '手机号码',
					type: 'input',
					dataIndex: 'phoneMob',
					disabled: false,
				},
				{
					title: '职位',
					type: 'input',
					dataIndex: 'position',
				},
				{
					title: '邮箱',
					type: 'input',
					dataIndex: 'email',
				},
				{
					title: 'QQ',
					type: 'input',
					dataIndex: 'qq',
				},
				{
					title: '微信',
					type: 'input',
					dataIndex: 'wechat',
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'title3',
				},
				{
					title: '角色权限',
					type: 'select',
					dataIndex: 'roleId',
					label: 'roleName',
					options: [],
				},
				{
					title: '登录后台',
					type: 'checkbox',
					dataIndex: 'syncSupplier',
					label: 'value',
					options: [
						{
							value: '商家运营后台',
							syncSupplier: 2,
						},
					],
				},
			],
			formAction101: [
				{
					title: '保 存',
					type: 'primary',
					click: () => {
						this.save()
					},
				},
				{
					title: '取 消',
					type: 'info',
					cancel: true,
					click: () => {
						this.$store
							.dispatch('tagsView/delVisitedView', this.$route)
							.then(() => {
								this.$router.push({
									path: '/set/setDepartment',
								})
							})
					},
				},
			],
		}
	},

	watch: {
		'formData101.passwordNormal'(newname) {
			this.strongScore = this.checkStrong(newname)
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
	created() {
		if (this.params && this.params.clerkId) {
			setViewTitle(
				this.$store,
				this.$route,
				null,
				`编辑员工-${this.params.clerkId}`
			)
			this._getClerkDetailByClerkId()
			this.formCfg101.map((item) => {
				if (item.dataIndex == 'phoneMob') {
					item.disabled = true
				}
			})
		}
		this._getDepartmentList()
		this._getRoleList()
	},

	methods: {
		// 获取账户详情
		_getClerkDetailByClerkId: async function () {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await getClerkDetailByClerkId({ clerkId: this.params.clerkId })
			this.loading = false
			if (resultCode == 0) {
				resultData.clerk.syncSupplier =
					resultData.clerk.syncSupplier == 2 ? [2] : []
				this.formData101 = Object.assign(this.formData101, resultData.clerk)
			}
		},
		reset() {
			// 重置密码
			this.formData104 = {
				newPassword: '',
			}
			this.dialogVisible127 = true
			this.$nextTick(() => {
				this.$refs.dialog104.$refs.YxForm.clearValidate()
			})
		},
		// 保存
		save: async function () {
			let paramJson = {
				clerkName: this.formData101.clerkName,
				departmentId: this.formData101.departmentId,
				position: this.formData101.position,
				phoneMob: this.formData101.phoneMob,
				email: this.formData101.email,
				qq: this.formData101.qq,
				wechat: this.formData101.wechat,
				roleId: this.formData101.roleId,
				password: this.formData101.passwordNormal,
				syncSupplier: this.formData101.syncSupplier.length ? 2 : 1,
				userName: this.formData101.userName,
				realName: this.formData101.realName,
			}
			let res = null
			if (!this.params.clerkId) {
				// 新增
				res = await addClerk(paramJson)
			} else {
				// 编辑
				paramJson.clerkId = this.params.clerkId
				res = await updateClerkByClerkId(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/set/setDepartment',
						})
					})
			}
		},
		_getRoleList: async function () {
			// 获取角色权限
			let {
				data: { resultCode, resultData },
			} = await getRoleList()
			if (resultCode == 0) {
				this.formCfg101.map((item) => {
					if (item.dataIndex == 'roleId') {
						item.options = resultData.roleList || []
					}
				})
				this.formData101.roleId = this.formData101.roleId
					? this.formData101.roleId
					: (resultData.roleList &&
							resultData.roleList[0] &&
							resultData.roleList[0].roleId) ||
					  ''
			}
		},
		handleNodeClick(data) {
			this.formData101.departmentId = data.departmentId
			this.formData101.departmentName = data.departmentName
			this.$refs.departmentName.blur()
		},
		// 获取部门
		_getDepartmentList: async function () {
			let {
				data: { resultCode, resultData },
			} = await getDepartmentList()
			if (resultCode == 0) {
				this.departmentTree = resultData.departmentTree
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
			if (sValue.length <= 5) {
				pawLengthScore = 0
			}
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
			if (!/[a-z]/.test(sValue) || !/[A-Z]/.test(sValue)) {
				letterScore = 0
			}
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
			if (!/\d/.test(sValue)) {
				numlScore = 0
			}
			// 计算数字有几个
			let srtArr = sValue.match(/[\d]+/)
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
			if (!/\W/.test(sValue)) {
				symbolScore = 0
			}
			// 计算符号有几个
			let symbolArr = sValue.match(/[\W]+/)
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
			return sumScore
		},
	},
}
</script>
<style scoped>
.title {
	font-weight: 700;
	margin-left: -30px;
	margin-bottom: 20px;
}
.tips {
	color: #999;
	font-weight: normal;
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
	margin-left: 45px;
}
#font span:nth-child(2) {
	color: #e8a2a2;
	margin: 0 50px;
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
<style scoped>
.form-box {
	width: 600px;
}
.department-tree {
	margin: 0 -20px;
}
.goods-group-btn-box {
	margin-bottom: 20px;
}
.hide-btn {
	display: none;
}
.password-box {
	display: flex;
}
.reset-btn {
	margin-left: 20px;
}
</style>
