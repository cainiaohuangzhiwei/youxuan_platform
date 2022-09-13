<template>
	<div>
		<yx-dialog
			:width="`800px`"
			v-loading="loading"
			:title="dialogTitle"
			:visible.sync="localVisible"
		>
			<yx-form
				ref="dialog106"
				labelWidth="140px"
				:data="dialogData"
				:rules="rules"
				:items="dialogCfg"
				:formAction="dialogAction"
			>
				<template slot="addbtn">
					<div class="addStyle">
						<el-button
							type="primary"
							icon="el-icon-plus"
							@click="addTemplate('image')"
							>添加图片</el-button
						>
						<el-button
							type="primary"
							icon="el-icon-plus"
							@click="addTemplate('text')"
							>添加文字</el-button
						>
					</div>
				</template>
				<template slot="addBox">
					<div v-for="(item, index) in materialTemplateList" :key="index">
						<template v-if="item.materialType == 'image'">
							<div class="item-box">
								<div class="noImg" v-if="!item.materialContent">
									<el-button type="text" @click="handleAddEdit(item, index)"
										>点击添加图片素材</el-button
									>
								</div>
								<div v-else class="img-item">
									<el-image
										fit="cover"
										class="img-item"
										:src="item.materialContent"
										:preview-src-list="[item.materialContent]"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
								</div>
								<i
									class="el-icon-close box-icon"
									@click="_brandTemplateInfoDelete(index)"
								></i>
							</div>
						</template>
						<template v-else>
							<div class="item-box">
								<el-input
									type="textarea"
									:rows="4"
									maxlength="255"
									placeholder="请输入内容"
									v-model="item.materialContent"
									show-word-limit
								>
								</el-input>
								<i
									class="el-icon-close box-icon"
									@click="_brandTemplateInfoDelete(index)"
								></i>
							</div>
						</template>
					</div>
				</template>
			</yx-form>
		</yx-dialog>
		<upload-image-dialog
			:visible.sync="dialogUploadVisible"
			:itemInfo.sync="uploadImageItem"
			:brandParentId.sync="$route.params.brandParentId"
			@saveUpload="saveUpload"
		></upload-image-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import uploadImageDialog from './uploadImageDialog'
