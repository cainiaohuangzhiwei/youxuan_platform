<template>
	<div v-loading="fixLoading">
		<div class="one-layout">
			<div style="margin-bottom: 20px">合成素材图片：</div>
			<el-form
				ref="fixedForm"
				:model="fixedForm"
				label-width="80px"
				:rules="rules"
			>
				<div v-for="(item, index) in fixedForm.list" :key="index">
					<el-form-item v-if="item.type == 'image'">
						<div class="box">
							<i
								class="el-icon-close box-icon"
								@click="handleDelete(item, index)"
							></i>
							<el-image
								v-if="item.materialPath"
								class="actBanner-page-url hasImg"
								fit="cover"
								:src="getBigImg(item.materialPath)"
								@click="handleEdit(item, index)"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<div class="noImg" v-else>
								<el-button type="text" @click="handleEdit(item, index)"
									>点击添加图片素材</el-button
								>
							</div>
						</div>
					</el-form-item>
					<el-form-item v-if="item.type == 'text'">
						<div class="box">
							<i
								class="el-icon-close box-icon"
								@click="handleDelete(item, index)"
							></i>
							<el-input
								style="width: 500px; margin-right: 10px"
								type="textarea"
								maxlength="200"
								:autosize="{ minRows: 2, maxRows: 4 }"
								placeholder="请输入文字素材"
								v-model="item.materialContent"
							>
							</el-input>
							<el-button type="primary" @click="handleSubmit(item)"
								>确定</el-button
							>
						</div>
					</el-form-item>
				</div>
				<el-form-item>
					<div class="addStyle">
						<el-button type="primary" icon="el-icon-plus" @click="addPic"
							>添加图片</el-button
						>
						<el-button type="primary" icon="el-icon-plus" @click="addText"
							>添加文字</el-button
						>
					</div>
				</el-form-item>
			</el-form>
		</div>
		<div class="one-layout">
			<div style="margin-top: 20px; margin-bottom: 20px">
				普通文字/图片素材：
			</div>
			<el-form
				ref="customForm"
				:model="customForm"
				label-width="80px"
				:rules="rules"
			>
				<div v-for="(item, index) in customForm.list" :key="index">
					<el-form-item v-if="item.type == 'image'">
						<div class="box">
							<i
								class="el-icon-close box-icon"
								@click="handleDelete2(item, index)"
							></i>
							<el-image
								v-if="item.materialPath"
								class="actBanner-page-url hasImg"
								fit="cover"
								:src="getBigImg(item.materialPath)"
								@click="handleCommon(item, index)"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<div class="noImg" v-else>
								<el-button type="text" @click="handleCommon(item, index)"
									>点击添加图片素材</el-button
								>
							</div>
						</div>
					</el-form-item>
					<el-form-item v-if="item.type == 'text'">
						<div class="box">
							<i
								class="el-icon-close box-icon"
								@click="handleDelete2(item, index)"
							></i>
							<el-input
								style="width: 500px; margin-right: 10px"
								type="textarea"
								maxlength="200"
								:autosize="{ minRows: 2, maxRows: 4 }"
								placeholder="请输入文字素材"
								v-model="item.materialContent"
							>
							</el-input>
							<el-button type="primary" @click="handleCustom(item)"
								>确定</el-button
							>
						</div>
					</el-form-item>
				</div>
				<el-form-item>
					<div class="addStyle">
						<el-button type="primary" icon="el-icon-plus" @click="addPic2"
							>添加图片</el-button
						>
						<el-button type="primary" icon="el-icon-plus" @click="addText2"
							>添加文字</el-button
						>
					</div>
				</el-form-item>
			</el-form>
		</div>
		<level-promotion-dialog
			:visible.sync="levelPromotionDialog"
			:levelRow="levelRow"
			:id="id"
			@Refresh="Refresh"
		></level-promotion-dialog>
		<Dialog
			title="图片素材"
			:visible.sync="dialogVisible184"
			:width="dialogWidth184"
			:bottomBtn="dialogBottomBtn184"
		>
			<yx-form
				ref="dialog106"
				labelWidth="100px"
				:data="formData106"
				:items="formCfg106"
				:rules="formRules106"
				v-loading="fixLoading"
			>
			</yx-form>
		</Dialog>
	</div>
