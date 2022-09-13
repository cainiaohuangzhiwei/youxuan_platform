<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="礼包列表" name="packageTab">
				<span slot="label">礼包列表</span>
				<packageTab ref="packageTab"></packageTab>
			</el-tab-pane>
			<el-tab-pane label="礼包派发计划" name="planTab">
				<span slot="label">礼包派发计划</span>
				<planTab ref="planTab"></planTab>
			</el-tab-pane>
			<el-tab-pane label="云货礼包" name="giftTab">
				<span slot="label">云货礼包</span>
				<giftTab ref="giftTab"></giftTab>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import packageTab from './components/packageTab'
import planTab from './components/planTab'
import giftTab from './components/giftTab'
export default {
	components: {
		BasicContainer,
		packageTab,
		planTab,
		giftTab,
	},
	data() {
		return {
			activeName: 'packageTab',
			query: this.$route.query,
		}
	},
	created() {
		this.$nextTick(() => {
			if (!this.query.type) {
				this.$refs.packageTab.init(true)
			} else {
				this.activeName = this.query.type
				this.$refs[this.query.type].init(true)
			}
		})
	},
	methods: {
		handleClick({ name }) {
			this.$refs[name].init(true)
		},
	},
}
</script>
