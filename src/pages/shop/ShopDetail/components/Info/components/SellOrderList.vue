<template>
	<div v-loading="loading" class="sell_order">
		<YxAccounts :items="statistics" />

		<yx-form
			ref="YxForm"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form>

		<yx-table :columns="tableColumns" :pagination="page" :data="tableData">
			<template slot="orderSn" slot-scope="scope">
				<div class="slot">
					<p class="skip">
						<router-link
							:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
					</p>
					<p>{{ scope.row.addTime | moment('YYYY-MM-DD HH:mm:ss') }}</p>
					<el-tag :type="handleOrderTypeTag(scope.row.orderType)">{{
						handleOrderType(scope.row.orderType)
					}}</el-tag>
				</div>
			</template>
			<template slot="receiveState" slot-scope="scope">
				<el-tag
					:type="
						$store.state.app.constant.RECEIVE_STATE_TAG[scope.row.receiveState]
					"
					>{{
						getConstantValueByKey(
							$store.state.app.constant.RECEIVE_STATE,
							scope.row.receiveState,
							'-',
							'state'
						)
					}}</el-tag
				>
			</template>
			<template slot="orderId" slot-scope="scope">
				<el-tag
					:type="
						$store.state.app.constant.ORDER_STATE_TAG[
							handleAuditStatus(scope.row.orderState)
						]
					"
					>{{ handleAuditStatus(scope.row.orderState) }}</el-tag
				>
			</template>
			<template slot="organizationName" slot-scope="scope">
				<p class="skip" @click="skip">
					{{ scope.row.organizationName }}
				</p>
			</template>
			<template slot="deliverState" slot-scope="scope">
				<el-tag
					:type="
						$store.state.app.constant.DELIVER_STATE_TAG[
							handleOrderState(scope.row.deliverState)
						]
					"
					>{{
						getConstantValueByKey(
							$store.state.app.constant.DELIVER_STATE,
							scope.row.deliverState,
							'-',
							'state'
						)
					}}</el-tag
				>
			</template>
			<template slot="orderState" slot-scope="scope">
				<el-tag
					:type="
						$store.state.app.constant.ORDER_STATE_TAG_MAP[
							handleOrderState(scope.row.orderState)
						]
					"
					>{{ handleOrderStateMap(scope.row) }}</el-tag
				>
			</template>
		</yx-table>
	</div>
</template>

<script>
import moment from 'moment'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import YxAccounts from '@/components/Accounts/index'
import { getOrderListByCondition } from '@/api/shopDetail'
import {
	wgGetDate,
	getConstantValueByKey,
	retainDecimalPoint,
} from '@/utils/helper/common'

