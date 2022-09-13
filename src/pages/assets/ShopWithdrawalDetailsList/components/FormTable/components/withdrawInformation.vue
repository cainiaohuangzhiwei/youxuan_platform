<template>
	<yx-dialog title="提现信息" :visible.sync="visible" :bottomBtn="bottomBtn">
		<yx-form
			v-loading="showLoading"
			labelWidth="100px"
			:data="dialogData"
			:items.sync="dialogCfg"
		>
			<template slot="withdrawSn" scope="row">
				<div class="withdrawsn-box">
					<div class="withdraw-sn">{{ row.data.withdrawSn }}</div>
					<el-button
						@click="_xinbaoTransQuery"
						v-if="withdrawData.channel == 1 && row.data.withdrawSn"
						type="text"
					>
						查询状态</el-button
					>
					<el-button @click="_singleWithdrawCompenstate" type="text">
						查询提现状态</el-button
					>
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
import {
	getWithdrawItem,
	singleWithdrawCompenstate,
} from '@/api/yhtPlusCmsFinance'
import { xinbaoTransQuery } from '@/api/yuntongPay'
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
		_singleWithdrawCompenstate: async function (e) {
			// 查询佣金宝提现状态
			if (!this.dialogData.withdrawSn) {
				return
			}
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let paramJson = {
				withdrawSn: this.dialogData.withdrawSn,
			}
			let {
				data: { resultMsg, resultCode },
			} = await singleWithdrawCompenstate(paramJson, custom)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		_xinbaoTransQuery: async function (e) {
			// 查询佣金宝提现状态
			if (!this.dialogData.withdrawSn) {
				return
			}
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let paramJson = {
				withdrawSn: this.dialogData.withdrawSn,
			}
			let {
				data: { resultData, resultCode },
			} = await xinbaoTransQuery(paramJson, custom)
			if (resultCode == 0) {
				this.$message({
					message: this.delegateStatus[resultData].message,
					type: this.delegateStatus[resultData].type,
				})
			}
		},
		_getWithdrawItem: async function () {
			// 获取详细信息
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getWithdrawItem({
				flowWithdrawId: this.withdrawData.flowWithdrawId,
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
				this._getWithdrawItem()
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
