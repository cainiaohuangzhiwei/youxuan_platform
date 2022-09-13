<template>
	<basic-container>
		<div>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="index" slot-scope="scope">
						{{ scope.index + 1 }}
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import { platformRealTimeDataBalance } from '@/api/newFund'
import { checkFunctionCode } from '@/utils/auth.js'

export default {
	components: {
		BasicContainer,

		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			baseAccountPaymentDetails: checkFunctionCode('baseAccountPaymentDetails'),
			baseAccountBalancePrice: checkFunctionCode('baseAccountBalancePrice'),
			marketingAccountBalancePrice: checkFunctionCode(
				'marketingAccountBalancePrice'
			),
			marketingAccountPaymentDetails: checkFunctionCode(
				'marketingAccountPaymentDetails'
			),
			allianceAccountBalancePrice: checkFunctionCode(
				'allianceAccountBalancePrice'
			),
			allianceAccountPaymentDetails: checkFunctionCode(
				'allianceAccountPaymentDetails'
			),
			joinpayAllianceAccountBalancePrice: checkFunctionCode(
				'joinpayAllianceAccountBalancePrice'
			),
			joinpayAllianceAccountPaymentDetails: checkFunctionCode(
				'joinpayAllianceAccountPaymentDetails'
			),
			showLoading: false,
			numberFormat: numberFormat,
			// type 账户类型 1 收付通基本账户 2 收付通运营账户 3 收付通店主联盟账户 4汇聚店主联盟账户 5收付通商家账户 6 收付通店主账户
			tableData: [
				{
					accountName: '收付通-基本账户',
					amount: 0,
					id: 0,
					type: 1,
				},
				{
					accountName: '收付通-运营账户',
					amount: 0,
					id: 0,
					type: 2,
				},
				{
					accountName: '收付通-店主联盟账户',
					amount: 0,
					id: 0,
					type: 3,
				},
				{
					accountName: '汇聚-店主联盟账户',
					amount: 0,
					id: 0,
					type: 4,
				},
			],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'index',
					title: '编号',
					width: '150',
				},
				{
					dataIndex: 'accountName',
					title: '账户名称',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '账户余额',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								console.log(this.baseAccountPaymentDetails)
								if (
									row.type == 1 &&
									(!this.baseAccountPaymentDetails ||
										!this.baseAccountBalancePrice)
								) {
									return this.$message.warning('请联系管理员获取权限！')
								} else if (
									row.type == 2 &&
									(!this.marketingAccountBalancePrice ||
										!this.marketingAccountPaymentDetails)
								) {
									return this.$message.warning('请联系管理员获取权限！')
								} else if (
									row.type == 3 &&
									(!this.allianceAccountBalancePrice ||
										!this.allianceAccountPaymentDetails)
								) {
									return this.$message.warning('请联系管理员获取权限！')
								} else if (
									row.type == 4 &&
									(!this.joinpayAllianceAccountPaymentDetails ||
										!this.joinpayAllianceAccountBalancePrice)
								) {
									return this.$message.warning('请联系管理员获取权限！')
								}

								this.toDetails(row)
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
		//商家账户详情
		toDetails(row) {
			this.$router.push({
				path: `/newFund/platformAccountDetails/${row.id}/${row.type}`,
				query: {
					title: encodeURIComponent(row.accountName),
				},
			})
		},
		// 平台账户列表
		async init() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await platformRealTimeDataBalance()
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData[0].amount = resultData.baseBalance
				this.tableData[0].id = resultData.baseAccountSn
				this.tableData[1].amount = resultData.marketingBalance
				this.tableData[1].id = resultData.marketingAccountSn
				this.tableData[2].amount = resultData.allianceBalance
				this.tableData[2].id = resultData.allianceAccountSn
				this.tableData[3].amount = resultData.joinpayAllianceBalance
				this.tableData[3].id = resultData.joinpayAllianceAccountSn
			} else {
				this.tableData = []
			}
		},
	},
}
</script>
