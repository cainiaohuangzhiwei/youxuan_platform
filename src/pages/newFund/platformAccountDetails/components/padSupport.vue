<template>
	<div>
		<el-row class="two-msg" :gutter="20">
			<el-col :span="6"
				>累计垫资次数：{{ allData.advanceFundCount || 0 }}次</el-col
			>
			<el-col :span="6"
				>累计垫资金额：{{
					numberFormat(allData.advanceFundPrice || 0, 2)
				}}元</el-col
			>
			<el-col :span="6"
				>累计垫资退回次数：{{ allData.advanceFundBackCount || 0 }}次</el-col
			>
			<el-col :span="6"
				>累计垫资退回金额：{{
					numberFormat(allData.advanceFundBackPrice || 0, 2)
				}}元</el-col
			>
		</el-row>
		<!-- <el-button type="primary" class="two-button">导出查询结果</el-button> -->
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
import { paymentAdvanceFundDetails } from '@/api/newFund'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
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
			numberFormat,
			showLoading: false,
			allData: {},
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
				// {
				// 	type: 'string',
				// 	dataIndex: 'borrowAccountName',
				// 	title: '商家名称',
				// },
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '退款单号',
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
		async init(flag) {
			const params = this.findSearchParams(flag)
			if (isNull(params.startTime) || isNull(params.endTime)) {
				this.$message.warning({
					message: '请选择时间区间',
				})
				return false
			}
			this.showLoading = true

			let {
				data: { resultCode, resultData },
			} = await paymentAdvanceFundDetails({
				...params,
				accountSn: this.$route.params.id,
			})
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.list || []
				this.allData = resultData || {}
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.allData = {}
				this.tableData = []
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				JSON.parse(JSON.stringify(this.searchData)),
				{
					weegetAccountId: this.$route.params.accountId,
					businessType: 2,
				}
			)
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
