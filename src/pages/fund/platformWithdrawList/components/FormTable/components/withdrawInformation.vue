<template>
	<yx-dialog title="提现信息" :visible.sync="visible" :bottomBtn="bottomBtn">
		<yx-form
			v-loading="showLoading"
			labelWidth="100px"
			:data="dialogData"
			:items.sync="dialogCfg"
		>
			<template slot="withdrawSn">
				<div class="withdrawsn-box">
					<div class="withdraw-sn">{{ withdrawData.withdrawSn }}</div>
				</div>
			</template>
			<template slot="accountName" scope="row">
				<div>{{ row.data.accountName }}</div>
			</template>
			<template slot="phone" scope="row">
				<div>{{ row.data.phone }}</div>
			</template>
			<template slot="accountNumber" scope="row">
				<div>{{ row.data.accountNumber }}</div>
			</template>
			<template slot="bankName" scope="row">
				<div>{{ row.data.bankName }}</div>
			</template>
			<template slot="bankSubbranch" scope="row">
				<div>{{ row.data.bankSubbranch }}</div>
			</template>
			<template slot="bankCity" scope="row">
				<div>{{ row.data.bankCity }}</div>
			</template>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { getPlatformBankAccountByFlowWithdrawId } from '@/api/yhtPlusCmsBankAccount'
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
			visible: false,
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.visible = false
					},
				},
			],
			dialogData: {
				userName: '',
			},
			// 代发状态，INIT:待处理，FAIL:失败 SUCCESS:成功
			delegateStatus: {
				INIT: {
					message: '交易待处理',
					type: '',
				},
				FAIL: {
					message: '交易失败',
					type: 'error',
				},
				SUCCESS: {
					message: '交易成功',
					type: 'success',
				},
			},
			dialogCfg: [
				{
					type: 'custom',
					dataIndex: 'withdrawSn',
					title: '交易单号',
				},
				{
					type: 'custom',
					dataIndex: 'accountName',
					title: '账户名',
				},
				{
					type: 'custom',
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'custom',
					dataIndex: 'accountNumber',
					title: '账号',
				},
				{
					type: 'custom',
					dataIndex: 'bankName',
					title: '开户银行',
				},
				{
					type: 'custom',
					dataIndex: 'bankSubbranch',
					title: '开户支行',
				},
				{
					type: 'custom',
					dataIndex: 'bankCity',
					title: '银行城市',
				},
			],
		}
	},
	methods: {
		_getPlatformBankAccountByFlowWithdrawId: async function () {
			// 获取详细信息
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getPlatformBankAccountByFlowWithdrawId({
				id: this.withdrawData.flowWithdrawId,
			})
			if (resultCode == 0) {
				this.dialogData = resultData
			}
			this.showLoading = false
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			if (this.visible) {
				this._getPlatformBankAccountByFlowWithdrawId()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.withdrawsn-box {
	display: flex;
	align-items: center;
	.withdraw-sn {
		margin-right: 20%;
	}
}
</style>
