<template>
	<div class="xcxImgList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData181"
				:items="formCfg181"
				:formAction="formAction181"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:select="false"
				:columns="tableColumns182"
				:pagination="page182"
				:data="tableData182"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { listFors, updateTaxType } from '@/api/taxAdministration'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData181: {
				organizationId: '',
			},
			formCfg181: [
				{
					type: 'inputNumber',
					title: '店主ID',
					dataIndex: 'organizationId',
					placeholder: '请输入店主ID',
				},
			],
			formAction181: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getListFors(true)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '导入店主身份',
					type: 'primary',
					auth: 'accOrganizationTaxIdentityImport',
					click: () => {
						this.$router.push({
							path: `SupplierCommissionAgentImport`,
						})
					},
				},
			],
			tableData182: [],
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'newMap',
					dataIndex: 'taxType',
					title: '店主身份',
					options: [
						['1', '代办'],
						['2', '非代办'],
						['0', '普通店主'],
					],
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'updateTime',
					title: '操作时间',
					customRender: (row) => {
						return row.updateTime
							? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '设置为非代办店主',
							auth: 'accOrganizationTaxIdentityUpdateTaxType',
							click: (row) => {
								let title =
									row.taxType == 1
										? '确定设置为非代办店主？'
										: '确定设置为代办店主？'
								this.$confirm(title, '提示', {
									type: 'warning',
									callback: async (action) => {
										if (action === 'confirm') {
											if (row.taxType == 1) {
												this._uploadTaxType(row, 2)
											} else {
												this._uploadTaxType(row, 1)
											}
										}
									},
								})
							},
							customRender: (action, row) => {
								action.title =
									row.taxType == 1 ? '设置为非代办店主' : '设置为代办店主'
								return action
							},
						},
						{
							title: '设置为普通店主',
							auth: 'accOrganizationTaxIdentityUpdateTaxType',
							click: (row) => {
								this.$confirm('确定设置为普通店主？', '提示', {
									type: 'warning',
									callback: async (action) => {
										if (action === 'confirm') {
											this._uploadTaxType(row, 0)
										}
									},
								})
							},
						},
					],
				},
			],
			page182: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getListFors()
				},
			},
		}
	},

	created() {
		this._getListFors()
	},

	methods: {
		_uploadTaxType: async function (row, type) {
			// 更新店主身份
			this.loading = true
			let paramJson = {
				accOrganizationTaxIdentityId: row.accOrganizationTaxIdentityId,
				organizationId: row.organizationId,
				taxType: type,
			}
			const {
				data: { resultCode },
			} = await updateTaxType(paramJson)
			if (resultCode == 0) {
				this._getListFors()
			}
			this.loading = false
		},
		_getListFors: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await listFors(paramJson)
			if (resultCode == 0) {
				this.tableData182 = resultData.list
				this.page182.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			const paramJson = Object.assign(this.formData181, {
				length: this.page182.length,
				startIndex: (this.page182.currentPage - 1) * this.page182.length,
			})
			return paramJson
		},
	},
}
</script>
