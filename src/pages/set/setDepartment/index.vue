<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="员工账号" name="staffAccountTabTitle">
				<span slot="label">员工账号</span>
				<staffAccountTabTitle ref="staffAccountTabTitle"></staffAccountTabTitle>
			</el-tab-pane>
			<el-tab-pane label="部门设置" name="departmentSetTabTitle">
				<span slot="label">部门设置</span>
				<departmentSetTabTitle
					ref="departmentSetTabTitle"
				></departmentSetTabTitle>
			</el-tab-pane>
			<el-tab-pane label="角色权限设置" name="permissionSetTabTitle">
				<span slot="label">角色权限设置</span>
				<permissionSetTabTitle
					ref="permissionSetTabTitle"
				></permissionSetTabTitle>
			</el-tab-pane>
			<el-tab-pane label="权限专项" name="transformPermission">
				<span slot="label">权限专项</span>
				<transformPermission ref="transformPermission"></transformPermission>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import staffAccountTabTitle from './components/staffAccountTabTitle'
import departmentSetTabTitle from './components/departmentSetTabTitle'
import permissionSetTabTitle from './components/permissionSetTabTitle'
import transformPermission from './components/transformPermission'

export default {
	components: {
		BasicContainer,
		staffAccountTabTitle,
		departmentSetTabTitle,
		permissionSetTabTitle,
		transformPermission,
	},
	data() {
		return {
			activeName: 'staffAccountTabTitle',
			goodsConfiguration: {},
		}
	},
	created() {
		this.$nextTick(() => {
			this.$refs.staffAccountTabTitle.init()
		})
	},
	methods: {
		handleClick({ name }) {
			if (!this.$refs[name].isShow) {
				this.$refs[name].init(true)
			}
		},
	},
}
</script>
