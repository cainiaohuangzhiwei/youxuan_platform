<template>
	<!-- 退款弹窗 S -->
	<Dialog
		title="退款"
		v-loading="refundDialogLoading"
		:visible="visible"
		width="800px"
		:bottomBtn="refundDialogBottomBtn"
		@before-close="
			() => {
				dialogVisible = false
				totalRefundQuantity = 0
				totalRefundAmount = 0
				refundDialogData = {
					organizationName: '',
					orderSn: '',
					addTime: '',
					weixinUserName: '',
				}
				refundReasonDialogData = {
					refundReason: '1',
					refundType: '1',
					refundDesc: '1',
					refundRemark: '',
					refundTag: [],
				}
				refundtableData = []
			}
		"
	>
		<div>请勾选需要退款的商品，并输入数量</div>
		<yx-form :inline="true" :data="refundDialogData" :items="refundDialogCfg">
		</yx-form>
		<yx-table
			v-loading="loading"
			:columns="refundtableColumns"
			:data="refundtableData"
			@cell-dblclick="getRefundTableDB"
		>
			<template slot="goodsName" slot-scope="scope">
				<div>货号：{{ scope.row.goodsNumber }}</div>
				<div>{{ scope.row.goodsName }}</div>
			</template>
			<template slot="specOne" slot-scope="scope">
				<div>颜色：{{ scope.row.specOne }}</div>
				<div>尺码：{{ scope.row.specTwo }}</div>
			</template>
			<template slot="stockOutQuantity" slot-scope="scope">
				<div>
					{{
						scope.row.quantity +
						'/' +
						scope.row.refundQuantity +
						'/' +
						scope.row.returnQuantity
					}}
				</div>
			</template>
			<template slot="refundNumber" slot-scope="scope">
				<el-input
					v-model="scope.row.refundNumber"
					:max="scope.row.quantity - scope.row.returnQuantity"
					min="0"
					@change="totalRefundSum(scope.index)"
					type="number"
				></el-input>
			</template>
		</yx-table>
		<div class="refundTableSum">
			<span>总计：{{ totalRefundQuantity ? totalRefundQuantity : 0 }}件</span>
			<span> 退款金额 ￥{{ totalRefundAmount ? totalRefundAmount : 0 }}</span>
		</div>
		<div class="refundReason">
			<yx-form
				label-width="80px"
				:data="refundReasonDialogData"
				:items="refundReasonDialogCfg"
				:rules="refundReasonFunRules"
			>
			</yx-form>
		</div>
		<el-form label-width="90px" label-position="left">
			<el-form-item label="退款单标签">
				<el-checkbox-group v-model="refundReasonDialogData.refundTag">
					<el-checkbox
						v-for="(item, index) in refundTagList"
						:key="index"
						:label="item.refundTag"
						>{{ item.value }}</el-checkbox
					>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
	</Dialog>
	<!-- 退款弹窗 E -->
</template>

<script>
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'

import { getRefundTag } from '@/api/systemConfiguration'
import {
	addNewOrderRefundByOrderIdNews,
	getOrderDetailByOrderId,
} from '@/api/yhtPlusCmsOrder'

