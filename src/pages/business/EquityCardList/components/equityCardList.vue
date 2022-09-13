<template>
	<div class="equityCardList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { listEquityOrder } from '@/api/equity'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData105: {
				equitySn: '',
				orderSn: '',
				receiveAmountStatus: '',
				startTime: moment().startOf('month').valueOf(), // 开始时间
				endTime: moment().endOf('month').valueOf(), // 开始时间
			},
			formCfg105: [
				{
					type: 'input',
					title: '权益卡订单号',
					dataIndex: 'equitySn',
					placeholder: '请输入权益卡订单号',
				},
				{
					type: 'input',
					title: '关联订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入关联订单号',
				},
				{
					type: 'select',
					title: '订单状态',
					dataIndex: 'receiveAmountStatus',
					placeholder: '请输入赔付单号',
					label: 'value',
					options: [
						{
							value: '全部',
							receiveAmountStatus: '',
						},
						{
							value: '待付款',
							receiveAmountStatus: 1,
						},
						{
							value: '付款中',
							receiveAmountStatus: 2,
						},
						{
							value: '已付款',
							receiveAmountStatus: 3,
						},
						{
							value: '已关闭',
							receiveAmountStatus: 4,
						},
						{
							value: '退款中',
							receiveAmountStatus: 5,
						},
						{
							value: '退款失败',
							receiveAmountStatus: 6,
						},
						{
							value: '已退款',
							receiveAmountStatus: 7,
						},
					],
				},
				{
					type: 'datetimerange',
					title: '添加时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction105: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData106(true)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'equitySn',
					title: '权益卡订单号',
					width: '190',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'receiveAmountStatus',
					title: '订单状态',
					customRender: (row) => {
						const arr = [
							'',
							'待付款',
							'付款中',
							'已付款',
							'已关闭',
							'退款中',
							'退款失败',
							'已退款',
						]
						return arr[row.receiveAmountStatus] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'orderUserName',
					title: '下单人',
				},
				{
					type: 'amount',
					dataIndex: 'equityOrderAmount',
					title: '订单金额',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单',
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData106()
				},
			},
		}
	},

	methods: {
		async getData106(flag) {
			this.loading = true
			let paramJson = this.findSearchParams106(flag)
			const time = 30 * 24 * 60 * 60 * 1000
			if (
				paramJson.startTime &&
				paramJson.endTime &&
				time < paramJson.endTime - paramJson.startTime
			) {
				this.$message.warning('时间区间不能大于30天！')
				this.loading = false
				return
			}
			const {
				data: { resultCode, resultData },
			} = await listEquityOrder(paramJson)
			if (resultCode === 0) {
				this.tableData106 = resultData.equityOrderList
				this.page106.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			return paramJson
		},
	},
}
</script>
