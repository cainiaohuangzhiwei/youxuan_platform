<template>
	<div>
		<!-- 订单信息 -->
		<yx-info :column="4" :data="orderDetail" :items="afterSalesItems">
			<template slot="organizationName">
				<div class="info-item">
					<span>店主：</span>
					<el-button type="text">
						<router-link
							:to="`/shop/shop/shopDetail/${orderDetail.childOrganizationId}`"
							>{{ orderDetail.organizationName }}</router-link
						>
					</el-button>
				</div>
			</template>
			<template slot="orderSn">
				<div class="info-item">
					<span>单号：</span>
					<el-button
						v-clipboard:copy="orderDetail.orderSn"
						v-clipboard:success="copyCode"
						type="text"
						>{{ orderDetail.orderSn }}</el-button
					>
				</div>
			</template>
			<template slot="receiveState">
				<div class="info-item">
					【{{ orderDetail.receiveState | receiveState }}】
				</div>
			</template>
		</yx-info>
		<p class="order-info2">
			<span class="order-amount"
				>订单金额：￥{{ orderDetail.realAmount | orderAmount }}</span
			>
			<span class="order-amount"
				>已支付：￥{{ orderDetail.paidAmount | orderAmount }}</span
			>
			<span class="order-amount"
				>未支付：￥{{ orderDetail.unpaidAmount | orderAmount }}</span
			>
		</p>
		<!-- 收款记录 -->
		<el-timeline class="timeline-box">
			<el-timeline-item
				v-for="(orderPaymen, index) in orderPaymentList"
				:key="index"
			>
				<template slot="dot">
					<svg-icon className="item-icon" iconClass="amount2"></svg-icon>
				</template>
				<p>
					<span class="paymen-span"
						>添加时间：
						{{
							(orderPaymen.addTime &&
								moment(orderPaymen.addTime).format('YYYY-MM-DD HH:mm:ss')) ||
							'无'
						}}</span
					>
					<span class="paymen-span"
						>付款时间：
						{{
							(orderPaymen.paymentTime &&
								moment(orderPaymen.paymentTime).format(
									'YYYY-MM-DD HH:mm:ss'
								)) ||
							'无'
						}}</span
					>
				</p>
				<div class="frame-cell">
					<p>
						<span class="frame-cell-span">收款单号：</span>
						<el-button
							v-clipboard:copy="orderPaymen.paymentSn"
							v-clipboard:success="copyCode"
							type="text"
							>{{ orderPaymen.paymentSn }}</el-button
						>
					</p>
					<p>
						<span class="frame-cell-span">金额：</span>￥{{
							orderPaymen.paymentAmount | orderAmount
						}}
					</p>
					<p v-if="orderPaymen.paymentState != 3">
						<span class="frame-cell-span">支付流水号：</span
						>{{ orderPaymen.bankSn || '无' }}
					</p>
					<p>
						<span class="frame-cell-span">收款类型：</span
						>{{ getReceiptTypeByState(orderPaymen.receiptType) }}
					</p>
					<p>
						<span class="frame-cell-span">支付平台：</span
						>{{ getPayTypeByCode(orderPaymen.paymentType) }}
					</p>
				</div>
			</el-timeline-item>
			<el-timeline-item>
				<template slot="dot">
					<span></span>
				</template>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import moment from 'moment'
