<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="type != 4 ? searchData : shopData"
				:items="searchCfg"
				:formAction="searchAction"
				><template slot="datetimerBtn">
					<el-button type="text" @click="setDatetimerange(7, 1)"
						>一周</el-button
					>
					<el-button type="text" @click="setDatetimerange(30, 1)"
						>一个月</el-button
					>
					<el-button type="text" @click="setDatetimerange(90, 1)"
						>三个月</el-button
					>
				</template>

				<template slot="sponsorBtn">
					<el-button type="text" @click="setDatetimerange(7, 4)"
						>一周</el-button
					>
					<el-button type="text" @click="setDatetimerange(30, 4)"
						>一个月</el-button
					>
					<el-button type="text" @click="setDatetimerange(90, 4)"
						>三个月</el-button
					>
				</template>
				<template slot="runninTime">
					<el-button type="text" @click="setDatetimerange(7, 2)"
						>一周</el-button
					>
					<el-button type="text" @click="setDatetimerange(30, 2)"
						>一个月</el-button
					>
					<el-button type="text" @click="setDatetimerange(90, 2)"
						>三个月</el-button
					>
				</template>

				<template slot="orderTime">
					<el-button type="text" @click="setDatetimerange(7, 3)"
						>一周</el-button
					>
					<el-button type="text" @click="setDatetimerange(30, 3)"
						>一个月</el-button
					>
				</template>
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
			<el-row v-if="titleDetails == '无'">
				<el-col :span="5">
					<div class="form-msg">
						实付金额:<span>￥{{ payAmountTotal }}</span>
					</div></el-col
				>
				<el-col :span="5">
					<div class="form-msg">
						商家剩余待结算金额:<span>￥{{ shopPriceTotal }}</span>
					</div></el-col
				>
				<el-col :span="5">
					<div class="form-msg">
						平台剩余待结算金额:<span>￥{{ platformAmountTotal }}</span>
					</div></el-col
				>
				<el-col :span="5">
					<div class="form-msg">
						店主联盟剩余待结算金额:<span>￥{{ alliancePriceTotal }}</span>
					</div></el-col
				>
			</el-row>
			<el-row v-else>
				<el-col :span="5">
					<div class="form-msg">
						累计{{ titleDetails }}笔数:<span
							>{{ type == 4 ? withdrawalCount : payAmountTotal }} 次</span
						>
					</div></el-col
				>
				<el-col :span="5">
					<div class="form-msg">
						累计{{ titleDetails }}金额:<span
							>￥{{ type == 4 ? withdrawalPrice : payPriceTotal }}</span
						>
					</div></el-col
				>
			</el-row>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="
						type == 2
							? tableColumns2
							: type == 3
							? tableColumns3
							: type == 4
							? tableColumns4
							: tableColumns5
					"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<el-dialog
			width="450px"
			title="详情信息"
			:visible.sync="detailsInformation"
			:close-on-click-modal="false"
			:before-close="closeDialog"
			:destroy-on-close="true"
		>
			<el-form
				:model="bankInfoForm"
				label-width="120px"
				label-position="left"
				v-if="bankInfoForm"
			>
				<el-form-item label="交易单号：">
					<span>{{ bankInfoForm.withdrawRecordSn }}</span>
				</el-form-item>
				<el-form-item label="账户名：">
					<span>{{ bankInfoForm.fundsAccountName }}</span>
				</el-form-item>
				<el-form-item label="手机号：">
					<span>{{ bankInfoForm.payeePhone }}</span>
				</el-form-item>
				<el-form-item label="账号：">
					<span>{{ bankInfoForm.fundsAccountSn }}</span>
				</el-form-item>
				<el-form-item label="开户银行：">
					<span>{{ bankInfoForm.bankName }}</span>
				</el-form-item>
				<el-form-item label="开户支行：">
					<span>{{ bankInfoForm.bankBranchName }}</span>
				</el-form-item>
				<el-form-item label="银行城市：">
					<span>{{ bankInfoForm.bankCity }}</span>
				</el-form-item>
			</el-form>
			<div class="tips" v-if="!bankInfoForm">暂无数据</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="closeDialog">确 定</el-button>
			</div>
		</el-dialog>
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
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import SupplyDialog from '@/components/SupplyDialog'
import { isNull } from '@/utils/helper/common'
import {
	refundRetails,
	orderSettlementDetails,
	orderPendingSettlementFlowAccount,
	sftShopSettlementFlowAccountDetail,
	sftShopSettlementFlowAccount,
} from '@/api/accountOverview'