</template>
<script>
// import BuyEveryDialog from './BuyEveryDialog'
import LevelPromotionDialog from './LevelPromotionDialog'
import {
	materialList,
	materialUpdate,
	materialDelete,
	materialSave,
} from '@/api/promotionMaterials'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
export default {
	data() {
		return {
			customRow: null,
			dialogVisible184: false,
			dialogWidth184: '600px',
			dialogBottomBtn184: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog106.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActivityList()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData106: {
				activityImage: [],
			},
			formCfg106: [
				{
					type: 'uploadImage',
					title: '图片素材',
					dataIndex: 'activityImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'activityImage',
						httpRequest: (file) => this.uploadImageHttpRequest(file, 3145728),
					},
				},
			],
			formRules106: {
				activityImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData106.activityImage.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			imgIndex: '',
			customForm: {
				list: [],
			},
			fixedForm: {
				list: [],
			},
			fixLoading: false,
			getBigImg,
			list: null,
			buyEveryDialog: false,
			levelPromotionDialog: false,
			textarea: '',
			id: '',
			checked: 0,
		}
	},
	components: {
		// BuyEveryDialog,
		Dialog,
		YxForm,
		LevelPromotionDialog,
	},
	methods: {
		saveAddActivityList: async function () {
			let params = {
				materialPath: this.formData106.activityImage[0].activityImage,
			}
			if (this.customRow.id) {
				params.id = this.customRow.id
			} else {
				params.materialType = 3
				params.materialTemplateType = 2
			}
			let {
				data: { resultCode },
			} = this.customRow.id
				? await materialUpdate(params)
				: await materialSave(params)
			if (resultCode == 0) {
				this.$message.success('保存成功')
				this.dialogVisible184 = false
				this.init()
			}
		},
		handleCommon(item, index) {
			this.customRow = item
			this.dialogVisible184 = true
			this.imgIndex = index
			if (item.materialPath) {
				this.formData106.activityImage = [
					{
						activityImage: getBigImg(item.materialPath),
					},
				]
			} else {
				this.formData106.activityImage = []
			}
		},
		addPic() {
			if (this.fixedForm.list.length >= 25) {
				this.$message.warning('图片和文字总计不能添加超过25个以上')
				return
			}
			this.fixedForm.list.push({
				type: 'image',
				materialPath: '',
			})
		},
		addText() {
			if (this.fixedForm.list.length >= 25) {
				this.$message.warning('图片和文字总计不能添加超过25个以上')
				return
			}
			this.fixedForm.list.push({
				type: 'text',
				materialContent: '',
			})
		},
		addPic2() {
			if (this.customForm.list.length >= 25) {
				this.$message.warning('图片和文字总计不能添加超过25个以上')
				return
			}
			this.customForm.list.push({
				type: 'image',
				materialPath: '',
			})
		},
		addText2() {
			if (this.customForm.list.length >= 25) {
				this.$message.warning('图片和文字总计不能添加超过25个以上')
				return
			}
			this.customForm.list.push({
				type: 'text',
				materialContent: '',
			})
		},
		handleDelete(item, index) {
			if (item.id) {
				this.queryDelete(item.id, index, 1)
			} else {
				this.fixedForm.list.splice(index, 1)
				this.$message.success('删除成功')
			}
		},
		handleDelete2(item, index) {
			if (item.id) {
				this.queryDelete(item.id, index, 2)
			} else {
				this.customForm.list.splice(index, 1)
				this.$message.success('删除成功')
			}
		},
		async queryDelete(id, index, idx) {
			let params = {
				id: id,
			}
			let {
				data: { resultCode },
			} = await materialDelete(params)
			if (resultCode == 0) {
				if (idx == 2) {
					this.customForm.list.splice(index, 1)
				} else {
					this.fixedForm.list.splice(index, 1)
				}
				this.$message.success('删除成功')
			}
		},
		async uploadImageHttpRequest(params, maxSize) {
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
				JSON.stringify({ formId: '#portraitImageFrom', imageType: 34 })
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			console.log(resultCode, resultData)
			if (resultCode == 0) {
				this.formData106.activityImage = resultData.imageList
				this.formData106.activityImage[0].activityImage = getBigImg(
					resultData.imageList[0].imageUrl
				)
			}
			this.$forceUpdate()
		},
		async handleSubmit(item) {
			if (!item.materialContent) {
				return
			}
			let params = {
				materialContent: item.materialContent,
			}
			if (item.id) {
				params.id = item.id
			} else {
				params.materialType = 3
				params.materialTemplateType = 1
			}
			let {
				data: { resultCode },
			} = item.id ? await materialUpdate(params) : await materialSave(params)
			if (resultCode == 0) {
				this.$message.success('保存成功')
				this.init()
			}
		},
		async handleCustom(item) {
			if (!item.materialContent) {
				return
			}
			let params = {
				materialContent: item.materialContent,
			}
			if (item.id) {
				params.id = item.id
			} else {
				params.materialType = 3
				params.materialTemplateType = 2
			}
			let {
				data: { resultCode },
			} = item.id ? await materialUpdate(params) : await materialSave(params)
			if (resultCode == 0) {
				this.$message.success('保存成功')
				this.init()
			}
		},
		Refresh() {
			this.init()
		},
		init: async function () {
			let paramJson = {
				// pageNum: 1,
				// pageSize: 10,
				materialType: 3,
			}
			const {
				data: { resultCode, resultData },
			} = await materialList(paramJson)
			console.log(resultData, 'resultDataresultData')
			if (resultCode == 0) {
				if (resultData.custom && resultData.custom.length) {
					this.customForm.list = resultData.custom.map((item) => {
						if (item.materialPath) {
							item.type = 'image'
						} else {
							item.type = 'text'
						}
						return item
					})
				}
				if (resultData.fixed && resultData.fixed.length) {
					this.fixedForm.list = resultData.fixed.map((item) => {
						if (item.materialPath) {
							item.type = 'image'
						} else {
							item.type = 'text'
						}
						return item
					})
				}
				// this.customForm.list = resultData?.custom || []
				// this.fixedForm.list = resultData?.fixed || []
			} else {
				this.customForm.list = []
				this.fixedForm.list = []
			}
		},
		handleEdit(item, index) {
			this.imgIndex = index
			this.id = item.id || ''
			this.levelRow = item
			this.levelPromotionDialog = true
		},
	},
}
</script>
<style lang="scss" scoped>
.layout {
	width: 400px;
	// height: 315px;
	margin-top: 10px;
	background: rgb(237, 237, 237);
	padding: 12px 0;
	display: flex;
	flex-direction: column;
}
.box-top {
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-bottom: 10px;
}
.layout-l-img {
	width: 162px;
	text-align: center;
}
.layout-l {
	width: 162px;
	height: 280px;
	background: rgb(215, 215, 215);
}
.layout-r {
	height: 280px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}
.r-box {
	display: flex;
	align-items: center;
}
.box-bottom {
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.one-layout {
	width: 80%;
}
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
	width: 180px;
}
</style>
