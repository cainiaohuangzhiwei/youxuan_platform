<template>
	<div>
		<el-dialog
			width="800px"
			title="品牌logo批量上传"
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
				<template #brandLgoExplain>
					<div class="">
						<p>
							说明：<br /><span v-if="logoBatchItem == 1" class="fw_b"
								>一、图片命名规则：logo_品牌ID.png，logo为名字前缀。例：logo_9768.png</span
							><span v-else class="fw_b"
								>一、图片命名规则：logo1_品牌ID.png，logo为名字前缀。例：logo1_9768.png</span
							><br /><span class="fw_b">二、上传图片规则说明：</span><br /><span
								v-if="logoBatchItem == 1"
								>1、尺寸：1000*500px;</span
							><span v-else>1、尺寸：1000*1000px;</span
							><br />2、分辨率：72dpi;<br />3、格式：png;<br />4、透明度校验：PNG图像文件必须为透明图像;
							<br />
							<span class="fw_b"
								>5、容量大小：小于等于500kb;<br />三、新上传的图片会替代所有旧图片。</span
							>
						</p>
					</div>
					<div v-if="logoFormat.length > 0">格式后缀有误：{{ logoFormat }}</div>
					<div v-if="logoSize.length > 0">
						容量大小不可>500k：{{ logoSize }}
					</div>
					<div v-if="widthHeightSize.length > 0">
						尺寸有误：{{ widthHeightSize }}
					</div>
					<div v-if="prefixionName.length > 0">
						图片命名规则有误：{{ prefixionName }}
					</div>
				</template>
				<template slot="newImage" slot-scope="scope">
					<div>
						<el-upload
							class="poster_upload"
							:multiple="true"
							:limit="40"
							drag
							accept="image/gif, image/jpeg, image/jpg, image/png"
							:show-file-list="false"
							:http-request="
								(file) => {
									uploadCertificate(
										file,
										'newImage',
										'addSupplierCredentials',
										40
									)
								}
							"
						>
							<div class="upload_tip" slot="trigger">
								新增新Logo图片<br />（最多40张）
							</div>
						</el-upload>
						<el-row>
							<div
								v-for="(listItem, listIndex) in scope.data.newImage"
								:key="listIndex"
								class="wg_image_box"
							>
								<el-image
									fit="cover"
									class="wg_image_item"
									z-index="9999"
									:preview-src-list="[listItem.newImage]"
									:src="listItem.newImage"
								>
									<div slot="error" class="el-image__error">
										<i class="el-icon-picture-outline" />
									</div>
								</el-image>
								<div class="wg_image_item_dlt">
									<span
										:title="logoName[listIndex]"
										@click="
											deleteImage(scope.data.newImage, listItem, listIndex)
										"
										>{{ logoName[listIndex] }}</span
									>
								</div>
							</div>
						</el-row>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadMultipleFile } from '@/api/image'
import { batchUpdateBrandParentLogo } from '@/api/yhtPlusWebGoods'
import { getBigImg } from '@/utils/imageTool'

