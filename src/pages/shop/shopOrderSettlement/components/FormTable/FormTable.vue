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
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
// import { wgGetDate } from '@/utils/helper/common'
import { listPageOrderSettle } from '@/api/accountService'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'shopOrderSettlement',

	data() {
		return {
			showLoading: false,
			searchData: {
				version: 1.0,
				organizationId: null, //店主ID
				orderSn: '', //订单号
				settleStatus: '', //状态
				startOrderTime: moment().startOf('day').valueOf(), //开始时间
				endOrderTime: moment().endOf('day').valueOf(), //结束时间
			},
			statusList: [],
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
							settleStatus: '1',
							value: '待团队结算',
						},
						{
							settleStatus: '4',
							value: '计算中',
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
				},
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.callInviteCodeListByCondition(true, e)
					},
				},
				{
					title: '查看销售权益结算明细列表',
					auth: 'listPageOrganizationOrderSettleItem',
					type: 'primary',
					click: () => {
						this.$router.push(`/shop/shopkeeperAccount`)
					},
				},
				{
					title: '查看平台奖励结算明细列表',
					auth: 'listOrderManagerSettleItem',
					type: 'primary',
					click: () => {
						this.$router.push(`/shop/shopPlatformRewardList`)
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
					type: 'data',
					dataIndex: 'orderTime',
					title: '下单时间',
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
					type: 'string',
					dataIndex: 'settleSaleScore',
					title: '订单销售分',
				},
				{
					type: 'string',
					dataIndex: 'refundSaleScore',
					title: '退款销售分',
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
	created() {
		this.callInviteCodeListByCondition(true)
	},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				type: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			paramJson.startOrderTime =
				moment(paramJson.startOrderTime).valueOf() || ''
			paramJson.endOrderTime = moment(paramJson.endOrderTime).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
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
		callInviteCodeListByCondition: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			if (
				paramJson.organizationId &&
				!this.isNumber(paramJson.organizationId)
			) {
				return this.$message.warning('输入店主ID格式有误')
			}
			if (paramJson.organizationId && paramJson.organizationId.length > 10) {
				return this.$message.warning('店主ID长度不可大于10')
			}
			if (this.searchData.startOrderTime > this.searchData.endOrderTime) {
				return this.$message.warning('开始时间不可大于结束时间')
			}
			let AprTime = new Date('2022-04-01 00:00:00').getTime()
			if (
				this.searchData.startOrderTime < AprTime &&
				this.searchData.endOrderTime > AprTime
			) {
				return this.$message.warning(
					'不允许开始时间在4月以前，结束时间在4月以后'
				)
			}
			if (this.searchData.startOrderTime >= AprTime) {
				this.tableColumns.forEach((item) => {
					if (item.dataIndex == 'settleSaleScore') {
						item.title = '基础佣金'
					} else if (item.dataIndex == 'refundSaleScore') {
						item.title = '退款基础佣金'
					}
				})
				this.tableColumns[4].title = '基础佣金'
				this.tableColumns[5].title = '退款基础佣金'
			} else {
				this.tableColumns.forEach((item) => {
					if (item.dataIndex == 'settleSaleScore') {
						item.title = '订单销售分'
					} else if (item.dataIndex == 'refundSaleScore') {
						item.title = '退款销售分'
					}
				})
			}
			if (!paramJson.organizationId && !paramJson.orderSn) {
				let time = 24 * 60 * 60 * 1000 * 31
				if (!this.searchData.endOrderTime || !this.searchData.startOrderTime) {
					return this.$message.warning('请选择时间')
				}
				if (
					this.searchData.endOrderTime - this.searchData.startOrderTime >
					time
				) {
					return this.$message.warning('时间不能超过31天')
				}
			}
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listPageOrderSettle(paramJson, custom)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData = resultData.recordList
				this.page.count = resultData.totalCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
