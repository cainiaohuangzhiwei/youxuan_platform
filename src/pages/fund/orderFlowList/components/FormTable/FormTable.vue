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
					v-loading="showLoading"
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
import { fundOrderFlowList } from '@/api/accountService'
// import { getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			showLoading: false,
			searchData: {
				businessSn: '',
			},
			searchCfg: [
				{
					title: '业务单号',
					dataIndex: 'businessSn',
					placeholder: '请业务单号',
				},
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
						this.init(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'string',
					title: '变动时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'businessString',
					title: '业务类型',
					// customRender: (row) => {
					// 	return getConstantValueByKey(
					// 		this.$store.state.app.constant.ORDER_FLOW_SERVICE,
					// 		row.accountTypeString,
					// 		'-',
					// 		'accountTypeString'
					// 	)
					// },
				},
				{
					type: 'string',
					dataIndex: 'balanceType',
					title: '变动账户',
					customRender: (row) => {
						return row.balanceType == 0
							? '可用余额账户'
							: row.balanceType == 1
							? '待结算账户'
							: ''
					},
				},
				{
					dataIndex: 'accountName',
					title: '账户名称',
				},
				{
					type: 'string',
					dataIndex: 'accountTypeString',
					title: '账户类型',
				},
				{
					dataIndex: 'amount',
					title: '变动金额',
					customRender: (row) => {
						if (row.operationType == 1) {
							return '-￥' + numberFormat(row.amount, 2)
						} else {
							return '+￥' + numberFormat(row.amount, 2)
						}
					},
				},
				{
					dataIndex: 'balance',
					title: '剩余金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.balance, 2)
					},
				},
				{
					dataIndex: 'businessSn',
					title: '关联业务单号',
				},
				{
					dataIndex: 'remark',
					title: '备注',
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
		// 订单流水业务查询
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			if (!paramJson.businessSn) {
				this.$message.warning('请输入业务单号')
				return
			}
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { recordList = [], count = 0 },
				},
			} = await fundOrderFlowList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = recordList
				this.page.count = count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
