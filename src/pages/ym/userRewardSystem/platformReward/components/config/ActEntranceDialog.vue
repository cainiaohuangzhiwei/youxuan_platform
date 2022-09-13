<template>
	<el-dialog
		width="30%"
		title="编辑直播佣金膨胀"
		v-loading="loading"
		:visible.sync="localVisible"
		:before-close="resetForm"
		@open="open"
		><YxForm
			:inline="false"
			:data="formData"
			:items="formItems"
			:formAction="formAction"
			:rules="formRules"
			:labelWidth="'110px'"
		/>
	</el-dialog>
</template>

<script>
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import {
	getPlatformActEntrance,
	updateActEntrance,
} from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		actEntranceId: {
			type: Number,
			default: 0,
		},
	},

	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
	},

	data() {
		return {
			formData: {
				activityPosterImages: [],
				entrancePosterImages: [],
				description: '',
			},
			formItems: [
				{
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'activityPosterImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'activityPosterImages'),
					},
				},
				{
					type: 'uploadImage',
					title: '活动入口图',
					dataIndex: 'entrancePosterImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'entrancePosterImages'),
					},
				},
				{
					type: 'textarea',
					title: '活动规则',
					dataIndex: 'description',
				},
			],
			loading: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			formRules: {
				activityPosterImages: [
					{ required: true, message: '请上传活动海报', trigger: 'blur' },
				],
				entrancePosterImages: [
					{ required: true, message: '请上传活动入口图', trigger: 'blur' },
				],
			},
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
		resetForm() {
			this.localVisible = false
		},
		async open() {
			const {
				data: { resultData = {}, resultCode },
			} = await getPlatformActEntrance({
				entranceType: 1,
				actEntranceId: this.actEntranceId,
			})
			if (resultCode == 0) {
				if (
					resultData.activityPosterImages &&
					resultData.activityPosterImages.length > 0
				) {
					this.formData.activityPosterImages = resultData.activityPosterImages.map(
						(item) => {
							return {
								imageUrl: getBigImg(item),
								imageUrlTemp: item,
							}
						}
					)
				}
				if (
					resultData.entrancePosterImages &&
					resultData.entrancePosterImages.length > 0
				) {
					this.formData.entrancePosterImages = resultData.entrancePosterImages.map(
						(item) => {
							return {
								imageUrl: getBigImg(item),
								imageUrlTemp: item,
							}
						}
					)
				}
				this.formData.description = resultData.description
			}
		},
		//上传图片
		_uploadImageHttpRequest: async function (params, imageSource) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#imageUrl', imageType: 82 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				if (imageSource === 'activityPosterImages') {
					this.formData.activityPosterImages.push({
						imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
						imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
					})
				} else if (imageSource === 'entrancePosterImages') {
					this.formData.entrancePosterImages.push({
						imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
						imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
					})
				}
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		async submitForm() {
			let params = {
				actEntranceId: this.actEntranceId,
				activityPosterImages: this.formData.activityPosterImages.map((item) => {
					return item.imageUrlTemp
				}),
				entrancePosterImages: this.formData.entrancePosterImages.map((item) => {
					return item.imageUrlTemp
				}),
				description: this.formData.description,
			}
			const {
				data: { resultCode },
			} = await updateActEntrance(params)
			if (resultCode == 0) {
				this.$message.success('编辑成功')
				this.resetForm()
			}
		},

		lookActivity() {
			this.$emit('fatherMethodInit', this.params)
		},
	},
}
</script>

<style lang="scss" scoped></style>
