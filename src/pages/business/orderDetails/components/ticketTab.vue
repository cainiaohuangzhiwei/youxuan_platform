<template>
	<div>
		<yx-table
			:select="false"
			v-loading="loading"
			:columns="tableColumns108"
			:data="tableData108"
		>
			<template slot="ticketId" slot-scope="scope">
				<div>
					<el-link
						v-if="ticketList"
						@click="workorderDetails(scope.row.serviceTicketId)"
						type="primary"
						>{{ scope.row.ticketId }}</el-link
					>
					<p v-else>{{ scope.row.ticketId }}</p>
				</div>
			</template>
			<template slot="afterSalesSn" slot-scope="scope">
				<el-button type="text">
					<router-link
						v-if="scope.row.afterSalesId"
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						>{{ scope.row.afterSalesSn }}</router-link
					>
				</el-button>
			</template>
		</yx-table>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { checkFunctionCode } from '@/utils/auth.js'
import { ticketList } from '@/api/serviceTicket'
export default {
	components: {
		YxTable,
	},
	props: {},
	data() {
		return {
			ticketList: checkFunctionCode('ticketList'),
			loading: false,
			orderId: this.$route.params.orderId,
			isShow: false,
			tableData108: [],
			tableColumns108: [
				{
					type: 'custom',
					title: '工单ID',
					dataIndex: 'ticketId',
				},
				{
					type: 'newMap',
					dataIndex: 'ticketType',
					title: '工单类型',
					options: [
						['1', '审核结果沟通'],
						['2', '验货结果沟通'],
						['3', '售后申诉'],
						['4', '二次申诉'],
					],
				},
				{
					type: 'custom',
					title: '关联售后单号',
					dataIndex: 'afterSalesSn',
				},
				{
					type: 'newMap',
					dataIndex: 'ticketStatus',
					title: '工单状态',
					options: [
						['1', '待接单'],
						['2', '待平台处理'],
						['3', '待商家回复'],
						['4', '已完结'],
					],
				},
				{
					type: 'string',
					title: '接单人',
					dataIndex: 'staffName',
				},
				{
					type: 'date',
					title: '创建时间',
					dataIndex: 'ticketCreateTime',
				},
			],
		}
	},

	methods: {
		async init() {
			this.loading = true
			if (!this.orderId) return
			let {
				data: { resultCode, resultData },
			} = await ticketList({
				orderId: this.orderId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.isShow = true
				this.tableData108 = resultData.serviceTicketList
			} else {
				this.tableData108 = []
			}
		},
		workorderDetails(serviceTicketId) {
			this.$router.push({
				path: `/business/workorderDetails/${serviceTicketId}`,
			})
		},
	},
}
</script>
