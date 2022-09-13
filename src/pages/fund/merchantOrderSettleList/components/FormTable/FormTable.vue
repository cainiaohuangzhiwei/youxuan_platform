<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template #supplierName>
					<el-input
						v-model="searchData.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								searchData.supplierName = ''
								searchData.supplierId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<YxAccounts :items="statistics" />
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="orderSn" slot-scope="scope">
						<div>
							<p>{{ scope.row.orderSn }}</p>
							<el-button
								style="display: none"
								type="text"
								@click="_orderSettleManual(scope.row)"
								>手动结算</el-button
							>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<!-- 商家/商家列表 -->
		<supply-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				(row) => {
					searchData.supplierName = row.supplierName
					searchData.supplierId = row.supplierId
				}
			"
		/>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { merchantOrderSettleList, orderSettleManual } from '@/api/orderSettle'
import SupplyDialog from '@/components/SupplyDialog'
import YxAccounts from '@/components/Accounts/index'
import { getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		SupplyDialog,
		YxAccounts,
	},
	name: 'FormTable',
	data() {
		return {
			formsDialog: false,
			showLoading: false,
			dialogVisible: false, // 提现信息弹框开关
			searchData: {
				supplierName: '', // 商家id
				supplierId: '', // 商家id
				orderSn: '', //订单号
				settleStatus: '', //结算状态
				settleType: 0, // 结算类型
				addTimeStart: moment().startOf('day').valueOf(), //发起开始时间
				addTimeEnd: moment().endOf('day').valueOf(), //发起结束时间
				actualSettleTimeStart: '', //订单结算开始时间
				actualSettleTimeEnd: '', //订单结算结束时间
			},
			statistics: [
				{
					type: 'amount',
					title: '应结算金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '退款',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '实际结算',
					value: '0.00',
				},
			],
			searchCfg: [
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '订单编号',
					type: 'input',
					dataIndex: 'orderSn',
				},
				{
					title: '结算状态',
					type: 'select',
					dataIndex: 'settleStatus',
					label: 'value',
					options: this.$store.state.app.constant.SETTLE_STATUS_SUPPLIER,
				},
				{
					title: '结算单类型',
					type: 'select',
					dataIndex: 'settleType',
					label: 'value',
					options: this.$store.state.app.constant.SETTLE_STATUS_SETTLE_TYPE,
				},
				{
					title: '订单时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '结算时间',
					type: 'datetimerange',
					dataIndex: ['actualSettleTimeStart', 'actualSettleTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this._merchantOrderSettleList(true, e)
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
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单编号',
				},
				{
					type: 'string',
					dataIndex: 'merchantSettleRuleType',
					title: '规则类型',
					customRender: (row) => {
						let text
						if (row.merchantSettleRuleType === 1) {
							text = '规则一'
						} else if (row.merchantSettleRuleType === 2) {
							text = '规则二'
						} else {
							text = '-'
						}
						return text // 1 、规则一 2、规则二
					},
				},
				{
					type: 'string',
					dataIndex: 'settleStatus',
					title: '结算单类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SETTLE_STATUS_SETTLE_TYPE,
							row.settleType,
							'其他',
							'settleType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'settleStatus',
					title: '结算状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SETTLE_STATUS_SUPPLIER,
							row.settleStatus,
							'其他',
							'settleStatus'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'ruleSettleProportion',
					title: '结算比例',
					customRender: (row) => {
						return row.ruleSettleProportion
							? row.ruleSettleProportion + '%'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'ruleDays',
					title: '结算天数',
					customRender: (row) => {
						return row.ruleDays ? row.ruleDays + '天' : '-'
					},
				},
				{
					type: 'amount',
					dataIndex: 'settleAmount',
					title: '应结算金额',
				},
				{
					type: 'amount',
					dataIndex: 'refundAmount',
					title: '退款金额',
				},
				{
					type: 'amount',
					dataIndex: 'actualSettleAmount',
					title: '实际结算金额',
				},
				{
					type: 'amount',
					dataIndex: 'depositedAmount',
					title: '到账金额',
				},
				{
					type: 'date',
					dataIndex: 'nextSettleTime',
					title: '应结算时间',
				},
				{
					type: 'date',
					dataIndex: 'actualSettleTime',
					title: '实际结算时间',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._merchantOrderSettleList()
				},
			},
		}
	},

	methods: {
		// 手动结算
		async _orderSettleManual({ orderSettleId }) {
			let {
				data: { resultMsg, resultCode },
			} = await orderSettleManual({ orderSettleId })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
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
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_merchantOrderSettleList: async function (flag, e) {
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			if (
				(!paramJson.addTimeStart || !paramJson.addTimeEnd) &&
				!paramJson.orderSn
			) {
				this.$message.warning('无订单号时，必须选择订单时间进行搜索！')
				return
			}
			let time = 30 * 24 * 60 * 60 * 1000
			if (
				paramJson.addTimeEnd &&
				paramJson.addTimeStart &&
				time < paramJson.addTimeEnd - paramJson.addTimeStart
			) {
				this.$message.warning('时间区间不能大于30天！')
				return
			}

			if (
				paramJson.actualSettleTimeStart &&
				paramJson.actualSettleTimeEnd &&
				time < paramJson.actualSettleTimeEnd - paramJson.actualSettleTimeStart
			) {
				this.$message.warning('时间区间不能大于30天！')
				return
			}

			if (
				paramJson.actualSettleTimeStart &&
				paramJson.actualSettleTimeEnd &&
				paramJson.actualSettleTimeEnd < paramJson.actualSettleTimeStart
			) {
				this.$message.warning('结束时间不能小于开始时间！')
				return
			}

			if (
				paramJson.addTimeEnd &&
				paramJson.addTimeStart &&
				paramJson.addTimeEnd < paramJson.addTimeStart
			) {
				this.$message.warning('结束时间不能小于开始时间！')
				return
			}

			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: {
						count = 0,
						merchantOrderSettleVOS = [],
						actualSettleAmountSum = 0,
						refundAmountSum = 0,
						settleAmountSum = 0,
					},
				},
			} = await merchantOrderSettleList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = merchantOrderSettleVOS
				this.statistics[0].value = settleAmountSum
				this.statistics[1].value = refundAmountSum
				this.statistics[2].value = actualSettleAmountSum
				this.page.count = count
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>
