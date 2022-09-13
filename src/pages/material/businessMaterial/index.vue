<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="待审核商家素材" :name="constant.WAIT" lazy>
				<business-material-form-table
					:name="constant.WAIT"
					:activeName="activeName"
				></business-material-form-table>
			</el-tab-pane>
			<el-tab-pane label="已驳回商家素材" :name="constant.REJECT" lazy>
				<business-material-form-table
					:name="constant.REJECT"
					:activeName="activeName"
				></business-material-form-table>
			</el-tab-pane>
			<el-tab-pane label="已入库商家素材" :name="constant.SUCCESS" lazy>
				<business-material-form-table
					:name="constant.SUCCESS"
					:activeName="activeName"
				></business-material-form-table>
			</el-tab-pane>
		</el-tabs>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import BusinessMaterialFormTable from './components/BusinessMaterialFormTable'
import constant from './constant'

export default {
	name: 'businessMaterial',
	components: { BasicContainer, BusinessMaterialFormTable },
	data() {
		return {
			constant,
			activeName: constant.WAIT,
		}
	},
	methods: {
		handleClick(tab) {
			this.activeName = tab.name
		},
	},
}
</script>
