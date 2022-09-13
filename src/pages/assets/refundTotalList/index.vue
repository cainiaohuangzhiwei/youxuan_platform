<template>
	<div class="refundTotalList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData102"
				:items="formCfg102"
				:formAction="formAction102"
			>
				<template slot="tagIdList">
					<el-checkbox-group v-model="formData102.tagIdList" size="small">
						<el-checkbox
							class="tag-item"
							v-for="(item, index) in groupTagList"
							:key="index"
							:label="item.groupTagId"
							border
							>{{ item.tagName }}</el-checkbox
						>
					</el-checkbox-group>
				</template>
			</yx-form>
			<yx-accounts :items="accountItems104"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns103"
				:pagination="page103"
				:data="tableData103"
			>
				<template slot="refundSn" slot-scope="scope">
					<div>
						<p>{{ scope.row.refundSn }}</p>
						<el-tag v-if="scope.row.groupTagList.length" type="warning">{{
							scope.row.groupTagList[0].tagName
						}}</el-tag>
					</div>
				</template>
				<template slot="orderSn" slot-scope="scope">
					<div>
						<router-link
							v-if="getOrderDetailByOrderId"
							:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
						<p v-else>{{ scope.row.orderSn }}</p>
						<p>
							{{ moment(scope.row.orderAddTime).format('YYYY年MM月DD日HH:mm') }}
						</p>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle105"
				:visible="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
				@before-close="dialogVisible105 = false"
			>
				<yx-form
					ref="dialog106"
					labelWidth="100px"
					:data="formData106"
					:items="formCfg106"
					:formAction="formAction106"
					:rules="formRules106"
				>
					<template slot="withdrawType">
						<div>返退账号提现</div>
					</template>
					<template slot="bankAccountId">
						<el-select
							v-model="formData106.bankAccountId"
							filterable
							placeholder="请选择"
						>
							<el-option
								v-for="item in bankAccountList"
								:key="item.bankAccountId"
								:label="item.value"
								:value="item.bankAccountId"
							>
							</el-option>
						</el-select>
					</template>
					<template slot="amount">
						<div>
							<el-input
								type="number"
								class="amount-input"
								@input="aCommission"
								v-amount="formData106.amount"
								v-model="formData106.amount"
							></el-input>
						</div>
					</template>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import { checkFinancePassWord } from '@/api/yhtPlusCmsFinance'
import RSA from 'js-rsa-dave'
import { getRefundTag } from '@/api/systemConfiguration'
import {
	getRefundAmountListByCondition,
	exportRefundAmountListByCondition,
	findRemainderByType,
	getBankAccountListByCondition,
	doWithdraw,
	withdrawSwitch,
} from '@/api/yhtPlusCmsFinance'
import { checkFunctionCode } from '@/utils/auth.js'

