<template>
	<div>
		<yx-dialog :title="title" :visible.sync="visible">
			<yx-form
				:rules="rules"
				labelWidth="100px"
				:data="dialogData"
				:items="dialogCfg"
				:formAction="formAction"
			>
				<template slot="password" slot-scope="scope">
					<div>
						<div class="password_box">
							<el-input
								@input="passwordChange"
								type="password"
								:disabled="dialogData.clerkId"
								v-model="scope.data.password"
							></el-input>
							<el-button
								v-if="dialogData.clerkId"
								@click="resetVisible = true"
								size="small"
								type="text"
								>重置</el-button
							>
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
				<template slot="supplierName" slot-scope="scope">
					<el-select
						v-model="scope.data.supplierName"
						filterable
						remote
						reserve-keyword
						:disabled="dialogData.clerkId"
						placeholder="请选择"
						:remote-method="_getCmsSupplierListByCondition"
						:loading="listLoading"
						style="width: 100%"
						@focus="_getCmsSupplierListByCondition(e, 'focusAction')"
					>
						<el-option
							v-for="item in supplierList"
							:key="item.value"
							:label="item.value"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>
		</yx-dialog>
		<yx-dialog title="重置密码" :visible.sync="resetVisible">
			<yx-form
				:rules="resetRules"
				labelWidth="100px"
				:data="dialogData"
				:items="resetCfg"
				:formAction="resetmAction"
			></yx-form>
		</yx-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import {
	getCmsSupplierListByCondition,
	addCmsSupplierClerk,
} from '@/api/yhtPlusCmsSupplier'
import { getRoleList } from '@/api/privilege'
import { updateSupplierByUserId } from '@/api/clerk'
export default {
	components: {
		YxDialog,
		YxForm,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		selectItem: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			listLoading: false,
			visible: false,
			resetVisible: false,
			title: '新增商家登录账号',
			dialogData: {
				supplierId: '',
				supplierName: '',
				invisibleList: '',
				password: '',
				passwordTow: '',
				mobPhone: '',
				name: '',
				userName: '', // 账号
			},
			supplierList: [],
			rules: {},
			resetRules: {
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
			},
			rulesAdd: {
				userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
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
				supplierName: [
					{ required: true, message: '请选择商家名称', trigger: 'blur' },
				],
			},
			strongScore: 0,
			resetCfg: [
				{
					type: 'inputPassword',
					title: '新密码',
					dataIndex: 'password',
				},
			],
			dialogCfg: [
				{
					type: 'input',
					title: '账号',
					dataIndex: 'userName',
				},
				{
					type: 'custom',
					title: '密码',
					dataIndex: 'password',
				},
				{
					type: 'inputPassword',
					title: '确认密码',
					dataIndex: 'passwordTow',
					hide: true,
				},
				{
					type: 'custom',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
			],
			resetmAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.resetmChange()
					},
				},
			],
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.change()
					},
				},
			],
			roleId: null,
		}
	},
	methods: {
		async _getRoleList() {
			// 获取角色列表
			if (this.roleId) {
				return
			}
			let {
				data: { resultData, resultCode },
			} = await getRoleList()
			if (resultCode == 0) {
				for (let i = 0; i < resultData.roleList.length; i++) {
					if (resultData.roleList[i].roleName == '供应商') {
						this.roleId = resultData.roleList[i].roleId
						break
					}
				}
			}
		},
		async _updateSupplierByUserId(paramJson) {
			// 编辑商家
			let {
				data: { resultMsg, resultCode },
			} = await updateSupplierByUserId(paramJson)

			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.$emit('updateList')
				this.visible = false
			}
		},
		async _addCmsSupplierClerk(paramJson) {
			// 新增商家
			let {
				data: { resultMsg, resultCode },
			} = await addCmsSupplierClerk(paramJson)

			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.$emit('updateList')
				this.visible = false
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
		resetmChange() {
			let password = this.dialogData.password.replace(/\s+/g, '')
			// let isTrue =
			// 	/\d/.test(password) &&
			// 	/[a-z]/.test(password) &&
			// 	/[A-Z]/.test(password) &&
			// 	/[^A-Za-z0-9]/.test(password)
			if (
				!/^.*(?=.{8,15})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9a-zA-Z]).*$/.test(
					password
				)
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
			this.resetVisible = false
		},
		change() {
			let paramJson = {
				supplierName: this.dialogData.supplierName,
				invisibleList: '',
				roleId: this.roleId,
				userName: this.dialogData.userName,
			}
			if (this.dialogData.clerkId) {
				// 编辑
				paramJson.name = this.selectItem.name
				paramJson.mobPhone = this.selectItem.mobPhone
				paramJson.roleId = 0
				paramJson.clerkId = this.selectItem.clerkId
				paramJson.password = this.dialogData.password.replace(/\s+/g, '')
				this._updateSupplierByUserId(paramJson)
			} else {
				// 新增
				paramJson.mobPhone = this.dialogData.mobPhone
				this.supplierList.map((item) => {
					if (item.value == paramJson.supplierName) {
						paramJson.name = item.name
						paramJson.supplierId = item.supplierId + ''
						paramJson.mobPhone = item.mobPhone
					}
				})
				paramJson.password = this.dialogData.password.replace(/\s+/g, '')
				// let isTrue =
				// 	/\d/.test(paramJson.password) &&
				// 	/[a-zA-Z]/.test(paramJson.password) &&
				// 	/[^A-Za-z0-9]/.test(paramJson.password)
				if (
					!/^.*(?=.{8,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9a-zA-Z]).*$/.test(
						paramJson.password.replace(/\s+/g, '')
					)
				) {
					this.$message.warning({
						message: '密码长度为8-16位,必须数字加大小字母加符号组合',
					})
					return
				}
				this._addCmsSupplierClerk(paramJson)
			}
		},
		async _getCmsSupplierListByCondition(queryString, type) {
			// 获取商家
			if (type === 'focusAction' && this.supplierList.length > 0) {
				return
			}
			this.listLoading = true
			let {
				data: { resultData, resultCode },
			} = await getCmsSupplierListByCondition({
				selectionTag: 2,
				startIndex: 0,
				length: 50,
				supplierName: queryString,
			})
			this.listLoading = false
			if (resultCode == 0) {
				this.supplierList = resultData.supplierList.map((item) => {
					return {
						supplierId: item.supplierId,
						value: item.supplierName,
						name: item.name,
						mobPhone: item.mobPhone,
					}
				})
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this.strongScore = 0
				this._getCmsSupplierListByCondition()
				this._getRoleList()
				if (this.selectItem.clerkId) {
					this.rules = []
					this.title = '编辑商家登录账号'
					this.dialogData.clerkId = this.selectItem.clerkId
					this.dialogData.userName = this.selectItem.userName
					this.dialogData.supplierName = this.selectItem.supplierName
					this.dialogData.password = ''
					this.dialogCfg[2].hide = true
					this.dialogCfg[0].disabled = true
				} else {
					this.dialogData = {
						supplierId: '',
						supplierName: '',
						invisibleList: '',
						password: '',
						passwordTow: '',
						mobPhone: '',
						name: '',
						userName: '', // 账号
					}
					this.title = '新增商家登录账号'
					this.rules = this.rulesAdd
					this.dialogCfg[0].disabled = false
					this.dialogCfg[2].hide = false
				}
				this.$nextTick(() => {
					this.passwordChange()
				})
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

<style lang="scss" scope>
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
