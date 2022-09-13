<template>
	<div>
		<div class="header">
			<!-- <el-button
				@click="addBank"
				v-auth="'listSuningPageAccount'"
				type="primary"
				>新增银行卡</el-button
			> -->
			<el-button
				v-auth="'openAccountToPublic'"
				@click="toDetails(false)"
				type="primary"
				>新增提现账户</el-button
			>
		</div>
		<yx-table
			v-loading="loading"
			:select="false"
			:columns="tableColumns182"
			:pagination="page182"
			:data="tableData182"
		></yx-table>
		<Dialog
			title="新增银行卡"
			:visible.sync="dialogVisible183"
			width="800px"
			:bottomBtn="dialogBottomBtn183"
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
		</Dialog>
		<Dialog
			title="新增提现账户"
			:visible.sync="addAccount"
			width="800px"
			:bottomBtn="addAccountBotton"
		>
			<template>
				<label>账户类型：</label>
				<el-radio v-model="radio" label="1">对公</el-radio>
				<el-radio v-model="radio" label="2">对私</el-radio>
			</template>
			<div style="margin-top: 20px">
				谨记：已经开过户就不要再开，找到你要的户点进去新增银行卡
			</div>
		</Dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	listPageAccount,
	listSuningWithdrawAccountPlaform,
} from '@/api/accountService'
export default {
	components: {
		YxTable,
		Dialog,
	},
	data() {
		return {
			openAccountSn: '',
			loading183: false,
			addAccount: false,
			flagS: false,
			radio: '1',
			addAccountBotton: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `cashAccountDetails/${this.radio}`,
						})
						this.addAccount = false
					},
				},
			],
			tableColumns183: [
				{
					title: '',
					type: 'custom',
					dataIndex: 'openAccountSn',
				},
				{
					type: 'string',
					dataIndex: 'companyName',
					title: '账户名称',
					customRender: (row) => {
						return row.bankAccountName
					},
				},
			],
			tableData183: [],
			page183: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listPageAccount()
				},
			},
			dialogVisible183: false,
			dialogBottomBtn183: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.toDetails(true)
						// this.dialogVisible183 = false
					},
				},
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
			loading: false,
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '开户名称',
					// customRender: (row) => {
					// 	return row.bandInfo.bankAccountName
					// },
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'bandInfo',
				// 	title: '银行账号',
				// 	customRender: (row) => {
				// 		return row.bandInfo.bankAccountNo
				// 	},
				// },
				// {
				// 	type: 'string',
				// 	dataIndex: 'bandInfo',
				// 	title: '银行名称',
				// 	customRender: (row) => {
				// 		return row.bandInfo.bankName
				// 	},
				// },
				{
					type: 'string',
					dataIndex: 'toPublicBankAccount',
					title: '账户类型',
					customRender: (row) => {
						return row.toPublicBankAccount == 1 ? '对公' : '对私'
					},
				},
				{
					type: 'string',
					dataIndex: 'bindCardStatus',
					title: '苏宁签约状态',
					customRender: (row) => {
						return this.bindCardStatus[row.bindCardStatus]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看开户详情',
							auth: 'getSuningAccountInfoForPlatform',
							click: (row) => {
								this.$router.push({
									path: `cashAccountDetails/${row.openAccountSn}/${
										row.suningOpenAccountBankInfoId
									}/${row.supplierId}/${'platformCheck'}`,
								})
							},
							// customRender: (action, row) => {
							// 	action.hide =
							// 		row.imageType != 2 &&
							// 		row.imageItem != 19 &&
							// 		row.imageItem != 20
							// 	return action
							// },
						},
						{
							title: '修改账户信息',
							auth: 'updateOpenAccount',
							click: (row) => {
								this.$router.push({
									path: `cashAccountDetails/${row.openAccountSn}/${
										row.suningOpenAccountBankInfoId
									}/${row.supplierId}/${'platform'}`,
								})
							},
							customRender: (action, row) => {
								action.hide = row.bindCardStatus != 7
								return action
							},
						},
						{
							title: '查看苏宁银行信息',
							click: (row) => {
								this.$alert(
									`苏宁银行虚拟户账号：${row.suningAccountId}`,
									'查看苏宁银行信息',
									{
										confirmButtonText: '确定',
									}
								)
							},
							customRender: (action, row) => {
								action.hide = row.bindCardStatus != 7
								return action
							},
						},
						{
							title: '银行卡管理',
							auth: 'listPlaformSuningBankAccount',
							click: (row) => {
								this.$router.push({
									path: `bankCardManagement/${1}/${row.openAccountSn}`,
								})
							},
							customRender: (action, row) => {
								action.hide = row.bindCardStatus != 7
								return action
							},
						},
					],
				},
			],
			page182: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listPageByPlatform()
				},
			},
			tableData182: [],
		}
	},
	created() {
		// this._listPageByPlatform(true)
	},
	methods: {
		addBank() {
			this.dialogVisible183 = true
			this._listPageAccount(true)
		},
		findSearchParams138(flag) {
			//搜索条件
			let paramJson = {
				pageSize: 10,
				pageNum: 1,
				accountType: 1,
				bindCardStatus: 7,
			}
			paramJson.pageSize = this.page183.length
			// 当前页的条数开始
			if (flag) {
				this.page183.currentPage = 1
			}
			paramJson.pageNum = this.page183.currentPage
			return paramJson
		},
		async _listPageAccount(flag) {
			this.loading183 = true
			let paramJson = this.findSearchParams138(flag)
			let {
				data: { resultCode, resultData },
			} = await listPageAccount(paramJson)
			this.loading183 = false
			if (resultCode == 0) {
				this.tableData183 = resultData.recordList
				this.page183.count = resultData.totalCount
			} else {
				this.tableData183 = []
				this.page183.count = 0
			}
		},
		toDetails(flag = false) {
			this.flagS = flag
			this.addAccount = true
		},
		findSearchParams(flag) {
			let paramJson = {
				pageSize: 10,
				pageNum: 1,
			}
			paramJson.pageSize = this.page182.length
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			paramJson.pageNum = this.page182.currentPage
			return paramJson
		},
		_listPageByPlatform: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			paramJson.accountType = 1
			let {
				data: { resultCode, resultData },
			} = await listSuningWithdrawAccountPlaform(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData182 = resultData.resultData
				this.page182.count = resultData.total
			} else {
				this.page182.count = 0
				this.tableData182 = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 20px;
}
</style>
