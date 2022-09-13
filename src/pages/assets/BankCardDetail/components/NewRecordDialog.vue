<template>
	<div>
		<el-dialog
			width="650px"
			title="新增记录"
			:inline="true"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:data="formData"
				:rules="formRules"
				:items="searchCfg"
				:labelWidth="'160px'"
				:formAction="formAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { addFlowBankRecord } from '@/api/yhtPlusCmsFinance'

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

	data() {
		return {
			searchCfg: [
				{
					type: 'select',
					title: '渠道',
					dataIndex: 'rechargeType',
					label: 'value',
					options: '',
				},
				{
					title: '第三方充值金额',
					type: 'inputNumber',
					dataIndex: 'rechargeAmount',
				},
				{
					title: '银行卡提现金额',
					type: 'inputNumber',
					dataIndex: 'usableAmount',
				},
			],
			formData: {
				rechargeAmount: '', // 第三方充值金额
				usableAmount: '', // 银行卡提现金额
			},
			formRules: {
				rechargeType: [
					{ required: true, message: '请选择渠道!', trigger: 'blur' },
				],
				rechargeAmount: [
					{ required: true, message: '请输入第三方充值金额!', trigger: 'blur' },
				],
				usableAmount: [
					{ required: true, message: '请输入银行卡提现金额!', trigger: 'blur' },
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._addFlowBankRecord()
					},
				},
			],
		}
	},
	mounted() {
		let rechargeType = JSON.parse(
			JSON.stringify(this.$store.state.app.constant.BANK_CARD_RECHARGE_TYPE)
		)
		rechargeType = rechargeType.splice(1, rechargeType.length)
		this.searchCfg[0].options = rechargeType
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
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
		},
		async _addFlowBankRecord() {
			let paramJson = Object.assign(this.formData, {
				bankAccountId: this.$route.params.bankAccountId,
				remark: '',
			})
			if (paramJson.rechargeAmount * 1 > 0) {
				paramJson.recordType = 1
			}
			if (paramJson.usableAmount * 1 > 0) {
				paramJson.recordType = 2
			}
			const res = await addFlowBankRecord(paramJson)
			const { resultCode, resultMsg } = res.data

			if (resultCode == 0) {
				this.$emit('updateList')
				this.resetForm()
				this.$message.success(resultMsg)
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
