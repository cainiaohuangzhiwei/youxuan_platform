<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane v-if="ruleQueryList" label="权益规则" name="rules">
				<rules ref="rules"></rules>
			</el-tab-pane>
			<el-tab-pane v-if="queryActivityList" label="权益发放" name="discharge">
				<discharge ref="discharge"></discharge>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import rules from './components/rules'
import discharge from './components/discharge'
import { checkFunctionCode } from '@/utils/auth'
export default {
	name: 'ShopEquityConfiguration',
	components: {
		BasicContainer,
		rules,
		discharge,
	},
	data() {
		return {
			activeName: 'rules',
			ruleQueryList: checkFunctionCode('ruleQueryList'),
			queryActivityList: checkFunctionCode('queryActivityList'),
		}
	},
	created() {
		if (!this.levelEquityRules) {
			this.activeName = 'discharge'
		}
	},
	methods: {
		handleClick({ name }) {
			if (name == 'rules') {
				this.$refs[name]._levelEquityRulesPage(true)
			} else if (name == 'discharge') {
				this.$refs[name]._queryActivityList(true)
			}
		},
	},
}
</script>

<style></style>
