<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane
				v-auth="'listSuningWithdrawAccountPlaform'"
				label="平台提现账户"
				name="platform"
			>
				<platform ref="platform"></platform>
			</el-tab-pane>
			<el-tab-pane
				v-auth="'listSuningWithdrawAccountMerchant'"
				label="商家提现账户"
				name="supply"
			>
				<supply ref="supply"></supply>
			</el-tab-pane>
		</el-tabs>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import platform from './components/platform'
import supply from './components/supply'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		BasicContainer,
		platform,
		supply,
	},
	data() {
		return {
			activeName: 'platform',
			listSuningWithdrawAccountPlaform: checkFunctionCode(
				'listSuningWithdrawAccountPlaform'
			),
		}
	},
	created() {
		this.activeName = this.listSuningWithdrawAccountPlaform
			? 'platform'
			: 'supply'
		this.$nextTick(() => {
			this.$refs[this.activeName]._listPageByPlatform(true)
		})
	},
	methods: {
		handleClick({ name }) {
			this.$refs[name]._listPageByPlatform(true)
		},
	},
}
</script>

<style></style>
