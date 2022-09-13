<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane
				:disabled="this.params.openAccountSn"
				label="对公银行卡"
				name="public"
			>
				<public-box :infoData.sync="infoData"></public-box>
			</el-tab-pane>
			<el-tab-pane
				:disabled="this.params.openAccountSn"
				label="个人银行卡"
				name="personal"
			>
				<personal :infoData.sync="infoData"></personal>
			</el-tab-pane>
		</el-tabs>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import personal from './components/personal'
import publicBox from './components/public'
import { getSuningAccountInfo } from '@/api/accountService'
import { setViewTitle } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		personal,
		publicBox,
	},
	data() {
		return {
			activeName: 'public',
			params: this.$route.params,
			infoData: {},
		}
	},
	created() {
		if (this.params.openAccountSn != '1' && this.params.openAccountSn != '2') {
			this._getDetailByPlatform()
		}
		if (!this.params.accountBankInfoId && this.params.openAccountSn === '1') {
			this.activeName = 'public'
		}
		if (!this.params.accountBankInfoId && this.params.openAccountSn === '2') {
			this.activeName = 'personal'
		}
		if (this.params.openAccountSn == '1' || this.params.openAccountSn == '2') {
			setViewTitle(this.$store, this.$route, null, '新增提现账户')
		} else if (this.params.skipType == 'platformCheck') {
			// this.$route.meta.title = `新增提现账户`
			setViewTitle(this.$store, this.$route, null, '查看提现账户详情')
		} else if (this.params.skipType == 'supplier') {
			setViewTitle(this.$store, this.$route, null, '查看商家提现账户详情')
		} else {
			setViewTitle(this.$store, this.$route, null, '修改提现账户')
		}
	},
	methods: {
		async _getDetailByPlatform() {
			let {
				data: { resultCode, resultData },
			} = await getSuningAccountInfo(this.params)
			if (resultCode == 0) {
				this.infoData = resultData
				if (!resultData.toPublicBankAccount) {
					this.activeName = 'personal'
				}
			}
		},
	},
}
</script>

<style></style>
