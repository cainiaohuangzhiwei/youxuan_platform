<template>
	<div class="higherRebateList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData107"
				:items="formCfg107"
				:formAction="formAction107"
			>
			</yx-form>
			<yx-accounts :items="accountItems109"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns108"
				:pagination="page108"
				:data="tableData108"
			>
				<template slot="orderSn" slot-scope="scope">
					<div>
						<router-link
							v-if="getOrderDetailByOrderId"
							:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
						<p v-else>{{ scope.row.orderSn }}</p>
						<p>
							{{ moment(scope.row.orderAddTime).format('YYYY年MM月DD日HH:mm') }}
						</p>
					</div>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	getCommissionChargeListByCondition,
	exportCommissionChargeListByCondition,
} from '@/api/yhtPlusCmsFinance'
import { downloadFile, numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'

export default {
	name: 'HigherRebateList',
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
	},
	props: [],
	data() {
		return {
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			moment,
			loading: false,
			formData107: {
				keyword: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
			},
			formCfg107: [
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'keyword',
				},
				{
					type: 'datetimerange',
					title: '下单时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction107: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData108(true)
					},
					tableId: 108,
				},
				{
					title: '导出Excel',
					type: 'warning',
					auth: 'exportCommissionChargeListByCondition',
					click: () => {
						this.exportExcel()
					},
				},
			],
			accountItems109: [
				{
					type: 'amount',
					title: '订单结算金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '待入账服务奖励金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '已入账服务奖励金额',
					value: '0.00',
				},
			],
			tableData108: [],
			tableColumns108: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '单号',
				},
				{
					type: 'amount',
					dataIndex: 'orderAmount',
					title: '订单总额',
				},
				{
					type: 'amount',
					dataIndex: 'realAmount',
					title: '实付金额',
				},
				{
					type: 'string',
					dataIndex: 'preCommissionCharge',
					title: '待入账服务奖励金额',
					customRender: ({ preCommissionCharge, commissionCharge }) => {
						return numberFormat(preCommissionCharge - commissionCharge, 2)
					},
				},
				{
					type: 'amount',
					dataIndex: 'commissionCharge',
					title: '已入账服务奖励金额',
				},
			],
			page108: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData108()
				},
			},
		}
	},

	methods: {
		// 导出Excel
		exportExcel: async function () {
			let paramJson = this.formData107
			const loading = this.$loading({
				lock: true,
				text: '正在导出，请稍等',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let { data } = await exportCommissionChargeListByCondition(paramJson)
			loading.close()
			downloadFile(data, 'excel.xlsx')
		},
		// 获取列表数据
		async getData108(flag) {
			this.loading = true
			let paramJson = this.findSearchParams108(flag)
			const {
				data: { resultCode, resultData },
			} = await getCommissionChargeListByCondition(paramJson)
			if (resultCode == 0) {
				this.accountItems109[0].value =
					resultData.flowStatistics.realAmountCount || 0
				this.accountItems109[1].value =
					resultData.flowStatistics.preCommissionChargeCount -
						resultData.flowStatistics.commissionChargeCount || 0
				this.accountItems109[2].value =
					resultData.flowStatistics.commissionChargeCount || 0
				this.tableData108 = resultData.commissionChargeList
				this.page108.count = resultData.flowStatistics.orderCount
			} else {
				this.accountItems109[0].value = 0
				this.accountItems109[1].value = 0
				this.accountItems109[2].value = 0
				this.tableData108 = []
				this.page108.count = 0
			}
			this.loading = false
		},
		findSearchParams108(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page108.currentPage = 1
			}
			const paramJson = Object.assign(this.formData107, {
				length: this.page108.length,
				startIndex: (this.page108.currentPage - 1) * this.page108.length,
			})
			return paramJson
		},
	},
}
</script>
