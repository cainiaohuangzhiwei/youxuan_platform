<template>
	<basic-container>
		<Info v-auth="'supplierQueryAccountDetail'" />
		<div v-auth="'supplierBalanceChangeList'">
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="form-msg">
						收入总额：<span
							>￥{{
								totalAmount && totalAmount.incomeSum
									? numberFormat(totalAmount.incomeSum, 2)
									: '0.00'
							}}</span
						>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="form-msg">
						支出总额:<span
							>￥{{
								totalAmount && totalAmount.expensesSum
									? numberFormat(totalAmount.expensesSum, 2)
									: '0.00'
							}}
						</span>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<yx-table
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import Info from '../Info/Info'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { supplierBalanceChangeList } from '@/api/supplierAccount'
import { getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'
import { numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
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
			isSupplierBalanceChangeList: checkFunctionCode(
				'supplierBalanceChangeList'
			),
			numberFormat: numberFormat,
			searchData: {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				businessSn: '', // 业务单号
				waterType: '', // 备注
				merchantAccountId: Number(this.$route.params.merchantAccountId),
			},
			searchCfg: [
				{
					title: '变动时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
				{
					title: '业务单号',
					dataIndex: 'businessSn',
				},

				{
					type: 'select',
					title: '备注',
					dataIndex: 'waterType',
					label: 'value',
					options: this.$store.state.app.constant.ACCOUNT_DETAILS_WATER_TYPE,
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.supplierBalanceChangeList(true)
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
			totalAmount: {},
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
					dataIndex: 'balanceType',
					title: '变动账户',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.ACCOUNT_BALANCE_TYPE,
							row.balanceType,
							'-',
							'balanceType'
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
							this.$store.state.app.constant.ACCOUNT_DETAILS_WATER_TYPE,
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
					this.supplierBalanceChangeList()
				},
			},
		}
	},

	created() {
		this.supplierBalanceChangeList(true)
	},

	methods: {
		// 重置
		resetForm() {
			this.searchData = {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				status: '',
				type: '',
				businessSn: '',
				merchantAccountId: Number(this.$route.params.merchantAccountId),
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
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

		// 变动列表
		supplierBalanceChangeList: async function (flag) {
			if (!this.isSupplierBalanceChangeList) return
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await supplierBalanceChangeList(paramJson)
			if (resultCode == 0) {
				this.totalAmount = resultData || {}
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