import YxForm from '@wg-vue-materials/yx-form'
import { getBigImg } from '@/utils/imageTool'
import {
	brandTemplateSave,
	brandTemplateInfoSave,
	brandTemplateInfoGet,
	brandTemplateInfoDelete,
} from '@/api/promotionMaterials'
export default {
	components: {
		YxDialog,
		YxForm,
		uploadImageDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		//标题
		dialogTitle: {
			type: String,
			default: '',
		},
		// 项的信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			getBigImg,
			dialogUploadVisible: false,
			uploadImageItem: {},
			loading: false,
			dialogData: {
				materialTemplateName: '',
				materialTemplateRemark: '',
			},
			rules: {
				materialTemplateName: [
					{ required: true, message: '请输入模板名称', trigger: 'blur' },
				],
			},
			dialogCfg: [
				{
					type: 'input',
					title: '模板名称',
					dataIndex: 'materialTemplateName',
					maxlength: 255,
				},
				{
					type: 'textarea',
					title: '备注',
					dataIndex: 'materialTemplateRemark',
					autosize: {
						minRows: 5,
						maxRows: 9,
					},
					maxlength: 255,
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'addBox',
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'addbtn',
				},
			],
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._brandTemplateSave()
					},
				},
			],
			dialogQuestionnaireVisible: false,
			selectedQuestionnaire: {},
			materialTemplateList: [],
			imgIndex: null,
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.dialogVisible
			},
			set(val) {
				this.$emit('update:dialogVisible', val)
			},
		},
	},
	watch: {
		dialogVisible() {
			if (this.dialogVisible) {
				this.materialTemplateList = []
				this.$nextTick(() => {
					this.$refs.dialog106.$refs.YxForm.clearValidate()
				})
				if (this.itemInfo && this.itemInfo.id) {
					this.dialogData = { ...this.itemInfo }
					this._brandTemplateInfoGet()
				} else {
					this.dialogData = {
						materialTemplateName: '',
						materialTemplateRemark: '',
					}
				}
			}
		},
	},
	methods: {
		saveUpload(val) {
			if (val) {
				this.materialTemplateList[this.imgIndex].materialContent =
					val.materialPath
			}
		},
		handleAddEdit(item, index) {
			this.uploadImageItem = item
			this.imgIndex = index
			this.dialogUploadVisible = true
		},
		async _brandTemplateInfoGet() {
			let {
				data: { resultCode, resultData },
			} = await brandTemplateInfoGet({ materialTemplateId: this.itemInfo.id })
			if (resultCode == 0) {
				this.materialTemplateList = resultData.materialTemplateInfoList || []
			}
		},
		async _brandTemplateSave() {
			let paramsData = {
				brandParentId: this.$route.params.brandParentId,
				materialTemplateName: this.dialogData.materialTemplateName,
				materialTemplateRemark: this.dialogData.materialTemplateRemark,
			}
			if (this.itemInfo.id) {
				paramsData.materialTemplateId = this.itemInfo.id
			}
			let {
				data: { resultCode, resultData },
			} = await brandTemplateSave(paramsData)
			if (resultCode == 0) {
				let materialTemplateInfoDTOList = this.materialTemplateList.filter(
					(item) => {
						return item.materialContent
					}
				)
				if (!materialTemplateInfoDTOList.length) {
					this.localVisible = false
					this.materialTemplateList = []
					this.localVisible = false
					this.$emit('initList')
					return this.$message.success(
						this.itemInfo.id ? '编辑成功' : '新增成功'
					)
				}

				let {
					data: { resultCode: code },
				} = await brandTemplateInfoSave({
					materialTemplateId: resultData,
					materialTemplateInfoDTOList,
				})
				if (code == 0) {
					this.$message.success(this.itemInfo.id ? '编辑成功' : '新增成功')
					this.localVisible = false
					this.materialTemplateList = []
					this.$emit('initList')
				}
			}
		},
		addTemplate(materialType) {
			if (this.materialTemplateList.length >= 25) {
				this.$message.warning('图片和文字总计不能添加超过25个以上')
				return
			}
			let obj = {
				materialType,
				materialContent: '',
			}
			this.materialTemplateList.push(obj)
		},
		async _brandTemplateInfoDelete(index) {
			if (this.materialTemplateList[index].id) {
				let {
					data: { resultCode },
				} = await brandTemplateInfoDelete({
					id: this.materialTemplateList[index].id,
				})
				if (resultCode == 0) {
					this.$delete(this.materialTemplateList, index)
					this.$message.success('删除成功')
				}
			} else {
				this.$delete(this.materialTemplateList, index)
				this.$message.success('删除成功')
			}
		},
	},
}
</script>

<style lang="scss">
.poster_upload {
	box-sizing: border-box;
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: #ddd;
	text-align: center;
	line-height: 20px;
	border: 1px solid #ccc;
	border-radius: 4px;
	position: relative;
}
.upload_tip {
	width: 120px;
	height: 120px;
	padding-top: 30px;
	line-height: 30px;
}
.update_image .upload_tip {
	height: 24px;
	padding: 0;
	line-height: 24px;
}
.img-item {
	width: 120px;
	height: 120px;
	border-radius: 5px;
	position: relative;
}
.item-box {
	display: flex;
	justify-content: space-between;
	margin: 20px 0;
}
.box-icon {
	cursor: pointer;
}
.noImg {
	width: 240px;
	height: 240px;
	text-align: center;
	line-height: 240px;
	background: rgb(215, 215, 215);
}
</style>
<style>
.poster_upload .el-upload-dragger {
	cursor: pointer;
	width: 100%;
	height: 100%;
	background: transparent;
	float: left;
	text-align: center;
	line-height: 20px;
	/* padding-top: 35px; */
	position: absolute;
	left: 0;
	top: 0;
}
.update_image .el-upload-dragger {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 24px;
	text-align: center;
	line-height: 24px;
	border: none;
	background-color: #e7e7e7;
}
</style>
