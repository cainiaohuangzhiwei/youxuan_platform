<template>
	<div class="couponStatistics">
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
				<template slot="index" slot-scope="scope">
					{{ scope.index + 1 }}
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { sftShopAccountList, sftShopAccountEnableFreeze } from '@/api/newFund'
import { isNull } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData101: {
				organizationId: '',
				phone: '',
				accountStatus: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '店主ID',
					dataIndex: 'organizationId',
					placeholder: '请输入店主ID',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'phone',
					placeholder: '请输入手机号',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					title: '账户状态',
					type: 'select',
					dataIndex: 'accountStatus',
					placeholder: '账户状态',
					label: 'value',
					options: [
						{
							value: '全部',
							accountStatus: '',
						},
						{
							value: '正常',
							accountStatus: 0,
						},
						{
							value: '冻结',
							accountStatus: 1,
						},
					],
					change: () => {
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
					title: '重置',
					auth: '',
					isClear: true,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'index',
					title: '编号',
				},
				{
					type: 'string',
					dataIndex: 'accountName',
					title: '账户名称',
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
				// {
				// 	type: 'amount',
				// 	dataIndex: 'settleAmount',
				// 	title: '待结算金额',
				// },
				{
					type: 'amount',
					dataIndex: 'balance',
					title: '可用余额',
				},
				{
					type: 'amount',
					dataIndex: 'withdrawAmount',
					title: '提现中金额',
				},
				{
					type: 'string',
					dataIndex: 'frozen',
					title: '状态',
					customRender: (row) => {
						const arr = ['正常', '冻结']
						return arr[row.frozen]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							auth: 'balancePrice',
							click: (row) => {
								this.$router.push({
									path: `/newFund/shopkeeperAccountDetails/${row.accountSn}/6`,
								})
							},
						},
						{
							title: '--',
							popconfirm: true,
							popconfirmTitle: '---',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							auth: 'sftShopAccountEnableFreeze',
							confirm: (row) => {
								this.sftShopAccountEnableFreeze(row)
							},
							customRender: (action, row) => {
								action.title = row.frozen == 0 ? '冻结' : '解冻'
								action.popconfirmTitle = `请确认，是否要${
									row.frozen == 0 ? '冻结' : '解冻'
								}收付通店主账户？`
								return action
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
		}
	},

	methods: {
		async getData102(flag) {
			let paramJson = this.findSearchParams102(flag)
			if (isNull(paramJson.phone)) {
				this.$message.error('请输入手机号')
				return
			}
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await sftShopAccountList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData102 = resultData.list || []
				this.page102.count = resultData.count
			}
		},
		async sftShopAccountEnableFreeze(row) {
			const {
				data: { resultCode },
			} = await sftShopAccountEnableFreeze({
				accountSn: row.accountSn,
				accountStatus: row.frozen == 0 ? 1 : 0,
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message.success('操作成功！')
				this.getData102()
			}
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				pageSize: this.page102.length,
				curPage: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
