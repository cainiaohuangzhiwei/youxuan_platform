<template>
	<div class="goodsStockList">
		<basicContainer>
			<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
				>老系统</el-button
			> -->
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #supplierName>
					<el-input
						v-model="formData105.supplierName"
						placeholder="请选择商家"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData105.supplierName = []
								formData105.supplierIds = []
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="handleAdd"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</template>
				<template slot="afterSalesSn" slot-scope="scope">
					<router-link
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						><el-button type="text">{{
							scope.row.afterSalesSn
						}}</el-button></router-link
					>
				</template>
			</yx-table>
			<!-- //驳回 -->
			<Dialog
				title="驳回"
				:visible="endRepaiOrderLoding"
				width="50%"
				:bottomBtn="endRepaiOrderBottomBtn"
				@before-close="endRepaiOrderLoding = false"
			>
				<yx-form
					style="margin-top: 60px"
					ref="form"
					:rules="rules"
					:inline="false"
					:items="settingsItem"
					:data="settingsData"
					labelWidth="80px"
				>
				</yx-form>
			</Dialog>
			<!-- //打款 -->
			<Dialog
				title="打款"
				:visible="remitLoding"
				width="30%"
				:bottomBtn="remitBottomBtn"
				@before-close="remitLoding = false"
			>
				<div style="text-align: center">
					<div class="mb20">
						<label class="prefix-star">*</label>
						<label>打款金额：</label>
						<label>￥{{ numberFormat(remittanceRow.amount, 2) }}</label>
					</div>
					<div class="mb20">
						<label class="prefix-star">*</label>
						<label>户名：</label>
						<label>{{ remittanceRow.accountName }}</label>
					</div>
					<div class="mb20">
						<label class="prefix-star">*</label>
						<label>账号：</label>
						<label>{{ remittanceRow.accountNumber }}</label>
					</div>
					<div class="mb20">
						<label class="prefix-star">*</label>
						<label>开户行：</label>
						<label>{{ remittanceRow.bankSubbranch }}</label>
					</div>
				</div>
			</Dialog>
			<!-- //查看记录 -->
			<Dialog
				title="查看记录"
				:visible="checkRecordLoding"
				width="60%"
				:bottomBtn="checkRecordBtn"
				@before-close="checkRecordLoding = false"
			>
				<el-timeline :reverse="reverse">
					<el-timeline-item
						v-for="(item, index) in supplierWithdrawOperationRecordListS"
						:key="index"
					>
						{{ item.action }}
						<div style="margin-left: 20%; display: inline-block">
							{{ moment(item.addTime).format('YYYY-MM-DD HH:mm:ss') }}
						</div>
						<div style="margin-left: 20%; display: inline-block">
							{{
								item.action == '发起提现'
									? item.operator + '(商家名称)'
									: item.operator
							}}
						</div>
					</el-timeline-item>
				</el-timeline>
			</Dialog>

			<!-- 商家列表 -->
			<multitermSupply-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { numberFormat } from '@/utils/helper/common'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import { exportSupplierWithdrawList } from '@/api/webImport.js'
