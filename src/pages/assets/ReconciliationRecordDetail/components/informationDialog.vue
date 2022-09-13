<template>
	<div>
		<Dialog
			:title="titleS"
			:visible.sync="localVisible"
			:bottomBtn="sponsorBottomBtn"
			@before-close="empty"
			width="50%"
		>
			<yx-form
				style="margin-top: 60px"
				ref="dialog110"
				:inline="false"
				:rules="formRules"
				:items="uploadItem"
				:data="uploadData"
				labelWidth="80px"
			>
				<template #accessory>
					<el-upload
						class="w_file"
						ref="uploadFile"
						accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template"
						:action="uploadAttachmentList"
						multiple
						:headers="uploadHead"
						:limit="5"
						:fileList="fileList"
						:auto-upload="true"
						:before-remove="beforeRemove"
						:on-exceed="handleExceed"
						:on-change="onChange"
						:http-request="
							(file) => {
								uploadImageHttpRequest(file)
							}
						"
					>
						<el-button class="mr20" icon="el-icon-plus" slot="trigger"
							>上传文件</el-button
						>
					</el-upload>
				</template>
				<template #title>
					<h4 style="margin-left: -80px; margin-bottom: 0">基本信息</h4>
				</template>
				<template #label>
					<h4 style="margin-left: -80px; margin-bottom: 0">收款信息</h4>
				</template>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import { getBankAccountListByCondition } from '@/api/yhtPlusCmsFinance'
