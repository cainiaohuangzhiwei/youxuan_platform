<template>
	<basic-container>
		<yx-form
			v-loading="showLoading"
			labelWidth="100px"
			:data.sync="withdrawData"
			:items="searchCfg"
			:rules="rules"
			:formAction="searchAction"
		>
			<template slot="bankAccountNumber" v-auth="'platformBankAccount'">
				<div>
					<el-input
						v-model="withdrawData.bankAccountName"
						placeholder="请选择银行卡"
						value-key="bankAccountName"
						label="bankAccountName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								searchData.bankAccountName = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="selectSupplier"
						></el-button>
					</el-input>
				</div>
			</template>
			<template slot="amount" slot-scope="scope">
				<div class="amount-box">
					<el-input
						type="number"
						@input="aCommission"
						v-amount="scope.data.amount"
						v-model="withdrawData.amount"
					></el-input>
					<span
						>（单笔提现暂不能超过{{
							platformAccountType == 6 ? 1000 : 100
						}}w）</span
					>
				</div>
			</template>
			<template slot="serviceCharge">
				<span>{{ withdrawData.serviceCharge }}</span>
			</template>
		</yx-form>
		<infoDialog
			:dialogVisible.sync="dialogVisible"
			:withdrawData.sync="withdrawData"
			:gatewayEnable.sync="gatewayEnable"
		></infoDialog>
		<Dialog
			title="选择银行卡"
			:visible.sync="dialogVisible183"
			width="500px"
			:bottomBtn="dialogBottomBtn183"
		>
			<yx-table
				v-loading="loading183"
				:select="false"
				:columns="
					platformAccountType == 6 ? tableColumns7_153 : tableColumns183
				"
				:data="tableData183"
				:pagination="page183"
			>
				<template slot="select" slot-scope="scope">
					<div>
						<el-radio
							v-model="withdrawData.bankAccountId"
							:label="scope.row.bankAccountId"
							>{{ '' }}</el-radio
						>
					</div>
				</template>

				<template slot="select7_153" slot-scope="scope">
					<div>
						<el-radio v-model="withdrawData.bankId" :label="scope.row.bankId">{{
							''
						}}</el-radio>
					</div>
				</template>
			</yx-table>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import infoDialog from './components/infoDialog'
