<template>
	<div>
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
			><template slot="amount" slot-scope="scope">
				<div class="green" v-if="scope.row.balanceType == 1">
					-￥{{ scope.row.amount.toFixed(2) }}
				</div>
				<div class="red" v-if="scope.row.balanceType == 2">
					+￥{{ scope.row.amount.toFixed(2) }}
				</div>
			</template></yx-table
		>
	</div>
</template>

<script>
import moment from 'moment'
import { shopkeeperAccountPaymentDetails } from '@/api/newFund'
import YxTable from '@wg-vue-materials/yx-table'
import { isNull } from '@/utils/helper/common'

export default {
	components: {
		YxTable,
	},
	props: {
		searchData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			showLoading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'date',
					dataIndex: 'createTime',
					title: '时间',
				},
				{
					type: 'custom',
					dataIndex: 'amount',
					title: '金额',
				},
				{
					type: 'string',
					dataIndex: 'balanceType',
					title: '类型',
					customRender: (row) => {
						const arr = ['', '出账', '入账']
						return arr[row.balanceType]
					},
				},
				{
					type: 'amount',
					dataIndex: 'balance',
					title: '余额',
				},
				{
					type: 'string',
					dataIndex: 'businessType',
					title: '交易摘要',
					customRender: (row) => {
						const arr = [
							'',
							'可赚金结算',
							'余额下单',
							'余额退款',
							'备用金',
							'提现成功',
							'个人所得税',
							'-',
							'账户转账',
							'可赚金退回',
						]

						return arr[row.businessType]
					},
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'businessSn',
					title: '业务单号',
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
		this.init()
	},
	methods: {
		async init() {
			const params = this.findSearchParams()
			if (isNull(params.startTime) || isNull(params.endTime)) {
				this.$message.warning({
					message: '请选择时间区间',
				})
				return false
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await shopkeeperAccountPaymentDetails({
				...params,
				accountSn: this.$route.params.id,
				accountType: 6,
			})
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.list || []
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				weegetAccountId: this.$route.params.accountId,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			paramJson.curPage = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
	},
}
</script>

<style lang="scss" scoped>
.green {
	color: rgb(9, 187, 135);
}
.red {
	color: rgb(253, 67, 55);
}
</style>
