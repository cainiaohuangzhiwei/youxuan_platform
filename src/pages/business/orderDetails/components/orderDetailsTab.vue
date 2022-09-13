<template>
	<div>
		<!-- 订单信息 -->
		<div class="order-info">
			<p>
				<span>店主：</span>
				<el-button type="text">
					<router-link
						:to="`/shop/shop/shopDetail/${orderDetail.childOrganizationId}`"
						>{{ orderDetail.organizationName }}</router-link
					>
				</el-button>
			</p>
			<p>
				<span>单号：</span>
				<el-button
					v-clipboard:copy="orderDetail.orderSn"
					v-clipboard:success="copyCode"
					type="text"
					>{{ orderDetail.orderSn }}</el-button
				>
				<strong v-if="orderDetail.isFreeze == 1">[冻结]</strong>
			</p>
			<p>
				<span>会场：</span>
				<strong>{{ orderDetail.brandName }}</strong>
			</p>
			<p>
				<strong>【{{ getStateStringByCode(orderDetail.orderState) }}】</strong>
			</p>
			<p>
				<span>下单时间：</span>
				<strong>{{
					orderDetail.addTime
						? moment(orderDetail.addTime).format('YYYY-MM-DD HH:mm:ss')
						: '无'
				}}</strong>
			</p>
			<p>
				<span>下单人：</span>
				<strong>{{ orderDetail.weixinUserName }}</strong>
			</p>
			<p>
				<el-button
					v-clipboard:copy="orderDetail.openId"
					v-clipboard:success="copyCode"
					type="text"
					>{{ orderDetail.openId }}</el-button
				>
			</p>
			<p>
				<span>下单用户ID：</span>
				<strong>{{ orderDetail.weixinUserId }}</strong>
			</p>
		</div>
		<p v-if="tagList.length">
			<el-tag
				class="tagName-item"
				v-for="(item, index) in tagList"
				:key="index"
				>{{ item.tagName }}</el-tag
			>
		</p>
		<div class="order-info">
			<!-- 操作按钮 -->
			<el-button
				@click="dialogVisible111 = true"
				v-auth="'addOrderTagByOrderIdList'"
				type="text"
				>打标</el-button
			>
			<el-button
				v-auth="'addOrderRefundByOrderId'"
				v-if="showRefundBtn"
				@click="existUnFinishAfterSales"
				type="text"
				>退货退款</el-button
			>
			<el-button
				v-auth="'updateOrderByOrderId'"
				@click="toOrderEdit()"
				v-if="showEditBtn"
				type="text"
				>修改地址</el-button
			>
			<el-button
				v-auth="'auditOrder'"
				@click="showAuditModalSuccess"
				v-if="showAuditPassBtn"
				type="text"
				>审核通过</el-button
			>
			<el-button
				v-auth="'addOrderCompensation'"
				v-if="showReturnMoney"
				@click="showReturnMoneyDialog"
				type="text"
				>补款</el-button
			>
			<el-button
				v-auth="'turnOnAfterSalesEntrance'"
				v-if="showAfterSaleTurnOn"
				@click="_turnOnAfterSalesEntrance"
				type="text"
				>开启申请售后</el-button
			>
			<el-button
				v-auth="'auditOrder'"
				@click="showAuditModalVisible"
				v-if="showAuditPassBtn"
				type="text"
				>审核不通过</el-button
			>
			<el-button
				@click="_checkPaymentResult"
				v-if="orderDetail.receiveState == 2"
				type="text"
				>查询收款</el-button
			>
			<el-button
				v-auth="'sOrderDeliverConfirm'"
				v-if="orderDetail.deliverSign == 3 && orderDetail.deliverState == 3"
				type="text"
				@click="_sOrderDeliverConfirm"
				>确认收货</el-button
			>
			<!-- 操作按钮 -->
			<p class="withoutReason" v-if="orderDetail.afterSale != undefined">
				<strong v-if="orderDetail.afterSale == 0">7天无理由退货</strong
				><strong v-if="orderDetail.afterSale == 1">售后宽松化</strong>
			</p>
			<!-- <p>
				<span>最晚发货时间：</span>
				<strong>{{
					moment(orderDetail.lastDeliverTimeEnd).format('YYYY-MM-DD HH:mm:ss')
				}}</strong>
			</p> -->
			<p>
				<span>权益保障：</span>
				<strong>{{
					orderDetail.equityName ? orderDetail.equityName : '-'
				}}</strong>
			</p>
			<p>
				<span>最晚发货时间：</span>
				<strong>{{
					orderDetail.expectDeliveryEndTime
						? moment(orderDetail.expectDeliveryEndTime).format(
								'YYYY-MM-DD HH:mm:ss'
						  )
						: '-'
				}}</strong>
			</p>
		</div>
		<!-- 订单商品信息 -->
		<yx-table
			class="goods-table"
			:select="false"
			ref="goodsTable"
			:spanMethod="spanMethod"
			v-loading="loading"
			:columns="tableColumns102"
			:data="orderGoodsList"
		>
			<template slot="copy" slot-scope="scope">
				<div v-if="scope.index != orderGoodsList.length - 1">
					<el-button
						v-if="!scope.row.isCoupon"
						type="text"
						v-clipboard:copy="scope.row.goodsNumber"
						v-clipboard:success="copyCode"
						v-clipboard:error="onError"
						>复制货号</el-button
					>
					<p class="couponName" v-else-if="scope.row.isCoupon">
						优惠券：{{ scope.row.couponName }}
					</p>
					<div v-if="scope.row.orderGoodsSnapshot">
						<el-tag
							v-if="
								scope.row.orderGoodsSnapshot.afterSalesType == 1 ||
								scope.row.orderGoodsSnapshot.afterSalesType == 2
							"
							effect="dark"
							type="danger"
							>七天无理由</el-tag
						>
						<el-tag
							v-if="scope.row.orderGoodsSnapshot.afterSalesType == 0"
							effect="dark"
							type="info"
							>不支持七天无理由</el-tag
						>
					</div>
				</div>
				<div class="tfoot" v-else>
					<!-- <div style="color: red" v-if="scope.row.groupBuyingDiscountAmount">
						<span>拼团优惠：</span>
						<span>{{ scope.row.groupBuyingDiscountAmount || 0 }}元</span>
					</div>
					<div v-if="orderDetail.seckillActDiscountAmount">
						<span style="font-size: 13px; font-weight: bold">秒杀优惠：</span>
						<span style="color: red; font-weight: bold; font-size: 10px"
							>{{ orderDetail.seckillActDiscountAmount || 0 }}元</span
						>
					</div> -->
					<div>
						<span>商品总数：</span>
						<span>{{ scope.row.totalQuantity }}</span>
					</div>
					<div>
						<span>订单金额：</span>
						<span>￥{{ scope.row.orderAmount }}</span>
					</div>
					<div>
						<span>运费：</span>
						<span>￥{{ scope.row.expressFee }}</span>
					</div>
					<div v-if="orderDetail.discount">
						<span>订单汇总优惠：</span>
						<span>￥{{ orderDetail.discount }}</span>
					</div>
					<!-- <div v-if="scope.row.morePromotion">
						<span>多件促销活动优惠：</span>
						<span>{{ scope.row.morePromotion }}</span>
					</div> -->
					<div>
						<span>总计：</span>
						<span>￥{{ scope.row.realAmount }}</span>
					</div>
					<!-- <div v-if="scope.row.allowanceDetail">
						<span>津贴：</span>
						<span>{{ scope.row.allowanceDetail }}</span>
					</div>
					<div v-if="scope.row.discountType">
						<span>满减/满折：</span>
						<span>{{ scope.row.discountType }}</span>
					</div> -->
				</div>
			</template>
			<template slot="goodsSpecId" slot-scope="scope">
				<div class="goods-info active" @click="skipGoodsDetails(scope.row)">
					<el-image
						class="wg_image_item"
						fit="cover"
						:src="getBigImg(scope.row.goodsDefaultImage)"
						:preview-src-list="[getBigImg(scope.row.goodsDefaultImage)]"
					>
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
					<div class="goods-info-r">
						<p class="goods_name">货号：{{ scope.row.goodsNumber }}</p>
						<p class="goods_name">{{ scope.row.goodsName }}</p>
						<!-- <router-link
							class="goods-name-box"
							:to="`/goods/GoodsDetail/${scope.row.goodsId}/${scope.row.goodsSpecId}`"
						>
							<el-button type="text">
								货号：{{ scope.row.goodsNumber }}
							</el-button>
						</router-link>
						<p>
							<router-link
								class="goods-name-box"
								:to="`/goods/GoodsDetail/${scope.row.goodsId}/${scope.row.goodsSpecId}`"
							>
								<el-button type="text">
									{{ scope.row.goodsName }}
								</el-button>
							</router-link>
						</p> -->
						<div>
							<span style="color: #2ea522">{{ scope.row.specHtml }}</span>
							<span style="color: red">X{{ scope.row.quantity }}</span>
						</div>
						<div>
							<el-tag
								size="mini"
								type="info"
								effect="plain"
								v-for="(goodsTag, index) in scope.row.goodsTagList"
								:key="index"
								style="margin: 6px 6px 0 0"
								>{{ goodsTag }}</el-tag
							>
						</div>
					</div>
				</div>
			</template>
			<template slot="allDiscountAmount" slot-scope="scope">
				<el-button
					v-if="scope.row.allDiscountAmount"
					type="text"
					@click="showDiscount(scope.row)"
				>
					￥{{ scope.row.allDiscountAmount.toFixed(2) }}
				</el-button>
			</template>
		</yx-table>

		<!-- 权益卡 S -->
		<yx-table
			v-if="equityOrderList.length"
			:columns="tableColumns105"
			:data="equityOrderList"
			:select="false"
			style="margin-top: 20px"
		>
			<template slot="copy" slot-scope="scope">
				<el-button
					type="text"
					v-clipboard:copy="scope.row.equitySn"
					v-clipboard:success="copyCode"
					v-clipboard:error="onError"
					>{{ scope.row.equitySn }}</el-button
				>
			</template>
		</yx-table>
		<!-- 权益卡 E -->
		<!-- 收货信息 -->
		<p class="consignee-info">
			<el-button @click="copyDeliverInfo" type="text">收货信息：</el-button>
			<span>联系人：</span>
			<el-button
				v-clipboard:copy="orderDetail.consignee || '无'"
				v-clipboard:success="copyCode"
				type="text"
				>{{ orderDetail.consignee }}</el-button
			>
			<span>电话：</span>
			<el-button
				v-if="!phoneShow"
				@click="showPhone(orderDetail)"
				type="text"
				title="点击查看完整电话号码"
				>{{ orderDetail.phoneMob }}</el-button
			>
			<el-button
				v-else
				v-clipboard:copy="orderDetail.phoneMob || '无'"
				v-clipboard:success="copyCode"
				type="text"
				>{{ orderDetail.phoneMob }}</el-button
			>，
			<span>所在区域：</span>
			<el-button
				v-clipboard:copy="assembleAreaName(orderDetail) + orderDetail.address"
				v-clipboard:success="copyCode"
				type="text"
				>{{ assembleAreaName(orderDetail) + '&nbsp;&nbsp;&nbsp;'
				}}{{ orderDetail.address }}</el-button
			>
		</p>
		<p>备注：{{ orderDetail.description }}</p>
		<!-- 打标签弹窗 S -->
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
			<div class="tagCheckbox-title">
				设置订单标签内容步骤：设置—>系统设置—>订单—>默认订单标签
			</div>
			<el-checkbox-group v-model="tagCheckboxList">
				<el-checkbox-button
					class="tagCheckbox-item"
					v-for="(item, index) in tagIdList"
					:key="index"
					:label="item.tagIdList"
					>{{ item.value }}</el-checkbox-button
				>
			</el-checkbox-group>
		</Dialog>
		<!-- 打标签弹窗 E -->
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
				label-width="120px"
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
		<!-- 订单补款弹窗 S -->
		<return-money-dialog
			:dialogVisible.sync="refundMoneyDialogVisible"
			:activeRow="activeSn"
			@fatherMethodInit="
				() => {
					$emit('update')
				}
			"
		></return-money-dialog>
		<!-- 订单补款弹窗 E -->
		<!-- 退款共用弹窗 S -->
		<refund-dialog
			:dialogVisible.sync="refundDialogVisible"
			:activeRow="activeRow"
			:isOrderDetails="true"
			@fatherMethodInit="
				() => {
					$emit('update')
				}
			"
		></refund-dialog>
		<!-- 退款共用弹窗 E -->
	</div>
