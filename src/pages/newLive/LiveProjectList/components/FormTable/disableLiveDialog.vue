<template>
	<yx-dialog
		title="禁用直播"
		:width="'600px'"
		:visible.sync="visible"
		@before-close="resetForm"
	>
		<yx-form
			ref="form"
			labelWidth="110px"
			:data="dialogData"
			:rules="rules"
			:items.sync="dialogCfg"
			:formAction="dialogAction"
		>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { disableLivePlanV2 } from '@/api/livePlan'

export default {
	components: {
		YxDialog,
		YxForm,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			dialogData: {
				livePlanId: '',
				disabledRemark: '',
			},
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._disableLivePlan()
					},
				},
			],
			dialogCfg: [
				{
					type: 'textarea',
					title: '填写禁用备注',
					dataIndex: 'disabledRemark',
				},
			],
			rules: {
				disabledRemark: [
					{ required: true, message: '请输入禁用备注', trigger: 'blur' },
				],
			},
		}
	},
	methods: {
		async _disableLivePlan() {
			let paramJson = Object.assign({}, this.dialogData)
			let {
				data: { resultMsg, resultCode },
			} = await disableLivePlanV2(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.$emit('updateList')
				this.resetForm()
			}
		},
		resetForm() {
			this.visible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
	watch: {
		itemInfo() {
			if (this.itemInfo && this.itemInfo.livePlanId) {
				this.dialogData = {
					livePlanId: this.itemInfo.livePlanId,
					disabledRemark: '',
				}
			}
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>
