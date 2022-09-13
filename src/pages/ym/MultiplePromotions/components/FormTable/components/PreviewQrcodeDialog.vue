<template>
	<Dialog
		title="活动预览码"
		:visible.sync="dialogVisible"
		width="360px"
		:bottomBtn="dialogBottomBtn"
		@close="handleClose"
	>
		<div class="code-box" v-loading="loadingState">
			<el-image
				z-index="10000"
				class="c_image"
				fit="cover"
				:src="codeImagePath"
				:preview-src-list="[codeImagePath]"
			>
				<div slot="error" class="image-slot">
					<i class="el-icon-picture-outline"></i>
				</div>
			</el-image>
			<p v-if="previewParams.title && codeImagePath" class="code-title">
				规则：{{ previewParams.title }}
			</p>
		</div>
	</Dialog>
</template>

<script>
import Dialog from '@/components/Dialog'
import { getActiveActivityCode } from '@/api/weiXinUser'
import { getBigImg } from '@/utils/imageTool'
export default {
	name: 'PreviewQrcodeDialog',
	components: {
		Dialog,
	},
	props: {
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		previewParams: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			dialogBottomBtn: [
				{
					title: '关 闭',
					type: 'primary',
					click: () => {
						this.handleClose()
					},
				},
			],
			codeImagePath: '',
			loadingState: false,
		}
	},
	watch: {
		dialogVisible(val) {
			val && this.init()
		},
	},
	methods: {
		// 预览二维码
		async init() {
			this.loadingState = true
			const { id = '', page = '', scene = '' } = this.previewParams
			const {
				data: { resultCode, resultData },
			} = await getActiveActivityCode({
				id,
				page,
				scene,
			})
			if (resultCode == 0) {
				const codeImagePath = resultData.codeImagePath.replace(
					'/data/yhtplusFile/',
					''
				)
				this.codeImagePath = getBigImg(codeImagePath) || ''
				this.loadingState = false
			}
		},
		handleClose() {
			this.loadingState = false
			this.codeImagePath = ''
			this.$emit('update:dialogVisible', false)
		},
	},
}
</script>

<style lang="scss" scoped>
.code-box {
	text-align: center;
	.c_image {
		font-size: 40px;
	}
	.code-title {
		margin-bottom: 0;
		font-weight: bold;
	}
}
</style>
