<template>
	<div>
		<Info v-auth="'platformWeegetAccountDetail'" />
		<div v-auth="'platformWeegetBalanceChangeList'">
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row :gutter="20">
				<el-col :span="5">
					<div class="form-msg">
						收入总额：<span>￥{{ incomeSum }}</span>
					</div></el-col
				>
				<el-col :span="5">
					<div class="form-msg">
						支出总额:<span>￥{{ expensesSum }}</span>
					</div></el-col
				>
			</el-row>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
	</div>
</template>

<script>
import Info from '../Info'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { platformWeegetBalanceChangeList } from '@/api/platformAccount'
import { numberFormat, getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		YxForm,
		YxTable,
		Info,
	},
	name: 'FormTable',

	data() {
		return {
			platformWeegetBalanceChangeList: checkFunctionCode(
				'platformWeegetBalanceChangeList'
			),
			incomeSum: 0,
			expensesSum: 0,
			showLoading: false,
			searchData: {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				businessSn: '', //业务单号
				waterType: null, //备注
			},
			searchCfg: [
				{
					title: '变动时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
				{
					type: 'input',
					title: '业务单号',
					dataIndex: 'businessSn',
				},
				{
					type: 'select',
					title: '备注',
					dataIndex: 'waterType',
					label: 'value',
					options:
						this.$store.state.app.constant.WATER_TYPE_PLATFORM_ACCOUNT_DETAILS,
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.getPlatformWeegetBalanceChangeList(true, e)
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
					dataIndex: 'addTime',
					title: '变动时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'businessType',
					title: '流水类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.BUSINESS_TYPE_PLATFORM_ACCOUNT,
							row.businessType,
							'-',
							'status'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '变动金额',
					customRender: (row) => {
						if (row.operationType == 1) {
							return '-￥' + numberFormat(row.amount, 2)
						} else {
							return '+￥' + numberFormat(row.amount, 2)
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'balance',
					title: '剩余金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.balance, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'businessSn',
					title: '关联业务单号',
				},
				{
					type: 'string',
					dataIndex: 'waterType',
					title: '备注',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant
								.WATER_TYPE_PLATFORM_ACCOUNT_DETAILS,
							row.waterType,
							'-',
							'waterType'
						)
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getPlatformWeegetBalanceChangeList()
				},
			},
		}
	},

	created() {
		this.getPlatformWeegetBalanceChangeList()
	},

	methods: {
		// 重置
		resetForm() {
			this.searchData = {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				businessSn: '', //业务单号
				waterType: null, //备注
			}
		},
		marketingAccountDetail: async function () {
			// let {
			// 	data: { resultCode, resultData },
			// } = await marketingAccountDetail()
			// console.log(resultCode, resultData)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				weegetAccountId: this.$route.params.accountId,
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.addTimeStart = moment(paramJson.addTimeStart).valueOf() || ''
			paramJson.addTimeEnd = moment(paramJson.addTimeEnd).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},

		getPlatformWeegetBalanceChangeList: async function (flag, e) {
			if (!this.platformWeegetBalanceChangeList) return
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			let {
				data: { resultCode, resultData },
			} = await platformWeegetBalanceChangeList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.recordList || []
				this.incomeSum = numberFormat(resultData.incomeSum || 0, 2)
				this.expensesSum = numberFormat(resultData.expensesSum || 0, 2)
				this.page.count = resultData.totalCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
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
</style>
