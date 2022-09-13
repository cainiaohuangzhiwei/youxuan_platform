<template>
	<yx-dialog :title="dialogTitle" :visible.sync="visible">
		<yx-form
			labelWidth="100px"
			:data="dialogData"
			:rules="rules"
			:items.sync="dialogCfg"
			:formAction="dialogAction"
		>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { updatePlatformUserById, addPlatformUser } from '@/api/platformUser'
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
		// 机构
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			dialogTitle: '新增设备',
			visible: false,
			dialogData: {
				equipmentCode: '', //渠道
				sourceType: '', //设备号
				loginAccount: '', //登录账号
				recordUserId: '', //用户id
				subUserId: '', //子账号id
				accountId: '', //账户id
				memberId: '', //会员id
				token: '', //用户登录 token
				cookie: '', //请求
				authorization: '', //用户授权
				did: '', //服务器标识
				appid: '', //APP标识
				wxAppid: '', //微信支付APPid
				aliPayAppid: '', //支付宝appid
				passWord: '', //编辑密码
			},
			rules: {
				// 弹框表单规则
				sourceType: [
					{ required: true, message: '请选择渠道', trigger: 'blur' },
				],
				equipmentCode: [
					{ required: true, message: '请选择设备', trigger: 'blur' },
				],
				loginAccount: [
					{ required: true, message: '请输入登录账号', trigger: 'blur' },
				],
				recordUserId: [
					{ required: true, message: '请输入用户id', trigger: 'blur' },
				],
				subUserId: [
					{ required: true, message: '请输入子账号id', trigger: 'blur' },
				],
				accountId: [
					{ required: true, message: '请输入账户id', trigger: 'blur' },
				],
				token: [
					{ required: true, message: '请输入用户token', trigger: 'blur' },
				],
				cookie: [
					{ required: true, message: '请输入用户cookie', trigger: 'blur' },
				],
				authorization: [
					{ required: true, message: '请输入用户授权', trigger: 'blur' },
				],
				did: [{ required: true, message: '请输入服务器标识', trigger: 'blur' }],
				appid: [{ required: true, message: '请输入appid', trigger: 'blur' }],
				passWord: [
					{ required: true, message: '请输入编辑密码', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							if (value != 'WG@Account') {
								callback(new Error('密码错误，请重新输入'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.editEvents()
					},
				},
			],
			dialogCfg: [
				{
					title: '设备号',
					type: 'select',
					label: 'value',
					dataIndex: 'equipmentCode',
					placeholder: '请选择',
					options: [],
				},
				{
					title: '渠道',
					type: 'select',
					label: 'value',
					dataIndex: 'sourceType',
					options: [],
				},
				{
					title: '登录账号',
					type: 'input',
					dataIndex: 'loginAccount',
				},
				{
					title: '用户id',
					type: 'input',
					dataIndex: 'recordUserId',
				},
				{
					title: '子账号id',
					type: 'input',
					dataIndex: 'subUserId',
				},
				{
					title: '账户id',
					type: 'input',
					dataIndex: 'accountId',
				},
				{
					title: '会员id',
					type: 'input',
					dataIndex: 'memberId',
				},
				{
					title: '用户登录 token',
					type: 'input',
					dataIndex: 'token',
				},
				{
					title: '请求 cookie',
					type: 'input',
					dataIndex: 'cookie',
				},
				{
					title: '用户授权',
					type: 'input',
					dataIndex: 'authorization',
				},
				{
					title: '服务器标识',
					type: 'input',
					dataIndex: 'did',
				},
				{
					title: 'APP标识',
					type: 'input',
					dataIndex: 'appid',
				},
				{
					title: '微信支付APPid',
					type: 'input',
					dataIndex: 'wxAppid',
				},
				{
					title: '支付宝appid',
					type: 'input',
					dataIndex: 'aliPayAppid',
				},
				{
					title: '编辑密码',
					type: 'input',
					dataIndex: 'passWord',
				},
			],
		}
	},
	methods: {
		async editEvents() {
			let res = null
			if (this.dialogData.platformUserId) {
				res = await updatePlatformUserById(this.dialogData)
			} else {
				res = await addPlatformUser(this.dialogData)
			}
			let type = ''
			if (res.data.resultCode == 0) {
				type = 'success'
			} else {
				type = 'error'
			}
			this.$message({
				message: res.data.resultMsg,
				type: type,
			})
			this.visible = false
			this.$emit('updateList')
		},
		setDialogData() {
			if (this.itemInfo && this.itemInfo.id) {
				this.dialogTitle = '编辑设备'
				this.dialogData = Object.assign(
					{
						passWord: '',
					},
					this.itemInfo
				)
				this.dialogData.recordUserId = this.itemInfo.userId
				this.dialogData.platformUserId = this.itemInfo.id
				delete this.dialogData.userId
				delete this.dialogData.id
			} else {
				this.dialogTitle = '新增设备'
				this.dialogData = {
					equipmentCode: '',
					sourceType: '',
					loginAccount: '',
					recordUserId: '',
					subUserId: '',
					accountId: '',
					memberId: '',
					token: '',
					cookie: '',
					authorization: '',
					did: '',
					appid: '',
					wxAppid: '',
					aliPayAppid: '',
					passWord: '',
				}
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this.setDialogData()
				if (!this.dialogCfg[0].options.length) {
					let options = JSON.parse(
						JSON.stringify(this.$store.state.app.constant.EQUIPMENTCODE_STATE)
					)
					options.splice(0, 1)
					this.dialogCfg[0].options = options
				}
				if (!this.dialogCfg[1].options.length) {
					let options = JSON.parse(
						JSON.stringify(this.$store.state.app.constant.SOURCETYPE_STATE)
					)
					options.splice(0, 1)
					this.dialogCfg[1].options = options
				}
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
