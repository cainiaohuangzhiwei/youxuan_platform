<template>
	<div class="inviteCodeTotalList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData107"
				:items="formCfg107"
				:formAction="formAction107"
			>
			</yx-form>
			<yx-accounts :items="accountItems109"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns108"
				:pagination="page108"
				:data="tableData108"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	getInviteCodeListByCondition,
	exportInviteCodeListByCondition,
} from '@/api/yhtPlusCmsFinance'
import { downloadFile } from '@/utils/helper/common'

export default {
	name: 'InviteCodeTotalList',
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData107: {
				keyword: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
			},
			formCfg107: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: '请输入关键词',
				},
				{
					type: 'datetimerange',
					title: '下单时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction107: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData108(true)
					},
					tableId: 108,
				},
				{
					title: '导出Excel',
					type: 'warning',
					auth: 'exportInviteCodeListByCondition',
					click: () => {
						this.exportExcel()
					},
				},
			],
			accountItems109: [
				{
					type: 'amount',
					title: '邀请码盈利总额',
					value: '0.00',
				},
			],
			tableData108: [],
			tableColumns108: [
				{
					type: 'string',
					dataIndex: 'inviteCode',
					title: '邀请码',
				},
				{
					type: 'string',
					dataIndex: 'phoneMob',
					title: '手机号',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '购买时间',
				},
				{
					type: 'amount',
					dataIndex: 'payAmount',
					title: '支付金额',
				},
				{
					type: 'amount',
					dataIndex: 'gain',
					title: '盈利金额',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '查看',
							auth: '',
							dialogId: '',
							click: () => {},
						},
					],
				},
			],
			page108: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData108()
				},
			},
		}
	},

	created() {
		this.getData108(true)
	},

	methods: {
		// 导出Excel
		exportExcel: async function () {
			let paramJson = this.formData107
			const loading = this.$loading({
				lock: true,
				text: '正在导出，请稍等',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let { data } = await exportInviteCodeListByCondition(paramJson)
			loading.close()
			downloadFile(data, '返退总额明细表.xlsx')
		},
		// 获取列表数据
		async getData108(flag) {
			this.loading = true
			let paramJson = this.findSearchParams108(flag)
			const {
				data: { resultCode, resultData },
			} = await getInviteCodeListByCondition(paramJson)
			if (resultCode == 0) {
				this.accountItems109[0].value = resultData.buyAmount || 0
				this.tableData108 = resultData.flowInviteCodeList
				this.page108.count = resultData.count
			} else {
				this.accountItems109[0].value = 0
				this.tableData108 = []
				this.page108.count = 0
			}
			this.loading = false
		},
		findSearchParams108(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page108.currentPage = 1
			}
			const paramJson = Object.assign(this.formData107, {
				length: this.page108.length,
				startIndex: (this.page108.currentPage - 1) * this.page108.length,
			})
			return paramJson
		},
	},
}
</script>
