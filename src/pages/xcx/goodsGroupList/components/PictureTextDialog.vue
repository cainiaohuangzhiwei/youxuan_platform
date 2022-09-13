<template>
	<div>
		<el-dialog
			width="800px"
			title="编辑"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-form
				ref="form"
				:model="form"
				label-width="80px"
				:rules="rules"
				v-loading="fixLoading"
			>
				<el-form-item label="选择模板">
					<el-select
						v-model="form.materialTemplateId"
						placeholder="请选择选择模板"
						@change="materialTemplateIdChange"
					>
						<el-option
							v-for="(item, index) in brandRefMaterialTemplateList"
							:key="index"
							:label="item.materialTemplateName"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<div style="margin-bottom: 20px">普通文字/图片素材</div>
				<div v-for="(item, index) in form.list" :key="index">
					<el-form-item
						v-if="item.materialType == 'image'"
						:prop="'list.' + index + '.materialContent'"
						:rules="{
							required: true,
							message: '请上传图片',
							trigger: 'blur',
						}"
					>
						<div class="box">
							<i
								v-if="form.materialTemplateId == 0"
								class="el-icon-close box-icon"
								@click="handleDelete(index)"
							></i>
							<el-image
								v-if="item.materialContent"
								class="actBanner-page-url hasImg"
								fit="cover"
								:src="getBigImg(item.materialContent)"
								@click="handleAddEdit(item, index)"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<div class="noImg" v-else>
								<el-button type="text" @click="handleAddEdit(item, index)"
									>点击添加图片素材</el-button
								>
							</div>
						</div>
					</el-form-item>
					<el-form-item
						v-if="item.materialType == 'text'"
						:prop="'list.' + index + '.materialContent'"
						:rules="{
							required: true,
							message: '请输入文字素材',
							trigger: 'blur',
						}"
					>
						<div class="box">
							<i
								v-if="form.materialTemplateId == 0"
								class="el-icon-close box-icon"
								@click="handleDelete(index)"
							></i>
							<el-input
								:disabled="form.materialTemplateId > 0"
								style="width: 600px"
								type="textarea"
								maxlength="200"
								:autosize="{ minRows: 2, maxRows: 4 }"
								placeholder="请输入文字素材"
								v-model="item.materialContent"
							>
							</el-input>
						</div>
					</el-form-item>
				</div>
				<el-form-item>
					<div class="addStyle">
						<el-button
							type="primary"
							:disabled="form.materialTemplateId > 0"
							icon="el-icon-plus"
							@click="addPic"
							>添加图片</el-button
						>
						<el-button
							type="primary"
							:disabled="form.materialTemplateId > 0"
							icon="el-icon-plus"
							@click="addText"
							>添加文字</el-button
						>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<upload-image-dialog
			:visible.sync="dialogUploadVisible"
			:itemInfo.sync="uploadImageItem"
			:brandId.sync="pictureTextRow.brandId"
			@saveUpload="saveUpload"
		></upload-image-dialog>
	</div>
</template>

