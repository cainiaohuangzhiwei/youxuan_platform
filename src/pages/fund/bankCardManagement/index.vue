<template>
	<basic-container>
		<h2>银行卡管理{{ type == 1 ? '（平台）' : '（商家）' }}</h2>
		<h4>账户名称：{{ tableData.bankAccountName }}</h4>
		<h4>
			证件号：{{ tableData.socialCreditCode }}

			<el-button
				style="margin-left: 40px"
				v-auth="
					type == 1
						? 'getSuningAccountInfoForPlatform'
						: 'getSuningAccountInfoForMerchant'
				"
				type="text"
				@click="checkAccount"
				>查看提现账户详情</el-button
			>
		</h4>

		<h4>
			状态：{{
				tableData.bindCardStatus ? bindCardStatus[tableData.bindCardStatus] : ''
			}}
		</h4>

		<div style="margin-bottom: 20px">
			<el-button
				v-if="type == 1"
				@click="toDetails(false, null)"
				v-auth="'listSuningPageAccount'"
				type="primary"
				>新增银行卡</el-button
			>
		</div>
		<yx-table
			v-loading="loading"
			:select="false"
			:columns="tableColumns182"
			:data="tableData182"
			:pagination="page182"
		>
		</yx-table>
		<!-- <Dialog
			title="新增银行卡"
			:visible.sync="dialogVisible183"
			width="800px"
			:bottomBtn="dialogBottonBtn183"
		>
			<yx-table
				v-loading="loading183"
				:select="false"
				:columns="tableColumns183"
				:data="tableData183"
				:pagination="page183"
			>
				<template slot="openAccountSn" slot-scope="scope">
					<div>
						<el-radio
							v-model="openAccountSn"
							:label="scope.row.openAccountSn"
							>{{ '' }}</el-radio
						>
					</div>
				</template>
			</yx-table>
		</Dialog> -->
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
// import Dialog from '@/components/Dialog'
import { launchSyncCopy } from '@/api/newFund'
import {
	getBankListPageByPlatform,
	listPlaformSuningBankAccount,
	sftDeleteRecord,
	// listPageAccount,
} from '@/api/accountService'
// import { number } from 'echarts'
export default {
	components: {
		BasicContainer,
		YxTable,
		// Dialog,
	},
	data() {
		return {
			type: this.$route.params.type,
			tableData: {},
			openAccountSn: this.$route.params.openAccountSn,
			loading: false,
			stateList: [
				'未提交',
				'资料校验中',
				'待账户验证',
				'审核中',
				'已驳回',
				'待签约',
				'完成',
				'已冻结',
			],
			bindCardStatus: [
				'未提交',
				'初始化',
				'资料校验中',
				'待汇款校验中',
				'汇款校验中',
				'审核中',
				'已驳回',
				'已通过',
				'已关闭',
			],
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'bankAccountNo',
					title: '银行卡号',
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '银行名称',
				},
				{
					type: 'string',
					dataIndex: 'outRequestNo',
					title: '绑卡单号',
				},
				{
					type: 'string',
					dataIndex: 'bindCardStatus',
					title: '绑卡状态',
					customRender: (row) => {
						return this.bindCardStatus[row.bindCardStatus]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '200',
					fixed: 'right',
					actions: [
						{
							title: '查看银行卡详情',
							auth:
								this.$route.params.type == 1
									? 'getSuningAccountInfoForPlatform'
									: 'getSuningAccountInfoForMerchant',
							click: (row) => {
								this.toDetails(true, row)
							},
						},
					],
				},
			],
			tableData182: [],
			page182: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getSftListPage()
				},
			},
		}
	},
	created() {
		this._getSftListPage(true)
	},
	methods: {
		checkAccount() {
			this.$router.push({
				path: `/fund/cashAccountDetails/${this.openAccountSn}/${null}/${null}/${
					this.$route.params.type == 1 ? 'platformCheck' : 'supplier'
				}`,
				params: { keepAlive: true },
			})
		},
		toDetails(flag = false, row) {
			if (flag) {
				if (!this.openAccountSn) {
					return this.$message.warning('请选择主体')
				}
				this.$router.push({
					params: { keepAlive: true },
					path: `/fund/addBankAccount/${this.openAccountSn}/${
						row.suningOpenAccountBankInfoId
					}/${this.tableData.toPublicBankAccount ? 1 : 2}/null/${
						this.$route.params.type
					}`,
				})
				this.openAccountSn = ''
			} else {
				this.$router.push({
					params: { keepAlive: true },
					path: `/fund/addBankAccount/${this.openAccountSn}/${null}/${
						this.tableData.toPublicBankAccount ? 1 : 2
					}/${encodeURI(this.tableData.bankAccountName)}/${
						this.$route.params.type
					}`,
				})
			}
		},

		async _sftDeleteRecord({ accMerchantSftAccountRecordId }) {
			let {
				data: { resultCode },
			} = await sftDeleteRecord({
				merchantSftAccountRecordId: accMerchantSftAccountRecordId,
			})
			if (resultCode == 0) {
				this._getSftListPage(true)
			}
		},
		async _launchSyncCopy() {
			if (!this.openAccountSn) {
				return this.$message.warning('请选择一个账户')
			}
			let accountBankInfoId = ''
			this.tableData183.forEach((item) => {
				if (item.openAccountSn == this.openAccountSn) {
					accountBankInfoId = item.bandInfo.suningOpenAccountBankInfoId
				}
			})
			let {
				data: { resultCode },
			} = await launchSyncCopy({
				openAccountSn: this.openAccountSn,
				accountBankInfoId,
			})
			if (resultCode == 0) {
				this.dialogVisible183 = false
				this._getSftListPage(true)
			}
		},
		showDialog() {
			this.dialogVisible183 = true
			this.openAccountSn = ''
			this._listPageByPlatform(true)
		},
		findSearchParams138(flag) {
			//搜索条件
			let paramJson = {
				accountType: this.$route.params.type,
				startIndex: 0,
				length: 1,
				bindCardStatus: 7,
				toPublicBankAccount: true,
			}

			// 每页的加载数据长度
			paramJson.length = this.page183.length
			// 当前页的条数开始
			if (flag) {
				this.page183.currentPage = 1
			}
			paramJson.startIndex =
				(this.page183.currentPage - 1) * this.page183.length
			return paramJson
		},
		_listPageByPlatform: async function (flag) {
			this.loading183 = true
			let paramJson = this.findSearchParams138(flag)
			let {
				data: {
					resultCode,
					resultData: { recordList = [], totalCount = 0 },
				},
			} = await getBankListPageByPlatform(paramJson)
			this.loading183 = false
			if (resultCode == 0) {
				this.tableData183 = recordList
				this.page183.count = totalCount
			} else {
				this.page183.count = 0
				this.tableData183 = []
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				startIndex: 0,
				length: 1,
			}
			// 每页的加载数据长度
			paramJson.length = this.page182.length
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			paramJson.startIndex =
				(this.page182.currentPage - 1) * this.page182.length
			return paramJson
		},
		_getSftListPage: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			paramJson.openAccountSn = this.$route.params.openAccountSn
			paramJson.accountType = Number(this.$route.params.type)

			let {
				data: { resultCode, resultData },
			} = await listPlaformSuningBankAccount(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData182 = resultData.bankDetailInfos
				this.tableData = resultData
				this.page182.count = resultData.total
			} else {
				this.page182.count = 0
				this.tableData182 = []
			}
		},
	},
}
</script>

<style></style>
