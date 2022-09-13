<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:rules="funRules"
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
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { queryAfterSales } from '@/api/afterSales'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			searchData: {
				afterSalesSn: '', //售后单号
				channelType: 1,
			},
			funRules: {
				afterSalesSn: [
					{
						required: true,
						message: '请填写售后单号进行查询!',
						trigger: 'blur',
					},
				],
			},
			searchCfg: [
				{
					title: '售后单号',
					type: 'input',
					dataIndex: 'afterSalesSn',
					placeholder: '请输入售后单号',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callInviteCodeListByCondition(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'refAfterSalesSn',
					title: '售后单号',
				},
				{
					type: 'string',
					dataIndex: 'applicationNo',
					title: '上游售后单号',
				},
				{
					type: 'data',
					dataIndex: 'warehouseAuditTime',
					title: '购买/生成时间',
				},
				{
					type: 'string',
					dataIndex: 'warehouseAuditTime',
					title: '渠道',
					customRender: () => {
						return '爱库存'
					},
				},
				{
					type: 'string',
					dataIndex: 'applicationTypeStr',
					title: '售后类型',
				},
				{
					type: 'string',
					dataIndex: 'auditStatusStr',
					title: '上游售后单状态',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '退款金额',
				},
				{
					type: 'amount',
					dataIndex: 'freight',
					title: '退还运费',
				},
				{
					type: 'string',
					dataIndex: 'applicationTime',
					title: '申请时间',
				},
				{
					type: 'string',
					dataIndex: 'afterSaleDeadline',
					title: '上游售后截止日期',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callInviteCodeListByCondition()
				},
			},
		}
	},

	methods: {
		findSearchParams(flag) {
			this.tableData = []
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			return paramJson
		},
		callInviteCodeListByCondition: async function (flag) {
			this.tableData = []
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData = {} },
			} = await queryAfterSales(paramJson)
			this.showLoading = false
			if (resultCode === 0 && JSON.stringify(resultData) != '{}') {
				this.tableData = [resultData]
			} else {
				this.tableData = []
			}
		},
	},
}
</script>
