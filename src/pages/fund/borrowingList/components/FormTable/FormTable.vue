<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
			</yx-form
			><el-row>
				<div class="amount_box">
					借出金额<span>￥{{ numberFormat(loanAmount, 2) }}</span
					>归还金额<span>￥{{ numberFormat(amountReturned, 2) }}</span>
				</div>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="borrowerAccountName" slot-scope="scope">
						<el-button type="text" @click="goDetails(scope.row)">{{
							scope.row.borrowerAccountName
						}}</el-button>
					</template>
				</yx-table>
			</el-row>
		</div>
		<borrowingDetails
			:dialogVisible.sync="dialogVisible"
			:itemInfo="selectedItem"
		></borrowingDetails>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { getConstantValueByKey, numberFormat } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import { fundLoanList } from '@/api/accountService'
import borrowingDetails from './components/borrowingDetails'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		borrowingDetails,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			dialogVisible: false,
			selectedItem: {},
			showLoading: false,
			loanAmount: 0, // 借出金额
			amountReturned: 0, // 归还金额
			searchData: {
				// accountId: '', // 账户id
				borrowerAccountName: '', // 账户名称
				borrowerType: '', // 账户类型
				status: 0, // 状态
				businessSn: '', // 业务单号
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				finishTimeStart: moment().startOf('day').valueOf(), // 开始时间
				finishTimeEnd: moment().endOf('day').valueOf(), // 结束时间
			},
			orderStatus: [],
			searchCfg: [
				// {
				// 	type: 'input',
				// 	title: '账户id',
				// 	dataIndex: 'accountId',
				// },
				{
					type: 'input',
					title: '账户名称',
					dataIndex: 'borrowerAccountName',
				},
				{
					type: 'input',
					title: '业务单号',
					dataIndex: 'businessSn',
				},
				{
					type: 'select',
					title: '类型',
					dataIndex: 'borrowerType',
					options: this.$store.state.app.constant.BORROWER_TYPE,
					label: 'value',
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'status',
					options: this.$store.state.app.constant.LENDING_STATUS,
					label: 'value',
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
				{
					title: '完成时间',
					type: 'datetimerange',
					dataIndex: ['finishTimeStart', 'finishTimeEnd'],
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
					click: () => {
						this._fundLoanList(true)
					},
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._fundLoanList(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'borrowingRecordId',
					title: '业务ID',
				},
				{
					type: 'string',
					dataIndex: 'businessSn',
					title: '业务单号',
				},
				{
					type: 'string',
					dataIndex: 'borrowingAccountId',
					title: '账户ID',
				},
				{
					type: 'custom',
					dataIndex: 'borrowerAccountName',
					title: '账户名称',
				},
				{
					type: 'string',
					dataIndex: 'borrowerType',
					title: '账户类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.BORROWER_TYPE,
							row.borrowerType,
							'-',
							'borrowerType'
						)
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '完成时间',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '借出金额',
					customRender: (row) => {
						return numberFormat(row.amount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'repayAmount',
					title: '归还金额',
					customRender: (row) => {
						return numberFormat(row.repayAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.LENDING_STATUS,
							row.status,
							'-',
							'status'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							auth: 'fundRepayList',
							click: (row) => {
								this.seeDetails(row)
							},
						},
						// {
						// 	title: '流转状态',
						// 	click: (row) => {
						// 		this.torsionState(row)
						// 	},
						// },
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._fundLoanList()
				},
			},
		}
	},

	created() {
		this._fundLoanList(true)
	},

	methods: {
		goDetails(row) {
			// 跳转详情
			if (row.borrowerType == 1) {
				this.$router.push({
					path: `merchantAccountDetails/${row.borrowingAccountId}`,
				})
			} else {
				this.$router.push({
					path: `shopAccountDetails/${row.borrowingAccountId}`,
				})
			}
		},
		torsionState(row) {
			// 重新发起
			this.$confirm(`确定扭转状态？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						console.log('扭转状态', row)
						// let {
						// 	data: { resultMsg, resultCode },
						// } = await deleteGroupGoods(paramJson)
						// const typeMsg = resultCode == 0 ? 'success' : 'error'
						// if (resultCode == 0) {
						// 	this.$message[typeMsg](resultMsg)
						// 	this._getYouxuanGoodsList(true)
						// }
					}
				},
			})
		},
		seeDetails(row) {
			// 查看详情
			console.log(row)
			this.dialogVisible = true
			this.selectedItem = JSON.parse(JSON.stringify(row))
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				JSON.parse(JSON.stringify(this.searchData)),
				{
					startIndex: 0,
					length: 1,
				}
			)
			if (!paramJson.borrowerType) {
				delete paramJson.borrowerType
			}
			if (!paramJson.status) {
				delete paramJson.status
			}
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_fundLoanList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultCode,
					resultData: {
						recordList = [],
						totalCount = 0,
						loanSum = 0,
						repaySum = 0,
					},
				},
			} = await fundLoanList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = recordList
				this.page.count = totalCount
				this.loanAmount = loanSum
				this.amountReturned = repaySum
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
		margin-right: 20px;
	}
}
</style>
