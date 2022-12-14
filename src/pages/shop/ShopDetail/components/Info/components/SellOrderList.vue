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
					title: ' ?????????',
					dataIndex: 'orderSn',
					placeholder: '??????????????????',
				},
				{
					title: '????????????',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
			],
			searchAction: [
				{
					title: '??????',
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
					title: '????????????',
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
					title: '??????',
				},
				{
					type: 'custom',
					dataIndex: 'receiveState',
					title: '????????????',
				},
				{
					type: 'custom',
					width: 110,
					dataIndex: 'orderId',
					title: '????????????',
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '??????',
					customRender: (row) => {
						return row.sourceType > 0 && row.sourceType < 14
							? this.$store.state.app.constant.SOURCE_TYPE[row.sourceType]
							: '-'
					},
				},
				{
					dataIndex: 'sourceName',
					title: '?????????',
					customRender: (row) => {
						return row.sourceName ? row.sourceName : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'handleTag',
					title: '????????????',
					customRender: (row) => {
						return row.handleTag == 1 || !row.handleTag
							? '?????????'
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
					title: '??????',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '????????????',
				},
				{
					dataIndex: 'weixinUserName',
					title: '?????????',
				},
				{
					dataIndex: 'consignee',
					title: '?????????',
				},
				{
					width: 60,
					dataIndex: 'expressFee',
					title: '??????',
				},
				{
					dataIndex: 'realAmount',
					title: '????????????',
					customRender: (row) => {
						return `???${retainDecimalPoint(row.realAmount, 2)}`
					},
				},
				{
					type: 'custom',
					width: 150,
					dataIndex: 'deliverState',
					title: '????????????',
				},
				{
					width: 95,
					type: 'custom',
					dataIndex: 'orderState',
					title: '????????????',
				},
				{
					type: 'string',
					dataIndex: 'refundState',
					title: '????????????',
					customRender: (row) => {
						return this.handleRefundState(row)
					},
				},
				{
					dataIndex: 'refundAmount',
					title: '????????????',
					customRender: (row) => {
						return row.refundAmount
							? `???${retainDecimalPoint(row.refundAmount, 2)}`
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
		// ???????????????????????????
		skip() {
			this.$emit('fatherMethods')
		},

		// ??????????????????
		handleAuditStatus(code) {
			let codeString
			if (code < 8 && code > 0) {
				codeString = '?????????'
			} else if (code == 8) {
				codeString = '????????????'
			} else if (code == 9) {
				codeString = '???????????????'
			} else {
				codeString = '??????'
			}
			return codeString
		},

		// ??????????????????
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
						stateString = '?????????,??????6'
					} else {
						stateString = '?????????,??????6'
					}
				} else if (refundAmount == row.realAmount) {
					stateString = '?????????'
				} else if (refundAmount > row.realAmount) {
					stateString = '?????????'
				} else {
					stateString = '??????'
				}
			} else {
				stateString = '???'
			}

			return stateString
		},

		// ????????????
		findSearchParams(flag) {
			// ????????????????????????
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

		// ????????????????????????????????????
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

		// ??????????????????
		handleOrderType(type) {
			return type >= 0 && type < 7
				? this.$store.state.app.constant.ORDER_TYPE[type]
				: '??????'
		},

		// ????????????????????????????????????
		handleOrderTypeTag(type) {
			return type >= 0 && type < 7
				? this.$store.state.app.constant.ORDER_TAG_TYPE[type]
				: 'info'
		},

		// ??????????????????
		handleOrderState(type) {
			let orderStateTitle

			if (type < 8 && type > 0) {
				orderStateTitle = '?????????'
			} else if (type == 8) {
				orderStateTitle = '????????????'
			} else if (type == 9) {
				orderStateTitle = '???????????????'
			} else {
				orderStateTitle = '??????'
			}

			return orderStateTitle
		},

		// ??????????????????
		handleOrderStateMap(row) {
			let orderStateDescription // ??????
			const auditPass = 8 //????????????
			const paidAll = 3 //?????????
			const paidOver = 4 //?????????
			const notDeliver = 1 //?????????
			const delivering = 2 //?????????
			const deliverAll = 3 //?????????
			const deliverConfirm = 4 //???????????????
			const paidReturn = 5 //??????

			if (row.orderState < auditPass) {
				if (row.receiveState == 1) {
					orderStateDescription = '?????????'
				} else if (
					row.receiveState == paidAll ||
					row.receiveState == paidOver
				) {
					orderStateDescription = '????????????'
				} else {
					orderStateDescription = '??????'
				}
			} else if (row.orderState == auditPass) {
				if (row.deliverState == notDeliver) {
					orderStateDescription = '????????????'
				} else if (row.deliverState == delivering) {
					orderStateDescription = '?????????'
				} else if (row.deliverState == deliverAll) {
					orderStateDescription = '????????????'
				} else if (row.deliverState == deliverConfirm) {
					orderStateDescription = '?????????'
				} else {
					orderStateDescription = '??????'
				}
			} else {
				if (row.receiveState == paidReturn) {
					orderStateDescription = '?????????'
				} else {
					orderStateDescription = '????????????'
				}
			}

			return orderStateDescription
		},

		// ??????
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
