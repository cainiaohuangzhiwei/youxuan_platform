<template>
	<basicContainer>
		<yx-form
			:inline="true"
			:data="formData187"
			:items="formCfg187"
			:formAction="formAction187"
		>
		</yx-form>
		<yx-table
			v-loading="loading"
			:columns="tableColumns188"
			:pagination="page188"
			:data="tableData188"
		>
			<template slot="orderSn" slot-scope="scope">
				<div>
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</div>
			</template>
		</yx-table>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import { pageEvaluationList, exportEvaluationList } from '@/api/evaluation'
export default {
	name: 'WorkOrderEvaluationList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			tableColumns188: [
				{
					type: 'string',
					dataIndex: 'serviceRecordId',
					title: '工单编号',
				},
				{
					type: 'custom',
					width: '210',
					dataIndex: 'orderSn',
					title: '订单编号',
				},
				{
					type: 'string',
					dataIndex: 'afterSalesSn',
					title: '售后单号',
				},
				{
					type: 'string',
					dataIndex: 'resultScore',
					title: '处理结果',
				},
				{
					type: 'string',
					dataIndex: 'speedScore',
					title: '处理速度',
				},
				{
					type: 'string',
					dataIndex: 'attitudeScore',
					title: '处理态度',
				},
				{
					type: 'string',
					dataIndex: 'content',
					title: '详细描述',
				},
				{
					type: 'date',
					dataIndex: 'serviceRecordAddTime',
					title: '工单提交时间',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '评价提交时间',
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			tableData188: [],
			loading: false,
			formData187: {
				serviceRecordId: '',
				orderSalesSn: '',
				sortField: 0,
				startAddTime: moment().startOf('day').valueOf(),
				endAddTime: moment().endOf('day').valueOf(),
				serviceRecordStartAddTime: '',
				serviceRecordEndAddTime: '',
			},
			formCfg187: [
				{
					type: 'input',
					dataIndex: 'serviceRecordId',
					title: '工单编号',
				},
				{
					type: 'input',
					dataIndex: 'orderSalesSn',
					title: '订单编号',
				},
				{
					type: 'datetimerange',
					dataIndex: ['serviceRecordStartAddTime', 'serviceRecordEndAddTime'],
					title: '工单提交时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					title: '提交时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			exportLoading: false,
			formAction187: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '导出',
					type: 'success',
					auth: 'exportServiceRecordEvaluationList',
					click: async () => {
						if (this.exportLoading) return
						this.exportLoading = true
						let paramJson = this.findSearchParams()
						let { data } = await exportEvaluationList(paramJson)
						downloadFile(data, '工单评价列表.xlsx')
						this.exportLoading = false
					},
				},
			],
		}
	},
	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			const paramJson = Object.assign(this.formData187, {
				length: this.page188.length,
				currentPage: this.page188.currentPage,
			})
			return paramJson
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await pageEvaluationList(paramJson)
			if (resultCode === 0) {
				this.tableData188 = resultData.records
				this.page188.count = resultData.total
			}
			this.loading = false
		},
	},
}
</script>