<script>
import { getBigImg } from '@/utils/imageTool'
import {
	brandMaterialGet,
	brandMaterialSave,
	brandTemplateInfoGet,
	brandTemplateList,
} from '@/api/promotionMaterials'
import uploadImageDialog from './uploadImageDialog'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		pictureTextRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		uploadImageDialog,
	},

	data() {
		return {
			fixLoading: false,
			brandId: '',
			imgIndex: '',
			dialogUploadVisible: false,
			uploadImageItem: {},
			getBigImg,
			form: {
				materialTemplateId: '',
				list: this.getFormList(),
			},
			rules: {},
			brandRefMaterialTemplateList: [],
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			if (val) {
				console.log(
					this.pictureTextRow,
					'pictureTextRowpictureTextRowpictureTextRow'
				)
				this._brandTemplateList()
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
		async materialTemplateIdChange(materialTemplateId) {
			if (materialTemplateId != 0) {
				let {
					data: { resultCode, resultData },
				} = await brandTemplateInfoGet({ materialTemplateId })
				if (resultCode == 0) {
					const { materialTemplateInfoList = [] } = resultData
					if (!materialTemplateInfoList) {
						this.form.list = []
						return
					}
					let newList = materialTemplateInfoList.map((item) => {
						let newItem = {
							materialType: item.materialType,
							materialContent: item.materialContent,
							materialId: null,
						}
						return newItem
					})
					this.form.list = newList
				}
			} else {
				this.form.list = []
			}
		},
		async init() {
			let params = {
				pageNum: 1,
				pageSize: 20,
				brandId: this.pictureTextRow.brandId || '',
				goodsGroupId: this.pictureTextRow.goodsGroupId || '',
			}
			const {
				data: { resultCode, resultData },
			} = await brandMaterialGet(params)
			if (resultCode == 0) {
				let materialTemplateId =
					(resultData.materialList &&
						resultData.materialList[0] &&
						resultData.materialList[0].materialTemplateId) ||
					0
				this.form.materialTemplateId = materialTemplateId
				if (materialTemplateId > 0) {
					this.materialTemplateIdChange(materialTemplateId)
				}
				this.form.list = resultData.materialList || []
			} else {
				this.form.list = []
			}
		},
		// 获取品牌模板
		async _brandTemplateList() {
			this.form.materialTemplateId = ''
			let {
				data: { resultCode, resultData },
			} = await brandTemplateList({
				brandParentId: this.pictureTextRow.brandParentId,
			})
			if (resultCode == 0) {
				this.brandRefMaterialTemplateList = [
					...resultData.brandRefMaterialTemplateList,
					{
						materialTemplateName: '自定义模板',
						id: 0,
					},
				]
			}
			this.init()
		},
		handleAddEdit(item, index) {
			if (this.form.materialTemplateId > 0) {
				return
			}
			this.uploadImageItem = item
			this.imgIndex = index
			this.dialogUploadVisible = true
		},
		saveUpload(val) {
			if (val) {
				if (val.materialPath) {
					this.form.list = this.form.list.map((item, index) => {
						if (index == this.imgIndex) {
							item = val
						}
						if (item.materialPath) {
							item.materialContent = JSON.parse(
								JSON.stringify(item.materialPath)
							)
						}
						return item
					})
				}
			}
		},
		handleDelete(index) {
			this.form.list.splice(index, 1)
		},
		handleSubmit() {
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.submitFix()
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		async submitFix() {
			this.fixLoading = true
			let materialList = this.form.list.map((item) => {
				return {
					materialContent:
						item.materialType == 'image'
							? getBigImg(item.materialContent)
							: item.materialContent,
					materialId: item.materialId,
					materialType: item.materialType,
					sourceId: item.sourceId || '',
				}
			})
			let params = {
				materialList: materialList,
				brandId: this.pictureTextRow.brandId,
				goodsGroupId: this.pictureTextRow.goodsGroupId,
			}
			if (this.form.materialTemplateId > 0) {
				params.materialTemplateId = this.form.materialTemplateId
				params.materialList = []
			}
			const {
				data: { resultCode },
			} = await brandMaterialSave(params)
			this.fixLoading = false
			if (resultCode == 0) {
				this.$message.success('编辑成功')
				this.$emit('Refresh')
				this.pictureTextRow = {}
				this.localVisible = false
			}
		},
		getFormList() {
			return []
		},
		addPic() {
			if (this.form.list.length >= 25) {
				this.$message.warning('图片和文字总计不能添加超过25个以上')
				return
			}
			this.form.list.push({
				materialType: 'image',
				materialContent: '',
				materialId: null,
			})
		},
		addText() {
			if (this.form.list.length >= 25) {
				this.$message.warning('图片和文字总计不能添加超过25个以上')
				return
			}
			this.form.list.push({
				materialType: 'text',
				materialContent: '',
				materialId: null,
			})
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.box {
	position: relative;
}
.box-icon {
	position: absolute;
	right: 0;
}
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
.addStyle {
	width: 100%;
	text-align: right;
}
.noImg {
	width: 240px;
	height: 240px;
	text-align: center;
	line-height: 240px;
	background: rgb(215, 215, 215);
}
.hasImg {
	width: 240px;
	height: 240px;
}
</style>
