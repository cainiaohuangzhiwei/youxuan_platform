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
				<template #resource>
					<div>
						<el-radio-group v-model="formData.resource" @change="handleChange">
							<el-radio label="1">模板1</el-radio>
							<el-radio label="2">模板2</el-radio>
							<el-radio label="3">模板3</el-radio>
							<el-radio label="4">模板4</el-radio>
							<el-radio label="5">模板5</el-radio>
							<el-radio label="6">模板6</el-radio>
							<el-radio label="7">模板7</el-radio>
							<el-radio label="0">自定义坐标</el-radio>
						</el-radio-group>
					</div>
				</template>
				<template #coordinate>
					<div class="input-layout">
						<div class="xy">
							<div class="mw">X轴：</div>
							<el-input
								v-model="formData.xinput"
								:disabled="coordDisabled"
								placeholder="请输入x轴"
							></el-input>
						</div>
						<div class="xy">
							<div class="mw">y轴：</div>
							<el-input
								v-model="formData.yinput"
								:disabled="coordDisabled"
								placeholder="请输入y轴"
							></el-input>
						</div>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getSmallImg, getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import { materialSave, materialUpdate } from '@/api/promotionMaterials'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		id: [String, Number],
		levelRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		let validatePass = (rule, value, callback) => {
			let reg = /^[+]{0,1}(\d+)$/
			if (!this.formData.xinput || !this.formData.yinput) {
				return callback(new Error('二维码坐标不能为空'))
			}
			if (!reg.test(this.formData.xinput) || !reg.test(this.formData.yinput)) {
				return callback(new Error('二维码坐标必须为正整数'))
			} else {
				callback()
			}
		}
		return {
			levelObj: {},
			coordDisabled: true,
			item: [
				{
					title: '素材图片',
					type: 'custom',
					dataIndex: 'resource',
				},
				{
					title: '二维码坐标',
					type: 'custom',
					dataIndex: 'coordinate',
				},
				{
					type: 'uploadImage',
					title: '素材图片',
					dataIndex: 'materialPath',
					uploadAttributes: {
						limit: 1,
						imageName: 'materialPath',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'materialPath', 3145728),
					},
				},
			],
			formData: {
				resource: '1',
				xinput: '275',
				yinput: '1458',
				materialPath: [],
			},
			formRules: {
				materialPath: [
					{ required: true, message: '请上传尾部素材', trigger: 'blur' },
				],
				coordinate: [{ validator: validatePass, trigger: 'blur' }],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			if (val) {
				this.levelObj = JSON.parse(JSON.stringify(this.levelRow))
				// if(this.levelObj.templateType){

				// }
				this.formData.resource = this.levelObj?.templateType?.toString() || '1'
				this.formData.xinput = this.levelObj?.xcoordinate || 275
				this.formData.yinput = this.levelObj?.ycoordinate || 1458
				if (this.levelObj.materialPath) {
					this.formData.materialPath = [
						{
							materialPath: getBigImg(this.levelObj.materialPath),
						},
					]
				} else {
					this.formData.materialPath = []
				}
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
		handleChange(val) {
			this.coordDisabled = true
			if (val == 1) {
				this.formData.xinput = 275
				this.formData.yinput = 1458
			} else if (val == 2) {
				this.formData.xinput = 275
				this.formData.yinput = 607
			} else if (val == 3) {
				this.formData.xinput = 496
				this.formData.yinput = 734
			} else if (val == 4) {
				this.formData.xinput = 280
				this.formData.yinput = 777
			} else if (val == 5) {
				this.formData.xinput = 175
				this.formData.yinput = 567
			} else if (val == 6) {
				this.formData.xinput = 554
				this.formData.yinput = 1414
			} else if (val == 7) {
				this.formData.xinput = 459
				this.formData.yinput = 334
			} else {
				this.formData.xinput = ''
				this.formData.yinput = ''
				this.coordDisabled = false
			}
		},
		async uploadImageHttpRequest(params, key, maxSize) {
			const size = params.file.size
			if (maxSize && size > maxSize) {
				this.$message.warning(`图片大小不超过${maxSize}K`)
				this.formData[key] = []
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
		async submitForm() {
			let params = {
				materialType: 3,
				materialTemplateType: 1,
				templateType: this.formData.resource,
				materialPath: this.formData.materialPath[0].materialPath,
				xcoordinate: this.formData.xinput,
				ycoordinate: this.formData.yinput,
			}
			if (this.id) {
				params.id = this.id
			}
			let {
				data: { resultCode },
			} = this.id ? await materialUpdate(params) : await materialSave(params)
			if (resultCode == 0) {
				this.$message.success('保存成功')
				this.$emit('Refresh', true)
				this.localVisible = false
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.input-layout {
	display: flex;
	align-items: center;
}
.xy {
	display: flex;
	align-items: center;
	margin-right: 6px;
}
.mw {
	min-width: 40px;
}
</style>
