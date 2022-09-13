<template>
	<div>
		<el-dialog
			width="800px"
			heigth="1000px"
			title="预览"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:close-on-press-escape="false"
			:before-close="resetForm"
		>
			<div style="text-align: center">
				<!-- <img :src="previewImg" alt="" style="width: 90px" /> -->
				<el-image
					class="c_image"
					style="width: 90px"
					fit="cover"
					:src="getBigImg(previewImg)"
					:preview-src-list="[getBigImg(previewImg)]"
				>
					<div slot="error" class="image-slot">
						<i class="el-icon-picture-outline"></i>
					</div>
				</el-image>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getBigImg } from '@/utils/imageTool'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		previewImg: [String, Number],
	},

	components: {},

	data() {
		return {
			getBigImg,
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			if (val) {
				console.log(this.previewImg, 'asdfasdfsdfsdf')
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

	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped></style>
