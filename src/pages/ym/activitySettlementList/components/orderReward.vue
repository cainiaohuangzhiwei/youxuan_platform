<template>
	<div>
		<WgForm
			:inline="true"
			:data="formData"
			:items="formCfg"
			:formAction="formAction"
			:actionInline="true"
		></WgForm>
		<div class="table-title">
			<span class="table-title-span">预估奖励金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.organizationTotalAmount, 2) || 0 }}
			</span>
			<span class="table-title-span">平台承担金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.platformTotalAmount, 2) || 0 }}
			</span>
			<span class="table-title-span">商家承担金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.supplierTotalAmount, 2) || 0 }}
			</span>
			<span class="table-title-span">已发放店主金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.organizationSettleAmount, 2) || 0 }}
			</span>
			<span class="table-title-span">已与商家结算金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.supplierSettleAmount, 2) || 0 }}
			</span>
		</div>
		<yx-table
			v-loading="loading"
			:select="false"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		></yx-table>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	activityRewardSettlePageList,
	getOrderActivityRewardSummary,
} from '@/api/userRewardSystem'
import { numberFormat } from '@/utils/helper/common'
export default {
	components: {
		YxTable,
		WgForm,
	},
	data() {
		return {
			numberFormat: numberFormat,
			Amount: {
				organizationTotalAmount: 0, //预估奖励金额
				platformTotalAmount: 0, //平台承担金额
				supplierTotalAmount: 0, //商家承担金额
				organizationSettleAmount: 0, //已发放店主金额
				supplierSettleAmount: 0, //已与商家结算金额
			},
			formData: {
				activityName: '',
				startTime: moment().startOf('month').valueOf(),
				endTime: moment().endOf('month').valueOf(),
				addTimeList: [moment().startOf('month'), moment().endOf('month')],
			},
			formCfg: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'activityName',
				},
				{
					type: 'time',
					title: '活动开始时间',
					dataIndex: 'addTimeList',
					colSpan: 12,
					change: () => {
						this.formData.addTimeList = this.formData.addTimeList || ['', '']
						let startTime = this.formData.addTimeList[0]
						let endTime = this.formData.addTimeList[1]
						this.formData.startTime = startTime
							? moment(startTime).valueOf()
							: ''
						this.formData.endTime = endTime ? moment(endTime).valueOf() : ''
					},
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
						pickerOptions: {
							shortcuts: [
								{
									text: '今日',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('days'),
											moment().endOf('days'),
										])
									},
								},
								{
									text: '昨日',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'days').startOf('days'),
											moment().subtract(1, 'days').endOf('days'),
										])
									},
								},
								{
									text: '本周',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('week'),
											moment().endOf('week'),
										])
									},
								},
								{
									text: '上周',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'week').startOf('week'),
											moment().subtract(1, 'week').endOf('week'),
										])
									},
								},
								{
									text: '本月',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('months'),
											moment().endOf('months'),
										])
									},
								},
								{
									text: '上月',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'months').startOf('months'),
											moment().subtract(1, 'months').endOf('months'),
										])
									},
								},
							],
						},
					},
				},
			],
			formAction: [
				{
					title: '重置',
					// isClear: true,
					align: 'right',
					click: () => {
						this.formReset()
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._init(true)
					},
				},
			],
			loading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'id',
					title: 'ID',
					align: 'left',
					width: '60',
				},
				{
					type: 'string',
					dataIndex: 'activityName',
					title: '活动名称',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					align: 'left',
					title: '活动时间',
					width: '144',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							'~' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'creator',
					title: '创建人',
					align: 'left',
				},
				{
					type: 'amount',
					dataIndex: 'costBudget',
					title: '费用预算',
				},
				{
					type: 'amount',
					dataIndex: 'userRewardAmount',
					title: '预估奖励金额',
				},
				{
					type: 'amount',
					dataIndex: 'supplierUndertakeAmount',
					title: '商家承担金额',
				},
				{
					type: 'amount',
					dataIndex: 'platformUndertakeAmount',
					title: '平台承担金额',
				},
				{
					type: 'amount',
					dataIndex: 'organizationSettledAmount',
					title: '已发放店主金额',
				},
				{
					type: 'amount',
					dataIndex: 'supplierSettledAmount',
					title: '已与商家结算金额',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看明细',
							auth: 'marketingActivityRewardSettleDetailPageList',
							click: (row) => {
								// console.log('row---------', row)
								this.$router.push({
									path: `activitySettlementDetail/${row.activitySn}`,
								})
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
					this._init()
				},
			},
			tableData: [],
		}
	},
	created() {
		// this._init(true)
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
					startIndex: (this.page.currentPage - 1) * this.page.length,
				},
				this.formData
			)
			return paramJson
		},
		_init: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			delete paramJson['addTimeList']
			// 列表查询请求
			let {
				data: {
					resultCode,
					resultData: { records = [], total = 0 },
				},
			} = await activityRewardSettlePageList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = records
				this.page.count = total
			} else {
				this.page.count = 0
				this.tableData = []
			}
			// 订单奖励活动总金额
			let { data: AmountData } = await getOrderActivityRewardSummary(paramJson)
			if (AmountData.resultCode === 0) {
				this.Amount = AmountData.resultData
			}
		},
		formReset() {
			this.formData = {
				activityName: '',
				startTime: moment().startOf('month').valueOf(),
				endTime: moment().endOf('month').valueOf(),
				addTimeList: [moment().startOf('month'), moment().endOf('month')],
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 20px;
}
.table-title {
	margin-bottom: 15px;
}
.table-title .table-title-span {
	font-weight: bold;
}
.table-title .table-title-amount {
	font-size: 24px;
	margin-right: 20px;
}
</style>
