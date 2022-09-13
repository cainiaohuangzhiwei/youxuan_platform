<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="订单详情" name="orderDetailsTab">
				<span slot="label">订单详情 </span>
				<orderDetails-tab
					:orderDetail="orderDetail"
					:goodsType="goodsType"
					:afterSaleTurnOn="orderDetailInfo.afterSaleTurnOn"
					:orderGoodsList="orderDetailInfo.orderGoodsList"
					:yxCouponList="orderDetailInfo.yxCouponList"
					:goodsList="goodsList"
					:supplierList="supplierList"
					:tagList="orderDetailInfo.tagList"
					@update="_getOrderDetailByOrderId"
					ref="orderDetailsTab"
				></orderDetails-tab>
			</el-tab-pane>
			<el-tab-pane label="发货记录" name="shipmentRecordTab">
				<span slot="label">发货记录 </span>
				<shipmentRecord-tab
					:orderAfterSalesVo="orderAfterSalesVo"
					:orderDetail="orderDetail"
					:goodsType="goodsType"
					ref="shipmentRecordTab"
				></shipmentRecord-tab
			></el-tab-pane>
			<el-tab-pane label="收款记录" name="receiptsRecordTab">
				<span slot="label">收款记录 </span>
				<receiptsRecord-tab
					:orderDetail="orderDetail"
					:orderAfterSalesVo="orderAfterSalesVo"
					ref="receiptsRecordTab"
				></receiptsRecord-tab>
			</el-tab-pane>
			<el-tab-pane label="退款记录" name="refundRecordTab">
				<span slot="label">退款记录 </span>
				<refundRecord-tab
					:orderAfterSalesVo="orderAfterSalesVo"
					:goodsType="goodsType"
					:orderDetail="orderDetail"
					ref="refundRecordTab"
					@update="_getOrderDetailByOrderId"
				></refundRecord-tab>
			</el-tab-pane>
			<el-tab-pane label="补款记录" name="supplementRecordTab">
				<span slot="label">补款记录 </span>
				<supplementRecord-tab
					:orderAfterSalesVo="orderAfterSalesVo"
					ref="supplementRecordTab"
					:goodsType="goodsType"
					:orderDetail="orderDetail"
					@update="_getOrderDetailByOrderId"
				></supplementRecord-tab>
			</el-tab-pane>
			<el-tab-pane label="售后记录" name="afterSaleRecordTab">
				<span slot="label">售后记录 </span>
				<afterSaleRecord-tab
					:orderAfterSalesVo="orderAfterSalesVo"
					ref="afterSaleRecordTab"
				></afterSaleRecord-tab>
			</el-tab-pane>
			<el-tab-pane label="修改记录" name="amendantRecordTab">
				<span slot="label">修改记录 </span>
				<amendantRecord-tab ref="amendantRecordTab"></amendantRecord-tab>
			</el-tab-pane>
			<el-tab-pane label="工单信息" name="ticketTab">
				<span slot="label">工单信息 </span>
				<ticket-tab ref="ticketTab"></ticket-tab>
			</el-tab-pane>
			<el-tab-pane
				v-if="isAKC"
				label="上游补偿信息"
				name="compensationInformationTab"
			>
				<compensation-information-tab
					ref="compensationInformationTab"
				></compensation-information-tab>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import orderDetailsTab from './components/orderDetailsTab'
import shipmentRecordTab from './components/shipmentRecordTab'
import receiptsRecordTab from './components/receiptsRecordTab'
import refundRecordTab from './components/refundRecordTab'
import supplementRecordTab from './components/supplementRecordTab'
import afterSaleRecordTab from './components/afterSaleRecordTab'
import amendantRecordTab from './components/amendantRecordTab'
import ticketTab from './components/ticketTab'
import compensationInformationTab from './components/compensationInformationTab'
import { setViewTitle, isNull } from '@/utils/helper/common'
import { getOrderDetailByOrderId } from '@/api/yhtPlusCmsOrder'
import { findOrderAfterSales } from '@/api/afterSales'
import { getGoodsConfiguration } from '@/api/systemConfiguration'
import { queryNotSelfBrandSupplierAccountIds } from '@/api/brandRecord'

