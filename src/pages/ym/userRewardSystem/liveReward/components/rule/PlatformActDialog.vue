<template>
	<el-dialog
		width="450px"
		v-loading="loading"
		:title="row.platformActivityId ? '编辑活动' : '新增活动'"
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
		@open="open"
	>
		<YxForm
			labelWidth="100px"
			:data="formData"
			:items="formItems"
			:formAction="formAction"
			:rules="funRules"
		/>
	</el-dialog>
</template>

<script>
import { platformActUpdate, platformActSave } from '@/api/userRewardSystem'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
export default {
	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
	},

	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		row: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			formData: {
				activityName: '',
				activityUrl: [],
			},
			formItems: [
				{
					type: 'input',
					dataIndex: 'activityName',
					title: '活动名称',
				},
				{
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'activityUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
			],
			funRules: {
				activityName: [
					{ required: true, message: '请填写活动名称!', trigger: 'blur' },
				],
				activityUrl: [
					{ required: true, message: '请上传图片!', trigger: 'blur' },
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._platformActSave()
					},
				},
				{
					title: '取消',
					type: 'warning',
					cancel: true,
					click: () => {
						this.localVisible = false
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
		resetForm() {
			this.formData = {
				activityName: '',
				activityUrl: [],
			}
			this.localVisible = false
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 82 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.formData.activityUrl.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		_platformActSave: async function () {
			let paramsData = Object.assign({}, this.formData)
			paramsData.activityUrl = this.formData.activityUrl[0].imageUrlTemp
			if (this.row.platformActivityId) {
				paramsData.platformActivityId = this.row.platformActivityId
				const {
					data: { resultCode },
				} = await platformActUpdate(paramsData)
				if (resultCode == 0) {
					this.$message.success('修改成功')
					this.$emit('platformActSaveSuccess')
					this.resetForm()
				}
			} else {
				const {
					data: { resultCode },
				} = await platformActSave(paramsData)
				if (resultCode == 0) {
					this.$message.success('保存成功')
					this.$emit('platformActSaveSuccess')
					this.resetForm()
				}
			}
		},
		open() {
			if (this.row.platformActivityId) {
				this.formData.activityName = this.row.activityName
				this.formData.activityUrl = [
					{
						imageUrl: getBigImg(this.row.activityUrl),
						imageUrlTemp: this.row.activityUrl,
					},
				]
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.award {
	padding: 0 10px;
	border-radius: 6px;
	border: 1px solid #ccc;
	margin-bottom: 15px;

	&__title {
		font-size: 18px;
	}

	&__scope {
		width: 160px;
		margin-right: 20px;
	}

	&__input {
		width: 110px;
	}

	&__price {
		font-size: 14px;
		margin-left: 10px;
	}

	&__btn {
		display: flex;
		justify-content: flex-end;
	}
}

.date-width {
	width: 100%;
}
</style>
