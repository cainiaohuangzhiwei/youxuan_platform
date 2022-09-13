<template>
	<yx-dialog width="600px" :visible.sync="visible" :bottomBtn="bottomBtn">
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
import { checkFinancePassWord } from '@/api/yhtPlusCmsFinance'
import { doWithdraw } from '@/api/yhtPlusCmsFinance'
import { digitUppercase } from '@/utils/helper/common'
import { getPublicKeyAndModel } from '@/api/webUser.js'
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
					dataIndex: 'withdrawText',
					title: '提现类型',
				},
				{
					type: 'text',
					dataIndex: 'accountNameAndNumber',
					title: '提现账号',
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
					dataIndex: 'remark',
					title: '备注',
				},
			],
		}
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
		_doWithdraw: async function () {
			let paramJson = {
				organizationId: 0,
				type: this.$route.params.withdrawType,
				arrivalType: this.withdrawData.arrivalType,
				bankAccountId: this.withdrawData.bankAccountId,
				amount: this.withdrawData.amount,
				serviceCharge: this.withdrawData.serviceCharge,
				remark: this.withdrawData.remark,
				gatewayEnable: this.gatewayEnable,
			}
			let {
				data: { resultCode, resultMsg },
			} = await doWithdraw(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.visible = false
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/finance/financeDetails',
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
				let {
					data: { resultCode },
				} = await checkFinancePassWord(
					await this.getRSAPassword({
						password: value,
					})
				)
				if (resultCode == 0) {
					this._doWithdraw()
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
