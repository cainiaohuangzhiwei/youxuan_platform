<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="素材应用设置" name="material" lazy>
				<material-form-table name="toCheck"></material-form-table>
			</el-tab-pane>
			<el-tab-pane label="分类设置" name="class" lazy>
				<class-form-table name="checked"></class-form-table>
			</el-tab-pane>
		</el-tabs>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import MaterialFormTable from './components/MaterialFormTable'
import ClassFormTable from './components/ClassFormTable'
export default {
	name: 'applicationMaterial',
	components: { BasicContainer, MaterialFormTable, ClassFormTable },
	data() {
		return {
			activeName: 'material',
		}
	},
	methods: {
		handleClick(tab) {
			this.activeName = tab.name
		},
	},
}
</script>
