<template>
	<yx-dialog title="" :visible.sync="visible" :bottomBtn="bottomBtn">
		<yx-form labelWidth="100px" :data.sync="withdrawData" :items="dialogCfg">
			<template slot="amount">
				<div class="withdrawal_amount">
					<span>￥{{ withdrawData.amount }}</span>
					<span>人民币{{ digitUppercase(withdrawData.amount) }}</span>
				</div>
			</template>
			<template slot="serviceCharge">
				<div class="withdrawal_amount">
					<span>￥{{ withdrawData.serviceCharge }}</span>
					<span>人民币{{ digitUppercase(withdrawData.serviceCharge) }}</span>
				</div>
			</template>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import {
	doPlatformWithdraw,
	checkFinancePassWord,
} from '@/api/yhtPlusCmsFinance'
import { doSupplierCashOut } from '@/api/cmsSupplier'
import { digitUppercase } from '@/utils/helper/common'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import { weegetAccountApply, promotionAccountApply } from '@/api/accountService'
import { withdrawCreate } from '@/api/weeget-bullet-payment-rest-fors'
import RSA from 'js-rsa-dave'
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
		// 提现信息
		withdrawData: {
			type: Object,
			default: () => ({}),
		},
		gatewayEnable: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			platformAccountType: this.$route.query.platformAccountType,
			digitUppercase: digitUppercase, // 转大小写
			visible: false,
			showLoading: false,
			bottomBtn: [
				{
					title: '确认',
					type: 'primary',
					click: () => {
						this.initiateWithdrawal()
					},
				},
				{
					title: '取消',
					type: 'default',
					click: () => {
						this.visible = false
					},
				},
			],
			dialogCfg: [
				{
					type: 'text',
					dataIndex: 'accountName',
					title: '发起提现账户',
					disabled: true,
				},
				{
					type: 'text',
					dataIndex: 'bankAccountNumber',
					title: '提现银行卡',
					disabled: true,
				},
				{
					type: 'text',
					dataIndex: 'bankAccountName',
					title: '提现账户名',
					disabled: true,
				},
				{
					type: 'text',
					dataIndex: 'bankName',
					title: '开户银行',
					disabled: true,
				},
				// {
				// 	type: 'input',
				// 	dataIndex: 'bankCity',
				// 	title: '银行城市',
				// 	disabled: true,
				// },
				{
					type: 'text',
					dataIndex: 'bankSubbranch',
					title: '开户支行',
					disabled: true,
				},
				{
					type: 'custom',
					dataIndex: 'amount',
					title: '提现金额',
				},
				{
					type: 'custom',
					dataIndex: 'serviceCharge',
					title: '提现手续费',
				},
				{
					type: 'text',
					dataIndex: 'arrivalType',
					title: '到账方式',
					disabled: true,
				},
				{
					type: 'text',
					dataIndex: 'remark',
					title: '提现备注',
					disabled: true,
				},
			],
		}
	},
	created() {
		this.dialogCfg[0].hide = this.platformAccountType == 6
		this.dialogCfg[4].hide = this.platformAccountType == 6
		this.dialogCfg[6].hide = this.platformAccountType == 6

		console.log('99999999', this.platformAccountType)
	},

	methods: {
		async getRSAPassword(paramJson) {
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
		_doSupplierCashOut: async function (psw) {
			// 商家账号提现
			let {
				data: { resultCode, resultMsg },
			} = await doSupplierCashOut({
				amount: this.withdrawData.amount,
				supplierId: this.$route.params.supplierId,
				arrivalType: this.withdrawData.type,
				remark: this.withdrawData.remark,
				psw,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.visible = false
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/fund/merchantAccountList',
						})
					})
			}
		},
		_weegetAccountApply: async function () {
			let {
				data: { resultCode, resultMsg },
			} = await weegetAccountApply({
				type: this.withdrawData.withdrawType,
				arrivalType: this.withdrawData.type,
				bankAccountId: this.withdrawData.bankAccountId,
				amount: this.withdrawData.amount,
				channelType: this.withdrawData.channelType,
				// serviceCharge: this.withdrawData.serviceCharge,
				withdrawRemark: this.withdrawData.remark,
				gatewayEnable: this.gatewayEnable,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.visible = false
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/fund/platformAccountList',
						})
					})
			}
		},
		_promotionAccountApply: async function () {
			let {
				data: { resultCode, resultMsg },
			} = await promotionAccountApply({
				type: this.withdrawData.withdrawType,
				arrivalType: this.withdrawData.type,
				bankAccountId: this.withdrawData.bankAccountId,
				channelType: this.withdrawData.channelType,
				amount: this.withdrawData.amount,
				// serviceCharge: this.withdrawData.serviceCharge,
				withdrawRemark: this.withdrawData.remark,
				// gatewayEnable: this.gatewayEnable,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.visible = false
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/fund/platformAccountList',
						})
					})
			}
		},
		//发起提现
		_withdrawCreate: async function () {
			let paramJson = {
				channelCode:
					this.withdrawData.channelType == 1 ? 'JOIN_PAY' : 'SU_NING', ////支付渠道编码 苏宁:SU_NING 汇聚:JOIN_PAY
				operator: this.$store.state.user.userInfo.nickname,
				withdrawAmount: this.withdrawData.amount,
				withdrawType: this.withdrawData.type == 2 ? 'REAL_TIME' : 'WORKING_DAY', //提现类型：REAL_TIME：实时，WORKING_DAY：T+1
				bankId: this.withdrawData.bankId,
				accountId: this.withdrawData.accountId,
				accounbankNotId: this.withdrawData.bankAccountNo,
				remark: this.withdrawData.remark,
			}

			console.log('入参：', paramJson)
			// return
			let {
				data: { resultCode, resultMsg },
			} = await withdrawCreate(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.visible = false
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/payment/paymentChannelWithdrawalList',
						})
					})
			}
		},
		_doPlatformWithdraw: async function () {
			let {
				data: { resultCode, resultMsg },
			} = await doPlatformWithdraw({
				organizationId: 0,
				type: this.withdrawData.withdrawType,
				arrivalType: this.withdrawData.type,
				bankAccountId: this.withdrawData.bankAccountId,
				amount: this.withdrawData.amount,
				serviceCharge: this.withdrawData.serviceCharge,
				remark: this.withdrawData.remark,
				// gatewayEnable: this.gatewayEnable,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.visible = false
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/fund/platformAccountList',
						})
					})
			}
		},
		initiateWithdrawal() {
			// 发起提现
			this.$prompt('提现密码', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入密码',
				inputType: 'password',
			}).then(async ({ value }) => {
				this.visible = false
				if (
					this.$route.params.merchantAccountId &&
					this.$route.params.supplierId
				) {
					this._doSupplierCashOut(value)
				} else {
					let {
						data: { resultCode },
					} = await checkFinancePassWord(
						await this.getRSAPassword({
							password: value,
						})
					)
					if (resultCode == 0) {
						const { platformAccountType } = this.$route.query
						if (platformAccountType == 1) {
							// 微革账户
							this._weegetAccountApply()
						} else if (platformAccountType == 6) {
							this._withdrawCreate()
						} else {
							// 推广账户
							this._promotionAccountApply()
						}
						// this._doPlatformWithdraw()
					}
				}
			})
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
		},
	},
}
</script>

<style lang="scss" scoped>
.withdrawal_amount span {
	margin-right: 20px;
}
</style>