</template>

<script>
import moment from 'moment'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import { getBigImg } from '@/utils/imageTool'
import { isNull } from '@/utils/helper/common'
import { getOrderConfiguration } from '@/api/systemConfiguration'
import {
	addOrderTagByOrderIdList,
	applyCancelOrderDeliver,
} from '@/api/business'
import { assembleAreaName } from '@/utils/helper/common'
import { turnOnAfterSalesEntrance } from '@/api/afterSales'
import { getEquityOrderByOrderId } from '@/api/equity'
import { auditOrder } from '@/api/yhtPlusCmsOrder'
import { findOrderPhoneById } from '@/api/showPhone'
// 补款公共组件
import ReturnMoneyDialog from '../../components/ReturnMoneyDialog'
// 退款公共组件
import RefundDialog from '../../components/RefundDialog'
import { checkPaymentResult } from '@/api/weeget-bullet-order-rest'
import {
	orderDeliverConfirmChecking,
	sOrderDeliverConfirm,
	oOrderDeliverConfirm,
} from '@/api/weiXinOrder'
import { existUnFinishAfterSales } from '@/api/brandRecord'
export default {
	props: {
		supplierList: {
			type: Object,
			default: () => ({}),
		},
		orderDetail: {
			type: Object,
			default: () => ({}),
		},
		afterSaleTurnOn: {
			type: Boolean,
			default: false,
		},
		goodsList: {
			type: Array,
			default: () => [],
		},
		orderGoodsList: {
			type: Array,
			default: () => [],
		},
		yxCouponList: {
			type: Array,
			default: () => [],
		},
		tagList: {
			type: Array,
			default: () => [],
		},
	},
	components: {
		YxTable,
		Dialog,
		RefundDialog,
		YxForm,
		ReturnMoneyDialog,
	},
	data() {
		return {
			activeSn: {},
			phoneShow: false,
			refundMoneyDialogVisible: false,
			equityOrderList: [], // 权益卡列表
			notSeIfBrandMap: {},
			tableColumns105: [
				{
					type: 'custom',
					dataIndex: 'copy',
					title: '权益卡订单号',
				},
				{
					type: 'string',
					title: '数量',
					customRender: () => {
						return 1
					},
				},
				{
					type: 'string',
					title: '订单金额',
					dataIndex: 'equityOrderAmount',
					customRender: ({ equityOrderAmount }) => {
						return equityOrderAmount ? `￥${equityOrderAmount}` : '-'
					},
				},
			],
			activeRow: {
				orderId: this.$route.params.orderId,
				deliverState: this.orderDetail.deliverState,
				orderState: this.orderDetail.orderState,
			},
			//退货退款弹框
			refundDialogVisible: false,
			// 订单补款弹窗 - 表单
			returnMoneyFormData: {
				orderSn: '',
				supplementType: '1',
				refundWay: '1',
				remarkType: '6',
				compensationAmount: '',
				refundDesc: '1',
				remark: '',
			},
			returnMoneyFormCfg: [
				{
					title: '订单号',
					type: 'text',
					dataIndex: 'orderSn',
				},
				{
					title: '补款方式',
					type: 'radio',
					dataIndex: 'supplementType',
					label: 'value',
					options: [
						{
							supplementType: '1',
							value: '到消费者微信零钱',
						},
					],
				},
				{
					title: '补款类型',
					type: 'radio',
					label: 'value',
					dataIndex: 'refundWay',
					options: [
						{
							refundWay: '1',
							value: '普通退款',
						},
						{
							refundWay: '2',
							value: '售后申诉退款',
						},
						{
							refundWay: '3',
							value: '二次申诉退款',
						},
					],
				},
				{
					title: '补款原因',
					type: 'select',
					label: 'value',
					dataIndex: 'remarkType',
					options: [
						{
							remarkType: '6',
							value: '缺货退款+补偿',
						},
						{
							remarkType: '7',
							value: '漏发少件补偿+退货/退款',
						},
						{
							remarkType: '8',
							value: '特殊处理',
						},
						{
							remarkType: '9',
							value: '退货运费',
						},
						{
							remarkType: '10',
							value: '质量问题',
						},
					],
				},
				{
					title: '用户补款金额',
					type: 'inputNumber',
					dataIndex: 'compensationAmount',
				},
				{
					title: '补款说明',
					type: 'radio',
					dataIndex: 'refundDesc',
					label: 'value',
					options: [
						{
							refundDesc: '1',
							value: '商家承担',
						},
						{
							refundDesc: '2',
							value: '平台承担',
						},
					],
				},
				// todo 补款里面的物流单号
				// {
				// 	title: '客户退货物流单号',
				// 	type: 'text',
				// 	dataIndex: 'addTime',
				// },
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			initAuditModalSuccessLoading: false,
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
						let platformPrice = 0
						const orderGoodsList = this.initAuditModalSuccessTableData.map(
							(item) => {
								let quantity = 0
								if (!isNull(item.refundQuantity)) {
									quantity = item.quantity - item.refundQuantity
								}
								if (!isNull(item.returnQuantity)) {
									quantity = item.quantity - item.returnQuantity
								}
								platformPrice += item.platformPrice * quantity
								return {
									orderGoodsId: item.orderGoodsId,
									goodsSpecId: item.goodsSpecId,
									platformPrice: item.platformPrice,
								}
							}
						)
						if (
							this.initAuditModalSuccessData.settlementAmount != platformPrice
						) {
							return this.$message.warning('商家支付金额与商家商品总金额不等')
						}
						const initAuditModalSuccessData = this.initAuditModalSuccessData
						const paramJson = {
							orderId: this.orderId,
							auditState: 1,
							remark: this.initAuditModalSuccessData.remark,
							sourceName: initAuditModalSuccessData.sourceName,
							platformExpressFee: initAuditModalSuccessData.platformExpressFee,
							platformOrderSn: initAuditModalSuccessData.platformOrderSn,
							settlementAmount: initAuditModalSuccessData.settlementAmount,
							orderGoodsList,
						}
						const {
							data: { resultMsg, resultData },
						} = await auditOrder(paramJson)
						if (resultData) {
							this.$message.success(resultMsg)
							this.$emit('update')
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
					autosize: {
						minRows: 5,
						maxRows: 9,
					},
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
							orderId: this.orderId,
							auditState: 2,
							remark: this.initAuditModalData.remark,
						})
						if (resultData) {
							this.$message.success(resultMsg)
							this.$emit('update')
							this.initAuditModalVisible = false
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
			// 退款单打标签弹窗
			tagIdList: [],
			tagCheckboxList: [],
			dialogTitle111: '订单快速打标签',
			dialogWidth111: '600px',
			dialogVisible111: false,
			orderId: this.$route.params.orderId,
			dialogBottomBtn111: [
				{
					title: '保存',
					type: 'primary',
					click: async () => {
						const params = {
							orderIdList: [this.orderId],
							tagIdList: this.tagCheckboxList,
						}
						const {
							data: { resultCode, resultMsg },
						} = await addOrderTagByOrderIdList(params)
						if (resultCode === 0) {
							this.$message.success(resultMsg)
							this.dialogVisible111 = false
							this.$emit('update')
						}
					},
				},
			],
			assembleAreaName,
			getBigImg,
			sourceType: this.$route.query.sourceType,
			moment,
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'copy',
					title: '复制货号',
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '数量',
					width: '60',
				},
				{
					type: 'custom',
					dataIndex: 'goodsSpecId',
					title: '商品',
					width: '300',
				},
				{
					type: 'string',
					dataIndex: 'specHtml',
					title: '规格',
				},
				{
					title: '销售价',
					type: 'string',
					dataIndex: 'unitPrice',
					customRender: ({ unitPrice }) => {
						if (!isNull(unitPrice)) {
							return '￥' + unitPrice.toFixed(2)
						} else {
							return ''
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'actPrice',
					title: '单价(活动价)',
					width: 100,
					customRender: ({ actPrice }) => {
						if (!isNull(actPrice)) {
							return '￥' + actPrice.toFixed(2)
						} else {
							return ''
						}
					},
				},
				{
					title: '实付价',
					type: 'string',
					dataIndex: 'price',
					customRender: ({ price }) => {
						if (!isNull(price)) {
							return '￥' + price.toFixed(2)
						} else {
							return ''
						}
					},
				},
				{
					title: '优惠金额',
					type: 'custom',
					dataIndex: 'allDiscountAmount',
				},
				{
					title: '小计',
					type: 'string',
					dataIndex: 'subPrice',
					customRender: (row) => {
						if (row.price && row.quantity) {
							return '￥' + this.floatMul(row.price, row.quantity).toFixed(2)
						} else {
							return ''
						}
					},
				},
				// {
				// 	title: '销售分数',
				// 	type: 'string',
				// 	dataIndex: 'saleScore',
				// },
				{
					title: '备注',
					type: 'string',
					dataIndex: 'remark',
				},
				{
					title: '已退',
					type: 'string',
					dataIndex: 'refundQuantity',
				},
				{
					title: '待退',
					type: 'string',
					dataIndex: 'returnQuantity',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					// fixed: 'right',
					actions: [
						{
							title: '出库',
							auth: '',
							dialogId: '',
							click: (row) => {
								this.toStock(row)
							},
						},
						{
							title: '申请取消发货',
							auth: 'applyCancelOrderDeliver',
							click: (row) => {
								this._applyCancelOrderDeliver(row)
							},
							customRender: (action) => {
								// 		1、订单所属商家为爱库存；
								// 2、订单的状态为“拣货中”或者“已发货（部分商品发货）”，且该商品未发货；
								let notShown = false
								if (
									((this.orderDetail.deliverSign == 1 &&
										this.orderDetail.deliverState == 1) || //待发货(拣货中)
										(this.orderDetail.deliverSign == 2 &&
											this.orderDetail.deliverState == 3)) && //已发货(部分商品发货)
									this.notSeIfBrandMap[
										this.orderDetail.supplierAccountNumberId
									] != undefined //是否爱库存
								) {
									notShown = true
								} else {
									notShown = false
								}
								action.hide = !notShown
								return action
							},
						},
					],
				},
			],
		}
	},
	watch: {
		tagList() {
			if (this.tagList.length) {
				this.tagCheckboxList = this.tagList.map((item) => {
					return item.organizationTagId
				})
			}
		},
		orderDetail() {
			this.activeRow = {
				orderId: this.$route.params.orderId,
				deliverState: this.orderDetail.deliverState,
				orderState: this.orderDetail.orderState,
			}
		},
	},
	computed: {
		// 退货退款按钮判断
		showRefundBtn() {
			let isShowRefundBtn = false
			if (this.supplierList.length > 0) {
				this.supplierList.map((item) => {
					this.notSeIfBrandMap[item] = item
				})
			}
			if (
				(this.orderDetail.receiveState == 3 ||
					this.orderDetail.receiveState == 4) &&
				(isNull(this.orderDetail.refundAmount) ||
					this.orderDetail.refundAmount < this.orderDetail.realAmount) &&
				this.orderDetail.orderState >= 8 &&
				!this.notSeIfBrandMap[this.orderDetail.supplierAccountNumberId]
			) {
				const timeDifference =
					new Date().valueOf() - this.orderDetail.confirmDeliverTime
				if (
					this.orderDetail.confirmDeliverTime == 0 ||
					timeDifference < 2592000000
				) {
					isShowRefundBtn = true
				}
			}
			return isShowRefundBtn
		},
		// 修改地址按钮判断
		showEditBtn() {
			return (
				this.orderDetail.orderState != 9 && this.orderDetail.deliverState < 3
			)
		},
		// 审核通过按钮判断
		showAuditPassBtn() {
			let showAudit = false
			if (
				(this.orderDetail.receiveState == 3 ||
					this.orderDetail.receiveState == 4) &&
				this.orderDetail.orderState < 8 &&
				!this.notSeIfBrandMap[this.orderDetail.supplierAccountNumberId]
			) {
				showAudit = true
			}
			return showAudit
		},
		// 售后退换按钮判断
		showAfterSale() {
			return (
				this.orderDetail.orderState == 8 &&
				this.orderDetail.deliverState < 2 &&
				(isNull(this.orderDetail.refundAmount) ||
					this.orderDetail.refundAmount < this.orderDetail.realAmount) &&
				this.orderDetail.receiveState < 6 &&
				this.sourceType != 2 &&
				this.orderDetail.deliverSign == 0
			)
		},
		// 补款按钮判断
		showReturnMoney() {
			return (
				(this.$store.state.user.userInfo.groupId == 2 ||
					this.$store.state.user.userInfo.groupId == 8) &&
				this.orderDetail.orderState != 1 &&
				(this.orderDetail.receiveState == 3 ||
					this.orderDetail.receiveState == 4)
			)
		},
		// 展示开启申请售后
		showAfterSaleTurnOn() {
			let isShowAfterSaleTurnOn = false
			if (this.afterSaleTurnOn) {
				const timeDifference =
					new Date().valueOf() - this.orderDetail.confirmDeliverTime
				if (
					this.orderDetail.confirmDeliverTime == 0 ||
					timeDifference < 2592000000
				) {
					isShowAfterSaleTurnOn = true
				}
			}
			return isShowAfterSaleTurnOn
		},
	},
	created() {
		this.initOrderTag()
		this._getEquityOrderByOrderId()
	},
	methods: {
		existUnFinishAfterSales: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await existUnFinishAfterSales({ orderId: this.orderId })
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
				}
			}
		},
		// 跳转商品详情
		skipGoodsDetails(row) {
			this.$router.push({
				path: `/goods/GoodsDetail/${row.goodsId}/${row.goodsSpecId}/${1}/${
					row.goodsSnapshotId
				}/${row.goodsSpecSnapshotId}`,
			})
		},
		async showPhone(rowData) {
			if (this.phoneShow) {
				return false
			}
			this.phoneShow = true
			let {
				data: { resultCode, resultData },
			} = await findOrderPhoneById({
				id: rowData.orderId,
			})

			if (resultCode == 0) {
				rowData.phoneMob = resultData

				this.phoneShow = true
			} else {
				this.phoneShow = false
			}
		},
		// 获取权益卡列表
		async _getEquityOrderByOrderId() {
			let {
				data: { resultCode, resultData },
			} = await getEquityOrderByOrderId({
				orderId: this.orderId,
			})
			if (resultCode == 0) {
				let equityOrderList = resultData.equityOrderList || []
				this.equityOrderList = equityOrderList
			}
		},
		toStock(row) {
			this.$router.push({
				path: '/goods/newStockOperationOperation',
				query: {
					goodsSpecId: row.goodsSpecId,
					brandId: row.brandId,
					brandName: encodeURIComponent(this.orderDetail.brandName),
					goodsNumber: encodeURIComponent(row.goodsNumber),
					goodsName: encodeURIComponent(row.goodsName),
				},
			})
		},
		// 跳转到修改地址
		toOrderEdit() {
			this.$router.push({
				path: `/business/orderEdit/${this.orderId}`,
			})
		},
		// 乘
		floatMul(arg1, arg2) {
			let m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString()
			try {
				m += s1.split('.')[1].length
				// eslint-disable-next-line no-empty
			} catch (e) {}
			try {
				m += s2.split('.')[1].length
				// eslint-disable-next-line no-empty
			} catch (e) {}
			return (
				(Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
				Math.pow(10, m)
			)
		},
		// 补款
		showReturnMoneyDialog() {
			this.activeSn = {
				orderSn: this.orderDetail.orderSn,
				orderId: this.orderDetail.orderId,
			}
			this.refundMoneyDialogVisible = true
		},
		// 审核通过
		showAuditModalSuccess() {
			this.initAuditModalSuccessData.orderSn = this.orderDetail.orderSn
			this.initAuditModalSuccessVisible = true
			this.initAuditModalSuccessLoading = true
			let refundQuantity = 0
			let goodsList = JSON.parse(JSON.stringify(this.goodsList))
			// goodsList = goodsList.slice(0, goodsList.length - 1)
			goodsList.map((item) => {
				if (item.stockOutQuantity) {
					refundQuantity =
						refundQuantity + Number(this.orderDetail.stockOutQuantity)
				}
				if (item.refundQuantity) {
					refundQuantity =
						refundQuantity + Number(this.orderDetail.refundQuantity)
				}
				item.refundQuantity = refundQuantity
			})
			this.initAuditModalSuccessTableData = goodsList
			this.initAuditModalSuccessLoading = false
		},
		// 审核不通过
		showAuditModalVisible() {
			this.initAuditModalData.orderSn = this.orderDetail.orderSn
			this.initAuditModalVisible = true
		},
		// 查询收款
		async _checkPaymentResult() {
			const {
				data: { resultMsg, resultCode },
			} = await checkPaymentResult({
				groupId: this.$store.state.user.userInfo.groupId,
				orderIdList: [this.orderId],
			})
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.$emit('update')
			}
		},
		//申请取消发货
		async _applyCancelOrderDeliver(row) {
			this.$confirm(
				'申请成功后，可以去上游取消发货列表查询审核状态',
				'确认申请取消该商品的发货？',
				{
					type: 'success',
					callback: async (action) => {
						if (action === 'confirm') {
							const {
								data: { resultCode },
							} = await applyCancelOrderDeliver({
								orderId: this.orderId,
								orderGoodsId: row.orderGoodsId,
								approveType: 1,
								thirdPartyType: 1,
								orderSn: this.orderDetail.orderSn,
							})
							if (resultCode === 0) {
								this.$message.success('成功')
								this.$emit('update')
							}
						}
					},
				}
			)
		},
		// 开售售后入口
		async _turnOnAfterSalesEntrance() {
			// 若该订单属于AKC的订单，且订单最晚发货时间距当前时间超过21天
			let afterPop = false
			let currentTime = Date.parse(new Date())
			if (
				currentTime > this.orderDetail.lastDeliverTimeEnd + 1814400000 &&
				this.notSeIfBrandMap[this.orderDetail.supplierAccountNumberId]
			) {
				afterPop = true
			}
			console.log(
				'时间和商家',
				currentTime,
				this.orderDetail.lastDeliverTimeEnd + 1814400000,
				this.orderDetail.platformOrderSn
			)
			this.$confirm(
				afterPop
					? '该订单上游已不允许进行售后，是否确认开启？'
					: '该订单将重新开启申请售后按钮，有效期为24小时，确定开启？',
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							const {
								data: { resultCode, resultMsg },
							} = await turnOnAfterSalesEntrance({
								orderId: this.orderId,
								orderSn: this.orderDetail.orderSn,
							})
							if (resultCode === 0) {
								this.$message.success(resultMsg)
								this.$emit('update')
							}
						}
					},
				}
			)
		},
		// 确认收货
		_sOrderDeliverConfirm() {
			this.$confirm(
				'确认收货后订单将扭转为已完成，是否确认代替客户确认收货？',
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							const {
								data: { resultCode, resultMsg: resultMsg1 },
							} = await sOrderDeliverConfirm({
								orderId: this.orderId,
								confirmType: 3,
							})
							if (resultCode === 0) {
								this.$message.success(resultMsg1)
								this.$emit('update')
							}
						}
					},
				}
			)
		},
		async newConfirm() {},
		async oldConfirm() {
			const {
				data: { resultMsg },
			} = await orderDeliverConfirmChecking({
				orderSn: this.orderDetail.orderSn,
			})
			if (resultMsg != '成功')
				return this.$message.warning('有处理中售后单，不可确认收货')
			this.$confirm(
				'确认收货后订单将扭转为已完成，是否确认代替客户确认收货？',
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							const {
								data: { resultCode, resultMsg: resultMsg1 },
							} = await oOrderDeliverConfirm({
								orderId: this.orderId,
							})
							if (resultCode === 0) {
								this.$message.success(resultMsg1)
								this.$emit('update')
							}
						}
					},
				}
			)
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
				this.tagIdList = targetArr
			}
		},
		// 合并表格
		spanMethod({ row, rowIndex }) {
			if (row.isCoupon) {
				return [1, this.tableColumns102.length - 1]
			} else if (rowIndex == this.orderGoodsList.length - 1) {
				return [1, this.tableColumns102.length - 1]
			}
		},
		// 复制地址
		copyDeliverInfo() {
			let clipboardText = ''
			// AKC
			if (this.sourceType == 1) {
				clipboardText = `${assembleAreaName(this.orderDetail)}${
					this.orderDetail.address
				}，${this.orderDetail.consignee}，${this.orderDetail.phoneMob}`
			} else {
				// HYK
				clipboardText = `${this.orderDetail.consignee}，${
					this.orderDetail.phoneMob
				}，${assembleAreaName(this.orderDetail)}${this.orderDetail.address}`
			}
			this.$copyText(clipboardText).then(() => {
				this.$message.success('复制成功')
			})
		},
		// 获取审核状态
		getStateStringByCode(code) {
			let codeString = ''
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
		copyCode() {
			this.$message.success('复制成功')
		},
		// 优惠金额展示
		showDiscount(row) {
			this.$alert(
				`<div><strong>商家承担</strong>：￥ ${row.supplierDiscountAmount.toFixed(
					2
				)}</div>
				<div><strong>平台承担</strong>：￥ ${row.platformDiscountAmount.toFixed(
					2
				)}</div>
				<div><strong>店主承担</strong>：￥ ${row.organizationDiscountAmount.toFixed(
					2
				)}</div>
				<div><strong>平台额外</strong>：￥ ${row.platformOrgRevenueAmount.toFixed(
					2
				)}</div>`,
				'优惠信息',
				{
					dangerouslyUseHTMLString: true,
					callback: () => {},
				}
			)
		},
	},
}
</script>
<style>
.el-table {
	overflow-y: auto !important;
}
</style>
<style lang="scss" scoped>
.order-info {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	p {
		margin: 0;
		margin-right: 20px;
	}
}
.withoutReason {
	border: 2px solid red;
	border-radius: 13px;
	margin: 0 20px !important;
}
.goods-info {
	display: flex;
	align-items: center;
	.wg_image_item {
		width: 60px;
		height: 60px;
	}
	.goods-info-r {
		flex: 1;
		padding-left: 10px;
		text-align: left;
	}
}
.goods-table {
	margin-top: 20px;
}
.consignee-info {
	span {
		margin: 0 5px;
	}
}
.couponName {
	text-align: right;
	color: red;
}
.tfoot {
	text-align: right;
	div {
		margin: 0;
		span:nth-of-type(2) {
			display: inline-block;
			color: red;
		}
	}
}
.tagCheckbox-title {
	margin-bottom: 20px;
}
.tagCheckbox-item {
	margin-right: 10px;
	border-left: 1px solid #dcdfe6;
}
.tagName-item {
	margin-right: 10px;
}
.goods_name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
}
.active {
	color: #4498e0;
	cursor: pointer;
	line-height: 15px;
}
</style>
