<template>
	<basicContainer>
		<yx-form
			:inline="true"
			:data="formData105"
			:items="formCfg105"
			:formAction="formAction105"
		>
		</yx-form>
		<yx-table
			:selectionChange="selectionChange"
			:select="true"
			v-loading="loading"
			:columns="tableColumns106"
			:pagination="page106"
			:data="tableData106"
		></yx-table>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getViolationWhitelist,
	violationWhitelistEnable,
} from '@/api/violationWhitelist'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			loading: false,
			tableColumns106: [
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
					dataIndex: 'enable',
					title: '启用状态',
					customRender: ({ enable }) => {
						return enable ? '启用' : '禁用'
					},
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					width: 200,
					actions: [
						{
							title: '启用',
							auth: 'violationWhitelistEnable',
							popconfirm: true,
							popconfirmTitle: '确认要启用该商家吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, { enable }) => {
								action.hide = enable
								return action
							},
							confirm: ({ supplierId }) => {
								this._violationWhitelistEnable([supplierId])
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData106()
				},
			},
			tableData106: [],
			selectList: [],
			formData105: {
				supplierName: '',
				enable: '',
			},
			formCfg105: [
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					type: 'select',
					title: '启用状态',
					dataIndex: 'enable',
					label: 'value',
					options: [
						{
							enable: '',
							value: '全部',
						},
						{
							enable: false,
							value: '禁用',
						},
						{
							enable: true,
							value: '启用',
						},
					],
				},
			],
			formAction105: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData106(true)
					},
				},
				{
					title: '批量启用',
					type: 'success',
					auth: '',
					click: () => {
						let supplierIds = []
						this.selectList.forEach((item) => {
							if (!item.enable) {
								supplierIds.push(item.supplierId)
							}
						})
						if (!supplierIds.length) {
							return this.$message.warning('请勾选还未开启的商家')
						}
						this._violationWhitelistEnable(supplierIds)
					},
				},
			],
		}
	},
	methods: {
		selectionChange(list) {
			this.selectList = list
		},
		async _violationWhitelistEnable(supplierIds) {
			let {
				data: { resultCode, resultData },
			} = await violationWhitelistEnable({ supplierIds })
			if (resultCode == 0) {
				if (resultData.length) {
					this.$message.error(`${resultData.join(',')}启用失败`)
				}
				this.getData106(false)
			}
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			return paramJson
		},
		async getData106(flag) {
			this.loading = true
			let paramJson = this.findSearchParams106(flag)
			const {
				data: { resultCode, resultData },
			} = await getViolationWhitelist(paramJson)
			if (resultCode == 0) {
				this.tableData106 = resultData.recordList
				this.page106.count = resultData.count
			} else {
				this.tableData106 = []
				this.page106.count = 0
			}
			this.loading = false
		},
	},
}
</script>
