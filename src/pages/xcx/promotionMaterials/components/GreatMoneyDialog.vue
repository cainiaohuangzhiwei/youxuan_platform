<template>
	<div>
		<el-dialog
			width="800px"
			title="编辑海报"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				labelWidth="100px"
				:formAction="formAction"
			>
				<template #goodsNumberList>
					<div>
						<el-select
							v-model.trim="formData.goodsNumberList"
							multiple
							filterable
							allow-create
							default-first-option
						>
							<!-- <el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option> -->
						</el-select>
					</div>
				</template>
			</yx-form>
		</el-dialog>
		<preview-dialog
			:visible.sync="previewDialog"
			:previewImg="previewImg"
			@PreviewRefresh="PreviewRefresh"
		></preview-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getSmallImg, getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import { materialSavePreview } from '@/api/promotionMaterials'
import PreviewDialog from './PreviewDialog'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		id: [String, Number],
		modifyAmountRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		PreviewDialog,
	},

	data() {
		let validatePass = (rule, value, callback) => {
			// let reg = /^[+]{0,1}(\d+)$/
			// this.formData.goodsNumberList.forEach((item) => {
			// 	if (item) {
			// 		if (!reg.test(item)) {
			// 			callback(new Error('商品ID只允许输入数字'))
			// 		}
			// 	}
			// })
			if (this.formData.goodsNumberList.length < 1) {
				callback(new Error('至少输入一个商品货号'))
			}
			callback()
		}
		return {
			previewDialog: false,
			previewImg: null,
			item: [
				{
					type: 'uploadImage',
					title: '头部素材',
					dataIndex: 'headMaterialPath',
					uploadAttributes: {
						limit: 1,
						imageName: 'headMaterialPath',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'headMaterialPath', 3145728),
					},
				},
				{
					type: 'input',
					title: '背景色',
					dataIndex: 'backgroundColor',
					// maxlength: 10,
				},
				{
					title: '输入商品货号',
					type: 'custom',
					dataIndex: 'goodsNumberList',
				},
				{
					type: 'uploadImage',
					title: '尾部素材',
					dataIndex: 'bottomMaterialPath',
					uploadAttributes: {
						limit: 1,
						imageName: 'bottomMaterialPath',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'bottomMaterialPath', 3145728),
					},
				},
			],
			formData: {
				headMaterialPath: [],
				backgroundColor: '',
				goodsNumberList: [],
				bottomMaterialPath: [],
			},
			formRules: {
				headMaterialPath: [
					{ required: true, message: '请上传头部素材', trigger: 'blur' },
				],
				bottomMaterialPath: [
					{ required: true, message: '请上传尾部素材', trigger: 'blur' },
				],
				goodsNumberList: [
					{ validator: validatePass, trigger: ['blur', 'change'] },
				],
			},
			formAction: [
				{
					title: '预览',
					type: 'primary',
					click: () => {
						this.submitForm('preview')
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm('save')
					},
				},
			],
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			if (val) {
				this.formData.headMaterialPath = []
				this.formData.bottomMaterialPath = []
				this.formData.goodsNumberList = []
				this.formData.backgroundColor = ''
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
		async uploadImageHttpRequest(params, key, maxSize) {
			const size = params.file.size
			if (maxSize && size > maxSize) {
				this.$message.warning(`图片大小不超过${maxSize}K`)
				this.formData['activityImage'] = []
				return
			}
			//上传海报
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addImageFrom_goods', imageType: 81 })
			)
			formData.append('file', params.file)
			let {
				data: { resultData },
			} = await uploadImageList(formData)
			this.formData[key] = resultData.imageList
			this.formData[key][0][key] = getSmallImg(resultData.imageList[0].imageUrl)
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		async submitForm(identifier) {
			if (this.formData.goodsNumberList.length > 11) {
				return this.$message.warning('输入的商品货号不能超过11个')
			}
			let params = {
				materialType: 2,
				materialTemplateType: 1,
				backgroundColor: this.formData.backgroundColor,
				goodsNumberList: this.formData.goodsNumberList,
				headMaterialPath: getBigImg(this.formData.headMaterialPath[0].imageUrl),
				bottomMaterialPath: getBigImg(
					this.formData.bottomMaterialPath[0].imageUrl
				),
			}
			if (identifier == 'preview') {
				params.isSave = false
			} else {
				params.isSave = true
			}
			if (this.id) {
				params.id = this.id
			}
			let {
				data: { resultCode, resultData },
			} = await materialSavePreview(params)
			this.fixLoading = false
			if (resultCode == 0) {
				if (identifier == 'save') {
					this.$message.success('保存成功')
					this.$emit('Refresh', true)
					this.localVisible = false
				} else {
					this.previewImg = resultData
					this.previewDialog = true
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
