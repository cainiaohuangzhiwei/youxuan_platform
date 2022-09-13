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
				<template slot="refOrderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.refOrderId}`"
						><el-button type="text">{{
							scope.row.refOrderSn
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
	queryOrderApproveRecord,
	getOrderApproveRecordById,
} from '@/api/business'

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
				refOrderSn: '',
				id: '',
				auditStatus: '',
				startTime: moment().startOf('day').valueOf(),
				endTime: moment().endOf('day').valueOf(),
				type: 1,
			},
			formCfg101: [
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'refOrderSn',
				},
				{
					type: 'input',
					title: '爱库存取消发货事务ID',
					dataIndex: 'id',
				},
				{
					title: '申请取消发货状态',
					type: 'select',
					dataIndex: 'auditStatus',
					label: 'value',
					options: [
						{
							auditStatus: '',
							value: '全部',
						},
						{
							auditStatus: '0',
							value: '待审核',
						},
						{
							auditStatus: '1',
							value: '审核通过',
						},
						{
							auditStatus: '2',
							value: '审核拒绝',
						},
					],
				},

				{
					type: 'datetimerange',
					title: '提交时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
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
					dataIndex: 'id',
					title: '爱库存取消发货事务ID',
					width: '180',
				},
				{
					type: 'string',
					dataIndex: 'orderId',
					title: '上游二级订单编号',
					width: '180',
				},
				{
					type: 'string',
					dataIndex: 'orderDetailId',
					title: '上游三级订单编号',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'refOrderSn',
					title: '订单编号',
					width: '160',
				},
				{
					type: 'string',
					dataIndex: 'auditResult',
					title: '审核原因',
					width: '160',
				},
				{
					title: '审核状态',
					type: 'string',
					dataIndex: 'auditStatus',
					customRender: (row) => {
						const arr = ['待审核', '审核通过', '审核拒绝']
						return arr[row.auditStatus] || '-'
					},
				},
				{
					title: '提交时间',
					type: 'date',
					dataIndex: 'addTime',
					width: '150',
				},
				{
					title: '审核时间',
					type: 'date',
					dataIndex: 'approveTime',
					width: '150',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查询审核状态',
							auth: '',
							popconfirm: true,
							popconfirmTitle: '是否查询该审核状态？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								action.hide = row.auditStatus == 0 ? false : true
								return action
							},
							confirm: async (row) => {
								const {
									data: { resultCode, resultData },
								} = await getOrderApproveRecordById({
									approveId: row.id,
								})
								if (resultCode == 0) {
									if (row.auditStatus != resultData.auditStatus) {
										this.$message.success('状态已更新')
									} else {
										this.$message.warning('暂时无最新状态')
									}
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
			} = await queryOrderApproveRecord(paramJson)
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
				currentPage: this.page102.currentPage,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
