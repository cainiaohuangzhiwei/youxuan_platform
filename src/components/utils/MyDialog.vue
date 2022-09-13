<template>
	<div class="pageDialogBoxs">
		<el-dialog
			:modal="true"
			:show-close="true"
			:title="title"
			:width="width"
			:modal-append-to-body="true"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="isVisible"
			:before-close="handleClose"
			:append-to-body="appendToBody"
			class="page-dialog"
			:class="className"
			center
		>
			<!-- 插槽 -->
			<div class="Dialog_content">
				<slot />
			</div>
			<!-- 如果有按钮列表则循环 -->
			<div v-if="btList" slot="footer" class="dialog-footer">
				<!-- 循环按钮列表 -->
				<template v-for="(item, index) in getConfigList()">
					<el-button
						v-if="item.show"
						:key="index"
						:type="item.type"
						:icon="item.icon"
						:disabled="item.disabled"
						:style="item.style"
						@click="handleClick(item.event)"
					>
						{{ item.label }}
					</el-button>
				</template>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'PageDialog',
	props: {
		// 自定义类名
		className: {
			type: String,
		},
		// 弹窗标题
		title: {
			type: String,
		},
		// 弹窗是否显示
		isVisible: {
			type: Boolean,
			default: false,
		},
		// 弹窗宽度
		width: {
			type: String,
		},
		// 按钮加载
		btLoading: {
			type: Boolean,
		},
		// 按钮列表
		btList: {
			type: Array,
		},
		// 插入到body
		appendToBody: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {}
	},
	watch: {
		visible(val) {
			this.$emit('update:visible', val)
		},
	},
	methods: {
		// 获取按钮列表
		getConfigList() {
			return this.btList.filter(
				(item) =>
					// eslint-disable-next-line no-prototype-builtins
					!item.hasOwnProperty('show') ||
					// eslint-disable-next-line no-prototype-builtins
					(item.hasOwnProperty('show') && item.show)
			)
		},
		// 派发按钮点击事件
		handleClick(event, data) {
			this.$emit('handleClick', event, data)
		},
		// 关闭X弹窗前的回调
		handleClose() {
			this.$emit('update:visible', false)
			this.$emit('handleClose')
			this.$emit('handleClick', 'CancelBtn')
		},
	},
}
</script>

<style lang="scss" scoped>
::v-deep.el-dialog--center .el-dialog__body {
	padding: 0px;
}
::v-deep.page-dialog .el-dialog__header {
	text-align: left;
}
::v-deep.page-dialog .el-dialog__footer {
	text-align: right;
}
::v-deep.page-custom .el-dialog__headerbtn {
	display: none;
}
</style>
