<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
			</yx-form
			><el-row>
				<div class="amount_box">
					应结算金额
					<span>￥{{ numberFormat(settlementAmount, 2) }}</span
					>到账金额
					<span>￥{{ numberFormat(settledAmount, 2) }}</span>
					退款金额
					<span>￥{{ numberFormat(refundAmount, 2) }}</span>
				</div>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="borrowerAccountName" slot-scope="scope">
						<el-button type="text" @click="goDetails(scope.row)">{{
							scope.row.borrowerAccountName
						}}</el-button>
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { numberFormat } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import {
	listPageOrderSettleItem,
	organizationSettleCollectAmount,
} from '@/api/accountService'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},

	data() {
		return {
			numberFormat: numberFormat,
			dialogVisible: false,
			selectedItem: {},
			showLoading: false,
			settlementAmount: 0, // 实际结算金额
			settledAmount: 0,
			refundAmount: 0, // 退款金额
			searchData: {
				version: 1.0,
				organizationId: '', // id
				settleStatus: '', // 状态
				revenueType: '', //类型
				orderSn: '', // 业务单号
				startOrderTime: moment().startOf('day').valueOf(), // 开始时间
				endOrderTime: moment().endOf('day').valueOf(), // 结束时间
			},
			orderStatus: [],
			searchCfg: [
				{
					title: '店主ID',
					type: 'input',
					dataIndex: 'organizationId',
					placeholder: '请输入店主ID',
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'settleStatus',
					placeholder: '全部',
					label: 'value',
					options: [
						{
							settleStatus: '',
							value: '全部',
						},
						{
							settleStatus: '3',
							value: '待结算',
						},
						{
							settleStatus: '5',
							value: '已结算',
						},
						{
							settleStatus: '2',
							value: '已关闭',
						},
					],
				},
				{
					title: '类型',
					type: 'select',
					dataIndex: 'revenueType',
					placeholder: '全部',
					label: 'value',
					options: [
						{
							revenueType: '',
							value: '全部',
						},
						{
							revenueType: '1',
							value: '卖货佣金',
						},
						{
							revenueType: '2',
							value: '好友奖励',
						},
					],
				},
				{
					title: '订单时间',
					type: 'datetimerange',
					dataIndex: ['startOrderTime', 'endOrderTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
					click: () => {
						this._listPageOrderSettleItem(true)
					},
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.searchData.organizationId && !this.searchData.orderSn) {
							let time = 24 * 60 * 60 * 1000 * 31
							if (
								!this.searchData.endOrderTime ||
								!this.searchData.startOrderTime
							) {
								return this.$message.warning('请选择时间')
							}
							if (
								this.searchData.endOrderTime - this.searchData.startOrderTime >
								time
							) {
								return this.$message.warning('时间不能超过31天')
							}
						}
						this._listPageOrderSettleItem(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'string',
					dataIndex: 'revenueType',
					title: '类型',
					customRender: (row) => {
						return row.revenueType == 1 ? '卖货佣金' : '好友奖励'
					},
				},
				{
					type: 'string',
					dataIndex: 'settleStatus',
					title: '状态',
					customRender: (row) => {
						let arr = ['', '待团队结算', '已关闭', '待结算', '结算中', '已结算']
						return arr[row.settleStatus]
					},
				},
				{
					type: 'data',
					dataIndex: 'settleTime',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'addAmount',
					title: '加价金额',
					customRender: (row) => {
						return numberFormat(row.addAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'settleAmount',
					title: '应结算金额',
					customRender: (row) => {
						return numberFormat(row.settleAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'refundAmount',
					title: '退款金额',
					customRender: (row) => {
						return numberFormat(row.refundAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'depositedAmount',
					title: '到账金额',
					customRender: (row) => {
						return numberFormat(row.depositedAmount, 2)
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listPageOrderSettleItem()
				},
			},
		}
	},

	created() {
		this._listPageOrderSettleItem(true)
		// this._organizationSettleCollectAmount()
	},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				JSON.parse(JSON.stringify(this.searchData)),
				{
					startIndex: 0,
					length: 1,
				}
			)

			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},

		_organizationSettleCollectAmount: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultCode,
					resultData: {
						settlementAmount = 0,
						settledAmount = 0,
						refundAmount = 0,
					},
				},
			} = await organizationSettleCollectAmount(paramJson)
			if (resultCode == 0) {
				this.settlementAmount = settlementAmount
				this.settledAmount = settledAmount
				this.refundAmount = refundAmount
			} else {
				this.settlementAmount = 0
				this.settledAmount = 0
				this.refundAmount = 0
			}
		},
		isNumber(s) {
			const regu = '^[0-9]+$'
			let re = new RegExp(regu)
			if (re.test(s)) {
				return true
			} else {
				return false
			}
		},
		_listPageOrderSettleItem: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			if (
				paramJson.organizationId &&
				!this.isNumber(paramJson.organizationId)
			) {
				return this.$message.warning('输入店主ID格式有误')
			}
			if (paramJson.organizationId.length > 10) {
				return this.$message.warning('店主ID长度不可大于10')
			}
			this._organizationSettleCollectAmount()
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { recordList = [], totalCount = 0 },
				},
			} = await listPageOrderSettleItem(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = recordList
				this.page.count = totalCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
		margin-right: 20px;
	}
}
</style>
