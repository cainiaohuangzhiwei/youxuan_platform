<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		>
			<template #selectTime>
				<el-date-picker
					v-model="searchData.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
				>
				</el-date-picker>
			</template>
		</yx-form>
		<el-table :data="tableData" style="width: 100%" v-loading="showLoading">
			<el-table-column
				prop="saleStartTime"
				label="售卖日期"
				width="180"
				align="center"
			>
				<template slot-scope="scope">
					{{
						`${formatDate(scope.row.saleStartTime)}-${formatDate(
							scope.row.saleEndTime
						)}`
					}}
				</template>
			</el-table-column>
			<el-table-column
				prop="goodsGroupName"
				label="会场"
				width="280"
				align="center"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.goodsGroupName">{{
						scope.row.goodsGroupName
					}}</span>
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="saleStatus"
				label="状态"
				width="120"
				align="center"
			>
				<template slot-scope="scope">
					{{ statusArr[scope.row.saleStatus - 1] }}
				</template>
			</el-table-column>
			<el-table-column label="预热期" align="center">
				<el-table-column
					prop="subscriptionCount"
					label="品牌订阅数"
					align="center"
				>
					<template slot-scope="scope">
						{{ scope.row.subscriptionCount }}
					</template>
				</el-table-column>
				<el-table-column
					prop="preheatPageShareCnt"
					label="分享数"
					align="center"
				>
					<template slot-scope="scope">
						{{ scope.row.preheatPageShareCnt }}
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column label="预热效果" align="center">
				<el-table-column prop="payUserCount" label="支付人数" align="center">
				</el-table-column>
				<el-table-column
					prop="subscribeOrderRate"
					label="订阅成单率"
					width="220"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.subscribeOrderRate"
							>{{ scope.row.subscribeOrderRate }}%</span
						>
						<span v-else>-</span>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="page.currentPage"
			:page-sizes="[10, 30, 50, 100]"
			:page-size="page.length"
			layout="total, sizes, prev, pager, next, jumper"
			:total="page.count"
		></el-pagination>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { goodsGroupDataAnalysisList } from '@/api/warmUp'
export default {
	components: {
		YxForm,
	},
	data() {
		return {
			page: {
				length: 10,
				currentPage: 1,
				count: 0,
			},
			statusArr: ['预售中', '售卖中', '已结束'],
			showLoading: false,
			tableData: [],
			searchData: {
				goodsGroupName: '',
				time: '',
			},
			searchCfg: [
				{
					// title: '时间:',
					type: 'custom',
					dataIndex: 'selectTime',
				},
				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'goodsGroupName',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.queryData(true)
					},
				},
			],
		}
	},
	methods: {
		init() {
			this.queryData()
		},
		handleSizeChange(val) {
			this.page.length = val
			this.queryData()
		},
		handleCurrentChange(val) {
			this.page.currentPage = val
			this.queryData()
			console.log(`当前页: ${val}`)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				// startIndex: 0,
				length: 1,
				groupId: 2,
				goodsGroupName: this.searchData.goodsGroupName,
			}
			if (this.searchData.time && this.searchData.time.length > 1) {
				paramJson.startTime = moment(this.searchData.time[0]).valueOf()
				paramJson.endTime = moment(this.searchData.time[1]).valueOf()
			} else {
				paramJson.startTime = ''
				paramJson.endTime = ''
			}
			// 每页的加载数据长度
			paramJson.length = this.page.length
			if (flag) {
				this.page.currentPage = 1
			}
			// 当前页的条数开始
			paramJson.currentPage = this.page.currentPage
			return paramJson
		},
		queryData: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await goodsGroupDataAnalysisList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		formatDate(date) {
			return moment(date).format('YYYY.MM.DD HH:mm:ss')
		},
	},
}
</script>
<style scoped>
.el-pagination {
	padding: 22px 10px;
	text-align: center;
}
</style>
