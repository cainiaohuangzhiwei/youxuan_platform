<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form>
		<el-row>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
				:selectionChange="selectionChange"
			></yx-table>
		</el-row>
		<!-- 调整分佣比例 -->
		<AdjustCommissionRatioDialog
			:commissionRateData="commissionRateData"
			:visible.sync="commissionRateDialog"
			@fatherMethodInit="init"
		/>
		<!-- 调整分佣比例记录 -->
		<CommissionRatioListDialog ref="recordTable" />
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { checkFunctionCode } from '@/utils/auth'
import { listByCondition, batchEnable, batchDisable } from '@/api/deduction'
import { getConstantValueByKey } from '@/utils/helper/common'
import AdjustCommissionRatioDialog from './AdjustCommissionRatioDialog'
import CommissionRatioListDialog from './CommissionRatioListDialog'
import moment from 'moment'
export default {
	components: {
		YxForm,
		YxTable,
		AdjustCommissionRatioDialog,
		CommissionRatioListDialog,
	},
	name: 'FormTable',

	data() {
		return {
			whitelistBatchEnable: checkFunctionCode('whitelistBatchEnable'),
			whitelistBatchDisable: checkFunctionCode('whitelistBatchDisable'),
			getConstantValueByKey: getConstantValueByKey,
			moment: moment,
			searchData: {
				supplierName: '',
				supplierId: '',
				enableStatus: '',
			},
			loading: false,
			batchDialog: false,
			// 操作记录弹框开关
			dialogVisible: false,
			orderStatus: [],
			selectionData: [],
			operatingRecord: [],
			searchCfg: [
				{
					type: 'textarea',
					dataIndex: 'supplierName',
					title: '商家名',
					placeholder: '请输入商家名称,多个商家用逗号隔开或者换行',
				},
				{
					type: 'textarea',
					dataIndex: 'supplierId',
					title: '商家ID',
					placeholder: '请输入商家ID,多个商家用逗号隔开或者换行',
				},
				{
					type: 'select',
					title: '启用状态',
					dataIndex: 'enableStatus',
					label: 'value',
					options: [
						{
							enableStatus: 0,
							value: '全部',
						},
						{
							enableStatus: 2,
							value: '禁用',
						},
						{
							enableStatus: 1,
							value: '启用',
						},
					],
					change: () => {
						this.init(true)
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '批量调整默认分佣比例',
					auth: 'batchUpdateProportion',
					type: 'success',
					click: () => {
						this.handleCommissionRate(2)
					},
				},
				{
					title: '批量启用',
					auth: 'whitelistBatchEnable',
					type: 'success',
					click: () => {
						this.handleForbidden(null, 2)
					},
				},
				{
					title: '批量禁用',
					auth: 'whitelistBatchDisable',
					type: 'warning',
					click: () => {
						this.handleForbidden(null, 3)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					dataIndex: 'defaultCommissionRate',
					title: '默认分佣比例 (店主:服务商)',
					width: 100,
					customRender: (row) => {
						if (row.proportionOne && row.proportionTwo) {
							return row.proportionOne + ' : ' + row.proportionTwo
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'enableStatus',
					title: '状态',
					customRender: (row) => {
						return row.enableStatus == 1
							? '启用'
							: row.enableStatus == 2
							? '禁用'
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '240',
					actions: [
						{
							title: '禁用',
							auth: '',
							click: (row) => {
								this.handleForbidden(row, 1)
							},
							customRender: (action, row) => {
								action.hide =
									(row.enableStatus == 1 && !this.whitelistBatchDisable) ||
									(row.enableStatus != 1 && !this.whitelistBatchEnable)
								action.title = row.enableStatus == 1 ? '禁用' : '启用'
								return action
							},
						},
						{
							title: '调整默认分佣比例',
							auth: 'batchUpdateProportion',
							click: (row) => {
								this.handleCommissionRate(1, row)
							},
							customRender: (action, row) => {
								action.hide = row.enableStatus != 1
								return action
							},
						},
						{
							title: '查看记录',
							auth: 'operationRecord',
							click: (row) => {
								this.checkCommissionList(row)
							},
							customRender: (action, row) => {
								action.hide = !row.supplierDeductionWhitelistId
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
					this.init()
				},
			},
			// 调整默认分佣比例数据
			commissionRateData: {
				operateSupplierIds: [],
				type: 1,
			},
			commissionRateDialog: false,
		}
	},

	created() {
		// this.init(true)
	},

	methods: {
		// 搜索条件 true
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		// 获取列表
		async init(flag) {
			let paramJson = this.findSearchParams(flag)
			paramJson = JSON.parse(JSON.stringify(paramJson))
			paramJson.supplierId = paramJson.supplierId.replace(/\n/g, ',')
			paramJson.supplierId = paramJson.supplierId.replace(/\s*/g, '')
			paramJson.supplierName = paramJson.supplierName.replace(/\n/g, ',')
			paramJson.supplierName = paramJson.supplierName.replace(/\s*/g, '')

			if (paramJson.supplierId && paramJson.supplierName) {
				this.$message.warning('商家id和商家名称不能同时查询')
				return
			}
			this.loading = true
			const {
				data: { resultData },
			} = await listByCondition(paramJson)

			if (resultData.recordList.length > 0) {
				this.tableData = resultData.recordList
				this.page.count = resultData.count
				this.loading = false
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		// 禁用/启用
		async handleForbidden(row, v) {
			const paramJson = Object.assign({})
			if (v == 2 || v == 3) {
				paramJson.supplierIds = this.selectionData.map(
					(item) => item.supplierId
				)
			} else {
				paramJson.supplierIds = [row.supplierId]
			}
			if (this.selectionData.length == 0 && (v == 2 || v == 3)) {
				return this.$message.warning('请勾选需要批量操作的商家')
			}
			let hint
			if (v == 2 || v == 3) {
				hint = `确认要批量${v == 2 ? '启用' : '禁用'}${
					this.selectionData.length
				}个商家吗？`
			} else {
				hint = `确认要${row.enableStatus == 1 ? '禁用' : '启用'}该商家吗？`
			}
			this.$confirm(hint, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let Url
						if ((v == 1 && row.enableStatus == 1) || v == 3) {
							Url = batchDisable
						} else if ((v == 1 && row.enableStatus == 2) || v == 2) {
							Url = batchEnable
						}
						let {
							data: { resultMsg },
						} = await Url(paramJson)
						this.$message.success(resultMsg)
						this.init(true)
					}
				},
			})
		},
		// 调整分佣比例
		async handleCommissionRate(operateType, row) {
			const paramJson = {}
			paramJson.type = operateType
			if (operateType == 2) {
				paramJson.operateSupplierIds = this.selectionData
					.filter((item) => {
						if (item.enableStatus == 1) {
							return item.supplierId
						}
					})
					.map((item) => item.supplierId)
				paramJson.proportionOne = ''
				paramJson.proportionTwo = ''
			} else {
				paramJson.operateSupplierIds = [row.supplierId]
				paramJson.supplierName = row.supplierName
				if (row.proportionOne && row.proportionTwo) {
					paramJson.proportionOne = row.proportionOne
					paramJson.proportionTwo = row.proportionTwo
				}
			}
			if (this.selectionData.length == 0 && operateType == 2) {
				return this.$message.warning('请勾选需要批量操作的商家')
			}
			this.commissionRateData = paramJson
			this.commissionRateDialog = true
		},
		// 查看调整分佣记录
		checkCommissionList(row) {
			this.$refs.recordTable.detail(row)
		},
	},
}
</script>

<style>
.tracking-item {
	display: flex;
}
.tracking-item-div {
	width: 30%;
}
</style>
