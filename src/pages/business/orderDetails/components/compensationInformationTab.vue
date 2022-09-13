<template>
	<div>
		<yx-table
			:select="false"
			v-loading="loading"
			:columns="tableColumns108"
			:data="tableData108"
		>
		</yx-table>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { checkFunctionCode } from '@/utils/auth.js'
import { queryAfterSalesOrderCompensateList } from '@/api/afterSales'
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
					type: 'string',
					title: '上游订单号',
					dataIndex: 'orderId',
				},
				{
					type: 'string',
					title: '上游三级订单号',
					dataIndex: 'orderDetailId',
				},
				{
					type: 'amount',
					title: '赔付金额',
					dataIndex: 'compensatePrice',
				},
				{
					type: 'date',
					title: '生成时间',
					dataIndex: 'addTime',
				},
			],
		}
	},

	methods: {
		async init() {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await queryAfterSalesOrderCompensateList({
				orderId: this.orderId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.isShow = true
				this.tableData108 = resultData
			} else {
				this.tableData108 = []
			}
		},
	},
}
</script>
