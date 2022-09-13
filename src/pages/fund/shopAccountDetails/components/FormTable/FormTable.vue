<template>
	<basic-container>
		<Info v-auth="'organizationQueryAccountDetail'" />
		<div v-auth="'organizationBalanceChangeList'">
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="form-msg">
						收入总额：<span>￥{{ incomeSum }}</span>
					</div></el-col
				>
				<el-col :span="4">
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
	</basic-container>
</template>

<script>
import Info from '../Info'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { organizationBalanceChangeList } from '@/api/organizationAccount'
import { getConstantValueByKey, numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Info,
	},
	name: 'FormTable',

	data() {
		return {
			organizationBalanceChangeList: checkFunctionCode(
				'organizationBalanceChangeList'
			),
			expensesSum: 0, //支出总额
			incomeSum: 0, //收入总额
			showLoading: false,
			searchData: {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				businessSn: '',
				waterType: null,
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
					options: this.$store.state.app.constant
						.WATER_TYPE_ORGANIZATION_ACCOUNT_DETAILS,
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.init(true, e)
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
					type: 'data',
					dataIndex: 'addTime',
					title: '变动时间',
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
							return '-￥' + numberFormat(row.amount, 2)?.replace('-', '')
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
								.WATER_TYPE_ORGANIZATION_ACCOUNT_DETAILS,
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
					this.init()
				},
			},
		}
	},

	created() {
		this.init(true)
		let waterTypeList = JSON.parse(
			JSON.stringify(
				this.$store.state.app.constant.WATER_TYPE_ORGANIZATION_ACCOUNT_DETAILS
			)
		)
		waterTypeList.splice(1, 1)
		waterTypeList[6].waterType = '1'
		this.searchCfg[2].options = waterTypeList
	},

	methods: {
		// 重置
		resetForm() {
			this.searchData = {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				businessSn: '',
				waterType: null,
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				organizationId: this.$route.params.organizationId,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			// paramJson.addTimeStart = moment(paramJson.addTimeStart).valueOf() || ''
			// paramJson.addTimeEnd = moment(paramJson.addTimeEnd).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		init: async function (flag, e) {
			if (!this.organizationBalanceChangeList) return
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			let {
				data: { resultCode, resultData },
			} = await organizationBalanceChangeList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.expensesSum = numberFormat(resultData.expensesSum || 0, 2) //支出总额
				this.incomeSum = numberFormat(resultData.incomeSum || 0, 2) //收入总额
				this.tableData = resultData.recordList || []
				this.page.count = resultData.totalCount || 0
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
