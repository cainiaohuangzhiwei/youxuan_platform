<template>
	<basicContainer>
		<yx-form
			:inline="true"
			:data="formData101"
			:items="formCfg101"
			:formAction="formAction101"
		>
		</yx-form>
		<yx-accounts :items="accountItems103"></yx-accounts>

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
import { afterSalesOverTimeStatistical } from '@/api/afterSales'
import { exportSuppUnHandle } from '@/api/webImport'
import { wgGetDate, downloadFile } from '@/utils/helper/common'
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
			loading: false,
			formData101: {
				startTime: wgGetDate().getSevenStartDate,
				endTime: wgGetDate().getCurrentEndDate,
				timeSelect: 1,
				type: 1,
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
				{
					type: 'radioButton',
					title: '',
					dataIndex: 'type',
					label: 'value',
					options: [
						{
							type: 1,
							value: '平台未受理',
						},
						{
							type: 2,
							value: '商家未受理',
						},
						{
							type: 3,
							value: '商家未退款',
						},
						{
							type: 4,
							value: '平台未退款',
						},
					],
					change: (val) => {
						this.formData101.type = val
						if (!this.loading) this.getData102(true)
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
				{
					title: '导出Excel',
					type: '',
					auth: 'exportSuppUnHandle',
					click: async () => {
						// 导出数据
						let paramJson = this.findSearchParams102()
						let { data } = await exportSuppUnHandle(paramJson)
						downloadFile(data, 'excel.xls')
					},
					tableId: 102,
				},
			],
			accountItems103: [
				{
					type: 'order',
					title: '总',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '24小时以内',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '24-48小时',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '48-72小时',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '72-96小时',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '96-120小时',
					value: '0',
					extra: '0.00%',
				},
				{
					type: 'order',
					title: '120小时以上',
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
					dataIndex: 'insideTwentyFour',
					title: '24小时以内',
				},
				{
					type: 'string',
					dataIndex: 'twentyFourToFortyEight',
					title: '24-48小时',
				},
				{
					type: 'string',
					dataIndex: 'fortyEightToSeventyTwo',
					title: '48-72小时',
				},
				{
					type: 'string',
					dataIndex: 'seventyTwoToNinetySix',
					title: '72-96小时',
				},
				{
					type: 'string',
					dataIndex: 'ninetySixToTwelveZero',
					title: '96-120小时',
				},
				{
					type: 'string',
					dataIndex: 'overTwelveZero',
					title: '120小时以上',
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
			} = await afterSalesOverTimeStatistical(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.overTimeStatisticalCountTotal) {
				let msg = resultData.overTimeStatisticalCountTotal
				this.accountItems103[0].value = msg.total
				this.accountItems103[0].extra = '---'

				this.accountItems103[1].value = msg.insideTwentyFour
				this.accountItems103[1].extra =
					((msg.insideTwentyFour / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[2].value = msg.twentyFourToFortyEight
				this.accountItems103[2].extra =
					((msg.twentyFourToFortyEight / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[3].value = msg.fortyEightToSeventyTwo
				this.accountItems103[3].extra =
					((msg.fortyEightToSeventyTwo / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[4].value = msg.seventyTwoToNinetySix
				this.accountItems103[4].extra =
					((msg.seventyTwoToNinetySix / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[5].value = msg.ninetySixToTwelveZero
				this.accountItems103[5].extra =
					((msg.ninetySixToTwelveZero / msg.total) * 100).toFixed(2) + '%'

				this.accountItems103[6].value = msg.overTwelveZero
				this.accountItems103[6].extra =
					((msg.overTwelveZero / msg.total) * 100).toFixed(2) + '%'
			}
			if (resultData.overTimeStatisticalCountList) {
				this.tableData102 = resultData.overTimeStatisticalCountList
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

			const paramJson = Object.assign(this.formData101, {
				length: this.page101.length,
				startIndex: (this.page101.currentPage - 1) * this.page101.length,
			})
			return paramJson
		},
	},
}
</script>
