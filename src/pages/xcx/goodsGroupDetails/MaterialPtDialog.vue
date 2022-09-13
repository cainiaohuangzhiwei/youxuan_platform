<template>
	<div>
		<el-dialog
			width="800px"
			title="编辑"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<div style="margin-bottom: 20px">普通文字/图片素材</div>
			<el-form
				ref="form"
				:model="form"
				label-width="80px"
				:rules="rules"
				v-loading="fixLoading"
			>
				<div
					v-for="(item, index) in form.list"
					:key="index"
					style="margin-bottom: 10px"
				>
					<div class="box">
						<i class="el-icon-close box-icon" @click="handleDelete(index)"></i>
						<el-form-item label="素材类型">
							<el-radio-group v-model="item.materialSource">
								<el-radio :label="0">官方素材</el-radio>
								<el-radio :label="1">评价素材</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item
							label="店铺ID"
							:prop="'list.' + index + '.shopId'"
							:rules="{
								required: true,
								message: '请输入店铺ID',
								trigger: 'blur',
							}"
							v-if="item.materialSource == 1"
						>
							<el-input v-model="item.shopId" style="width: 200px"></el-input>
						</el-form-item>
						<el-form-item label="排序值">
							<el-input v-model="item.sort" style="width: 200px"></el-input>
						</el-form-item>
						<el-form-item
							label="上传图片"
							:prop="'list.' + index + '.picMaterialContents'"
						>
							<div class="box-item">
								<div
									v-for="(ite, i) in item.picMaterialContents"
									:key="i"
									class="item-displacement"
								>
									<!-- <div class="item-delete">x</div> -->
									<el-button
										type="text"
										class="item-delete"
										@click="handleDetImg(item, i)"
										>x</el-button
									>
									<div v-if="ite.picMaterialContent">
										<el-image
											class="actBanner-page-url hasImg"
											fit="cover"
											:src="getBigImg(ite.picMaterialContent)"
											@click="handleAddEdit(ite, i, index)"
										>
											<div slot="error" class="image-slot">
												<i class="el-icon-picture-outline"></i>
											</div>
										</el-image>
									</div>
									<div class="noImg" v-else>
										<el-button type="text" @click="handleAddEdit(ite, i, index)"
											>点击添加图片素材</el-button
										>
									</div>
								</div>
								<div v-if="item.picMaterialContents.length < 9">
									<div class="addImg">
										<el-button type="text" @click="handleAdd(item)"
											>添加</el-button
										>
									</div>
								</div>
							</div>
						</el-form-item>
						<el-form-item
							label="文字素材"
							:prop="'list.' + index + '.wordMaterialContent'"
						>
							<div>
								<el-input
									style="width: 600px"
									type="textarea"
									maxlength="200"
									:autosize="{ minRows: 2, maxRows: 4 }"
									placeholder="请输入文字素材"
									v-model="item.wordMaterialContent"
								>
								</el-input>
							</div>
						</el-form-item>
					</div>
				</div>
				<el-form-item>
					<div class="addStyle">
						<el-button type="primary" icon="el-icon-plus" @click="addPic"
							>添加素材</el-button
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
			:goodsNumber.sync="materialPtRow.goodsNumber"
			:brandId.sync="materialPtRow.brandId"
			@saveUpload="saveUpload"
		></upload-image-dialog>
	</div>
</template>

