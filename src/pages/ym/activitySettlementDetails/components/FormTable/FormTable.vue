<template>
	<div>
		<WgForm
			v-loading="exportLoading"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
			:actionInline="true"
			labelWidth="7em"
		></WgForm>
		<div class="sale-points">
			<span>应结算金额：</span>{{ this.settlementAmount || 0 }}
			<span>退款金额：</span>{{ this.refundAmount || 0 }} <span>到账金额：</span
			>{{ this.settledAmount || 0 }}
		</div>
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
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
// import {
// 	getMerchantAccountWithdrawList,
// } from '@/api/yhtPlusCmsFinance'
import {
	getListPageOrderSettleItem,
	getOrganizationSettleCollectAmount,
} from '@/api/userRewardSystem'
import moment from 'moment'

export default {
	components: {
		WgForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			exportLoading: false,
			showLoading: false,
			refundAmount: 0,
			settledAmount: 0,
			settlementAmount: 0,
			searchData: {
				organizationId: '', // 操作人
				orderSn: '', //订单号
				startAddTime: moment().startOf('day').valueOf(), //开始时间
				endAddTime: moment().endOf('day').valueOf(), //结束时间
				settleStatus: '', // 状态
				revenueType: '', // 类型
			},
			searchCfg: [
				{
					title: '店主ID',
					type: 'input',
					dataIndex: 'organizationId',
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'orderSn',
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					placeholder: ['开始时间', '结束时间'],
					colSpan: 12,
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'settleStatus',
					options: [
						{
							settleStatus: '',
							value: '全部',
						},
						{
							settleStatus: 3,
							value: '待结算',
						},
						{
							settleStatus: 5,
							value: '已结算',
						},
						{
							settleStatus: 4,
							value: '结算中',
						},
						{
							settleStatus: 2,
							value: '已关闭',
						},
					],
					label: 'value',
				},
				{
					title: '明细记录类型',
					type: 'select',
					dataIndex: 'revenueType',
					options: [
						{
							revenueType: '',
							value: '全部',
						},
						{
							revenueType: 1,
							value: '活动订单销售提成',
						},
						{
							revenueType: 2,
							value: '活动订单权益奖',
						},
					],
					label: 'value',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._orgReconciliationList(true)
						this._getOrganizationSettleCollectAmount(true)
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
				},
				{
					type: 'data',
					dataIndex: 'orderTime',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'map',
					dataIndex: 'revenueType',
					title: '类型',
					options: {
						活动订单销售提成: 1,
						活动订单权益奖: 2,
					},
				},
				{
					type: 'map',
					dataIndex: 'settleStatus',
					title: '状态',
					options: {
						待结算: 3,
						已结算: 5,
						结算中: 4,
						已关闭: 2,
					},
				},
				{
					type: 'amount',
					dataIndex: 'settleAmount',
					title: '应结算金额',
				},
				{
					type: 'amount',
					dataIndex: 'refundAmount',
					title: '退款金额',
				},
				{
					type: 'amount',
					dataIndex: 'depositedAmount',
					title: '到账金额',
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
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { totalCount = 0, recordList = [] },
				},
			} = await getListPageOrderSettleItem(paramJson)
			console.log(flag, 'flag')
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = recordList
				this.page.count = totalCount
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
		_getOrganizationSettleCollectAmount: async function (flag) {
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			let {
				data: { resultCode, resultData },
			} = await getOrganizationSettleCollectAmount(paramJson)
			console.log(flag, 'flag')
			this.showLoading = false
			if (resultCode == 0) {
				this.refundAmount = resultData.refundAmount
				this.settledAmount = resultData.settledAmount
				this.settlementAmount = resultData.settlementAmount
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.sale-points {
	margin-bottom: 10px;
}
.sale-points span {
	font-weight: bold;
	margin-left: 20px;
}
</style>
