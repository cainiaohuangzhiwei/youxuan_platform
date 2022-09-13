<template>
	<div class="supplierCostList">
		<basicContainer>
			<yx-form
				:inline="true"
				v-loading="loading113"
				:data="formData113"
				:items="formCfg113"
				:formAction="formAction113"
			>
				<template slot="supplierAccountNumberId">
					<el-select
						v-model="formData113.supplierAccountNumberId"
						filterable
						placeholder="请选择"
					>
						<el-option
							v-for="item in supplierAccountNumberList"
							:key="item.supplierAccountNumberId"
							:label="item.supplierName"
							:value="item.supplierAccountNumberId"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>
			<yx-accounts :items="accountItems115"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns114"
				:pagination="page114"
				:data="tableData114"
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
import { checkFunctionCode } from '@/utils/auth.js'
import { downloadFile } from '@/utils/helper/common'
import { supplierAccountNumberList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import {
	getPlatformAmountListByCondition,
	exportPlatformAmountListByCondition,
} from '@/api/yhtPlusCmsFinance'

export default {
	name: 'SupplierCostList',
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
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			loading113: false,
			loading: false,
			formData113: {
				orderSn: '',
				brandName: '',
				supplierAccountNumberId: '0',
				sourceName: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
			},
			formCfg113: [
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					type: 'input',
					title: '会场',
					dataIndex: 'brandName',
					placeholder: '请输入会场',
				},
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierAccountNumberId',
				},
				{
					type: 'select',
					title: '下单设备',
					dataIndex: 'sourceName',
					placeholder: '请输入下单设备',
					label: 'value',
					options: [
						{
							sourceName: '',
							value: '全部',
						},
						{
							sourceName: 'mi-01',
							value: 'mi-01',
						},
						{
							sourceName: 'mi-02',
							value: 'mi-02',
						},
						{
							sourceName: 'mi-03',
							value: 'mi-03',
						},
						{
							sourceName: 'mi-04',
							value: 'mi-04',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '下单时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction113: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData114(true)
					},
					tableId: 114,
				},
				{
					title: '导出Excel',
					type: 'warning',
					auth: 'exportPlatformAmountListByCondition',
					click: () => {
						this.exportExcel()
					},
				},
			],
			accountItems115: [
				{
					type: 'amount',
					title: '订单商品成本(统计)',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '订单运费',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '支付总成本(实际)',
					value: '0.00',
				},
			],
			tableData114: [],
			tableColumns114: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '单号',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌名称',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
					customRender: ({ supplierName, sourceType }) => {
						if (supplierName) {
							return supplierName
						} else if (sourceType) {
							if (sourceType == 1) {
								return 'AKC'
							} else if (sourceType == 2) {
								return 'HYK'
							} else if (sourceType == 3) {
								return 'BBC'
							} else if (sourceType == 4) {
								return 'WPC'
							} else if (sourceType == 5) {
								return '京东联盟'
							} else if (sourceType == 6) {
								return '海外购'
							} else if (sourceType == 7) {
								return '砍单活动'
							} else if (sourceType == 8) {
								return '奥买家'
							} else if (sourceType == 9) {
								return '自有品牌'
							} else if (sourceType == 10) {
								return '商家'
							} else if (sourceType == 11) {
								return '购拉拉'
							} else if (sourceType == 12) {
								return '超链'
							} else if (sourceType == 13) {
								return '自有品牌-海外'
							} else {
								return '-'
							}
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'sourceName',
					title: '下单设备',
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
					dataIndex: 'expressAmount',
					title: '订单运费',
				},
				{
					type: 'amount',
					dataIndex: 'couponAmount',
					title: '优惠券扣减',
				},
				{
					type: 'amount',
					dataIndex: 'costAmount',
					title: '订单商品成本(统计)',
				},
				{
					type: 'amount',
					dataIndex: 'settlementAmount',
					title: '支付成本(实际)',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column })
					},
				},
			],
			page114: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData114()
				},
			},
			supplierAccountNumberList: [],
		}
	},

	created() {
		this._supplierAccountNumberList()
	},

	methods: {
		// 导出Excel
		exportExcel: async function () {
			let paramJson = this.formData113
			const loading = this.$loading({
				lock: true,
				text: '正在导出，请稍等',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let { data } = await exportPlatformAmountListByCondition(paramJson)
			loading.close()
			downloadFile(data, '商家成本信息表.xlsx')
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
		async _supplierAccountNumberList() {
			this.loading113 = true
			let {
				data: { resultCode, resultData },
			} = await supplierAccountNumberList()
			this.loading113 = false
			if (resultCode == 0) {
				this.supplierAccountNumberList = [
					{
						supplierAccountNumberId: '0',
						supplierName: '全部',
					},
				]
				this.supplierAccountNumberList.push(
					...resultData.supplierAccountNumberList
				)
			}
		},
		async getData114(flag) {
			this.loading = true
			let paramJson = this.findSearchParams114(flag)
			const {
				data: { resultCode, resultData },
			} = await getPlatformAmountListByCondition(paramJson)
			if (resultCode == 0) {
				this.accountItems115[0].value =
					resultData.flowStatistics.costAmountCount || 0
				this.accountItems115[1].value =
					resultData.flowStatistics.expressAmountCount || 0
				this.accountItems115[2].value =
					resultData.flowStatistics.settlementAmountCount || 0
				this.tableData114 = resultData.platformAmountList
				this.page114.count = resultData.flowStatistics.orderCount
			} else {
				this.accountItems115[0].value = 0
				this.accountItems115[1].value = 0
				this.accountItems115[2].value = 0
				this.tableData114 = []
				this.page114.count = 0
			}
			this.loading = false
		},
		findSearchParams114(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page114.currentPage = 1
			}
			const paramJson = Object.assign(this.formData113, {
				length: this.page114.length,
				startIndex: (this.page114.currentPage - 1) * this.page114.length,
			})
			return paramJson
		},
	},
}
</script>
