<template>
	<div class="public-evaluate-brand-list">
		<basic-container>
			<yx-form
				:inline="true"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>
		</basic-container>
	</div>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getPageSupplierEvaluationList,
	setSupplierEvaluationsaveStatus,
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
			formData: {
				supplierId: '',
				supplierName: '',
				status: '',
			},
			formCfg: [
				{
					type: 'input',
					title: '商家ID',
					dataIndex: 'supplierId',
					enter: () => {
						if (!this.loading) this.getData(true)
					},
				},
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					type: 'select',
					title: '商家评价公开状态',
					dataIndex: 'status',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData(true)
					},
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 0,
							value: '未公开',
						},
						{
							status: 1,
							value: '公开',
						},
					],
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData(true)
					},
				},
			],
			tableData: [],
			// 表格列设置
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
					type: 'string',
					dataIndex: 'status',
					title: '商品评价公开状态',
					customRender: (row) => {
						const statusMap = ['未公开', '公开']
						return statusMap[row.status]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '',
							popconfirm: true,
							popconfirmTitle: '确认要操作吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								action.title = row.status === 0 ? '启用' : '禁用'
								action.popconfirmTitle =
									row.status === 0 ? '确认要启用吗' : '确认要禁用吗'
								return action
							},
							auth: 'publicEvaluateBrandUpdateSatatus',
							confirm: (row) => {
								this.handleStatus(row.status === 0 ? 1 : 0, row.supplierId)
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

	created() {
		this.getData()
	},

	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					currentPage: this.page.currentPage,
					length: this.page.length,
				},
				this.formData
			)
			return paramJson
		},
		async getData(flag) {
			this.loading = true
			const paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await getPageSupplierEvaluationList(paramJson)
			if (resultCode === 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			}
			this.loading = false
		},
		// 更新状态
		async handleStatus(type, supplierId) {
			if (!supplierId) {
				this.$message.warning('商家ID不能为空')
				return
			}
			const {
				data: { resultCode },
			} = await setSupplierEvaluationsaveStatus({
				status: type,
				supplierId: supplierId,
			})
			if (resultCode === 0) {
				this.$message.success(`${type === 0 ? '禁用' : '启用'}成功`)
				this.getData()
			}
		},
	},
}
</script>
