<template>
	<div class="equityIncomeList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData110"
				:items="formCfg110"
				:formAction="formAction110"
			>
			</yx-form>
			<yx-accounts :items="accountItems112"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns111"
				:pagination="page111"
				:data="tableData111"
			>
				<template slot="equitySn" slot-scope="scope">
					<div>
						<p>{{ scope.row.equitySn }}</p>
						<p>
							{{
								moment(scope.row.equityAddTime).format('YYYY年MM月DD日HH:mm')
							}}
						</p>
					</div>
				</template>
				<template slot="orderSn" slot-scope="scope">
					<div>
						<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
						<p>
							{{ moment(scope.row.orderAddTime).format('YYYY年MM月DD日HH:mm') }}
						</p>
					</div>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { getEquityIncomeListByCondition } from '@/api/yhtPlusCmsFinance'

export default {
	name: 'EquityIncomeList',
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
	},
	props: [],
	data() {
		return {
			moment,
			loading: false,
			formData110: {
				orderSn: '',
				equitySn: '',
				addTimeStart: moment().startOf('day').valueOf(),
				addTimeEnd: moment().endOf('day').valueOf(),
			},
			formCfg110: [
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					type: 'input',
					title: '权益单号',
					dataIndex: 'equitySn',
					placeholder: '请输入权益单号',
				},
				{
					type: 'datetimerange',
					title: '统计时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction110: [
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
						if (!this.loading) this.getData111(true)
					},
					tableId: 111,
				},
			],
			accountItems112: [
				{
					type: 'amount',
					title: '订单额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '平台保障费收入',
					value: '0.00',
				},
			],
			tableData111: [],
			tableColumns111: [
				{
					type: 'custom',
					dataIndex: 'equitySn',
					title: '权益订单号',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'amount',
					dataIndex: 'orderAmount',
					title: '订单额',
				},
				{
					type: 'amount',
					dataIndex: 'equityOrderAmount',
					title: '平台保障费收入',
				},
			],
			page111: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData111()
				},
			},
		}
	},

	created() {
		this.getData111(true)
	},

	methods: {
		async getData111(flag) {
			this.loading = true
			let paramJson = this.findSearchParams111(flag)
			const {
				data: { resultCode, resultData },
			} = await getEquityIncomeListByCondition(paramJson)
			if (resultCode == 0) {
				this.accountItems112[0].value =
					(resultData.equityStatistics &&
						resultData.equityStatistics.orderTotalAmount) ||
					0
				this.accountItems112[1].value =
					(resultData.equityStatistics &&
						resultData.equityStatistics.equityIncomeAmount) ||
					0
				this.tableData111 = resultData.equityIncomeOrderList
				this.page111.count = resultData.count
			} else {
				this.accountItems112[0].value = 0
				this.accountItems112[1].value = 0
				this.tableData111 = []
				this.page111.count = 0
			}
			this.loading = false
		},
		findSearchParams111(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page111.currentPage = 1
			}
			const paramJson = Object.assign(this.formData110, {
				length: this.page111.length,
				startIndex: (this.page111.currentPage - 1) * this.page111.length,
			})
			return paramJson
		},
	},
}
</script>
