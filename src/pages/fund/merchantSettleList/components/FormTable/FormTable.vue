<template>
	<basic-container>
		<div>
			<yx-form
				v-loading="exportLoading"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template #supplier>
					<el-autocomplete
						v-model="searchData.supplierName"
						debounce
						:fetch-suggestions="_getCmsSupplierListByCondition"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@select="
							(item) => {
								searchData.supplierName = item.supplierName
							}
						"
					>
					</el-autocomplete>
				</template>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</el-row>
		</div>
		<!-- 提现信息弹框 -->
		<InfoDialog
			:options.sync="options"
			:dialogVisible.sync="dialogVisible"
		></InfoDialog>
		<Dialog
			:title="dialogTitle101"
			:visible="dialogVisible101"
			:width="dialogWidth101"
			:bottomBtn="dialogBottomBtn101"
			@before-close="
				() => {
					dialogVisible101 = false
				}
			"
		>
			<div>导出任务已经创建，请前往下载中心查找相关下载</div>
		</Dialog>
	</basic-container>
</template>

<script>
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { merchantSettleList, merchantSettleExport } from '@/api/orderSettle'
import moment from 'moment'
import InfoDialog from '../InfoDialog'
import { getCmsSupplierListByCondition } from '@/api/webImport'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		InfoDialog,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			dialogTitle101: '创建导出任务',
			dialogWidth101: '50%',
			dialogVisible101: false,
			dialogBottomBtn101: [
				{
					title: '留在此页',
					type: 'primary',
					click: async () => {
						this.dialogVisible101 = false
					},
				},
				{
					title: '前往下载中心',
					type: 'primary',
					click: async () => {
						this.$router.push({
							path: '/business/downloadCenter',
						})
						this.dialogVisible101 = false
					},
				},
			],
			exportLoading: false,
			showLoading: false,
			dialogVisible: false, // 提现信息弹框开关
			options: {}, // 订单信息
			searchData: {
				orderSn: '', // 订单编号
				supplierName: '', //商家名称
				orderTime: [
					moment().startOf('day').valueOf(),
					moment().endOf('day').valueOf(),
				], //发起开
			},
			searchCfg: [
				{
					title: '订单时间',
					type: 'time',
					dataIndex: 'orderTime',
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
					},
				},
				{
					title: '订单编号',
					type: 'input',
					dataIndex: 'orderSn',
				},

				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplier',
				},
			],
			searchAction: [
				{
					title: '导出',
					auth: 'merchantSettleExport',
					type: 'primary',
					click: () => {
						this.exportIt()
					},
				},
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this._merchantSettleList(true, e)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'action',
					title: '订单号',
					width: 180,
					actions: [
						{
							title: '-',
							auth: '',
							click: (row) => {
								this.$router.push({
									path: `/business/orderDetails/${row.orderId}`,
								})
							},
							customRender: (action, row) => {
								action.title = row.orderSn
								return action
							},
						},
					],
				},
				{
					type: 'date',
					dataIndex: 'orderAddTime',
					title: '订单时间',
				},
				{
					type: 'amount',
					dataIndex: 'orderAmount',
					title: '订单金额',
				},
				{
					type: 'amount',
					dataIndex: 'actAmount',
					title: '活动价',
				},
				{
					type: 'amount',
					dataIndex: 'paidAmount',
					title: '实付金额',
				},
				{
					type: 'amount',
					dataIndex: 'platformAndPromotionAmount',
					title: '平台店主总佣金',
				},
				{
					type: 'amount',
					dataIndex: 'merchantDiscountAmount',
					title: '商家承担优惠费用',
				},
				{
					type: 'amount',
					dataIndex: 'platformDiscountAmount',
					title: '平台承担优惠费用',
				},
				{
					type: 'amount',
					dataIndex: 'beenSettleAmount',
					title: '应结算金额',
				},
				{
					type: 'amount',
					dataIndex: 'refundSettleAmount',
					title: '退款结算金额',
				},
				{
					type: 'amount',
					dataIndex: 'expressAmount',
					title: '运费金额',
				},
				{
					type: 'amount',
					dataIndex: 'refundExpressAmount',
					title: '退款运费金额',
				},
				{
					type: 'amount',
					dataIndex: 'actualSettleAmountTotal',
					title: '实际总结算金额',
				},
				{
					type: 'amount',
					dataIndex: 'depositedAmount',
					title: '最终入账金额',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看详情',
							auth: 'merchantSettleListDetail',
							click: (row) => {
								this.showInfoDialog(row)
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
					this._merchantSettleList()
				},
			},
		}
	},

	methods: {
		async _getCmsSupplierListByCondition(queryString, cb) {
			let params = {
				selectionTag: 2,
				startIndex: 0,
				length: 20,
				supplierName: queryString,
			}
			let {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(params)
			if (resultCode === 0) {
				cb(resultData.supplierList)
			}
		},
		showInfoDialog(row) {
			// 设置提现信息
			this.dialogVisible = true
			this.options = row
		},
		async exportIt() {
			// 导出数据
			if (
				!this.searchData.orderTime &&
				!this.searchData.orderSn &&
				this.searchData.supplierName
			) {
				this.$message.warning('仅有商家名称时必须选择时间区间！')
				return
			}
			if (
				!this.searchData.orderSn &&
				!this.searchData.supplierName &&
				!this.searchData.orderTime
			) {
				this.$message.warning('无订单号或商家名称时，必须选择时间再导出数据')
				return
			}
			if (
				(this.searchData.supplierName || this.searchData.orderSn) &&
				this.searchData.orderTime &&
				this.searchData.orderTime[1] - this.searchData.orderTime[0] >
					20 * 3600 * 24 * 1000
			) {
				this.$message.warning('时间区间最长为20天')
				return
			}
			if (
				!this.searchData.supplierName &&
				!this.searchData.orderSn &&
				this.searchData.orderTime &&
				this.searchData.orderTime[1] - this.searchData.orderTime[0] >
					3600 * 24 * 1000
			) {
				this.$message.warning('无商家名称与无订单编号时间区间最长为1天')
				return
			}
			if (
				this.searchData.orderTime &&
				this.searchData.orderTime[1] - this.searchData.orderTime[0] >
					20 * 3600 * 24 * 1000
			) {
				this.$message.warning('时间区间最长为20天')
				return
			}
			if (
				!this.searchData.orderTime &&
				!this.searchData.orderSn &&
				this.searchData.supplierName
			) {
				this.$message.warning('仅有商家名称时必须选择时间区间！')
				return
			}
			let paramJson = this.findSearchParams()
			this.exportLoading = true
			let {
				data: { resultCode },
			} = await merchantSettleExport(paramJson)
			this.exportLoading = false

			if (resultCode == 0) {
				this.dialogVisible101 = true
			}
		},
		findSearchParams(flag) {
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
			paramJson.orderTimeStart = paramJson.orderTime
				? moment(paramJson.orderTime[0]).valueOf()
				: ''
			paramJson.orderTimeEnd = paramJson.orderTime
				? moment(paramJson.orderTime[1]).valueOf()
				: ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_merchantSettleList: async function (flag, e) {
			if (
				!this.searchData.orderSn &&
				!this.searchData.supplierName &&
				!this.searchData.orderTime
			) {
				this.$message.warning('无订单号或商家名称时，必须选择时间进行搜索')
				return
			}
			if (
				(this.searchData.supplierName || this.searchData.orderSn) &&
				this.searchData.orderTime &&
				this.searchData.orderTime[1] - this.searchData.orderTime[0] >
					20 * 3600 * 24 * 1000
			) {
				this.$message.warning('时间区间最长为20天')
				return
			}
			if (
				!this.searchData.supplierName &&
				!this.searchData.orderSn &&
				this.searchData.orderTime &&
				this.searchData.orderTime[1] - this.searchData.orderTime[0] >
					3600 * 24 * 1000
			) {
				this.$message.warning('无商家名称与无订单编号时间区间最长为1天')
				return
			}
			if (
				!this.searchData.orderTime &&
				!this.searchData.orderSn &&
				this.searchData.supplierName
			) {
				this.$message.warning('仅有商家名称时必须选择时间区间！')
				return
			}
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))

			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { count = 0, merchantSettlePageListVOList = [] },
				},
			} = await merchantSettleList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = merchantSettlePageListVOList
				this.page.count = count
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>
