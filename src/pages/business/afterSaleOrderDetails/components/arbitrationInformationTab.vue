<template>
	<div>
		<yx-table
			:select="false"
			v-loading="loading"
			:columns="tableColumns108"
			:data="tableData108"
		>
			<template slot="arbitrationSn" slot-scope="scope">
				<router-link :to="`/business/afterArbitrationDetails/${scope.row.id}`"
					><el-button type="text">{{
						scope.row.arbitrationSn
					}}</el-button></router-link
				>
			</template>
		</yx-table>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { checkFunctionCode } from '@/utils/auth.js'
import { afterSalesArbitrationPage } from '@/api/afterSales'
export default {
	components: {
		YxTable,
	},
	props: {
		afterSalesSn: {
			type: String,
			define: false,
		},
	},
	data() {
		return {
			ticketList: checkFunctionCode('ticketList'),
			loading: false,
			isShow: false,
			tableData108: [],
			tableColumns108: [
				{
					type: 'custom',
					dataIndex: 'arbitrationSn',
					title: '售后仲裁单号',
				},
				{
					type: 'string',
					dataIndex: 'arbitrationTypeStr',
					title: '仲裁类型',
				},

				{
					type: 'string',
					dataIndex: 'arbitrationState',
					title: '仲裁状态',
					customRender: (row) => {
						if (row.arbitrationState == 1) {
							return '待商家处理'
						} else if (row.arbitrationState == 2) {
							return '待平台处理'
						} else if (row.arbitrationState == 3) {
							return '已关闭'
						} else if (row.arbitrationState == 4) {
							return '仲裁完成'
						} else {
							return '-'
						}
					},
				},
			],
		}
	},
	created() {},
	methods: {
		async _init() {
			this.loading = true
			if (!this.afterSalesSn) return
			let {
				data: { resultCode, resultData },
			} = await afterSalesArbitrationPage({
				pageNum: 1,
				pageSize: 10,
				platformType: 4,
				afterSalesSn: this.afterSalesSn,
			})
			this.loading = false
			if (resultCode == 0) {
				this.isShow = true
				this.tableData108 = resultData.records
			} else {
				this.tableData108 = []
			}
		},
	},
}
</script>

<style></style>
