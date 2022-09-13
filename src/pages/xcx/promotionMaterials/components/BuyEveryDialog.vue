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
				v-loading="fixLoading"
			>
				<template #groupIdText>
					<el-form
						class="group-layout"
						ref="form101"
						:rules="rules"
						:model="formDataMap"
						label-width="100px"
					>
						<template v-for="(item, index) in formData.groupList">
							<div :key="index" style="margin-bottom: 20px; margin-right: 6px">
								<el-form-item
									style="margin-bottom: 20px"
									:label="materialType == 1 ? '输入档期ID' : '输入品牌ID'"
									:prop="`venueId${index}`"
								>
									<el-input
										:placeholder="
											materialType == 1 ? '请输入档期ID' : '请输入品牌ID'
										"
										v-model="item.venueId"
										@input="
											(value) => {
												setFormDataMap(value, index, 'venueId')
											}
										"
									></el-input>
								</el-form-item>
								<el-form-item
									:key="index"
									:label="materialType == 1 ? '会场文案' : '商品货号'"
									:prop="`content${index}`"
								>
									<el-input
										v-model="item.content"
										maxlength="200"
										@input="
											(value) => {
												setFormDataMap(value, index, 'content')
											}
										"
										:placeholder="
											materialType == 1 ? '请输入会场文案' : '请输入商品货号'
										"
									></el-input>
								</el-form-item>
							</div>
						</template>
					</el-form>
					<!-- <div class="group-layout">
						<div
							v-for="(item, index) in formData.groupList"
							:key="index"
							style="margin-bottom: 20px; margin-right: 6px"
						>
							<div class="input-s" style="margin-bottom: 8px">
								<div class="min-w">
									{{ materialType == 1 ? '输入档期ID' : '输入品牌ID' }}
								</div>
								<el-input
									v-model="item.venueId"
									:placeholder="
										materialType == 1 ? '请输入档期ID' : '请输入品牌ID'
									"
								></el-input>
							</div>
							<div class="input-s">
								<div class="min-w">
									{{ materialType == 1 ? '会场文案' : '商品货号' }}
								</div>
								<el-input
									v-model="item.content"
									maxlength="200"
									:placeholder="
										materialType == 1 ? '请输入会场文案' : '请输入商品货号'
									"
								></el-input>
							</div>
						</div>
					</div> -->
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
		materialType: {
			type: Number,
			default: 1,
		},
	},

	components: {
		YxForm,
		PreviewDialog,
	},

	data() {
		let validatePass = (rule, value, callback) => {
			let reg = /^[+]{0,1}(\d+)$/
			this.formData.groupList.forEach((item) => {
				if (item.venueId) {
					if (!reg.test(item.venueId)) {
						callback(new Error('档期ID只允许输入数字'))
					}
				}
			})
			let someOne = this.formData.groupList.some((item) => {
				return item.venueId
			})
			if (!someOne && this.materialType == 1) {
				callback(new Error('至少要有一个档期ID'))
			}
			callback()
		}
		return {
			formDataMap: {},
			fixLoading: false,
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
					title: '会场配置',
					type: 'custom',
					dataIndex: 'groupIdText',
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
				groupList: this.getList().list,
				headMaterialPath: [],
				backgroundColor: '',
				bottomMaterialPath: [],
			},
			rules: this.getList().rules,
			formRules: {
				headMaterialPath: [
					{ required: true, message: '请上传头部素材', trigger: 'blur' },
				],
				bottomMaterialPath: [
					{ required: true, message: '请上传尾部素材', trigger: 'blur' },
				],
				groupIdText: [{ validator: validatePass, trigger: 'blur' }],
			},
			venueIdList: [],
			formAction: [
				{
					title: '预览',
					type: 'primary',
					click: () => {
						this.$refs.form101.validate((valid) => {
							console.log('valid>>>', valid)
							if (valid) {
								this.submitForm('preview')
							}
						})
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.form101.validate((valid) => {
							if (valid) {
								this.submitForm('save')
							}
						})
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
				this.formData.groupList = this.getList().list
				this.formData.backgroundColor = ''
				this.formDataMap = {}
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
		setFormDataMap(value, index, key) {
			this.$set(this.formDataMap, `${key}${index}`, value)
			this.venueIdList = []
			this.$refs.form.$refs.YxForm.clearValidate()
		},
		getList() {
			let list = [
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
				{ venueId: '', content: '' },
			]
			if (this.materialType == 2) {
				list.push({ venueId: '', content: '' })
			}
			let rules = {}
			list.forEach((item, index) => {
				rules[`venueId${index}`] = [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.formDataMap[`content${index}`] && !value) {
								callback(new Error(`请输入品牌ID`))
							} else if (this.venueIdList.indexOf(value) != -1) {
								callback(
									new Error(
										`不存在该${
											this.materialType == 1 ? '会场' : '品牌'
										}，请重新输入`
									)
								)
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				]
				if (this.materialType == 2) {
					rules[`content${index}`] = [
						{
							required: true,
							validator: (rule, value, callback) => {
								if (this.formDataMap[`venueId${index}`] && !value) {
									callback(new Error(`请输入商品货号`))
								} else {
									callback()
								}
							},
							trigger: 'blur',
						},
					]
				}
			})
			return { list, rules }
		},
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
			this.fixLoading = true
			let venueDTOList = this.formData.groupList.filter((item) => {
				return item.venueId
			})
			let params = {
				materialType: this.materialType,
				materialTemplateType: 1,
				backgroundColor: this.formData.backgroundColor,
				headMaterialPath: getBigImg(this.formData.headMaterialPath[0].imageUrl),
				bottomMaterialPath: getBigImg(
					this.formData.bottomMaterialPath[0].imageUrl
				),
			}
			if (this.materialType == 1) {
				params.venueDTOList = venueDTOList
			} else {
				let goodsDTOList = venueDTOList.map((item) => {
					return {
						brandParentId: item.venueId,
						goodsNumber: item.content,
					}
				})
				params.goodsDTOList = goodsDTOList
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
				data: { resultCode, resultData, resultMsg },
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
			} else {
				let list = resultMsg.split('[')[1].split(']')[0].split(',')
				this.venueIdList = list
				this.$nextTick(() => {
					this.$refs.form101.validate()
				})
			}
		},
	},
}
</script>

<style lang="scss">
.group-layout {
	display: flex;
	flex-wrap: wrap;
}
.input-s {
	display: flex;
}
.min-w {
	min-width: 80px;
}
</style>
