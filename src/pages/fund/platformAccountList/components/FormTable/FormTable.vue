<template>
	<basic-container>
		<div>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<!-- //操作记录 -->
		<Dialog
			title="调账记录"
			:visible="operatingRecordLoding"
			width="50%"
			:bottomBtn="operatingRecordBottomBtn"
			@before-close="operatingRecordLoding = false"
		>
			<yx-table
				v-loading="loading"
				:columns="operatingRecordTable"
				:pagination="operatingRecordPage"
				:data="operatingRecordTableData"
			>
			</yx-table>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { numberFormat } from '@/utils/helper/common'
import { platformQueryAccountList } from '@/api/platformAccount'
import { getAccountWaterList } from '@/api/userRewardSystem'
import { getConstantValueByKey } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
import moment from 'moment'
// import moment from 'moment'
export default {
	components: {
		BasicContainer,
		Dialog,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			platformAccountTransferOrganization: checkFunctionCode(
				'platformAccountTransferOrganization'
			),
			platformWeegetAccountDetail: checkFunctionCode(
				'platformWeegetAccountDetail'
			),
			platformAccountTransfer: checkFunctionCode('platformAccountTransfer'),
			platformMarketingAccountDetail: checkFunctionCode(
				'platformMarketingAccountDetail'
			),
			promotionAccountDetail: checkFunctionCode('promotionAccountDetail'),
			operationsAccountDetail: checkFunctionCode('operationsAccountDetail'),
			promotionAccountApply: checkFunctionCode('promotionAccountApply'),
			platformWithdrawView: checkFunctionCode('platformWithdrawView'),
			showLoading: false,
			numberFormat: numberFormat,
			accountId: '', //营销账户id
			operatingRecordLoding: false,
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'accountId',
					title: '账户id',
				},
				// {
				// 	dataIndex: 'addTime',
				// 	title: '创建时间',
				// 	customRender: (row) => {
				// 		return row.addTime
				// 			? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
				// 			: '无'
				// 	},
				// },
				{
					dataIndex: 'accountName',
					title: '账户名称',
				},
				{
					dataIndex: 'balance',
					title: '账户余额',
					customRender: (row) => {
						return '￥' + numberFormat(row.balance, 2)
					},
				},
				{
					dataIndex: 'frozenAmount',
					title: '冻结余额',
					customRender: (row) => {
						return '￥' + numberFormat(row.frozenAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.MERCHANT_ACCOUNT_STATUS,
							row.status,
							'-',
							'status'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '调账',
							auth: 'marketingAccountRegulation',
							click: (row) => {
								this.reconciliation(row)
							},
							customRender: (action, row) => {
								action.hide = row.platformAccountType != 2
								return action
							},
						},
						{
							title: '提现',
							// auth: 'platformWithdrawView',
							click: (row) => {
								this.withdrawDeposit(row)
							},
							customRender: (action, row) => {
								action.hide =
									(row.platformAccountType != 1 &&
										row.platformAccountType != 3) ||
									(row.platformAccountType == 1 &&
										!this.platformWithdrawView) ||
									(row.platformAccountType == 3 && !this.promotionAccountApply)
								return action
							},
						},
						{
							title: '转账',
							auth: 'saveTransferAmountRecord',
							click: (row) => {
								this.transferAccountsDetails(row)
							},
							customRender: (action, row) => {
								action.hide = row.platformAccountType != 1
								return action
							},
						},
						{
							title: '查看详情',
							click: (row) => {
								this.marketAccountDetails(row)
							},
							customRender: (action, row) => {
								action.hide =
									row.platformAccountType == 3
										? !this.promotionAccountDetail
										: row.platformAccountType == 1
										? !this.platformWeegetAccountDetail
										: row.platformAccountType == 2
										? !this.platformMarketingAccountDetail
										: row.platformAccountType == 4
										? !this.operationsAccountDetail
										: false
								return action
							},
						},
						{
							title: '查看调账记录',
							auth: 'marketingRegulation',
							click: (row) => {
								this.operatingRecord(row)
								this.accountId = row.accountId
							},
							customRender: (action, row) => {
								action.hide = row.platformAccountType != 2
								return action
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
			operatingRecordTableData: [],
			operatingRecordTable: [
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'regulationType',
					title: '调账类型',
					customRender: (row) => {
						let arr = ['-', '加款', '减款']
						return arr[row.regulationType] || arr[0]
					},
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '调账金额',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '操作人',
				},
			],
			operatingRecordPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.operatingRecord()
				},
			},
			operatingRecordBottomBtn: [
				{
					title: '确 定',
					type: '',
					click: () => {
						this.operatingRecordLoding = false
					},
				},
			],
		}
	},

	created() {
		this.init()
	},
	watch: {
		$route(to, from) {
			// console.log(from.path) //从哪来
			// console.log(to.path) //到哪去
			if (
				(from.path.indexOf('/fund/platformAccountTransfer') != -1 ||
					from.path.indexOf('/fund/reconciliation') != -1) &&
				to.path === '/fund/platformAccountList'
			) {
				this.init()
			}
		},
	},
	methods: {
		reconciliation(row) {
			// 调账
			this.$router.push({
				path: `reconciliation/${row.accountId}`,
			})
		},
		//提现
		withdrawDeposit({ platformAccountType, accountName }) {
			this.$router.push({
				path: `withdraw?platformAccountType=${platformAccountType}&accountName=${accountName}`,
			})
		},
		//商家账户详情
		marketAccountDetails(row) {
			if (row.platformAccountType === 1) {
				this.$router.push({
					path: `platformAccountDetails/${row.accountId}`,
				})
			} else if (row.platformAccountType === 2) {
				this.$router.push({
					path: `marketAccountDetails/${row.accountId}`,
				})
			} else if (row.platformAccountType === 3) {
				this.$router.push({
					path: `promotionAccountDetails`,
				})
			} else if (row.platformAccountType === 4) {
				this.$router.push({
					path: `operationAccountDetail`,
				})
			}
		},
		//转账
		transferAccountsDetails(row) {
			this.$router.push({
				path: `platformAccountTransfer/${row.accountId}`,
			})
		},
		// 平台账户列表
		async init() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await platformQueryAccountList()

			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.recordList || []
				this.page.count = resultData.count || 0
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//操作记录
		async operatingRecord() {
			this.operatingRecordLoding = true
			let param = {
				startIndex:
					(this.operatingRecordPage.currentPage - 1) *
					this.operatingRecordPage.length,
				length: this.operatingRecordPage.length,
			}
			let {
				data: { resultCode, resultData },
			} = await getAccountWaterList(param)
			if (resultCode === 0) {
				this.operatingRecordTableData = resultData.recordList
				this.operatingRecordPage.count = resultData.totalCount
			} else {
				this.operatingRecordPage.count = 0
				this.operatingRecordTableData = []
			}
		},
	},
}
</script>
