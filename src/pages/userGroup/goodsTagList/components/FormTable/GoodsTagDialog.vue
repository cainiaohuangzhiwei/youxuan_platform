<template>
	<div v-loading="loading">
		<yx-dialog
			:title="parseAction[actionType]"
			:visible.sync="localVisible"
			width="800px"
			:bottomBtn="dialogBottomBtn"
			@before-close="resetForm"
		>
			<yx-form
				labelWidth="110px"
				ref="goodsTagForm"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
				:rules="rules"
				:formDisabled="actionType === 'import'"
			>
				<template #picUrl>
					<el-upload
						class="avatar-uploader"
						action="#"
						:show-file-list="false"
						:file-list="picUrlFileList"
						:http-request="uploadImageHttpRequest"
					>
						<i
							v-if="formData.picUrl && actionType !== 'import'"
							class="el-icon-close ivbox-icon"
							@click.stop="deleteImg"
						></i>
						<img v-if="formData.picUrl" :src="formData.picUrl" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</template>
				<template #description>
					<el-input
						type="textarea"
						placeholder="请输入标签简介，200字以内"
						v-model="formData.description"
						maxlength="200"
						show-word-limit
						rows="3"
					>
					</el-input>
				</template>
				<template #weight>
					<el-form-item label="标签权重值" prop="weight">
						<slot slot="label"
							><el-tooltip
								effect="dark"
								content="权重值作为同一商品多标签时展示依据。权重值越大，标签显示越靠左"
								placement="top-start"
								><span
									>标签权重值<i class="el-icon-question"></i></span></el-tooltip
						></slot>
						<el-input
							type="number"
							placeholder="请输入标签权重值"
							v-model="formData.weight"
						>
						</el-input>
					</el-form-item>
				</template>
				<!-- 跳转路径鲁班活动页面 -->
				<template #jumpUrl>
					<el-input
						v-model="formData.jumpUrl"
						placeholder="跳转路径"
						label="jumpUrl"
						@focus="selectPage"
						clearable
						@clear="
							() => {
								formData.jumpUrl = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="selectActPathVisible = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<el-form
				v-if="actionType === 'import'"
				ref="fileForm"
				:model="fileFormData"
				inline="true"
				labelWidth="110px"
				size="small"
				label-position="left"
				:rules="fileFormRules"
				v-loading="isUploading"
			>
				<el-form-item
					label="上传文件"
					prop="groupExcel"
					class="goods-tag-upload-container"
				>
					<el-upload
						accept=".xls, .xlsx"
						:multiple="false"
						ref="upload"
						action=""
						:http-request="uploadFileMethod"
						:fileList="fileList"
						:on-remove="removeFiles"
						:on-change="handleChange"
					>
						<el-button slot="trigger" size="small" type="primary" plain
							>选取文件</el-button
						>
						<div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
					</el-upload>
					<el-button
						icon="el-icon-download"
						@click="downloadImpostTemplate"
						size="small"
						>下载导入标签商品模板</el-button
					>
				</el-form-item>
				<div>
					<p>导入说明:</p>
					<p>1. 文件后缀名必须为：xls或xlsx（Excel标准格式）</p>
					<p>
						2. 商家ID、商家名称、货号不能为空，且必须匹配，否则该条数据导入失败
					</p>
				</div>
			</el-form>
		</yx-dialog>

		<!-- 选择鲁班页面弹窗 -->
		<SelectActPath
			ref="page"
			:visible.sync="selectActPathVisible"
			@handleChangeSelectActPath="handleChangeSelectActPath"
			:defaultValue="formData.jumpUrl"
		/>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxDialog from '@/components/Dialog/index.vue'
import SelectActPath from '@/components/SelectActPath'
import { editGoodsTag, uploadGoodsToTag } from '@/api/yhtPlusWebGoods'
import { downloadFile } from '@/utils/helper/common'
import { uploadImgToCos } from '@/utils/upload'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		buriedRow: {
			type: Object,
			default: () => ({}),
		},
		actionType: {
			type: String,
			default: 'create',
		},
	},

	components: { YxForm, YxDialog, SelectActPath },

	data() {
		return {
			lastSubmitTime: 0,
			isUploading: false,
			fileList: [],
			picUrlFileList: [],
			formData: {
				goodsTagId: '',
				title: '',
				picUrl: '',
				subTitle: '',
				description: '',
				weight: '',
				jumpUrl: '',
			},
			// 选择页面
			selectActPathVisible: false,
			formCfg: [
				{
					type: 'input',
					title: '商品标签名称',
					dataIndex: 'title',
				},
				{
					type: 'custom',
					title: '商品标签图',
					dataIndex: 'picUrl',
				},
				{
					title: '副标题',
					type: 'input',
					dataIndex: 'subTitle',
				},
				{
					title: '标签简介',
					type: 'custom',
					dataIndex: 'description',
				},
				{
					title: '标签权重值',
					type: 'custom',
					unformItem: true,
					dataIndex: 'weight',
				},
				{
					title: '跳转路径',
					type: 'custom',
					dataIndex: 'jumpUrl',
				},
			],
			dialogBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (this.actionType === 'import') {
							this.submitFileForm()
						} else {
							this.submitData()
						}
					},
				},
			],
			rules: {
				title: [
					{
						required: true,
						message: '请输入商品标签名称',
						trigger: ['blur', 'change'],
					},
					{ max: 6, message: '最多6个字符', trigger: 'blur' },
				],
				picUrl: [
					{ required: true, message: '请上传商品标签图', trigger: 'change' },
				],
				subTitle: [
					{
						required: true,
						message: '请输入标签副标题',
						trigger: ['blur', 'change'],
					},
					{ max: 20, message: '最多20个字符', trigger: 'blur' },
				],
				description: [
					{
						required: true,
						message: '请输入标签简介',
						trigger: ['blur', 'change'],
					},
					{ max: 200, message: '最多200个字符', trigger: 'blur' },
				],
				weight: [
					{
						required: true,
						message: '请输入标签权重值',
						trigger: ['blur', 'change'],
					},
					{
						message: '权重值只可输入正整数',
						pattern: /^[+]{0,1}(\d+)$/,
						trigger: 'blur',
					},
				],
			},
			fileFormData: {
				groupExcel: '',
			},
			fileFormRules: {
				groupExcel: [
					{
						required: true,
						message: '请选择文件上传',
						trigger: ['change'],
					},
				],
			},
			parseAction: {
				create: '新增商品标签',
				edit: '编辑商品标签',
				import: '导入商品',
			},
			loading: false,
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

	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.formData = this.$options.data().formData
			this.$refs.goodsTagForm.$refs.YxForm.resetFields()
			this.isUploading = false
			if (this.$refs.fileForm) {
				this.$refs.fileForm.resetFields()
				this.fileFormData = this.$options.data().fileFormData
				this.fileList = []
			}
		},
		getDetail(row) {
			if (row) {
				this.formData = Object.assign(this.formData, row)
			}
		},
		submitData() {
			this.$refs.goodsTagForm.$refs.YxForm.validate((valid) => {
				if (valid) {
					const now = new Date().getTime()
					if (now > this.lastSubmitTime + 2000) {
						this.lastSubmitTime = now
						const _form = this.formData
						this.loading = true
						const data = {
							..._form,
						}
						this.loading = true
						if (this.actionType === 'create') {
							delete data.goodsTagId
						}
						editGoodsTag(data)
							.then((res) => {
								if (res.data && res.data.resultCode == 0) {
									this.$message.success('保存成功！')
									this.$emit('refreshList')
									this.resetForm()
								} else {
									this.$message.error(res.data.resultMsg)
								}
							})
							.finally(() => {
								this.loading = false
							})
					}
				}
			})
		},
		submitFileForm() {
			this.$refs.fileForm.validate(async (valid) => {
				if (valid) {
					if (!this.isUploading) {
						const { groupExcel } = this.fileFormData
						const goodsTagId = this.formData.goodsTagId
						this.uploadExcel(goodsTagId, groupExcel)
					}
				}
			})
		},
		// 上传excel
		async uploadExcel(goodsTagId, file) {
			const formData = new FormData()
			this.isUploading = true
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: Date.now(),
					groupId: 2,
					userId: this.$store.state?.user?.userInfo?.userId || '',
					goodsTagId,
				})
			)
			formData.append('goodsTagId', goodsTagId)
			formData.append('file', file)
			const {
				data: { resultCode },
			} = await uploadGoodsToTag(formData)
			if (resultCode == 0) {
				this.$message.success('导入成功！')
				this.$emit('refreshList')
				this.resetForm()
			}
			this.isUploading = false
		},
		//下载模板
		downloadImpostTemplate() {
			downloadFile('/excel/platform/导入标签商品模板.xlsx')
		},
		handleChange(_, fileList) {
			this.fileList = fileList.slice(-1)
			// console.log(1111, _, this.fileFormData.groupExcel)
		},
		// 更新文件
		uploadFileMethod(fileObject) {
			this.fileFormData.groupExcel = fileObject.file
			this.$refs.fileForm.validate()
			console.log(this.fileFormData.groupExcel)
		},
		removeFiles() {
			this.fileFormData.groupExcel = ''
		},

		/* 上传图片 s */
		deleteImg() {
			this.fileList = []
			this.formData.picUrl = ''
		},
		uploadImageHttpRequest: async function (params) {
			const isType = /\.(jpg|jpeg|png|GIF|gif|JPG|PNG)$/.test(
				params.file.name.toLocaleLowerCase()
			)
			try {
				const img = await this.uploadImageInfo(params.file)
				console.log('params.file', img.height)
				const flag = img.height == 40
				if (!flag) {
					this.$message.warning('图片的高为40，长不限')
					this.formData['picUrl'] = ''
					this.picUrlFileList = []
					return
				}
			} catch (err) {
				this.$message.warning('图片加载失败')
				this.picUrlFileList = []
				return
			}
			if (!isType) {
				return this.$message.warning('不支持的上传类型')
			}
			const result = await uploadImgToCos(params.file)
			this.formData.picUrl = result.url
		},
		uploadImageInfo(file) {
			return new Promise((resolve, reject) => {
				let _URL = window.URL || window.webkitURL
				let img = new Image()
				img.onload = function () {
					resolve(img)
				}
				img.onerror = function () {
					reject(new Error('image onerror'))
				}
				img.src = _URL.createObjectURL(file)
			})
		},
		// 弹出选择页面
		selectPage(e) {
			e.target.blur()
			this.selectActPathVisible = true
		},
		handleChangeSelectActPath(actPathData) {
			this.formData.jumpUrl = actPathData.fileId
		},
	},
}
</script>

<style lang="scss" scoped>
.inline {
	display: inline-block;
}
.box {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.box_left {
	display: flex;
	margin-right: 30px;
}

.box_right {
	display: flex;
}
.goods-tag-upload-container .el-form-item__content > div {
	display: inline-block;
	min-width: 200px;
}
.goods-tag-upload-container .el-form-item__content > div + button {
	vertical-align: top;
}
</style>

<style lang="scss" scoped>
.avatar-uploader ::v-deep {
	.el-upload {
		border: 1px dashed #d9d9d9 !important;
		border-radius: 6px !important;
		cursor: pointer !important;
		position: relative !important;
		overflow: hidden !important;
		width: 80px;
		height: 80px;
		line-height: 80px;
	}
	.el-upload:hover {
		border-color: #409eff !important;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
	}
	.avatar {
		width: 80px;
		display: block;
	}
	.ivbox-icon {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 999;
		font-size: 16px;
		text-shadow: 0px 0px 1px #fff;
	}
}
</style>
