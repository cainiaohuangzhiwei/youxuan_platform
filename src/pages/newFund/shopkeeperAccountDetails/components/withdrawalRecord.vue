<template>
	<div>
		<el-row class="two-msg" :gutter="20">
			<el-col :span="6"
				>累计提现次数：{{ allData.withdrawalCount || 0 }}次</el-col
			>
			<el-col :span="6"
				>累计提现金额：{{
					numberFormat(allData.withdrawalPrice || 0, 2)
				}}元</el-col
			>
		</el-row>
		<!-- <el-button type="primary" class="two-button">导出查询结果</el-button> -->
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		></yx-table>
	</div>
</template>

<script>
import moment from 'moment'
import { sftShopAccountWithdrawalRecordList } from '@/api/newFund'
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
					dataIndex: 'finishTime',
					title: '时间',
				},
				{
					type: 'amount',
					dataIndex: 'withdrawAmount',
					title: '提现金额',
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '收款账户',
				},

				{
					type: 'string',
					dataIndex: 'withdrawStatus',
					title: '状态',
					customRender: (row) => {
						const arr = ['创建', '提现中', '提现成功', '提现失败', '提现异常']
						return arr[row.withdrawStatus]
					},
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
			} = await sftShopAccountWithdrawalRecordList({
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
			let paramJson = Object.assign(this.searchData, {
				weegetAccountId: this.$route.params.accountId,
				businessType: 2,
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

<style lang="scss" scoped></style>