export default {
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		visible: {
			type: Boolean,
			default: false,
		},
		// 单条信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
	},
	data() {
		return {
			oneThousandWidth: 1000, //上传图片宽带
			oneThousandHeight: 1000, //上传图片宽度
			fiveHundredHeight: 500, //上传图片宽度
			endOrderTimeShow: true,
			lookState: false,
			logoFormat: [],
			logoSize: [],
			widthHeightSize: [],
			prefixionName: [],
			logoName: [],
			logoBatchItem: null,
			item: [
				{
					type: 'custom',
					dataIndex: 'brandLgoExplain',
				},
				{
					title: '新品牌logo',
					type: 'custom',
					dataIndex: 'newImage',
				},
			],
			funData: {
				newImage: [], // 新品牌logo
			},
			evaluationList: '',
			funRules: {},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: (row) => {
						this.submitForm(row)
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
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
	methods: {
		deleteImage(item, imageItem, index) {
			/** 删除商品图片 * */
			let that = this
			this.$confirm('确定删除此图片', '提示', {
				type: 'warning',
				callback(action) {
					if (action === 'confirm') {
						console.log('pppp', that.logoFormat[index])
						that.$delete(that.logoFormat, index)
						that.$delete(that.logoSize, index)
						that.$delete(that.widthHeightSize, index)
						that.$delete(that.prefixionName, index)
						that.$delete(item, index)
					}
				},
			})
		},
		//获取长形logo的img的信息
		fileReaderEvents(files) {
			const isSize = new Promise(function (resolve, reject) {
				let _URL = window.URL || window.webkitURL
				let img = new Image()
				img.onload = function () {
					let valid = img.width == 1000 && img.height == 1000
					valid ? resolve() : reject(valid)
				}
				img.src = _URL.createObjectURL(files)
			}).then(
				() => {
					return files
				},
				(err) => {
					this.widthHeightSize.push(files.name)
					return Promise.reject(err)
				}
			)
			return isSize
		},
		//获取方形logo的img的信息
		squareFileReaderEvents(files) {
			const isSize = new Promise(function (resolve, reject) {
				let _URL = window.URL || window.webkitURL
				let img = new Image()
				img.onload = function () {
					let valid = img.width == 1000 && img.height == 500
					valid ? resolve() : reject(valid)
				}
				img.src = _URL.createObjectURL(files)
			}).then(
				() => {
					return files
				},
				(err) => {
					this.widthHeightSize.push(files.name)
					return Promise.reject(err)
				}
			)
			return isSize
		},
		// 上传图片
		async uploadCertificate(params, key, name, imageType) {
			const formData = new FormData()
			//处理尺寸大小
			if (this.logoBatchItem != 1) {
				this.fileReaderEvents(params.file)
			} else {
				this.squareFileReaderEvents(params.file)
			}
			formData.append(
				'data',
				JSON.stringify({
					formId: `#${name}`,
					imageType: imageType,
					isPng: 'png',
				})
			)
			formData.append('image', params.file)
			const res = await uploadMultipleFile(formData)
			if (res.data.resultCode == 0 && res.data.resultData.length > 0) {
				this.logoName.push(params.file.name) //图片名称
				if (params.file.name.indexOf('.jpg') > -1) {
					this.logoFormat.push(params.file.name)
				} //错误格式
				if (params.file.size > 524288) {
					this.logoSize.push(params.file.name)
				} //错误容量
				let substringName = params.file.name.substring(0, 5)
				console.log('yyyy', this.logoBatchItem)
				if (this.logoBatchItem == 2) {
					if (substringName != 'logo1') {
						this.prefixionName.push(params.file.name)
					} //前缀名称错误
				} else {
					if (substringName != 'logo_') {
						console.log('hhhh', typeof this.prefixionName)
						this.prefixionName.push(params.file.name)
					} //前缀名称错误
				}

				console.log('migccccc', substringName)
				//图片数据处理
				this.funData[key].push(res.data.resultData)
				for (let i = 0; i < this.funData[key].length; i++) {
					const item = this.funData[key][i]
					for (let j = 0; j < item.length; j++) {
						if (item[j].url) {
							this.funData[key][i][key] = getBigImg(item[j].url)
						}
					}
				}
				this.flag = false
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		// 回显
		async logoBatch(type) {
			this.logoBatchItem = type
		},
		// 保存
		async submitForm() {
			if (
				this.logoFormat.length > 0 ||
				this.logoSize.length > 0 ||
				this.widthHeightSize.length > 0 ||
				this.prefixionName.length > 0
			) {
				this.$message.error('上传图片规则不符合')
				return
			}
			let logoOriginalFileName = this.funData.newImage.map((item) => {
				return {
					logoOriginalFileName: item[0].original,
					brandLogoUrl: item[0].url,
				}
			})
			let parameters = {
				brandUpdateInfo: logoOriginalFileName,
				logoClassify: 2, //// 批量上传logo type 1--长方形  2 -- 正方形
			}
			if (parameters.brandUpdateInfo.length == 0) {
				this.$message.error('请上传图片')
				return
			}
			if (this.logoBatchItem == 1) {
				parameters.logoClassify = 1
			}
			console.log('传参：', parameters)

			let {
				data: { resultCode },
			} = await batchUpdateBrandParentLogo(parameters)
			if (resultCode == 0) {
				this.$message({
					message: '成功！',
					type: 'success',
				})
				this.resetForm()
				this.$emit('fatherNewBrandCategory')
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.logoFormat = []
			this.logoSize = []
			this.widthHeightSize = []
			this.prefixionName = []
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
}
</script>

<style lang="scss" scoped>
.fw_b {
	font-weight: bold;
}
.poster_upload {
	margin-left: 10px;
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
.wg_image_box {
	margin: 10px;
	float: left;
	overflow: hidden;
	position: relative;
	cursor: pointer;
	width: 120px;
	height: 120px;
	line-height: 116px;
	text-align: center;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
	.img100 {
		width: 100%;
		height: 100%;
	}
	.wg_image_item {
		width: 100%;
		height: 100%;
	}
	.wg_image_item_dlt {
		width: 100%;
		height: 24px;
		position: absolute;
		background: #e7e7e7;
		bottom: 0;
		left: 0;
		z-index: 20;
		text-align: center;
		line-height: 24px;
		border: 0;
		border-top-width: 0px;
	}
}
.wg_upload {
	box-sizing: border-box;
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: #ddd;
	float: left;
	text-align: center;
	line-height: 20px;
	border: 1px solid #ccc;
	border-radius: 4px;
	.upload_block {
		width: 120px;
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.upload_tip {
	width: 120px;
	height: 120px;
	padding-top: 30px;
	line-height: 30px;
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
</style>
