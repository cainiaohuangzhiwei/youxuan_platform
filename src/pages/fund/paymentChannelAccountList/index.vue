<template>
	<basic-container>
		<yx-table
			v-loading="loading"
			:select="false"
			:columns="tableColumns182"
			:data="tableData182"
		>
		</yx-table>
		<Dialog
			title="调账记录"
			:visible.sync="dialogVisible183"
			width="800px"
			:bottomBtn="dialogBottomBtn183"
		>
			<yx-table
				v-loading="loading183"
				:select="false"
				:columns="tableColumns183"
				:data="tableData183"
				:pagination="page183"
			>
			</yx-table>
		</Dialog>
		<Dialog
			title="调账"
			:visible.sync="dialogVisible184"
			width="800px"
			:bottomBtn="dialogBottomBtn184"
		>
			<yx-form
				ref="yxForm"
				labelWidth="100px"
				:inline="false"
				:data="formData184"
				:rules="formRules"
				:items="formCfg184"
			>
				<template slot="amount">
					<div>
						<el-input
							type="number"
							v-amount="formData184.adjustmentAmount"
							v-model="formData184.adjustmentAmount"
							placeholder="请输入调账金额"
						></el-input>
					</div>
				</template>
			</yx-form>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import {
	listMerchantFundBalance,
	accountAdjustmentPage,
	accountAdjustmentSave,
} from '@/api/weeget-bullet-payment-rest'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxTable,
		Dialog,
		YxForm,
	},
	data() {
		return {
			formData184: {
				tranType: 'RECHARGE',
				adjustmentAmount: '',
				remark: '',
				tradeTime: '',
				tradeNo: '',
				balanceId: '',
				inBalanceId: '',
			},
			formRules: {
				tranType: [
					{ required: true, message: '请选择调账类型', trigger: 'change' },
				],
				amount: [
					{
						validator: (rule, value, callback) => {
							if (!this.formData184.adjustmentAmount) {
								callback(new Error('请输入变动金额'))
							} else {
								if (this.formData184.adjustmentAmount <= 0) {
									callback(new Error('变动金额必须大于0'))
								} else if (this.formData184.adjustmentAmount > 10000000) {
									callback(new Error('变动金额不能大于一千万'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				tradeTime: [
					{ required: true, message: '请选择发生时间', trigger: 'blur' },
				],
				tradeNo: [{ required: true, message: '请输入单号', trigger: 'blur' }],
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
				inAccountTypeCode: [
					{ required: true, message: '请选择转入账户', trigger: 'change' },
				],
			},
			formCfg184: [
				{
					title: '调账类型',
					type: 'select',
					dataIndex: 'tranType',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							tranType: 'RECHARGE',
							value: '充值',
						},
						{
							tranType: 'TRANSFER',
							value: '账户间转账',
						},
					],
					change: (tranType) => {
						this.setItems(tranType)
					},
				},
				{
					title: '转出账户',
					type: 'text',
					dataIndex: 'accountTypeName',
					disabled: true,
					hide: true,
				},
				{
					title: '转入账户',
					type: 'select',
					dataIndex: 'inAccountTypeCode',
					label: 'accountTypeName',
					class: 'input-box-bind-account',
					hide: true,
				},
				{
					title: '变动金额',
					type: 'custom',
					dataIndex: 'amount',
				},
				{
					type: 'time',
					title: '发生时间',
					dataIndex: 'tradeTime',
					timeAttributes: {
						type: 'datetime',
					},
				},
				{
					title: '单号',
					type: 'input',
					dataIndex: 'tradeNo',
				},
				{
					type: 'textarea',
					title: '备注',
					maxlength: 140,
					dataIndex: 'remark',
				},
			],
			dialogVisible184: false,
			dialogBottomBtn184: [
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.dialogVisible184 = false
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._accountAdjustmentSave()
					},
				},
			],
			loading183: false,
			tableColumns183: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'businessName',
					title: '操作类型',
					options: [
						['RECHARGE', '充值'],
						['TRANSFER', '账户间转账'],
					],
				},
				{
					type: 'amount',
					// type: 'string',
					dataIndex: 'adjustmentAmount',
					title: '操作金额',
				},
				{
					type: 'string',
					dataIndex: 'payeeAccountType',
					title: '转入账户',
				},
				{
					type: 'string',
					dataIndex: 'payerAccountType',
					title: '转出账户',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '操作备注',
				},
			],
			tableData183: [],
			page183: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._accountAdjustmentPage()
				},
			},
			dialogVisible183: false,
			dialogBottomBtn183: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.dialogVisible183 = false
					},
				},
			],
			loading: false,
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'channelName',
					title: '支付通道',
					customRender: ({ channelName, channelCode }) => {
						return channelCode == 'WECHAT_PAY' ? '微信收付通' : channelName
					},
				},
				{
					type: 'string',
					dataIndex: 'accountTypeName',
					title: '账户名称',
					customRender: ({ accountTypeCode, channelCode, accountTypeName }) => {
						return channelCode == 'SU_NING' && accountTypeCode == 'basic'
							? '平台总账户'
							: accountTypeName
					},
				},
				{
					type: 'amount',
					dataIndex: 'balance',
					title: '余额',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '调账',
							auth: 'saveAccountAdjustment',
							click: (row) => {
								this.formData184 = Object.assign(
									{
										tranType: 'RECHARGE',
										adjustmentAmount: '',
										remark: '',
										tradeTime: '',
										tradeNo: '',
										balanceId: '',
										inAccountTypeCode: '',
									},
									row
								)
								this.formData184.inAccountTypeCode = ''
								this.setItems('RECHARGE')
								this.dialogVisible184 = true
								this.$nextTick(() => {
									this.$refs.yxForm.$refs.YxForm.clearValidate()
								})
							},
							customRender: (action, row) => {
								action.hide = row.channelCode == 'SU_NING'
								return action
							},
						},
						{
							title: '查看调账记录',
							auth: 'pageAccountAdjustment',
							click: ({ accountId, channelCode, accountTypeCode }) => {
								this.accountId = accountId
								this.channel = channelCode
								this.accountType = accountTypeCode
								this._accountAdjustmentPage(true)
								this.dialogVisible183 = true
							},
							customRender: (action, row) => {
								action.hide = row.channelCode == 'SU_NING'
								return action
							},
						},
					],
				},
			],
			tableData182: [],
			accountId: null,
			optionsList: [],
		}
	},
	created() {
		this._listMerchantFundBalance()
	},
	methods: {
		_accountAdjustmentSave() {
			this.$refs.yxForm.$refs.YxForm.validate(async (valid) => {
				if (valid) {
					let paramJson = {
						adjustmentAmount: this.formData184.adjustmentAmount * 100,
						// adjustmentType: 'IN',
						// balanceId: this.formData184.balanceId,
						remark: this.formData184.remark,
						tradeNo: this.formData184.tradeNo,
						tradeTime: moment(this.formData184.tradeTime).format(
							'YYYY-MM-DDTHH:mm:ss'
						),
						tranType: this.formData184.tranType,
						operatorId: this.$store.state.user.userInfo.userId,
						operatorName: this.$store.state.user.userInfo.clerkName,
						channel: this.formData184.channelCode,
						sign: 'a29c832d825365aba30267d0c6209156',
						developerId: 10001,
						signType: 'MD5',
						version: '1.0',
					}
					if (this.formData184.tranType == 'TRANSFER') {
						// paramJson.payeeBalanceId = this.formData184.inBalanceId
						// paramJson.payerBalanceId = this.formData184.balanceId
						paramJson.payerAccountId = this.formData184.accountId
						paramJson.payerAccountType = this.formData184.accountTypeCode
						paramJson.payeeAccountId = this.formData184.accountId
						paramJson.payeeAccountType = this.formData184.inAccountTypeCode
					} else {
						paramJson.payeeAccountId = this.formData184.accountId
						paramJson.payeeAccountType = this.formData184.accountTypeCode
					}
					let {
						data: { resultCode },
					} = await accountAdjustmentSave(paramJson)
					if (resultCode == 0) {
						this.$message.success('调账成功')
						this.dialogVisible184 = false
						this._listMerchantFundBalance()
					}
				}
			})
		},
		setItems(tranType) {
			let options = []
			if (tranType == 'TRANSFER') {
				options = this.tableData182.filter(
					(item) =>
						item.balanceId != this.formData184.balanceId &&
						item.channelCode != 'SU_NING'
				)
				options.forEach((item) => {
					item.inAccountTypeCode = item.accountTypeCode
				})
				options.push({
					accountTypeName: '手续费账户',
					inAccountTypeCode: 'FEES',
					// accountId: this.formData184.accountId,
				})
			}
			this.optionsList = options
			this.formCfg184.forEach((item) => {
				if (
					item.dataIndex == 'accountTypeName' ||
					item.dataIndex == 'inAccountTypeCode'
				) {
					item.hide = tranType == 'RECHARGE'
				}
				if (tranType == 'TRANSFER' && item.dataIndex == 'inAccountTypeCode') {
					item.options = options
				}
			})
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				offset: 0,
				limit: 1,
				accountId: this.accountId,
				channelCode: this.channel,
				accountType: this.accountType,
			}
			// 每页的加载数据长度
			paramJson.limit = this.page183.length
			// 当前页的条数开始
			if (flag) {
				this.page183.currentPage = 1
			}
			paramJson.offset = (this.page183.currentPage - 1) * this.page183.length
			return paramJson
		},
		_accountAdjustmentPage: async function (flag) {
			this.loading183 = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultCode,
					resultData: { recordList = [], total = 0 },
				},
			} = await accountAdjustmentPage(paramJson)
			this.loading183 = false
			if (resultCode == 0) {
				recordList.forEach((item) => {
					item.adjustmentAmount = item.adjustmentAmount / 100
				})
				this.tableData183 = recordList
				this.page183.count = total
			} else {
				this.page183.count = 0
				this.tableData183 = []
			}
		},
		async _listMerchantFundBalance() {
			this.loading = true
			let {
				data: {
					resultCode,
					resultData: { balanceList = [] },
				},
			} = await listMerchantFundBalance({})
			this.loading = false
			if (resultCode == 0) {
				balanceList.forEach((item) => {
					item.balance = item.balance / 100
				})

				this.tableData182 = balanceList
			} else {
				this.tableData182 = []
			}
		},
	},
}
</script>

<style></style>
