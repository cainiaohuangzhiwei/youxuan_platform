<template>
	<div class="refundList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-accounts :items="accountItems104"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			></yx-table>
			<Dialog
				title="账户信息"
				:visible="dialogVisible105"
				width="500px"
				:bottomBtn="dialogBottomBtn105"
				@before-close="
					() => {
						dialogVisible105 = false
						formData106 = {
							name: '',
							bankAccount: '',
							phone: '',
						}
					}
				"
			>
				<yx-form
					v-loading="dialogLoading105"
					:inline="false"
					:data="formData106"
					:items="formCfg106"
					label-position="right"
					label-width="120px"
				>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { downloadFile } from '@/utils/helper/common'
import {
	listUserCompensationWithdraw,
	exportListUserCompensationWithdraw,
	userWithdrawAccount,
} from '@/api/yhtPlusCmsUserCompensationWithdraw'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
		Dialog,
	},
	data() {
		return {
			loading: false,
			formData101: {
				paramUserId: '',
				transactionSn: '',
				withdrawStatus: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				finishTimeStart: '',
				finishTimeEnd: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '用户ID',
					dataIndex: 'paramUserId',
					placeholder: '精确筛选',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					type: 'input',
					title: '交易流水号',
					dataIndex: 'transactionSn',
					placeholder: '精确筛选',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					title: '转账状态',
					type: 'select',
					dataIndex: 'withdrawStatus',
					label: 'value',
					options: [
						{
							value: '全部',
							withdrawStatus: '',
						},
						{
							value: '转账中',
							withdrawStatus: '2',
						},
						{
							value: '转账成功',
							withdrawStatus: '3',
						},
						{
							value: '转账失败',
							withdrawStatus: '4',
						},
					],
				},
				{
					title: '发起时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '到账时间',
					type: 'datetimerange',
					dataIndex: ['finishTimeStart', 'finishTimeEnd'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction101: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportListUserCompensationWithdraw',
					click: () => {
						this.$confirm('确定导出补偿转账列表？', '提示', {
							type: 'warning',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.formData101
									paramJson.transferType = 0

									let { data } = await exportListUserCompensationWithdraw(
										paramJson
									)
									downloadFile(data, '补偿转账列表.xlsx')
								}
							},
						})
					},
				},
			],
			accountItems104: [
				{
					type: 'amount',
					title: '发起转账总金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '转账成功总金额',
					value: '0.00',
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					title: '转账ID',
					dataIndex: 'userCompensationWithdrawId',
				},
				{
					type: 'string',
					title: '交易流水号',
					dataIndex: 'transactionSn',
					width: '140',
				},
				{
					type: 'string',
					title: '用户ID',
					dataIndex: 'userId',
				},
				{
					type: 'amount',
					title: '转账金额',
					dataIndex: 'amount',
				},
				{
					title: '手续费',
					type: 'amount',
					dataIndex: 'withdrawCommission',
				},
				{
					title: '实际到账金额',
					type: 'amount',
					dataIndex: 'actualAmount',
				},
				{
					title: '发起转账时间',
					type: 'date',
					dataIndex: 'addTime',
					width: '150',
				},
				{
					title: '到账时间',
					type: 'date',
					dataIndex: 'finishTime',
					width: '150',
				},
				{
					title: '转账状态',
					type: 'string',
					dataIndex: 'withdrawStatus',
					customRender: (row) => {
						const optionsArr = ['', '待转账', '转账中', '转账成功', '转账失败']
						return optionsArr[row.withdrawStatus]
					},
				},
				{
					title: '反馈',
					type: 'string',
					dataIndex: 'withdrawResp',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							auth: '',
							dialogId: '',
							click: async (row) => {
								this.dialogVisible105 = true
								this.dialogLoading105 = true
								const {
									data: { resultCode, resultData },
								} = await userWithdrawAccount({
									withdrawAccountId: row.withdrawAccountId,
									userCompensationWithdrawId: row.userCompensationWithdrawId,
								})
								this.dialogLoading105 = false
								if (resultCode == 0) {
									this.formData106 = resultData
								}
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			dialogVisible105: false,
			dialogLoading105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible105 = false
					},
				},
			],
			formData106: {
				name: '',
				bankAccount: '',
				phone: '',
			},
			formCfg106: [
				{
					type: 'text',
					title: '姓名',
					dataIndex: 'name',
				},
				{
					type: 'text',
					title: '银行卡号',
					dataIndex: 'bankAccount',
				},
				{
					title: '银行预留手机号',
					type: 'text',
					dataIndex: 'phone',
				},
			],
		}
	},
	methods: {
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			paramJson.transferType = 0
			const {
				data: { resultCode, resultData },
			} = await listUserCompensationWithdraw(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.pageResult.records
				this.page102.count = resultData.pageResult.total
				this.accountItems104[0].value = resultData.totalAmount
				this.accountItems104[1].value = resultData.succeedTotalAmount
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
