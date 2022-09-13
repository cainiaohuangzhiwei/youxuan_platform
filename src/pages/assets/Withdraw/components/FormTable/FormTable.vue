<template>
	<basic-container class="form-box">
		<yx-form
			v-loading="showLoading"
			labelWidth="100px"
			:data.sync="withdrawData"
			:items="searchCfg"
			:rules="rules"
			:formAction="searchAction"
		>
			<template slot="bankAccountId">
				<!-- <el-select
					v-model="bankAccounInfo.accountNameAndNumber"
					multiple
					filterable
					remote
					reserve-keyword
					placeholder="请选择提现账号"
					:remote-method="_getBankAccountListByCondition"
					:loading="loading"
				> -->
				<!-- <el-option
						v-for="item in bankAccountSelectList"
						:key="item.bankAccountId"
						:label="item.accountNameAndNumber"
						:value="item.bankAccountId"
					>
						<el-button @click="bankAccountVisible = true" slot="append"
							>选择</el-button
						>
					</el-option>
				</el-select> -->
				<el-autocomplete
					v-model="autocompleteText"
					placeholder="请输入内容"
					:fetch-suggestions="_getBankAccountListByCondition"
					@select="handleSelect"
					><el-button @click="bankAccountVisible = true" slot="append"
						>选择</el-button
					></el-autocomplete
				>
				<!-- <el-input v-model="bankAccounInfo.accountNameAndNumber" disabled>
					<el-button @click="bankAccountVisible = true" slot="append"
						>选择</el-button
					>
				</el-input> -->
			</template>
			<template slot="amount" slot-scope="scope">
				<div class="amount-box">
					<el-input
						type="number"
						@input="aCommission"
						v-amount="scope.data.amount"
						v-model="withdrawData.amount"
					></el-input>
				</div>
			</template>
			<template slot="serviceCharge">
				<span>{{ numberFormat(withdrawData.serviceCharge, 2) }}</span>
			</template>
		</yx-form>
		<infoDialog
			:dialogVisible.sync="dialogVisible"
			:withdrawData.sync="withdrawData"
			:gatewayEnable.sync="gatewayEnable"
		></infoDialog>
		<bankAccountList
			:bankAccounInfo.sync="bankAccounInfo"
			:dialogVisible.sync="bankAccountVisible"
		></bankAccountList>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import infoDialog from './components/infoDialog'
