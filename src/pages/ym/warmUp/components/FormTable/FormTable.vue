<template>
	<basic-container>
		<div class="warmList">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="预热配置" name="preheatingTab">
					<preheating-tab ref="preheatingTab"></preheating-tab>
				</el-tab-pane>
				<el-tab-pane label="数据分析" name="dataAnalysis">
					<dataAnalysis-tab ref="dataAnalysis"></dataAnalysis-tab>
				</el-tab-pane>
			</el-tabs>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import preheatingTab from './preheatingTab'
import dataAnalysisTab from './dataAnalysisTab'

export default {
	components: {
		BasicContainer,
		preheatingTab,
		dataAnalysisTab,
		// YxForm,
		// YxTable,
		// editTestDialog,
	},
	name: 'FormTable',
	data() {
		return {
			activeName: 'preheatingTab',
		}
	},
	methods: {
		handleClick({ name }) {
			if (this.$refs[name].init) {
				this.$refs[name].init()
			}
		},
	},
}
</script>

<style>
.warmList .el-table .cell {
	white-space: pre-wrap;
}
</style>
