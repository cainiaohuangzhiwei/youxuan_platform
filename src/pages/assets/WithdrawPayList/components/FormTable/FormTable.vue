<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form
			><el-row>
				<YxAccounts :items="statistics" />
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
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile, numberFormat } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import YxAccounts from '@/components/Accounts/index'
import {
	getWithdrawListByCondition,
	exportWithdrawListByCondition,
} from '@/api/yhtPlusCmsFinance'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		YxAccounts,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			statistics: [
				{
					type: 'amount',
					title: '提现总额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '手续费',
					value: '0.00',
				},
			],
			searchData: {
				status: 0, // 状态
				withdrawType: 0, // 类型
				keyword: '', // 账户名/手机号/操作人
				addTimeStart: moment().startOf('month').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('month').valueOf(), // 结束时间
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'select',
					title: '类型',
					dataIndex: 'withdrawType',
					label: 'value',
					options: this.$store.state.app.constant.WITHDRAW_PAY_TYPE,
					change: () => {
						this._getWithdrawListByCondition(true)
					},
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'status',
					label: 'value',
					options: this.$store.state.app.constant.WITHDRAW_PAY_STATUS,
					change: () => {
						this._getWithdrawListByCondition(true)
					},
				},

				{
					title: '操作时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
				{
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '账户名/手机号/操作人',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getWithdrawListByCondition(true)
					},
				},
				{
					title: '导出Excel',
					type: 'primary',
					auth: 'exportWithdrawListByCondition',
					click: () => {
						this._exportWithdrawListByCondition()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'flowWithdrawId',
					title: 'ID',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '操作时间',
				},
				{
					type: 'date',
					dataIndex: 'finishTime',
					title: '到账时间',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '金额',
				},
				{
					type: 'amount',
					dataIndex: 'serviceCharge',
					title: '手续费',
				},
				{
					type: 'string',
					dataIndex: 'remainder',
					title: '剩余余额',
					customRender: (row) => {
						return row.status == 2 ? numberFormat(row.remainder) : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return this.getStatusString(row.status)
					},
				},
				{
					type: 'string',
					dataIndex: 'type',
					title: '类型',
					customRender: (row) => {
						return this.getTypeString(row.type)
					},
				},
				{
					type: 'string',
					dataIndex: 'withdrawSn',
					title: '交易单号',
				},
				{
					type: 'string',
					dataIndex: 'accountName',
					title: '账户名',
					customRender: (row) => {
						return row.bankAccount ? row.bankAccount.accountName : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
					customRender: (row) => {
						return row.bankAccount ? row.bankAccount.phone : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'accountNumber',
					title: '账号',
					customRender: (row) => {
						return row.bankAccount ? row.bankAccount.accountNumber : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '开户银行',
					customRender: (row) => {
						return row.bankAccount ? row.bankAccount.bankName : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'bankCity',
					title: '银行城市',
					customRender: (row) => {
						return row.bankAccount ? row.bankAccount.bankCity : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'bankSubbranch',
					title: '开户支行',
					customRender: (row) => {
						return row.bankAccount ? row.bankAccount.bankSubbranch : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getWithdrawListByCondition()
				},
			},
		}
	},

	created() {
		this._getWithdrawListByCondition(true)
	},

	methods: {
		getStatusString(status = 0) {
			// 获取状态
			if (status == 1) {
				return '提现中'
			} else if (status == 2) {
				return '提现成功'
			} else if (status == 3) {
				return '提现失败'
			} else if (status == 4) {
				return 'T+1提现中'
			} else if (status == 5) {
				return '已发起提现,等待结果'
			} else if (status == 6) {
				return '提现异常'
			} else {
				return '-'
			}
		},
		getTypeString(type = 0) {
			// 获取类型
			if (type == 1) {
				return '返退提现'
			} else if (type == 2) {
				return '商家成本提现'
			} else if (type == 3) {
				return '盈利提现'
			} else if (type == 4) {
				return '邮费提现'
			} else if (type == 6) {
				return '店主提现'
			} else if (type == 7) {
				return '营销提现'
			} else if (type == 9) {
				return '微革待收提现'
			} else if (type == 10) {
				return '档期商家提现'
			} else {
				return '-'
			}
		},
		_exportWithdrawListByCondition: async function () {
			// 导出数据
			let paramJson = Object.assign({}, this.searchData)
			let { data } = await exportWithdrawListByCondition(paramJson)
			downloadFile(data, '提现明细表.xlsx')
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
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_getWithdrawListByCondition: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultData: {
						flowWithdrawList = [],
						count = 0,
						amount = 0,
						serviceCharge = 0,
					},
				},
			} = await getWithdrawListByCondition(paramJson)
			this.showLoading = false
			this.tableData = flowWithdrawList
			this.page.count = count
			this.statistics[0].value = amount
			this.statistics[1].value = serviceCharge
		},
	},
}
</script>
