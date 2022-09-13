<template>
	<yx-dialog :title="title" :visible.sync="visible">
		<yx-form
			ref="editFrom"
			labelWidth="100px"
			:data="dialogData"
			:rules="rules"
			:formAction="bottomBtn"
			:items.sync="dialogCfg"
		>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { aeBank } from '@/api/yhtPlusCmsSupplier'
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
		editInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			title: '新增银行',
			rules: {
				bankName: [
					{ required: true, message: '请输入银行名称', trigger: 'blur' },
				],
			},
			bottomBtn: [
				{
					title: '确定',
					click: (e) => {
						this._aeBank(e)
					},
				},
			],
			visible: false,
			dialogData: {
				bankName: '',
			},
			dialogCfg: [
				{
					type: 'input',
					title: '银行名称',
					dataIndex: 'bankName',
				},
			],
		}
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			if (this.visible) {
				if (this.editInfo.bankId) {
					this.title = '编辑银行'
					this.dialogData = {
						bankId: this.editInfo.bankId,
						bankName: this.editInfo.bankName,
					}
				} else {
					this.title = '新增银行'
					this.dialogData = {
						bankName: '',
					}
				}
			} else {
				// this.$refs.editFrom.clearValidate()
				this.$refs.editFrom.resetFields()
			}
		},
	},
	methods: {
		_aeBank: async function (e) {
			// 编辑店主路由
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let {
				data: { resultCode, resultMsg },
			} = await aeBank(this.dialogData, custom)
			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.visible = false
				this.$emit('updateList')
			}
		},
	},
}
</script>
