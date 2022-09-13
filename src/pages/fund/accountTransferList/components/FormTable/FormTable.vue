<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template slot="datetimerBtn">
					<el-button type="text" @click="setDatetimerange(7)">近7天</el-button>
					<el-button type="text" @click="setDatetimerange(15)"
						>近15天</el-button
					>
					<el-button type="text" @click="setDatetimerange(30)"
						>近30天</el-button
					>
				</template>
			</yx-form>

			<el-row>
				<div style="float: right">
					<!-- <el-button size="small" @click="_exportTransfer" type="primary"
						>导出</el-button
					> -->
					<el-button
						size="small"
						v-auth="'batchAuditTransferAmountRecord'"
						@click="_batch(3)"
						type="primary"
						>批量审核通过</el-button
					>
					<el-button
						size="small"
						@click="_batch(4)"
						v-auth="'batchAuditTransferAmountRecord'"
						type="primary"
						>批量审核不通过</el-button
					>
				</div>
				<div class="amount_box">
					转账金额<span>￥{{ numberFormat(transferSum, 2) }}</span
					>元,笔数<span>{{ transferCount }}</span
					>笔
				</div>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:select="true"
					:data="tableData"
					:selectionChange="selectionChange"
				>
					<template slot="transferringAccount" slot-scope="scope">
						<div>
							<p>{{ scope.row.transferOutAccountName }}</p>
							<p>{{ scope.row.transferOutAccountId }}</p>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<!-- //审核原因 -->
		<Dialog
			:title="titleDialog"
			:visible="reviewReasonLoding"
			width="50%"
			:bottomBtn="reviewReasonBottomBtn"
			@before-close="reviewReasonLoding = false"
		>
			<span
				>确认是否{{ titleDialog }}<br />备注，{{
					clickPlace == 2 || clickPlace == 4 ? '' : '非'
				}}必填，不超过50字</span
			>
			<el-input
				type="textarea"
				v-model.trim="transferRemark"
				maxlength="50"
				:autosize="{ minRows: 2, maxRows: 4 }"
				placeholder="请输入原因"
			></el-input>
		</Dialog>
		<!-- //查看操作记录 -->
		<Dialog
			:title="'操作记录'"
			:visible="operationRecordsLoding"
			width="50%"
			:bottomBtn="operationRecordsBottomBtn"
			@before-close="operationRecordsLoding = false"
		>
			<yx-table
				v-loading="operationLoading"
				:columns="operationTableColumns"
				:data="operationTableData"
			>
			</yx-table>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import {
	getConstantValueByKey,
	numberFormat,
	// downloadFile,
} from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import {
	forsTransferRecords,
	listOperationRecord,
	batchAuditTransferAmountRecord,
} from '@/api/accountService'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			showLoading: false,
			operationLoading: false,
			reviewReasonLoding: false,
			operationRecordsLoding: false,
			vertical: {},
			clickPlace: 0,
			titleDialog: '',
			transferRemark: '',
			transferSum: 0, // 转账金额
			transferCount: 0, // 笔数
			selectionData: [],
			searchData: {
				transferInAccountName: '', // 转入账户名称
				transferStatus: '', // 转账状态
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				approvalStatus: '', // 审核状态
			},
			orderStatus: [],
			reviewReasonBottomBtn: [
				{
					title: '确定',
					click: () => {
						this._audit()
					},
				},
			],
			searchCfg: [
				{
					type: 'input',
					title: '转入账户名称',
					dataIndex: 'transferInAccountName',
				},

				{
					type: 'select',
					title: '转账状态',
					dataIndex: 'transferStatus',
					options: this.$store.state.app.constant.TRANSFER_STATE,
					label: 'value',
				},
				{
					type: 'select',
					title: '审批状态',
					dataIndex: 'approvalStatus',
					options: this.$store.state.app.constant.APPROVAL_STATUS,
					label: 'value',
				},

				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
				{
					type: 'custom',
					dataIndex: 'datetimerBtn',
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
						this._fundAccountTransferList(true)
					},
				},
			],
			operationTableData: [],
			operationTableColumns: [
				{
					type: 'string',
					dataIndex: 'operatiorName',
					title: '操作人',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '操作时间',
				},
				{
					type: 'string',
					dataIndex: 'operationStatus',
					title: '操作状态',
					customRender: (row) => {
						return row.operationStatus == 1
							? '发起转账'
							: row.operationStatus == 2
							? '审批通过'
							: row.operationStatus == 3
							? '审批不通过'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'operationRemark',
					title: '备注',
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'transferSn',
					title: '转账单号',
				},
				{
					type: 'string',
					dataIndex: 'transferOutAccountName',
					title: '转出账户名称',
				},
				{
					type: 'string',
					dataIndex: 'transferInAccountName',
					title: '转入账户名称',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '转账金额',
				},
				{
					type: 'string',
					dataIndex: 'transferRemark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'transferStatus',
					title: '转账状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.TRANSFER_STATE,
							row.transferStatus,
							'-',
							'transferStatus'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'errorRemark',
					title: '异常备注',
				},
				{
					type: 'string',
					dataIndex: 'originatorName',
					title: '发起人',
				},
				{
					type: 'string',
					dataIndex: 'approvalStatus',
					title: '审批状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.APPROVAL_STATUS,
							row.approvalStatus,
							'-',
							'approvalStatus'
						)
					},
				},
				{
					type: 'action',
					width: 150,
					title: '操作',
					actions: [
						{
							title: '审核通过',
							auth: 'batchAuditTransferAmountRecord',
							click: (row) => {
								this.reviewReasonLoding = true
								this.transferRemark = ''
								this.vertical = row
								this.clickPlace = 1
								this.titleDialog = '审核通过'
							},
							customRender: (action, row) => {
								action.hide = row.approvalStatus != 1
								return action
							},
						},
						{
							title: '审核不通过',
							auth: 'batchAuditTransferAmountRecord',
							click: (row) => {
								this.reviewReasonLoding = true
								this.transferRemark = ''
								this.vertical = row
								this.clickPlace = 2
								this.titleDialog = '审核不通过'
							},
							customRender: (action, row) => {
								action.hide = row.approvalStatus != 1
								return action
							},
						},
						{
							title: '查看操作记录',
							auth: 'listOperationRecord',
							click: (row) => {
								this._operationRecords(row.transferAmountRecordId)
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
					this._fundAccountTransferList()
				},
			},
		}
	},

	created() {
		this._fundAccountTransferList(true)
	},

	methods: {
		//操作记录
		_operationRecords: async function (transferAmountRecordId) {
			this.operationRecordsLoding = true
			this.operationLoading = true
			let {
				data: { resultCode, resultData },
			} = await listOperationRecord({
				transferAmountRecordId,
			})
			this.operationLoading = false
			if (resultCode == 0) {
				this.operationTableData = resultData
			}
		},
		// 、、批量审核
		_batch(v) {
			if (this.selectionData.length == 0) {
				return this.$message.warning('请勾选批量数据')
			}
			this.transferRemark = ''

			this.clickPlace = v
			this.titleDialog = v == 3 ? '批量审核通过' : '批量审核不通过'
			this.reviewReasonLoding = true
		},
		_audit: async function () {
			let paramJson = {
				infoDTO: {},
			}
			if (this.clickPlace <= 2) {
				paramJson.ids = [this.vertical.transferAmountRecordId]
			} else {
				paramJson.ids = []
				this.selectionData.map((item) => {
					if (item.approvalStatus == 1) {
						paramJson.ids.push(item.transferAmountRecordId)
					}
				})
			}
			if (paramJson.ids.length == 0) {
				return this.$message.warning('请勾选可批量操作的数据')
			}
			if (
				!this.transferRemark &&
				(this.clickPlace == 2 || this.clickPlace == 4)
			) {
				return this.$message.warning('请输入备注')
			}
			paramJson.infoDTO.approvalStatus =
				this.clickPlace == 1 || this.clickPlace == 3 ? 2 : 3
			paramJson.infoDTO.remark = this.transferRemark
			paramJson.infoDTO.userId = this.$store.state.user.userInfo.userId
			paramJson.infoDTO.userName = this.$store.state.user.userInfo.clerkName
			console.log('idsidsidsids', paramJson)
			let {
				data: { resultCode },
			} = await batchAuditTransferAmountRecord(paramJson)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.reviewReasonLoding = false
				this._fundAccountTransferList()
			}
		},
		//勾选
		selectionChange(row) {
			this.selectionData = row
		},
		// //导出
		// _exportTransfer: async function () {
		// 	let paramJson = Object.assign({}, this.searchData)
		// 	let { data } = await forsTransferRecords({
		// 		data: JSON.stringify(paramJson),
		// 	})
		// 	downloadFile(data, '账户转账业务.xlsx')
		// },
		setDatetimerange(data) {
			// 设置添加时间段
			let startTime =
				moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
			this.searchData.addTimeStart = startTime
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_fundAccountTransferList: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { transferAmountSum = 0, recordList = [], count = 0 },
				},
			} = await forsTransferRecords(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.transferCount = count
				this.transferSum = transferAmountSum
				this.tableData = recordList
				this.page.count = count
			} else {
				this.transferCount = 0
				this.transferSum = 0
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
	}
}
</style>
