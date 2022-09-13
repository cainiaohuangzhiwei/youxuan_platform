<template>
	<div>
		<el-dialog
			width="500px"
			:title="titleMap[action]"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="funData"
				:rules="funRules"
				:labelWidth="'110px'"
				:formAction="funAction"
			>
			</yx-form>
		</el-dialog>

		<el-dialog
			width="500px"
			:close-on-click-modal="false"
			:visible.sync="localVisibleInput"
			:before-close="resetForm"
		>
			<yx-form
				ref="formInput"
				:inline="false"
				:items="itemInput"
				:data="funData"
				:rules="funRules"
				:labelWidth="'110px'"
				:formAction="funAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getSmallImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
// import { functionalAreaSave } from '@/api/questionNaire'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		action: {
			type: String,
			default: 'add',
		},
		visibleInput: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			titleMap: {
				add: '新增选项',
				edit: '编辑选项',
			},
			item: [
				{
					type: 'textarea',
					title: '选项名称',
					dataIndex: 'optionsValue',
					maxlength: 100,
					placeholder: '请输入选项名称',
				},
				{
					type: 'uploadImage',
					title: '图标',
					dataIndex: 'imageList',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageList',
						accept: 'image/jpeg, image/jpg, image/png',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'imageList'),
					},
				},
			],
			itemInput: [
				{
					type: 'textarea',
					title: '问题内容',
					maxlength: 100,
					dataIndex: 'questionTitle',
					placeholder: '请输入问题内容',
				},
			],
			flag: true,
			funData: {
				optionsValue: '',
				questionTitle: '',
				imageList: [],
			},
			funRules: {
				questionValue: [
					{ max: 100, message: '选项不超过100个字符', trigger: 'blur' },
				],
				questionTitle: [
					{ required: true, message: '请输入标题', trigger: 'blur' },
					{ max: 100, message: '标题长度不超过100个字符', trigger: 'blur' },
				],
			},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			queryParam: {},
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
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
		localVisibleInput: {
			get() {
				return this.visibleInput
			},
			set(val) {
				this.$emit('update:visibleInput', val)
			},
		},
	},

	methods: {
		// 回显
		detail(row) {
			this.flag = true
			const tempArr = Object.assign({}, row)
			const { optionsValue, imageUrl, image, questionTitle, oid } = tempArr
			this.funData = Object.assign(
				{},
				{
					optionsValue: optionsValue,
					questionTitle: questionTitle || '',
					imageList: [],
					oid: oid || '',
				}
			)
			if (imageUrl) {
				this.funData.imageList[0] = {
					imageList: imageUrl,
				}
			}
			if (image) {
				this.funData.imageList[0] = image
			}
		},

		// 保存
		async submitForm() {
			if (this.action === 'add') {
				this.functionalAreaSave()
			} else {
				this.functionalAreaUpdate()
			}
		},

		// 新增
		async functionalAreaSave() {
			let paramsData
			if (this.localVisibleInput) {
				paramsData = { questionTitle: this.funData.questionTitle }
				if (!paramsData.questionTitle) {
					this.$message.error('标题不能为空')
					return
				}
			} else {
				paramsData = Object.assign(
					{},
					{
						optionsValue: this.funData.optionsValue,
						image: this.funData.imageList[0],
					}
				)
				if (!paramsData.optionsValue && !paramsData.image) {
					this.$message.error('选项名和图片不能全部为空')
					return
				}
			}

			this.resetForm()
			this.$emit('addOpiton', paramsData)
		},

		// 编辑
		async functionalAreaUpdate() {
			let paramsData

			if (this.flag) {
				paramsData = {
					optionsValue: this.funData.optionsValue,
					image: this.funData.imageList[0],
					oid: this.funData.oid,
				}
			} else {
				paramsData = Object.assign(
					{},
					{
						optionsValue: this.funData.optionsValue,
						image: this.funData.imageList[0],
						oid: this.funData.oid,
					}
				)
			}
			if (!paramsData.optionsValue && !paramsData.image) {
				this.$message.error('选项名和图片不能全部为空')
				return
			}
			if (this.localVisibleInput) {
				paramsData = { questionTitle: this.funData.questionTitle }
				if (!paramsData.questionTitle) {
					this.$message.error('标题不能为空')
					return
				}
			}

			this.resetForm()
			this.$emit('editOpiton', paramsData)
		},

		// 关闭弹窗
		resetForm() {
			if (this.localVisibleInput) {
				this.localVisibleInput = false
				this.$refs.formInput.$refs.YxForm.resetFields()
				return
			}
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
			this.funData = {
				optionsValue: '',
				questionTitle: '',
				imageList: [],
			}
		},

		// 上传图标
		async uploadImageHttpRequest(params, key) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					formId: '#addImageFrom_goods',
					imageType: 63,
				})
			)
			if (params.file.size > 500 * 1024) {
				this.funData.imageList = []
				this.$message.warning('上传的图片不能大于500K')
				return
			}
			formData.append('file', params.file)
			const res = await uploadImageList(formData)

			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.funData.image = res.data.resultData.imageList[0].imageUrl
				this.funData[key] = res.data.resultData.imageList
				this.funData[key][0][key] = getSmallImg(
					res.data.resultData.imageList[0].imageUrl
				)
				this.flag = false
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
