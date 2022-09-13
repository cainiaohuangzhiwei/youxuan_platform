<template>
	<basic-container>
		<WgForm
			v-loading="exportLoading"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
			:actionInline="true"
			labelWidth="4em"
		></WgForm>
		<el-row style="color: #333">
			<el-col :span="8">
				累计达成<span style="margin-left: 10px; font-size: 24px">{{
					sum.accCompletionTotalValue || 0
				}}</span>
			</el-col>
			<el-col :span="8">
				预估奖励<span style="margin-left: 10px; font-size: 24px">{{
					numberFormat(sum.estimateTotalAmount || 0, 2)
				}}</span>
			</el-col>
			<el-col :span="8">
				预估商家承担<span style="margin-left: 10px; font-size: 24px">{{
					numberFormat(sum.accSupplierTotalCost || 0, 2)
				}}</span>
			</el-col>
		</el-row>
		<YxTable
			class="wg-mt20"
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="operator" slot-scope="scope">
				<div>{{ scope.row.operator }}</div>
				<div>
					{{ moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm') }}
				</div>
			</template>
		</YxTable>

		<EditDialog
			ref="activityEdit"
			:visible.sync="activityEditDialog"
			@fatherMethodInit="fatherMethodInit"
		/>

		<EditSettleTimeDialog
			ref="settleTimeEdit"
			:visible.sync="settleTimeEditDialog"
		/>
	</basic-container>
</template>

<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import { downloadFile } from '@/utils/helper/common'
import { numberFormat } from '@/utils/helper/common'
import {
	sumCashRewardAmountExport,
	sumCashRewardAmount,
	userListPage,
} from '@/api/marketing'

export default {
	components: {
		BasicContainer,
		YxTable,
		WgForm,
	},

	name: 'FormTable',

	data() {
		return {
			numberFormat,
			actId: '',
			moment,
			exportLoading: false,
			loading: false,
			sum: {},
			searchData: {
				organizationId: '', // 店主id
			},
			searchCfg: [
				{
					title: '店主ID',
					type: 'input',
					dataIndex: 'organizationId',
				},
			],
			searchAction: [
				{
					title: '导出',
					auth: 'sumCashRewardAmountExport',
					type: 'primary',
					align: 'left',
					click: async () => {
						let paramJson = Object.assign({}, this.searchData)
						this.exportLoading = true
						let { data } = await sumCashRewardAmountExport(paramJson)
						this.exportLoading = false
						downloadFile(data, 'excel.xls')
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					// 1.实付金额 2.有效商品数 3.基础佣金 4.卖货佣金
					dataIndex: 'ruleCondType',
					title: '活动规则类型',
					customRender: (row) => {
						const ruleCondTypeMap = {
							1: '实付金额',
							2: '有效商品数',
							3: '基础佣金',
							4: '卖货佣金',
							5: '有效订单数',
						}
						return ruleCondTypeMap[row.ruleCondType]
					},
				},
				{
					dataIndex: 'accCompletionValue',
					title: '累计达成',
				},
				{
					type: 'string',
					dataIndex: 'estimateTotalAmount',
					title: '预估奖励',
					customRender: (row) => {
						if (row.estimateTotalAmount > 0) {
							return row.estimateTotalAmount
						} else if (row.rewardCouponId > 0) {
							return row.rewardCouponName + '*' + row.rewardCouponQuantity
						} else if (row.estimateTotalCoupon) {
							return row.estimateTotalCoupon
						} else {
							return 0
						}
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
		this.actId = this.$route.params.actId
		this.init()
	},

	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				pageNum: this.page.currentPage,
				pageSize: this.page.length,
			})

			if (this.searchData.organizationId) {
				paramJson.organizationId = this.searchData.organizationId
			}
			paramJson.actId = this.actId
			return paramJson
		},

		fatherMethodInit() {
			this.init(true)
		},

		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			if (this.page.currentPage === 1) {
				this.sumCashRewardAmount()
			}
			const {
				data: { resultData, total },
			} = await userListPage(paramJson)

			if (resultData?.length > 0) {
				this.tableData = resultData
				if (this.page.currentPage === 1) {
					this.page.count = total
				}
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},
		async sumCashRewardAmount() {
			const paramJson = this.findSearchParams()
			const {
				data: { resultData },
			} = await sumCashRewardAmount(paramJson)
			this.sum = resultData
		},
	},
}
</script>