<script>
import { getBigImg } from '@/utils/imageTool'
// import { uploadImageList } from '@/api/image'
import { goodsMaterialGet, goodsMaterialSave } from '@/api/promotionMaterials'
import uploadImageDialog from './uploadImageDialog'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		materialPtRow: {
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
			goodsId: '',
			imgIndex: '',
			ptIndex: '',
			dialogUploadVisible: false,
			uploadImageItem: {},
			getBigImg,
			form: {
				list: this.getFormList(),
			},
			rules: {},
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			if (val) {
				this.init()
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
		async init() {
			let params = {
				pageNum: 1,
				pageSize: 20,
				goodsId: this.materialPtRow.goodsId || '',
			}
			const {
				data: { resultCode, resultData },
			} = await goodsMaterialGet(params)
			console.log(resultData, 'resultDataresultData')
			if (resultCode == 0) {
				this.form.list = resultData.materialList || []
			} else {
				this.form.list = []
			}
		},
		handleAddEdit(ite, i, index) {
			this.uploadImageItem = ite
			this.imgIndex = i
			this.ptIndex = index
			this.dialogUploadVisible = true
		},
		// saveUpload(val) {
		// 	console.log(val, 'valvalvlavav')
		// 	// this.$refs.form && this.$refs.form.resetFields()
		// 	if (val) {
		// 		if (val.materialPath) {
		// 			this.form.list = this.form.list.map((item, index) => {
		// 				if (index == this.imgIndex) {
		// 					item = val
		// 				}
		// 				if (item.materialPath) {
		// 					item.materialContent = JSON.parse(
		// 						JSON.stringify(item.materialPath)
		// 					)
		// 				}
		// 				return item
		// 			})
		// 		}
		// 	}
		// 	this.$forceUpdate()
		// },
		saveUpload(val) {
			if (val) {
				if (val.materialPath) {
					this.form.list = this.form.list.map((item, index) => {
						if (index == this.ptIndex) {
							item.picMaterialContents = item.picMaterialContents.map(
								(ite, i) => {
									if (i == this.imgIndex) {
										ite = val
									}
									if (ite.materialPath) {
										ite.picMaterialContent = JSON.parse(
											JSON.stringify(ite.materialPath)
										)
									}
									return ite
								}
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
		handleDetImg(item, index) {
			item.picMaterialContents.splice(index, 1)
		},
		handleSubmit() {
			console.log(this.form.list, 'listlsitstststst')
			let hasLength = false
			hasLength = this.form.list.every((item) => {
				let hasList = false
				if (item.picMaterialContents) {
					hasList = item.picMaterialContents.some((ite) => {
						return ite.picMaterialContent
					})
				}
				return item.picMaterialContents || hasList
			})
			if (hasLength) {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.submitFix()
					} else {
						console.log('error submit!!')
						return false
					}
				})
			} else {
				return this.$message.warning('图片素材和文字素材的上传必须二选一')
			}
		},
		async submitFix() {
			let goodsRefMaterialList = this.form.list.map((item) => {
				let picMaterialContents = []
				if (item.picMaterialContents) {
					item.picMaterialContents.forEach((ite) => {
						if (ite.picMaterialContent) {
							picMaterialContents.push({
								picMaterialContent: getBigImg(ite.picMaterialContent),
								sourceId: ite.sourceId || '',
							})
						}
					})
					// item.picMaterialContent = item.picMaterialContent.map((ite) => {
					// 	if (ite.picMaterialContent) {
					// 		return {
					// 			picMaterialContent: getBigImg(ite.picMaterialContent),
					// 			sourceId: ite.sourceId || '',
					// 		}
					// 	}
					// })
				}
				return {
					picMaterialContents: picMaterialContents,
					materialSource: item.materialSource,
					wordMaterialContent: item.wordMaterialContent || '',
					sort: item.sort,
					shopId: item.shopId,
					activityGoodsMaterialRefId: item.activityGoodsMaterialRefId || '',
				}
			})
			let reg = this.form.list.some((item) => {
				if (item.sort) {
					return item.sort.toString().replace(/^\d+$/g, '')
				}
			})
			if (reg) {
				return this.$message.warning('素材排序值必须是正整数')
			}
			let params = {
				goodsRefMaterialList: goodsRefMaterialList,
				goodsId: this.materialPtRow.goodsId,
			}
			this.fixLoading = true
			const {
				data: { resultCode },
			} = await goodsMaterialSave(params)
			this.fixLoading = false
			if (resultCode == 0) {
				this.$message.success('编辑成功')
				this.materialPtRow = {}
				this.$emit('Refresh')
				this.localVisible = false
			}
		},
		getFormList() {
			return []
		},
		handleAdd(item) {
			item.picMaterialContents.push({
				picMaterialContent: '',
			})
		},
		addPic() {
			if (this.form.list.length >= 25) {
				this.$message.warning('素材模块总计不能添加超过25个以上')
				return
			}
			this.form.list.push({
				sort: '',
				shopId: '',
				materialSource: 0,
				picMaterialContents: [{ picMaterialContent: '' }],
				wordMaterialContent: '',
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
.box-item {
	display: flex;
	flex-wrap: wrap;
}
.item-displacement {
	margin-right: 10px;
	margin-bottom: 10px;
	position: relative;
}
.item-delete {
	position: absolute;
	right: 6px;
	top: 0;
	font-size: 18px;
	z-index: 999;
}
.box {
	position: relative;
	border: 1px solid #cccccc;
	padding: 10px;
	box-sizing: border-box;
}
.box-icon {
	position: absolute;
	right: 12px;
	z-index: 999;
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
.hasImg {
	width: 180px;
	height: 180px;
}
.noImg {
	width: 180px;
	height: 180px;
	text-align: center;
	line-height: 180px;
	background: rgb(215, 215, 215);
}
.addImg {
	width: 60px;
	height: 180px;
	text-align: center;
	line-height: 180px;
}
</style>
