<template>
	<div class="limitSupplementList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData104"
				:items="formCfg104"
				:formAction="formAction104"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns105"
				:pagination="page105"
				:data="tableData105"
			></yx-table>
			<Dialog
				:title="dialogTitle106"
				:visible="dialogVisible106"
				:width="dialogWidth106"
				:bottomBtn="dialogBottomBtn106"
				@before-close="dialogVisible106 = false"
			>
				<yx-form
					:inline="true"
					ref="addFormDialog"
					:data="formData107"
					:items="formCfg107"
					:formAction="formAction107"
					:rules="addRecordPopupFormRules"
					label-position="right"
					label-width="100px"
				>
					<template #selectClerk>
						<el-input
							v-model="formData107.selectClerk"
							placeholder="请选择员工"
							value-key="selectClerk"
							label="selectClerk"
							@focus="selectEmpoyee"
							clearable
							@clear="
								() => {
									formData107.selectClerk = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="employeeDialogVisible = true"
							></el-button>
						</el-input>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				title="编辑客服补款"
				:visible="editRecordPopupDialogVisible"
				width="30%"
				:bottomBtn="editRecordPopupDialogBottomBtn"
				@before-close="editRecordPopupDialogVisible = false"
			>
				<yx-form
					:inline="true"
					ref="editRecordDialog"
					:data="editRecordPopupFormData"
					:items="editRecordPopupFormCfg"
					label-position="right"
					label-width="100px"
					:rules="editRecordPopupFormRules"
				>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle108"
				:visible="dialogVisible108"
				:width="dialogWidth108"
				:bottomBtn="dialogBottomBtn108"
				@before-close="dialogVisible108 = false"
			>
				<yx-form
					:inline="true"
					ref="formDataDialog"
					label-position="right"
					label-width="120px"
					:data="formData109"
					:items="formCfg109"
					:formAction="formAction109"
					:rules="formActionRules109"
				>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle110"
				:visible="dialogVisible110"
				:width="dialogWidth110"
				:bottomBtn="dialogBottomBtn110"
				@before-close="dialogVisible110 = false"
			>
				<yx-form
					:inline="true"
					:data="formData111"
					:items="formCfg111"
					:formAction="formAction111"
				>
				</yx-form
				><yx-table
					:select="false"
					v-loading="loading110"
					:columns="tableColumns112"
					:pagination="page112"
					:data="tableData112"
				></yx-table>
			</Dialog>

			<selectedEmployeeDialog
				:dialogVisible.sync="employeeDialogVisible"
				:selectedList.sync="employeeList"
			></selectedEmployeeDialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import selectedEmployeeDialog from '@/components/EmployeeDialog'
import { isNull } from '@/utils/helper/common'
import {
	getRefundLimitListByParam,
	addRefundLimit,
	addRefundLimitRecord,
	getRefundLimitRecordListByParam,
	updateRefundLimit,
} from '@/api/yhtPlusCmsOrder'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		selectedEmployeeDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			loading110: false,
			formData104: {
				keyword: '',
			},
			formCfg104: [
				{
					type: 'input',
					title: '客服名称',
					dataIndex: 'keyword',
				},
			],
			formAction104: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData105(true)
					},
					tableId: 105,
					api: 'getRefundLimitListByParam',
				},
				{
					title: '新增客服补款',
					type: 'success',
					auth: 'addRefundLimit',
					click: (row) => {
						this.activeRow = row
						this.dialogVisible106 = true
						this.employeeList = []
						this.formData107 = {
							selectClerk: '',
							dailyAmount: '',
						}
					},
					dialogId: 106,
				},
			],
			tableData105: [],
			tableColumns105: [
				{
					type: 'string',
					dataIndex: 'clerkId',
					title: '客服ID',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '客服名称',
				},
				{
					type: 'amount',
					dataIndex: 'dailyAmount',
					title: '日补款金额',
				},
				{
					dataIndex: 'differenceAmount',
					title: '剩余金额',
					customRender: (row) => {
						return (
							'￥' +
							Number(
								row.dailyAmount - row.refundAmount + row.tempAmount
							).toFixed(2)
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'tempAmount',
					title: '临时补款金额',
				},
				{
					type: 'action',
					title: '操作',
					width: '300',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'updateRefundLimit',
							click: (row) => {
								this.activeRow = row
								this.editRecordPopupFormData.selectClerk = row.clerkName
								this.editRecordPopupFormData.dailyAmount = row.dailyAmount
								this.editRecordPopupDialogVisible = true
							},
							dialogId: 106,
						},
						{
							title: '添加临时额度',
							auth: 'addRefundLimitRecord',
							click: (row) => {
								this.activeRow = row
								this.dialogVisible108 = true
								this.formData109 = {
									tempAmount: '',
								}
							},
						},
						{
							title: '查看临时额度记录',
							auth: 'getRefundLimitRecordListByParam',
							click: (row) => {
								this.activeRow = row
								this.dialogVisible110 = true
								this.getData112(true)
							},
						},
					],
				},
			],
			page105: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData105()
				},
			},
			dialogTitle106: '新增客服补款',
			dialogWidth106: '600px',
			dialogVisible106: false,
			dialogBottomBtn106: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.addFormDialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								this.handleSubmitDialog106()
							}
						})
					},
				},
			],
			formData107: {
				selectClerk: '',
				dailyAmount: '',
			},
			formCfg107: [
				{
					type: 'custom',
					title: '选择客服',
					dataIndex: 'selectClerk',
				},
				{
					type: 'inputNumber',
					title: '日补款金额',
					dataIndex: 'dailyAmount',
				},
			],
			formAction107: [],
			editRecordPopupDialogVisible: false,
			editRecordPopupDialogBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.editRecordDialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								this.handleEditRecordDialog()
							}
						})
					},
				},
			],
			editRecordPopupFormData: {
				selectClerk: '',
				dailyAmount: '',
			},
			editRecordPopupFormCfg: [
				{
					type: 'input',
					title: '选择客服',
					dataIndex: 'selectClerk',
					disabled: true,
				},
				{
					type: 'inputNumber',
					title: '日补款金额',
					dataIndex: 'dailyAmount',
				},
			],
			editRecordPopupFormRules: {
				dailyAmount: [
					{ required: true, message: '请输入日补款金额!', trigger: 'blur' },
					{ pattern: /^[1-9]\d*(\.\d+)?$/i, message: '请输入大于0的数值' },
				],
			},
			addRecordPopupFormRules: {
				dailyAmount: [
					{ required: true, message: '请输入日补款金额!', trigger: 'blur' },
					{ pattern: /^[1-9]\d*(\.\d+)?$/i, message: '请输入大于0的数值' },
				],
			},
			dialogTitle108: '添加临时补款',
			dialogWidth108: '30%',
			dialogVisible108: false,
			dialogBottomBtn108: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.formDataDialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								this.handleSubmitDialog108()
							}
						})
					},
				},
			],
			formData109: {
				tempAmount: '',
			},
			formCfg109: [
				{
					type: 'inputNumber',
					title: '临时补款金额',
					dataIndex: 'tempAmount',
				},
			],
			formAction109: [],
			formActionRules109: {
				tempAmount: [
					{ required: true, message: '请输入临时补款金额!', trigger: 'blur' },
					{ pattern: /^[1-9]\d*(\.\d+)?$/i, message: '请输入大于0的数值' },
				],
			},
			dialogTitle110: '临时额度记录',
			dialogWidth110: '70%',
			dialogVisible110: false,
			dialogBottomBtn110: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.dialogVisible110 = false
					},
					dialogType: 'closeDialog',
				},
			],
			formData111: {
				addTimeStart: '',
				addTimeEnd: '',
			},
			formCfg111: [
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction111: [
				{
					title: '重置',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (!this.loading) this.getData112(true)
					},
					tableId: 112,
					api: 'getRefundLimitRecordListByParam',
				},
			],
			tableData112: [],
			tableColumns112: [
				{
					type: 'amount',
					dataIndex: 'tempAmount',
					title: '添加补款金额',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '客服姓名',
				},
				{
					title: '操作人',
					type: 'string',
					dataIndex: 'operatorName',
				},
			],
			page112: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData112()
				},
			},
			employeeDialogVisible: false,
			employeeList: [],
		}
	},

	watch: {
		employeeList: {
			handler(val) {
				val.length > 0 && (this.formData107.selectClerk = val[0].clerkName)
			},
			deep: true,
		},
	},
	created() {
		this.getData105(true)
	},

	methods: {
		async getData105(flag) {
			this.loading = true
			let paramJson = this.findSearchParams105(flag)
			const {
				data: { resultCode, resultData },
			} = await getRefundLimitListByParam(paramJson)
			if (resultCode === 0) {
				this.tableData105 = resultData.refundLimitList
				this.page105.count = resultData.count
			}
			this.loading = false
		},
		async getData112(flag) {
			let paramJson = this.findSearchParams112(flag)
			this.loading110 = true
			Object.assign(paramJson, {
				clerkId: this.activeRow.clerkId,
				refundLimitId: this.activeRow.refundLimitId,
			})
			const {
				data: { resultCode, resultData },
			} = await getRefundLimitRecordListByParam(paramJson)
			if (resultCode === 0) {
				this.tableData112 = resultData.refundLimitRecordList
				this.page112.count = resultData.count
				this.loading110 = false
			}
		},
		findSearchParams105(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			const paramJson = Object.assign(this.formData104, {
				length: this.page105.length,
				startIndex: (this.page105.currentPage - 1) * this.page105.length,
			})
			return paramJson
		},
		findSearchParams112(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			const paramJson = Object.assign(this.formData111, {
				length: this.page105.length,
				startIndex: (this.page105.currentPage - 1) * this.page105.length,
			})
			return paramJson
		},
		async handleSubmitDialog106() {
			let addEmployee = this.employeeList[0]
			if (!addEmployee || isNull(this.formData107.dailyAmount)) {
				return this.$message.warning('请填写必填项')
			}
			const formData = {
				clerkId: this.employeeList[0].clerkId,
				dailyAmount: this.formData107.dailyAmount,
			}
			const {
				data: { resultCode, resultMsg },
			} = await addRefundLimit(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.getData105(true)
				this.dialogVisible106 = false
			}
			this.dialogVisible106 = false
		},
		async handleSubmitDialog108() {
			let formData = {
				clerkId: this.activeRow.clerkId,
				refundLimitId: this.activeRow.refundLimitId,
				tempAmount: this.formData109.tempAmount,
			}
			if (isNull(formData.tempAmount)) {
				return this.$message.warning('请填写补款金额')
			}
			const {
				data: { resultCode, resultMsg },
			} = await addRefundLimitRecord(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.getData105(true)
				this.dialogVisible108 = false
			}
		},
		async handleEditRecordDialog() {
			const formData = this.editRecordPopupFormData
			if (!this.editRecordPopupFormData.dailyAmount)
				return this.$message.warning('请填写必填项')
			Object.assign(formData, {
				clerkId: this.activeRow.clerkId,
				refundLimitId: this.activeRow.refundLimitId,
			})
			const {
				data: { resultCode, resultMsg },
			} = await updateRefundLimit(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.editRecordPopupDialogVisible = false
				this.getData105(true)
			}
		},
		// 选择员工列表
		selectEmpoyee(e) {
			e.target.blur()
			this.employeeDialogVisible = true
		},
	},
}
</script>
