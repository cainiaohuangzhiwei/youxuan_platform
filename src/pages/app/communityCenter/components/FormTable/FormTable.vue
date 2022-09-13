<template>
	<basic-container>
		<div>
			<WgForm
				v-loading="exportLoading"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:actionInline="true"
				labelWidth="7em"
			></WgForm>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="portrait" slot-scope="scope">
						<div class="image-composing-half">
							<img
								class="image-style"
								:src="getCustomRender(scope.row.portrait)"
							/>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<Dialog
			:title="DialogTitle"
			:bottomBtn="addNewUsersBottomBtn"
			:visible.sync="addNewUsersLoading"
			width="50%"
			@before-close="
				() => {
					reset()
					addNewUsersLoading = false
				}
			"
		>
			<yx-form
				ref="bindPhoneForm"
				labelWidth="100px"
				:data="dialogData"
				:items.sync="dialogCfg"
				:rules="rules"
			>
				<template slot="phoneMobTitle">
					<el-switch
						v-model="value1"
						@change="phoneMobValue"
						:inactive-text="phoneMobTitle"
					>
					</el-switch
				></template>
				<template slot="passwordTitle">
					<el-switch
						v-model="value2"
						@change="passwordValue"
						:inactive-text="passwordTitle"
					>
					</el-switch
				></template>

				<template slot="code">
					<el-input
						prefix-icon="el-icon-postcard"
						type="number"
						placeholder="验证码"
						v-model="dialogData.code"
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
				<template #userType>
					<label>员工</label>
				</template>
				<template slot="password" slot-scope="scope">
					<div>
						<div class="password_box">
							<el-input
								@input="passwordChange"
								type="password"
								:disabled="dialogData.clerkId"
								v-model="scope.data.password"
							></el-input>
						</div>
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
					</div>
				</template>
			</yx-form>
		</Dialog>
	</basic-container>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { getBigImg } from '@/utils/imageTool'
