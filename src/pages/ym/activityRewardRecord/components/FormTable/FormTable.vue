<template>
	<basic-container>
		<div v-auth="'listMarketingUserRewardRecordGoods'">
			<WgForm
				v-loading="exportLoading"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:actionInline="true"
				labelWidth="7em"
			></WgForm>
			<div class="sale-points">
				<span>总奖励销售分：{{ this.rewardTotalAmount }}</span>
				<span>退款销售分：{{ this.refundTotalAmount }}</span>
				<span>总活动奖励金：{{ this.rewardTotalCash }}</span>
				<span>退款活动奖励金：{{ this.refundTotalCash }}</span>
			</div>
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
	</basic-container>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
// import {
// 	getMerchantAccountWithdrawList,
// } from '@/api/yhtPlusCmsFinance'
import { activityRewardRecord } from '@/api/userRewardSystem'
import { checkFunctionCode } from '@/utils/auth'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		WgForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			listMarketingUserRewardRecordGoods: checkFunctionCode(
				'listMarketingUserRewardRecordGoods'
			),
			exportLoading: false,
			showLoading: false,
			refundTotalAmount: 0, //退款销售分
			rewardTotalAmount: 0, //总奖励销售分
			rewardTotalCash: 0, //总活动奖励金
			refundTotalCash: 0, //退款活动奖励金
			searchData: {
				organizationId: '', //店主ID
				orderSn: '', //订单号
				startOrderTime: moment().startOf('day').valueOf(), //开始时间
				endOrderTime: moment().endOf('day').valueOf(), //结束时间
				startAddTime: moment().startOf('day').valueOf(), //添加开始时间
				endAddTime: moment().endOf('day').valueOf(), //添加结束时间
				rewardRecordSn: '', //奖励记录单号
				rewardType: '', //奖励类型
				recordStatus: '', //状态
				activityType: '', //活动类型
			},
			searchCfg: [
				{
					title: '店主ID',
					type: 'input',
					dataIndex: 'organizationId',
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'orderSn',
				},
				{
					title: '订单时间',
					type: 'datetimerange',
					dataIndex: ['startOrderTime', 'endOrderTime'],
					placeholder: ['开始时间', '结束时间'],
					colSpan: 12,
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					placeholder: ['开始时间', '结束时间'],
					colSpan: 12,
				},
				{
					title: '活动类型',
					type: 'select',
					dataIndex: 'activityType',
					options: [
						{
							activityType: '',
							value: '全部',
						},
						{
							activityType: 1,
							value: '订单奖励活动',
						},
						{
							activityType: 2,
							value: '拼团活动',
						},
					],
					label: 'value',
				},
				{
					title: '奖励记录单号',
					type: 'input',
					dataIndex: 'rewardRecordSn',
				},
				{
					title: '奖励类型',
					type: 'select',
					dataIndex: 'rewardType',
					options: [
						{
							rewardType: '',
							value: '全部',
						},
						{
							rewardType: 1,
							value: '销售分',
						},
						{
							rewardType: 2,
							value: '活动奖励金',
						},
					],
					label: 'value',
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'recordStatus',
					options: [
						{
							recordStatus: '',
							value: '全部',
						},
						{
							recordStatus: 1,
							value: '待团队计算',
						},
						{
							recordStatus: 3,
							value: '发放中',
						},
						{
							recordStatus: 2,
							value: '待发放奖励',
						},
						{
							recordStatus: 4,
							value: '已发放奖励',
						},
						{
							recordStatus: 5,
							value: '已关闭',
						},
					],
					label: 'value',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._orgReconciliationList(true)
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
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'rewardRecordSn',
					title: '奖励记录单号',
				},
				{
					type: 'map',
					dataIndex: 'activityType',
					title: '活动类型',
					options: {
						订单奖励活动: 1,
						拼团活动: 2,
					},
				},
				{
					type: 'map',
					dataIndex: 'rewardType',
					title: '奖励类型',
					options: {
						销售分: 1,
						活动奖励金: 2,
					},
				},
				{
					type: 'data',
					dataIndex: 'orderTime',
					title: '下单时间',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'map',
					dataIndex: 'recordStatus',
					title: '状态',
					options: {
						待团队计算: 1,
						发放中: 3,
						待发放奖励: 2,
						已发放奖励: 4,
						已关闭: 5,
					},
				},
				{
					type: 'string',
					dataIndex: 'rewardTotalAmount',
					title: '订单奖励销售分/订单奖励金额',
				},
				{
					type: 'string',
					dataIndex: 'refundTotalAmount',
					title: '订单退款销售分/订单退款金额',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._orgReconciliationList()
				},
			},
			// gatewayEnable: false,
		}
	},
	created() {},

	mounted() {},

	methods: {
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
			paramJson.currentPage = this.page.currentPage
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_orgReconciliationList: async function (flag) {
			if (!this.listMarketingUserRewardRecordGoods) return
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			// paramJson.activityType = 1 //订单奖励活动
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await activityRewardRecord(paramJson)
			console.log(flag, 'flag')
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData?.pageDTO?.records || []
				this.page.count = resultData?.pageDTO?.total || 0
				this.rewardTotalAmount = resultData?.rewardTotalAmount || 0
				this.refundTotalAmount = resultData?.refundTotalAmount || 0
				this.rewardTotalCash = resultData?.rewardTotalCash || 0
				this.refundTotalCash = resultData?.refundTotalCash || 0
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.sale-points {
	margin-bottom: 10px;
}
.sale-points span {
	font-weight: bold;
	margin-right: 20px;
}
</style>
