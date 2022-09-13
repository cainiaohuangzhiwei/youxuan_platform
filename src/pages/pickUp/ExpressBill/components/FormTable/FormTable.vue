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
	collectionOrderList,
	collectionOrderExport,
	collectionOrderCancel,
} from '@/api/collectionOrder'
import moment from 'moment'
import { getConstantValueByKey, downloadFile } from '@/utils/helper/common'

export default {
	components: {
		YxForm,
		YxTable,
	},
	data() {
		return {
			lll: [1, 2, 3, 4, 5],
			exportLoading: false,
			showLoading: false,
			formData101: {
				afterSalesSn: '',
				orderSn: '',
				collectionOrderSn: '',
				transactionSn: '',
				collectionStatus: '',
				trackingNum: '',
				equityReductionFlag: '',
				time: [
					moment().startOf('day').valueOf(),
					moment().endOf('day').valueOf(),
				],
			},
			formCfg101: [
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
					type: 'input',
					title: '揽件订单号',
					dataIndex: 'collectionOrderSn',
					enter: () => {
						this.init(true)
					},
				},
				// {
				// 	type: 'input',
				// 	title: ' 交易单号',
				// 	dataIndex: 'transactionSn',
				// 	enter: () => {
				// 		this.init(true)
				// 	},
				// },
				{
					type: 'select',
					title: '揽件订单状态',
					dataIndex: 'collectionStatus',
					label: 'value',
					options: this.$store.state.app.constant.collection_status,
					change: () => {
						this.init(true)
					},
				},
				{
					type: 'input',
					title: '运单号：',
					dataIndex: 'trackingNum',
					enter: () => {
						this.init(true)
					},
				},
				{
					type: 'select',
					title: '权益卡锁定状态',
					dataIndex: 'equityReductionFlag',
					label: 'value',
					options: this.$store.state.app.constant.equity_reduction_flag,
					change: () => {
						this.init(true)
					},
				},
				{
					type: 'time',
					title: '提交时间',
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
					auth: '/collectionOrder/export',
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
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '售后单号',
					width: 200,
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.$router.push({
									path: `/business/afterSaleOrderDetails/${row.afterSalesId}`,
								})
							},
							customRender: (action, row) => {
								action.title = row.afterSalesSn
								return action
							},
						},
					],
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
				// {
				// 	type: 'string',
				// 	dataIndex: 'transactionSn',
				// 	title: '交易单号',
				// },
				{
					type: 'string',
					dataIndex: 'expressPlatform',
					title: '物流公司',
					customRender: (row) => {
						const arr = ['-', '顺丰']
						return arr[row.expressPlatform]
					},
				},
				{
					type: 'string',
					dataIndex: 'trackingNum',
					title: '运单号',
				},
				{
					type: 'string',
					dataIndex: 'collectionStatus',
					title: '揽件订单状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.collection_status,
							row.collectionStatus,
							'-',
							'collectionStatus'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'equityReductionFlag',
					title: '权益卡锁定状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.equity_reduction_flag,
							row.equityReductionFlag,
							'-',
							'equityReductionFlag'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'equityOrderSn',
					title: '锁定权益卡订单号',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '提交时间',
				},
				{
					type: 'action',
					dataIndex: 'version',
					title: '操作',
					width: 200,
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							auth: '/collectionOrderDetail/detail',
							click: (row) => {
								this.$router.push({
									path: `/pickUp/expressBillDetail/${row.id}`,
								})
							},
						},
						{
							title: '取消揽件订单',
							auth: '/collectionOrder/cancel',
							click: (row) => {
								this.cancelIt(row)
							},
							customRender: (action, row) => {
								// 待确认、待接单、待取件
								let status =
									row.collectionStatus == 0 ||
									(row.collectionStatus != 1 &&
										row.collectionStatus != 2 &&
										row.collectionStatus != 3)
								action.hide = status
								return action
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
		goDetail(afterSalesId) {
			this.$router.push({
				path: `/business/afterSaleOrderDetails/${afterSalesId}`,
			})
		},
		cancelIt(row) {
			this.$prompt(`取消揽件订单`, '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入取消原因（最多30字符）',
				inputPlaceholder: '请输入取消原因（最多30字符）',
				inputType: 'textarea',
				customClass: 'winClass', //弹窗样式
				inputValidator: (value) => {
					if (value.trim().length > 30) {
						return '取消原因最多30字符'
					}
				},
			}).then(
				async ({ value }) => {
					const {
						data: { resultCode },
					} = await collectionOrderCancel({
						id: row.id,
						cancelReason: value,
					})
					if (resultCode == 0) {
						this.$message.success('取消成功')
						this.init()
					}
				},
				() => {}
			)
		},
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams()
			this.exportLoading = true
			let { data } = await collectionOrderExport(paramJson)
			this.exportLoading = false
			downloadFile(data, '揽件单.xls')
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formData101, {
				pageNum: this.page.currentPage,
				pageSize: this.page.length,
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
			} = await collectionOrderList(paramJson)
			this.showLoading = false
			if (resultCode == 0 && resultData.records.length > 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
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
</style>