export default {
	name: 'RefundTotalList',
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			moment,
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			loading: false,
			formData102: {
				orderSn: '',
				brandName: '',
				groupId: '0',
				deliverStateList: [],
				refundMode: '0',
				refundDesc: [],
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				orderStartTime: '',
				orderEndTime: '',
				tagIdList: [],
			},
			formCfg102: [
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
				},
				{
					type: 'input',
					title: '会场',
					dataIndex: 'brandName',
					placeholder: '请输入会场',
				},
				{
					type: 'select',
					title: '集团',
					dataIndex: 'groupId',
					placeholder: '请输入集团',
					label: 'value',
					options: [
						{
							groupId: '0',
							value: '全部',
						},
						{
							groupId: '2',
							value: '云货优选',
						},
						{
							groupId: '7',
							value: '古岭优选',
						},
						{
							groupId: '8',
							value: '袋鼠之选',
						},
						{
							groupId: '10',
							value: '焦点生活',
						},
					],
				},
				{
					type: 'checkbox',
					title: '发货状态',
					dataIndex: 'deliverStateList',
					placeholder: '请输入发货状态',
					label: 'value',
					options: [
						{
							deliverStateList: '1',
							value: '待发货',
						},
						{
							deliverStateList: '3',
							value: '发完货',
						},
						{
							deliverStateList: '4',
							value: '已确认收货',
						},
					],
				},
				{
					type: 'select',
					title: '退款类型',
					dataIndex: 'refundMode',
					placeholder: '请输入退款类型',
					label: 'value',
					options: [
						{
							refundMode: '0',
							value: '全部',
						},
						{
							refundMode: '4',
							value: '退款',
						},
						{
							refundMode: '5',
							value: '补款',
						},
					],
				},
				{
					type: 'checkbox',
					title: '退款说明',
					dataIndex: 'refundDesc',
					placeholder: '请输入退款说明',
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
				{
					type: 'datetimerange',
					title: '退款时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					type: 'datetimerange',
					title: '下单时间',
					dataIndex: ['orderStartTime', 'orderEndTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					type: 'custom',
					title: '退款单标签',
					dataIndex: 'tagIdList',
				},
			],
			formAction102: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this.getData103(true)
					},
				},
				{
					title: '提现',
					type: 'warning',
					click: () => {
						this._checkFinancePassWord()
						// this.dialogVisible105 = true
					},
					dialogId: 105,
				},
				{
					title: '导出Excel',
					type: 'warning',
					auth: 'exportRefundAmountListByCondition',
					click: () => {
						this.exportExcel()
					},
				},
			],
			accountItems104: [
				{
					type: 'amount',
					title: '补款金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '退款金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '商品结算价',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '第三方返退金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '差额',
					value: '0.00',
				},
			],
			tableData103: [],
			tableColumns103: [
				{
					type: 'custom',
					dataIndex: 'refundSn',
					title: '退款单号',
				},
				{
					type: 'date',
					dataIndex: 'refundTime',
					title: '退款时间',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌名称',
				},
				{
					type: 'string',
					dataIndex: 'groupId',
					title: '所属集团',
					customRender: ({ groupId }) => {
						if (groupId == 2) {
							return '云货优选'
						} else if (groupId == 7) {
							return '古岭优选'
						} else if (groupId == 8) {
							return '袋鼠之选'
						} else if (groupId == 10) {
							return '焦点生活'
						} else {
							return '其他'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'deliverState',
					title: '发货状态',
					customRender: ({ deliverState }) => {
						if (deliverState == 1) {
							return '待发货'
						} else if (deliverState == 2) {
							return '发货中'
						} else if (deliverState == 3) {
							return '发完货'
						} else if (deliverState == 4) {
							return '已确认收货'
						}
					},
				},
				{
					type: 'amount',
					dataIndex: 'orderAmount',
					title: '订单总额',
				},
				{
					type: 'amount',
					dataIndex: 'realAmount',
					title: '实付金额',
				},
				{
					type: 'string',
					dataIndex: 'refundMode',
					title: '退款类型',
					customRender: ({ refundMode }) => {
						if (refundMode == 5) {
							return '订单补款'
						} else {
							return '订单退款'
						}
					},
				},
				{
					type: 'amount',
					dataIndex: 'refundAmount',
					title: '退款金额',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column })
					},
				},
				{
					type: 'amount',
					dataIndex: 'platformPrice',
					title: '第三方返退金额',
				},
				{
					type: 'amount',
					dataIndex: 'costPrice',
					title: '商品结算价',
				},
				{
					type: 'string',
					dataIndex: 'refundId',
					title: '差额',
					customRender: (row) => {
						let difference = row.platformPrice - Number(row.costPrice)
						return '￥' + difference.toFixed(2)
					},
				},
				{
					type: 'newMap',
					dataIndex: 'remarkType',
					title: '退款原因',
					options: [
						['1', '质量问题'],
						['2', '缺货退款'],
						['3', '特殊处理'],
						['4', '拒收退款'],
						['5', '取消订单'],
						['11', '七天无理由'],
						['12', '漏发/少发/未收到货'],
						['13', '错发退款'],
						['14', '物流停滞/异常/丢件'],
						['15', '大小/尺码与描述不符'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'refundDesc',
					title: '退款说明',
					options: [
						['1', '商家承担'],
						['2', '平台承担'],
					],
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '退款备注',
				},
			],
			page103: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData103()
				},
			},
			dialogTitle105: '提现',
			dialogWidth105: '800px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog106.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveWithdraw()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData106: {
				withdrawBalance: '',
				bankAccountId: '',
				amount: '',
				arrivalType: 1,
				remark: '',
				serviceCharge: '0',
			},
			formRules106: {
				bankAccountId: [
					{ required: true, message: '请选择提现账号', trigger: 'change' },
				],
				amount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData106.amount || this.formData106.amount <= 0) {
								callback(new Error('提现金额不能小于0元'))
							} else if (
								this.formData106.amount > this.formData106.withdrawBalance
							) {
								callback(new Error('提现金额不可大于可用余额'))
							} else if (this.formData106.amount > 1000000) {
								callback(new Error('金额不能大于1000000元'))
							} else if (
								this.formData106.amount * 1 +
									this.formData106.serviceCharge * 1 >
								this.formData106.withdrawBalance
							) {
								callback(
									new Error(
										`最多可提现${
											this.formData106.withdrawBalance -
											this.formData106.serviceCharge
										}`
									)
								)
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				remark: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value.replace(/\s+/g, '')) {
								callback(new Error('请输入备注'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg106: [
				{
					type: 'custom',
					title: '类型',
					dataIndex: 'withdrawType',
				},
				{
					type: 'text',
					title: '账户余额',
					dataIndex: 'withdrawBalance',
				},
				{
					title: '提现账号',
					type: 'custom',
					dataIndex: 'bankAccountId',
				},
				{
					title: '提现金额',
					type: 'custom',
					dataIndex: 'amount',
				},
				{
					title: '提现手续费',
					type: 'radio',
					dataIndex: 'arrivalType',
					label: 'value',
					change: () => {
						this.aCommission()
					},
					options: [
						{
							value: '普通提现(T+1日)',
							arrivalType: 0,
						},
						{
							arrivalType: 1,
							value: '快速提现(马上到账)',
						},
					],
				},
				{
					title: '提现手续费',
					type: 'text',
					dataIndex: 'serviceCharge',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
					placeholder: '备注长度为25个字以内',
				},
			],
			formAction106: [],
			groupTagList: [],
			bankAccountList: [],
			gatewayEnable: false,
		}
	},

	created() {
		this._getRefundTag()
		this._getBankAccountListByCondition()
		this._withdrawSwitch()
	},

	methods: {
		async _withdrawSwitch() {
			let {
				data: { resultCode, resultData },
			} = await withdrawSwitch({
				developerId: 10001,
				version: '1.0',
				channel: 'JOIN_PAY',
				signType: 'MD5',
				name: 'PAYMENT',
				key: this.$store.state.user.userInfo.userId,
				sign: 'a29c832d825365aba30267d0c6209156',
			})
			if (resultCode == 0) {
				this.gatewayEnable = resultData.value == 'ENABLE'
			}
		},
		async _checkFinancePassWord() {
			this.$prompt('输入密码', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入密码',
				inputType: 'password',
			}).then(async ({ value }) => {
				let {
					data: { resultCode },
				} = await checkFinancePassWord(
					await this.getRSAPassword({
						password: value,
					})
				)
				if (resultCode == 0) {
					this._findRemainderByType()
				}
			})
		},
		async getRSAPassword(paramJson) {
			let psw = paramJson.password.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.password = RSA.encryptedString(publicKey, psw)
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		saveWithdraw() {
			// 提现
			let paramJson = {
				organizationId: 0,
				type: 1,
				arrivalType: this.formData106.arrivalType,
				bankAccountId: this.formData106.bankAccountId,
				amount: this.formData106.amount,
				serviceCharge: this.formData106.serviceCharge,
				remark: this.formData106.remark,
				gatewayEnable: this.gatewayEnable,
			}
			const h = this.$createElement
			let bankAccountName = ''
			let index = this.bankAccountList.findIndex(
				(item) => item.bankAccountId === paramJson.bankAccountId
			)
			bankAccountName = this.bankAccountList[index].value
			this.$msgbox({
				title: '提示',
				message: h('div', [
					h('p', `提现类型：返退账号提现`),
					h('p', `提现账号：${bankAccountName}`),
					h('p', `提现金额：${paramJson.amount}元`),
					h('p', `提现手续费：${paramJson.serviceCharge}元`),
					h('p', `备注：${paramJson.remark}`),
					h('p', '是否确定提现？'),
				]),
				showCancelButton: false,
				confirmButtonText: '确定',
			}).then(async (action) => {
				if (action == 'confirm') {
					let {
						data: { resultCode, resultMsg },
					} = await doWithdraw(paramJson)
					if (resultCode == 0) {
						this.dialogVisible105 = false
						this.$message.success(resultMsg)
						this.getData103(true)
					}
				}
			})
		},
		aCommission() {
			// 设置手续费
			let serviceCharge = 0
			if (this.formData106.arrivalType == 1) {
				// t+1
				serviceCharge = this.formData106.amount * 0.0003
				if (serviceCharge < 0.01) {
					serviceCharge = 0.01
				} else {
					serviceCharge = serviceCharge.toFixed(2)
					serviceCharge = Math.round(serviceCharge * 100) / 100
				}
				serviceCharge = (serviceCharge + 2).toFixed(2)
			} else {
				serviceCharge = 2
			}
			this.formData106.serviceCharge = serviceCharge
		},
		// 获取提现账号
		async _getBankAccountListByCondition() {
			let {
				data: { resultCode, resultData },
			} = await getBankAccountListByCondition()
			if (resultCode == 0) {
				resultData.bankAccountList.map((item) => {
					item.value = `${item.bankName}-${item.accountName}-${item.accountNumber}`
				})
				this.bankAccountList = resultData.bankAccountList
			}
		},
		// 获取账户余额
		async _findRemainderByType() {
			let {
				data: { resultCode, resultData },
			} = await findRemainderByType({ type: 1 })
			if (resultCode == 0) {
				this.dialogVisible105 = true
				this.formData106.withdrawBalance = resultData
			}
		},
		// 导出Excel
		exportExcel: async function () {
			let paramJson = this.formData102
			const loading = this.$loading({
				lock: true,
				text: '正在导出，请稍等',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let { data } = await exportRefundAmountListByCondition(paramJson)
			loading.close()
			downloadFile(data, '返退总额明细表.xlsx')
		},
		renderHeader(h, { column }) {
			// 表头提示
			return h('div', [
				h(
					'span',
					{
						style: 'color: red',
					},
					column.label
				),
			])
		},
		async _getRefundTag() {
			let {
				data: { resultCode, resultData },
			} = await getRefundTag()
			if (resultCode == 0) {
				this.groupTagList = resultData.groupTagList
			}
		},
		initAccounts(flowStatistics = {}) {
			let platformPrice = flowStatistics.platformPrice || 0
			let costPrice = flowStatistics.costPrice || 0
			this.accountItems104[0].value = flowStatistics.supplementAmountCount || 0
			this.accountItems104[1].value = flowStatistics.refundAmountCount || 0
			this.accountItems104[2].value = costPrice
			this.accountItems104[3].value = platformPrice
			this.accountItems104[4].value = platformPrice - costPrice
		},
		// 获取列表数据
		async getData103(flag) {
			this.loading = true
			let paramJson = this.findSearchParams103(flag)
			const {
				data: { resultCode, resultData },
			} = await getRefundAmountListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData103 = resultData.refundAmountList
				this.page103.count = resultData.count
				this.initAccounts(resultData.flowStatistics)
			} else {
				this.initAccounts()
				this.tableData103 = []
				this.page103.count = 0
			}
			this.loading = false
		},
		findSearchParams103(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}
			const paramJson = Object.assign(this.formData102, {
				length: this.page103.length,
				startIndex: (this.page103.currentPage - 1) * this.page103.length,
			})
			return paramJson
		},
	},
}
</script>
<style scoped>
.tag-item {
	margin-bottom: 10px;
}
</style>
