<template>
	<div>
		<el-dialog
			width="450px"
			title="银行卡信息"
			:inline="true"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
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
					title: '银行卡账户',
					type: 'input',
					dataIndex: 'bankNum',
					disabled: true,
				},
				{
					title: '提现账户名',
					type: 'input',
					dataIndex: 'bankNum',
					disabled: true,
				},
				{
					title: '开户银行',
					type: 'input',
					dataIndex: 'bankNum',
					disabled: true,
				},
				{
					title: '银行城市',
					type: 'input',
					dataIndex: 'bankNum',
					disabled: true,
				},
				{
					title: '开户支行',
					type: 'input',
					dataIndex: 'bankNum',
					disabled: true,
				},
			],
			formData: {
				bankNum: '123123', // 银行卡账户
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.resetForm()
					},
				},
				{
					title: '取消',
					type: 'cancel',
					click: () => {
						this.resetForm()
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
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		async _getBankMsg() {
			// let paramJson = this.findSearchParams(flag)
			// let {
			// 	data: { resultCode, resultData },
			// } = await getGoodsGroupList(paramJson)
			// if (resultCode == 0) {
			// 	this.tableData = resultData.records
			// 	this.page.count = resultData.total
			// } else {
			// 	this.tableData = []
			// }
		},
		open() {
			this._getBankMsg()
		},
	},
}
</script>

<style lang="scss" scoped></style>
