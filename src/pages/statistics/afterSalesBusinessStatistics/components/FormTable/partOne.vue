<template>
	<basicContainer>
		<yx-form
			:inline="true"
			:data="formData101"
			:items="formCfg101"
			:formAction="formAction101"
		>
		</yx-form>
		<yx-accounts v-loading="loading" :items="accountItems103"></yx-accounts>

		<yx-table
			v-loading="loading"
			:columns="tableColumns102"
			:data="tableData102"
			:pagination="page101"
		></yx-table>
	</basicContainer>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import { afterSalesStatusStatistical } from '@/api/afterSales'
import { wgGetDate } from '@/utils/helper/common'
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
export default {
	components: {
		YxForm,
		YxAccounts,
		YxTable,
		BasicContainer,
	},
	props: [],
	data() {
		return {
			radio1: '7天',
			loading: false,
			formData101: {
				startTime: wgGetDate().getSevenStartDate,
				endTime: wgGetDate().getCurrentEndDate,
				timeSelect: 1,
			},
			page101: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			formCfg101: [
				{
					type: 'radioButton',
					title: '时间',
					dataIndex: 'timeSelect',
					label: 'value',
					options: [
						{
							timeSelect: 1,
							value: '7天',
						},
						{
							timeSelect: 2,
							value: '14天',
						},
					],
					change: (val) => {
						if (!val) {
							this.formData101.timeSelect = ''
						}
						this.handleSearch(val)
					},
				},
				{
					type: 'datetimerange',
					title: '时段选择',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
					change: () => {
						this.formData101.timeSelect = ''
						// if (!this.loading) this.getData102(true)
					},
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
			],
			accountItems103: [
				{
					type: 'order',
					title: '售后单总数量',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '平台未受理',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '商家未受理',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '结果确认中',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '待寄出',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '已寄出',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '待退款',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '退款中',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '退款成功',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '已关闭',
					value: '0',
					extra: '0.00%',
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'total',
					title: '售后单总数量',
				},
				{
					type: 'string',
					dataIndex: 'platformUnHandle',
					title: '平台未受理',
				},
				{
					type: 'string',
					dataIndex: 'suppUnHandle',
					title: '商家未受理',
				},
				{
					type: 'string',
					dataIndex: 'confirming',
					title: '结果确认中',
				},
				{
					type: 'string',
					dataIndex: 'givingOut',
					title: '待寄出',
				},
				{
					type: 'string',
					dataIndex: 'givedOut',
					title: '已寄出',
				},
				{
					type: 'string',
					dataIndex: 'waitForRefund',
					title: '待退款',
				},
				{
					type: 'string',
					dataIndex: 'refunding',
					title: '退款中',
				},
				{
					type: 'string',
					dataIndex: 'refunded',
					title: '退款成功',
				},
				{
					type: 'string',
					dataIndex: 'closed',
					title: '已关闭',
				},
			],
		}
	},

	created() {
		this.getData102()
	},

	methods: {
		// 操作时间类型
		handleSearch(val) {
			if (val == '1') {
				this.formData101.startTime = wgGetDate().getSevenStartDate
				this.formData101.endTime = wgGetDate().getCurrentEndDate
			} else if (val == '2') {
				this.formData101.startTime = wgGetDate().getFourteendayStartDate
				this.formData101.endTime = wgGetDate().getCurrentEndDate
			}
			this.getData102(true)
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await afterSalesStatusStatistical(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.statusStatisticalCountTotal) {
				let msg = resultData.statusStatisticalCountTotal
				this.accountItems103[0].value = msg.total
				this.accountItems103[0].extra = '---'

				this.accountItems103[1].value = msg.platformUnHandle
				this.accountItems103[1].extra =
					((msg.platformUnHandle / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[2].value = msg.suppUnHandle
				this.accountItems103[2].extra =
					((msg.suppUnHandle / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[3].value = msg.confirming
				this.accountItems103[3].extra =
					((msg.confirming / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[4].value = msg.givingOut
				this.accountItems103[4].extra =
					((msg.givingOut / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[5].value = msg.givedOut
				this.accountItems103[5].extra =
					((msg.givedOut / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[6].value = msg.waitForRefund
				this.accountItems103[6].extra =
					((msg.waitForRefund / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[7].value = msg.refunding
				this.accountItems103[7].extra =
					((msg.refunding / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[8].value = msg.refunded
				this.accountItems103[8].extra =
					((msg.refunded / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[9].value = msg.closed
				this.accountItems103[9].extra =
					((msg.closed / msg.total) * 100).toFixed(2) + '%'
			}
			if (resultData.statusStatisticalCountList) {
				this.tableData102 = resultData.statusStatisticalCountList
				this.page101.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page101.currentPage = 1
			}
			this.formData101.startTime =
				moment(this.formData101.startTime).valueOf() || ''
			this.formData101.endTime =
				moment(this.formData101.endTime).valueOf() || ''
			this.formData101.type = this.radioType
			const paramJson = Object.assign(this.formData101, {
				length: this.page101.length,
				startIndex: (this.page101.currentPage - 1) * this.page101.length,
			})
			return paramJson
		},
	},
}
</script>
