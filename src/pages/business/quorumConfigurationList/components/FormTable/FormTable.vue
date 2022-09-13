<template>
	<div class="SearchKeyword">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="false"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	afterSalesSupplierArbitrateConfigPage,
	updateArbitrationConfig,
} from '@/api/afterSales'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			formData101: {
				supplierId: '',
				supplierName: '',
				arbitrateState: '',
			},
			formCfg101: [
				{
					type: 'inputNumber',
					title: '商家ID',
					dataIndex: 'supplierId',
				},
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					title: '售后转仲裁状态',
					type: 'select',
					dataIndex: 'arbitrateState',
					label: 'value',
					options: [
						{
							arbitrateState: '',
							value: '全部',
						},
						{
							arbitrateState: '1',
							value: '开启',
						},
						{
							arbitrateState: '0',
							value: '关闭',
						},
					],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData102(true)
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
					width: '180',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
					width: '180',
				},
				{
					title: '售后转仲裁状态',
					type: 'string',
					dataIndex: 'arbitrateState',
					customRender: (row) => {
						const arr = ['关闭', '开启']
						return arr[row.arbitrateState] || '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '开启',
							auth: 'updateArbitrationConfig',
							click: (row) => {
								this.$confirm(
									row.arbitrateState == 1
										? ' 关闭后，该商家后续售后单将不会走售后转仲裁流程 '
										: '开启后，该商家后续售后单将会走售后转仲裁的流程',
									row.arbitrateState == 1
										? '确认关闭售后转仲裁？'
										: '确认开启售后转仲裁？',
									{
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
									}
								)
									.then(() => {
										this._cupdateArbitrationConfig(row)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消',
										})
									})
							},
							customRender: (action, row) => {
								action.title = row.arbitrateState == 1 ? '关闭' : '开启'
								return action
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},
	mounted() {
		this.getData102()
	},
	methods: {
		async _cupdateArbitrationConfig(row) {
			let params = {
				supplierId: row.supplierId,
				id: row.id,
				operatorName: this.$store.state.user.userInfo.userName,
				operatorId: this.$store.state.user.userInfo.userId,
			}
			if (row.arbitrateState == 0) {
				params.arbitrateState = 1
			} else if (row.arbitrateState == 1) {
				params.arbitrateState = 0
			}
			const {
				data: { resultCode },
			} = await updateArbitrationConfig(params)
			if (resultCode == 0) {
				this.$message({
					message: `流转成功!`,
					type: 'success',
				})
				this.getData102()
			}
		},
		async getData102(flag) {
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await afterSalesSupplierArbitrateConfigPage(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.records
				this.page102.count = resultData.total
			}
		},
		findSearchParams102(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData101, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page102.length
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			paramJson.pageNum = this.page102.currentPage
			return paramJson
		},
	},
}
</script>
<style></style>
