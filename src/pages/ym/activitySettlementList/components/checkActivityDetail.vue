<template>
	<div>
		<WgForm
			v-loading="exportLoading"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
			:actionInline="true"
		></WgForm>
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
		</yx-table>
	</div>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getSaleRewardSupplierDetail,
	exportActivityDetailRecordList,
} from '@/api/userRewardSystem'
import { downloadFile } from '@/utils/helper/common'
export default {
	components: {
		WgForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			exportLoading: false,
			showLoading: false,
			supplierUndertakeAmount: 0,
			platformUndertakeAmount: 0,
			userRewardAmount: 0,
			searchData: {
				organizationId: '', // 操作人
				orderSn: '', //订单号
				actId: 0,
			},
			searchCfg: [
				{
					title: '店主ID',
					type: 'inputNumber',
					dataIndex: 'organizationId',
					placeholder: '请输入店主Id',
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'orderSn',
				},
			],
			searchAction: [
				{
					title: '导出',
					type: 'success',
					// auth: 'marketingExportRewardDetailByPlatform',
					click: () => {
						this.$confirm('确定导出列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.findSearchParams(true)
									let paramJson_ = { ...paramJson }
									const { data } = await exportActivityDetailRecordList(
										paramJson_
									)
									if (data) {
										downloadFile(data, '活动结算明细列表.xlsx')
									}
								}
							},
						})
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._getSaleRewardSupplierDetail(true)
					},
				},
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'changeGoodsQuantity',
					title: '商品件数',
					align: 'left',
				},
				{
					type: 'amount',
					dataIndex: 'changeGoodsPaidAmount',
					title: '实付金额',
				},
				{
					type: 'amount',
					dataIndex: 'baseCommission',
					title: '基础佣金',
				},
				{
					type: 'amount',
					dataIndex: 'sellingCommission',
					title: '卖货佣金',
					align: 'left',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getSaleRewardSupplierDetail()
				},
			},
		}
	},
	created() {
		this._getSaleRewardSupplierDetail(true)
	},

	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			//搜索条件
			let paramJson = Object.assign(
				{
					// startIndex: (this.page.currentPage - 1) * this.page.length,
					pageNum: this.page.currentPage,
					pageSize: this.page.length,
				},
				this.searchData
			)
			paramJson.actId = parseInt(this.$route.params.actId)
			paramJson.organizationId = Number(paramJson.organizationId)
			return paramJson
		},
		// 销售查看活动详情
		_getSaleRewardSupplierDetail: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await getSaleRewardSupplierDetail(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData = resultData
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.table-title {
	margin-bottom: 15px;
}
.table-title .table-title-span {
	font-weight: bold;
}
.table-title .table-title-amount {
	margin-right: 20px;
}
</style>
