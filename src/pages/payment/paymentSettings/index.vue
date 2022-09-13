<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="支付设置" name="one">
				<yx-form
					:inline="true"
					:data="formData115"
					:items="formCfg115"
					:formAction="formAction115"
				>
				</yx-form>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-tab-pane>
			<el-tab-pane label="提现设置" name="two">
				<yx-form
					:inline="true"
					:data="formDataWithdraw"
					:items="formCfgWithdraw"
					:formAction="formActionWithdraw"
				>
				</yx-form>
				<yx-table
					v-loading="showLoadingWithdraw"
					:columns="tableColumnsWithdraw"
					:pagination="pageWithdraw"
					:data="tableDataWithdraw"
				></yx-table>
			</el-tab-pane>
		</el-tabs>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	refreshCache,
	payRouteList,
	modifyState,
	modifyWeight,
} from '@/api/weeget-bullet-payment-rest'
export default {
	name: 'PaymentSettings',
	components: {
		BasicContainer,
		YxTable,
		YxForm,
	},
	data() {
		return {
			activeName: 'one',
			showLoadingWithdraw: false,
			formDataWithdraw: {
				product: '',
			},
			formCfgWithdraw: [
				// {
				// 	type: 'select',
				// 	title: '通道名称',
				// 	dataIndex: 'product',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			product: '',
				// 			value: '全部',
				// 		},
				// 		{
				// 			product: 'JOIN_PAY',
				// 			value: '汇聚支付',
				// 		},
				// 		{
				// 			product: 'JOIN_PAYMENT',
				// 			value: '收付通',
				// 		},
				// 		{
				// 			product: 'JOIN_PAYMENT',
				// 			value: '薪众包',
				// 		},
				// 	],
				// },
			],
			formActionWithdraw: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._payRouteList(true)
					},
				},
			],
			formData115: {
				product: '',
				state: '',
			},
			formCfg115: [
				{
					type: 'select',
					title: '状态',
					dataIndex: 'state',
					label: 'value',
					options: [
						{
							state: '',
							value: '全部',
						},
						{
							state: 'ENABLE',
							value: '启用',
						},
						{
							state: 'DISABLE',
							value: '禁用',
						},
					],
				},
			],
			tableColumnsWithdraw: [
				{
					type: 'string',
					dataIndex: 'channel',
					title: '通道名称',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'product',
				// 	title: '支付产品',
				// },
				{
					type: 'string',
					dataIndex: 'channelName',
					title: '商户名称',
				},
				{
					type: 'string',
					dataIndex: 'mchId',
					title: '平台商户号',
				},
				{
					type: 'string',
					dataIndex: 'reportMchId',
					title: '报备商户号',
				},
				{
					type: 'string',
					dataIndex: 'weight',
					title: '支付权重',
				},
				{
					type: 'newMap',
					dataIndex: 'state',
					title: '状态',
					options: [
						['ENABLE', '启用'],
						['DISABLE', '禁用'],
					],
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					width: 200,
					actions: [
						{
							title: '禁用',
							auth: '',
							popconfirm: true,
							popconfirmTitle: '请确认是否禁用该通道',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._modifyState(row)
							},
							customRender: (action, { state }) => {
								action.title = state == 'ENABLE' ? '禁用' : '启用'
								action.popconfirmTitle = `请确认是否${action.title}该通道`
								return action
							},
						},
						{
							title: '配置权重',
							auth: '',
							click: ({ routeId, weight }) => {
								this.$prompt('配置权重', '', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									inputValue: weight,
									inputPattern: /^([1]?\d{1,2})$/,
									inputErrorMessage: '权重只允许配置为0-100正整数',
								}).then(({ value }) => {
									this._modifyWeight(value, routeId)
								})
							},
							customRender: (action, { state }) => {
								action.hide = state == 'ENABLE' ? false : true
								return action
							},
						},
					],
				},
			],
			pageWithdraw: {
				count: 0,
				length: 20,
				currentPage: 1,
				pageSizes: [20, 30, 50, 100],
				tableChange: () => {
					this._payRouteList()
				},
			},
			tableDataWithdraw: [],
			formAction115: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._payRouteList(true)
					},
				},
				{
					title: '刷新支付权重',
					type: 'success',
					click: () => {
						this._refreshCache()
					},
				},
			],
			showLoading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'channel',
					title: '通道名称',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'product',
				// 	title: '支付产品',
				// },
				{
					type: 'string',
					dataIndex: 'channelName',
					title: '商户名称',
				},
				{
					type: 'string',
					dataIndex: 'mchId',
					title: '平台商户号',
				},
				{
					type: 'string',
					dataIndex: 'reportMchId',
					title: '报备商户号',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'subMchid',
				// 	title: '二级商户ID',
				// },
				// {
				// 	type: 'string',
				// 	dataIndex: 'mchName',
				// 	title: '商家名称',
				// },
				{
					type: 'string',
					dataIndex: 'weight',
					title: '支付权重',
				},
				{
					type: 'newMap',
					dataIndex: 'state',
					title: '状态',
					options: [
						['ENABLE', '启用'],
						['DISABLE', '禁用'],
					],
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					width: 200,
					actions: [
						{
							title: '禁用',
							auth: '',
							popconfirm: true,
							popconfirmTitle: '请确认是否禁用该通道',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._modifyState(row)
							},
							customRender: (action, { state }) => {
								action.title = state == 'ENABLE' ? '禁用' : '启用'
								action.popconfirmTitle = `请确认是否${action.title}该通道`
								return action
							},
						},
						{
							title: '配置权重',
							auth: '',
							click: ({ routeId, weight }) => {
								this.$prompt('配置权重', '', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									inputValue: weight,
									inputPattern: /^([1]?\d{1,2})$/,
									inputErrorMessage: '权重只允许配置为0-100正整数',
								}).then(({ value }) => {
									this._modifyWeight(value, routeId)
								})
							},
							customRender: (action, { state }) => {
								action.hide = state == 'ENABLE' ? false : true
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 20,
				currentPage: 1,
				pageSizes: [20, 30, 50, 100],
				tableChange: () => {
					this._payRouteList()
				},
			},
			tableData: [],
		}
	},
	created() {
		this._payRouteList(true)
	},
	methods: {
		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this._payRouteList()
			} else {
				this._payRouteList()
			}
		},
		async _modifyWeight(weight, routeId) {
			let {
				data: { resultCode },
			} = await modifyWeight({
				routeId,
				weight,
			})
			if (resultCode == 0) {
				this.$message.success('修改成功')
				this._payRouteList()
			}
		},
		async _modifyState({ routeId, state }) {
			let {
				data: { resultCode },
			} = await modifyState({
				routeId,
				state: state == 'ENABLE' ? 'DISABLE' : 'ENABLE',
			})
			if (resultCode == 0) {
				this.$message.success('修改成功')
				this._payRouteList()
			}
		},
		async _refreshCache() {
			let {
				data: { resultCode },
			} = await refreshCache({})
			if (resultCode == 0) {
				this.$message.success('刷新成功')
			}
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag && this.activeName == 'one') {
				this.page.currentPage = 1
			}
			if (flag && this.activeName == 'two') {
				this.pageWithdraw.currentPage = 1
			}
			const paramJson =
				this.activeName == 'one'
					? Object.assign(
							{ ...this.formData115, developerId: '10001' },
							{
								limit: this.page.length,
								offset: (this.page.currentPage - 1) * this.page.length,
							}
					  )
					: Object.assign(
							{ ...this.formDataWithdraw, developerId: '10001' },
							{
								limit: this.pageWithdraw.length,
								offset:
									(this.pageWithdraw.currentPage - 1) *
									this.pageWithdraw.length,
							}
					  )
			if (this.activeName == 'one') {
				paramJson.bizType = 'PAY'
			} else {
				paramJson.bizType = 'PAYMENT'
			}
			return paramJson
		},
		async _payRouteList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { routeList, total },
				},
			} = await payRouteList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				if (this.activeName == 'one') {
					this.tableData = routeList
					this.page.count = total
				} else {
					this.tableDataWithdraw = routeList
					this.pageWithdraw.count = total
				}
			} else {
				this.page.count = 0
				this.tableData = []
				this.pageWithdraw.count = 0
				this.tableDataWithdraw = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.t-btn {
	display: flex;
	width: 100%;
	justify-content: flex-end;
	margin-bottom: 20px;
}
</style>
