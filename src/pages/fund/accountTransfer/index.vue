<template>
	<basic-container>
		<h2>转出账户</h2>
		<div class="info-box">
			<span class="title">账户名称</span>
			<el-input
				class="account-name"
				v-model="accountInfo.payerAccountName"
			></el-input>
			<el-button @click="_accountQuery(1)" type="primary">查询</el-button>
			<p v-if="accountInfo.payerAccountId">
				账户号{{ accountInfo.payerAccountId }}
			</p>
		</div>
		<h2>转入账户</h2>
		<div class="info-box">
			<span class="title">账户名称</span>
			<el-input
				class="account-name"
				v-model="accountInfo.payeeAccountName"
			></el-input>
			<el-button @click="_accountQuery(2)" type="primary">查询</el-button>
			<p v-if="accountInfo.payeeAccountId">
				账户号{{ accountInfo.payeeAccountId }}
			</p>
		</div>
		<h2>转账</h2>
		<div class="info-box">
			<span class="title">转账金额</span>
			<el-input
				class="account-name"
				oninput="value=value.replace(/[^0-9.]/g,'')"
				v-amount="tradeAmount"
				v-model="tradeAmount"
			></el-input>
			<span>（单次操作最高不超过1000万）</span>
		</div>
		<div class="remark-box">
			<span class="title">备注</span>
			<el-input
				class="account-name"
				type="textarea"
				v-model="remark"
				show-word-limit
				:autosize="{ minRows: 6, maxRows: 6 }"
				maxlength="32"
			></el-input>
		</div>
		<div class="footer">
			<el-button class="button" @click="cancel">取消</el-button>
			<el-button class="button" @click="submit" type="primary">确定</el-button>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import {
	transferInfoCreate,
	accountQuery,
} from '@/api/weeget-bullet-payment-rest-fors'
export default {
	components: {
		BasicContainer,
	},
	data() {
		return {
			// 账户信息
			accountInfo: {
				// 出账账户名称
				payerAccountName: '',
				// 出账账户id
				payerAccountId: '',
				// 入账账户名称
				payeeAccountName: '',
				// 入账账户id
				payeeAccountId: '',
			},
			// 转账金额
			tradeAmount: '',
			// 转账备注
			remark: '',
		}
	},
	methods: {
		// 查询账户id
		async _accountQuery(type) {
			// type 1 出账账户  2 入账账户
			let accountName =
				type == 1
					? this.accountInfo.payerAccountName
					: this.accountInfo.payeeAccountName
			if (!accountName) {
				return this.$message.warning('请输入账户名称')
			}
			let {
				data: { resultData },
			} = await accountQuery({
				channelCode: 'SU_NING',
				accountName: accountName,
			})
			if (type == 1) {
				this.accountInfo.payerAccountId = resultData.accountId || ''
			} else {
				this.accountInfo.payeeAccountId = resultData.accountId || ''
			}
		},
		// 取消返回上一个页面
		cancel() {
			this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
				this.$router.push({
					path: '/fund/accountTransferRecord',
				})
			})
		},
		// 发起转账
		submit() {
			if (!this.accountInfo.payerAccountId) {
				return this.$message.warning('请输入转出账户')
			}
			if (!this.accountInfo.payeeAccountId) {
				return this.$message.warning('请输入转入账户')
			}
			if (this.accountInfo.payerAccountId == this.accountInfo.payeeAccountId) {
				return this.$message.warning('转入转出账户不能相同')
			}
			if (!this.tradeAmount) {
				return this.$message.warning('请输入转账金额')
			}
			if (this.tradeAmount > 10000000) {
				return this.$message.warning('单次操作最高不超过1000万')
			}
			if (!this.remark) {
				return this.$message.warning('请输入备注')
			}
			const h = this.$createElement
			this.$msgbox({
				title: '提示',
				message: h('div', [
					h('p', `转出账户名称：${this.accountInfo.payerAccountName}`),
					h('p', `转出账户号：${this.accountInfo.payerAccountId}`),
					h('p', `转入账户名称：${this.accountInfo.payeeAccountName}`),
					h('p', `转入账户号：${this.accountInfo.payeeAccountId}`),
					h('p', `转账金额：${this.tradeAmount}元`),
					h('p', `备注：${this.remark}`),
					h('p', '是否确定转账？'),
				]),
				showCancelButton: false,
				confirmButtonText: '确定',
			}).then(async (action) => {
				if (action == 'confirm') {
					let {
						data: { resultCode },
					} = await transferInfoCreate({
						// 出账账户id
						payerAccountId: this.accountInfo.payerAccountId,
						// 入账账户id
						payeeAccountId: this.accountInfo.payeeAccountId,
						// 转账金额
						tradeAmount: this.tradeAmount,
						// 转账备注
						remark: this.remark,
						// 操作人
						optUsername: this.$store.state.user.userInfo.clerkName,
						channelCode: 'SU_NING',
					})
					if (resultCode == 0) {
						this.cancel()
					}
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.info-box {
	display: flex;
	align-items: center;
	p {
		margin-left: 100px;
	}
}
.account-name {
	width: 300px;
	margin: 0 20px;
}
.remark-box {
	display: flex;
	margin-top: 40px;
}
.title {
	width: 60px;
}
.footer {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 120px;
	.button {
		margin: 0 20px;
	}
}
</style>
