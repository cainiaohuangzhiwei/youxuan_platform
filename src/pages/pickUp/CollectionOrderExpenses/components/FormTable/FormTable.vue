<template>
	<div>
		<yx-form
			v-loading="exportLoading"
			:inline="true"
			:data="formData101"
			:items="formCfg101"
			:formAction="formAction101"
		>
		</yx-form>
		<div class="tips">
			与顺丰结算总金额：<span>{{ totalData.totalSettlementFee || 0 }}</span>
		</div>
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="afterSalesSn" slot-scope="scope">
				<div v-if="scope.row.afterSalesList && scope.row.afterSalesList.length">
					<span
						class="afterSty"
						v-for="(item, index) in scope.row.afterSalesList"
						:key="index"
						@click="goDetail(item.afterSalesId)"
					>
						{{ item.afterSalesSn }}
						{{ scope.row.afterSalesList.length - 1 > index ? '、' : '' }}
					</span>
				</div>

				<span v-else class="afterSty" @click="goDetail(scope.row.afterSalesId)">
					{{ scope.row.afterSalesSn }}
				</span>
			</template>
		</yx-table>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import {
	collectionOrderExpenses,
	collectionOrderExpensesExport,
	selectData,
} from '@/api/collectionOrder'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		YxForm,
		YxTable,
	},
	data() {
		return {
			lll: [1, 2, 3, 4, 5],
			totalData: {},
			exportLoading: false,
			showLoading: false,
			formData101: {
				afterSalesSn: '',
				trackingNum: '',
				orderSn: '',
				collectionOrderSn: '',
				equityReductionFlag: '',
				isSettlement: '',
				time: [
					moment().startOf('day').valueOf(),
					moment().endOf('day').valueOf(),
				],
			},
			formCfg101: [
				{
					type: 'input',
					title: '揽件订单号',
					dataIndex: 'collectionOrderSn',
					enter: () => {
						this.init(true)
					},
				},
				{
					type: 'input',
					title: '运单号',
					dataIndex: 'trackingNum',
					enter: () => {
						this.init(true)
					},
				},
				{
					type: 'input',
					title: '售后单号',
					dataIndex: 'afterSalesSn',
					enter: () => {
						this.init(true)
					},
				},
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
					enter: () => {
						this.init(true)
					},
				},

				{
					type: 'select',
					title: '是否需要结算',
					dataIndex: 'isSettlement',
					label: 'value',
					options: [
						{
							isSettlement: '',
							value: '全部',
						},
						{
							isSettlement: '1',
							value: '是',
						},
						{
							isSettlement: '0',
							value: '否',
						},
					],
					change: () => {
						this.init(true)
					},
				},
				{
					type: 'select',
					title: '支付渠道',
					dataIndex: 'equityReductionFlag',
					label: 'value',
					options: [
						{
							equityReductionFlag: '',
							value: '全部',
						},
						{
							equityReductionFlag: '1',
							value: '运保卡抵扣渠道',
						},
						{
							equityReductionFlag: '0',
							value: '无运保卡抵扣渠道',
						},
					],
					change: () => {
						this.init(true)
					},
				},
				{
					type: 'time',
					title: '生成时间',
					dataIndex: 'time',
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
					},
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '导出',
					auth: '/export',
					click: () => {
						this.exportIt()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'collectionOrderSn',
					title: '揽件订单号',
				},
				{
					type: 'string',
					dataIndex: 'trackingNum',
					title: '运单号',
				},
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '售后单号',
					width: 200,
				},
				{
					type: 'action',
					dataIndex: 'orderSn',
					title: '订单编号',
					width: 200,
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.$router.push({
									path: `/business/orderDetails/${row.orderId}`,
								})
							},
							customRender: (action, row) => {
								action.title = row.orderSn
								return action
							},
						},
					],
				},
				{
					type: 'string',
					dataIndex: 'equityReductionFlag',
					title: '支付类型',
					customRender: (row) => {
						const arr = ['无运保卡抵扣渠道', '运保卡抵扣渠道', '']
						return arr[row.equityReductionFlag]
					},
				},
				{
					type: 'string',
					dataIndex: 'equityOrderSn',
					title: '锁定权益卡订单号',
				},
				{
					type: 'amount',
					dataIndex: 'actualFee',
					title: '用户实际支付金额',
				},
				{
					type: 'string',
					dataIndex: 'weight',
					title: '重量（kg）',
				},
				{
					type: 'amount',
					dataIndex: 'freight',
					title: '运费',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'运保卡抵扣渠道为运保卡抵扣的金额(最高8元)，无运保卡抵扣渠道为首重+续重费用之和（不足8元收8元）。'
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'overweightFee',
					title: '超重费',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'只有运保卡抵扣渠道有此金额，表示用户支付的运费金额（首重金额+续重金额-8元），最小值为0。'
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'insuranceFee',
					title: '保价费',
				},
				{
					type: 'amount',
					dataIndex: 'packingFee',
					title: '包装费',
				},
				{
					type: 'amount',
					dataIndex: 'contractFee',
					title: '合同运费',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'根据合同计算出来首重+续重金额之和'
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'settlementFee',
					title: '与顺丰结算费用',
				},
				{
					type: 'string',
					dataIndex: 'isSettlement',
					title: '是否需要结算',
					customRender: (row) => {
						const arr = ['否', '是']
						return arr[row.isSettlement]
					},
				},

				{
					type: 'date',
					dataIndex: 'listAddTime',
					title: '费用清单生成时间',
				},
				{
					type: 'date',
					dataIndex: 'listUpdateTime',
					title: '费用清单更新时间',
				},
				{
					type: 'action',
					dataIndex: 'version',
					title: '操作',
					width: 200,
					fixed: 'right',
					actions: [
						{
							title: '查询',
							auth: '/selectData',
							click: async (row) => {
								const {
									data: { resultCode },
								} = await selectData({
									collectionOrderId: row.collectionOrderId,
								})
								if (resultCode == 0) {
									this.init()
								}
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
					this.init()
				},
			},
		}
	},
	created() {
		this.init(true)
	},
	methods: {
		renderHeader(h, { column }, tip) {
			// 表头提示
			return h('div', [
				h('span', column.label),
				h(
					'el-tooltip',
					{
						props: {
							effect: 'dark',
							content: tip,
							placement: 'top',
						},
					},
					[
						h('i', {
							class: 'el-icon-question',
							style: 'color:#409EFF;margin-left:5px;',
						}),
					]
				),
			])
		},
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams()

			this.exportLoading = true
			let { data } = await collectionOrderExpensesExport(paramJson)
			this.exportLoading = false
			downloadFile(data, '订单支付.xls')
		},
		goDetail(afterSalesId) {
			this.$router.push({
				path: `/business/afterSaleOrderDetails/${afterSalesId}`,
			})
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formData101, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
				isLength: true,
			})
			paramJson.startTime = this.formData101.time
				? moment(this.formData101.time[0]).valueOf()
				: ''
			paramJson.endTime = this.formData101.time
				? moment(this.formData101.time[1]).valueOf()
				: ''
			return paramJson
		},
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.showLoading = true
			const {
				data: { resultCode, resultData },
			} = await collectionOrderExpenses(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records
				this.totalData = resultData || {}
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.totalData = {}
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.afterSty {
	cursor: pointer;
	color: #1890ff;
}
.tips {
	margin: 10px 0 20px;
	font-size: 16px;
	span {
		color: brown;
		font-weight: bold;
	}
}
</style>