import RSA from 'js-rsa-dave'
import MultitermSupplyDialog from '@/components/MultitermSupplyDialog'
import { withdrawSwitch } from '@/api/yhtPlusCmsFinance'
import {
	payConfirm,
	sPlatformSupplierWithdrawApplicationList,
	withdrawReject,
	supplierWithdrawOperationRecordList,
} from '@/api/supplyAmount'
import { wgGetDate } from '@/utils/helper/common'
import moment from 'moment'
import { isNull, downloadFile } from '@/utils/helper/common'
import { checkFinancePassWord } from '@/api/yhtPlusCmsFinance'
export default {
	name: 'WorkorderList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		MultitermSupplyDialog,
	},
	props: [],
	data() {
		return {
			numberFormat: numberFormat,
			moment,
			showLoading: false,
			formsDialog: false,
			remitLoding: false,
			endRepaiOrderLoding: false,
			supplierWithdrawId: null,
			supplyRow: [],
			selectGroupList: [],
			formData105: {
				supplierName: [],
				supplierIds: [],
				withdrawTimeStart: '',
				withdrawTimeEnd: '',
				withdrawStatus: '0',
			},
			remittanceRow: {},
			remitBottomBtn: [
				{
					title: '确认打款',
					type: 'primary',
					click: () => {
						this.initiateWithdrawal()
					},
				},
			],
			endRepaiOrderBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.endRepaiOrderAudit()
					},
				},
			],
			settingsData: {
				ticketFinishRemark: '',
			},
			settingsItem: [
				{
					title: '驳回原因',
					type: 'textarea',
					dataIndex: 'ticketFinishRemark',
				},
			],
			rules: {
				ticketFinishRemark: [
					{ required: true, message: '请输入驳回原因', trigger: 'blur' },
				],
			},
			formCfg105: [
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '发起提现时间',
					type: 'datetimerange',
					dataIndex: ['withdrawTimeStart', 'withdrawTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'select',
					title: '打款状态',
					dataIndex: 'withdrawStatus',
					placeholder: '请选择打款状态',
					label: 'value',
					options: [
						{
							withdrawStatus: '0',
							value: '全部',
						},
						{
							withdrawStatus: '1',
							value: '待打款',
						},
						{
							withdrawStatus: '3',
							value: '打款中',
						},
						{
							withdrawStatus: '2',
							value: '打款失败',
						},
						{
							withdrawStatus: '4',
							value: '已驳回',
						},
					],
				},
			],
			formAction105: [
				{
					title: '重置',
					supplierIds: '',
					click: () => {
						this.resetForm()
					},
				},
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this._sPlatformSupplierWithdrawApplicationList(true, e)
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportSupplierWithdrawList',
					click: () => {
						this._exportSupplierWithdrawList()
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '申请打款金额',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'withdrawTime',
					title: '发起提现时间',
					customRender: (row) => {
						return row.withdrawTime
							? moment(row.withdrawTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'payTime',
					title: '打款时间',
					customRender: (row) => {
						return row.payTime
							? moment(row.payTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'withdrawStatus',
					title: '工单类型',
					customRender: (row) => {
						if (row.withdrawStatus == 1) {
							return '待打款'
						} else if (row.withdrawStatus == 2) {
							return '打款中'
						} else if (row.withdrawStatus == 3) {
							return '打款成功'
						} else if (row.withdrawStatus == 4) {
							return '打款失败'
						} else if (row.withdrawStatus == 5) {
							return '已驳回'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看记录',
							click: (row) => {
								this.checkRecord(row)
							},
						},
						{
							title: '打款',
							auth: 'payConfirm',
							click: (row) => {
								this.remittanceManage(row)
							},
							customRender: (action, row) => {
								action.hide = row.withdrawStatus != 1
								return action
							},
						},
						{
							title: '驳回',
							auth: 'withdrawReject',
							click: (row) => {
								this.endRepairOrder(row)
							},
							customRender: (action, row) => {
								action.hide = row.withdrawStatus != 1
								return action
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._sPlatformSupplierWithdrawApplicationList()
				},
			},
			gatewayEnable: false,
			supplierWithdrawOperationRecordListS: [],
			reverse: false,
			checkRecordLoding: false,
		}
	},

	created() {
		this._sPlatformSupplierWithdrawApplicationList()
	},

	methods: {
		// 打开老系统
		oldSystem() {
			window.open(`/yhtplus/web/withdrawDeposit.html`)
		},
		async _exportSupplierWithdrawList() {
			// 导出
			let paramJson = Object.assign({}, this.formData105)
			let { data } = await exportSupplierWithdrawList(paramJson)
			downloadFile(data, '提现申请列表数据.xlsx')
		},
		async checkRecord(row) {
			this.checkRecordLoding = true
			let {
				data: { resultCode, resultData },
			} = await supplierWithdrawOperationRecordList({
				supplierWithdrawId: row.supplierWithdrawId,
			})
			if (resultCode == 0) {
				this.supplierWithdrawOperationRecordListS =
					resultData.supplierWithdrawOperationRecordList
			}
		},
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
		initiateWithdrawal() {
			// 发起提现
			this.$prompt('提现密码', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入密码',
				inputType: 'password',
			}).then(async ({ value }) => {
				this.visible = false
				let {
					data: { resultCode },
				} = await checkFinancePassWord(
					await this.getRSAPassword({
						password: value,
					})
				)
				if (resultCode == 0) {
					this._doWithdraw()
				}
			})
		},
		async _doWithdraw() {
			let paramJson = {
				amount: this.remittanceRow.amount,
				supplierWithdrawId: this.remittanceRow.supplierWithdrawId,
				supplierId: this.remittanceRow.supplierId,
				bankAccountId: this.remittanceRow.bankAccountId,
				arrivalType: 0,
				type: 10,
				organizationId: 0,
				gatewayEnable: this.gatewayEnable,
			}
			let {
				data: { resultCode },
			} = await payConfirm(paramJson)
			if (resultCode == 0) {
				this.remitLoding = false
				this._sPlatformSupplierWithdrawApplicationList()
			}
		},
		async getRSAPassword(paramJson) {
			let psw = paramJson.password.split('').reverse().join('')
			let resaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				resaData.data.resultData.publicKeyIndex,
				'',
				resaData.data.resultData.modulus
			)
			paramJson.password = RSA.encryptedString(publicKey, psw)
			paramJson.privateKeySessionKey =
				resaData.data.resultData.privateKeySessionKey
			this._withdrawSwitch()
			return paramJson
		},
		// 重置
		resetForm() {
			this.supplyRow = []
			this.selectGroupList = []
			this.formData105 = {
				supplierName: [],
				supplierIds: [],
				withdrawTimeStart: wgGetDate().getMonthStartDate, //创建时间
				withdrawTimeEnd: wgGetDate().getMonthEndDate,
				withdrawStatus: '0',
			}
		},
		handleAdd() {
			this.supplyRow = JSON.parse(JSON.stringify(this.selectGroupList))
			this.formsDialog = true
		},
		//处理商家多选查询
		fatherMethodInit(row = {}) {
			this.selectGroupList = JSON.parse(JSON.stringify(row))
			for (let i = 0; i < row.length; i++) {
				this.formData105.supplierName.push(row[i].supplierName) //插入数组
				this.formData105.supplierName = [
					//数组防重
					...new Set(this.formData105.supplierName),
				]
				this.formData105.supplierIds.push(row[i].supplierId)
				this.formData105.supplierIds = [
					//数组防重
					...new Set(this.formData105.supplierIds),
				]
			}
			console.log('+++++++', this.formData105.supplierName)
		},
		endRepairOrder(row) {
			this.settingsData.ticketFinishRemark = ''
			this.supplierWithdrawId = row.supplierWithdrawId
			this.endRepaiOrderLoding = true
		},
		remittanceManage(row) {
			this.remitLoding = true
			this.remittanceRow = row
		},
		endRepaiOrderAudit: async function () {
			let paramJson = {
				remark: this.settingsData.ticketFinishRemark,
				supplierWithdrawId: this.supplierWithdrawId,
			}
			if (isNull(paramJson.remark)) {
				this.$message.warning({ message: '请填写驳回内容' })
				return
			}
			let {
				data: { resultCode },
			} = await withdrawReject(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: `驳回成功!`,
					type: 'success',
				})
				this.endRepaiOrderLoding = false
				this._sPlatformSupplierWithdrawApplicationList()
			}
		},
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			paramJson.withdrawTimeStart =
				moment(paramJson.withdrawTimeStart).valueOf() || ''
			paramJson.withdrawTimeEnd =
				moment(paramJson.withdrawTimeEnd).valueOf() || ''

			return paramJson
		},
		_sPlatformSupplierWithdrawApplicationList: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await sPlatformSupplierWithdrawApplicationList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData106 = resultData.supplierWithdrawList
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
.mb20 {
	margin-bottom: 20px;
}
.prefix-star {
	color: #ff6c60;
}
</style>
