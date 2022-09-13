<template>
	<div>
		<el-dialog
			width="30%"
			:title="`${title}小程序登录`"
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
		// 获取小程序登录图片
		async updateData(organizationId, userId) {
			this.loading = true
			const paramsData = {
				page: 'pages/xcxLogin/xcxLogin',
				scene: 'oId=' + organizationId + '&uId=' + userId,
				source: 1,
				uid: userId,
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
