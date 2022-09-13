<template>
	<div class="refundList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-accounts :items="accountItems104"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="wechatPhone" slot-scope="scope">
					<el-popover
						placement="top-start"
						width="120"
						popper-class="popperClass"
						trigger="click"
						:disabled="scope.row.lockStatus == 1 ? false : true"
						:content="visiblePhone"
					>
						<div
							slot="reference"
							@click="showPhone(scope.row)"
							style="cursor: pointer"
							:title="scope.row.lockStatus === 1 ? '点击获取手机号' : ''"
						>
							{{
								scope.row.lockStatus === 1
									? scope.row.wechatPhone
									: '***********'
							}}
						</div>
					</el-popover>
				</template>
				<template slot="qrCode" slot-scope="scope">
					<div v-if="scope.row.qrCode">
						<div v-if="scope.row.lockStatus === 1">
							<el-image
								style="width: 120px; height: 120px"
								:src="getBigImg(scope.row.qrCode)"
								:preview-src-list="[getBigImg(scope.row.qrCode)]"
							>
							</el-image>
						</div>
						<div v-else>锁定后显示</div>
					</div>
					<div v-else>-</div>
				</template>
			</yx-table>
			<Dialog
				title="详情"
				:visible="dialogVisible105"
				width="500px"
				:bottomBtn="dialogBottomBtn105"
				@before-close="
					() => {
						dialogVisible105 = false
						formData106 = {
							withdrawStatus: '',
							withdrawResp: '',
						}
					}
				"
			>
				<yx-form
					:inline="false"
					:data="formData106"
					:items="formCfg106"
					label-position="right"
					label-width="120px"
				>
				</yx-form>
			</Dialog>
			<Dialog
				:title="transferDialogTitle"
				:visible="transferDialogVisible"
				width="500px"
				@before-close="closeTransferDialog"
			>
				<yx-form
					:inline="false"
					:data="transferDialogFormData"
					:items="transferDialogFormCfg"
					:formAction="transferDialogFormAction"
					label-position="right"
					label-width="120px"
					:rules="transferDialogRules"
				>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { downloadFile } from '@/utils/helper/common'
import store from '@/store'
import {
	listUserCompensationWithdraw,
	exportListUserCompensationWithdraw,
	transferFailedUserCompensationWithdraw,
	transferSuccessUserCompensationWithdraw,
	lockUserCompensationWithdraw,
} from '@/api/yhtPlusCmsUserCompensationWithdraw'

