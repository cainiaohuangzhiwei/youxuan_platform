<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row class="mb20">
				<span class="mr20">银行卡号：{{ bankAccount.accountNumber }}</span>
				<span class="mr20"
					>银行卡余额：：{{ bankAccount.usableAmount | numberFormat }}</span
				>
				<span class="mr20"
					>支付宝剩余额度：{{
						(bankAccount.alipayAmount - totalResult.TodayAliPayAmount)
							| numberFormat
					}}</span
				>
				<span class="mr20"
					>微信支付剩余额度：{{
						(bankAccount.wxpayAmount - totalResult.TodayWxPayAmount)
							| numberFormat
					}}</span
				>
				<span class="mr20"
					>支付宝总额度：{{ bankAccount.alipayAmount | numberFormat }}</span
				>
				<span
					>微信支付总额度：{{ bankAccount.wxpayAmount | numberFormat }}</span
				>
			</el-row>
			<el-row>
				<YxAccounts :items="statistics" />
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<new-record-dialog @updateList="init" :visible.sync="showRecordDialog" />
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { numberFormat, getConstantValueByKey } from '@/utils/helper/common'
import NewRecordDialog from '../NewRecordDialog'
import YxTable from '@wg-vue-materials/yx-table'
import YxAccounts from '@/components/Accounts/index'
import {
	getFlowBankRecord,
	updateBankUsableAmount,
} from '@/api/yhtPlusCmsFinance'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		YxAccounts,
		NewRecordDialog,
	},
	name: 'FormTable',

	data() {
		return {
			showRecordDialog: false,
			showLoading: false,
			bankAccount: {},
			totalResult: {},
			statistics: [
				{
					type: 'amount',
					title: '第三方充值总计',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '银行卡提现总计',
					value: '0.00',
				},
			],
			searchData: {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				recordType: 0, // 记录类型
				rechargeType: '', //渠道
			},
			orderStatus: [],
			searchCfg: [
				{
					title: '操作时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
				{
					type: 'select',
					title: '记录类型',
					dataIndex: 'recordType',
					label: 'value',
					options: this.$store.state.app.constant.BANK_CARD_RECORD_TYPE,
					change: () => {
						this._getFlowBankRecord(true)
					},
				},
				{
					type: 'select',
					title: '渠道',
					dataIndex: 'rechargeType',
					label: 'value',
					options: this.$store.state.app.constant.BANK_CARD_RECHARGE_TYPE,
					change: () => {
						this._getFlowBankRecord(true)
					},
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this._getFlowBankRecord(true)
					},
				},
				{
					title: '新增记录',
					type: 'primary',
					click: () => {
						this.showRecordDialog = true
					},
				},
				{
					title: '配置银行卡信息',
					type: 'primary',
					click: () => {
						this.saveWithdrawalRecord()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'recordType',
					title: '记录类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.BANK_CARD_RECORD_TYPE,
							row.recordType,
							'其他',
							'recordType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'rechargeType',
					title: '渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.BANK_CARD_RECHARGE_TYPE,
							row.rechargeType,
							'其他',
							'rechargeType'
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'recordAmount',
					title: '操作金额',
				},
				{
					type: 'amount',
					dataIndex: 'usableAmount',
					title: '银行卡余额',
				},

				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getFlowBankRecord()
				},
			},
		}
	},

	created() {
		this.init()
	},

	methods: {
		init() {
			this._getFlowBankRecord(true)
		},
		saveWithdrawalRecord() {
			this.$prompt('配置银行卡信息', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入银行卡余额',
				inputType: 'number',
			}).then(async ({ value }) => {
				let {
					data: { resultCode, resultMsg },
				} = await updateBankUsableAmount({
					bankAccountId: this.$route.params.bankAccountId,
					usableAmount: value,
					sourceName: this.bankAccount.sourceName,
					//	totalAmount: this.bankAccount.totalAmount,
				})
				if (resultCode == 0) {
					this.$message.success(resultMsg)
					this.init()
				}
			})
		},

		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				bankAccountId: this.$route.params.bankAccountId,
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
		_getFlowBankRecord: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultData: {
						flowBankRecordList = [],
						count = 0,
						rechargeAmount = 0,
						withdrawAmount = 0,
						bankAccount = {},
					},
					resultData = {},
				},
			} = await getFlowBankRecord(paramJson)
			this.showLoading = false
			this.tableData = flowBankRecordList
			this.bankAccount = bankAccount
			this.page.count = count
			this.totalResult = resultData
			this.statistics[0].value = rechargeAmount
			this.statistics[1].value = withdrawAmount
		},
	},
	filters: {
		numberFormat(value) {
			return numberFormat(value, 2)
		},
	},
}
</script>

<style lang="scss" scoped>
.mr20 {
	margin-right: 20px;
}
.mb20 {
	margin-bottom: 20px;
}
</style>
