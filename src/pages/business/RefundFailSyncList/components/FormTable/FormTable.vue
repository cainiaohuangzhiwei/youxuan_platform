<template>
	<div class="SearchKeyword">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</template>
				<template slot="afterSalesSn" slot-scope="scope">
					<router-link
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						><el-button type="text">{{
							scope.row.afterSalesSn
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
import {
	userCompensationWithdrawRefundList,
	removeUserCompensationWithdrawRefund,
} from '@/api/cmsCompensationWithdrawRefund'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			loading: false,
			formData101: {
				orderSn: '',
				afterSalesSn: '',
				deleteState: '',
				refundSn: '',
				refundStatus: '',
				addStartTime: moment().startOf('day').valueOf(),
				addEndTime: moment().endOf('day').valueOf(),
			},
			formCfg101: [
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
				},
				{
					type: 'input',
					title: '售后单号',
					dataIndex: 'afterSalesSn',
				},
				{
					title: '退款单号',
					type: 'input',
					dataIndex: 'refundSn',
				},
				{
					title: '数据状态',
					type: 'select',
					dataIndex: 'deleteState',
					label: 'value',
					options: [
						{
							deleteState: '',
							value: '全部',
						},
						{
							deleteState: '0',
							value: '正常',
						},
						{
							deleteState: '1',
							value: '已删除',
						},
					],
				},
				{
					title: '转账状态',
					type: 'select',
					dataIndex: 'refundStatus',
					label: 'value',
					options: [
						{
							refundStatus: '',
							value: '全部',
						},
						{
							refundStatus: '1',
							value: '转账成功',
						},
						{
							refundStatus: '2',
							value: '转账失败',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '生成时间',
					dataIndex: ['addStartTime', 'addEndTime'],
					placeholder: ['开始生成时间', '结束生成时间'],
				},
			],
			formAction101: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'refundSn',
					title: '退款单号',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单编号',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '售后单号',
					width: '160',
				},
				{
					title: '金额',
					type: 'amount',
					dataIndex: 'refundAmount',
				},
				{
					title: '转账状态',
					type: 'string',
					dataIndex: 'refundStatus',
					customRender: (row) => {
						const arr = ['', '转账成功', '转账失败']
						return arr[row.refundStatus] || '-'
					},
				},
				{
					title: '数据状态',
					type: 'string',
					dataIndex: 'deleteState',
					customRender: (row) => {
						const arr = ['正常', '已删除']
						return arr[row.deleteState] || '-'
					},
				},
				{
					title: '生成时间',
					type: 'date',
					dataIndex: 'addTime',
					width: '150',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'removeUserCompensationWithdrawRefund',
							popconfirm: true,
							popconfirmTitle: '是否删除该记录？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								action.hide =
									row.refundStatus == 2 && row.deleteState == 0 ? false : true
								return action
							},
							confirm: async (row) => {
								const {
									data: { resultMsg, resultCode },
								} = await removeUserCompensationWithdrawRefund({
									userCompensationWithdrawRefundId:
										row.userCompensationWithdrawRefundId,
								})
								if (resultCode == 0) {
									this.$message.success(resultMsg)
									this.getData102(true)
								}
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},
	methods: {
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await userCompensationWithdrawRefundList(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.records
				this.page102.count = resultData.total
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
