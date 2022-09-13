<template>
	<div class="incomeTotalList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-accounts :items="accountItems102"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns103"
				:pagination="page103"
				:data="tableData103"
			>
				<template slot="orderSn" slot-scope="scope">
					<div>
						<router-link
							:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
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
import { downloadFile } from '@/utils/helper/common'
import {
	getOrderAmountListByCondition,
	exportOrderAmountListByCondition,
} from '@/api/yhtPlusCmsFinance'

export default {
	name: 'IncomeTotalList',
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
	},
	props: [],
	data() {
		return {
			moment,
			loading: false,
			formData101: {
				keyword: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
			},
			formCfg101: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: '订单号',
				},
				{
					title: '下单时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData103(true)
					},
				},
				{
					title: '导出Excel',
					type: 'warning',
					auth: 'exportOrderAmountListByCondition',
					click: () => {
						this.exportExcel()
					},
				},
			],
			accountItems102: [
				{
					type: 'amount',
					title: '订单总额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '实付总额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '入账总额',
					class: 'amount-red',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '手续费',
					value: '0.00',
				},
			],
			tableData103: [],
			tableColumns103: [
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
					type: 'amount',
					dataIndex: 'serviceCharge',
					title: '手续费',
				},
				{
					type: 'amount',
					dataIndex: 'couponAmount',
					title: '优惠券扣减',
				},
				{
					type: 'amount',
					dataIndex: 'incomeAmount',
					title: '收入总额',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column })
					},
				},
			],
			page103: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData103()
				},
			},
		}
	},

	methods: {
		// 导出Excel
		exportExcel: async function () {
			let paramJson = this.formData101
			const loading = this.$loading({
				lock: true,
				text: '正在导出，请稍等',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let { data } = await exportOrderAmountListByCondition(paramJson)
			loading.close()
			downloadFile(data, 'excel.xlsx')
		},
		renderHeader(h, { column }) {
			// 表头提示
			return h('div', [
				h(
					'span',
					{
						style: 'color: red',
					},
					column.label
				),
			])
		},
		initAccounts(flowStatistics = {}) {
			this.accountItems102[0].value = flowStatistics.orderAmountCount || 0
			this.accountItems102[1].value = flowStatistics.realAmountCount || 0
			this.accountItems102[2].value = flowStatistics.incomeAmountCount || 0
			this.accountItems102[3].value = flowStatistics.serviceChargeCount || 0
		},
		// 获取列表数据
		async getData103(flag) {
			this.loading = true
			let paramJson = this.findSearchParams103(flag)
			const {
				data: { resultCode, resultData },
			} = await getOrderAmountListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData103 = resultData.orderAmountList
				this.page103.count = resultData.flowStatistics.orderCount
				this.initAccounts(resultData.flowStatistics)
			} else {
				this.initAccounts()
				this.tableData103 = []
				this.page103.count = 0
			}
			this.loading = false
		},
		findSearchParams103(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page103.length,
				startIndex: (this.page103.currentPage - 1) * this.page103.length,
			})
			return paramJson
		},
	},
}
</script>
<style>
.incomeTotalList .amount-red {
	color: red;
}
</style>
