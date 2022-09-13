<template>
	<div>
		<el-dialog
			width="800px"
			:title="title"
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
				<template slot="posterImg" slot-scope="scope">
					<div>
						<el-upload
							v-if="!scope.data.posterImg"
							class="poster_upload"
							:multiple="false"
							:limit="1"
							drag
							accept="image/gif, image/jpeg, image/jpg, image/png"
							:show-file-list="false"
							:before-upload="beforeAvatarUpload"
							:http-request="
								(file) => {
									uploadImageHttpRequest(file, 1)
								}
							"
						>
							<div class="upload_tip" slot="trigger">请上传品牌Logo</div>
						</el-upload>
						<el-row v-else>
							<div class="wg_image_box">
								<el-image
									class="img100"
									:src="scope.data.posterImg"
									fit="contain"
								>
									<div slot="error" class="el-image__error">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<div
									v-if="!lookState"
									class="wg_image_item_dlt"
									@click="deleteImage(1)"
								>
									删除
								</div>
							</div>
						</el-row>
					</div>
				</template>
				<template slot="newPosterImg" slot-scope="scope">
					<div>
						<el-upload
							v-if="!scope.data.newPosterImg"
							class="poster_upload"
							:multiple="false"
							:limit="1"
							drag
							accept="image/gif, image/jpeg, image/jpg, image/png"
							:show-file-list="false"
							:before-upload="newBeforeAvatarUpload"
							:http-request="
								(file) => {
									uploadImageHttpRequest(file, 2)
								}
							"
						>
							<div class="upload_tip" slot="trigger">请上传新品牌Logo</div>
						</el-upload>
						<el-row v-else>
							<div class="wg_image_box">
								<el-image
									class="img100"
									:src="scope.data.newPosterImg"
									fit="contain"
								>
									<div slot="error" class="el-image__error">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<div
									v-if="!lookState"
									class="wg_image_item_dlt"
									@click="deleteImage(2)"
								>
									删除
								</div>
							</div>
						</el-row>
					</div>
				</template>
				<template #brandLgoExplain>
					<div class="mab_lt">
						<p>
							规则说明：<br />1、旧品牌LOGO尺寸要求：1000*1000px;<br />2、新品牌LOGO尺寸要求：1000*500px;<br />3、分辨率：72dpi;<br />4、格式：png;<br />5、透明度校验：PNG图像文件必须为透明图像;<br />6、容量大小：小于等于500kb;
						</p>
					</div>
				</template>
				<template #introduce>
					<el-input
						placeholder="请输入品牌介绍"
						style="width: 100%"
						type="textarea"
						:rows="15"
						v-model.trim="funData.introduce"
					></el-input>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { saveBrandParent } from '@/api/yhtPlusWebGoods'
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
		title: {
			type: String,
			default: '',
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
			item: [
				{
					type: 'input',
					title: '品牌中文名称',
					dataIndex: 'brandParentName',
					placeholder: '请输入品牌中文名称',
				},
				{
					type: 'input',
					title: '品牌首字母',
					dataIndex: 'brandCode',
					placeholder: '请输入品牌首字母',
				},
				{
					type: 'input',
					title: '品牌英文名称',
					dataIndex: 'brandParentEnglishName',
					placeholder: '请输入品牌英文名称',
				},
				{
					type: 'custom',
					dataIndex: 'posterImg',
					title: '品牌logo',
				},
				{
					type: 'custom',
					dataIndex: 'newPosterImg',
					title: '新品牌logo',
				},
				{
					type: 'custom',
					dataIndex: 'brandLgoExplain',
				},
				{
					type: 'select',
					title: '品牌等级',
					label: 'value',
					dataIndex: 'brandParentClass',
					placeholder: '请输入品牌等级',
					options: [
						{
							brandParentClass: 1,
							value: 'S级',
						},
						{
							brandParentClass: 2,
							value: '超A级',
						},
						{
							brandParentClass: 3,
							value: 'A级',
						},
						{
							brandParentClass: 4,
							value: 'B级',
						},
						{
							brandParentClass: 5,
							value: 'C级',
						},
					],
				},
				{
					type: 'custom',
					title: '品牌介绍',
					dataIndex: 'introduce',
				},
			],
			funData: {
				introduce: '', //品牌介绍
				brandParentClass: 1, //品牌等级
				brandParentEnglishName: '', //品牌英文名称
				brandCode: '', //品牌首字母
				brandParentName: '', //品牌中文名称
				posterImg: '',
				newPosterImg: '',
			},
			imageUrl: '',
			editList: {},
			newImageUrl: '',
			evaluationList: '',
			brandParentIdS: '',
			funRules: {
				brandParentName: [
					{ required: true, message: '请输入品牌中文名称', trigger: 'blur' },
				],
				brandCode: [
					{ required: true, message: '请输入品牌首字母', trigger: 'blur' },
				],
				brandParentClass: [
					{ required: true, message: '请输入品牌等级', trigger: 'blur' },
				],
			},
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
		// 回显
		async brandDetail(row, type) {
			if (type == 2 || type == 3) {
				this.editList = row
				this.funData.brandParentName = row.brandParentName
					? row.brandParentName
					: ''
				this.funData.brandCode = row.brandCode ? row.brandCode : ''
				this.funData.brandParentEnglishName = row.brandParentEnglishName
					? row.brandParentEnglishName
					: ''
				console.log('-----', row.brandLogoUrl)

				this.funData.newPosterImg = row.brandLogoUrl
					? getSmallImg(row.brandLogoUrl)
					: ''
				this.funData.posterImg = row.imageUrl ? getSmallImg(row.imageUrl) : ''
				this.funData.brandParentClass = row.brandParentClass
					? row.brandParentClass
					: ''
				this.funData.introduce = row.introduce ? row.introduce : ''
				if (type == 3) {
					for (let k = 0; k < this.item.length; k++) {
						this.lookState = true
						this.item[k].disabled = true
					}
				}
				this.brandParentIdS = row.brandParentId
			} else {
				this.funData = {
					introduce: '', //品牌介绍
					brandParentClass: 1, //品牌等级
					brandParentEnglishName: '', //品牌英文名称
					brandCode: '', //品牌首字母
					brandParentName: '', //品牌中文名称
					posterImg: '',
					newPosterImg: '',
				}
				this.editList = {}
			}
		},
		brandParentClassText(text) {
			if (text == 1) {
				return 'S级'
			} else if (text == 2) {
				return '超A级'
			} else if (text == 3) {
				return 'A级'
			} else if (text == 4) {
				return 'B级'
			} else if (text == 5) {
				return 'C级'
			}
		},
		// 保存
		async submitForm(row) {
			this.addBrandSave(row)
		},

		// 新增
		async addBrandSave() {
			const paramsData = Object.assign({
				brandParentName: this.funData.brandParentName,
				introduce: this.funData.introduce,
				brandCode: this.funData.brandCode,
				brandParentEnglishName: this.funData.brandParentEnglishName,
				brandParentClass: this.funData.brandParentClass,
				// image: this.imageUrl,
				// brandLogoUrl: this.newImageUrl,
			})
			if (this.newImageUrl) {
				paramsData.brandLogoUrl = this.newImageUrl
			}
			if (this.funData.posterImg) {
				paramsData.image = this.imageUrl ? this.imageUrl : this.editList.image
			} else {
				paramsData.image = {}
			}
			if (this.title == '编辑品牌') {
				paramsData.brandParentId = this.brandParentIdS
			}
			const {
				data: { resultCode, resultMsg },
			} = await saveBrandParent(paramsData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetForm()
				this.$emit('fatherNewBrandCategory')
			}
		},
		// 关闭弹窗
		resetForm() {
			for (let k = 0; k < this.item.length; k++) {
				this.lookState = false
				this.item[k].disabled = false
			}
			this.imageUrl = ''
			this.newImageUrl = ''
			this.funData = {
				introduce: '', //品牌介绍
				brandParentClass: 1, //品牌等级
				brandParentEnglishName: '', //品牌英文名称
				brandCode: '', //品牌首字母
				brandParentName: '', //品牌中文名称
				posterImg: '',
				newPosterImg: '',
			}
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},

		async uploadImageHttpRequest(params, type) {
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({
					formId: '#addImageFrom_goods',
					imageType: type == 1 ? 42 : 77,
					isPng: 'png',
				})
			)
			formData.append('file', params.file)
			let {
				data: { resultData },
			} = await uploadImageList(formData)
			if (type == 1) {
				this.funData.posterImg = getSmallImg(resultData.imageList[0].imageUrl)
				this.imageUrl = resultData.imageList[0]
			} else {
				this.funData.newPosterImg = getSmallImg(
					resultData.imageList[0].imageUrl
				)
				this.newImageUrl = resultData.imageList[0].imageUrl
			}
		},
		async beforeAvatarUpload(file) {
			let that = this
			console.log('file', file)
			const isSize = new Promise(function (resolve, reject) {
				let _URL = window.URL || window.webkitURL
				let img = new Image()
				img.onload = function () {
					let valid =
						img.width == that.oneThousandWidth &&
						img.height == that.oneThousandHeight
					valid ? resolve() : reject(valid)
				}
				img.src = _URL.createObjectURL(file)
			}).then(
				() => {
					return file
				},
				(err) => {
					let index = file.name.lastIndexOf('.')
					let format = file.name.substring(index + 1, file.name.length)
					console.log('png', format)
					if (!/\.|png|jpg/i.test(format)) {
						this.$message.warning('图片上传有误,仅支持上传Png,jpg格式图片')
						return Promise.reject(err)
					}
					if (file.size > 524288) {
						this.$message.warning('海报容量不可大于500kb')
						return Promise.reject(err)
					}
					this.$message.warning('海报固定尺寸 1000px*1000px')
					return Promise.reject(err)
				}
			)
			return isSize
		},
		async newBeforeAvatarUpload(file) {
			let that = this
			console.log('file', file)

			const isSize = new Promise(function (resolve, reject) {
				let _URL = window.URL || window.webkitURL
				let img = new Image()
				img.onload = function () {
					let valid =
						img.width == that.oneThousandWidth &&
						img.height == that.fiveHundredHeight
					valid ? resolve() : reject(valid)
				}
				img.src = _URL.createObjectURL(file)
			}).then(
				() => {
					return file
				},
				(err) => {
					let index = file.name.lastIndexOf('.')
					let format = file.name.substring(index + 1, file.name.length)
					console.log('png', format)
					if (!/\.|png/i.test(format)) {
						this.$message.warning('图片上传有误,仅支持上传PNG格式图片')
						return Promise.reject(err)
					}
					if (file.size > 524288) {
						this.$message.warning('海报容量不可大于500kb')
						return Promise.reject(err)
					}
					this.$message.warning('海报固定尺寸 1000px*500px')
					return Promise.reject(err)
				}
			)
			return isSize
		},
		deleteImage(type) {
			//删除图片
			let that = this
			this.$confirm('确定删除此图片', '提示', {
				type: 'warning',
				callback(action) {
					if (action === 'confirm') {
						if (type == 1) {
							that.funData.posterImg = ''
							this.imageUrl = ''
						} else {
							that.funData.newPosterImg = ''
							this.newImageUrl = ''
						}
					}
				},
			})
		},
	},
}
</script>
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
<style lang="scss" scoped>
.mab_lt {
	margin-bottom: 30px;
	margin-left: 200px;
	margin-top: -270px;
}
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
.wg_image_box {
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
.upload_tip {
	width: 120px;
	height: 120px;
	padding-top: 30px;
	line-height: 30px;
}
</style>
