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
		</yx-info>
		<!-- 退款信息 -->
		<template v-for="(item, index) in refundList">
			<div :key="index">
				<yx-info :column="3" :data="item" :items="refundItems1">
					<template slot="addTime">
						<div class="info-item">
							<span>添加时间：</span>
							<span>
								{{
									item.addTime
										? moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')
										: '无'
								}}
							</span>
						</div>
					</template>
					<template slot="refundTime">
						<div class="info-item">
							<span>退款时间：</span>
							<span>
								{{
									item.refundTime
										? moment(item.refundTime).format('YYYY-MM-DD HH:mm:ss')
										: '无'
								}}
							</span>
						</div>
					</template>
				</yx-info>
				<div class="border-box">
					<div class="compensation-box">
						<div class="refund-info">
							<yx-info :column="2" :data="item" :items="refundItems2">
								<template slot="addTime">
									<div class="info-item">
										<span>添加时间：</span>
										<span>
											{{
												item.addTime
													? moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')
													: '无'
											}}
										</span>
									</div>
								</template>
								<template slot="refundTime">
									<div class="info-item">
										<span>退款时间：</span>
										<span>
											{{
												item.refundTime
													? moment(item.refundTime).format(
															'YYYY-MM-DD HH:mm:ss'
													  )
													: '无'
											}}
										</span>
									</div>
								</template>
							</yx-info>
						</div>
						<el-button
							type="text"
							v-if="refundOperate(item)"
							@click="_queryWechatRefundByRefundSn(item)"
							>退款查询</el-button
						>
					</div>
					<b class="goods-info-title">商品信息</b>
					<yx-table
						class="goods-info-table"
						:select="false"
						:columns="tableColumns108"
						:data="item.orderGoodsList"
					>
						<template slot="goodsInfo" slot-scope="scope">
							<div class="goodsInfo">
								<el-image
									class="c_image"
									fit="cover"
									:src="getBigImg(scope.row.goodsDefaultImage)"
									:preview-src-list="[getBigImg(scope.row.goodsDefaultImage)]"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<div class="goods-name">
									<p>货号：{{ scope.row.goodsNumber }}</p>
									<p v-html="scope.row.goodsName"></p>
								</div>
							</div>
						</template>
						<template slot="skuInfo" slot-scope="scope">
							<div>
								<p v-if="scope.row.specOne && goodsType.specOne">
									{{ goodsType.specOne }}：{{ scope.row.specOne }}
								</p>
								<p v-if="scope.row.specTwo && goodsType.specTwo">
									{{ goodsType.specTwo }}：{{ scope.row.specTwo }}
								</p>
							</div>
						</template>
					</yx-table>
					<p class="item-p">退款类型：</p>
					<p class="item-p">
						退款说明：{{
							item.refundState == 5
								? ''
								: item.refundDesc == 1
								? '商家承担'
								: '平台承担'
						}}
					</p>
					<p
						class="item-p"
						v-if="item.refundPlatform != 1 || item.refundState == 5"
					>
						原因：{{ item.refundState == 5 ? '' : getRemarkTypeText(item) }}
					</p>
					<p class="item-p">
						备注：{{ item.refundState == 5 ? item.refundRemark : item.remark }}
					</p>
					<p class="item-p item-p-r">总计：{{ item.totalRefundQuantity }}件</p>
					<p class="item-p item-p-r">
						邮费退款：￥{{ numberFormat(item.expressFee, 2) }}
					</p>
					<p class="item-p item-p-r">
						退款总金额：￥{{ numberFormat(item.refundAmount, 2) }}
					</p>
					<p class="item-p item-p-r" v-if="item.balanceAmount">
						退款余额：￥{{ numberFormat(item.balanceAmount, 2) }}
					</p>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'