import { getOrderPaymentListByOrderId } from '@/api/yhtPlusCmsOrder'
import SvgIcon from '@/layout/components/SvgIcon' // svg component
export default {
	components: {
		YxInfo,
		SvgIcon,
	},
	props: {
		orderAfterSalesVo: {
			type: Object,
			default: () => ({}),
		},
		orderDetail: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			moment,
			orderId: this.$route.params.orderId,
			orderPaymentList: [],
			afterSalesItems: [
				{
					type: 'custom',
					dataIndex: 'organizationName',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
				},
				{
					type: 'custom',
					dataIndex: 'receiveState',
				},
				{
					type: 'string',
					title: '下单时间',
					dataIndex: 'refundTime',
					customRender: () => {
						return this.orderDetail.addTime
							? moment(this.orderDetail.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
		}
	},
	filters: {
		orderAmount(amount) {
			if (amount) {
				return amount.toFixed(2)
			} else {
				return '0.00'
			}
		},
		receiveState(code) {
			let codeString = ''
			if (code == 1) {
				codeString = '待付款'
			} else if (code == 2) {
				codeString = '付款中'
			} else if (code == 3) {
				codeString = '已付款'
			} else if (code == 4) {
				codeString = '收超款'
			} else if (code == 5) {
				codeString = '已退款'
			} else if (code == 6) {
				codeString = '欠款中'
			} else {
				codeString = '其他'
			}
			return codeString
		},
	},

	methods: {
		copyCode() {
			this.$message.success('复制成功')
		},
		// 支付平台
		getPayTypeByCode(code) {
			let codeString = ''
			if (code == 1) {
				codeString = '现金支付'
			} else if (code == 2) {
				codeString = '汇款'
			} else if (code == 3) {
				codeString = '支付宝'
			} else if (code == 4) {
				codeString = '微信支付'
			} else if (code == 5) {
				codeString = '刷卡支付(储蓄卡)'
			} else if (code == 6) {
				codeString = '刷卡支付(信用卡)'
			} else if (code == 7) {
				codeString = '余额支付'
			} else if (code == 8) {
				codeString = 'pos机收款'
			} else if (code == 9) {
				codeString = '汇聚支付'
			} else if (code == 10) {
				codeString = '易宝支付'
			} else if (code == 11) {
				codeString = '银联支付'
			} else if (code == 20) {
				codeString = '支付中心-微信收付通'
			} else if (code == 21) {
				codeString = '支付中心-汇聚支付'
			} else {
				codeString = '其他支付'
			}
			return codeString
		},
		// 收款类型
		getReceiptTypeByState(type) {
			let typeString = ''
			if (type == 1) {
				typeString = '按订单收款'
			} else if (type == 2) {
				typeString = '无订单收款'
			} else if (type == 3) {
				typeString = '冲账（余额）'
			} else if (type == 4) {
				typeString = '上游退款'
			} else if (type == 5) {
				typeString = '运费保障卡'
			} else {
				typeString = '其他'
			}
			return typeString
		},
		async init() {
			let {
				data: { resultCode, resultData },
			} = await getOrderPaymentListByOrderId({
				orderId: this.orderId,
				startIndex: 0,
				length: 5,
			})
			if (resultCode == 0) {
				this.orderPaymentList = resultData.orderPaymentList || []
				console.log(resultData)
			}
		},
	},
}
</script>

<style scoped>
.timeline-box {
	padding: 10px 20px;
}
.item-icon {
	width: 40px;
	height: 40px;
	margin-left: -16px;
	margin-top: -16px;
}
.order-info2 {
	margin-top: 10px;
	padding: 10px 20px;
	background: #f5f5f5;
}
.order-amount {
	font-weight: bold;
	margin-right: 50px;
}
.paymen-span {
	margin-right: 30px;
}
.frame-cell {
	border: 2px solid #e0e0e0;
	padding: 10px;
	position: relative;
}
.frame-cell::before {
	content: '';
	display: block;
	border-width: 10px;
	position: absolute;
	top: -20px;
	left: 20px;
	border-style: solid dashed dashed;
	border-color: transparent transparent #e0e0e0 transparent;
	font-size: 0;
	line-height: 0;
}
.frame-cell::after {
	display: block;
	content: '';
	border-width: 10px;
	position: absolute;
	top: -18px;
	left: 20px;
	border-style: solid dashed dashed;
	border-color: transparent transparent white transparent;
	font-size: 0;
	line-height: 0;
}
.frame-cell-span {
	width: 100px;
	text-align: right;
	display: inline-block;
	margin-right: 20px;
}
.info-item {
	padding: 6px 0;
}
</style>
