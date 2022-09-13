<template>
	<div>
		<!-- 订单列表表单 S -->
		<WgForm
			:inline="true"
			labelWidth="68px"
			:data="formData109"
			:items="formCfg109"
		>
			<template #supplierAccountNumberId>
				<el-select
					v-model="formData109.supplierAccountNumberId"
					filterable
					remote
					clearable
					placeholder="请输入商家名称"
					value-key="supplierAccountNumberId"
					:remote-method="_findSupplierAccountNumberForList"
				>
					<el-option
						v-for="item in formDataSupplierAccountNumberList"
						:key="item.supplierAccountNumberId"
						:label="item.supplierName"
						:value="item.supplierAccountNumberId"
					>
					</el-option>
				</el-select>
			</template>
		</WgForm>
		<WgForm
			:inline="false"
			:items="formTags"
			:formAction="formAction109"
			:actionInline="true"
		>
			<template slot="tagsList">
				<el-collapse>
					<el-collapse-item title="渠道" name="1">
						<el-row :gutter="10" class="tags-row">
							<el-checkbox-group v-model="formData109.channelList">
								<el-col
									:span="4"
									v-for="(item, index) in $store.state.app.constant
										.SHOP_CHANNEL_LIST"
									:key="index"
								>
									<el-checkbox :label="item.channelList"></el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-row>
					</el-collapse-item>
					<el-collapse-item title="订单标签" name="2">
						<el-row :gutter="10" class="tags-row">
							<el-checkbox-group v-model="formData109.tagIdList">
								<el-col
									:span="4"
									v-for="(item, index) in orderTagList"
									:key="index"
								>
									<el-checkbox :label="item.tagIdList">{{
										item.value
									}}</el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-row>
					</el-collapse-item>
					<el-collapse-item title="活动类型" name="3">
						<el-row :gutter="10" class="tags-row">
							<el-checkbox-group v-model="formData109.actType">
								<el-col
									:span="4"
									v-for="(item, index) in actTypeList"
									:key="index"
								>
									<el-checkbox :label="item.actType">{{
										item.value
									}}</el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-row>
					</el-collapse-item>
					<el-collapse-item v-if="!orderSearchToB" title="订单类型" name="4">
						<el-row :gutter="10" class="tags-row">
							<el-checkbox-group v-model="formData109.orderTypeList">
								<el-col
									:span="4"
									v-for="(item, index) in orderTypeList"
									:key="index"
								>
									<el-checkbox :label="item.orderType">{{
										item.value
									}}</el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-row>
					</el-collapse-item>
				</el-collapse>
			</template>
		</WgForm>
		<!-- 订单列表表单 E -->
		<!-- 订单列表数据展示 S -->
		<yx-accounts :items="accountItems112"></yx-accounts>
		<!-- 订单列表数据展示 E -->
		<!-- 表格表头设置 -->
		<table-header-set
			:tableTitle="$route.meta.title"
			:tableStorageKey="$route.name + 'Columns_'"
			:tableColumns.sync="tableColumns110"
		></table-header-set>
		<!-- 订单列表表格 S -->
		<yx-table
			:select="true"
			v-loading="loading"
			:selectionChange="selectionChange"
			:columns="tableColumns110"
			:pagination="page110"
			:data="tableData110"
			class="order-table"
		>
			<template slot="orderSn" slot-scope="scope">
				<el-button type="text">
					<router-link
						:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
						>{{ scope.row.orderSn }}</router-link
					>
				</el-button>
				<div>
					{{ moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss') }}
				</div>
				<span
					class="orderLabel"
					:class="{ 'bg-yellow': scope.row.orderType == 4 }"
				>
					{{ $store.state.app.constant.ORDER_TYPE[scope.row.orderType] }}
				</span>
				<span
					class="orderLabel"
					style="background-color: #ffc94b"
					v-for="(item, index) in scope.row.tagNameList"
					:key="index"
				>
					{{ item }}
				</span>
			</template>
			<template slot="receiveState" slot-scope="scope">
				<span
					:class="'stateColor ' + receiveStateArr[scope.row.receiveState].color"
				></span>
				<span>
					{{ receiveStateArr[scope.row.receiveState].value }}
				</span>
			</template>
			<template slot="brandName" slot-scope="scope">
				<div class="brandNameClass" :class="{ brandRed: brandBg(scope.row) }">
					{{ scope.row.brandName }}
				</div>
			</template>

			<template slot="orderState" slot-scope="scope">
				<span
					:class="
						'stateColor ' +
						orderStateArr.find(
							(item) => item.orderState == scope.row.orderState
						).color
					"
				></span>
				<span>
					{{
						orderStateArr.find(
							(item) => item.orderState == scope.row.orderState
						).value
					}}
				</span>
			</template>
			<template slot="deliverState" slot-scope="scope">
				<span
					:class="'stateColor ' + deliverStateArr[scope.row.deliverState].color"
				></span>
				<span>
					{{ deliverStateChange(scope.row) }}
				</span>
			</template>
			<template slot="orderStateList" slot-scope="scope">
				<span :class="'stateColor ' + scope.row.orderStateListArr.color"></span>
				<span>
					{{ scope.row.orderStateListArr.orderStateDescription }}
				</span>
			</template>
			<template slot="refundState" slot-scope="scope">
				<span :class="'stateColor ' + scope.row.refundStateArr.color"></span>
				<span>
					{{ scope.row.refundStateArr.stateString }}
				</span>
			</template>
			<template slot="organizationName" slot-scope="scope">
				<router-link
					style="color: #4498e0"
					:to="'/shop/shop/shopDetail/' + scope.row.childOrganizationId"
					>{{ scope.row.organizationName }}</router-link
				>
			</template>
		</yx-table>
		<!-- 订单列表表格 E -->
		<!-- 订单快速打标签弹窗 S -->
		<Dialog
			:title="dialogTitle111"
			:visible="dialogVisible111"
			:width="dialogWidth111"
			:bottomBtn="dialogBottomBtn111"
			@before-close="
				() => {
					dialogVisible111 = false
				}
			"
		>
			<div class="addTag-title">
				设置订单标签内容步骤：设置—>系统设置—>订单—>默认订单标签
			</div>
			<el-checkbox-group v-model="addTagList">
				<el-checkbox
					v-for="(item, index) in orderTagList"
					:key="index"
					:label="item.tagIdList"
					>{{ item.value }}</el-checkbox
				>
			</el-checkbox-group>
		</Dialog>
		<!-- 订单快速打标签弹窗 E -->
		<!-- 导出订单列表弹窗 S -->
		<Dialog
			:title="dialogTitle114"
			:visible="dialogVisible114"
			:width="dialogWidth114"
			:bottomBtn="dialogBottomBtn114"
			@open="handleCheckAllChange(true)"
			@before-close="
				() => {
					dialogVisible114 = false
					formData115Loading = false
					formData115 = {
						outputHeader: [],
					}
				}
			"
		>
			<div v-loading="formData115Loading">
				字段选择：<br />
				<el-checkbox
					v-model="formData115CheckAll"
					@change="handleCheckAllChange"
					>全选</el-checkbox
				>
				<yx-form :inline="true" :data="formData115" :items="formCfg115">
				</yx-form>
			</div>
		</Dialog>
		<!-- 导出订单列表弹窗 E -->
		<!-- 订单汇聚补款弹窗 S -->
		<Dialog
			title="订单补款"
			:visible="joinpayReturnMoneyDialogVisible"
			width="600px"
			:bottomBtn="joinpayReturnMoneyDialogBottomBtn"
			@before-close="
				() => {
					joinpayReturnMoneyDialogVisible = false
					joinpayReturnMoneyFormData = {
						orderSn: '',
						supplementType: '1',
						compensationTarget: '',
						refundWay: '1',
						remarkType: '6',
						compensationAmount: '',
						refundDesc: '1',
						remark: '',
						transferUserName: '',
						transferBankAccount: '',
					}
				}
			"
		>
			<yx-form
				label-width="130px"
				:inline="false"
				label-position="right"
				:data="joinpayReturnMoneyFormData"
				:items="joinpayReturnMoneyFormCfg"
			>
			</yx-form>
		</Dialog>
		<!-- 订单汇聚补款弹窗 E -->
		<!-- 订单补偿弹窗 S -->
		<Dialog
			title="订单补偿"
			:visible="compensateDialogVisible"
			width="600px"
			@before-close="
				() => {
					compensateDialogVisible = false
					compensateFormData = {
						orderSn: '',
						couponName: '',
						quantity: null,
						scope: [],
						remark: '',
					}
				}
			"
		>
			<yx-form
				label-width="130px"
				:inline="false"
				label-position="right"
				:data="compensateFormData"
				:items="compensateFormCfg"
				:rules="compensateRules"
				:formAction="compensateDialogBottomBtn"
			>
				<template #couponName>
					<el-input
						v-model="compensateFormData.couponName"
						placeholder="选择优惠券"
						value-key="couponName"
						label="couponName"
						@focus="selectCoupon"
						clearable
						@clear="
							() => {
								compensateFormData.yxCouponId = ''
								compensateFormData.quantity = '0'
								selectedList = []
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="dialogCouponVisible = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
		</Dialog>
		<!-- 订单补偿弹窗 E -->
		<!-- 审核不通过订单弹窗 S -->
		<Dialog
			title="审核订单"
			:visible="initAuditModalVisible"
			width="30%"
			:bottomBtn="initAuditModalBottomBtn"
			@before-close="
				() => {
					initAuditModalVisible = false
					initAuditModalData = {
						orderSn: '',
						remark: '',
					}
				}
			"
		>
			<yx-form
				:inline="false"
				:data="initAuditModalData"
				:items="initAuditModalCfg"
				label-position="right"
				label-width="100px"
			>
			</yx-form>
		</Dialog>
		<!-- 审核不通过订单弹窗 E -->
		<!-- 审核通过订单弹窗 S -->
		<Dialog
			title="审核订单"
			:visible="initAuditModalSuccessVisible"
			width="800px"
			:bottomBtn="initAuditModalSuccessBottomBtn"
			@before-close="
				() => {
					initAuditModalSuccessVisible = false
					initAuditModalSuccessData = {
						orderSn: '',
						sourceName: '',
						platformOrderSn: '',
						settlementAmount: '',
						platformExpressFee: '',
						remark: '',
					}
				}
			"
		>
			<yx-form
				:inline="false"
				:data="initAuditModalSuccessData"
				:items="initAuditModalSuccessCfg"
				label-position="right"
				label-width="100px"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="initAuditModalSuccessLoading"
				:columns="initAuditModalSuccessColumns"
				:data="initAuditModalSuccessTableData"
			>
				<template slot="goodsName" slot-scope="scope">
					<div>货号：{{ scope.row.goodsNumber }}</div>
					<div>{{ scope.row.goodsName }}</div>
				</template>
				<template slot="stockOutQuantity" slot-scope="scope">
					<div>
						{{
							scope.row.quantity +
							'/' +
							scope.row.refundQuantity +
							'/' +
							(scope.row.returnQuantity || 0)
						}}
					</div>
				</template>
				<template slot="platformPrice" slot-scope="scope">
					<el-input v-model="scope.row.platformPrice" type="number"></el-input>
				</template>
			</yx-table>
		</Dialog>
		<!-- 审核通过订单弹窗 E -->
		<!-- 选择优惠券弹窗 S -->
		<selected-coupon-dialog
			:dialogVisible.sync="dialogCouponVisible"
			:selectedList.sync="selectedList"
		></selected-coupon-dialog>
		<!-- 选择优惠券弹窗 E -->
		<!-- 退款共用弹窗 S -->
		<refund-dialog
			:dialogVisible.sync="refundDialogVisible"
			:activeRow="activeRow"
			@fatherMethodInit="
				() => {
					getData110()
				}
			"
		></refund-dialog>
		<!-- 退款共用弹窗 E -->
		<return-money-dialog
			:dialogVisible.sync="refundMoneyDialogVisible"
			:activeRow="activeRow"
			@fatherMethodInit="
				() => {
					getData110()
				}
			"
		></return-money-dialog>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import WgForm from '@/components/WgForm'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import selectedCouponDialog from './selectedCouponDialog'
import TableHeaderSet from '@/components/TableHeaderSet'
// 退款公共组件
import RefundDialog from '../../../components/RefundDialog'
// 补款公共组件
import ReturnMoneyDialog from '../../../components/ReturnMoneyDialog'

import moment from 'moment'
import { checkFunctionCode } from '@/utils/auth'
import { isNull, limitFormChooseTimes } from '@/utils/helper/common'
import {
	getOrderListByCondition,
	addOrderTagByOrderIdList,
	getOrderConfiguration,
	logisticQuery,
	batchUpdateOrderDeliverSign,
	tagOrder,
} from '@/api/business'
import { wgGetDate, downloadFile } from '@/utils/helper/common'
import { getOrderDetailByOrderId, auditOrder } from '@/api/yhtPlusCmsOrder'
import { exportOrderListByCondition } from '@/api/yhtPlusCmsOrder.js'
import { addCouponCompensation } from '@/api/yhtPlusCoupon'
import { findSupplierAccountNumberForList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import {
	queryNotSelfBrandSupplierAccountIds,
	existUnFinishAfterSales,
} from '@/api/brandRecord'
export default {
	components: {
		YxForm,
		WgForm,
		YxAccounts,
		YxTable,
		Dialog,
		selectedCouponDialog,
		RefundDialog,
		ReturnMoneyDialog,
		TableHeaderSet,
	},
	props: [],
	data() {
		return {
			orderSearchToB: checkFunctionCode('orderSearchToB'),
			moment,
			loading: false,
			addTagList: [],
			user: {},
			totalRefundQuantity: 0,
			totalRefundAmount: 0,
			brandIds: [],
			orderIdList: [],
			supplierAccountNumberIdList: [],
			notSeIfBrandMap: {},
			receiveStateArr: [
				{
					receiveState: '0',
					value: '-',
					color: 'stateColor-gray',
				},
				{
					receiveState: 1,
					value: '待付款',
					color: 'stateColor-red',
				},
				{
					receiveState: 2,
					value: '付款中',
					color: 'stateColor-yellow',
				},
				{
					receiveState: 3,
					value: '已付款',
					color: 'stateColor-green',
				},
			],
			orderStateArr: [
				{
					orderState: '-1',
					value: '全部（非作废）',
					color: 'stateColor-gray',
				},
				{
					orderState: '1',
					value: '待审核',
					color: 'stateColor-red',
				},
				{
					orderState: '8',
					value: '审核通过',
					color: 'stateColor-green',
				},
				{
					orderState: '9',
					value: '审核不通过',
					color: 'stateColor-red',
				},
			],
			deliverStateArr: [
				{
					value: '-',
					color: '',
				},
				{
					value: '待发货(未拣货)',
					color: 'stateColor-red',
				},
				{
					value: '待发货(拣货中)',
					color: 'stateColor-red',
				},
				{
					value: '已发货(部分商品发货)',
					color: 'stateColor-yellow',
				},
				{
					value: '已发货(全部商品发货)',
					color: 'stateColor-green',
				},
				{
					value: '已确认收货',
					color: 'stateColor-gray',
				},
			],
			// 搜索商家数据源
			formDataSupplierAccountNumberList: [],
			// 订单列表表单
			formData109: {
				consignee: '',
				orderSn: '',
				brandName: '',
				phone: '',
				keyword: '',
				orderState: '-1',
				deliverStateAndSign: '0',
				receiveState: '0',
				refundState: '0',
				supplierAccountNumberId: '',
				orderTypeList: ['1', '3'],
				orderTimeList: [
					wgGetDate().getCurrentStartDate,
					wgGetDate().getCurrentEndDate,
				],
				addTimeStart: moment(wgGetDate().getCurrentStartDate).valueOf(),
				addTimeEnd: moment(wgGetDate().getCurrentEndDate).valueOf(),
				channelList: [],
				tagIdList: [],
				actType: [],
			},
			formCfg109: [
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
					enter: () => {
						if (!this.loading) this.getData110()
					},
				},
				{
					title: '会场',
					type: 'input',
					dataIndex: 'brandName',
					placeholder: '请输入会场',
					enter: () => {
						if (!this.loading) this.getData110()
					},
				},
				{
					title: '手机号',
					type: 'input',
					dataIndex: 'phone',
					placeholder: '请输入店主手机号',
					enter: () => {
						if (!this.loading) this.getData110()
					},
				},
				{
					title: '收货人',
					type: 'input',
					dataIndex: 'consignee',
					placeholder: '请输入收货人',
					enter: () => {
						if (!this.loading) this.getData110()
					},
				},
				{
					type: 'select',
					title: '审核状态',
					dataIndex: 'orderState',
					placeholder: '请选择审核状态',
					label: 'value',
					options: [
						{
							orderState: '-1',
							value: '全部（非作废）',
						},
						{
							orderState: '1',
							value: '待审核',
						},
						{
							orderState: '8',
							value: '审核通过',
						},
						{
							orderState: '9',
							value: '审核不通过',
						},
					],
				},
				{
					type: 'select',
					title: '发货状态',
					dataIndex: 'deliverStateAndSign',
					placeholder: '请选择发货状态',
					label: 'value',
					options: [
						{
							deliverStateAndSign: '0',
							value: '全部',
						},
						{
							deliverStateAndSign: '1',
							value: '待发货(未拣货)',
						},
						{
							deliverStateAndSign: '2',
							value: '待发货(拣货中)',
						},
						{
							deliverStateAndSign: '3',
							value: '已发货(部分商品发货)',
						},
						{
							deliverStateAndSign: '4',
							value: '已发货(全部商品发货)',
						},
						{
							deliverStateAndSign: '5',
							value: '已确认收货',
						},
					],
				},
				{
					type: 'select',
					title: '收款状态',
					dataIndex: 'receiveState',
					placeholder: '请选择收款状态',
					label: 'value',
					options: [
						{
							receiveState: '0',
							value: '全部',
						},
						{
							receiveState: '1',
							value: '待付款',
						},
						{
							receiveState: '2',
							value: '付款中',
						},
						{
							receiveState: '3',
							value: '已付款',
						},
					],
				},
				{
					type: 'select',
					title: '退款状态',
					dataIndex: 'refundState',
					placeholder: '请选择退款状态',
					label: 'value',
					options: [
						{
							refundState: '0',
							value: '全部',
						},
						{
							refundState: '1',
							value: '有退款',
						},
					],
				},
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierAccountNumberId',
					colSpan: 6,
				},
				{
					title: '关键词',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '下单人/备注/条形码/下单号',
					enter: () => {
						if (!this.loading) this.getData110()
					},
				},
				{
					type: 'time',
					title: '下单时间',
					dataIndex: 'orderTimeList',
					colSpan: 12,
					change: () => {
						this.formData109.orderTimeList = this.formData109.orderTimeList || [
							'',
							'',
						]
						let addTimeStart = this.formData109.orderTimeList[0]
						let addTimeEnd = this.formData109.orderTimeList[1]
						this.formData109.addTimeStart = addTimeStart
							? moment(addTimeStart).valueOf()
							: ''
						this.formData109.addTimeEnd = addTimeEnd
							? moment(addTimeEnd).valueOf()
							: ''
					},
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
						pickerOptions: {
							shortcuts: [
								{
									text: '今日',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getCurrentStartDate,
											wgGetDate().getCurrentEndDate,
										])
									},
								},
								{
									text: '昨日',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getYesterdayStartDate,
											wgGetDate().getYesterdayEndDate,
										])
									},
								},
								{
									text: '本周',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getWeekStartDate,
											wgGetDate().getWeekEndDate,
										])
									},
								},
								{
									text: '上周',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getUpWeekStartDate,
											wgGetDate().getUpWeekEndDate,
										])
									},
								},
								{
									text: '本月',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getMonthStartDate,
											wgGetDate().getMonthEndDate,
										])
									},
								},
								{
									text: '上月',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getUpMonthStartDate,
											wgGetDate().getUpMonthEndDate,
										])
									},
								},
							],
						},
					},
				},
			],
			formTags: [
				{
					type: 'custom',
					dataIndex: 'tagsList',
				},
			],
			orderTagList: [],
			actTypeList: [
				{
					actType: 1,
					value: '满减活动下单',
				},
				{
					actType: 2,
					value: '满折活动下单',
				},
				{
					actType: 3,
					value: '新店主专区下单',
				},
				{
					actType: 5,
					value: '多件促销活动',
				},
				{
					actType: 6,
					value: '拼团活动下单',
				},
			],
			orderTypeList: [
				{
					orderType: '1',
					value: '小B下单',
				},
				{
					orderType: '3',
					value: 'C端下单',
				},
				{
					orderType: '4',
					value: 'B端下单',
				},
			],
			formAction109: [
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						if (!this.loading) this.getData110(true)
					},
				},
				{
					title: '批量同步物流',
					type: 'success',
					auth: 'logisticQuery',
					click: () => {
						if (this.brandIds.length === 0)
							return this.$message.warning('请勾选要批量同步的订单')
						this.$confirm('是否确定批量同步物流?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'success',
						}).then(async () => {
							const {
								data: { resultCode, resultMsg },
							} = await logisticQuery({ list: this.brandIds })
							resultCode === 0 && this.$message.success(resultMsg)
						})
					},
				},
				{
					title: ' 批量设置拣货中',
					type: 'success',
					auth: 'batchUpdateOrderDeliverSign',
					click: () => {
						if (
							this.orderIdList.length === 0 &&
							this.supplierAccountNumberIdList.length === 0
						)
							return this.$message.warning('请勾选要批量同步的订单')
						this.$confirm('是否确定批量设置拣货中?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'success',
						}).then(async () => {
							const {
								data: { resultCode, resultMsg },
							} = await batchUpdateOrderDeliverSign({
								orderIdList: this.orderIdList,
								supplierAccountNumberIdList: this.supplierAccountNumberIdList,
							})
							if (resultCode == 0) {
								this.$message.success(resultMsg)
								this.getData110()
							}
						})
					},
				},
				{
					title: '批量标记',
					type: 'success',
					auth: 'tagOrder',
					click: () => {
						if (this.orderIdList.length === 0)
							return this.$message.warning('请勾选要批量标记的订单')
						this.$confirm('是否批量重新标记？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'success',
						}).then(async () => {
							const {
								data: { resultCode, resultMsg },
							} = await tagOrder({
								orderIdList: this.orderIdList,
								handleTag: 1,
							})
							if (resultCode === 0) {
								this.$message.success(resultMsg)
								this.getData110(true)
							}
						})
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportOrderListByCondition',
					click: () => {
						this.dialogVisible114 = true
					},
				},
			],
			// 订单列表数据展示
			accountItems112: [
				{
					type: 'amount',
					title: '订单总额',
					value: '0.00',
				},
				{
					type: 'order',
					title: '订单数',
					value: '0',
				},
				{
					type: 'order',
					title: '商品数量',
					value: '0',
				},
			],
			// 订单列表表格
			tableData110: [],
			// 表格列设置
			tableColumns110: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号',
					width: '180',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'receiveState',
					title: '收款状态',
					align: 'left',
					width: '72',
				},
				{
					type: 'custom',
					dataIndex: 'orderState',
					title: '审核状态',
					align: 'left',
					width: '96',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
					align: 'left',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'platformOrderSn',
				// 	title: '下单号',
				// 	customRender: (row) => {
				// 		const hideStatus =
				// 			(this.user.groupId == 2 || this.user.groupId == 8) &&
				// 			this.orderSearchToB
				// 		return !hideStatus ? '-' : row.platformOrderSn
				// 	},
				// 	align: 'left',
				// },
				// {
				// 	type: 'string',
				// 	dataIndex: 'handleTag',
				// 	title: '标记状态',
				// 	customRender: (row) => {
				// 		const arr = ['', '待处理', '系统处理', '人工处理']
				// 		return arr[row.handleTag] || '其他'
				// 	},
				// 	align: 'left',
				// },
				{
					type: 'custom',
					dataIndex: 'brandName',
					title: '会场',
					width: '120',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店主',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'channel',
					title: '渠道',
					align: 'left',
					width: '72',
				},
				{
					type: 'string',
					dataIndex: 'weixinUserName',
					title: '下单人',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'consignee',
					title: '收货人',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'deliverState',
					title: '发货状态',
					align: 'left',
					width: '96',
				},
				{
					type: 'custom',
					dataIndex: 'orderStateList',
					title: '订单状态',
					align: 'left',
					width: '84',
				},
				{
					type: 'custom',
					dataIndex: 'refundState',
					title: '退款状态',
					align: 'left',
				},
				{
					type: 'amount',
					dataIndex: 'expressFee',
					title: '运费',
					align: 'left',
					width: '72',
				},
				{
					type: 'amount',
					dataIndex: 'realAmount',
					title: '订单金额',
					align: 'left',
					width: '72',
				},
				{
					type: 'string',
					dataIndex: 'refundAmount',
					title: '退款金额',
					customRender: (row) => {
						let refundInfoList = []
						let refundAmount = 0
						if (row.refundInfo) {
							refundInfoList = row.refundInfo.split(',')
						}
						if (refundInfoList.length) {
							refundInfoList.map((item) => {
								refundAmount += Number(item.split('-')[1])
							})
						}
						return '￥' + refundAmount.toFixed(2) || '0.00'
					},
					align: 'left',
					width: '72',
				},
				{
					type: 'action',
					dataIndex: 'listOperation',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '打标',
							auth: 'addOrderTagByOrderIdList',
							click: (row) => {
								this.activeRow = row
								this.dialogVisible111 = true
							},
						},
						{
							title: '修改地址',
							auth: 'updateOrderByOrderId',
							customRender: (action, row) => {
								action.hide = !(row.orderState != 9 && row.deliverState < 3)
								return action
							},
							click: (row) => {
								this.$router.push({
									path: `/business/orderEdit/${row.orderId}`,
								})
							},
						},
						{
							title: '审核通过',
							auth: 'auditOrder',
							customRender: (action, row) => {
								const hideStatus =
									(row.receiveState == 3 || row.receiveState == 4) &&
									row.orderState < 8
								action.hide =
									!hideStatus ||
									this.notSeIfBrandMap[row.supplierAccountNumberId]
								return action
							},
							click: async (row) => {
								this.activeRow = row
								this.initAuditModalSuccessData.orderSn = row.orderSn
								this.initAuditModalSuccessVisible = true
								this.initAuditModalSuccessLoading = true
								const {
									data: { resultData, resultCode },
								} = await getOrderDetailByOrderId({ orderId: row.orderId })
								if (resultCode === 0) {
									let refundQuantity = 0
									resultData.orderGoodsList.map((item) => {
										if (item.stockOutQuantity) {
											refundQuantity =
												refundQuantity + Number(row.stockOutQuantity)
										}
										if (item.refundQuantity) {
											refundQuantity =
												refundQuantity + Number(row.refundQuantity)
										}
										item.refundQuantity = refundQuantity
									})
									this.initAuditModalSuccessTableData =
										resultData.orderGoodsList
									this.initAuditModalSuccessLoading = false
									this.getData110(true)
								}
							},
						},
						{
							title: '审核不通过',
							auth: 'auditOrder',
							customRender: (action, row) => {
								const hideStatus =
									(row.receiveState == 3 || row.receiveState == 4) &&
									row.orderState < 8
								action.hide =
									!hideStatus ||
									this.notSeIfBrandMap[row.supplierAccountNumberId]
								return action
							},
							click: (row) => {
								this.activeRow = row
								this.initAuditModalData.orderSn = row.orderSn
								this.initAuditModalVisible = true
							},
						},
						{
							title: '退货退款',
							auth: 'addOrderRefundByOrderId',
							customRender: (action, row) => {
								let hideStatus
								hideStatus =
									(row.receiveState == 3 || row.receiveState == 4) &&
									(isNull(row.refundAmount) ||
										row.refundAmount < row.realAmount) &&
									row.orderState >= 8
								// 如果订单确认收货时间超过30天，则不显示'退货退款'
								let timeDifference =
									new Date().valueOf() - row.confirmDeliverTime
								if (
									(hideStatus && row.confirmDeliverTime == 0) ||
									timeDifference < 2592000000
								) {
									hideStatus = true
								} else {
									hideStatus = false
								}
								action.hide =
									!hideStatus ||
									this.notSeIfBrandMap[row.supplierAccountNumberId]
								return action
							},
							click: async (row) => {
								this.existUnFinishAfterSales(row)
							},
						},
						{
							title: '发货',
							auth: 'addFastOrderDeliver',
							customRender: (action, row) => {
								const hideStatus =
									(row.receiveState == 3 || row.receiveState == 4) &&
									row.deliverState < 3 &&
									row.orderState == 8
								action.hide = !hideStatus
								return action
							},
							click: async (row) => {
								this.$router.push({
									path: `/business/orderShipmentsSpot/${row.orderId}`,
								})
							},
						},
						{
							title: '补款',
							auth: 'addOrderCompensation',
							customRender: (action, row) => {
								const hideStatus =
									(this.user.groupId == 2 || this.user.groupId == 8) &&
									row.orderState != 1 &&
									(row.receiveState == 3 || row.receiveState == 4)
								action.hide = !hideStatus
								return action
							},
							click: async (row) => {
								this.activeRow = row
								this.refundMoneyDialogVisible = true
							},
						},
						{
							title: '补偿',
							auth: 'addCouponCompensation',
							customRender: (action, row) => {
								const hideStatus =
									row.receiveState == 3 || row.receiveState == 4
								action.hide = !hideStatus
								return action
							},
							click: (row) => {
								this.activeRow = row
								this.compensateFormData.orderSn = row.orderSn
								this.compensateDialogVisible = true
							},
						},
					],
				},
			],
			page110: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData110()
				},
			},
			// 订单快速打标签弹窗
			dialogTitle111: '订单快速打标签',
			dialogWidth111: '50%',
			dialogVisible111: false,
			dialogBottomBtn111: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						if (!this.loading) this.handleSubmitDialog111()
					},
				},
			],
			// 导出订单列表弹窗
			dialogTitle114: '导出订单列表',
			dialogWidth114: '50%',
			dialogVisible114: false,
			dialogBottomBtn114: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						let paramJson = this.findSearchParams110()
						const _obj = {}
						this.formData115.outputHeader.map((item) => {
							let key = Object.keys(item)[0]
							_obj[key] = item[key]
						})
						paramJson.header = _obj
						paramJson.orderIdList = this.orderIdList
						this.formData115Loading = true
						let { data } = await exportOrderListByCondition(paramJson)
						this.formData115Loading = false
						downloadFile(data, '导出订单.xlsx')
					},
				},
			],
			formData115Loading: false,
			formData115CheckAll: false,
			// 导出订单列表弹窗 - 表格
			formData115: {
				outputHeader: [],
			},
			formCfg115: [
				{
					type: 'checkbox',
					title: '',
					dataIndex: 'outputHeader',
					label: 'value',
					options: [
						{
							outputHeader: { orderSn: '订单号' },
							value: '订单号',
						},
						{
							outputHeader: { addTime: '下单时间' },
							value: '下单时间',
						},
						{
							outputHeader: { brandName: '会场名称' },
							value: '会场名称',
						},
						{
							outputHeader: { goodsName: '商品名称' },
							value: '商品名称',
						},
						{
							outputHeader: { goodsNumber: '货号' },
							value: '货号',
						},
						{
							outputHeader: { specName: '规格' },
							value: '规格',
						},
						{
							outputHeader: { barCode: 'SKU编码(条形码)' },
							value: 'SKU编码(条形码)',
						},
						{
							outputHeader: { costPrice: '结算价' },
							value: '结算价',
						},
						{
							outputHeader: { price: '单价' },
							value: '单价',
						},
						{
							outputHeader: { quantity: '购买数量' },
							value: '购买数量',
						},
						{
							outputHeader: { realAmount: '订单金额' },
							value: '订单金额',
						},
						{
							outputHeader: { phone: '收件人手机号' },
							value: '收件人手机号',
						},
						{
							outputHeader: { consignee: '收件人名称' },
							value: '收件人名称',
						},
						{
							outputHeader: { address: '收件人地址' },
							value: '收件人地址',
						},
						{
							outputHeader: { identificationCard: '身份证' },
							value: '身份证',
						},
						{
							outputHeader: { returnQuantity: '退货数量' },
							value: '退货数量',
						},
						{
							outputHeader: { description: '下单备注' },
							value: '下单备注',
						},
						{
							outputHeader: { expressFee: '运费' },
							value: '运费',
						},
						{
							outputHeader: { goodsGroupId: '分组Id' },
							value: '分组Id',
						},
						{
							outputHeader: { groupName: '分组名称' },
							value: '分组名称',
						},
					],
					change: (row) => {
						this.formData115CheckAll =
							this.formCfg115[0].options.length == row.length
					},
				},
			],

			// 订单补偿弹窗
			compensateDialogVisible: false,
			compensateDialogBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						if (!this.loading) this.handleCompensateClick()
					},
				},
			],
			// 订单补偿弹窗 - 表单
			compensateFormData: {
				orderSn: '',
				couponName: '',
				quantity: null,
				scope: [],
				remark: '',
			},
			compensateRules: {
				scope: [
					{ required: true, message: '请选择补偿用户!', trigger: 'blur' },
				],
				remark: [{ required: true, message: '请填写备注!', trigger: 'blur' }],
			},
			compensateFormCfg: [
				{
					title: '订单号',
					type: 'text',
					dataIndex: 'orderSn',
				},
				{
					title: '选择优惠券',
					type: 'custom',
					dataIndex: 'couponName',
				},
				{
					title: '优惠券数量',
					type: 'inputNumber',
					dataIndex: 'quantity',
				},
				{
					title: '补偿用户',
					type: 'checkbox',
					dataIndex: 'scope',
					label: 'value',
					options: [
						{
							scope: '1',
							value: '消费者',
						},
						{
							scope: '2',
							value: '店主',
						},
					],
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			// 选择优惠券弹框开关
			dialogCouponVisible: false,
			selectedList: [], // 选择优惠券弹框
			// 立即发货弹窗
			orderShipmentDialogVisible: false,
			orderShipmentDialogBottomBtn: [],
			// 立即发货弹窗 - 表单
			consigneeInfoFormData: {
				organizationName: '',
				orderSn: '',
				orderState: '',
				consigneeInfo: '',
			},
			consigneeInfoFormCfg: [
				{
					title: '店主',
					type: 'text',
					dataIndex: 'organizationName',
				},
				{
					title: '单号',
					type: 'text',
					dataIndex: 'orderSn',
				},
				{
					title: '审核情况',
					type: 'text',
					dataIndex: 'orderState',
				},
				{
					title: '收货信息',
					type: 'text',
					dataIndex: 'consigneeInfo',
				},
			],
			initAuditModalVisible: false,
			initAuditModalBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						if (!this.initAuditModalData.remark.trim()) {
							return this.$message.warning('请填写审核意见')
						}
						const {
							data: { resultMsg, resultData },
						} = await auditOrder({
							orderId: this.activeRow.orderId,
							auditState: 2,
							remark: this.initAuditModalData.remark,
						})
						if (resultData) {
							this.$message.success(resultMsg)
							this.getData110(true)
							this.updateAfterSalesExpressVisible = false
						}
					},
				},
			],
			initAuditModalData: {
				orderSn: '',
				remark: '',
			},
			initAuditModalCfg: [
				{
					type: 'text',
					title: '订单号',
					dataIndex: 'orderSn',
				},
				{
					type: 'textarea',
					title: '审核意见',
					dataIndex: 'remark',
				},
			],
			initAuditModalSuccessVisible: false,
			initAuditModalSuccessBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						if (!this.initAuditModalSuccessData.sourceName.trim()) {
							return this.$message.warning('请填写下单设备')
						}
						if (!this.initAuditModalSuccessData.platformOrderSn.trim()) {
							return this.$message.warning('请填写平台订单号')
						}
						if (!this.initAuditModalSuccessData.settlementAmount.trim()) {
							return this.$message.warning('请填写商家支付金额')
						}
						if (!this.initAuditModalSuccessData.platformExpressFee.trim()) {
							return this.$message.warning('请填写商家支付运费')
						}
						if (!this.initAuditModalSuccessData.remark.trim()) {
							return this.$message.warning('请填写审核意见')
						}
						const orderGoodsList = this.initAuditModalSuccessTableData.map(
							(item) => {
								return {
									orderGoodsId: item.orderGoodsId,
									goodsSpecId: item.goodsSpecId,
									platformPrice: item.platformPrice,
								}
							}
						)
						const initAuditModalSuccessData = this.initAuditModalSuccessData
						const {
							data: { resultMsg, resultCode },
						} = await auditOrder({
							orderId: this.activeRow.orderId,
							auditState: 1,
							remark: this.initAuditModalSuccessData.remark,
							sourceName: initAuditModalSuccessData.sourceName,
							platformOrderSn: initAuditModalSuccessData.platformExpressFee,
							orderGoodsList,
						})
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							this.getData110(true)
							this.initAuditModalSuccessVisible = false
						}
					},
				},
			],
			initAuditModalSuccessData: {
				orderSn: '',
				sourceName: '',
				platformOrderSn: '',
				settlementAmount: '',
				platformExpressFee: '',
				remark: '',
			},
			initAuditModalSuccessCfg: [
				{
					type: 'text',
					title: '订单号',
					dataIndex: 'orderSn',
				},
				{
					type: 'input',
					title: '下单设备',
					dataIndex: 'sourceName',
				},
				{
					type: 'input',
					title: '平台订单号',
					dataIndex: 'platformOrderSn',
				},
				{
					type: 'inputNumber',
					title: '商家支付金额',
					dataIndex: 'settlementAmount',
				},
				{
					type: 'inputNumber',
					title: '商家支付运费',
					dataIndex: 'platformExpressFee',
				},
				{
					type: 'textarea',
					title: '审核意见',
					dataIndex: 'remark',
				},
			],
			initAuditModalSuccessTableData: [],
			initAuditModalSuccessColumns: [
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'stockOutQuantity',
					title: '下单数/已退/待退',
				},
				{
					type: 'custom',
					dataIndex: 'platformPrice',
					title: '商家商品成本',
				},
			],
			// 退货退款
			refundDialogVisible: false,
			// 补款
			refundMoneyDialogVisible: false,
		}
	},
	watch: {
		// 监听退款原因
		'refundReasonDialogData.refundReason': {
			handler(val) {
				if (val === '3') {
					this.refundReasonDialogData.refundDesc = '2'
				} else {
					this.refundReasonDialogData.refundDesc = '1'
				}
			},
			deep: true,
		},
		// 设置优惠券选择列表
		selectedList: {
			handler(val) {
				val.length > 0 &&
					(this.compensateFormData.couponName = val[0].couponName)
			},
			deep: true,
		},
	},
	created() {
		this.queryNotSelfBrandSupplierAccountIds()
		this.getUserInfo()
		this.initOrderTag()
	},
	methods: {
		existUnFinishAfterSales: async function (row) {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await existUnFinishAfterSales({ orderId: row.orderId })
			if (resultCode == 0) {
				if (resultData.isExist) {
					this.$confirm(
						'该订单下有未完结的售后单，是否还继续进行退货退款',
						'提示',
						{
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
						}
					)
						.then(() => {
							this.refundDialogVisible = true
							this.activeRow = row
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消退货退款',
							})
						})
					// this.$message.warning('该订单下有未完结的售后单，不允许进行退货退款')
				} else {
					this.refundDialogVisible = true
					this.activeRow = row
				}
			}
		},
		queryNotSelfBrandSupplierAccountIds: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await queryNotSelfBrandSupplierAccountIds({})
			if (resultCode == 0) {
				//供应商账号id,只要判断有包含的，就是非自有品牌
				if (resultData.length > 0) {
					resultData.map((item) => {
						this.notSeIfBrandMap[item] = item
					})
				}
				console.log('是否匹配到非自有品牌:', this.notSeIfBrandMap)
			}
		},
		handleCheckAllChange(val) {
			this.formData115CheckAll = val ? true : false
			this.formData115.outputHeader = val
				? this.formCfg115[0].options.map((item) => {
						return item.outputHeader
				  })
				: []
		},
		//品牌背景颜色
		brandBg(row) {
			let curTime = new Date().getTime()
			let nowYear = new Date().getYear()
			nowYear += nowYear < 2000 ? 1900 : 0
			let value = row.brandName
			// 待发货 notDeliver: 1
			if (!isNull(row.lastDeliverTime)) {
				if (
					curTime > parseInt(row.lastDeliverTime) &&
					row.deliverState == 1 &&
					row.refundAmount != row.realAmount
				) {
					return true
				} else {
					return false
				}
			} else {
				if (value && value.indexOf('[') > -1) {
					let brandTime = value.substring(
						value.indexOf('[') + 1,
						value.length - 1
					)
					let month = '0' + (Number(brandTime.substring(0, 2)) - 1 + '')
					let day = brandTime.substring(2, 4)
					brandTime = new Date(nowYear, month, day).getTime()
					//未发货，且没有退全款，时间大于7
					if (
						curTime > brandTime + 7 * 24 * 60 * 60 * 1000 &&
						row.deliverState == 1 &&
						row.refundAmount != row.realAmount
					) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			}
		},
		// 获取订单标签
		async initOrderTag() {
			const {
				data: { resultData, resultCode },
			} = await getOrderConfiguration()
			if (resultCode === 0) {
				const targetArr = []
				resultData.orderTagList.map((item) => {
					targetArr.push({
						tagIdList: item.organizationTagId,
						value: item.tagName,
					})
				})
				this.orderTagList = targetArr
				this.formCfg109.map((item) => {
					if (item.dataIndex === 'tagIdList') {
						item.options = targetArr
					}
				})
			}
		},
		// 获取订单表格数据
		async getData110(flag) {
			if (!this.formData109.orderSn) {
				const { code, msg } = await limitFormChooseTimes(
					this.formData109.addTimeStart,
					this.formData109.addTimeEnd,
					30
				)
				if (code !== 200) {
					return this.$message.warning(msg)
				}
			}

			const accountItems = this.accountItems112
			let paramJson = this.findSearchParams110(flag)
			paramJson.orderIdList = []
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getOrderListByCondition(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			this.loading = false
			if (resultData.orderList) {
				this.dealOrderList(resultData.orderList)
				this.tableData110 = resultData.orderList
				this.page110.count = resultData.statistics.orderCount
				accountItems.map((accountItem) => {
					switch (accountItem.title) {
						case '订单总额':
							accountItem.value = resultData.statistics.totalAllAmount
							break
						case '订单数':
							accountItem.value = resultData.statistics.orderCount
							break
						case '商品数量':
							accountItem.value = resultData.statistics.goodsCount
							break
						default:
							break
					}
				})
			}
			this.loading = false
		},
		// 处理订单中的项格式数据
		dealOrderList(list) {
			list.map((item) => {
				item.tagNameList =
					item.tagName &&
					item.tagName.split(',').map((item2) => {
						return item2.split('-')[1]
					})

				let color
				let orderStateDescription
				if (item.orderState < 8) {
					if (item.receiveState == 1) {
						color = 'stateColor-red'
						orderStateDescription = '待付款'
					} else if (item.receiveState == 3 || item.receiveState == 4) {
						color = 'stateColor-red'
						orderStateDescription = '正在抢购'
					} else {
						color = 'stateColor-gray'
						orderStateDescription = '其他'
					}
				} else if (item.orderState == 8) {
					if (item.deliverState == 1) {
						color = 'stateColor-red'
						//                  orderStateDescription = "待发货";
						orderStateDescription = '等待分拣'
					} else if (item.deliverState == 2) {
						color = 'stateColor-yellow'
						orderStateDescription = '发货中'
					} else if (item.deliverState == 3) {
						color = 'stateColor-yellow'
						//                  orderStateDescription = "已发货";
						orderStateDescription = '等待签收'
					} else if (item.deliverState == 4) {
						color = 'stateColor-green'
						orderStateDescription = '已完成'
					} else {
						color = 'stateColor-gray'
						orderStateDescription = '其他'
					}
				} else {
					if (item.receiveState == 5) {
						color = 'stateColor-gray'
						orderStateDescription = '已退款'
					} else {
						color = 'stateColor-gray'
						//                  orderStateDescription = "交易关闭";
						orderStateDescription = '抢购失败'
					}
				}
				item.orderStateListArr = {
					color,
					orderStateDescription,
				}

				let refundInfoList = []
				let stateString = ''
				let refundStateColor = ''
				if (item.refundInfo) {
					refundInfoList = item.refundInfo.split(',')
				}
				if (refundInfoList.length) {
					let refundAmount = 0
					refundInfoList.map((item2) => {
						refundAmount += Number(item2.split('-')[1])
					})
					if (refundAmount < item.realAmount) {
						refundStateColor = 'stateColor-yellow'
						if (refundAmount > 6) {
							stateString = '有退款,大于6'
						} else {
							stateString = '有退款,小于6'
						}
					} else if (refundAmount == item.realAmount) {
						refundStateColor = 'stateColor-green'
						stateString = '退全款'
					} else if (refundAmount > item.realAmount) {
						refundStateColor = 'stateColor-red'
						stateString = '退超款'
					} else {
						refundStateColor = 'stateColor-gray'
						stateString = '其他'
					}
				} else {
					refundStateColor = 'stateColor-red'
					stateString = '无'
				}
				item.refundStateArr = {
					color: refundStateColor,
					stateString,
				}
			})
		},
		// 分页
		findSearchParams110(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page110.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					length: this.page110.length,
					startIndex: (this.page110.currentPage - 1) * this.page110.length,
				},
				this.formData109
			)
			const actType = this.formData109.actType[0]
			paramJson.morePromotion = 0
			paramJson.discountType = 0
			paramJson.isChannelNew = 0
			paramJson.groupPlace = 0
			switch (actType) {
				case 1:
					paramJson.discountType = 1
					break
				case 2:
					paramJson.discountType = 2
					break
				case 3:
					paramJson.isChannelNew = 1
					break
				case 4:
					paramJson.groupPlace = 1
					break
				case 5:
					paramJson.morePromotion = 1
					break
				case 6:
					paramJson.groupBuyingOrder = 1
					break
			}
			delete paramJson.orderTimeList
			return paramJson
		},
		async handleSubmitDialog111() {
			const params = {
				orderIdList: [this.activeRow.orderId],
				tagIdList: this.addTagList,
			}
			const {
				data: { resultCode, resultMsg },
			} = await addOrderTagByOrderIdList(params)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.getData110(true)
			}
			this.dialogVisible111 = false
		},
		// 获取用户数据
		getUserInfo() {
			this.user = JSON.parse(localStorage.getItem('yhtplus/_user') || '[]')
		},
		// 批量选择订单时整合数组
		selectionChange(list) {
			this.brandIds = list.map((item) => {
				return {
					supplyId: item.supplierAccountNumberId,
					orderSn: item.orderSn,
				}
			})
			this.orderIdList = list.map((item) => {
				return item.orderId
			})
			this.supplierAccountNumberIdList = list.map((item) => {
				return item.supplierAccountNumberId
			})
		},
		deliverStateChange(row) {
			let deliverGoods
			if (row.deliverSign == 0 && row.deliverState == 1) {
				deliverGoods = '待发货(未拣货)'
			} else if (row.deliverSign == 1 && row.deliverState == 1) {
				deliverGoods = '待发货(拣货中)'
				// color = $.stateColor.red
			} else if (row.deliverSign == 2 && row.deliverState == 3) {
				deliverGoods = '已发货(部分发货)'
				// color = $.stateColor.yellow
			} else if (row.deliverSign == 3 && row.deliverState == 3) {
				deliverGoods = '已发货(全部商品发货)'
				// color = $.stateColor.green
			} else if (row.deliverSign == 3 && row.deliverState == 4) {
				deliverGoods = '已确认收货'
				// color = $.stateColor.gray
			} else {
				if (row.deliverState == 1) {
					deliverGoods = '待发货(未拣货)'
					// color = $.stateColor.red
				} else {
					deliverGoods = '状态异常'
				}
			}
			return deliverGoods
		},
		// 订单补偿
		async handleCompensateClick() {
			if (this.selectedList.length === 0)
				return this.$message.warning('请选择优惠券！')
			let count = 0
			this.compensateFormData.scope.map((item) => (count += Number(item)))
			const params = {
				orderId: this.activeRow.orderId,
				yxCouponId: this.selectedList[0].yxCouponId,
				quantity: this.compensateFormData.quantity,
				scope: count,
				remark: this.compensateFormData.remark.trim(),
				grantCount: this.selectedList[0].grantCount,
			}
			if (!params.yxCouponId) return this.$message.warning('请选择优惠券！')
			if (!params.quantity || params.quantity <= 0)
				return this.$message.warning('请输入优惠券数量！')
			if (params.quantity > params.grantCount)
				return this.$message.warning('优惠券数量大于优惠券总额!')
			if (!params.remark.trim()) return this.$message.warning('请填写备注！')
			const {
				data: { resultCode, resultMsg },
			} = await addCouponCompensation(params)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.compensateDialogVisible = false
				this.compensateFormData = {
					orderSn: '',
					couponName: '',
					quantity: null,
					scope: [],
					remark: '',
				}
				this.getData110(true)
			}
		},
		// 打开选择优惠券modal
		selectCoupon(e) {
			e.target.blur()
			this.dialogCouponVisible = true
		},
		// 打开新标签下载
		openNewTab: function (url, params) {
			params = params || {}
			let i = 0
			for (let key in params) {
				let item = params[key]
				if (i == 0) {
					url += '?' + key + '=' + item
				} else {
					url += '&' + key + '=' + item
				}
				i++
			}
			window.open(url)
		},
		// 获取商家列表
		async _findSupplierAccountNumberForList(query) {
			if (query !== '') {
				const paramJson = {
					startIndex: 0,
					length: 20,
					keyword: query,
				}
				const {
					data: { resultCode, resultData },
				} = await findSupplierAccountNumberForList(paramJson)

				if (resultCode == 0) {
					this.formDataSupplierAccountNumberList = resultData.list || []
					return
				}
			}
			this.formDataSupplierAccountNumberList = []
		},
	},
}
</script>
<style lang="scss" scope>
.addTag-title {
	margin-bottom: 25px;
}
.refundReason {
	margin: 20px 0;
}
.stateColor {
	display: inline-block;
	border-radius: 50%;
	width: 10px;
	height: 10px;
}
.stateColor-red {
	background-color: #c41717;
}
.stateColor-green {
	background-color: #2ea522;
}
.stateColor-yellow {
	background-color: #fdbd39;
}
.stateColor-gray {
	background-color: #b0b0b0;
}
.brandNameClass {
	&.brandRed {
		border-radius: 5px;
		background-color: #c41717;
		color: #fff;
		padding: 2px 4px;
	}
}
.orderEditDetail {
	width: 100%;
	height: 160px;
	border: 1px solid #e5ebf5;
	border-top: none;
	padding: 5px 10px;
	.orderEditDetail-item {
		margin-bottom: 5px;
	}
	.orderEditDetail-title {
		font-weight: bold;
		margin-right: 5px;
	}
	.orderEditDetail-contain {
		font-weight: bold;
		color: red;
	}
}
.orderAdressEdit {
	margin-left: 10px;
	color: #0096fb;
	text-decoration: underline;
	cursor: pointer;
}
.el-cascader {
	width: 100% !important;
}
.orderLabel {
	display: inline-block;
	color: white;
	padding: 2px 5px;
	border-radius: 5px;
	background-color: #2ea522;
	margin: 2px 5px 0 0;
	&.bg-yellow {
		background-color: #fdbd39;
	}
}
.refundTableSum {
	width: 100%;
	height: 30px;
	border: 1px solid #e5ebf5;
	border-top: none;
	text-align: right;
	padding: 5px 10px 0 0;
}

.tags-row {
	line-height: 24px;
}
// 样式优化 -S
.order-table .el-table .el-table__body .cell {
	line-height: 1.5;
}
// 样式优化 -E
</style>
