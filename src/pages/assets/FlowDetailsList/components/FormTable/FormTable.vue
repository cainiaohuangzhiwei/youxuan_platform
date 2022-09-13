<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<YxAccounts :items.sync="flowDetail" />
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<!-- 订单号 -->
					<template slot="orderSn" slot-scope="scope">
						<router-link
							v-if="getOrderDetailByOrderId"
							:to="`/business/orderDetails/${scope.row.orderId}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
						<span v-else>{{ scope.row.orderSn }}</span>
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getFlowDetailListByCondition } from '@/api/yhtPlusCmsFinance'
import { getConstantValueByKey, numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
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
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			showLoading: false,
			searchData: {
				orderSn: '', // 订单号
				flowType: 0, //流水类型
				orientation: 0, //进出账类型
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
			},
			searchCfg: [
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					enter: () => {
						this.callFlowDetailList(true)
					},
				},
				{
					title: '流水类型',
					type: 'select',
					dataIndex: 'flowType',
					label: 'value',
					options: this.$store.state.app.constant.FLOWORDER_TYPE,
				},
				{
					title: '进出账类型',
					type: 'select',
					dataIndex: 'orientation',
					label: 'value',
					options: this.$store.state.app.constant.FLOWORDER_ORIEMTATOIN,
				},
				{
					title: '流水时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callFlowDetailList(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					dataIndex: 'groupId',
					title: '集团',
					type: 'string',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.FLOWORDER_GROUP,
							row.groupId,
							'其他',
							'groupId'
						)
					},
				},
				{
					dataIndex: 'itemType',
					title: '业务类型',
					type: 'center',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.FLOWORDER_BUSINESS_TYPE,
							row.itemType,
							'其他',
							'itemType'
						)
					},
				},
				{
					dataIndex: 'organizationName',
					title: '商户',
					type: 'string',
				},
				{
					dataIndex: 'flowType',
					title: '流水类型(出入账)',
					type: 'string',
					customRender: (row) => {
						return (
							getConstantValueByKey(
								this.$store.state.app.constant.FLOWORDER_TYPE,
								row.flowType,
								'其他',
								'flowType'
							) +
							'(' +
							getConstantValueByKey(
								this.$store.state.app.constant.FLOWORDER_ORIEMTATOIN,
								row.orientation,
								'-',
								'orientation'
							) +
							')'
						)
					},
				},
				{
					dataIndex: 'amount',
					title: '流水金额',
					type: 'string',
					customRender: function (row) {
						return (
							(row.orientation == 1 ? '+' : '-') + numberFormat(row.amount, 2)
						)
					},
				},
				{
					dataIndex: 'usableAmount',
					title: '账户可用余额',
					type: 'amount',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callFlowDetailList()
				},
			},
		}
	},

	created() {
		// this.callFlowDetailList(true)
	},

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
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		callFlowDetailList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getFlowDetailListByCondition(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.flowDetailList || []
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