import { findSupplierAccountNumberForList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import { saveReconciliationExamination } from '@/api/reconciliation'
import { uploadAttachmentList } from '@/api/invoice'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		headTrailDialog: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
		Dialog,
	},

	data() {
		return {
			tempFileUrlList: [],
			fileList: [],
			supplierList: [],
			downloadList: [],
			supplierListMap: {}, // 商家映射
			bankList: [],
			bankListtMap: {}, // 账户映射
			timer: null,
			timerS: null,
			titleS: '首款审核提交',
			uploadAttachmentList: uploadAttachmentList,
			uploadData: {
				supplierName: '', // 商家名称
				supplierAccountNumberId: '', // 商家名称ID
				bankAccountId: '', // 账户ID
				actTotalAmount: '',
				realAmount: '',
				remark: '',
				prePaidAmount: '',
				copeAmount: '',
				refundAmount: '',
				filingAmount: '',
				actualAmount: '',
			},
			uploadItem: [
				{
					type: 'custom',
					dataIndex: 'title',
				},
				{
					type: 'select',
					title: '公司名称',
					dataIndex: 'supplierAccountNumberId',
					label: 'value',
					options: this.supplierList,
					selectAttributes: {
						filterable: true,
						filterMmethod: (val) => {
							if (this.timer) clearTimeout(this.timer)
							this.timer = setTimeout(() => {
								this.getSupplierAccountNumberList(val)
							}, 800)
						},
					},
				},
				{
					title: '活动总额',
					type: 'inputNumber',
					dataIndex: 'actTotalAmount',
				},
				{
					title: '付款金额',
					type: 'inputNumber',
					dataIndex: 'realAmount',
					hide: true,
				},
				{
					title: '已付金额',
					type: 'inputNumber',
					dataIndex: 'prePaidAmount',
					hide: true,
				},
				{
					title: '应付金额',
					type: 'inputNumber',
					dataIndex: 'copeAmount',
					hide: true,
				},
				{
					title: '发生退款',
					type: 'inputNumber',
					dataIndex: 'refundAmount',
					hide: true,
				},
				{
					title: '补款金额',
					type: 'inputNumber',
					dataIndex: 'filingAmount',
					hide: true,
				},
				{
					title: '实付金额',
					type: 'inputNumber',
					dataIndex: 'actualAmount',
					hide: true,
				},
				{
					type: 'custom',
					dataIndex: 'label',
				},
				{
					type: 'select',
					title: '付款账号',
					dataIndex: 'bankAccountId',
					label: 'value',
					options: this.bankList,
					selectAttributes: {
						filterable: true,
						filterMmethod: (val) => {
							if (this.timerS) clearTimeout(this.timerS)
							this.timerS = setTimeout(() => {
								this.getBankAccountListByCondition(val)
							}, 800)
						},
					},
				},
				{
					title: '审批备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
				{
					title: '附件',
					type: 'custom',
					dataIndex: 'accessory',
				},
			],
			formRules: {
				supplierAccountNumberId: [
					{ required: true, message: '请选择商家名称', trigger: 'blur' },
				],
				actTotalAmount: [
					{ required: true, message: '请输入活动总额', trigger: 'blur' },
				],
				realAmount: [
					{ required: true, message: '请输入付款金额', trigger: 'blur' },
				],
				prePaidAmount: [
					{ required: true, message: '请输入已付金额', trigger: 'blur' },
				],
				copeAmount: [
					{ required: true, message: '请输入应付金额', trigger: 'blur' },
				],
				refundAmount: [
					{ required: true, message: '请输入发生退款', trigger: 'blur' },
				],
				filingAmount: [
					{ required: true, message: '请输入补款金额', trigger: 'blur' },
				],
				actualAmount: [
					{ required: true, message: '请输入实付金额', trigger: 'blur' },
				],
				bankAccountId: [
					{ required: true, message: '请选择付款账号', trigger: 'blur' },
				],
				accessory: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.tempFileUrlList.length == 0) {
								callback(new Error('请上传附件!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			sponsorBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.dialog110.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.sponsorInformation()
							}
						})
					},
				},
			],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	// watch: {
	// 	itemInfo() {
	// 		this.init()
	// 	},
	// },
	created() {
		this.getSupplierAccountNumberList()
		this.getBankAccountListByCondition()
		this.initShow()
	},

	methods: {
		initShow() {
			if (!this.headTrailDialog) {
				this.titleS = '尾款审核提交'
				this.uploadItem.forEach((item) => {
					if (
						item.dataIndex === 'prePaidAmount' ||
						item.dataIndex === 'copeAmount' ||
						item.dataIndex === 'refundAmount' ||
						item.dataIndex === 'filingAmount' ||
						item.dataIndex === 'actualAmount'
					) {
						item.hide = false
					}
				})
			} else {
				this.uploadItem.forEach((item) => {
					if (item.dataIndex === 'realAmount') {
						item.hide = false
					}
				})
			}
		},
		async sponsorInformation() {
			let params = {
				actTotalAmount: this.uploadData.actTotalAmount,
				supplierAccountNumberId: this.uploadData.supplierAccountNumberId,
				bankAccountId: this.uploadData.bankAccountId,
				realAmount: this.uploadData.realAmount,
				prePaidAmount: this.uploadData.prePaidAmount,
				copeAmount: this.uploadData.copeAmount,
				refundAmount: this.uploadData.refundAmount,
				filingAmount: this.uploadData.filingAmount,
				actualAmount: this.uploadData.actualAmount,
				remark: this.uploadData.remark,
				tempFileUrlList: [],
				accessoryFileName: [],
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
				type: this.headTrailDialog ? 1 : 2, //首款
			}
			this.tempFileUrlList.map((item) => {
				params.tempFileUrlList.push(item.attachmentUrl)
				params.accessoryFileName.push(item.name)
			})
			const {
				data: { resultCode },
			} = await saveReconciliationExamination(params)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.empty()
				this.$emit('init')
				this.$emit('initTable')
			}
			console.log('params', params)
		},
		empty() {
			this.tempFileUrlList = []
			this.fileList = []
			this.supplierList = []
			this.supplierListMap = {} // 商家映射
			this.bankList = []
			this.bankListtMap = {} // 账户映射
			this.localVisible = false
			this.remark = ''
			this.uploadData = {
				supplierName: '', // 商家名称
				supplierAccountNumberId: '', // 商家名称ID
				bankAccountId: '', // 账户ID
				actTotalAmount: '',
				realAmount: '',
				remark: '',
				prePaidAmount: '',
				copeAmount: '',
				refundAmount: '',
				filingAmount: '',
				actualAmount: '',
			}
			this.$refs.dialog110.$refs.YxForm.clearValidate()
		},
		/** 自定义导入 */
		uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append('formId', '#accessoryForm')
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					attachmentType: 4,
				})
			)
			formData.append('excel', params.file)

			const {
				data: { resultCode, resultData },
			} = await uploadAttachmentList(formData, false)
			if (resultCode == 0) {
				this.$message.success('导入成功')
				resultData.attachmentList[0].name = params.file.name
				this.tempFileUrlList.push(...resultData.attachmentList)
			}
		},
		// 、、账户列表
		async getBankAccountListByCondition(val) {
			this.lookState = false
			const paramsData = {
				selectionTag: 2,
				startIndex: 0,
				length: 20,
			}

			if (val) {
				paramsData.keyword = val
			}
			this.bankList = []
			this.bankListtMap = {}
			const res = await getBankAccountListByCondition(paramsData)
			const bankAccountList = res.data.resultData.bankAccountList

			if (bankAccountList.length > 0) {
				this.bankList = bankAccountList.map((item) => {
					return {
						value:
							item.bankName + '-' + item.accountName + '-' + item.accountNumber,
						bankAccountId: item.bankAccountId,
					}
				})
				bankAccountList.map((item, index) => {
					this.bankListtMap[bankAccountList[index].bankName] =
						bankAccountList[index].bankAccountId
				})
				if (this.headTrailDialog) {
					this.uploadItem.forEach((item) => {
						if (item.dataIndex === 'bankAccountId') {
							item.options = this.bankList
						}
					})
				} else {
					this.uploadItem[10].options = this.bankList
				}
			} else {
				if (this.headTrailDialog) {
					this.uploadItem[5].options = []
				} else {
					this.uploadItem[10].options = []
				}
			}
		},
		// 商家账号列表
		async getSupplierAccountNumberList(val) {
			this.lookState = false
			const paramsData = {
				selectionTag: 2,
				startIndex: 0,
				length: 20,
			}

			if (val) {
				paramsData.keyword = val
			}
			this.supplierList = []
			this.supplierListMap = {}
			const res = await findSupplierAccountNumberForList(paramsData)
			const supplierAccountList = res.data.resultData.list

			if (supplierAccountList.length > 0) {
				this.supplierList = supplierAccountList.map((item) => {
					return {
						value: item.supplierName,
						supplierAccountNumberId: item.supplierAccountNumberId,
					}
				})

				supplierAccountList.map((item, index) => {
					this.supplierListMap[supplierAccountList[index].supplierName] =
						supplierAccountList[index].supplierAccountNumberId
				})
				this.uploadItem[1].options = this.supplierList
			} else {
				this.uploadItem[1].options = []
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
