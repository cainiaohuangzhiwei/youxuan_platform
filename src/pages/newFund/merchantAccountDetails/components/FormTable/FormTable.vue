<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix box-font">
				<span>账户余额</span>
				<span class="company-s">（{{ supplierName }}）</span>
			</div>
			<div class="b-money">
				<div>
					<el-tooltip
						class="item"
						effect="dark"
						content="结算完成可使用金额"
						placement="top-start"
					>
						<i class="el-icon-warning"></i>
					</el-tooltip>
					可用余额(元)
					<span>￥{{ numberFormat(balancePriceData.balanceTotal, 2) }}</span>
				</div>
			</div>
			<div class="c-money">
				<div>
					<el-tooltip
						class="item"
						effect="dark"
						content="尚未结算，还不可使用的金额"
						placement="top-start"
					>
						<i class="el-icon-warning"></i>
					</el-tooltip>
					待结算金额(元)
					<span>￥{{ numberFormat(balancePriceData.settleTotal, 2) }}</span>
				</div>

				<div>
					<el-tooltip
						class="item"
						effect="dark"
						content="已发起还未到账金额"
						placement="top-start"
					>
						<i class="el-icon-warning"></i>
					</el-tooltip>
					提现中金额(元)
					<span>￥{{ numberFormat(balancePriceData.withdrawTotal, 2) }}</span>
				</div>
				<div>
					<el-tooltip
						class="item"
						effect="dark"
						content="平台垫付金额"
						placement="top-start"
					>
						<i class="el-icon-warning"></i>
					</el-tooltip>
					借支金额(元)
					<span>￥{{ numberFormat(balancePriceData.loanTotal, 2) }}</span>
				</div>
			</div>
		</el-card>
		<el-card class="box-card">
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template slot="lately">
					<div class="timeTabs">
						<el-radio-group @change="changeDate" v-model="searchData.time">
							<el-radio-button label="-7">一周</el-radio-button>
							<el-radio-button label="-30">一个月</el-radio-button>
							<el-radio-button label="-90">三个月</el-radio-button>
						</el-radio-group>
					</div>
				</template>
			</yx-form>
			<el-tabs v-model="actionName" type="card">
				<el-tab-pane label="收支明细" name="one">
					<el-row>
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
					</el-row>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	merchantAccountPaymentDetails,
	merchantAccountBalancePrice,
} from '@/api/newFund'
import { numberFormat, wgGetDate } from '@/utils/helper/common'
import moment from 'moment'
import { isNull } from '@/utils/helper/common'
export default {
	components: {
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			supplierName: decodeURIComponent(this.$route.query.c),
			actionName: 'one',
			numberFormat,
			balancePriceData: {},
			activeName: 'one',
			showLoading: false,
			searchData: {
				startTime: moment().startOf('day').valueOf(), // 开始时间
				endTime: moment().endOf('day').valueOf(), // 结束时间
				time: '',
			},
			searchCfg: [
				{
					title: '时间区间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					title: '最近',
					type: 'custom',
					dataIndex: 'lately',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.paymentDetails(true, e)
					},
				},
				{
					title: '清空',
					auth: '',
					click: () => {
						this.searchData.startTime = moment().startOf('day').valueOf() // 开始时间
						this.searchData.endTime = moment().endOf('day').valueOf() // 结束时间
						this.searchData.time = ''
					},
				},
			],
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
							'订单结算',
							'订单补偿',
							'订单收款',
							'订单退款',
							'平台服务费',
							'推广费',
							'平台补贴',
							'备用金借支',
							'kpi考核',
							'提现成功',
							'平台优惠补贴',
							'罚款',
							'补款',
							'运费',
							'其他扣款',
							'偿还（垫资回补）',
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
					this.paymentDetails()
				},
			},
		}
	},

	created() {
		this.paymentDetails()
		this.balancePrice()
	},

	methods: {
		async balancePrice() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await merchantAccountBalancePrice({
				accountSn: this.$route.params.id,
				accountType: 5,
			})
			this.showLoading = false

			if (resultCode == 0) {
				this.balancePriceData = resultData
			} else {
				this.balancePriceData = {}
			}
		},
		changeDate(e) {
			let searchData = this.searchData
			if (e == '-7') {
				searchData.startTime = moment(wgGetDate().getSixStartDate).valueOf()
				searchData.endTime = moment().endOf('day').valueOf()
			} else if (e == '-30') {
				searchData.startTime = moment(wgGetDate().getThirtyStartDate).valueOf()
				searchData.endTime = moment().endOf('day').valueOf()
			} else if (e == '-90') {
				searchData.startTime = moment(wgGetDate().getNinetyStartDate).valueOf()
				searchData.endTime = moment().endOf('day').valueOf()
			}
		},
		async paymentDetails(flag) {
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
			} = await merchantAccountPaymentDetails({
				...params,
				accountSn: this.$route.params.id,
				accountType: 5,
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

<style lang="scss" scope>
.company-s {
	margin-left: 20px;
}
.box-card {
	margin-bottom: 20px;
	.box-font {
		font-size: 20px;
		font-weight: bold;
	}
}
.b-money {
	font-size: 16px;
	border-bottom: 1px solid #e3e3e3;
	padding-bottom: 20px;
	span {
		color: brown;
		margin-left: 20px;
		font-size: 20px;
	}
}
.c-money {
	font-size: 15px;
	padding-top: 20px;
	display: flex;
	div {
		flex: 1;
	}
	span {
		color: brown;
		margin-left: 20px;
		font-size: 20px;
	}
}
.green {
	color: rgb(9, 187, 135);
}
.red {
	color: rgb(253, 67, 55);
}
</style>
