<template>
	<yx-dialog
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		:title="isCheckView ? '查看活动页' : '选择活动页'"
	>
		<yx-form :data="formData" :items="formItems"></yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'

export default {
	components: {
		YxDialog,
		YxForm,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		isCheckView: {
			type: Boolean,
			default: false,
		},
		selectLubanRow: {
			type: Object,
			default: () => [],
		},
	},
	data() {
		return {
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveLubanAct()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			cacheBtns: this.bottomBtn,
			formData: {
				actIdList: '',
			},
			formItems: [
				{
					type: 'input',
					title: '鲁班活动页ID：',
					dataIndex: 'actIdList',
					placeholder: '多个活动页面用;分割',
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
				if (!val) {
					this.$emit('close')
				}
			},
		},
	},
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.formData.actIdList = this.selectLubanRow.join(';')
			}
		},
		isCheckView(val) {
			if (val) {
				this.bottomBtn = []
				this.formItems.forEach((item) => {
					item.disabled = true
				})
			} else {
				this.bottomBtn = this.cacheBtns
				this.formItems.forEach((item) => {
					item.disabled = false
				})
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.formData.actIdList = ''
		},
		saveLubanAct() {
			// 去掉空格
			const list = this.formData.actIdList
				.replace(/\s/g, '')
				.split(/;|；|,|，/)
				.filter((item) => item)
			this.$emit('saveCallback', list)
			this.localVisible = false
		},
	},
}
</script>