import {
	numberFormat,
	getConstantValueByKey,
	setViewTitle,
} from '@/utils/helper/common'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		SupplyDialog,
	},
	name: 'FormTable',

	data() {
		return {
			formsDialog: false,
			selectGroupList: [],
			supplyRow: [],
			bankInfoForm: {},
			detailsInformation: false, //详情弹窗
			//退款流水明细&&订单结算明细字段
			payAmountTotal: 0, //累计退款笔数
			payPriceTotal: 0, //累计退款金额
			//订单待结算流水明细字段
			shopPriceTotal: 0, //商家剩余待结算金额
			platformAmountTotal: 0, //平台剩余待结算金额
			alliancePriceTotal: 0, //店主联盟待结算金额
			//店主提现流水明细
			withdrawalCount: 0, //累计提现次数
			withdrawalPrice: 0, //累计提现金额
			showLoading: false,
			type: '', //跳转类型
			titleDetails: '', //汇总类型名称
			searchData: {
				//退款流水明细 && 订单结算明细
				orderSn: '', //订单编号
				orderStartTime: moment().startOf('day').valueOf(), // 订单开始时间
				orderEndTime: moment().endOf('day').valueOf(), // 订单结束时间
				flowStartTime: moment().startOf('day').valueOf(), // 流水开始时间
				flowEndTime: moment().endOf('day').valueOf(), // 流水结束时间
				//订单待结算流水明细 (无流水时间)
				supplierId: '', //商家id
				supplierName: '',
			},
			shopData: {
				//店主提现流水明细
				withdrawRecordSn: '', //业务单号
				shopkeeperId: '', //店主id
				startTime: moment().startOf('day').valueOf(), //开始时间
				endTime: moment().endOf('day').valueOf(), //结束时间
				accountStartTime: moment().startOf('day').valueOf(), //到账结束时间
				accountEndTime: moment().endOf('day').valueOf(), //到账开始时间
				withdrawStatus: '', //提现状态 提现状态: 0创建 1提现中 2提现成功 3提现失败 4提现异常 10 全部
			},
			searchCfg: [
				{
					title: '到账时间',
					type: 'datetimerange',
					dataIndex: ['accountStartTime', 'accountEndTime'],
				},
				{
					type: 'custom',
					dataIndex: 'datetimerBtn',
				},
				{
					title: '发起时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					type: 'custom',
					dataIndex: 'sponsorBtn',
				},
				{
					title: '流水时间',
					type: 'datetimerange',
					dataIndex: ['flowStartTime', 'flowEndTime'],
				},
				{
					type: 'custom',
					dataIndex: 'runninTime',
				},
				{
					title: '订单时间',
					type: 'datetimerange',
					dataIndex: ['orderStartTime', 'orderEndTime'],
				},
				{
					type: 'custom',
					dataIndex: 'orderTime',
				},
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
				},
				{
					type: 'input',
					title: '业务单号',
					dataIndex: 'withdrawRecordSn',
				},
				{
					type: 'custom',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					type: 'inputNumber',
					title: '店主ID',
					dataIndex: 'shopkeeperId',
				},
				{
					type: 'select',
					title: '提现状态',
					dataIndex: 'withdrawStatus',
					label: 'value',
					options: this.$store.state.app.constant.withdrawDeposit,
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.init(true, e)
					},
				},
				{
					title: '重置',
					click: () => {
						this.resetForm()
					},
				},
			],
			tableData: [],
			//订单结算明细
			tableColumns2: [
				{
					type: 'string',
					dataIndex: 'fundsProfitSharingSettleItemId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'orderTime',
					title: '订单时间',
					customRender: (row) => {
						return row.orderTime
							? moment(row.orderTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'createTime',
					title: ' 流水时间',
					customRender: (row) => {
						return row.createTime
							? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'accountSn',
					title: '结算账户号',
				},
				{
					type: 'string',
					dataIndex: 'accountName',
					title: '账户名称',
				},
				{
					type: 'string',
					dataIndex: 'accountType',
					title: '账户类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.ORDER_SETTLEMENT_ACCOUNT_TYPE,
							row.accountType,
							'-',
							'accountType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'payChannel',
					title: '支付渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CHANNEL_DISBURSEMENT,
							row.payChannel,
							'-',
							'payChannel'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'orderAmount',
					title: '订单金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.orderAmount, 2)
					},
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '结算金额',
				},
			],
			//退款流水明细
			tableColumns3: [
				{
					type: 'string',
					dataIndex: 'fundsOrderSettleAccountRefundId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'orderTime',
					title: '订单时间',
					customRender: (row) => {
						return row.orderTime
							? moment(row.orderTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'createTime',
					title: ' 流水时间',
					customRender: (row) => {
						return row.createTime
							? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'payChannel',
					title: '支付渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CHANNEL_DISBURSEMENT,
							row.payChannel,
							'-',
							'payChannel'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'orderAmount',
					title: '订单金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.orderAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'refundPayAmount',
					title: '退款金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.refundPayAmount, 2)
					},
				},
			],
			//店主提现流水明细
			tableColumns4: [
				{
					type: 'string',
					dataIndex: 'fundsShopkeeperWithdrawRecordId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'applyTime',
					title: '发起时间 ',
					customRender: (row) => {
						return row.applyTime
							? moment(row.applyTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'finishTime',
					title: '到账时间',
					customRender: (row) => {
						return row.finishTime
							? moment(row.finishTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'fundsAccountName',
					title: '提现账户名称',
				},
				{
					type: 'string',
					dataIndex: 'fundsAccountSn',
					title: '账户ID',
				},
				{
					type: 'string',
					dataIndex: 'withdrawAmount',
					title: '提现金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.withdrawAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'commission',
					title: '手续费',
					customRender: (row) => {
						return '￥' + numberFormat(row.commission, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'withdrawChannel',
					title: '提现渠道',
					customRender: (row) => {
						return row.withdrawChannel == 1 ? '汇聚' : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'withdrawStatus',
					title: '提现状态',
					customRender: (row) => {
						return row.withdrawStatus == 0
							? '创建'
							: row.withdrawStatus == 1
							? '提现中'
							: row.withdrawStatus == 2
							? '提现成功'
							: row.withdrawStatus == 3
							? '提现失败'
							: row.withdrawStatus == 4
							? '提现异常'
							: row.withdrawStatus == 10
							? '全部'
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.viewDetails(row)
							},
						},
					],
				},
			],
			//订单待结算流水账户
			tableColumns5: [
				{
					type: 'string',
					dataIndex: 'orderId',
					title: '支付订单ID',
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'payChannel',
					title: '支付渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CHANNEL_DISBURSEMENT,
							row.payChannel,
							'-',
							'payChannel'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'payAmount',
					title: '实付金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.payAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'refundPayAmount',
					title: '退款金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.refundPayAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'orderAmount',
					title: '订单金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.orderAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'expressAmount',
					title: '运费金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.expressAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'expressInsuranceAmount',
					title: '运保卡金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.expressInsuranceAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'marketingAmount',
					title: '补差金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.marketingAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'merchantShouldSettleAmount',
					title: '商家应结算金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.merchantShouldSettleAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'platformShouldSettleAmount',
					title: '平台应结算金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.platformShouldSettleAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'allianceShouldSettleAmount',
					title: '店主联盟应结算金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.allianceShouldSettleAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'merchantUnsettleAmount',
					title: '商家剩余待结算金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.merchantUnsettleAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'platformUnsettleAmount',
					title: '平台剩余待结算金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.platformUnsettleAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'allianceUnsettleAmount',
					title: '店主联盟剩余待结算金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.allianceUnsettleAmount, 2)
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
		//订单支付流水明细:1  订单结算明细:2 退款流水明细:3 店主提现流水明细:4  订单待结算流水账户:5
		this.type =
			this.$route.name == 'WaterSubsidiaryRefund'
				? 3
				: this.$route.name == 'WaterSubsidiaryClose'
				? 2
				: this.$route.name == 'WaterSubsidiaryWithdraw'
				? 4
				: 5
		this.incidentType(this.type)
		// this.init()
	},

	methods: {
		incidentType(a) {
			//
			this.titleDetails =
				a == 2 ? '结算' : a == 3 ? '退款' : a == 4 ? '提现' : '无'
			this.$route.meta.title =
				a == 2
					? '订单结算明细'
					: a == 3
					? '退款流水明细'
					: a == 4
					? '店主提现流水明细'
					: '订单待结算流水账户'
			if (a == 2 || a == 3) {
				if (a == 2) {
					setViewTitle(this.$store, this.$route, null, '订单结算明细')
				} else {
					setViewTitle(this.$store, this.$route, null, '退款流水明细')
				}
				this.searchCfg[0].hide = true
				this.searchCfg[1].hide = true
				this.searchCfg[2].hide = true
				this.searchCfg[3].hide = true
				this.searchCfg[9].hide = true
				this.searchCfg[10].hide = true
				this.searchCfg[11].hide = true
				this.searchCfg[12].hide = true
			} else if (a == 4) {
				setViewTitle(this.$store, this.$route, null, '店主提现流水明细')
				this.searchCfg[4].hide = true
				this.searchCfg[5].hide = true
				this.searchCfg[6].hide = true
				this.searchCfg[7].hide = true
				this.searchCfg[8].hide = true
				this.searchCfg[10].hide = true
			} else {
				setViewTitle(this.$store, this.$route, null, '订单待结算流水账户')
				this.searchCfg[12].hide = true
				this.searchCfg[11].hide = true
				this.searchCfg[9].hide = true
				this.searchCfg[4].hide = true
				this.searchCfg[5].hide = true
				this.searchCfg[0].hide = true
				this.searchCfg[1].hide = true
				this.searchCfg[2].hide = true
				this.searchCfg[3].hide = true
			}
		},
		// 重置
		resetForm() {
			this.searchData = {
				orderSn: '', //订单编号
				orderStartTime: moment().startOf('day').valueOf(), // 订单开始时间
				orderEndTime: moment().endOf('day').valueOf(), // 订单结束时间
				flowStartTime: moment().startOf('day').valueOf(), // 流水开始时间
				flowEndTime: moment().endOf('day').valueOf(), // 流水结束时间
				//订单待结算流水明细 (无流水时间)
				supplierId: '', //商家id
				businessSn: '', //业务单号
				waterType: null, //备注
			}
			this.shopData = {
				//店主提现流水明细
				withdrawRecordSn: '', //业务单号
				shopkeeperId: '', //店主id
				startTime: moment().startOf('day').valueOf(), //开始时间
				endTime: moment().endOf('day').valueOf(), //结束时间
				accountStartTime: moment().startOf('day').valueOf(), //到账结束时间
				accountEndTime: moment().endOf('day').valueOf(), //到账开始时间
				withdrawStatus: '', //提现状态 提现状态: 0创建 1提现中 2提现成功 3提现失败 4 全部
			}
		},
		setDatetimerange(data, a) {
			// 设置添加时间段
			if (a == 1) {
				let start =
					moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
				this.shopData.accountStartTime = start
				this.shopData.accountEndTime = moment().endOf('day').valueOf()
			} else if (a == 2) {
				let flowStart =
					moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
				this.searchData.flowStartTime = flowStart
				this.searchData.flowEndTime = moment().endOf('day').valueOf()
			} else if (a == 3) {
				let orderStart =
					moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
				this.searchData.orderStartTime = orderStart
				this.searchData.orderEndTime = moment().endOf('day').valueOf()
			} else {
				let shopTime =
					moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
				this.shopData.startTime = shopTime
				this.shopData.endTime = moment().endOf('day').valueOf()
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				this.type != 4 ? this.searchData : this.shopData
			)
			// 	searchData: {
			// 	//退款流水明细 && 订单结算明细
			// 	orderSn: '', //订单编号
			// 	orderStartTime: moment().startOf('day').valueOf(), // 订单开始时间
			// 	orderEndTime: moment().endOf('day').valueOf(), // 订单结束时间
			// 	flowStartTime: moment().startOf('day').valueOf(), // 流水开始时间
			// 	flowEndTime: moment().endOf('day').valueOf(), // 流水结束时间
			// 	//订单待结算流水明细 (无流水时间)
			// 	supplierId: '', //商家id
			// 	supplierName: '',
			// },
			// shopData: {
			// 	//店主提现流水明细
			// 	withdrawRecordSn: '', //业务单号
			// 	shopkeeperId: '', //店主id
			// 	startTime: moment().startOf('day').valueOf(), //开始时间
			// 	endTime: moment().endOf('day').valueOf(), //结束时间
			// 	accountStartTime: moment().startOf('day').valueOf(), //到账结束时间
			// 	accountEndTime: moment().endOf('day').valueOf(), //到账开始时间
			// 	withdrawStatus: '', //提现状态 提现状态: 0创建 1提现中 2提现成功 3提现失败 4提现异常 10 全部
			// },
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.curPage = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},

		init: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			if (this.type == 3 || this.type == 2) {
				if (
					isNull(paramJson.orderSn) &&
					isNull(paramJson.orderStartTime) &&
					isNull(paramJson.orderEndTime) &&
					isNull(paramJson.flowStartTime) &&
					isNull(paramJson.flowEndTime)
				) {
					this.$message.warning({
						message: '筛选条件不可都为空',
					})
					return false
				}
			} else if (this.type == 4) {
				if (
					isNull(paramJson.withdrawRecordSn) &&
					isNull(paramJson.shopkeeperId) &&
					isNull(paramJson.startTime) &&
					isNull(paramJson.endTime) &&
					isNull(paramJson.accountStartTime) &&
					isNull(paramJson.accountEndTime)
				) {
					this.$message.warning({
						message: '筛选条件不可都为空',
					})
					return false
				}
			} else if (this.type == 5) {
				if (
					isNull(paramJson.orderSn) &&
					isNull(paramJson.orderStartTime) &&
					isNull(paramJson.orderEndTime)
				) {
					this.$message.warning({
						message: '请选择订单时间或者输入订单编号筛选',
					})
					return false
				}
			}
			this.showLoading = true
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			// this.type订单支付流水明细:1  订单结算明细:2 退款流水明细:3 店主提现流水明细:4  订单待结算流水账户:5
			let Url
			if (this.type == 2) {
				Url = orderSettlementDetails
			} else if (this.type == 3) {
				Url = refundRetails
			} else if (this.type == 4) {
				Url = sftShopSettlementFlowAccount
			} else {
				Url = orderPendingSettlementFlowAccount
			}
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.list || []
				//订单支付流水明细:1  订单结算明细:2 退款流水明细:3 店主提现流水明细:4  订单待结算流水账户:5
				if (this.type == 2 || this.type == 3) {
					this.payAmountTotal = resultData.payAmountTotal || 0 //累计退款笔数
					this.payPriceTotal = numberFormat(resultData.payPriceTotal || 0, 2) //累计退款金额
				} else if (this.type == 4) {
					this.withdrawalPrice = numberFormat(
						resultData.withdrawalPrice || 0,
						2
					) //累计提现金额
					this.withdrawalCount = resultData.withdrawalCount || 0 //累计提现次数
				} else {
					this.payAmountTotal = numberFormat(resultData.payAmountTotal || 0, 2)
					this.shopPriceTotal = numberFormat(resultData.shopPriceTotal || 0, 2) //商家剩余待结算金额
					this.platformAmountTotal = numberFormat(
						resultData.platformAmountTotal || 0,
						2
					) //平台剩余待结算金额
					this.alliancePriceTotal = numberFormat(
						resultData.alliancePriceTotal || 0,
						2
					) //店主联盟待结算金额
				}
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		// 关闭dialog
		closeDialog() {
			this.detailsInformation = false
		},
		viewDetails: async function (row) {
			this.detailsInformation = true
			let {
				data: { resultCode, resultData },
			} = await sftShopSettlementFlowAccountDetail({
				fundsShopkeeperWithdrawRecordId: row.fundsShopkeeperWithdrawRecordId,
			})
			if (resultCode == 0) {
				this.bankInfoForm = resultData
			}
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		handleAdd() {
			this.supplyRow = JSON.parse(JSON.stringify(this.selectGroupList))
			this.formsDialog = true
		},
	},
}
</script>
<style lang="scss" scope>
.form-msg {
	font-size: 14px;
	color: #606266;
	margin-bottom: 14px;
	span {
		color: brown;
	}
}
.el-col .el-form-item--small.el-form-item {
	margin-bottom: 0;
}
</style>
