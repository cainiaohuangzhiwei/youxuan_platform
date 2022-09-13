<template>
	<basic-container>
		<div v-auth="'listOrganizationSettleStatistics'">
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="form-msg">
						{{ dateInfo }}
					</div></el-col
				>
			</el-row>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="settleStatus" slot-scope="scope">
						<span :class="'stateColor color-' + scope.row.settleStatus"></span>
						<span>
							{{ settleStatusChange(scope.row.settleStatus) }}
						</span>
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { orgMonthSettleDetail } from '@/api/shopSettlement'
import { checkFunctionCode } from '@/utils/auth.js'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			listOrganizationSettleStatistics: checkFunctionCode(
				'listOrganizationSettleStatistics'
			),
			showLoading: false,
			searchData: {
				organizationId: '', //店主id
			},
			dateInfo: '', //收益结算日期
			searchCfg: [
				{
					title: '店主ID',
					type: 'input',
					dataIndex: ['organizationId'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '重置',
					click: () => {
						this.resetForm()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'amount',
					dataIndex: 'settleAmount',
					title: '店主结算金额',
				},
				{
					type: 'custom',
					dataIndex: 'settleStatus',
					title: '状态',
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

	mounted() {},

	methods: {
		// 重置
		resetForm() {
			this.searchData = {
				organizationId: '',
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				monthSettleStatisticsId: this.$route.params.monthSettleStatisticsId,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		init: async function (flag) {
			if (!this.listOrganizationSettleStatistics) return
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await orgMonthSettleDetail(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.list || []
				this.page.count = resultData.count || 0
				this.dateInfo =
					moment(resultData.monthSettle).format('YYYY年MM月') +
					'收益-' +
					moment(resultData.monthSettleDate).format('MM月DD日')
			} else {
				this.page.count = 0
				this.tableData = []
				this.dateInfo = ''
			}
		},
		settleStatusChange(settleStatus) {
			//结算状态: 1.待发放 2.确认发放 3.发放中 4.已发放
			const arr = ['', '待发放', '确认发放', '发放中', '已发放']
			return arr[settleStatus] || '-'
		},
	},
}
</script>

<style lang="scss" scope>
.form-msg {
	font-size: 14px;
	color: #606266;
	margin-bottom: 14px;
	span {
		color: brown;
	}
}
.el-col .el-form-item--small.el-form-item {
	margin-bottom: 0;
}
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
