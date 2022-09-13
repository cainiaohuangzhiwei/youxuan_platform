<template>
	<div>
		<el-dialog
			width="450px"
			title="银行卡信息"
			ref="form"
			:inline="true"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<el-dialog
				width="400px"
				title="提示"
				:visible.sync="showTips"
				append-to-body
			>
				<div class="list-msg">
					<div class="list-item red-color">*请确认充值信息。</div>
					<div class="list-item">充值金额：{{ this.formData.amount }}</div>
					<div class="list-item">
						充值时间：{{
							moment(this.formData.addTime).format('YYYY-MM-DD h:mm:ss')
						}}
					</div>
					<div class="list-item">
						支出账户：{{
							this.searchCfg[2].options[this.formData.outType - 1] &&
							this.searchCfg[2].options[this.formData.outType - 1].value
						}}
					</div>
					<div class="list-item">收款账户：营销账户</div>
					<div class="list-item">
						经办人：{{ this.formData.approvingPerson }}
					</div>
					<div class="list-item">审批人：{{ this.formData.transactor }}</div>
					<div class="list-item">备注：{{ this.formData.remark }}</div>
				</div>

				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="submitAgain">确 定</el-button>
				</span>
			</el-dialog>
			<yx-form
				ref="form"
				:inline="false"
				:data="formData"
				:rules="formRules"
				:items="searchCfg"
				:labelWidth="'110px'"
				:formAction="formAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { addRechargeRecord } from '@/api/yhtPlusCmsFinance'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
	},
	mounted() {
		let outType = JSON.parse(
			JSON.stringify(this.$store.state.app.constant.RECHARGE_ACCOUNT_TYPE)
		).splice(1, 4)
		this.searchCfg[2].options = outType.map((item) => {
			return {
				outType: item.type,
				value: item.value,
			}
		})
	},
	data() {
		return {
			showTips: false,
			searchCfg: [
				{
					title: '充值金额',
					type: 'inputNumber',
					dataIndex: 'amount',
					placeholder: '请输入充值金额',
				},
				{
					title: '充值时间',
					type: 'time',
					dataIndex: 'addTime',
					disabled: true,
					timeAttributes: {
						type: 'datetime',
					},
				},
				{
					type: 'select',
					title: '支出账户',
					dataIndex: 'outType',
					label: 'value',
					options: [],
				},
				{
					type: 'select',
					title: '收款账户',
					dataIndex: 'type',
					label: 'value',
					options: [{ value: '营销账户', type: 7 }],
					disabled: true,
				},
				{
					title: '经办人',
					type: 'input',
					dataIndex: 'approvingPerson',
					placeholder: '请输入经办人',
				},
				{
					title: '审批人',
					type: 'input',
					dataIndex: 'transactor',
					placeholder: '请输入审批人',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
					placeholder: '请输入备注',
				},
			],
			formData: {
				amount: '', //充值金额
				addTime: '', // 充值时间
				outType: null, //支出账户
				type: 7, //收款账户
				approvingPerson: '', //经办人
				transactor: '', //审批人
				remark: '', //备注
			},
			formRules: {
				amount: [
					{ required: true, message: '请输入充值金额!', trigger: 'blur' },
				],
				addTime: [
					{ required: true, message: '请选择充值时间!', trigger: 'blur' },
				],
				outType: [
					{ required: true, message: '请选择支出账户!', trigger: 'blur' },
				],
				type: [{ required: true, message: '请选择收款账户!', trigger: 'blur' }],
				approvingPerson: [
					{ required: true, message: '请输入经办人!', trigger: 'blur' },
				],
				transactor: [
					{ required: true, message: '请输入审批人!', trigger: 'blur' },
				],
				remark: [{ required: true, message: '请输入备注!', trigger: 'blur' }],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submit()
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

	methods: {
		open() {
			//初始化操作时间
			this.formData.addTime = JSON.parse(JSON.stringify(moment().valueOf()))
		},
		moment(value) {
			return moment(value)
		},
		submit() {
			this.showTips = true
		},
		async submitAgain() {
			let {
				data: { resultCode },
			} = await addRechargeRecord({
				finishTime: new Date().getTime(),
				transferAccount: '营销账户',
				...this.formData,
			})
			if (resultCode == 0) {
				this.$emit('updateList')
				this.showTips = false
				this.resetForm()
			}
		},
		// 关闭弹窗
		resetForm() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.list-msg {
	position: relative;
	font-size: 14px;
	line-height: 26px;
}
.red-color {
	position: absolute;
	color: brown;
	top: -32px;
	font-size: 15px;
}
</style>
