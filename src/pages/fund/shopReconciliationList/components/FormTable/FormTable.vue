<template>
	<basic-container>
		<div v-auth="'listAccOrganizationReconcilation'">
			<WgForm
				v-loading="exportLoading"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:actionInline="true"
				labelWidth="6em"
			></WgForm>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
// import {
// 	getMerchantAccountWithdrawList,
// } from '@/api/yhtPlusCmsFinance'
import { orgReconciliationList } from '@/api/shopSettlement'
import { checkFunctionCode } from '@/utils/auth'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		WgForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			listAccOrganizationReconcilation: checkFunctionCode(
				'listAccOrganizationReconcilation'
			),
			exportLoading: false,
			showLoading: false,
			searchData: {
				operator: '', // 操作人
				status: '', //状态
				organizationId: '', //店主ID
				startTime: moment().startOf('day').valueOf(), //创建开始时间
				endTime: moment().endOf('day').valueOf(), //创建结束时间
				remark: '', // 备注
				reconciliationType: 0, // 类型
			},
			searchCfg: [
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
					colSpan: 12,
				},
				{
					title: '操作人',
					type: 'input',
					dataIndex: 'operator',
				},
				{
					title: '店主ID',
					type: 'input',
					dataIndex: 'organizationId',
				},
				{
					title: '备注',
					type: 'input',
					dataIndex: 'remark',
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 1,
							value: '处理中',
						},
						{
							status: 2,
							value: '处理成功',
						},
						{
							status: 3,
							value: '处理失败',
						},
					],
					label: 'value',
				},
				{
					title: '类型',
					type: 'select',
					dataIndex: 'reconciliationType',
					options: [
						{
							reconciliationType: 0,
							value: '全部',
						},
						{
							reconciliationType: 1,
							value: '普通调账',
						},
						{
							reconciliationType: 2,
							value: '月度收益补贴',
						},
						{
							reconciliationType: 3,
							value: '活动奖励金',
						},
					],
					label: 'value',
				},
			],
			searchAction: [
				{
					title: '导入明细',
					type: 'primary',
					auth: 'importOrgReconciliation',
					click: () => {
						this.$router.push({
							path: `shopBalanceTopUp`,
						})
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._orgReconciliationList(true)
					},
				},
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '调账金额',
				},
				{
					type: 'map',
					dataIndex: 'reconciliationType',
					title: '调账类型',
					options: {
						全部: 0,
						普通调账: 1,
						月度收益补贴: 2,
						活动奖励金: 3,
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'map',
					dataIndex: 'settleStatus',
					title: '状态',
					options: {
						处理中: 1,
						处理成功: 2,
						处理失败: 3,
					},
				},
				{
					type: 'string',
					dataIndex: 'operator',
					title: '操作人',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._orgReconciliationList()
				},
			},
			// gatewayEnable: false,
		}
	},
	created() {},

	mounted() {},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_orgReconciliationList: async function (flag) {
			if (!this.listAccOrganizationReconcilation) return
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { count = 0, list = [] },
				},
			} = await orgReconciliationList(paramJson)
			console.log(flag, 'flag')
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = list
				this.page.count = count
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>

<style></style>
