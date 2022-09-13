<template>
	<!-- 订单补款弹窗 S -->
	<Dialog
		title="订单补款"
		:visible="visible"
		width="600px"
		@before-close="
			() => {
				dialogVisible = false
				returnMoneyFormData = {
					orderSn: '',
					supplementType: '1',
					compensationTarget: '',
					refundWay: '1',
					remarkType: '9',
					compensationAmount: null,
					refundDesc: '',
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
			:data="returnMoneyFormData"
			:items="returnMoneyFormCfg"
			:rules="funRules"
			:formAction="returnMoneyDialogBottomBtn"
		>
			<template slot="trackingNum">
				<el-radio-group v-model="trackingChecked">
					<el-radio
						v-for="(item, index) in shipmentNumberList"
						:key="index"
						:label="item.trackingNum"
					>
						{{ item.trackingNum }}</el-radio
					>
				</el-radio-group>
			</template>
		</yx-form>

		<div v-if="tableData103.length > 0">
			<p class="text-warn">
				该订单已经发起过补款，详细信息如下，请确认是否还要再次发起
			</p>
			<yx-table
				:select="false"
				v-loading="tableDataLoading103"
				:columns="tableColumns103"
				:data="tableData103"
			></yx-table>
		</div>
		<div v-if="tableData104.length > 0" style="margin-top: 20px">
			该物流单号已经发起补款，详情信息如下，请确认是否还要再次发起
			<yx-table
				:select="false"
				v-loading="tableDataLoading103"
				:columns="tableColumns103"
				:data="tableData104"
			></yx-table>
		</div>
	</Dialog>
	<!-- 订单补款弹窗 E -->
</template>

<script>
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { addOrderCompensation } from '@/api/yhtplusCmsOrderCompensation'
import { getCompensationInfoHJ } from '@/api/afterSales.js'

export default {
	name: 'RefundDialog',
	props: {
		// 弹框开关
		dialogVisible: {
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
			visible: false,
			refundDialogLoading: false,

			// 订单补款弹窗
			tableDataLoading103: false,
			returnMoneyDialogBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: async () => {
						const params = {
							orderId: this.activeRow.orderId,
							supplementType: this.returnMoneyFormData.supplementType,
							refundWay: this.returnMoneyFormData.refundWay,
							remarkType: this.returnMoneyFormData.remarkType,
							compensationAmount: this.returnMoneyFormData.compensationAmount,
							refundDesc: this.returnMoneyFormData.refundDesc,
							remark: this.returnMoneyFormData.remark,
							trackingNum: this.trackingChecked || '',
							bankAccount: this.returnMoneyFormData.transferBankAccount,
							transferUserName: this.returnMoneyFormData.transferUserName,
							compensationTarget: this.returnMoneyFormData.compensationTarget,
						}

						if (
							!params.compensationAmount.trim() ||
							params.compensationAmount <= 0
						)
							return this.$message.warning('请正确填写补款金额！')
						if (!params.remark.trim())
							return this.$message.warning('请填写备注！')
						const {
							data: { resultCode, resultMsg },
						} = await addOrderCompensation(params)
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							this.dialogVisible = false
							this.$emit('fatherMethodInit')
						}
					},
				},
			],
			// 订单补款弹窗 - 表单
			returnMoneyFormData: {
				orderSn: '',
				supplementType: '1',
				compensationTarget: '',
				refundWay: '1',
				remarkType: '9',
				compensationAmount: '',
				refundDesc: '',
				remark: '',
				transferUserName: '',
				transferBankAccount: '',
				trackingNum: '',
			},
			funRules: {
				supplementType: [
					{ required: true, message: '请选择补款方式!', trigger: 'blur' },
				],
				refundWay: [
					{ required: true, message: '请选择补款类型!', trigger: 'blur' },
				],
				compensationTarget: [
					{ required: true, message: '请选择汇聚补款事由!', trigger: 'blur' },
				],
				remarkType: [
					{ required: true, message: '请选择补款原因!', trigger: 'blur' },
				],
				compensationAmount: [
					{ required: true, message: '请输入补款金额!', trigger: 'blur' },
				],
				transferUserName: [
					{ required: true, message: '请输入姓名!', trigger: 'blur' },
				],
				transferBankAccount: [
					{ required: true, message: '请输入姓名!', trigger: 'blur' },
				],
				refundDesc: [
					{ required: true, message: '请选择补款说明!', trigger: 'blur' },
				],
				remark: [
					{ required: true, message: '请输入补款备注!', trigger: 'blur' },
				],
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
					title: '汇聚补款事由',
					type: 'radio',
					dataIndex: 'compensationTarget',
					label: 'value',
					change: (compensationTarget) => {
						if (compensationTarget === '1') {
							this.returnMoneyFormData.compensationAmount = '8'
							this.returnMoneyFormCfg.map((item) => {
								if (item.dataIndex === 'compensationAmount') {
									item.disabled = true
								}
							})
						} else {
							this.returnMoneyFormData.compensationAmount = '0'
							this.returnMoneyFormCfg.map((item) => {
								if (item.dataIndex === 'compensationAmount') {
									item.disabled = false
								}
							})
						}
					},
					options: [
						{
							compensationTarget: '1',
							value: '运保卡赔付',
						},
						{
							compensationTarget: '2',
							value: '其他',
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
						{
							remarkType: '17',
							value: '超售后期退款',
						},
					],
					change: (val) => {
						if (val == 8) {
							this.returnMoneyFormCfg[8].disabled = true
							this.returnMoneyFormData.refundDesc = '2'
						} else {
							this.returnMoneyFormCfg[8].disabled = false
						}
					},
				},
				{
					title: '用户补款金额',
					type: 'inputNumber',
					disabled: false,
					change: (val) => {
						if (
							val > 5000 &&
							this.joinpayReturnMoneyFormData.compensationTarget === '2'
						) {
							this.$message.warning('最大补款金额5000')
							this.joinpayReturnMoneyFormData.compensationAmount = 0
						}
					},
					dataIndex: 'compensationAmount',
				},
				{
					title: '姓名',
					type: 'input',
					dataIndex: 'transferUserName',
				},
				{
					title: '银行卡号',
					type: 'inputNumber',
					dataIndex: 'transferBankAccount',
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
				{
					title: '客户退货物流单号',
					type: 'custom',
					dataIndex: 'trackingNum',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			tableData103: [],
			tableData104: [],
			tableColumns103: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'amount',
					dataIndex: 'compensationAmount',
					title: '补款金额',
				},
				{
					type: 'string',
					dataIndex: 'trackingNum',
					title: '客户退货物流单号',
				},
				{
					type: 'string',
					dataIndex: 'remarkType',
					title: '补款方式',
					customRender: (row) => {
						const arr = {
							6: '缺货退款+补偿',
							7: '漏发少件补偿+退货/退款',
							8: '特殊处理',
							9: '退货运费',
							10: '质量问题',
							21: '权益保障',
						}
						return arr[row.remarkType] || '-'
					},
				},
				{
					title: '备注',
					type: 'string',
					dataIndex: 'remark',
				},
				{
					title: '派发状态',
					type: 'string',
					dataIndex: 'compensationState',
					customRender: (row) => {
						const arr = ['已派发', '未派发']
						return arr[row.compensationState] || '已派发'
					},
				},
				{
					title: '是否汇聚补款',
					type: 'string',
					dataIndex: 'isHJ',
					customRender: (row) => {
						if (row.isHJ == 1) {
							return '是'
						} else {
							return '否'
						}
					},
				},
			],
		}
	},
	methods: {
		async init() {
			const row = this.activeRow

			this.returnMoneyFormData.orderSn = row.orderSn
			this.dialogVisible = true

			this.tableDataLoading103 = true
			const {
				data: { resultCode, resultData },
			} = await getCompensationInfoHJ({
				trackingNum: row.trackingNum,
				orderSn: row.orderSn,
				needTrackingNum: 1,
			})
			if (resultCode === 0) {
				resultData.trackingNumList &&
					resultData.trackingNumList.length > 0 &&
					this.initReplenishmentTable(resultData, row.trackingNum)
				this.tableData103 = resultData.orderCompensation || []
				this.tableData104 = resultData.trackingNumCompensation || []
				this.tableDataLoading103 = false
				this.refundConfirmLoading = false
			}
		},
		// 查看物流单补款补偿记录
		async initReplenishmentTable(resultData, trackingNum) {
			// 物流单号集合
			let trackingNumList = resultData.trackingNumList || []
			let ntrackingNumList = trackingNumList.sort()
			let shipmentNumberList = []
			let obj = {}
			for (let i = 0; i < ntrackingNumList.length; i++) {
				if (ntrackingNumList[i] == ntrackingNumList[i + 1]) {
					if (!obj[ntrackingNumList[i]]) {
						obj[ntrackingNumList[i]] = {
							trackingNum: ntrackingNumList[i],
							isItRedundant: true,
						}
					}
				} else {
					if (!obj[ntrackingNumList[i]]) {
						obj[ntrackingNumList[i]] = {
							trackingNum: ntrackingNumList[i],
							isItRedundant: false,
						}
					}
				}
			}
			for (let key in obj) {
				shipmentNumberList.push(obj[key])
			}
			this.shipmentNumberList = shipmentNumberList
			this.$nextTick(() => {
				shipmentNumberList.forEach((item) => {
					if (item.trackingNum == trackingNum) {
						this.trackingChecked = item.trackingNum
					}
				})
			})
			if (!this.trackingChecked)
				this.trackingChecked = shipmentNumberList[0].trackingNum
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this.init()
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

<style lang="scss" scoped>
.text-warn {
	color: brown;
	padding: 6px 0;
}
</style>
