<template>
	<div>
		<WgForm
			v-loading="exportLoading"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
			:actionInline="true"
		></WgForm>
		<div class="table-title">
			<span class="table-title-span">订单剩余奖励金额：</span
			><span class="table-title-amount">{{
				numberFormat(this.userRewardAmount, 2) || 0
			}}</span>
			<span class="table-title-span">商家承担金额：</span
			><span class="table-title-amount">{{
				numberFormat(this.supplierUndertakeAmount, 2) || 0
			}}</span>
			<span class="table-title-span">平台承担金额：</span
			><span class="table-title-amount">{{
				numberFormat(this.platformUndertakeAmount, 2) || 0
			}}</span>
		</div>
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
		</yx-table>
	</div>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	activityRewardSettleDetailPageList,
	getSummaryActivityRewardAmount,
	exportRewardDetailByPlatform,
} from '@/api/userRewardSystem'
import { downloadFile, numberFormat } from '@/utils/helper/common'
export default {
	components: {
		WgForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			exportLoading: false,
			showLoading: false,
			supplierUndertakeAmount: 0,
			platformUndertakeAmount: 0,
			userRewardAmount: 0,
			searchData: {
				organizationId: '', // 操作人
				orderSn: '', //订单号
				recordStatus: '', // 奖励状态
				settleStatus: '', // 结算状态
			},
			searchCfg: [
				{
					title: '店主ID',
					type: 'inputNumber',
					dataIndex: 'organizationId',
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'orderSn',
				},
				{
					title: '奖励状态',
					type: 'select',
					dataIndex: 'recordStatus',
					options: [
						{
							recordStatus: '',
							value: '全部',
						},
						{
							recordStatus: 1,
							value: '待团队计算中',
						},
						{
							recordStatus: 2,
							value: '待发放奖励',
						},
						{
							recordStatus: 3,
							value: '发放中',
						},
						{
							recordStatus: 4,
							value: '已发放奖励',
						},
						{
							recordStatus: 5,
							value: '已关闭',
						},
					],
					label: 'value',
				},
				{
					title: '商家结算状态',
					type: 'select',
					dataIndex: 'settleStatus',
					options: [
						{
							settleStatus: '',
							value: '全部',
						},
						{
							settleStatus: 0,
							value: '无需结算',
						},
						{
							settleStatus: 1,
							value: '未结算',
						},
						{
							settleStatus: 2,
							value: '结算中',
						},
						{
							settleStatus: 3,
							value: '结算成功',
						},
						{
							settleStatus: 4,
							value: '已关闭',
						},
					],
					label: 'value',
				},
			],
			searchAction: [
				{
					title: '导出',
					type: 'success',
					auth: 'marketingExportRewardDetailByPlatform',
					click: () => {
						this.$confirm('确定导出列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.findSearchParams(true)
									let paramJson_ = { ...paramJson }
									const { data } = await exportRewardDetailByPlatform(
										paramJson_
									)
									if (data) {
										downloadFile(data, '活动结算明细列表.xlsx')
									}
								}
							},
						})
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._orgReconciliationList(true)
						this._getSummaryActivityRewardAmount(true)
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
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'rewardRecordSn',
					title: '奖励记录单号',
					align: 'left',
				},
				{
					type: 'data',
					dataIndex: 'orderTime',
					title: '下单时间',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
					align: 'left',
				},
				{
					type: 'amount',
					dataIndex: 'userRewardAmount',
					title: '订单剩余奖励金额',
				},
				{
					type: 'amount',
					dataIndex: 'supplierUndertakeAmount',
					title: '商家承担金额',
				},
				{
					type: 'map',
					dataIndex: 'recordStatus',
					title: '奖励状态',
					options: {
						待团队计算中: 1,
						待发放奖励: 2,
						发放中: 3,
						已发放奖励: 4,
						已关闭: 5,
					},
					align: 'left',
				},
				{
					type: 'map',
					dataIndex: 'settleStatus',
					title: '商家结算状态',
					options: {
						无需结算: 0,
						未结算: 1,
						结算中: 2,
						结算成功: 3,
						已关闭: 4,
					},
					align: 'left',
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
		}
	},
	created() {
		this._orgReconciliationList(true)
		this._getSummaryActivityRewardAmount(true)
		// console.log(this.$route.params.activitySn)
	},

	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			//搜索条件
			let paramJson = Object.assign(
				{
					startIndex: (this.page.currentPage - 1) * this.page.length,
					currentPage: this.page.currentPage,
					length: this.page.length,
				},
				this.searchData
			)
			paramJson.activitySn = this.$route.params.activitySn
			return paramJson
		},
		_orgReconciliationList: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { total = 0, records = [] },
				},
			} = await activityRewardSettleDetailPageList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = records
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
		_getSummaryActivityRewardAmount: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getSummaryActivityRewardAmount(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.userRewardAmount = resultData.userRewardAmount
				this.supplierUndertakeAmount = resultData.supplierUndertakeAmount
				this.platformUndertakeAmount = resultData.platformUndertakeAmount
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.table-title {
	margin-bottom: 15px;
}
.table-title .table-title-span {
	font-weight: bold;
}
.table-title .table-title-amount {
	margin-right: 20px;
}
</style>
