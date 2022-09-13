/* eslint-disable no-dupe-else-if */
<template>
	<div class="bmd">
		<el-dialog
			width="800px"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<!-- <div style="height: 100vh"> -->
			<div class="box">
				<div class="solt">
					<img
						class="goods_img"
						:src="getSmallImg(brandRow.brandImgUrl || brandRow.brandLogoUrl)"
						alt=""
					/>
					<div>
						<div class="goodsName">
							{{ brandRow.brandParentName }}
						</div>
						<div class="statusH">ID：{{ brandRow.brandParentId }}</div>
					</div>
				</div>
			</div>
			<div>
				<el-form
					ref="form"
					:model="form"
					label-width="100px"
					:rules="rules"
					v-loading="fixLoading"
				>
					<div class="formBox">
						<el-form-item label="素材内容" prop="text">
							<div>
								<el-input
									style="width: 400px"
									type="textarea"
									maxlength="400"
									:autosize="{ minRows: 4, maxRows: 6 }"
									placeholder="请输入文字素材"
									v-model="form.text"
								>
								</el-input>
							</div>
						</el-form-item>
						<el-form-item prop="imgList">
							<div>
								<div class="ivbox">
									<draggable
										v-model="form.imgList"
										@update="datadragEnd()"
										v-bind="{ animation: 500 }"
									>
										<transition-group>
											<!-- <div class="imgVideo"> -->
											<div
												v-for="(ite, idx) in form.imgList"
												:key="idx"
												class="imgVideo"
											>
												<div v-if="ite.materialType == 'video'" class="posbox">
													<i
														class="el-icon-close ivbox-icon"
														@click="deleteImgV(idx)"
													></i>
													<video
														:src="ite.materialContent"
														class="c_image"
													></video>
												</div>
												<div v-if="ite.materialType == 'image'" class="posbox">
													<i
														class="el-icon-close ivbox-icon"
														@click="deleteImgV(idx)"
													></i>
													<el-image
														class="c_image"
														fit="cover"
														:src="ite.materialContent"
													>
														<div slot="error" class="el-image__error">
															<i class="el-icon-picture-outline"></i>
														</div>
													</el-image>
												</div>
											</div>
										</transition-group>
									</draggable>
									<multiple-upload
										v-if="form.imgList && form.imgList.length < 9"
										style="margin-right: 14px"
										:imgList="form.imgList"
										:fileList="form.fileList"
										@upload="upload"
										:videoMaxSize="200"
									></multiple-upload>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="状态">
							<el-radio-group v-model="form.status">
								<el-radio :label="1">启用</el-radio>
								<el-radio :label="0">禁用</el-radio>
							</el-radio-group>
						</el-form-item>
					</div>
				</el-form>
				<div class="foot-b">
					<el-button @click="handleCancel">取消</el-button>
					<el-button type="primary" @click="submit('form')">确定</el-button>
				</div>
			</div>
			<!-- </div> -->
		</el-dialog>
	</div>
</template>

