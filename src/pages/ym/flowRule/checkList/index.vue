<template>
	<basic-container>
		<el-tabs
			v-if="rcAuthAccount.accountType"
			v-model="activeName"
			type="card"
			@tab-click="handleClick"
		>
			<el-tab-pane label="待审核" name="toCheck" lazy>
				<form-table name="toCheck"></form-table>
			</el-tab-pane>
			<el-tab-pane label="已审核" name="checked" lazy>
				<form-table name="checked"></form-table>
			</el-tab-pane>
		</el-tabs>
		<el-divider v-else>没有操作权限，请联系管理员！</el-divider>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import FormTable from './components/FormTable'
export default {
	name: 'checkList',
	components: { BasicContainer, FormTable },
	data() {
		return {
			rcAuthAccount: this.$store.state.user.rcAuthAccount, //流量规则平台授权账户信息
			activeName: 'toCheck',
		}
	},
	methods: {
		handleClick(tab) {
			this.activeName = tab.name
		},
	},
}
</script>
