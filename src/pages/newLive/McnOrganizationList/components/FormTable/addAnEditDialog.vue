<template>
	<yx-dialog :title="dialogTitle" :visible.sync="visible">
		<yx-form
			labelWidth="100px"
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
import { addMcn, editMcn } from '@/api/yhtPlusCmsLiveMcnControl'
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
		// 机构
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	watch: {
		itemInfo() {
			this.dialogData = {
				mcnName: (this.itemInfo && this.itemInfo.mcnName) || '',
				mcnId: (this.itemInfo && this.itemInfo.mcnId) || '',
			}
			this.dialogTitle =
				this.itemInfo && this.itemInfo.mcnId ? '编辑机构' : '新建机构'
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
	data() {
		return {
			visible: false,
			dialogTitle: '新建机构',
			dialogData: {
				// 弹框表单数据
				mcnName: '', // 机构名称
			},
			dialogCfg: [
				// 弹框表单配置项
				{
					type: 'input',
					dataIndex: 'mcnName',
					title: '机构名称',
					maxlength: 20,
				},
			],
			rules: {
				// 弹框表单规则
				mcnName: [
					{ required: true, message: '请输入机构名称', trigger: 'blur' },
				],
			},
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveMcn()
					},
				},
			],
		}
	},
	methods: {
		saveMcn: async function () {
			// 保存机构
			let paramJson = Object.assign({}, this.dialogData)
			let res = null
			if (paramJson.mcnId) {
				res = await editMcn(paramJson)
			} else {
				res = await addMcn(paramJson)
			}

			if (res.data.resultCode == 0) {
				this.$message({
					message: res.data.resultMsg,
					type: 'success',
				})
				this.visible = false
				this.$emit('updateList')
			}
		},
	},
}
</script>