import {
	getOrderRefundListByOrderId,
	queryWechatRefundByRefundSn,
} from '@/api/yhtPlusCmsOrder'
import { checkRefundResult } from '@/api/weeget-bullet-order-rest'
import { numberFormat } from '@/utils/helper/common'
export default {
	components: {
		YxInfo,
		YxTable,
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
		goodsType: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			getBigImg,
			numberFormat,
			tableColumns108: [
				{
					type: 'custom',
					title: '商品',
					dataIndex: 'goodsInfo',
				},
				{
					type: 'custom',
					title: '规格',
					dataIndex: 'skuInfo',
				},
				{
					type: 'string',
					title: '数量',
					dataIndex: 'quantity',
				},
				{
					type: 'string',
					title: '单价',
					dataIndex: 'unitPrice',
					customRender: ({ price, unitPrice }) => {
						return !unitPrice
							? `￥${price.toFixed(2)}`
							: `￥${unitPrice.toFixed(2)}`
					},
				},
				{
					type: 'amount',
					title: '优惠价',
					dataIndex: 'price',
				},
				{
					type: 'string',
					title: '小计',
					dataIndex: 'description',
					customRender: ({ price, quantity }) => {
						return '￥' + this.floatMul(price, quantity).toFixed(2)
					},
				},
			],
			tableData108: [],
			compensationList: [],
			refundList: [],
			moment,
			orderId: this.$route.params.orderId,
			refundItems2: [
				{
					type: 'string',
					title: '类型',
					dataIndex: 'type',
					customRender: (row) => {
						return this.refundPlatform(row)
					},
				},
				{
					type: 'string',
					title: '流水号',
					dataIndex: 'responsePaymentNo',
					customRender: ({ responsePaymentNo = '-' }) => {
						return responsePaymentNo
					},
				},
				{
					type: 'string',
					title: '退款状态',
					dataIndex: 'refundState',
					customRender: (row) => {
						return this.getStateByCode(row)
					},
				},
				{
					type: 'string',
					title: '退货状态',
					dataIndex: 'returnStatus',
					customRender: (row) => {
						return this.getStatusByCode(row)
					},
				},
			],
			refundItems1: [
				{
					type: 'string',
					title: '退款记录单号',
					dataIndex: 'refundSn',
				},
				{
					type: 'custom',
					dataIndex: 'addTime',
				},
				{
					type: 'custom',
					dataIndex: 'refundTime',
				},
			],
			compensationItems: [
				{
					type: 'custom',
					dataIndex: 'remarkType',
				},
				{
					type: 'string',
					title: '赔付金额',
					dataIndex: 'compensationAmount',
				},
				{
					type: 'string',
					title: '赔付单号',
					dataIndex: 'compensationSn',
				},
				{
					type: 'custom',
					dataIndex: 'addTime',
				},
			],
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
					type: 'string',
					title: '下单时间',
					dataIndex: 'refundTime',
					customRender: () => {
						return this.orderDetail.addTime
							? moment(this.orderDetail.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					title: '下单人',
					dataIndex: 'weixinUserName',
				},
			],
		}
	},

	methods: {
		// 判断退款查询按钮
		refundOperate(item) {
			let flag1 =
				item.refundState != 4 &&
				item.refundMode == 5 &&
				item.supplementType != 2
			let flag2 =
				item.refundState != 1 &&
				item.refundState != 4 &&
				item.balanceAmount != item.refundAmount &&
				item.refundMode == 4
			if (flag1 || flag2) {
				return true
			} else {
				return false
			}
		},
		copyCode() {
			this.$message.success('复制成功')
		},
		// 退款查询
		_queryWechatRefundByRefundSn(item) {
			if (
				item.refundState != 4 &&
				item.refundMode == 5 &&
				item.supplementType != 2
			) {
				this.$confirm('查询微信退款是否成功', '退款查询', {
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultCode, resultMsg },
							} = await queryWechatRefundByRefundSn({
								refundNo: item.refundSn,
							})
							if (resultCode == 0) {
								this.$message.success(resultMsg)
								this.init()
								this.$emit('update')
							}
						}
					},
				})
			} else {
				this.$confirm('查询退款是否成功', '退款查询', {
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg, resultCode },
							} = await checkRefundResult({
								refundSn: item.refundSn,
								orderId: item.orderId,
								groupId: this.$store.state.user.userInfo.groupId,
							})
							if (resultCode == 0) {
								this.$message.success(resultMsg)
								this.init()
								this.$emit('update')
							}
						}
					},
				})
			}
		},
		// 获取退款类型
		getRemarkTypeText({ remarkType }) {
			let remarkTypeText = ''
			if (remarkType == 1) {
				remarkTypeText = '质量问题'
			} else if (remarkType == 2) {
				remarkTypeText = '缺货退款'
			} else if (remarkType == 3) {
				remarkTypeText = '特殊处理'
			} else if (remarkType == 4) {
				remarkTypeText = '拒收退款'
			} else if (remarkType == 5) {
				remarkTypeText = '取消订单'
			} else if (remarkType == 6) {
				remarkTypeText = '缺货退款+补偿'
			} else if (remarkType == 7) {
				remarkTypeText = '漏发少件补偿+退货/退款'
			} else if (remarkType == 8) {
				remarkTypeText = '特殊处理'
			} else if (remarkType == 9) {
				remarkTypeText = '退货运费'
			} else if (remarkType == 10) {
				remarkTypeText = '质量问题'
			} else if (remarkType == 11) {
				remarkTypeText = '七天无理由'
			} else if (remarkType == 12) {
				remarkTypeText = '漏发/少发/未收到货'
			} else if (remarkType == 13) {
				remarkTypeText = '错发退款'
			} else if (remarkType == 14) {
				remarkTypeText = '物流停滞/异常/丢件'
			} else if (remarkType == 15) {
				remarkTypeText = '大小/尺码与描述不符'
			} else if (remarkType == 16) {
				remarkTypeText = '供应商同意退款'
			} else if (remarkType == 17) {
				remarkTypeText = '超售后期退款'
			} else if (remarkType == 18) {
				remarkTypeText = '超时支付'
			} else if (remarkType == 19) {
				remarkTypeText = '破损补款'
			} else if (remarkType == 20) {
				remarkTypeText = '未按约定时间发货'
			}
			return remarkTypeText
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
		// 获取退货状态
		getStatusByCode({ returnStatus }) {
			let codeString = ''
			//退货单状态 1：待退款 2：待返退 3：已完成 4：已取消
			if (returnStatus == 1) {
				codeString = '待退款'
			} else if (returnStatus == 2) {
				codeString = '待返退'
			} else if (returnStatus == 3) {
				codeString = '已完成'
			} else if (returnStatus == 4) {
				codeString = '已取消'
			} else {
				codeString = '其他'
			}
			return codeString
		},
		// 获取退款状态
		getStateByCode({ refundState }) {
			let codeString = ''
			//退款状态。1：未确认，2：已确认，3：已作废, 4,退款成功, 5退款失败, 6发起退款
			if (refundState == 1) {
				codeString = '未确认'
			} else if (refundState == 2) {
				codeString = '已确认'
			} else if (refundState == 3) {
				codeString = '已作废'
			} else if (refundState == 4) {
				codeString = '退款成功'
			} else if (refundState == 5) {
				codeString = '退款失败'
			} else if (refundState == 6) {
				codeString = '发起退款'
			} else {
				codeString = '其他'
			}
			return codeString
		},
		// 退款类型处理
		refundPlatform({ refundPlatform }) {
			let typeString = ''
			if (refundPlatform == 1) {
				typeString = '用户发起'
			} else if (refundPlatform == 2) {
				typeString = '后台发起'
			} else {
				typeString = '其他'
			}
			return typeString
		},
		async init() {
			let {
				data: { resultCode, resultData },
			} = await getOrderRefundListByOrderId({
				orderId: this.orderId,
			})
			this.refundList = []
			if (resultCode == 0) {
				this.compensationList = resultData.compensationList || []
				let refundList = resultData.refundList || []
				refundList.map((item) => {
					if (item.refundMode != 5) {
						if (item.orderGoodsList) {
							let totalRefundQuantity = 0
							item.orderGoodsList.map((goods) => {
								totalRefundQuantity += goods.quantity
							})
							item.totalRefundQuantity = totalRefundQuantity
						}
						this.refundList.push(item)
					}
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.border-box {
	border: 2px solid #e0e0e0;
}
.mt20 {
	margin-top: 20px;
}
.compensation-box {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding-right: 10px;
	.refund-info {
		width: 60%;
	}
}
.goods-info-title {
	padding-left: 10px;
}
.goods-info-table {
	margin: 10px;
}
.info-item {
	padding: 6px 0;
}
.goodsInfo {
	display: flex;
	align-items: center;
	.c_image {
		width: 45px;
		height: 45px;
	}
	.goods-name {
		text-align: left;
		flex: 1;
		padding-left: 10px;
	}
}
.item-p {
	padding: 0 10px;
}
.item-p-r {
	text-align: right;
}
</style>
