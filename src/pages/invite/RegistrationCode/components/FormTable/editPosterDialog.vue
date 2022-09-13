<template>
	<yx-dialog :title="dialogTitle" :visible.sync="visible">
		<yx-form
			labelWidth="100px"
			:data="dialogData"
			:rules="rules"
			:items.sync="dialogCfg"
			:formAction="dialogAction"
		>
			<template slot="posterImg" slot-scope="scope">
				<div>
					<el-upload
						v-if="!scope.data.posterImg"
						class="poster_upload"
						:multiple="false"
						:limit="1"
						accept="image/gif, image/jpeg, image/jpg, image/png"
						:show-file-list="false"
						:before-upload="beforeAvatarUpload"
						:http-request="
							(file) => {
								uploadImageHttpRequest(file)
							}
						"
					>
						<div class="upload_tip" slot="trigger">请上传海报</div>
					</el-upload>
					<el-row v-else>
						<div class="wg_image_box">
							<el-image class="img100" :src="scope.data.imageUrl" fit="contain">
								<div slot="error" class="el-image__error">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<div class="wg_image_item_dlt" @click="deleteImage()">删除</div>
						</div>
					</el-row>
					<div>（海报固定尺寸：640px*1008px）</div>
				</div>
			</template>
			<template slot="coordinate" slot-scope="scope">
				<div>
					<div class="dis_f_ac">
						x:<el-input
							class="form_input"
							v-model="scope.data.coordinateX"
							type="number"
							placeholder="请输入内容"
						></el-input>
						y:<el-input
							class="form_input"
							v-model="scope.data.coordinateY"
							type="number"
							placeholder="请输入内容"
						></el-input>
					</div>
					<div>（小程序码固定尺寸：150px*150px）</div>
				</div>
			</template>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { editPoster, addPoster } from '@/api/yhtPlusCmsRegisterCodePoster'
export default {
	components: {
		YxDialog,
		YxForm,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 机构
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			dialogTitle: '新增海报',
			visible: false,
			uploadImgWidth: 640, //上传图片宽带
			uploadImgHeight: 1008, //上传图片宽度
			qrCodeWidth: 150, //二维码宽度
			qrCodeHeight: 150, //二维码高度
			dialogData: {
				posterImg: '', //海报
				coordinateX: '', //X坐标
				coordinateY: '', //y坐标
				content: '', //文案
				state: 1, //状态
				posterImgId: '',
			},
			rules: {
				content: [{ required: true, message: '请输入文案', trigger: 'blur' }],
				posterImg: [{ required: true, message: '请上传海报', trigger: 'blur' }],
				state: [{ required: true, message: '请选择状态', trigger: 'change' }],
			},
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveRegistrationCode()
					},
				},
			],
			dialogCfg: [
				{
					type: 'custom',
					dataIndex: 'posterImg',
					title: '海报',
				},
				{
					type: 'custom',
					dataIndex: 'coordinate',
					title: '注册码坐标',
				},
				{
					type: 'textarea',
					dataIndex: 'content',
					title: '文案',
				},
				{
					type: 'radioMap',
					dataIndex: 'state',
					title: '状态',
					options: {
						启用: 1,
						禁用: 0,
					},
				},
			],
		}
	},
	methods: {
		deleteImage() {
			//删除图片
			this.dialogData.posterImg = ''
		},
		async saveRegistrationCode() {
			if (this.dialogData.coordinateX === '') {
				this.$message.warning({ message: '请输入店铺码坐标 X 轴' })
				return
			}
			if (this.dialogData.coordinateX < 0) {
				this.$message.warning({ message: '店铺码坐标 X 轴必须为正数' })
				return
			}
			if (
				this.uploadImgWidth - this.qrCodeWidth <
				this.dialogData.coordinateX
			) {
				this.$message.warning({
					message: `店铺码坐标 X 轴超出显示范围,最大为${
						this.uploadImgWidth - this.qrCodeWidth
					}px`,
				})
				return
			}
			if (this.dialogData.coordinateY === '') {
				this.$message.warning({ message: '请输入店铺码坐标 Y 轴' })
				return
			}
			if (this.dialogData.coordinateY < 0) {
				this.$message.warning({ message: '店铺码坐标 Y 轴必须为正数' })
				return
			}
			if (
				this.uploadImgHeight - this.qrCodeHeight <
				this.dialogData.coordinateY
			) {
				this.$message.warning({
					message: `店铺码坐标 Y 轴超出显示范围,最大为${
						this.uploadImgHeight - this.qrCodeHeight
					}px`,
				})
				return
			}
			let res = null
			let paramJson = Object.assign({}, this.dialogData)
			delete paramJson.imageUrl
			if (paramJson.posterImgId) {
				res = await editPoster(paramJson)
			} else {
				res = await addPoster(paramJson)
			}
			if (res.data.resultCode == 0) {
				this.$message.success(res.data.resultMsg)
				this.visible = false
				this.$emit('updateList')
			}
		},
		async uploadImageHttpRequest(params) {
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({ formId: '#addImageFrom_goods', imageType: 90 })
			)
			formData.append('file', params.file)
			let {
				data: { resultData },
			} = await uploadImageList(formData)
			this.dialogData.posterImg = resultData.imageList[0].imageUrl
			this.dialogData.imageUrl = getSmallImg(resultData.imageList[0].imageUrl)
		},
		async beforeAvatarUpload(file) {
			let that = this
			const isSize = new Promise(function (resolve, reject) {
				let _URL = window.URL || window.webkitURL
				let img = new Image()
				img.onload = function () {
					let valid =
						img.width == that.uploadImgWidth &&
						img.height == that.uploadImgHeight
					valid ? resolve() : reject(valid)
				}
				img.src = _URL.createObjectURL(file)
			}).then(
				() => {
					return file
				},
				(err) => {
					this.$message.warning('海报固定尺寸 640px*1008px')
					return Promise.reject(err)
				}
			)
			return isSize
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				if (this.itemInfo && this.itemInfo.posterImgId) {
					this.dialogData = Object.assign({}, this.itemInfo)
				} else {
					this.dialogData = {
						posterImg: '',
						coordinateX: '',
						coordinateY: '',
						content: '',
						state: 1,
						posterImgId: '',
					}
				}
				this.dialogTitle =
					this.itemInfo && this.itemInfo.posterImgId ? '编辑海报' : '新增海报'
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

<style>
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
}
</style>
