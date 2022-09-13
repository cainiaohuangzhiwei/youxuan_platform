<template>
	<el-dialog
		top="2%"
		:width="width"
		:title="title"
		append-to-body
		:visible.sync="isShow"
		:custom-class="customClass"
		:modal-append-to-body="false"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:destroy-on-close="showClose"
		:before-close="handleClose"
		@open="open"
		@close="close"
	>
		<slot></slot>
		<template v-if="bottomBtn && bottomBtn.length">
			<span slot="footer" class="dialog-footer">
				<template v-for="(item, index) in bottomBtn">
					<el-button
						@click="item.click"
						:key="index"
						:type="item.type ? item.type : 'primary'"
						:disabled="item.disabled"
					>
						{{ item.title }}
					</el-button>
				</template>
			</span>
		</template>
	</el-dialog>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '提示',
		},
		visible: {
			type: Boolean,
			default: false,
		},
		width: {
			type: String,
			default: '60%',
		},
		bottomBtn: {
			type: Array,
			default: () => [],
		},
		showClose: {
			type: Boolean,
			default: false,
		},
		customClass: {
			type: String,
			default: 'yx-dialog',
		},
	},

	data() {
		return {
			isShow: false,
		}
	},

	watch: {
		isShow(newVlaue) {
			this.$emit('update:visible', newVlaue)
		},
		visible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.isShow = newVlaue
			}
		},
	},

	created() {
		this.isShow = this.visible
	},

	methods: {
		handleClose() {
			this.visible = false
			this.$emit('before-close')
		},
		open() {
			this.$emit('open')
		},
		close() {
			this.$emit('close')
		},
	},
}
</script>

<style>
.el-dialog {
	max-height: 90%;
	overflow-y: auto;
}
.el-dialog__body {
	max-height: 500px;
	overflow-y: auto;
	padding: 15px 20px;
}
</style>
