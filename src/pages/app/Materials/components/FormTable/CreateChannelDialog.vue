<template>
	<el-dialog
		width="420px"
		title="新增"
		:visible.sync="localVisible"
		@open="open"
	>
		<yx-form
			:rules="rules"
			labelWidth="80px"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="formAction"
			ref="create_form"
		></yx-form>
	</el-dialog>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { addSourceMaterial } from '@/api/sourceMaterial'

export default {
	components: {
		YxForm,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			dialogData: {
				scene: '',
			},
			dialogCfg: [
				{
					type: 'input',
					dataIndex: 'scene',
					title: '名称',
				},
			],
			rules: {
				scene: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入名称'))
							} else if (value.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
								callback(new Error('请输入名称'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._confirm()
					},
				},
			],
		}
	},
	methods: {
		mallDetail(row, type) {
			if (type == 2) {
				this.dialogData.scene = row.scene ? row.scene : ''
			} else {
				this.dialogData.scene = ''
			}
		},
		_confirm: async function () {
			let paramJson = {
				...this.dialogData,
			}
			let {
				data: { resultCode },
			} = await addSourceMaterial(paramJson)
			if (resultCode == 0) {
				this.$emit('initTable')
				this.$message.success('新增成功！')
				this.localVisible = false //关闭
			}
		},
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
}
</script>
