<template>
	<el-dialog
		width="50%"
		:title="title"
		v-loading="loading"
		:visible.sync="localVisible"
		:before-close="resetForm"
		@open="open"
	>
		<YxForm
			ref="form"
			:inline="false"
			:data="formData"
			:items="formItems"
			:formAction="formAction"
			:rules="formRules"
			:labelWidth="'110px'"
		>
			<template slot="relatedReward">
				<el-button type="primary" @click="chooseRelatedReawrd"
					>选择关联规则</el-button
				>
				<el-row>
					<el-button type="text" size="small" @click="handleLookRule">
						{{ actSaleRewardName }}
					</el-button>
				</el-row>
			</template>
		</YxForm>
		<RelatedRewardDialog
			:visible.sync="relatedRewardDialog"
			@checkActSaleRewardId="checkActSaleRewardId"
		/>
		<LookRuleDialog ref="lookRule" :visible.sync="lookRuleDialog" />
	</el-dialog>
</template>

<script>
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import {
	addPlatActPageConf,
	updatePlatActPageConf,
	getPlatActPageConfDetail,
} from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
		RelatedRewardDialog: () => import('./RelatedRewardDialog'),
		LookRuleDialog: () => import('../../../rule/LookDialog'),
	},

	data() {
		return {
			title: '创建活动页面配置',
			relatedRewardDialog: false,
			actSaleRewardName: '',
			formData: {
				actName: '',
				actSaleRewardId: '',
				actPosterImages: [],
			},
			lookRuleDialog: false,
			formItems: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'actName',
					disabled: false,
				},
				{
					type: 'custom',
					title: '关联奖励',
					dataIndex: 'relatedReward',
				},
				{
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'actPosterImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'actPosterImages'),
					},
					disabled: false,
				},
				{
					type: 'textarea',
					title: '活动规则',
					dataIndex: 'description',
					placeholder: '请输入活动规则',
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
				actName: [
					{
						validator: (rule, value, callback) => {
							if (value.trim().length > 15) {
								callback(new Error('活动名称能超过15个字符'))
							} else if (value.trim() == '') {
								callback(new Error('活动名称不能为空'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
					{ required: true, message: '请填写活动名称', trigger: 'blur' },
				],
				actPosterImages: [
					{ required: true, message: '请上传活动海报', trigger: 'blur' },
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
			this.actSaleRewardName = ''
			this.formData = {
				actName: '',
				actSaleRewardId: '',
				actPosterImages: [],
			}
			this.localVisible = false
		},
		async open() {
			this.loading = true
			this.$nextTick(() => {
				this.$refs.form && this.$refs.form.$refs.YxForm.clearValidate()
			})
			//查看时禁用按钮
			let actName = this.formItems.find((item) => {
				return item.dataIndex == 'actName'
			})
			let actPosterImages = this.formItems.find((item) => {
				return item.dataIndex == 'actPosterImages'
			})
			actName.disabled = this.disabled
			actPosterImages.disabled = this.disabled
			//编辑和查看回显
			if (this.row.id) {
				const {
					data: { resultData, resultCode },
				} = await getPlatActPageConfDetail({
					id: this.row.id,
				})
				if (resultCode == 0 && resultData) {
					this.actSaleRewardName = resultData.actSaleRewardName
					this.formData = {
						actName: resultData.actName,
						actSaleRewardId: resultData.actSaleRewardId,
						actPosterImages: [],
						description: resultData.description,
					}
					resultData.actPosterImages.forEach((element) => {
						this.formData.actPosterImages.push({
							imageUrl: getBigImg(element),
							imageUrlTemp: element,
						})
					})
				}
			}
			//标题
			this.title = !this.row.id
				? '创建活动页面配置'
				: this.disabled
				? '查看活动页面配置'
				: '编辑活动页面配置'
			this.loading = false
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
				if (imageSource === 'actPosterImages') {
					this.formData.actPosterImages.push({
						imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
						imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
					})
				}
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		async submitForm() {
			if (!this.formData.actSaleRewardId) {
				this.$message.warning('请选择关联奖励')
				return
			}
			let params = {
				actName: this.formData.actName.trim(),
				actPosterImages: this.formData.actPosterImages.map((item) => {
					return item.imageUrlTemp
				}),
				actSaleRewardId: this.formData.actSaleRewardId,
				description: this.formData.description,
			}
			if (this.row.id) {
				params.id = this.row.id
				const {
					data: { resultCode },
				} = await updatePlatActPageConf(params)
				if (resultCode == 0) {
					this.$message.success('编辑成功')
					this.$emit('refreshTable')
					this.resetForm()
				}
			} else {
				const {
					data: { resultCode },
				} = await addPlatActPageConf(params)
				if (resultCode == 0) {
					this.$message.success('新增成功')
					this.$emit('refreshTable')
					this.resetForm()
				}
			}
		},
		chooseRelatedReawrd() {
			if (this.disabled) {
				return
			} else {
				this.relatedRewardDialog = true
			}
		},
		checkActSaleRewardId(actSaleRewardId, actSaleRewardName) {
			this.formData.actSaleRewardId = actSaleRewardId
			this.actSaleRewardName = actSaleRewardName
		},
		handleLookRule() {
			this.lookRuleDialog = true
			this.$nextTick(() => {
				this.$refs.lookRule._viewActSaleReward(this.formData.actSaleRewardId)
			})
		},
	},
}
</script>

<style lang="scss" scoped></style>