import {
	findRemainderByType,
	getBankAccountListByCondition,
	withdrawSwitch,
} from '@/api/yhtPlusCmsFinance'
import {
	setViewTitle,
	getConstantValueByKey,
	numberFormat,
} from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
import bankAccountList from './components/bankAccountList'
export default {
	components: {
		BasicContainer,
		YxForm,
		infoDialog,
		bankAccountList,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat,
			platformWithdrawView: checkFunctionCode('platformWithdrawView'),
			supplierWithdrawView: checkFunctionCode('supplierWithdrawView'),
			showLoading: false,
			loading: false,
			dialogVisible: false,
			bankAccountVisible: false,
			autocompleteText: '',
			bankAccounInfo: {},
			withdrawData: {
				withdrawText: '', // 提现类型
				withdrawBalance: 0, // 账户余额
				withdrawBalanceText: 0, // 账户余额
				bankAccountId: '', // 提现账号
				bankAccountNumber: '', // 提现银行卡
				amount: '', // 提现金额
				remark: '', // 提现备注
				arrivalType: 1, // 到账方式
				serviceCharge: 0, // 提现手续费
			},
			rules: {
				amount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							console.log(value, this.withdrawData.withdrawBalance)
							if (value == '') {
								callback(new Error('请输入提现金额!'))
							} else if (value > this.withdrawData.withdrawBalance) {
								callback(new Error('提现金额不可大于可用余额!'))
							} else if (value > 1000000) {
								callback(new Error('金额不能大于100W!'))
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
							} else if (value.length > 25) {
								callback(new Error('备注长度不能大于25'))
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
					title: '类型',
					dataIndex: 'withdrawText',
				},
				{
					type: 'text',
					title: '账户余额',
					dataIndex: 'withdrawBalanceText',
				},
				{
					type: 'custom',
					title: '提现账号',
					dataIndex: 'bankAccountId',
				},
				{
					type: 'custom',
					title: '提现金额',
					dataIndex: 'amount',
				},
				{
					type: 'radio',
					title: '提现方式',
					dataIndex: 'arrivalType',
					options: this.$store.state.app.constant.ARRIVAL_TYPE,
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
					title: '备注',
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
	watch: {
		bankAccounInfo() {
			this.autocompleteText = this.bankAccounInfo.accountNameAndNumber
		},
		$route: {
			immediate: true,
			deep: true,
			handler(newRoute) {
				if (
					newRoute.path.indexOf('/finance/financeWithdraw') != -1 &&
					this.$route.params.withdrawType
				) {
					setViewTitle(
						this.$store,
						this.$route,
						null,
						getConstantValueByKey(
							this.$store.state.app.constant.FINANCE_DETAILS_WITHDRAW_TYPE,
							this.$route.params.withdrawType,
							'-',
							'withdrawType'
						)
					)
					this.withdrawData.withdrawText = getConstantValueByKey(
						this.$store.state.app.constant.FINANCE_DETAILS_WITHDRAW_TYPE,
						this.$route.params.withdrawType,
						'-',
						'withdrawType'
					)
					this._findRemainderByType()
					this._withdrawSwitch()
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
		handleSelect(item) {
			// 选择账号
			this.bankAccounInfo = item
		},
		_getBankAccountListByCondition: async function (queryString, cb) {
			let {
				data: { resultCode, resultData },
			} = await getBankAccountListByCondition({
				accountName: queryString,
				startIndex: 0,
				length: 20,
			})
			if (resultCode == 0) {
				resultData.bankAccountList.map((item) => {
					item.accountNameAndNumber =
						item.bankName + '-' + item.accountName + '-' + item.accountNumber
					item.value =
						item.bankName + '-' + item.accountName + '-' + item.accountNumber
				})
			}
			cb(resultData.bankAccountList || [])
		},
		_findRemainderByType: async function () {
			let {
				data: { resultData = 0, resultCode },
			} = await findRemainderByType({
				type: this.$route.params.withdrawType,
			})
			if (resultCode == 0) {
				this.withdrawData.withdrawBalance = resultData
				this.withdrawData.withdrawBalanceText = numberFormat(resultData, 2)
			}
		},
		aCommission() {
			// 设置手续费
			let serviceCharge = 2
			if (this.withdrawData.arrivalType == 1) {
				// t+1
				serviceCharge = Math.abs(this.withdrawData.amount) * 0.0003
				if (serviceCharge < 0.01) {
					serviceCharge = 0.01
				} else {
					serviceCharge = serviceCharge.toFixed(2)
					serviceCharge = Math.round(serviceCharge * 100) / 100
				}
				serviceCharge += 2
			}
			// serviceCharge = numberFormat(serviceCharge, 2)
			this.withdrawData.serviceCharge = Math.abs(this.withdrawData.amount)
				? serviceCharge
				: 0
		},
		showDialog() {
			if (!this.bankAccounInfo.bankAccountId) {
				return this.$message.warning('请选择提现账号')
			}
			console.log(this.withdrawData)
			if (
				this.withdrawData.amount + this.withdrawData.serviceCharge * 1 >
				this.withdrawData.withdrawBalance
			) {
				let amount =
					Math.round(
						(this.withdrawData.withdrawBalance -
							this.withdrawData.serviceCharge * 1) *
							Math.pow(10, 2)
					) / Math.pow(10, 2)
				return this.$message.warning(`最多可提现${amount}`)
			}
			this.withdrawData = Object.assign(this.withdrawData, this.bankAccounInfo)
			this.dialogVisible = true
		},
	},
}
</script>

<style scoped lang="scss">
.amount-box {
	display: flex;
}
.form-box {
	width: 600px;
}
</style>
