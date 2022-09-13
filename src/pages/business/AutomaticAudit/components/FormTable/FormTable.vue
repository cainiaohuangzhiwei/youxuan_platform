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
				v-loading="loading"
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
	afterSaleAutoAuditConfigList,
	afterSaleAutoAuditConfigCtrl,
} from '@/api/business'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			loading: false,
			formData101: {
				supplierId: '',
				supplierName: '',
				autoState: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '商家ID',
					dataIndex: 'supplierId',
				},
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					title: '自动审核验货',
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
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData102(true)
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
					title: '自动审核验货状态',
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
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '关闭',
							auth: 'afterSaleAutoAuditConfigCtrl',
							click: (row) => {
								this.$confirm(
									'关闭后，该商家将不会进行自动审核及验货',
									'确认关闭自动审核、验货？',
									{
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
									}
								)
									.then(() => {
										this._closeOrOpenCoupon(row)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消关闭',
										})
									})
							},
							customRender: (action, row) => {
								action.hide = row.autoState == 0
								return action
							},
						},
						{
							title: '开启',
							auth: 'afterSaleAutoAuditConfigCtrl',
							click: (row) => {
								this.$confirm(
									'开启后，该商家将会根据现有规则，进行自动审核及验货',
									'确认开启自动审核、验货？',
									{
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
									}
								)
									.then(() => {
										this._closeOrOpenCoupon(row)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消开启',
										})
									})
							},
							customRender: (action, row) => {
								action.hide = row.autoState == 1
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
		async _closeOrOpenCoupon(row) {
			let params = {
				supplierId: row.supplierId,
			}
			if (row.autoState == 0) {
				params.status = 1
			} else if (row.autoState == 1) {
				params.status = 0
			}
			const {
				data: { resultCode },
			} = await afterSaleAutoAuditConfigCtrl(params)
			if (resultCode == 0) {
				this.getData102()
			}
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await afterSaleAutoAuditConfigList(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.records
				this.page102.count = resultData.total
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
