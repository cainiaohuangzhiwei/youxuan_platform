<template>
	<div>
		<WgForm
			:inline="true"
			:data="formData"
			:items="formCfg"
			:formAction="formAction"
			:actionInline="true"
		>
		</WgForm>
		<div class="table-title">
			<span class="table-title-span">活动总奖励金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.activityTotalRewardAmount, 2) || 0 }}
			</span>
			<span class="table-title-span">平台承担金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.platformTotalCostAmount, 2) || 0 }}
			</span>
			<span class="table-title-span">商家承担金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.supplierTotalCostAmount, 2) || 0 }}
			</span>
			<span class="table-title-span">优惠券金额：</span
			><span class="table-title-amount">
				{{ numberFormat(Amount.couponTotalAmount, 2) || 0 }}
			</span>
		</div>
		<yx-table
			v-loading="loading"
			:select="false"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="grantStatus" slot-scope="scope">
				<span :class="'stateColor color-' + scope.row.settleStatus"></span>
				<span>
					{{ settleStatusChange(scope.row.grantStatus) }}
				</span>
			</template>
		</yx-table>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	getListActivitySettlement,
	getActivitySettlementSummary,
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
			formData: {
				actName: '', //活动名称
				grantStatus: '', // 结算状态
				startTime: moment().startOf('month').valueOf(), //活动开始时间
				endTime: moment().endOf('month').valueOf(), //活动结束时间
				addTimeList: [moment().startOf('month'), moment().endOf('month')], //活动开始-结束时间
				settlementStartTime: moment().startOf('month').valueOf(), //结算开始时间
				settlementEndTime: moment().endOf('month').valueOf(), //结算结束时间
				addSettlementList: [moment().startOf('month'), moment().endOf('month')], //结算开始-结束时间
			},
			formCfg: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'actName',
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
				{
					title: '活动结算状态',
					type: 'select',
					dataIndex: 'grantStatus',
					options: [
						{
							grantStatus: '',
							value: '全部',
						},
						{
							grantStatus: 0,
							value: '待结算',
						},
						{
							grantStatus: 1,
							value: '结算中',
						},
						{
							grantStatus: 2,
							value: '已完成',
						},
						{
							grantStatus: 3,
							value: '已关闭',
						},
					],
					label: 'value',
				},
				{
					type: 'time',
					title: '结算时间',
					dataIndex: 'addSettlementList',
					colSpan: 12,
					change: () => {
						this.formData.addSettlementList = this.formData
							.addSettlementList || ['', '']
						let settlementStartTime = this.formData.addSettlementList[0]
						let settlementEndTime = this.formData.addSettlementList[1]
						this.formData.settlementStartTime = settlementStartTime
							? moment(settlementStartTime).valueOf()
							: ''
						this.formData.settlementEndTime = settlementEndTime
							? moment(settlementEndTime).valueOf()
							: ''
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
					dataIndex: 'actId',
					title: '活动ID',
					align: 'left',
					width: '60',
				},
				{
					type: 'string',
					dataIndex: 'actName',
					title: '活动名称',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
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
					type: 'string',
					dataIndex: 'ruleLadderConfig',
					title: '奖励类型',
					align: 'left',
				},
				{
					type: 'amount',
					dataIndex: 'activityTotalAmount',
					title: '活动总金额',
				},
				{
					type: 'amount',
					dataIndex: 'estimateTotalAmount',
					title: '现金奖励金额',
				},
				{
					type: 'amount',
					dataIndex: 'supplierCostAmount',
					title: '现金商家承担金额',
				},
				{
					type: 'amount',
					dataIndex: 'platformCostAmount',
					title: '现金平台承担金额',
				},
				{
					type: 'amount',
					dataIndex: 'couponAmount',
					title: '优惠券金额',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					align: 'left',
					title: '结算时间',
					width: '144',
					customRender: (row) => {
						if (row.actSettleTime) {
							return moment(row.actSettleTime).format('YYYY-MM-DD HH:mm:ss')
						}
					},
				},
				{
					type: 'custom',
					dataIndex: 'grantStatus',
					title: '活动结算状态',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看活动明细',
							// auth: 'marketingActivityRewardSettleDetailPageList',
							click: (row) => {
								console.log('row---------', row)
								this.$router.push({
									path: `checkActivityDetail/${row.actId}`,
								})
							},
						},
						{
							title: '查看奖励明细',
							// auth: 'marketingActivityRewardSettleDetailPageList',
							click: (row) => {
								// console.log('row---------', row)
								this.$router.push({
									path: `checkRewardDetail/${row.actId}`,
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
			Amount: {
				activityTotalRewardAmount: 0,
				couponTotalAmount: 0,
				platformTotalCostAmount: 0,
				supplierTotalCostAmount: 0,
			},
		}
	},
	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					pageNum: this.page.currentPage,
					pageSize: this.page.length,
					startIndex: (this.page.currentPage - 1) * this.page.length,
				},
				this.formData
			)
			return paramJson
		},
		_init: async function (flag) {
			this.loading = true
			const paramJson = this.findSearchParams(flag)
			delete paramJson['addTimeList']
			delete paramJson['addSettlementList']
			const { data: settlementRes } = await getListActivitySettlement(paramJson)
			const { data: summaryRes } = await getActivitySettlementSummary(paramJson)
			this.loading = false
			if (settlementRes.resultCode === 0) {
				this.tableData = settlementRes.resultData
				this.page.count = settlementRes.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
			if (summaryRes.resultCode === 0) {
				this.Amount = summaryRes.resultData
			}
		},
		settleStatusChange(grantStatus) {
			//结算状态: 结算状态：0:待结算、1:结算中、2:已完成
			const arr = ['待结算', '结算中', '已完成']
			return arr[grantStatus] || '-'
		},
		// 重置表单
		formReset() {
			this.formData = {
				actName: '', //活动名称
				grantStatus: '', // 结算状态
				startTime: moment().startOf('month').valueOf(), //活动开始时间
				endTime: moment().endOf('month').valueOf(), //活动结束时间
				addTimeList: [moment().startOf('month'), moment().endOf('month')], //活动开始-结束时间
				settlementStartTime: moment().startOf('month').valueOf(), //结算开始时间
				settlementEndTime: moment().endOf('month').valueOf(), //结算结束时间
				addSettlementList: [moment().startOf('month'), moment().endOf('month')], //结算开始-结束时间
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