<script>
// import uploadCos from './uploadCos'
import multipleUpload from '@/components/multipleUpload'
import { getSmallImg } from '@/utils/imageTool'
import { brandParentDetail, brandParentSave } from '@/api/newMaterial'
import draggable from 'vuedraggable'
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		brandMaterialRow: {
			define: false,
			default: () => {},
		},
	},

	components: {
		multipleUpload,
		draggable,
	},

	data() {
		let validateWordMaterialContent = (rule, value, callback) => {
			if (!this.form.imgList.length && value == '') {
				callback(new Error('素材文本内容不能为空'))
			}
			callback()
		}
		let validateImgList = (rule, value, callback) => {
			if (!this.form.text && value == '') {
				callback(new Error('素材图片或视频内容不能为空'))
			}
			callback()
		}
		return {
			brandRow: {},
			fixLoading: false,
			form: {
				text: '',
				imgList: [],
				fileList: [],
				status: 1,
			},
			rules: {
				text: [
					{
						required: true,
						validator: validateWordMaterialContent,
						trigger: ['blur', 'change'],
					},
				],
				imgList: [
					{
						required: true,
						validator: validateImgList,
						trigger: ['blur', 'change'],
					},
				],
			},
			getSmallImg: getSmallImg,
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			if (val) {
				this.form = {
					text: '',
					imgList: [],
					fileList: [],
					status: 1,
				}
				this._brandParentDetail()
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
		async _brandParentDetail() {
			let params = {
				brandParentId: this.brandMaterialRow.brandParentId,
			}
			this.fixLoading = true
			let {
				data: { resultCode, resultData },
			} = await brandParentDetail(params)
			this.fixLoading = false
			if (resultCode == 0) {
				this.brandRow = resultData
				if (resultData.status == 0) {
					this.form.status = 0
				} else if (resultData.status == 1) {
					this.form.status = 1
				} else {
					this.form.status = 1
				}
				// this.form.status = resultData.status || 1
				console.log(this.form.status)
				if (resultData.text) {
					this.form.text = resultData.text
				}
				this.form.imgList =
					JSON.parse(JSON.stringify(resultData.materialDetailList)) || []
				this.form.fileList =
					JSON.parse(JSON.stringify(resultData.materialDetailList)) || []
			}
		},
		handleDelete(i) {
			this.form.list.splice(i, 1)
		},
		submit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let canFix = this.handleData()
					if (canFix) {
						this.$message.warning('一个素材最多上传一个视频')
					} else {
						this._brandParentSave()
					}
				}
			})
		},
		handleData() {
			let canFix = false
			if (this.form.imgList && this.form.imgList.length) {
				let arr = this.form.imgList.filter((item) => {
					return item.materialType == 'video'
				})
				if (arr && arr.length > 1) {
					canFix = true
				}
			}
			return canFix
		},
		async _brandParentSave() {
			if (this.fixLoading) return
			this.fixLoading = true
			let params = {
				brandParentId: this.brandMaterialRow.brandParentId,
				status: this.form.status,
			}
			if (this.form.text) {
				params.text = this.form.text
			}
			if (this.form.imgList && this.form.imgList.length) {
				params.materialList = this.form.imgList
			}
			let {
				data: { resultCode },
			} = await brandParentSave(params)
			this.fixLoading = false
			if (resultCode == 0) {
				this.$emit('editRefresh')
				this.$message.success('上传成功')
				this.localVisible = false
			}
		},
		datadragEnd(evt) {
			console.log(evt, 'evt')
		},
		deleteImgV(i) {
			this.form.imgList.splice(i, 1)
			this.form.fileList.splice(i, 1)
		},
		upload(val) {
			console.log(val, 'valulvauvavavv')
			let res = {}
			res.materialContent = val.result.url
			if (val.result.type.toLocaleLowerCase() == 'mp4') {
				res.materialType = 'video'
			} else {
				res.materialType = 'image'
			}
			this.form.imgList.push(JSON.parse(JSON.stringify(res)))
			this.form.fileList.push(JSON.parse(JSON.stringify(res)))
			// this.form.imgList = val.imgList.map((item) => {
			// 	let obj = {}
			// 	obj.materialContent = item.materialContent
			// 	obj.materialType = item.materialType
			// 	if (item.id) {
			// 		obj.id = item.id
			// 	}
			// 	return obj
			// })
			// this.form.fileList = val.fileList.map((item) => {
			// 	let obj = {}
			// 	obj.materialContent = item.materialContent
			// 	obj.materialType = item.materialType
			// 	if (item.id) {
			// 		obj.id = item.id
			// 	}
			// 	return obj
			// })
		},
		handleCancel() {
			this.localVisible = false
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>
<style>
.bmd .el-dialog__body {
	max-height: 700px;
}
</style>
<style lang="scss" scoped>
.box {
	width: 100%;

	border: 1px solid #cccccc;
	margin-bottom: 15px;
	// position: fixed;
	text-align: center;
	background: rgb(236, 236, 236);
	// z-index: 999;
}
.solt {
	display: flex;
	align-items: center;
	padding: 10px 0 10px 60px;
}
.goods_img {
	width: 120px;
	height: auto;
	margin-right: 15px;
}
.goodsName {
	margin-bottom: 6px;
	width: 340px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
	text-align: left;
	font-size: 20px;
	font-weight: 800;
}
.statusH {
	display: flex;
	align-items: center;
}
.formBox {
	padding: 10px;
	box-sizing: border-box;
}
.box-icon {
	position: absolute;
	right: 12px;
	z-index: 999;
}
.posbox {
	position: relative;
}
.ivbox-icon {
	position: absolute;
	right: 14px;
	top: 14px;
	z-index: 999;
	font-size: 16px;
}
.bs {
	text-align: center;
	margin-top: 20px;
}
.ivbox {
	display: flex;
	align-items: center;
}
.imgVideo {
	display: inline-block;
}
.imgVideo .c_image {
	width: 100px;
	height: 100px;
	margin-right: 10px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
.foot-b {
	text-align: right;
	margin-top: 20px;
}
</style>
