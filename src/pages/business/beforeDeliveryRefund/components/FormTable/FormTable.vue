<template>
	<div class="SearchKeyword">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>
			<yx-table
				:select="false"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
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
	queryMerchantRefundList,
	merchantRefundSwitchChange,
} from '@/api/business'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			formData: {
				supplierId: '', //商家id
				supplierName: '', //商家名称
				autoState: '', //发货前秒退服务状态
			},
			formCfg: [
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
					title: '发货前秒退服务状态',
					type: 'select',
					dataIndex: 'autoState',
					label: 'value',
					options: [
						{
							autoState: '',
							value: '全部',
						},
						{
							autoState: '1',
							value: '开启',
						},
						{
							autoState: '0',
							value: '关闭',
						},
					],
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					title: '发货前秒退服务状态',
					type: 'string',
					dataIndex: 'autoState',
					customRender: (row) => {
						const arr = ['关闭', '开启']
						return arr[row.autoState] || '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '开启',
							auth: 'isAutoStateSwitchOperation',
							click: (row) => {
								this.$confirm(
									row.autoState == 1
										? ' 关闭后，该商家仅退款售后单，不会触发未发货前自动退款 '
										: '开启后，用户申请仅退款售后且该订单未发货，则自动退款给用户',
									row.autoState == 1
										? '确认关闭发货前秒退服务？'
										: '确认开启发货前秒退服务？',
									{
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
									}
								)
									.then(() => {
										this.handleMerchantRefund(row)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消',
										})
									})
							},
							customRender: (action, row) => {
								action.title = row.autoState == 1 ? '关闭' : '开启'
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData()
				},
			},
		}
	},
	mounted() {
		this.getData()
	},
	methods: {
		async handleMerchantRefund(row) {
			let params = {
				supplierId: row.supplierId,
				supplierName: row.supplierName,
				autoState: row.autoState,
			}
			if (row.autoState == 0) {
				params.autoState = 1
			} else if (row.autoState == 1) {
				params.autoState = 0
			}
			const {
				data: { resultCode },
			} = await merchantRefundSwitchChange(params)
			if (resultCode == 0) {
				this.$message({
					message: `操作成功!`,
					type: 'success',
				})
				this.getData()
			}
		},
		// 查询列表
		async getData(flag) {
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData, total },
			} = await queryMerchantRefundList(paramJson)
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.count = total
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
	},
}
</script>
<style></style>
