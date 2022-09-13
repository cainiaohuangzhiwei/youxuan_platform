<template>
	<div v-auth="'listOrganizationSettleStatistics'">
		<WgForm
			:inline="true"
			:actionInline="true"
			:data="searchData"
			:formAction="searchAction"
		></WgForm>
		<el-row>
			<YxTable
				v-loading="loading"
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
			</YxTable>
		</el-row>
	</div>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import {
	orgMonthSettleStatisticsList,
	orgMonthSettleStatisticsConfirm,
} from '@/api/shopSettlement'
import { checkFunctionCode } from '@/utils/auth.js'
import moment from 'moment'
export default {
	components: {
		WgForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			listOrganizationSettleStatistics: checkFunctionCode(
				'listOrganizationSettleStatistics'
			),
			loading: false,
			numberFormat: numberFormat,
			searchData: {},
			searchAction: [
				{
					title: '刷新',
					type: 'primary',
					align: 'right',
					click: () => {
						if (!this.loading) this.init(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'settleMonth',
					title: '结算批次',
					customRender: (row) => {
						return (
							moment(row.settleMonth).format('YYYY年MM月') +
							'收益-' +
							moment(row.dataMonth).format('MM月DD日')
						)
					},
				},
				{
					dataIndex: 'addTime',
					title: '创建日期',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					dataIndex: 'settleOrganizationTotalCount',
					title: '应结算店主数量',
				},
				{
					dataIndex: 'settleOrganizationTotalAmount',
					type: 'amount',
					title: '总应结算店主金额',
				},
				{
					dataIndex: 'hasSettleOrganizationTotalCount',
					title: '已结算店主数量',
				},
				{
					dataIndex: 'hasSettleOrganizationTotalAmount',
					type: 'amount',
					title: '已结算店主金额',
				},
				{
					type: 'custom',
					dataIndex: 'settleStatus',
					title: '状态',
				},
				{
					dataIndex: 'operator',
					title: '发放人',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							auth: 'organizationQueryAccountDetail',
							click: (row) => {
								this.shopAccountDetails(row)
							},
						},
						{
							title: '确认发放',
							auth: 'comfirmOrganizationSettleStatisticsGrant',
							popconfirm: true,
							popconfirmTitle: '是否确认发放？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								const status = row.settleStatus == 1 //结算状态为待结算时显示该按钮
								action.hide = !status
								return action
							},
							confirm: async (row) => {
								this.confirmToIssue(row)
							},
						},
					],
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
		//商家账户详情
		shopAccountDetails(row) {
			this.$router.push({
				path: `shopSettlementDetails/${row.monthSettleStatisticsId}`,
			})
		},
		//确认发放
		async confirmToIssue(row) {
			const {
				data: { resultMsg, resultData },
			} = await orgMonthSettleStatisticsConfirm({
				monthSettleStatisticsId: row.monthSettleStatisticsId,
			})
			if (resultData) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		// 店主账户列表
		async init(flag) {
			if (!this.listOrganizationSettleStatistics) return
			let paramJson = this.findSearchParams(flag)
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await orgMonthSettleStatisticsList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.list || []
				this.page.count = resultData.count || []
			} else {
				this.page.count = 0
				this.tableData = []
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
