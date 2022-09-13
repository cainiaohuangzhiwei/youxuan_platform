<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		<el-tab-pane label="权益列表" name="equityTab">
			<span slot="label">权益列表</span>
			<equityTab ref="equityTab"></equityTab>
		</el-tab-pane>
		<el-tab-pane label="派发计划" name="sendPlanTab">
			<span slot="label">派发计划</span>
			<sendPlanTab ref="sendPlanTab"></sendPlanTab>
		</el-tab-pane>
		<el-tab-pane label="保费设置" name="premiumSet">
			<span slot="label">保费设置</span>
			<premiumSet ref="premiumSet"></premiumSet>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import equityTab from './components/equityTab'
import sendPlanTab from './components/sendPlanTab'
import premiumSet from './components/premiumSet'
export default {
	name: 'EquityCenter',
	components: {
		equityTab,
		sendPlanTab,
		premiumSet,
	},
	data() {
		return {
			activeName: 'equityTab',
			query: this.$route.query,
		}
	},
	created() {
		this.$nextTick(() => {
			if (!this.query.type) {
				this.$refs.equityTab.init(true)
			} else {
				this.activeName = this.query.type
				this.$refs[this.query.type].init(true)
			}
		})
	},
	methods: {
		handleClick({ name }) {
			if (
				(name == 'equityTab' && !this.$refs[name].tableData108.length) ||
				(name == 'sendPlanTab' && !this.$refs[name].tableData102.length) ||
				(name == 'premiumSet' && !this.$refs[name].tableData101.length)
			) {
				this.$refs[name].init(true)
			}
		},
	},
}
</script>
