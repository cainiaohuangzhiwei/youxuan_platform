<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="常见问题" name="issueTab">
				<span slot="label">常见问题</span>
				<issue-tab ref="issueTab"></issue-tab>
			</el-tab-pane>
			<el-tab-pane label="问题类别" name="issueTypeTab">
				<span slot="label">问题类别</span>
				<issue-type-tab ref="issueTypeTab"></issue-type-tab
			></el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import issueTab from './components/issueTab'
import issueTypeTab from './components/issueTypeTab'
export default {
	components: {
		BasicContainer,
		issueTab,
		issueTypeTab,
	},
	data() {
		return {
			activeName: 'issueTab',
		}
	},
	created() {
		this.$nextTick(() => {
			this.$refs.issueTab.init(true)
		})
	},
	methods: {
		handleClick({ name }) {
			if (this.$refs[name] && !this.$refs[name].isShow) {
				this.$refs[name].init(true)
			}
		},
	},
}
</script>