import { supplierWithdrawView } from '@/api/supplierAccount'
import { platformWithdrawView } from '@/api/platformAccount'
import { withdrawSwitch } from '@/api/yhtPlusCmsFinance'
import { platformBankAccount } from '@/api/accountService'
import { withdrawPageBank } from '@/api/weeget-bullet-payment-rest-fors'
import {
	setViewTitle,
	getConstantValueByKey,
	numberFormat,
} from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		infoDialog,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			loading183: false,
			page183: {
				count: 0,
				length: 100,
				currentPage: 1,
				tableChange: () => {
					this._platformBankAccount()
				},
			},
			platformAccountType: this.$route.query.platformAccountType, //状态 6 — 7.153迭代
			tableColumns183: [
				{
					title: '',
					type: 'custom',
					dataIndex: 'select',
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '开户银行',
				},
				{
					type: 'string',
					dataIndex: 'bankAccountNo',
					title: '银行卡号',
				},
				{
					type: 'string',
					dataIndex: 'bankAccountName',
					title: '开户名称',
				},
			],
			tableColumns7_153: [
				{
					title: '',
					type: 'custom',
					dataIndex: 'select7_153',
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '开户银行',
				},
				{
					type: 'string',
					dataIndex: 'bankNo',
					title: '银行卡号',
				},
				{
					type: 'string',
					dataIndex: 'accountName',
					title: '开户名称',
				},
			],
			tableData183: [],
			dialogVisible183: false,
			dialogBottomBtn183: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.tableData183.forEach((item) => {
							if (
								this.platformAccountType == 6 &&
								item.bankId == this.withdrawData.bankId
							) {
								this.withdrawData.bankAccountName = item.accountName
								this.withdrawData.bankAccountNumber = item.bankNo
								this.withdrawData.bankAccountNo = item.bankNo
								this.withdrawData.bankName = item.bankName
								this.withdrawData.bankSubbranch = item.settleAcctId
								this.withdrawData.accountId = item.accountId
								console.log('1111111111', item)
							} else if (
								item.bankAccountId == this.withdrawData.bankAccountId
							) {
								this.withdrawData.bankAccountName = item.bankAccountName
								this.withdrawData.bankAccountNumber = item.bankAccountNo
								this.withdrawData.bankAccountNo = item.bankAccountNo
								this.withdrawData.bankName = item.bankName
								this.withdrawData.bankSubbranch = item.bankSubbranch
							}
						})
						this.dialogVisible183 = false
					},
				},
			],
			platformWithdrawView: checkFunctionCode('platformWithdrawView'),
			supplierWithdrawView: checkFunctionCode('supplierWithdrawView'),
			showLoading: false,
			dialogVisible: false,
			withdrawData: {
				bankId: '',
				accountId: '',
				accountName: '', // 发起提现账户
				bankAccountName: '',
				bankAccountId: '', // 提现银行卡
				amount: '', // 提现金额
				remark: '', // 提现备注
				type: 2, // 到账方式
				channelType: 1,
				bankAccountNo: '',
				serviceCharge: 0, // 提现手续费
			},
			rules: {
				channelType: [
					{ required: true, message: '请选择提现通道', trigger: 'change' },
				],
				bankAccountNumber: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								(this.platformAccountType == 6 && !this.withdrawData.bankId) ||
								(this.platformAccountType != 6 &&
									!this.withdrawData.bankAccountId)
							) {
								callback(new Error('请选择提现银行卡!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				amount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (value == '') {
								callback(new Error('请输入提现金额!'))
							} else if (
								(this.platformAccountType == 6 && value > 10000000) ||
								(this.platformAccountType != 6 && value > 1000000)
							) {
								callback(
									new Error(
										this.platformAccountType == 6
											? '金额不能大于1000W!'
											: '金额不能大于100W!'
									)
								)
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				remark: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入提现备注!'))
							} else if (value.length > 100) {
								callback(new Error('备注长度不能大于100'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			orderStatus: [],
			gatewayEnable: false,
			searchCfg: [
				{
					type: 'text',
					title: '发起提现账户',
					dataIndex: 'accountName',
					// disabled: true,
				},
				{
					type: 'custom',
					title: '提现银行卡',
					dataIndex: 'bankAccountNumber',
				},
				// {
				// 	type: 'input',
				// 	title: '提现银行卡',
				// 	dataIndex: 'bankAccountNumber',
				// 	disabled: true,
				// },
				{
					type: 'radio',
					title: '提现通道',
					dataIndex: 'channelType',
					options: [
						{
							channelType: 1,
							value: '汇聚支付',
						},
						{
							channelType: 2,
							value: '苏宁银行',
						},
					],
					label: 'value',
				},
				{
					type: 'custom',
					title: '提现金额',
					dataIndex: 'amount',
				},
				{
					type: 'radio',
					title: '到账方式',
					dataIndex: 'type',
					options: this.$store.state.app.constant.HOW_TO_ARRIVE,
					label: 'value',
					change: () => {
						this.aCommission()
					},
				},
				{
					type: 'custom',
					title: '提现手续费',
					dataIndex: 'serviceCharge',
				},
				{
					type: 'textarea',
					title: '提现备注',
					dataIndex: 'remark',
				},
			],
			searchAction: [
				{
					title: '发起',
					type: 'primary',
					click: () => {
						// this.$store.dispatch('tagsView/delVisitedView', )
						this.showDialog()
					},
				},
				{
					title: '取消',
					cancel: true,
					click: () => {
						this.$store
							.dispatch('tagsView/delVisitedView', this.$route)
							.then(() => {
								if (
									this.$route.params.merchantAccountId &&
									this.$route.params.supplierId
								) {
									this.$store
										.dispatch('tagsView/delVisitedView', this.$route)
										.then(() => {
											this.$router.push({
												path: '/fund/merchantAccountList',
											})
										})
								} else {
									this.$store
										.dispatch('tagsView/delVisitedView', this.$route)
										.then(() => {
											this.$router.push({
												path: '/fund/platformAccountList',
											})
										})
								}
							})
					},
				},
			],
		}
	},

	// created() {
	// 	let { merchantAccountId, supplierId } = this.$route.params
	// 	if (merchantAccountId && supplierId) {
	// 		setViewTitle(this.$store, this.$route, null, '商家账户提现') // 设置已访问标题
	// 		this._supplierWithdrawView()
	// 	} else {
	// 		setViewTitle(this.$store, this.$route, null, '平台账户提现') // 设置已访问标题
	// 		this._platformWithdrawView()
	// 	}
	// },
	watch: {
		$route: {
			immediate: true,
			deep: true,
			handler(newValue) {
				if (newValue.name == 'withdraw') {
					this._withdrawSwitch()
					let { merchantAccountId, supplierId } = this.$route.params
					if (merchantAccountId && supplierId) {
						setViewTitle(
							this.$store,
							this.$route,
							null,
							`商家账户提现-${merchantAccountId}-${supplierId}`
						) // 设置已访问标题
						this._supplierWithdrawView()
					} else {
						const { platformAccountType, accountName } = this.$route.query
						this.withdrawData.accountName = accountName
						setViewTitle(
							this.$store,
							this.$route,
							null,
							platformAccountType == 1
								? '账户提现（微革）'
								: platformAccountType == 6
								? '发起提现'
								: '账户提现（推广）'
						) // 设置已访问标题
						this.searchCfg[0].hide = platformAccountType == 6
						this.searchCfg[5].hide = platformAccountType == 6
						// this._platformWithdrawView()
					}
				}
			},
		},
	},

	methods: {
		async _withdrawSwitch() {
			let {
				data: { resultCode, resultData },
			} = await withdrawSwitch({
				developerId: 10001,
				version: '1.0',
				channel: 'JOIN_PAY',
				signType: 'MD5',
				name: 'PAYMENT',
				key: this.$store.state.user.userInfo.userId,
				sign: 'a29c832d825365aba30267d0c6209156',
			})
			if (resultCode == 0) {
				this.gatewayEnable = resultData.value == 'ENABLE'
			}
		},
		aCommission() {
			// 设置手续费
			let serviceCharge = 2
			// if (this.withdrawData.type == 1) {
			// 	// t+1
			// 	serviceCharge = Math.abs(this.withdrawData.amount) * 0.0003
			// 	if (serviceCharge < 0.01) {
			// 		serviceCharge = 0
			// 	} else {
			// 		serviceCharge = serviceCharge.toFixed(2)
			// 		serviceCharge = Math.round(serviceCharge * 100) / 100
			// 	}
			// 	serviceCharge += 2
			// }
			serviceCharge = numberFormat(serviceCharge)
			this.withdrawData.serviceCharge = Math.abs(this.withdrawData.amount)
				? serviceCharge
				: 0
		},
		// aCommission() {
		// 	let serviceCharge = 0
		// 	serviceCharge = this.withdrawData.amount * 0.0003
		// 	if (serviceCharge < 0.01) {
		// 		serviceCharge = 0.01
		// 	} else {
		// 		serviceCharge = serviceCharge.toFixed(2)
		// 		serviceCharge = Math.round(serviceCharge * 100) / 100
		// 	}
		// 	this.withdrawData.serviceCharge = serviceCharge
		// },
		_platformWithdrawView: async function () {
			if (!this.platformWithdrawView) return
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await platformWithdrawView()
			this.showLoading = false
			if (resultCode == 0) {
				// this.withdrawData = resultData
				resultData.accountName = resultData.bankAccountName || ''
				this.withdrawData = Object.assign(resultData, {
					amount: '', // 提现金额
					remark: '', // 提现备注
					type: 1, // 到账方式
					withdrawType: 11,
					serviceCharge: 0,
					merchantAccountId: this.$route.params.merchantAccountId,
					supplierId: this.$route.params.supplierId,
				})
			}
		},
		_supplierWithdrawView: async function () {
			if (!this.supplierWithdrawView) return
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await supplierWithdrawView({
				merchantAccountId: this.$route.params.merchantAccountId,
				supplierId: this.$route.params.supplierId,
			})
			this.showLoading = false
			if (resultCode == 0) {
				// this.withdrawData = resultData
				this.withdrawData = Object.assign(resultData, {
					amount: '', // 提现金额
					remark: '', // 提现备注
					type: 1, // 到账方式
					withdrawType: 12,
					serviceCharge: 0,
					merchantAccountId: this.$route.params.merchantAccountId,
					supplierId: this.$route.params.supplierId,
				})
			}
		},
		selectSupplier(e) {
			e.target.blur()
			this.dialogVisible183 = true
			this._platformBankAccount(true)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				startIndex: 0,
				length: 100,
				accountId: this.accountId,
			}
			// 每页的加载数据长度
			paramJson.length = this.page183.length
			// 当前页的条数开始
			if (flag) {
				this.page183.currentPage = 1
			}
			paramJson.startIndex =
				(this.page183.currentPage - 1) * this.page183.length
			return paramJson
		},
		_platformBankAccount: async function (flag) {
			this.loading183 = true
			let paramJson = this.findSearchParams(flag)
			let Url =
				this.platformAccountType == 6 ? withdrawPageBank : platformBankAccount
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson)
			this.loading183 = false
			if (resultCode == 0) {
				this.tableData183 =
					this.platformAccountType == 6 ? resultData.records : resultData
				// this.page183.count = resultData.total
			} else {
				this.tableData183 = []
				// this.page183.count = 0
			}
		},
		showDialog() {
			this.withdrawData = Object.assign(this.withdrawData, {
				arrivalType: getConstantValueByKey(
					this.$store.state.app.constant.HOW_TO_ARRIVE,
					this.withdrawData.type,
					'-',
					'type'
				),
			})
			console.log('this.withdrawData>>>.', this.withdrawData)
			this.dialogVisible = true
		},
	},
}
</script>

<style scoped lang="scss">
.amount-box {
	display: flex;
	span {
		width: 300px;
		margin-left: 40px;
	}
}
</style>
