<template>
	<basic-container>
		<el-tabs
			v-if="rcAuthAccount.accountType == 3"
			v-model="activeName"
			type="card"
			@tab-click="handleClick"
		>
			<el-tab-pane label="排序算法" name="sort" lazy>
				<form-table name="sort"></form-table>
			</el-tab-pane>
			<el-tab-pane label="召回服务" name="recall" lazy>
				<form-table name="recall"></form-table>
			</el-tab-pane>
			<el-tab-pane label="数据源管理" name="source" lazy>
				<form-table name="source"></form-table>
			</el-tab-pane>
			<el-tab-pane label="商城场景管理" name="scene" lazy>
				<form-table name="scene"></form-table>
			</el-tab-pane>
			<el-tab-pane label="搜索服务管理" name="search" lazy>
				<form-table name="search"></form-table>
			</el-tab-pane>
			<el-tab-pane label="流量分发管理" name="traffic" lazy>
				<TrafficManageTab />
			</el-tab-pane>
		</el-tabs>

		<el-divider v-else>没有操作权限，请联系管理员！</el-divider>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import FormTable from './components/FormTable'
import TrafficManageTab from './components/TrafficManageTab'
export default {
	name: 'metaData1',
	components: { BasicContainer, FormTable, TrafficManageTab },
	data() {
		return {
			activeName: 'sort',
			rcAuthAccount: this.$store.state.user.rcAuthAccount, //流量规则平台授权账户信息
		}
	},
	methods: {
		handleClick(tab) {
			this.activeName = tab.name
		},
	},
}
</script>