import { detailUserCompensationWithdraw } from '@/api/yhtPlusUserCompensationWithdrawAccount.js'
import { getBigImg } from '@/utils/imageTool'
import { findUserCompensationPhoneById } from '@/api/showPhone'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
		Dialog,
	},
	data() {
		return {
			loading: false,
			getBigImg,
			activeRow: {},
			operateType: '',
			userInfo: {},
			formData101: {
				paramUserId: '',
				transactionSn: '',
				withdrawStatus: '',
				lockStatus: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				finishTimeStart: '',
				finishTimeEnd: '',
				wechatPhone: '',
				lockUserName: '',
				transferUserName: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '用户ID',
					dataIndex: 'paramUserId',
					placeholder: '精确筛选',
				},
				{
					type: 'input',
					title: '交易流水号',
					dataIndex: 'transactionSn',
					placeholder: '精确筛选',
				},
				{
					title: '转账状态',
					type: 'select',
					dataIndex: 'withdrawStatus',
					label: 'value',
					options: [
						{
							value: '全部',
							withdrawStatus: '',
						},
						{
							value: '转账中',
							withdrawStatus: '2',
						},
						{
							value: '转账成功',
							withdrawStatus: '3',
						},
						{
							value: '转账失败',
							withdrawStatus: '4',
						},
					],
				},
				{
					title: '锁定状态',
					type: 'select',
					dataIndex: 'lockStatus',
					label: 'value',
					options: [
						{
							value: '全部',
							lockStatus: '',
						},
						{
							value: '未锁定',
							lockStatus: '0',
						},
						{
							value: '已锁定',
							lockStatus: '1',
						},
					],
				},
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'wechatPhone',
					placeholder: '精确筛选',
				},
				{
					type: 'input',
					title: '锁定人',
					dataIndex: 'lockUserName',
					placeholder: '精确筛选',
				},
				{
					type: 'input',
					title: '转账人',
					dataIndex: 'transferUserName',
					placeholder: '精确筛选',
				},
				{
					title: '发起时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '到账时间',
					type: 'datetimerange',
					dataIndex: ['finishTimeStart', 'finishTimeEnd'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction101: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportListUserCompensationWithdraw',
					click: () => {
						this.$confirm('确定导出补偿转账列表？', '提示', {
							type: 'warning',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.formData101
									paramJson.transferType = 1

									let { data } = await exportListUserCompensationWithdraw(
										paramJson
									)
									downloadFile(data, '补偿转账列表.xlsx')
								}
							},
						})
					},
				},
			],
			accountItems104: [
				{
					type: 'amount',
					title: '发起转账总金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '转账成功总金额',
					value: '0.00',
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					title: '转账ID',
					dataIndex: 'userCompensationWithdrawId',
				},
				{
					type: 'string',
					title: '交易流水号',
					dataIndex: 'transactionSn',
					width: '140',
				},
				{
					type: 'string',
					title: '用户ID',
					dataIndex: 'userId',
				},
				{
					type: 'amount',
					title: '转账金额',
					dataIndex: 'amount',
				},
				{
					title: '手续费',
					type: 'amount',
					dataIndex: 'withdrawCommission',
				},
				{
					title: '实际到账金额',
					type: 'amount',
					dataIndex: 'actualAmount',
				},
				{
					type: 'custom',
					title: '手机号',
					dataIndex: 'wechatPhone',
				},
				{
					type: 'custom',
					title: '收款码',
					dataIndex: 'qrCode',
					width: '150',
				},
				{
					title: '锁定状态',
					type: 'string',
					dataIndex: 'lockStatus',
					customRender: (row) => {
						const optionsArr = ['未锁定', '已锁定']
						return optionsArr[row.lockStatus]
					},
				},
				{
					title: '转账状态',
					type: 'string',
					dataIndex: 'withdrawStatus',
					customRender: (row) => {
						const optionsArr = ['', '待转账', '转账中', '转账成功', '转账失败']
						return optionsArr[row.withdrawStatus]
					},
				},
				{
					title: '发起转账时间',
					type: 'date',
					dataIndex: 'addTime',
					width: '150',
				},
				{
					title: '到账时间',
					type: 'date',
					dataIndex: 'finishTime',
					width: '150',
				},
				{
					type: 'string',
					title: '锁定人',
					dataIndex: 'lockUserName',
				},
				{
					type: 'string',
					title: '转账人',
					dataIndex: 'transferUserName',
				},
				{
					title: '反馈',
					type: 'string',
					dataIndex: 'withdrawResp',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							customRender: (action, row) => {
								action.hide =
									(row.withdrawStatus == 3 || row.withdrawStatus == 4) &&
									row.lockStatus == 1
										? false
										: true
								return action
							},
							click: async (row) => {
								const {
									data: { resultCode, resultData },
								} = await detailUserCompensationWithdraw({
									paramUserId: row.userId,
									userCompensationWithdrawId: row.userCompensationWithdrawId,
								})
								if (resultCode == 0) {
									this.formData106 = {
										withdrawStatus: [
											'',
											'待转账',
											'转账中',
											'转账成功',
											'转账失败',
										][resultData.withdrawStatus],
										withdrawResp: resultData.withdrawResp,
									}
									this.dialogVisible105 = true
								}
							},
						},
						{
							title: '锁定',
							auth: 'lockUserCompensationWithdraw',
							customRender: (action, row) => {
								action.hide = row.lockStatus == 0 ? false : true
								return action
							},
							popconfirm: true,
							popconfirmTitle:
								'锁定后，其他客服不会对此记录进行转账处理，您要对此记录进行转账',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.operateWithdraw(lockUserCompensationWithdraw, {
									userCompensationWithdrawId: row.userCompensationWithdrawId,
									lockUserId: this.userInfo.userId,
									lockUserName: this.userInfo.userName,
								})
							},
						},
						{
							title: '转账成功',
							auth: 'transferSuccessUserCompensationWithdraw',
							customRender: (action, row) => {
								action.hide =
									row.lockStatus == 1 && row.withdrawStatus == 2 ? false : true
								return action
							},
							click: async (row) => {
								this.activeRow = row
								this.transferDialogTitle = '确定转账成功？'
								this.operateType = 0
								this.transferDialogVisible = true
							},
						},
						{
							title: '转账失败',
							auth: 'transferFailedUserCompensationWithdraw',
							customRender: (action, row) => {
								action.hide =
									row.lockStatus == 1 && row.withdrawStatus == 2 ? false : true
								return action
							},
							click: async (row) => {
								this.activeRow = row
								this.transferDialogTitle = '确定转账失败？'
								this.operateType = 1
								this.transferDialogVisible = true
								this.transferDialogRules = {
									withdrawResp: [
										{ required: true, message: '请填写反馈!', trigger: 'blur' },
									],
								}
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible105 = false
					},
				},
			],
			formData106: {
				withdrawStatus: '',
				withdrawResp: '',
			},
			formCfg106: [
				{
					type: 'text',
					title: '转账状态',
					dataIndex: 'withdrawStatus',
				},
				{
					type: 'text',
					title: '反馈',
					dataIndex: 'withdrawResp',
				},
			],
			transferDialogTitle: '确定转账成功？',
			transferDialogVisible: false,
			transferDialogFormData: {
				withdrawResp: '',
			},
			transferDialogFormCfg: [
				{
					type: 'textarea',
					title: '反馈',
					dataIndex: 'withdrawResp',
				},
			],
			transferDialogFormAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						const requestApiList = [
							transferSuccessUserCompensationWithdraw,
							transferFailedUserCompensationWithdraw,
						]
						this.operateWithdraw(requestApiList[this.operateType], {
							userCompensationWithdrawId:
								this.activeRow.userCompensationWithdrawId,
							transferUserName: this.userInfo.userName,
							transferUserId: this.userInfo.userId,
							withdrawResp: this.transferDialogFormData.withdrawResp,
						})
						this.transferDialogVisible = false
						this.transferDialogFormData = {
							withdrawResp: '',
						}
						this.transferDialogRules = {}
					},
				},
			],
			transferDialogRules: {},
			visiblePhone: '***********',
		}
	},
	mounted() {
		this.userInfo = store.state.user.userInfo
	},
	methods: {
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			paramJson.transferType = 1
			const {
				data: { resultCode, resultData },
			} = await listUserCompensationWithdraw(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.pageResult.records
				this.page102.count = resultData.pageResult.total
				this.accountItems104[0].value = resultData.totalAmount
				this.accountItems104[1].value = resultData.succeedTotalAmount
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
		async showPhone(rowData) {
			if (rowData.lockStatus != 1) {
				return false
			}
			this.visiblePhone = '***********'
			let {
				data: { resultCode, resultData },
			} = await findUserCompensationPhoneById({
				id: rowData.userCompensationWithdrawId,
			})
			if (resultCode == 0) {
				this.visiblePhone = resultData
			}
		},
		// 关闭转账确认弹窗
		closeTransferDialog() {
			this.transferDialogVisible = false
			this.transferDialogFormData = {
				withdrawResp: '',
			}
			this.transferDialogRules = {}
		},
		// 发起操作请求
		async operateWithdraw(requestApi, params) {
			const {
				data: { resultCode, resultMsg },
			} = await requestApi(params)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData102(true)
			}
		},
	},
}
</script>
<style lang="scss">
.popperClass {
	text-align: center;
}
</style>
