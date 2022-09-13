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
import { accountList, sftEnable, supplierEnableFreeze } from '@/api/newFund'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			merchantAccountPaymentDetails: checkFunctionCode(
				'merchantAccountPaymentDetails'
			),
			merchantAccountBalancePrice: checkFunctionCode(
				'merchantAccountBalancePrice'
			),
			loading: false,
			formData101: {
				accountName: '',
				frozen: '',
				sftState: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '账户名称',
					dataIndex: 'accountName',
					placeholder: '请输入账户名称',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					title: '账户状态',
					type: 'select',
					dataIndex: 'frozen',
					placeholder: '账户状态',
					label: 'value',
					options: [
						{
							value: '全部',
							frozen: '',
						},
						{
							value: '正常',
							frozen: 0,
						},
						{
							value: '冻结',
							frozen: 1,
						},
					],
					change: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				// 开户状态: 1-资料校验中,2-待账户验证,3-审核中,4-已驳回,5-待签约,6-完成,7-已冻结
				{
					title: '开户状态',
					type: 'select',
					dataIndex: 'sftState',
					placeholder: '账户状态',
					label: 'value',
					options: this.$store.state.app.constant.sftState,
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
					type: 'amount',
					dataIndex: 'loanAmount',
					title: '借支金额',
				},
				{
					type: 'string',
					dataIndex: 'frozen',
					title: '状态',
					customRender: (row) => {
						// 冻结状态 0-未冻结，1-已冻结
						const arr = ['正常', '冻结']
						return arr[row.frozen]
					},
				},
				{
					type: 'string',
					dataIndex: 'sftState',
					title: '收付通签约状态',
					customRender: (row) => {
						//  1-资料校验中,2-待账户验证,3-审核中,4-已驳回,5-待签约,6-完成,7-已冻结
						const arr = [
							'',
							'资料校验中,',
							'待账户验证',
							'审核中',
							'已驳回',
							'待签约',
							'完成',
							'已冻结',
						]
						return arr[row.sftState]
					},
				},
				{
					type: 'string',
					dataIndex: 'enable',
					title: '收付通启用状态',
					customRender: (row) => {
						// 启用状态 0-未启用，1-启用
						const arr = ['未启用', '启用']
						return arr[row.enable]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '启用',
							popconfirm: true,
							popconfirmTitle: '请确认，是否要启用【收付通开关】？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							auth: 'sftEnable',
							confirm: async (row) => {
								const {
									data: { resultCode },
								} = await sftEnable({
									accountSn: row.accountSn,
								})
								this.loading = false
								if (resultCode == 0) {
									this.$message.success('启用成功！')
									this.getData102()
								}
							},
							customRender: (action, row) => {
								action.hide = row.enable == 1
								return action
							},
						},
						{
							title: '查看详情',
							auth: '',
							click: (row) => {
								if (
									!this.merchantAccountPaymentDetails ||
									!this.merchantAccountBalancePrice
								) {
									return this.$message.warning('请联系管理员获取权限！')
								}
								this.$router.push({
									path: `/newFund/sftAccountDetails/${row.accountSn}`,
									query: {
										c: encodeURIComponent(row.accountName),
									},
								})
							},
						},
						{
							title: '查看签约资料',
							auth: 'sftAccountDetail',
							click: (row) => {
								this.$router.push({
									path: `/newFund/signingInformation/${row.supplierId}`,
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
							auth: 'supplierEnableFreeze',
							confirm: (row) => {
								this.supplierEnableFreeze(row)
							},
							customRender: (action, row) => {
								action.title = row.frozen == 0 ? '冻结' : '解冻'
								action.popconfirmTitle = `请确认，是否要${
									row.frozen == 0 ? '冻结' : '解冻'
								}收付通商家账户？`
								return action
							},
						},
					],
				},
			],
			page102: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},

	created() {
		this.getData102(true)
	},

	methods: {
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await accountList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData102 = resultData.recordList || []
				this.page102.count = resultData.count
			}
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
		async supplierEnableFreeze(row) {
			const {
				data: { resultCode },
			} = await supplierEnableFreeze({
				accountSn: row.accountSn,
				accountStatus: row.frozen == 1 ? 0 : 1,
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message.success('操作成功！')
				this.getData102()
			}
		},
	},
}
</script>
