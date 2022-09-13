<template>
	<basic-container>
		<div>
			<!-- 条件筛选 -->
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template #supplierName>
					<el-input
						v-model="searchData.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								searchData.supplierName = ''
								searchData.supplierId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<!-- 表单列表 -->
			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<!-- 审核弹窗 -->
		<Dialog
			title="审核"
			:visible="auditDialogVisible"
			width="50%"
			:bottomBtn="auditDialogBottomBtn"
			@before-close="auditDialogVisible = false"
		>
			<el-form :model="form">
				<el-form-item
					:label="auditDialogCfg.formLabel"
					:label-width="formLabelWidth"
				>
					<el-input
						type="textarea"
						v-model="auditDialogCfg.feedback"
						maxlength="20"
					></el-input>
				</el-form-item>
			</el-form>
		</Dialog>
		<!-- 商家/商家列表 -->
		<supply-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				(row) => {
					searchData.supplierName = row.supplierName
					searchData.supplierId = row.supplierId
				}
			"
		/>
		<bank-info-dialog
			:visible="bankInfoDialogVisible"
			@update:visible="bankInfoDialogVisibleUpdate"
			:bankAccountId="bankInfoDialogId"
		/>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import moment from 'moment'
import Dialog from '@/components/Dialog'
import BankInfoDialog from '../BankInfoDialog'
import SupplyDialog from '@/components/SupplyDialog'
import {
	supplierWithdrawAuditList,
	auditSupplierWithdrawApply,
	withdrawSwitch,
} from '@/api/yhtPlusCmsFinance'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		BankInfoDialog,
		Dialog,
		SupplyDialog,
	},

	name: 'FormTable',

	data() {
		return {
			gatewayEnable: false,
			loading: false,
			auditDialogVisible: false,
			formsDialog: false,
			auditDialogCfg: {
				title: '审核意见(选填，不超过20字)',
				formLabel: '审核意见(选填，不超过20字)',
				feedback: '',
				type: '',
				auditRowInfo: {},
			},
			auditDialogBottomBtn: [
				{
					title: '取 消',
					type: '',
					click: () => {
						this.auditDialogVisible = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.handleClickAudit()
					},
				},
			],
			bankInfoDialogVisible: false,
			bankInfoDialogId: 0,
			numberFormat: numberFormat,
			searchData: {
				supplierName: '',
				supplierId: '',
				status: '',
				startTime: moment().startOf('day').valueOf() - 172800000, // 开始时间, 172800000为48小时时间戳
				endTime: moment().endOf('day').valueOf(), // 结束时间
			},
			searchCfg: [
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
					change: () => {
						// this.init(true)
					},
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					type: 'select',
					title: '审批状态',
					dataIndex: 'status',
					label: 'value',
					options:
						this.$store.state.app.constant.MERCHANT_WITHDRAW_AUDIT_STATUS,
					change: () => {
						// this.init()
					},
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'supplierWithdrawAuditId',
					title: '待审批ID',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					dataIndex: 'addTime',
					title: '发起时间',
					type: 'date',
				},
				{
					dataIndex: 'auditTime',
					title: '审批时间',
					type: 'date',
				},
				{
					dataIndex: 'amount',
					title: '发起提现金额',
					width: '120',
					type: 'amount',
				},
				{
					dataIndex: 'withdrawRemark',
					title: '提现备注',
				},
				{
					type: 'action',
					title: '提现银行卡信息',
					width: '120',
					actions: [
						{
							title: '查看',
							auth: 'getBankAccountInfo',
							click: (row) => {
								this.showBankCardInfo(row)
							},
						},
					],
				},
				{
					dataIndex: 'auditStatus',
					title: '状态',
					customRender: (row) => {
						const optionsArr = ['', '待审批', '审批不通过', '审批通过']
						return optionsArr[row.auditStatus]
					},
				},
				{
					dataIndex: 'userName',
					title: '审批人',
				},
				{
					dataIndex: 'auditRemark',
					title: '审批意见',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '审核通过',
							auth: 'auditSupplierWithdrawApply',
							click: (row) => {
								this.handleFormAction(row, 'auditPass')
							},
							customRender: (action, row) => {
								const hideStatus = row.auditStatus === 1 ? false : true
								action.hide = hideStatus
								return action
							},
						},
						{
							title: '审核不通过',
							auth: 'auditSupplierWithdrawApply',
							click: (row) => {
								this.handleFormAction(row, 'auditNotPass')
							},
							customRender: (action, row) => {
								const hideStatus = row.auditStatus === 1 ? false : true
								action.hide = hideStatus
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		// this.init(true)
		this._withdrawSwitch()
	},

	watch: {
		'searchData.supplierName': function () {
			if (this.searchData.supplierName === '') {
				this.searchData.supplierId = ''
			}
		},
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
		// 初始化及筛选审核列表数据
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await supplierWithdrawAuditList(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.supplierWithdrawAuditBOS) {
				this.tableData = resultData.supplierWithdrawAuditBOS
				this.page.count = resultData.count
			}
			this.loading = false
		},
		// 处理审核表单 => 操作中的按钮
		handleFormAction(row, type) {
			switch (type) {
				case 'auditPass':
					this.auditDialogCfg = {
						title: '请确认是否审核通过？',
						formLabel: '审核意见(选填，不超过20字)',
						feedback: '',
						type,
						auditRowInfo: row,
					}
					this.auditDialogVisible = true
					break
				case 'auditNotPass':
					this.auditDialogCfg = {
						title: '请确认是否审核不通过？',
						formLabel: '审核意见(必填，不超过20字)',
						feedback: '',
						type,
						auditRowInfo: row,
					}
					this.auditDialogVisible = true
					break
				default:
					break
			}
		},
		// 确定发起审核
		async handleClickAudit() {
			const id = this.auditDialogCfg.auditRowInfo.supplierWithdrawAuditId
			const feedback = this.auditDialogCfg.feedback
			const type = this.auditDialogCfg.type
			if (type === 'auditNotPass' && feedback.trim() === '')
				return this.$message.error('请填写审核意见')
			const paramJson = {
				supplierWithdrawAuditId: id,
				auditStatus: type === 'auditPass' ? 1 : 2,
				auditRemark: feedback,
				gatewayEnable: this.gatewayEnable,
			}
			const {
				data: { resultCode },
			} = await auditSupplierWithdrawApply(paramJson)
			if (resultCode == 0) {
				this.$message.success('操作成功')
				this.init()
			}
			this.auditDialogVisible = false
		},
		// 显示银行卡信息
		showBankCardInfo(row) {
			// console.log(row.bankAccountId)
			this.bankInfoDialogId = row.bankAccountId
			this.bankInfoDialogVisible = true
		},
		// 关闭银行卡弹窗组件
		bankInfoDialogVisibleUpdate() {
			this.bankInfoDialogVisible = false
			this.bankInfoDialogId = 0
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		// 设置添加时间段
		setDatetimerange(data) {
			let startTime =
				moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
			this.searchData.startTime = startTime
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
	},
}
</script>
