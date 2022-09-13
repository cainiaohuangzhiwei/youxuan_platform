<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<YxAccounts :items.sync="flowOrder" />
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<!-- 订单号 -->
					<template slot="orderSn" slot-scope="scope">
						<router-link
							v-if="getOrderDetailByOrderId"
							:to="`/business/orderDetails/${scope.row.orderId}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
						<span v-else>{{ scope.row.orderSn }}</span>
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import YxAccounts from '@/components/Accounts/index'
import {
	getFlowOrderListByCondition,
	exportFlowOrderListByCondition,
} from '@/api/yhtPlusCmsFinance'
import moment from 'moment'
import { checkFunctionCode } from '@/utils/auth'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		YxAccounts,
	},
	name: 'FormTable',

	data() {
		return {
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			showLoading: false,
			searchData: {
				orderSn: '', // 订单号
				orderStartTime: moment().startOf('day').valueOf(), // 开始时间
				orderEndTime: moment().endOf('day').valueOf(), // 结束时间
			},
			searchCfg: [
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					enter: () => {
						this.callFlowOrderList(true)
					},
				},
				{
					title: '下单时间',
					type: 'datetimerange',
					dataIndex: ['orderStartTime', 'orderEndTime'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callFlowOrderList(true)
					},
				},
				{
					title: '导出Excel',
					type: 'primary',
					auth: 'exportFlowOrderListByCondition',
					click: () => {
						this.exportFlowOrderListByCondition()
					},
				},
			],
			flowOrder: [
				{
					type: 'amount',
					title: '未到账盈利',
					value: 0,
				},
				{
					type: 'amount',
					title: '到账盈利',
					value: 0,
				},
				{
					type: 'amount',
					title: '总计',
					value: 0,
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号',
					enter: () => {
						this.callFlowOrderList(true)
					},
				},
				{
					type: 'date',
					dataIndex: 'finishTime',
					title: '完成时间',
				},
				{
					dataIndex: 'orderAmount',
					title: '订单总额',
					type: 'amount',
				},
				{
					dataIndex: 'realAmount',
					title: '实付金额',
					type: 'amount',
				},
				{
					dataIndex: 'couponAmount',
					title: '优惠折扣金额',
					type: 'amount',
				},
				{
					dataIndex: 'payAmount',
					title: '支付金额',
					type: 'amount',
				},
				{
					dataIndex: 'serviceCharge',
					title: '手续费',
					type: 'amount',
				},
				{
					dataIndex: 'balanceAmount',
					title: '余额抵扣金额',
					type: 'amount',
				},
				{
					dataIndex: 'supplement',
					title: '补款金额',
					type: 'amount',
				},
				{
					dataIndex: 'refund',
					title: '退款金额',
					type: 'amount',
				},
				{
					dataIndex: 'orderExpressFee',
					title: '订单运费',
					type: 'amount',
				},
				{
					dataIndex: 'platformExpressFee',
					title: '商家运费',
					type: 'amount',
				},
				{
					dataIndex: 'preExpressFee',
					title: '待入账邮费金额',
					type: 'amount',
				},
				{
					dataIndex: 'preCost',
					title: '待入账商品成本金额',
					type: 'amount',
				},
				{
					dataIndex: 'prePurchaseFee',
					title: '待入账佣金',
					type: 'amount',
				},
				{
					dataIndex: 'preCommissionCharge',
					title: '待入账服务奖励',
					type: 'amount',
				},
				{
					dataIndex: 'preGain',
					title: '待入账盈利收入',
					type: 'amount',
				},
				{
					dataIndex: 'expressFee',
					title: '到账邮费金额',
					type: 'amount',
				},
				{
					dataIndex: 'cost',
					title: '到账成本金额',
					type: 'amount',
				},
				{
					dataIndex: 'purchaseFee',
					title: '到账佣金',
					type: 'amount',
				},
				{
					dataIndex: 'commissionCharge',
					title: '到账服务奖励',
					type: 'amount',
				},
				{
					dataIndex: 'gain',
					title: '到账盈利',
					type: 'amount',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callFlowOrderList()
				},
			},
		}
	},

	created() {
		// this.callFlowOrderList(true)
	},

	methods: {
		exportFlowOrderListByCondition: async function () {
			// 导出数据
			let paramJson = Object.assign({}, this.searchData)
			const loading = this.$loading({
				lock: true,
				text: '正在导出，请稍等',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let { data } = await exportFlowOrderListByCondition(paramJson)
			loading.close()
			downloadFile(data, '订单交易记录.xlsx')
		},
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
		callFlowOrderList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getFlowOrderListByCondition(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.flowOrderList || []
				if (resultData.flowOrder) {
					let flowOrder = resultData.flowOrder || {}
					this.flowOrder[0].value = flowOrder.preGain
					this.flowOrder[1].value = flowOrder.gain
					this.flowOrder[2].value = flowOrder.preGain + flowOrder.gain
				}
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
