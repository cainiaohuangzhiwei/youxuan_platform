<template>
	<el-dialog
		width="420px"
		title="新增渠道"
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
import { saveAppChannel } from '@/api/cmsAppChannel'

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
		other: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			dialogData: {
				channelName: '',
				channelNo: '',
			},
			dialogCfg: [
				{
					type: 'input',
					dataIndex: 'channelName',
					title: '渠道名称',
				},
				{
					type: 'input',
					dataIndex: 'channelNo',
					title: '渠道号',
				},
			],
			rules: {
				channelName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入渠道名称'))
							} else if (value.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
								callback(new Error('请输入渠道名称'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				channelNo: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入渠道号'))
							} else if (value.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
								callback(new Error('请输入渠道号'))
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
		open() {
			this.dialogData = {
				channelName: '',
				channelNo: '',
			}
		},
		_confirm: async function () {
			let paramJson = {
				channelType: 2,
				...this.dialogData,
			}
			if (this.other) {
				paramJson.channelType = 3
			}
			let {
				data: { resultCode },
			} = await saveAppChannel(paramJson)
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