export default {
	name: 'OrderDetails',
	components: {
		BasicContainer,
		orderDetailsTab,
		shipmentRecordTab,
		receiptsRecordTab,
		refundRecordTab,
		supplementRecordTab,
		afterSaleRecordTab,
		amendantRecordTab,
		ticketTab,
		compensationInformationTab,
	},
	data() {
		return {
			params: this.$route.params,
			query: this.$route.query,
			activeName: 'orderDetailsTab',
			orderId: this.$route.params.orderId,
			orderDetailInfo: {},
			orderDetail: {},
			orderAfterSalesVo: {},
			goodsType: {},
			goodsList: [],
			supplierList: [],
			isAKC: false,
		}
	},
	async created() {
		setViewTitle(this.$store, this.$route, this.params.orderId)
		await this._getGoodsConfiguration()
		await this.queryNotSelfBrandSupplierAccountIds()
		this._getOrderDetailByOrderId()
		this._findOrderAfterSales()
	},
	methods: {
		queryNotSelfBrandSupplierAccountIds: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await queryNotSelfBrandSupplierAccountIds({})
			if (resultCode == 0) {
				if (resultData.length > 0) {
					this.supplierList = resultData
				}
			}
		},
		// 获取配置项
		async _getGoodsConfiguration() {
			let {
				data: { resultCode, resultData },
			} = await getGoodsConfiguration()
			if (resultCode == 0) {
				this.goodsType = resultData.goodsType
			}
		},
		// 获取售后记录
		async _findOrderAfterSales() {
			let {
				data: { resultCode, resultData },
			} = await findOrderAfterSales({
				orderId: this.orderId,
			})
			if (resultCode == 0) {
				let afterSaleList =
					(resultData.orderAfterSalesVo &&
						resultData.orderAfterSalesVo.afterSalesSns &&
						resultData.orderAfterSalesVo.afterSalesSns.split(',')) ||
					[]
				if (afterSaleList.length) {
					resultData.orderAfterSalesVo.afterSaleList = []
					afterSaleList.map((item) => {
						resultData.orderAfterSalesVo.afterSaleList.push({
							afterSalesId: item.split('-')[1],
							afterSalesSn: item.split('-')[0],
						})
					})
					this.orderAfterSalesVo = resultData.orderAfterSalesVo || {}
				}
			}
		},
		// 获取订单详情
		async _getOrderDetailByOrderId() {
			let {
				data: { resultCode, resultData },
			} = await getOrderDetailByOrderId({
				orderId: this.params.orderId,
			})
			if (resultCode == 0) {
				this.orderDetail = resultData.orderDetail
				let flag = this.supplierList.some(
					(item) => item === resultData.orderDetail.supplierAccountNumberId
				)
				this.isAKC = flag
				this.goodsList = resultData.orderGoodsList
				let allowanceAmount =
					(resultData.allowance && resultData.allowance.allowanceAmount) ||
					false
				let tfoot = {
					totalQuantity: 0,
					allowanceDetail:
						(allowanceAmount &&
							`${
								resultData.allowance.allowanceName
							}（优惠${resultData.allowance.allowanceAmount.toFixed(2)}元）`) ||
						false,
					realAmount: resultData.orderDetail.realAmount.toFixed(2),
					orderAmount: resultData.orderDetail.orderAmount.toFixed(2),
					expressFee: resultData.orderDetail.expressFee.toFixed(2),
					groupBuyingDiscountAmount: resultData.orderDetail
						.groupBuyingDiscountAmount
						? resultData.orderDetail.groupBuyingDiscountAmount.toFixed(2)
						: 0,
					morePromotion:
						(!isNull(resultData.morePromotion) &&
							resultData.morePromotion > 0 &&
							`￥${resultData.morePromotion.toFixed(2)}`) ||
						false,
					discountType: false,
				}
				//满减/满折
				if (!isNull(resultData.orderDetail.discountType)) {
					let discountRules = resultData.orderDetail.discountRule.split(':')
					let discountText = ''
					if (resultData.orderDetail.discountType == 1) {
						discountText =
							'满' + discountRules[0] + '元减' + discountRules[1] + '元'
					} else if (resultData.orderDetail.discountType == 2) {
						discountText =
							'满' + discountRules[0] + '件减' + discountRules[1] + '元'
					} else if (resultData.orderDetail.discountType == 3) {
						discountText =
							'满' + discountRules[0] + '元打' + discountRules[1] + '折'
					} else if (resultData.orderDetail.discountType == 4) {
						discountText =
							'满' + discountRules[0] + '件打' + discountRules[1] + '折'
					} else {
						discountText = '无'
					}
					tfoot.discountType = `-￥${(
						resultData.orderDetail.discount - allowanceAmount
					).toFixed(2)}(${discountText})`
				}
				resultData.orderGoodsList.map((item) => {
					tfoot.totalQuantity += item.quantity
					let specHtml = ''
					if (item.specOne && this.goodsType.specOne) {
						specHtml += this.goodsType.specOne + '：' + item.specOne + ' '
					}
					if (item.specTwo && this.goodsType.specTwo) {
						specHtml += this.goodsType.specTwo + '：' + item.specTwo
					}
					item.specHtml = specHtml
				})
				// if (resultData.yxCouponList.length > 0) {
				// 	let CouponDetails = ''
				// 	for (let i = 0; i < resultData.yxCouponList.length; i++) {
				// 		let couponTypeExt = null //优惠券明细
				// 		if (resultData.yxCouponList[i].typeExt == 1) {
				// 			couponTypeExt =
				// 				'代金券' + resultData.yxCouponList[i].amount + '元'
				// 		} else if (resultData.yxCouponList[i].typeExt == 2) {
				// 			couponTypeExt =
				// 				'折扣券' +
				// 				this.floatMul(resultData.yxCouponList[i].amount, 10) +
				// 				'折'
				// 		} else if (resultData.yxCouponList[i].typeExt == 3) {
				// 			couponTypeExt = '免邮券'
				// 		}
				// 		CouponDetails +=
				// 			resultData.yxCouponList[i].couponName +
				// 			'(' +
				// 			couponTypeExt +
				// 			')；'
				// 	}
				// 	let orderGoodsList = []
				// 	resultData.orderGoodsList.map((item) => {
				// 		orderGoodsList.push(item)
				// 		if (item.couponName) {
				// 			orderGoodsList.push({
				// 				couponName: item.couponName,
				// 				isCoupon: true,
				// 			})
				// 		}
				// 	})
				// 	resultData.orderGoodsList = orderGoodsList
				// }
				let orderGoodsList = []
				resultData.orderGoodsList.map((item) => {
					orderGoodsList.push(item)
					if (item.couponName) {
						orderGoodsList.push({
							couponName: item.couponName,
							isCoupon: true,
						})
					} else if (item.couponNameList) {
						let couponName = item.couponNameList.join(',')
						orderGoodsList.push({
							couponName: couponName,
							isCoupon: true,
						})
					}
				})
				resultData.orderGoodsList = orderGoodsList
				resultData.orderGoodsList.push(tfoot)
				resultData.tagList = resultData.tagList || []
				this.orderDetailInfo = resultData
			}
		},
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
		handleClick({ name }) {
			if (this.$refs[name].init) {
				this.$refs[name].init(true)
			}
		},
	},
}
</script>
