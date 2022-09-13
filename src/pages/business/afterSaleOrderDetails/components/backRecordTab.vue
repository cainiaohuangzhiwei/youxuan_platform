<template>
	<div>
		<div v-if="afterSalesRefundVo.afterType == 1" class="returnGoodsInfo">
			<b
				>退货记录
				<span
					v-if="
						this.afterSalesDetailVo.afterOrderStatus == 4 &&
						this.afterSalesDetailVo.collectionFlag
					"
					>（上门取件）</span
				></b
			>
			<yx-form
				v-loading="loading"
				class="return-goods-info"
				labelWidth="140px"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
				:rules="formRules101"
			>
				<template slot="expressName">
					<div>
						<el-select
							v-model="formData101.expressName"
							filterable
							placeholder="请选择"
						>
							<el-option
								v-for="item in expressList"
								:key="item.expressName"
								:label="item.expressName"
								:value="item.expressName"
							>
							</el-option>
						</el-select>
					</div>
				</template>
			</yx-form>
		</div>
		<div class="refundInfo">
			<b>退款记录</b>
			<yx-info :data="afterSalesRefundVo" :items="refundInfo"></yx-info>
		</div>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { numberFormat } from '@/utils/helper/common'
import { getExpressList } from '@/api/express'
import { checkFunctionCode } from '@/utils/auth.js'
import { updateAsRefund } from '@/api/afterSales'
export default {
	props: {
		afterSalesDetailVo: {
			type: Object,
			default: () => ({}),
		},
		afterSalesRefundVo: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxInfo,
		YxForm,
	},
	data() {
		return {
			loading: false,
			params: this.$route.params,
			updateAfterSalesSave: checkFunctionCode('updateAfterSalesSave'),
			expressList: [],
			formData101: {
				expressName: '',
				expressSn: '',
				phoneNum: '',
				customerExpressFee: 0,
				returnLastTime: '',
				weixinUserName: '',
				returnUserName: '',
				goodsRecoveryText: '',
			},
			formRules101: {
				expressSn: [
					{
						required: true,
						message: '请输入客户退件物流单号',
						trigger: 'blur',
					},
				],
				customerExpressFee: [
					{
						required: true,
						message: '请输入客户退件物流运费',
						trigger: 'blur',
					},
				],
				phoneNum: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.formData101.expressName == '顺丰快递' && !value) {
								callback(new Error('请输入手机号'))
							} else if (
								this.formData101.expressName == '顺丰快递' &&
								!/^1[3456789][0-9]{9}$/.test(value)
							) {
								callback(new Error('手机号格式不正确'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg101: [
				{
					type: 'custom',
					dataIndex: 'expressName',
					title: '物流公司',
				},
				{
					type: 'input',
					dataIndex: 'expressSn',
					title: '客户退件物流单号',
				},
				{
					type: 'input',
					dataIndex: 'phoneNum',
					title: '请输入手机号',
				},
				{
					type: 'input',
					dataIndex: 'customerExpressFee',
					title: '客户退件物流运费',
				},
				{
					type: 'text',
					dataIndex: 'returnLastTime',
					title: '填写时间',
				},
				{
					type: 'text',
					dataIndex: 'weixinUserName',
					title: '填写人',
				},
				{
					type: 'text',
					dataIndex: 'goodsRecoveryText',
					title: '客户退件是否已收回',
				},
				{
					type: 'text',
					dataIndex: 'returnUserName',
					title: '操作人',
				},
			],
			formAction101: [],
			refundInfo: [
				{
					type: 'string',
					title: '售后类型',
					dataIndex: 'afterType',
					customRender: () => {
						return this.afterSalesRefundVo.afterType == 1
							? '退货退款'
							: '仅退款'
					},
				},
				{
					type: 'string',
					title: '退款状态',
					dataIndex: 'refundState',
					customRender: () => {
						let type = [
							'',
							'未确认',
							'已确认',
							'已作废',
							'退款成功',
							'退款失败',
							'发起微信退款',
						]
						return (
							(this.afterSalesRefundVo.refundState &&
								type[this.afterSalesRefundVo.refundState]) ||
							'-'
						)
					},
				},
				{
					type: 'string',
					title: '退货状态',
					dataIndex: 'returnStatusStr',
				},
				{
					type: 'string',
					title: '退款单',
					dataIndex: 'refundSn',
				},
				{
					type: 'string',
					title: '退款时间',
					dataIndex: 'refundTime',
					customRender: () => {
						return this.afterSalesRefundVo.refundTime
							? moment(this.afterSalesRefundVo.refundTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  )
							: '-'
					},
				},
				{
					type: 'string',
					title: '流水号',
					dataIndex: 'responsePaymentNo',
				},
				{
					type: 'string',
					title: '操作时间',
					dataIndex: 'refundAddTime',
					customRender: () => {
						return this.afterSalesRefundVo.refundAddTime
							? moment(this.afterSalesRefundVo.refundAddTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  )
							: '-'
					},
				},
				{
					type: 'string',
					title: '操作人',
					dataIndex: 'platformUserName',
				},
				{
					type: 'string',
					title: '实际退款金额',
					dataIndex: 'refundAmount',
					customRender: () => {
						return `￥${numberFormat(this.afterSalesRefundVo.refundAmount, 2)}`
					},
				},
				{
					type: 'string',
					title: '退款方式',
					dataIndex: 'refundTypeStr',
				},
				{
					type: 'string',
					title: '退款类型',
					dataIndex: 'refundWay',
					customRender: () => {
						let refundWay_func = {
							1: '普通退款',
							2: '售后申诉退款',
							3: '二次申诉退款',
						}
						return (
							(this.afterSalesRefundVo.refundWay &&
								refundWay_func[this.afterSalesRefundVo.refundWay]) ||
							'-'
						)
					},
				},
				{
					type: 'string',
					title: '退款说明',
					dataIndex: 'refundDesc',
					customRender: () => {
						let refundDesc_func = {
							1: '商家承担',
							2: '平台承担',
						}
						return (
							(this.afterSalesRefundVo.refundDesc &&
								refundDesc_func[this.afterSalesRefundVo.refundDesc]) ||
							'-'
						)
					},
				},
				{
					type: 'string',
					title: '退款备注',
					dataIndex: 'refundDesc',
					customRender: () => {
						return (
							(this.afterSalesRefundVo.refundRemark &&
								this.afterSalesRefundVo.refundRemark.replace(
									/\s+/g,
									'<br />'
								)) ||
							'-'
						)
					},
				},
			],
		}
	},
	created() {
		this._getExpressList()
	},
	watch: {
		afterSalesRefundVo() {
			let dataIndex = [
				'returnLastTime',
				'weixinUserName',
				'returnUserName',
				'goodsRecovery',
			]
			this.formAction101 = []
			if (this.updateAfterSalesSave) {
				this.formAction101.push({
					title: '保存',
					type: 'primary',
					click: () => {
						this._updateAsRefund()
					},
				})
			}
			this.formCfg101.map((item) => {
				if (
					!this.updateAfterSalesSave &&
					dataIndex.indexOf(item.dataIndex) != -1
				) {
					item.hide = true
				} else {
					item.hide = false
					if (item.dataIndex == 'returnLastTime') {
						this.formData101.returnLastTime = moment(
							this.afterSalesRefundVo.returnLastTime
						).format('YYYY-MM-DD HH:mm:ss')
					} else if (item.dataIndex == 'weixinUserName') {
						this.formData101.weixinUserName = this.afterSalesRefundVo.weixinUserName
					} else if (item.dataIndex == 'returnUserName') {
						this.formData101.returnUserName = this.afterSalesRefundVo.returnUserName
					} else if (item.dataIndex == 'expressName') {
						this.formData101.expressName = this.afterSalesRefundVo.logisticsCompany
					} else if (item.dataIndex == 'expressSn') {
						this.formData101.expressSn = this.afterSalesRefundVo.expressSn
					} else if (item.dataIndex == 'customerExpressFee') {
						this.formData101.customerExpressFee = this.afterSalesRefundVo.customerExpressFee
					}
				}
				if (item.dataIndex == 'goodsRecoveryText') {
					if (this.afterSalesRefundVo.goodsRecovery == 2) {
						this.formData101.goodsRecoveryText = '是'
					} else {
						this.formData101.goodsRecoveryText = '否'
					}
				}
			})
		},
	},
	methods: {
		async _updateAsRefund() {
			let paramJson = {
				refundId: this.afterSalesRefundVo.refundId,
				afterSalesId: this.params.afterSalesId,
				expressSn: this.formData101.expressSn,
				customerExpressFee: this.formData101.customerExpressFee,
				logisticsCompany: this.formData101.expressName,
				expressCode: '',
			}
			if (paramJson.logisticsCompany == '顺丰快递') {
				paramJson.phoneNum = this.formData101.phoneNum
			}
			let index = this.expressList.findIndex((item) => {
				return item.expressName == paramJson.logisticsCompany
			})
			if (index != -1) {
				paramJson.expressCode = this.expressList[index].expressCode
			}
			this.loading = true
			let {
				data: { resultCode, resultMsg },
			} = await updateAsRefund(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.$emit('update')
			}
			this.loading = false
		},
		async _getExpressList() {
			let {
				data: { resultCode, resultData },
			} = await getExpressList()
			if (resultCode == 0) {
				this.expressList = resultData.expressList || []
			}
		},
	},
}
</script>

<style scoped>
.return-goods-info {
	width: 500px;
	margin-top: 10px;
}
</style>
