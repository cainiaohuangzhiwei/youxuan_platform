<template>
	<div class="exchange-coupon-list">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
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
				},
				{
					title: '兑换状态',
					type: 'select',
					dataIndex: 'withdrawStatus',
					label: 'value',
					options: [
						{
							value: '全部',
							withdrawStatus: '',
						},
						{
							value: '兑换中',
							withdrawStatus: '2',
						},
						{
							value: '兑换成功',
							withdrawStatus: '3',
						},
						{
							value: '兑换失败',
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
						this.$confirm('确定导出优惠券兑换列表？', '提示', {
							type: 'warning',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.formData101
									paramJson.transferType = 4

									let { data } = await exportListUserCompensationWithdraw(
										paramJson
									)
									downloadFile(data, '优惠券兑换列表.xlsx')
								}
							},
						})
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					title: '提现ID',
					dataIndex: 'userCompensationWithdrawId',
					width: '100',
				},
				{
					type: 'string',
					title: '用户ID',
					dataIndex: 'userId',
					width: '140',
				},
				{
					type: 'string',
					title: '交易流水号',
					dataIndex: 'transactionSn',
					width: '140',
				},
				{
					title: '优惠券',
					type: 'string',
					dataIndex: 'extraInfo',
				},
				{
					title: '兑换状态',
					type: 'string',
					dataIndex: 'withdrawStatus',
					width: '140',
					customRender: (row) => {
						const optionsArr = ['', '待兑换', '兑换中', '兑换成功', '兑换失败']
						return optionsArr[row.withdrawStatus]
					},
				},
				{
					title: '发起兑换时间',
					type: 'date',
					dataIndex: 'addTime',
				},
				{
					title: '到账时间',
					type: 'date',
					dataIndex: 'finishTime',
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
			paramJson.transferType = 4
			const {
				data: { resultCode, resultData },
			} = await listUserCompensationWithdraw(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.pageResult.records
				this.page102.count = resultData.pageResult.total
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
