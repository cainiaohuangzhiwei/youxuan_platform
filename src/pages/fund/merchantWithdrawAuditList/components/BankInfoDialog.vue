<template>
	<div v-if="isLoading">
		<el-dialog
			width="450px"
			title="提现银行卡信息"
			:visible.sync="localVisible"
			:close-on-click-modal="false"
			:before-close="closeDialog"
			:destroy-on-close="true"
		>
			<el-form :model="bankInfoForm" label-width="120px" v-if="infoVisible">
				<el-form-item label="提现银行卡号：">
					<span>{{ bankInfoForm.accountNumber }}</span>
				</el-form-item>
				<el-form-item label="提现银行：">
					<span>{{ bankInfoForm.bankName }}</span>
				</el-form-item>
				<el-form-item label="提现银行支行：">
					<span>{{ bankInfoForm.bankSubbranch }}</span>
				</el-form-item>
				<el-form-item label="提现人姓名：">
					<span>{{ bankInfoForm.accountName }}</span>
				</el-form-item>
				<el-form-item label="银行城市：">
					<span>{{ bankInfoForm.bankCity }}</span>
				</el-form-item>
			</el-form>
			<div class="tips" v-if="!infoVisible">暂无数据</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="closeDialog">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getBankAccountInfo } from '@/api/yhtPlusCmsFinance'
export default {
	name: 'BankInfoDialog',

	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		bankAccountId: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			bankInfoForm: {},
			id: '1000000',
			infoVisible: false,
			isLoading: false,
		}
	},

	mounted() {
		// this.init()
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

	watch: {
		bankAccountId() {
			this.isLoading = false
			if (this.visible) {
				this.init(this.bankAccountId)
			}
		},
	},

	methods: {
		// 关闭dialog
		closeDialog() {
			this.localVisible = false
		},
		// 获取银行列表
		async init(bankAccountId) {
			const {
				data: { resultData, resultCode },
			} = await getBankAccountInfo({ bankAccountId })
			// console.log(resultData)
			if (resultCode == 0) {
				this.isLoading = true
				this.infoVisible = true
				this.bankInfoForm = resultData
			}
			// console.log(this.bankInfoForm)
		},
	},
}
</script>

<style lang="scss" scoped></style>
