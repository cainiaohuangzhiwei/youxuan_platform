<template>
	<basic-container>
		<el-button type="primary" style="margin-bottom: 20px" @click="init(true, 1)"
			>查询</el-button
		>
		<!-- v-auth="'listOrganizationSettleStatistics'" -->
		<div>
			<el-row>
				<el-table
					:data="tableData"
					show-summary
					:summary-method="getSummaries"
					@selection-change="selectionChange"
					style="width: 100%; margin-top: 20px"
				>
					<el-table-column type="selection" width="55"> </el-table-column>
					<el-table-column prop="channelName" label="通道名称">
					</el-table-column>
					<el-table-column prop="mchName" label="商户名称"> </el-table-column>
					<el-table-column prop="mchId" label="平台商户号"> </el-table-column>
					<el-table-column prop="balance" label="实时余额">
						<template slot-scope="scope">
							<div>
								{{
									scope.row.balance ? numberFormat(scope.row.balance, 2) : '-'
								}}
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { numberFormat } from '@/utils/helper/common'
import { realTimeList } from '@/api/weeget-bullet-payment-rest-fors'
// import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		BasicContainer,
	},
	name: 'FormTable',

	data() {
		return {
			// listOrganizationSettleStatistics: checkFunctionCode(
			// 	'listOrganizationSettleStatistics'
			// ),
			loading: false,
			numberFormat: numberFormat,
			searchData: {},
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true, 0)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'channelName',
					title: '通道名称',
				},
				{
					dataIndex: 'mchName',
					title: '商户名称',
				},
				{
					dataIndex: 'mchId',
					title: '平台商户号',
				},
				{
					dataIndex: 'balance',
					type: 'amount',
					title: '实时余额',
				},
			],
			// page: {
			// 	count: 0,
			// 	length: 10,
			// 	currentPage: 1,
			// 	tableChange: () => {
			// 		this.init()
			// 	},
			// },
			selectedList: [], // 列表选中信息
		}
	},

	created() {
		this.init(true, 0)
	},

	methods: {
		getSummaries(param) {
			const { columns, data } = param
			const sums = []
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '总和'
					return
				}
				if (index === 4) {
					//获取每列数值
					const values = data.map((item) => Number(item[column.property]))
					if (!values.every((value) => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr)
							if (!isNaN(value)) {
								return prev + curr
							} else {
								return prev
							}
						}, 0)
						sums[index] = numberFormat(sums[index], 2) + ' 元'
					} else {
						sums[index] = ''
					}
				}
			})
			return sums
		},
		selectionChange(list) {
			// 勾选回调
			this.selectedList = list
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		// 列表
		async init(flag, v) {
			if (this.selectedList.length === 0 && v === 1) {
				this.$message.warning(
					'需要进行勾选后，才能点击查询对应通道的汇总实时余额'
				)
				return
			}
			let paramJson = Object.assign(this.searchData)
			let accountIds = this.selectedList.map((item) => {
				return item.accountId
			})
			paramJson.accountIds = accountIds
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await realTimeList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData || []
			} else {
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scope>
.stateColor {
	display: inline-block;
	border-radius: 5px;
	margin: 0 5px 0 0;
	width: 10px;
	height: 10px;
}
.color-1 {
	background-color: red;
}
.color-2 {
	background-color: rgb(104, 182, 255);
}
.color-3 {
	background-color: #fdbd39;
}
.color-4 {
	background-color: #2ea522;
}
</style>
