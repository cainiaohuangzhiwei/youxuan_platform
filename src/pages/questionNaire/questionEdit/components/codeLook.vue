<template>
	<div>
		<el-dialog
			ref="elDialog"
			width="450px"
			title="问卷预览"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				:inline="false"
				:items="item"
				:data="formData"
				:formAction="formAction"
			>
				<template #codeImagePath>
					<div class="code_image">
						<el-image
							:z-index="zIndex"
							v-if="formData.codeImagePath.length > 0"
							:src="formData.codeImagePath"
							:fit="fit"
							:preview-src-list="formData.codeImagePath"
						/>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import { getCodeImage } from '@/api/shopDetail'
import YxForm from '@wg-vue-materials/yx-form'
import { getSmallImg } from '@/utils/imageTool'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		row: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			item: [
				{
					type: 'custom',
					dataIndex: 'codeImagePath',
				},
			],
			loading: false,
			formData: {
				codeImagePath: [],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.resetForm()
					},
				},
			],
			zIndex: 2001,
		}
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
		// 获取图片
		async updateData(id) {
			this.loading = true
			const _id = id || this.$route.params.id
			const paramsData = {
				page: 'subpages/H5/h5Page',
				scene: `t=12&q=${_id}`,
			}

			const res = await getCodeImage(paramsData)
			const { resultCode, resultData } = res.data

			if (resultCode == 0 && resultData.codeImagePath) {
				this.formData.codeImagePath =
					resultData.codeImagePath.length > 0
						? [
								getSmallImg(
									resultData.codeImagePath.replace('/data/yhtplusFile', '')
								),
						  ]
						: []
			}
			this.loading = false
			const elDialog = this.$refs.elDialog
			const zIndex = elDialog.$el.style.zIndex
			this.zIndex = Number(zIndex) + 1
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.code_image {
	text-align: center;

	.el-image {
		width: 400px;
		height: 400px;
	}
}
</style>