export default {
	components: {
		YxForm,
		YxTable,
		YxAccounts,
	},

	props: {
		organizationId: {
			default: '',
		},
	},

	data() {
		return {
			searchData: {
				orderSn: '',
				addTimeStart: wgGetDate().getMonthStartDate,
				addTimeEnd: wgGetDate().getMonthEndDate,
			},
			searchCfg: [
				{
					title: ' 订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					title: '下单时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init()
					},
				},
			],
			loading: false,
			statistics: [
				{
					type: 'money',
					title: '订单总额',
					value: 0,
				},
			],
			tableData: [],
			getConstantValueByKey: getConstantValueByKey,
			retainDecimalPoint: retainDecimalPoint,
			tableColumns: [
				{
					width: 175,
					type: 'custom',
					dataIndex: 'orderSn',
					title: '单号',
				},
				{
					type: 'custom',
					dataIndex: 'receiveState',
					title: '收款状态',
				},
				{
					type: 'custom',
					width: 110,
					dataIndex: 'orderId',
					title: '审核状态',
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '渠道',
					customRender: (row) => {
						return row.sourceType > 0 && row.sourceType < 14
							? this.$store.state.app.constant.SOURCE_TYPE[row.sourceType]
							: '-'
					},
				},
				{
					dataIndex: 'sourceName',
					title: '下单号',
					customRender: (row) => {
						return row.sourceName ? row.sourceName : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'handleTag',
					title: '标记状态',
					customRender: (row) => {
						return row.handleTag == 1 || !row.handleTag
							? '待处理'
							: getConstantValueByKey(
									this.$store.state.app.constant.HANDLE_TAG,
									row.isHide,
									'-',
									'state'
							  )
					},
				},
				{
					dataIndex: 'brandName',
					title: '品牌',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					dataIndex: 'weixinUserName',
					title: '下单人',
				},
				{
					dataIndex: 'consignee',
					title: '收货人',
				},
				{
					width: 60,
					dataIndex: 'expressFee',
					title: '运费',
				},
				{
					dataIndex: 'realAmount',
					title: '订单金额',
					customRender: (row) => {
						return `￥${retainDecimalPoint(row.realAmount, 2)}`
					},
				},
				{
					type: 'custom',
					width: 150,
					dataIndex: 'deliverState',
					title: '发货状态',
				},
				{
					width: 95,
					type: 'custom',
					dataIndex: 'orderState',
					title: '订单状态',
				},
				{
					type: 'string',
					dataIndex: 'refundState',
					title: '退款状态',
					customRender: (row) => {
						return this.handleRefundState(row)
					},
				},
				{
					dataIndex: 'refundAmount',
					title: '退款金额',
					customRender: (row) => {
						return row.refundAmount
							? `￥${retainDecimalPoint(row.refundAmount, 2)}`
							: '-'
					},
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
		this.init(true)
	},

	methods: {
		// 跳转到余额流水页面
		skip() {
			this.$emit('fatherMethods')
		},

		// 处理审核状态
		handleAuditStatus(code) {
			let codeString
			if (code < 8 && code > 0) {
				codeString = '待审核'
			} else if (code == 8) {
				codeString = '审核通过'
			} else if (code == 9) {
				codeString = '审核不通过'
			} else {
				codeString = '其他'
			}
			return codeString
		},

		// 处理退款状态
		handleRefundState(row) {
			let stateString
			let refundInfoList = []

			if (row.refundInfo) {
				refundInfoList = row.refundInfo.split(',')
			}

			if (refundInfoList.length) {
				let refundAmount = 0

				for (let i = 0; i < refundInfoList.length; i++) {
					refundAmount += Number(refundInfoList[i].split('-')[1])
				}

				if (refundAmount < row.realAmount) {
					if (refundAmount > 6) {
						stateString = '有退款,大于6'
					} else {
						stateString = '有退款,小于6'
					}
				} else if (refundAmount == row.realAmount) {
					stateString = '退全款'
				} else if (refundAmount > row.realAmount) {
					stateString = '退超款'
				} else {
					stateString = '其他'
				}
			} else {
				stateString = '无'
			}

			return stateString
		},

		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			let paramJson = Object.assign({}, this.searchData)

			paramJson = Object.assign(paramJson, {
				length: this.page.length,
				addTimeStart: moment(paramJson.addTimeStart).valueOf() || '',
				addTimeEnd: moment(paramJson.addTimeEnd).valueOf() || '',
				childOrganizationId: this.organizationId || '',
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		// 获取直接邀请开通情况列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const res = await getOrderListByCondition(paramJson)

			if (res.data.resultData.orderList.length > 0) {
				const { orderList, statistics } = res.data.resultData
				this.tableData = orderList
				this.page.count = statistics.orderCount
				this.loading = false
				this.statistics[0].value = statistics.totalAllAmount || 0
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},

		// 处理订单类型
		handleOrderType(type) {
			return type >= 0 && type < 7
				? this.$store.state.app.constant.ORDER_TYPE[type]
				: '其他'
		},

		// 处理订单标签类型显示颜色
		handleOrderTypeTag(type) {
			return type >= 0 && type < 7
				? this.$store.state.app.constant.ORDER_TAG_TYPE[type]
				: 'info'
		},

		// 处理审核状态
		handleOrderState(type) {
			let orderStateTitle

			if (type < 8 && type > 0) {
				orderStateTitle = '待审核'
			} else if (type == 8) {
				orderStateTitle = '审核通过'
			} else if (type == 9) {
				orderStateTitle = '审核不通过'
			} else {
				orderStateTitle = '其他'
			}

			return orderStateTitle
		},

		// 订单订单状态
		handleOrderStateMap(row) {
			let orderStateDescription // 状态
			const auditPass = 8 //审核通过
			const paidAll = 3 //收完款
			const paidOver = 4 //收超款
			const notDeliver = 1 //待发货
			const delivering = 2 //已发货
			const deliverAll = 3 //发完货
			const deliverConfirm = 4 //已确认收货
			const paidReturn = 5 //退款

			if (row.orderState < auditPass) {
				if (row.receiveState == 1) {
					orderStateDescription = '待付款'
				} else if (
					row.receiveState == paidAll ||
					row.receiveState == paidOver
				) {
					orderStateDescription = '正在抢购'
				} else {
					orderStateDescription = '其他'
				}
			} else if (row.orderState == auditPass) {
				if (row.deliverState == notDeliver) {
					orderStateDescription = '等待分拣'
				} else if (row.deliverState == delivering) {
					orderStateDescription = '发货中'
				} else if (row.deliverState == deliverAll) {
					orderStateDescription = '等待签收'
				} else if (row.deliverState == deliverConfirm) {
					orderStateDescription = '已完成'
				} else {
					orderStateDescription = '其他'
				}
			} else {
				if (row.receiveState == paidReturn) {
					orderStateDescription = '已退款'
				} else {
					orderStateDescription = '抢购失败'
				}
			}

			return orderStateDescription
		},

		// 重置
		resetForm() {
			this.searchData = {
				payType: '0',
				status: '0',
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
