<template>
	<basic-container>
		<div>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="内容管理" name="contentManagement">
					<content-management></content-management>
				</el-tab-pane>
				<el-tab-pane label="内容分类" name="contentClassification">
					<content-classification></content-classification>
				</el-tab-pane>
			</el-tabs>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import ContentManagement from './ContentManagement'
import ContentClassification from './ContentClassification'

export default {
	components: {
		BasicContainer,
		ContentManagement,
		ContentClassification,
	},
	name: 'FormTable',

	data() {
		return {
			activeName: 'contentManagement',
		}
	},

	methods: {},
}
</script>
