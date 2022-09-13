<template>
	<basic-container>
		<div style="margin-bottom: 20px">
			<el-button @click="showDialog" v-auth="'launchSftSyncCopy'" type="primary"
				>新增收付通支付商户</el-button
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
		<Dialog
			title="选择平台提现账户"
			:visible.sync="dialogVisible183"
			width="500px"
			:bottomBtn="dialogBottomBtn183"
		>
			<yx-table
				v-loading="loading183"
				:select="false"
				:columns="tableColumns183"
				:data="tableData183"
				:pagination="page183"
			>
				<template slot="select" scope="scope">
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
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getSftListPage, launchSyncCopy } from '@/api/newFund'
import {
	getBankListPageByPlatform,
	sftDeleteRecord,
} from '@/api/accountService'
export default {
	components: {
		BasicContainer,
		YxTable,
		Dialog,
	},
	data() {
		return {
			openAccountSn: '',
			loading183: false,
			tableColumns183: [
				{
					title: '',
					type: 'custom',
					dataIndex: 'select',
				},
				{
					type: 'string',
					dataIndex: 'companyName',
					title: '开户名称',
					customRender: (row) => {
						return row.bandInfo.bankAccountName
					},
				},
				{
					type: 'string',
					dataIndex: 'bandInfo',
					title: '银行账号',
					customRender: (row) => {
						return row.bandInfo.bankAccountNo
					},
				},
				{
					type: 'string',
					dataIndex: 'bandInfo',
					title: '银行名称',
					customRender: (row) => {
						return row.bandInfo.bankName
					},
				},
			],
			tableData183: [],
			page183: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listPageByPlatform()
				},
			},
			dialogVisible183: false,
			dialogBottomBtn183: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._launchSyncCopy()
					},
				},
			],
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
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'accMerchantSftAccountRecordId',
					title: '编号',
				},
				{
					type: 'string',
					dataIndex: 'merchantName',
					title: '商户名称',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '申请时间',
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '收付通签约状态',
					customRender: (row) => {
						return this.stateList[row.state]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '200',
					fixed: 'right',
					actions: [
						{
							title: '查看收付通开户详情',
							auth: 'getSftDetailByPlatform',
							click: ({ accountRecordNo }) => {
								this.$router.push({
									path: `payMerchandon/${accountRecordNo}`,
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
							title: '删除',
							auth: 'deleteSftRecord',
							popconfirm: true,
							popconfirmTitle: '是否删除',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._sftDeleteRecord(row)
							},
							customRender: (action, row) => {
								action.hide = row.state != 0
								return action
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
				accountType: 1,
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
			let {
				data: {
					resultCode,
					resultData: { recordList = [], totalCount = 0 },
				},
			} = await getSftListPage(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData182 = recordList
				this.page182.count = totalCount
			} else {
				this.page182.count = 0
				this.tableData182 = []
			}
		},
	},
}
</script>

<style></style>
