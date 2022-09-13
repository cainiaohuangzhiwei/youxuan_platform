<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import { organizationQueryAccountList } from '@/api/organizationAccount'
import moment from 'moment'
// import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			loading: false,
			numberFormat: numberFormat,
			searchData: {
				organizationUserId: '',
				organizationName: '',
				phone: '', // 手机号码
			},
			searchCfg: [
				{
					title: '用户id',
					type: 'inputNumber',
					dataIndex: 'organizationUserId',
					placeholder: '请输入用户id',
					change: () => {
						this.init(true)
					},
				},
				{
					title: '账户名称',
					dataIndex: 'organizationName',
					placeholder: '请输入账户名称',
					change: () => {
						this.init(true)
					},
				},
				{
					title: '手机号',
					dataIndex: 'phone',
					placeholder: '请输入手机号',
					change: () => {
						this.init(true)
					},
				},
				// {
				// 	type: 'select',
				// 	title: '账户状态',
				// 	dataIndex: 'trusteeshipState',
				// 	label: 'value',
				// 	options: this.$store.state.app.constant.MERCHANT_ACCOUNT_STATUS,
				// 	change: () => {
				// 		this.init()
				// 	},
				// },
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'organizationId',
					title: '账户id',
				},
				{
					dataIndex: 'addTime',
					title: '创建时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					dataIndex: 'organizationUserId',
					title: '用户id',
				},
				{
					dataIndex: 'organizationName',
					title: '账户名称',
				},
				{
					dataIndex: 'availableAmount',
					title: '可用账户余额',
					customRender: (row) => {
						return '￥' + numberFormat(row.availableAmount, 2)
					},
				},
				{
					dataIndex: 'lockBalance',
					title: '提现冻结',
					customRender: (row) => {
						return '￥' + numberFormat(row.lockBalance, 2)
					},
				},
				{
					dataIndex: 'borrowingLockBalance',
					title: '借支冻结',
					customRender: (row) => {
						return '￥' + numberFormat(row.borrowingLockBalance, 2)
					},
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'trusteeshipState',
				// 	title: '状态',
				// 	customRender: (row) => {
				// 		return getConstantValueByKey(
				// 			this.$store.state.app.constant.MERCHANT_ACCOUNT_STATUS,
				// 			row.trusteeshipState,
				// 			'-',
				// 			'trusteeshipState'
				// 		)
				// 	},
				// },
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							auth: 'organizationQueryAccountDetail',
							click: (row) => {
								this.shopAccountDetails(row)
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		// this.init(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		//商家账户详情
		shopAccountDetails(row) {
			this.$router.push({
				path: `shopAccountDetails/${row.organizationId}`,
			})
		},
		// 店主账户列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			if (
				!paramJson.phone &&
				!paramJson.organizationName &&
				!paramJson.organizationUserId
			) {
				this.$message.warning('必须输入手机号或账户名称')
				return
			}
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await organizationQueryAccountList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.recordList || []
				this.page.count = resultData.totalCount || []
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