export default {
	name: 'RefundDialog',
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 是否是订单详情
		isOrderDetails: {
			type: Boolean,
			default: false,
		},
		activeRow: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	data() {
		return {
			// 退款弹窗
			totalRefundQuantity: 0,
			totalRefundAmount: 0,
			visible: false,
			refundDialogLoading: false,
			refundDialogBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						if (!this.loading) this.handleRefundDialog()
					},
				},
			],
			// 退款弹窗 - 表单
			refundDialogData: {
				organizationName: '',
				orderSn: '',
				addTime: '',
				weixinUserName: '',
			},
			refundDialogCfg: [
				{
					title: '店主',
					type: 'text',
					dataIndex: 'organizationName',
				},
				{
					title: '订单号',
					type: 'text',
					dataIndex: 'orderSn',
				},
				{
					title: '下单时间',
					type: 'text',
					dataIndex: 'addTime',
				},
				{
					title: '下单人',
					type: 'text',
					dataIndex: 'weixinUserName',
				},
			],
			refundtableData: [],
			refundtableColumns: [
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'specOne',
					title: '规格',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'stockOutQuantity',
					title: '下单数/已退/待退',
				},
				{
					type: 'custom',
					dataIndex: 'refundNumber',
					title: '退款数量',
					renderHeader: () => {
						return (
							<div>
								<span>退款数量</span>
								<el-button
									type="primary"
									onClick={() => {
										this.refundtableData.forEach((item) => {
											// this.$set(item, 'refundNumber', item.shouldDeliverCount)
											this.$set(
												item,
												'refundNumber',
												item.quantity - item.returnQuantity
											)
										})
										this.totalRefundSum()
									}}
								>
									全退
								</el-button>
							</div>
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'price',
					title: '单价',
					hide: false,
				},
				{
					type: 'string',
					dataIndex: 'unitPrice',
					title: '单价',
					hide: true,
					customRender: ({ unitPrice, price }) => {
						return unitPrice
							? `￥${unitPrice.toFixed(2)}`
							: `￥${price.toFixed(2)}`
					},
				},
				{
					type: 'amount',
					dataIndex: 'price',
					title: '券后价',
					hide: true,
				},
				{
					type: 'string',
					dataIndex: 'totalAmount',
					title: '小计',
					customRender: (row) => {
						return '￥' + (row.price * row.quantity).toFixed(2)
					},
				},
			],
			// 退款弹窗 - 表单
			refundReasonDialogData: {
				refundReason: '1',
				refundType: '1',
				refundDesc: '1',
				refundRemark: '',
				refundTag: [],
			},
			refundReasonFunRules: {
				refundReason: [
					{ required: true, message: '请选择退款原因!', trigger: 'blur' },
				],
				refundType: [
					{ required: true, message: '请选择退款类型!', trigger: 'blur' },
				],
				refundDesc: [
					{ required: true, message: '请选择退款说明!', trigger: 'blur' },
				],
				refundRemark: [
					{ required: true, message: '请输入退款备注!', trigger: 'blur' },
				],
			},

			refundReasonDialogCfg: [
				{
					title: '退款原因',
					type: 'select',
					dataIndex: 'refundReason',
					label: 'value',
					change: (val) => {
						if (val === '3') {
							this.refundReasonDialogData.refundDesc = '2'
						} else {
							this.refundReasonDialogData.refundDesc = '1'
						}
					},
					options: [
						{
							refundReason: '1',
							value: '质量问题',
						},
						{
							refundReason: '2',
							value: '缺货退款',
						},
						{
							refundReason: '3',
							value: '特殊处理',
						},
						{
							refundReason: '4',
							value: '拒收退款',
						},
						{
							refundReason: '5',
							value: '取消订单',
						},
						{
							refundReason: '11',
							value: '七天无理由',
						},
						{
							refundReason: '12',
							value: '漏发/少发/未收到货',
						},
						{
							refundReason: '13',
							value: '错发退款',
						},
						{
							refundReason: '14',
							value: '物流停滞/异常/丢件',
						},
						{
							refundReason: '15',
							value: '大小/尺码与描述不符',
						},
					],
				},
				{
					title: '退款类型',
					type: 'radio',
					dataIndex: 'refundType',
					label: 'value',
					options: [
						{
							refundType: '1',
							value: '普通退款',
						},
						{
							refundType: '2',
							value: '售后申诉退款',
						},
						{
							refundType: '3',
							value: '二次申诉退款',
						},
					],
				},
				{
					title: '退款说明',
					type: 'radio',
					dataIndex: 'refundDesc',
					label: 'value',
					disabled: true,
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
				{
					title: '退款备注',
					type: 'textarea',
					dataIndex: 'refundRemark',
				},
			],
			refundTagList: [],
		}
	},
	methods: {
		// 获取退款dialog中的退款单标签
		async initRefundTag() {
			this.getUserInfo()
			const {
				data: { resultData, resultCode },
			} = await getRefundTag()
			if (resultCode === 0) {
				const targetArr = []
				resultData.groupTagList.map((item) => {
					targetArr.push({
						refundTag: item.groupTagId,
						value: item.tagName,
					})
				})
				this.refundTagList = targetArr
			}
		},
		// 获取用户数据
		getUserInfo() {
			this.userInfo = JSON.parse(localStorage.getItem('yhtplus/_user') || '{}')
		},
		// 发起退款操作
		async handleRefundDialog() {
			const refundReasonDialogData = this.refundReasonDialogData
			const orderGoodsList = []
			this.refundtableData.map((item) => {
				if (item.refundNumber > 0) {
					const orderGoodsItem = {
						orderGoodsId: item.orderGoodsId,
						goodsSpecId: item.goodsSpecId,
						price: item.price,
						quantity: item.refundNumber,
						goodsName: item.goodsName,
					}
					orderGoodsItem.refundQuantity = item.refundNumber
					orderGoodsList.push(orderGoodsItem)
				}
			})
			if (orderGoodsList.length === 0)
				return this.$message.warning('必须填写退款数量或选择运费！')
			if (!refundReasonDialogData.refundRemark.trim())
				return this.$message.warning('请填写备注！')
			const params = {
				orderId: this.activeRow.orderId,
				groupId: this.userInfo.groupId,
				userId: this.userInfo.userId,
				remarkType: refundReasonDialogData.refundReason,
				remark: refundReasonDialogData.refundRemark.trim(),
				refundDesc: refundReasonDialogData.refundDesc,
				refundWay: refundReasonDialogData.refundType,
				deliverState: this.activeRow.deliverState,
				orderState: this.activeRow.orderState,
				tagIdList: refundReasonDialogData.refundTag,
				refundType: 1,
				isExpressFee: 1,
				isRefund: 1,
				orderGoodsList,
			}
			params.refundOrderGoodsList = orderGoodsList
			let data2 = await addNewOrderRefundByOrderIdNews(params)
			if (data2.data.resultCode == 0) {
				this.$message.success(data2.data.resultMsg)
				this.visible = false
				this.$emit('fatherMethodInit')
			}
		},
		// 计算退款总数和金额
		totalRefundSum() {
			let totalRefundQuantity = 0
			let totalRefundAmount = 0
			for (let i = 0; i < this.refundtableData.length; i++) {
				if (!this.refundtableData[i].refundNumber) {
					continue //跳出当次循环
				}
				//退款数量不得大于下单数量-已退数量 重置退款数量
				if (
					this.refundtableData[i].refundNumber >
					this.refundtableData[i].quantity -
						this.refundtableData[i].refundQuantity
				) {
					this.refundtableData[i].refundNumber =
						this.refundtableData[i].quantity -
						this.refundtableData[i].refundQuantity
					let value =
						this.refundtableData[i].quantity -
						this.refundtableData[i].refundQuantity
					this.$message.warning('退款数量不能大于' + String(value))
				}
				totalRefundQuantity += Number(this.refundtableData[i].refundNumber)
				totalRefundAmount +=
					Number(this.refundtableData[i].refundNumber) *
					Number(this.refundtableData[i].price)
			}
			this.totalRefundQuantity = totalRefundQuantity
			this.totalRefundAmount = totalRefundAmount.toFixed(2)
		},
		//初始化
		async init() {
			this.refundDialogLoading = true
			this.dialogVisible = true
			const {
				data: { resultData, resultCode },
			} = await getOrderDetailByOrderId({ orderId: this.activeRow.orderId })
			if (resultCode == 0) {
				this.refundDialogData = {
					organizationName: resultData.orderDetail.organizationName,
					orderSn: resultData.orderDetail.orderSn,
					addTime: resultData.orderDetail.addTime,
					weixinUserName: resultData.orderDetail.weixinUserName,
				}
				this.refundtableData = resultData.orderGoodsList
				this.refundtableData.forEach((item) => {
					item.refundQuantity = item.refundQuantity || 0
					item.returnQuantity = item.returnQuantity || 0
					item.stockOutQuantity = item.stockOutQuantity || 0
					item.shouldDeliverCount = item.shouldDeliverCount || 0
				})
			}
			this.refundDialogLoading = false
		},
		// 初始化表格
		initTable() {
			this.refundtableColumns.forEach((item) => {
				if (item.dataIndex == 'price' && item.title == '单价') {
					item.hide = this.isOrderDetails
				}
				if (
					item.dataIndex == 'unitPrice' ||
					(item.dataIndex == 'price' && item.title == '券后价')
				) {
					item.hide = !this.isOrderDetails
				}
			})
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this.initRefundTag()
				this.init()
				this.initTable()
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>
