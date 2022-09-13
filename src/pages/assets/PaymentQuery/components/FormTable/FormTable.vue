<template>
	<basic-container>
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
			>
			</yx-table>
		</el-row>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getPaymentInfoByTrxNo } from '@/api/weeget-bullet-order-rest'

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
				trxNo: '', // 商户单号
			},
			searchCfg: [
				{
					type: 'input',
					title: '商户单号',
					dataIndex: 'trxNo',
					enter: () => {
						this.callGetPayMentSnAndOrderSn(true)
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callGetPayMentSnAndOrderSn(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'trxNo',
					title: '商户单号',
				},
				{
					type: 'string',
					dataIndex: 'bankSn',
					title: '支付流水号',
				},
				{
					type: 'string',
					dataIndex: 'paymentSn',
					title: '收款单号',
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
			],
			// page: {
			// 	count: 0,
			// 	length: 10,
			// 	currentPage: 1,
			// 	tableChange: () => {
			// 		this.callGetPayMentSnAndOrderSn()
			// 	},
			// },
		}
	},

	methods: {
		// findSearchParams(flag) {
		// 	//搜索条件
		// 	let paramJson = Object.assign(this.searchData, {
		// 		startIndex: 0,
		// 		length: 1,
		// 	})
		// 	// 每页的加载数据长度
		// 	paramJson.length = this.page.length
		// 	// 当前页的条数开始
		// 	if (flag) {
		// 		this.page.currentPage = 1
		// 	}
		// 	paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
		// 	return paramJson
		// },
		callGetPayMentSnAndOrderSn: async function () {
			let paramJson = this.searchData
			if (!paramJson.trxNo) {
				return this.$message.warning('请输入商户单号')
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData = {} },
			} = await getPaymentInfoByTrxNo(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData || []
			} else {
				this.tableData = []
			}
		},
	},
}
</script>