import { getImUserPage, addImUser, updateImUser } from '@/api/cmsImUser'
// import { checkFunctionCode } from '@/utils/auth'
import RSA from 'js-rsa-dave'
import {
	sendVerifyCodeForUpdateMobile,
	getPublicKeyAndModel,
} from '@/api/webUser.js'
import moment from 'moment'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
export default {
	components: {
		BasicContainer,
		WgForm,
		YxTable,
		Dialog,
		YxForm,
	},
	name: 'FormTable',

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
			exportLoading: false,
			showLoading: false,
			addNewUsersLoading: false,
			DialogTitle: '新增用户',
			timeInterval: '',
			phoneMobTitle: '',
			passwordTitle: '',
			value1: false,
			value2: false,
			editRow: false,
			imUserId: '',
			code: {
				text: '发送验证码',
				disabled: false,
				style: 'btn_sendCode',
				loading: false,
			},
			addNewUsersBottomBtn: [
				{
					title: '保 存',
					type: '',
					click: () => {
						this.addNewUsersbaoDeposit()
					},
				},
			],
			strongScore: 0,
			dialogData: {
				phoneMob: '', //手机号
				code: '', //手机验证码
				account: '', //账号
				name: '', //用户昵称
				password: '',
				passwordTow: '',
				portraitUrlJson: [], // 头像
			},
			dialogCfg: [
				{
					type: 'input',
					title: '账号：',
					dataIndex: 'account',
				},
				{
					type: 'input',
					title: '用户昵称：',
					dataIndex: 'name',
				},
				{
					type: 'custom',
					title: '用户类型：',
					dataIndex: 'userType',
				},
				{
					type: 'uploadImage',
					title: '头像',
					dataIndex: 'portraitUrlJson',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'portraitUrlJson',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					type: 'custom',
					title: '重置手机号',
					dataIndex: 'phoneMobTitle',
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
				{
					type: 'custom',
					title: '重置密码',
					dataIndex: 'passwordTitle',
				},
				{
					title: '密码',
					type: 'custom',
					dataIndex: 'password',
				},
				{
					type: 'inputPassword',
					title: '确认密码',
					dataIndex: 'passwordTow',
				},
			],
			rules: {
				code: [
					{ required: true, message: '请输入手机验证码', trigger: 'blur' },
				],
				phoneMob: [
					{ required: true, validator: validatePhoneNumber, trigger: 'blur' },
				],
				account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
				name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
				portraitUrlJson: [
					{ required: true, message: '请上传头像', trigger: 'blur' },
				],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				passwordTow: [
					{ required: true, message: '请输入确认密码', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							if (this.dialogData.passwordTow != this.dialogData.password) {
								callback(new Error('请输入密码与确认密码不一致'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			searchData: {
				imUserId: '',
				phoneMob: '',
				startTime: moment().startOf('day').valueOf(), //开始时间
				endTime: moment().endOf('day').valueOf(), //结束时间
				name: '',
				type: '',
			},
			searchCfg: [
				{
					title: 'IM_id:',
					type: 'input',
					dataIndex: 'imUserId',
				},
				{
					title: '手机号',
					type: 'inputNumber',
					dataIndex: 'phoneMob',
				},
				{
					title: '用户昵称:',
					type: 'input',
					dataIndex: 'name',
				},
				{
					title: '用户类型',
					type: 'select',
					dataIndex: 'type',
					options: [
						{
							type: '',
							value: '全部',
						},
						{
							type: 1,
							value: '店主',
						},
						{
							type: 2,
							value: '员工',
						},
					],
					label: 'value',
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
					colSpan: 12,
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._getImUserPage(true)
					},
				},
				{
					title: '新增用户',
					type: 'primary',
					align: 'right',
					click: () => {
						this.addNewUsersLoading = true
						this.editRow = false
						this.dialogCfg[4].hide = true
						this.dialogCfg[7].hide = true
					},
				},
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'imUserId',
					title: 'IM_id',
				},
				{
					type: 'string',
					dataIndex: 'account',
					title: '账号',
				},
				{
					type: 'string',
					dataIndex: 'phoneMob',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '用户昵称',
				},
				{
					type: 'custom',
					dataIndex: 'portrait',
					title: '头像',
				},
				{
					type: 'map',
					dataIndex: 'type',
					title: '用户类型',
					options: {
						店主: 1,
						员工: 2,
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.$router.push({
									path: `communityUserCenterDetail/${row.imUserId}`,
								})
							},
						},
						{
							title: '编辑',
							click: (row) => {
								this.addNewUsersLoading = true
								this.editRow = true
								this.getEditRow(row)
							},
							customRender: (action, row) => {
								action.hide = row.type != 2
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getImUserPage()
				},
			},
		}
	},
	created() {},

	mounted() {},

	methods: {
		phoneMobValue(val) {
			console.log('111', val)
			if (val) {
				this.dialogCfg[5].hide = false
				this.dialogCfg[6].hide = false
			} else {
				this.dialogCfg[5].hide = true
				this.dialogCfg[6].hide = true
			}
		},
		passwordValue(val) {
			if (val) {
				this.dialogCfg[8].hide = false
				this.dialogCfg[9].hide = false
			} else {
				this.dialogCfg[8].hide = true
				this.dialogCfg[9].hide = true
			}
		},
		getEditRow(row) {
			this.DialogTitle = '编辑用户'
			this.imUserId = row.imUserId
			this.dialogData = {
				code: row.code, //手机验证码
				account: row.account, //账号
				name: row.name, //用户昵称
				password: '',
				passwordTow: '',
			}
			this.dialogData.portraitUrlJson = [
				{
					portrait: row.portrait,
					portraitUrlJson: getSmallImg(row.portrait),
				},
			]
			let phone = row.phoneMob.substr(0, 3) + '****' + row.phoneMob.substr(7)
			this.phoneMobTitle = phone //手机号
			this.dialogCfg[4].hide = false
			this.dialogCfg[7].hide = false
			this.dialogCfg[5].hide = true
			this.dialogCfg[6].hide = true
			this.dialogCfg[8].hide = true
			this.dialogCfg[9].hide = true
		},
		async addNewUsersbaoDeposit() {
			this.$refs.bindPhoneForm.$refs.YxForm.validate((valid) => {
				if (!valid) {
					// 规则校验通过
					return
				}
			})
			let password = this.dialogData.password
				? this.dialogData.password.replace(/\s+/g, '')
				: ''
			if (
				(!/^.*(?=.{8,15})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9a-zA-Z]).*$/.test(
					password
				) &&
					!this.editRow) ||
				(!/^.*(?=.{8,15})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9a-zA-Z]).*$/.test(
					password
				) &&
					this.editRow &&
					this.value1)
			) {
				this.$message.warning({
					message: '密码长度为8-15位,必须数字加字母加符号组合',
				})
				return
				// eslint-disable-next-line no-useless-escape
			} else if (/\<|\>/g.test(password)) {
				// 密码目前为明文传输, 需过滤尖括号
				this.$message.warning({
					message: '密码不能带有特殊符号"<",">"',
				})
				return
			}

			let paramJson = Object.assign(this.dialogData)
			let Url = this.editRow ? updateImUser : addImUser
			if (this.editRow) {
				paramJson.imUserId = this.imUserId
				paramJson.portrait = paramJson.portraitUrlJson[0].portrait
				if (this.value2) {
					let addpassword = await this.getRSAPassword({
						password: paramJson.password,
					})
					paramJson.password = addpassword.privateKeySessionKey
				} else {
					delete paramJson.password
				}
				if (!this.value1) {
					delete paramJson.phoneMob
				}
			} else {
				paramJson.portrait = paramJson.portraitUrlJson[0].imageUrl
				let addpassword = await this.getRSAPassword({
					password: paramJson.password,
				})
				paramJson.password = addpassword.privateKeySessionKey
			}
			paramJson.vailCode = paramJson.code
			paramJson.type = 2
			delete paramJson.code
			// delete paramJson.portraitUrlJson
			delete paramJson.passwordTow
			console.log('paramJson', paramJson)
			let {
				data: { resultCode, resultMsg },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.addNewUsersLoading = false
				this._getImUserPage()
			}
		},
		async getRSAPassword(paramJson) {
			//加密方法
			let psw = paramJson.password.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.password = RSA.encryptedString(publicKey, psw)
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
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
		passwordChange() {
			this.strongScore = this.checkStrong(this.dialogData.password)
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
		async uploadImageHttpRequest(params) {
			//上传海报
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({ formId: '#anchorImageFrom', imageType: 81 })
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			console.log(resultCode, resultData)
			if (resultCode == 0) {
				this.dialogData.portraitUrlJson = resultData.imageList
				this.dialogData.portraitUrlJson[0].portraitUrlJson = getSmallImg(
					resultData.imageList[0].imageUrl
				)
			}
		},
		sendVerifyCode() {
			/** 发送验证码 */
			// 获取验证码
			if (
				this.$refs.bindPhoneForm.$refs.YxForm.fields[0].validateState ==
				'success'
			) {
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
			}
		},
		async getVerifyCode(callback) {
			/** 获取手机验证码 */
			let params = {
				phoneMob: this.dialogData.phoneMob,
			}
			if (!params.phoneMob) {
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
		getCustomRender(data) {
			let imgUrl = 'image/noImage.jpg'
			if (data) {
				if (/https?:\/\//.test(data)) {
					imgUrl = data
				} else {
					imgUrl = getBigImg(data)
				}
				return imgUrl
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_getImUserPage: async function (flag) {
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { total = 0, records = [] },
				},
			} = await getImUserPage(paramJson)
			console.log(flag, 'flag')
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = records
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
		reset() {
			this.dialogData = {
				phoneMob: '', //手机号
				code: '', //手机验证码
				account: '', //账号
				name: '', //用户昵称
				password: '',
				passwordTow: '',
				portraitUrlJson: [], // 头像
			}
			this.value1 = false
			this.value2 = false
			this.DialogTitle = '新增用户'
			this.dialogCfg[5].hide = false
			this.dialogCfg[6].hide = false
			this.dialogCfg[8].hide = false
			this.dialogCfg[9].hide = false
		},
	},
}
</script>

<style lang="scss" scoped>
.image-composing-half {
	height: 60px;
	width: 60px;
	line-height: 56px;
	float: none;
}
.image-style {
	width: 100%;
	height: auto;
}
.span_box {
	display: flex;
	justify-content: center;
	margin-top: 10px;
	span {
		display: inline-block;
		height: 16px;
		width: 32.6%;
		background-color: #e5e5e5;
		text-align: center;
		margin: 0 1%;
		font-size: 10px;
		line-height: 16px;
		color: #999999;
	}
	span.weak {
		background-color: #eb9393;
		color: #fff;
	}
}
.password_box {
	display: flex;
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
	// margin-left: -5px;
	margin-right: 3px;
}

#general {
	// border-top-right-radius: 5px;
	// border-bottom-right-radius: 5px;
	border-left: 0px solid;
	margin-right: 3px;
	// margin-left: -5px;
}

#strong {
	// border-top-right-radius: 5px;
	// border-bottom-right-radius: 5px;
	border-left: 0px solid;
	margin-right: 3px;
	// margin-left: -5px;
}
#safety {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	border-left: 0px solid;
	// margin-left: -5px;
}
#font span:nth-child(1) {
	color: #e44a4a;
	margin-left: 40px;
}
#font span:nth-child(2) {
	color: #e8a2a2;
	margin: 0 55px;
}
#font span:nth-child(3) {
	color: #fdca30;
	margin: 0 20px;
}
#font span:nth-child(4) {
	color: #9ed8ad;
	margin: 0 50px;
}
#font span:nth-child(5) {
	color: #7dcd8e;
}
</style>
