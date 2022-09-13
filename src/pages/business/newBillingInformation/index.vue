<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				labelWidth="120px"
				:data="formData105"
				:items="formCfg105"
				:rules="funRules"
				:formAction="formAction105"
			>
				<template #supplierName>
					<el-input
						:disabled="true"
						style="width: 300px"
						v-model="formData105.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData105.supplierName = ''
								formData105.supplierId = ''
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
			<!-- 商家/商家列表 -->
			<supply-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						formData105.supplierName = row.supplierName
						formData105.supplierId = row.supplierId
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import SupplyDialog from '@/components/SupplyDialog'
import { addInvoice } from '@/api/invoice'

export default {
	name: 'NewBillingInformation',
	components: {
		BasicContainer,
		YxForm,
		SupplyDialog,
	},
	props: [],
	data() {
		let validatePhoneNumber = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号'))
			} else if (!/^1[3456789][0-9]{9}$/.test(value)) {
				callback(new Error('请输入正确的手机号'))
			} else {
				callback()
			}
		}
		let validateEmail = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入邮箱'))
			} else if (
				!/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.test(value)
			) {
				callback(new Error('请输入正确的邮箱'))
			} else {
				callback()
			}
		}
		return {
			formsDialog: false,
			supplyRow: [],
			selectGroupList: [],
			formData105: {
				supplierName: [],
				supplierId: [],
				invoiceType: '1',
				invoiceTitleType: '1',
				orderSn: '',
				invoiceTitle: '',
				taxpayerNumber: '',
				bankName: '',
				bankCard: '',
				invoiceAmount: '',
				addresseeName: '',
				phone: '',
				site: '',
				unitSite: '',
				email: '',
				invoicePostscript: '',
			},
			funRules: {
				supplierName: [
					{ required: true, message: '请选择商家!', trigger: 'blur' },
				],
				invoiceType: [
					{ required: true, message: '请选择发票类型!', trigger: 'blur' },
				],
				invoiceTitleType: [
					{ required: true, message: '请选择发票抬头类型!', trigger: 'blur' },
				],
				orderSn: [
					{ required: true, message: '请填写订单编号!', trigger: 'blur' },
				],
				invoiceTitle: [
					{ required: true, message: '请填写发票抬头!', trigger: 'blur' },
				],
				taxpayerNumber: [
					{ required: true, message: '请填写纳税人识别号!', trigger: 'blur' },
				],
				bankName: [
					{ required: true, message: '请填写开户银行!', trigger: 'blur' },
				],
				bankCard: [
					{ required: true, message: '请填写银行账号!', trigger: 'blur' },
				],
				invoiceAmount: [
					{ required: true, message: '请填写开票金额!', trigger: 'blur' },
				],
				phone: [{ validator: validatePhoneNumber, trigger: 'blur' }],
				email: [{ validator: validateEmail, trigger: 'blur' }],
			},
			formAction105: [
				{
					title: '取消',
					isClear: true,
				},
				{
					title: '提交',
					type: 'primary',
					click: () => {
						let _this = this
						_this.$confirm(
							'提交后,会立即同步到商家系统,并不可修改',
							'是否确认提交?',
							{
								type: 'warning',
								async callback(action) {
									if (action === 'confirm') {
										_this.submitList()
									}
								},
							}
						)
					},
				},
			],
			formCfg105: [
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					type: 'radio',
					title: '发票类型',
					dataIndex: 'invoiceType',
					placeholder: '请选择开票状态',
					label: 'value',
					options: [
						{
							invoiceType: '1',
							value: '增值税普通发票',
						},
						{
							invoiceType: '2',
							value: '增值税专用发票',
						},
						{
							invoiceType: '3',
							value: '增值税电子发票',
						},
					],
				},
				{
					type: 'radio',
					title: '发票抬头类型',
					dataIndex: 'invoiceTitleType',
					placeholder: '请选择开票状态',
					label: 'value',
					options: [
						{
							invoiceTitleType: '1',
							value: '个人',
						},
						{
							invoiceTitleType: '2',
							value: '企业',
						},
					],
				},
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单编号',
				},
				{
					type: 'input',
					title: '发票抬头',
					dataIndex: 'invoiceTitle',
					placeholder: '请输入发票抬头',
				},
				{
					type: 'input',
					title: '纳税人识别号',
					hide: true,
					dataIndex: 'taxpayerNumber',
					placeholder: '请输入纳税人识别号',
				},
				{
					type: 'input',
					title: '开户银行',
					hide: true,
					dataIndex: 'bankName',
					placeholder: '请输入开户银行',
				},
				{
					type: 'input',
					title: '银行账号',
					hide: true,
					dataIndex: 'bankCard',
					placeholder: '请输入银行账号',
				},
				{
					type: 'inputNumber',
					title: '开票金额',
					dataIndex: 'invoiceAmount',
					placeholder: '请输入开票金额',
				},
				{
					type: 'input',
					title: '收件人姓名',
					dataIndex: 'addresseeName',
					placeholder: '请输入收件人姓名',
				},
				{
					type: 'input',
					title: '联系电话',
					dataIndex: 'phone',
					placeholder: '请输入联系电话',
				},
				{
					type: 'input',
					title: '收件人地址',
					dataIndex: 'site',
					placeholder: '请输入收件人地址',
				},
				{
					type: 'input',
					title: '单位地址及电话',
					dataIndex: 'unitSite',
					hide: true,
					placeholder: '请输入单位地址及电话',
				},
				{
					type: 'input',
					title: '收件邮箱',
					dataIndex: 'email',
					placeholder: '请输入收件邮箱',
				},
				{
					type: 'input',
					title: '备注',
					dataIndex: 'invoicePostscript',
					placeholder: '请输入备注',
				},
			],
		}
	},

	watch: {
		formData105: {
			handler: function (val) {
				console.log('val', val)
				this.formCfg105[5].hide = val.invoiceTitleType == 1 ? true : false
				this.formCfg105[6].hide = val.invoiceTitleType == 1 ? true : false
				this.formCfg105[7].hide = val.invoiceTitleType == 1 ? true : false
				this.formCfg105[12].hide = val.invoiceTitleType == 1 ? true : false
			},
			deep: true,
		},
	},
	methods: {
		async submitList() {
			let paramJson = this.formData105
			for (let v in paramJson) {
				if (v.length && v.length > 200) {
					this.$message.warning('输入框不能超过200字符')
					return false
				}
			}
			console.log('paramJson', paramJson)
			let {
				data: { resultCode, resultMsg },
			} = await addInvoice(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.$router.push({
					name: 'InvoiceList',
				})
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
				this.formData105.supplierId.push(row[i].supplierId)
				this.formData105.supplierId = [
					//数组防重
					...new Set(this.formData105.supplierId),
				]
			}
			console.log('+++++++', this.formData105.supplierName)
		},
	},
}
</script>
