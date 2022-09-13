<template>
	<div class="backList">
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
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import { downloadFile } from '@/utils/helper/common'
import {
	listUserCompensationWithdraw,
	exportListUserCompensationWithdraw,
} from '@/api/yhtPlusCmsUserCompensationWithdraw'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
	},
	data() {
		return {
			loading: false,
			activeRow: {},
			operateType: '',
			formData101: {
				paramUserId: '',
				transactionSn: '',
				withdrawStatus: '',
				lockStatus: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				finishTimeStart: '',
				finishTimeEnd: '',
				wechatPhone: '',
				lockUserName: '',
				transferUserName: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '用户ID',
					dataIndex: 'paramUserId',
					placeholder: '精确筛选',
				},
				{
					type: 'input',
					title: '交易流水号',
					dataIndex: 'transactionSn',
					placeholder: '精确筛选',
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
					title: '锁定状态',
					type: 'select',
					dataIndex: 'lockStatus',
					label: 'value',
					options: [
						{
							value: '全部',
							lockStatus: '',
						},
						{
							value: '未锁定',
							lockStatus: '0',
						},
						{
							value: '已锁定',
							lockStatus: '1',
						},
					],
				},
				{
					type: 'input',
					title: '锁定人',
					dataIndex: 'lockUserName',
					placeholder: '精确筛选',
				},
				{
					type: 'input',
					title: '转账人',
					dataIndex: 'transferUserName',
					placeholder: '精确筛选',
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
									paramJson.transferType = 3

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
					title: '转账状态',
					type: 'string',
					dataIndex: 'withdrawStatus',
					customRender: (row) => {
						const optionsArr = ['', '待转账', '转账中', '转账成功', '转账失败']
						return optionsArr[row.withdrawStatus]
					},
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
					title: '反馈',
					type: 'string',
					dataIndex: 'withdrawResp',
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
		}
	},
	methods: {
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			paramJson.transferType = 3
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
