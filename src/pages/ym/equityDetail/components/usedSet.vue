<template>
	<div class="shopStatistics">
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
				<template slot="orderId" slot-scope="scope">
					<div>
						<!-- <el-button
							type="text"
							v-if="scope.row.orderId && scope.row.orderSn"
						> -->
						<router-link
							v-if="scope.row.orderId && scope.row.orderSn"
							:to="`/business/orderDetails/${scope.row.orderId}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
						<!-- </el-button> -->
						<span v-else>-</span>
					</div>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getEquityUsed } from '@/api/yhtPlusCmsEquity'
// import moment from 'moment'

export default {
	components: { BasicContainer, YxForm, YxTable },
	props: {
		params: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			formData101: {
				creatorId: '',
				creatorName: '',
				startTime: '',
				endTime: '',
			},
			formCfg101: [
				{
					type: 'input',
					dataIndex: 'creatorId',
					title: '用户ID',
					placeholder: '用户ID',
				},
				{
					type: 'input',
					dataIndex: 'creatorName',
					title: '用户名称',
					placeholder: '用户名称',
				},
				{
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					title: '领取时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
					},
					tableId: 102,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'equityReceivedId',
					title: '权益卡子ID',
				},
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '用户名称',
				},
				{
					type: 'date',
					dataIndex: 'receiveTime',
					title: '领取时间',
				},
				{
					type: 'custom',
					dataIndex: 'orderId',
					title: '使用订单',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '使用时间',
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	methods: {
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getEquityUsed(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.equityUsedList
				this.page102.count = resultData.count
			} else {
				this.tableData102 = []
				this.page102.count = 0
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
				equityId: this.params.equityId,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
