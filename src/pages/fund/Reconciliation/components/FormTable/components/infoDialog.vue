<template>
	<yx-dialog
		width="600px"
		title=""
		:visible.sync="visible"
		:bottomBtn="bottomBtn"
	>
		<yx-form labelWidth="100px" :data.sync="withdrawData" :items="dialogCfg">
			<template slot="amount">
				<div class="withdrawal_amount">
					<span>￥{{ withdrawData.amount }}</span>
					<span>人民币{{ digitUppercase(withdrawData.amount) }}</span>
				</div>
			</template>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { checkFinancePassWord } from '@/api/yhtPlusCmsFinance'
import { digitUppercase } from '@/utils/helper/common'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import { marketingAccountRegulation } from '@/api/platformAccount'
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
					dataIndex: 'accountName',
					title: '调账账户',
					disabled: true,
				},
				{
					type: 'text',
					dataIndex: 'regulationTypeString',
					title: '调账类型',
					disabled: true,
				},
				{
					type: 'custom',
					dataIndex: 'amount',
					title: '调账金额',
				},
				{
					type: 'text',
					dataIndex: 'remark',
					title: '调账备注',
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
		_marketingAccountRegulation: async function () {
			// 调账
			let {
				data: {
					resultCode,
					resultData: { isDeduct = false },
				},
			} = await marketingAccountRegulation({
				amount: this.withdrawData.amount,
				accountId: this.$route.params.accountId,
				regulationType: this.withdrawData.regulationType,
				remark: this.withdrawData.remark,
				userName: this.$store.state.user.userInfo.clerkName,
			})
			if (resultCode == 0) {
				if (isDeduct) {
					this.$message.success('调账成功')
					this.visible = false
					this.$emit('updateWithdrawData')
					this.$store
						.dispatch('tagsView/delVisitedView', this.$route)
						.then(() => {
							this.$router.push({
								path: '/fund/platformAccountList',
							})
						})
				} else {
					this.$message.error('调账失败')
				}
			}
		},
		initiateWithdrawal() {
			// 发起提现
			this.$prompt('操作密码', '', {
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
					this._marketingAccountRegulation()
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
