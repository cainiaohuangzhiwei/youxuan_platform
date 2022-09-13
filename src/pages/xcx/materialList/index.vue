<template>
	<div class="materialList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData108"
				:items="formCfg108"
				:formAction="formAction108"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns109"
				:pagination="page109"
				:data="tableData109"
			>
				<template slot="bannerImageUrl" slot-scope="scope">
					<el-image
						class="c_image"
						fit="cover"
						:src="scope.row.bannerImageUrl"
						:preview-src-list="[scope.row.bannerImageUrl]"
					>
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</template>
				<template slot="activityPosterImage" slot-scope="scope">
					<div>
						<el-image
							v-if="scope.row.activityPosterImage.length"
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.activityPosterImage[0].imageUrl)"
							:preview-src-list="[
								getBigImg(scope.row.activityPosterImage[0].imageUrl),
							]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<p v-if="scope.row.activityPosterImage.length >= 2">
							(共{{ scope.row.activityPosterImage.length }}张图片)
						</p>
					</div>
				</template>
				<template slot="courseImage" slot-scope="scope">
					<div>
						<el-image
							v-if="scope.row.courseImage.length"
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.courseImage[0].imageUrl)"
							:preview-src-list="[getBigImg(scope.row.courseImage[0].imageUrl)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<p v-if="scope.row.courseImage.length >= 2">
							(共{{ scope.row.courseImage.length }}张图片)
						</p>
					</div>
				</template>
				<template slot="personPosterImage" slot-scope="scope">
					<div>
						<el-image
							v-if="scope.row.personPosterImage.length"
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.personPosterImage[0].imageUrl)"
							:preview-src-list="[
								getBigImg(scope.row.personPosterImage[0].imageUrl),
							]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<p v-if="scope.row.personPosterImage.length >= 2">
							(共{{ scope.row.personPosterImage.length }}张图片)
						</p>
					</div>
				</template>
				<template slot="state" slot-scope="scope">
					<div>
						<el-tag v-if="scope.row.state == 1">上架</el-tag>
						<el-tag v-else-if="scope.row.state == 2" type="info">下架</el-tag>
						<span v-else>-</span>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle110"
				:visible.sync="dialogVisible110"
				:width="dialogWidth110"
				:bottomBtn="dialogBottomBtn110"
			>
				<yx-form
					ref="formRef111"
					labelWidth="120px"
					:data="formData111"
					:items="formCfg111"
					:rules="formRules111"
					:formAction="formAction111"
				>
					<template slot="tip">
						<p style="color: #f16b6b">
							个人海报素材需按照固定模版上传，预留右下方个人二维码空白处
						</p>
					</template>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	getActivityBannerList,
	updateActivityBanner,
	addActivityBanner,
	delActivityBanner,
} from '@/api/yhtPlusCmsActivity'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			getBigImg,
			loading: false,
			formData108: {
				keyword: '',
			},
			formCfg108: [
				{
					title: '',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '活动名称',
				},
			],
			formAction108: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.getData109(true)
					},
				},
				{
					title: '新增活动',
					type: 'success',
					auth: '',
					click: () => {
						this.formData111 = {
							activityName: '',
							rulesDocument: '',
							activeDocument: '',
							bannerImage: [],
							activityPosterImage: [],
							personPosterImage: [],
							courseImage: [],
						}
						this.dialogVisible110 = true
					},
					dialogId: 110,
				},
			],
			tableData109: [],
			tableColumns109: [
				{
					type: 'string',
					dataIndex: 'activityName',
					title: '活动名称',
				},
				{
					type: 'custom',
					dataIndex: 'bannerImageUrl',
					title: '活动banner',
					width: 120,
				},
				{
					type: 'custom',
					dataIndex: 'activityPosterImage',
					title: '活动海报素材',
					width: 120,
				},
				{
					type: 'custom',
					dataIndex: 'courseImage',
					title: '活动教程素材',
					width: 120,
				},
				{
					type: 'custom',
					dataIndex: 'personPosterImage',
					title: '个人海报素材',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'rulesDocument',
					title: '规则文案',
					width: 300,
				},
				{
					type: 'string',
					dataIndex: 'activeDocument',
					title: '活动文案',
					width: 300,
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '删除',
							auth: '',
							click: (row) => {
								this._delActivityBanner(row.actActivityBannerId)
							},
						},
						{
							title: '编辑',
							auth: '',
							click: (row) => {
								// this.formData111 = Object.assign({}, row)
								this.setFormData111(row)
								this.dialogVisible110 = true
							},
						},
						{
							title: '下架',
							click: (row) => {
								let shelfState = row.state == 1 ? 2 : 1
								this._updateActivityBanner(row.actActivityBannerId, shelfState)
							},
							customRender: (action, row) => {
								action.title =
									row.state == 1 ? '下架' : row.state == 2 ? '上架' : ''
								return action
							},
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'state',
					title: '状态',
				},
				{
					type: 'string',
					dataIndex: 'downloadCount',
					title: '活动素材下载量',
				},
				{
					type: 'string',
					dataIndex: 'generationCount',
					title: '个人素材生成量',
				},
			],
			page109: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData109()
				},
			},
			dialogTitle110: '新增活动',
			dialogWidth110: '800px',
			dialogVisible110: false,
			dialogBottomBtn110: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.formRef111.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._ActivityBanner()
								// this.dialogVisible110 = false
							}
						})
					},
				},
			],
			formData111: {
				activityName: '',
				rulesDocument: '',
				activeDocument: '',
			},
			formRules111: {
				activityName: [
					{ required: true, message: '请输入商家名称', trigger: 'blur' },
				],
				rulesDocument: [
					{ required: true, message: '请输入活动规则文案', trigger: 'blur' },
				],
				activeDocument: [
					{ required: true, message: '请输入活动文案', trigger: 'blur' },
				],
				bannerImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData111.bannerImage.length) {
								callback(new Error('请上传活动banner!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				activityPosterImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData111.activityPosterImage.length) {
								callback(new Error('请上传活动海报素材!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg111: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'activityName',
					placeholder: '请输入商家名称',
				},
				{
					type: 'textarea',
					title: '活动规则文案',
					dataIndex: 'rulesDocument',
					placeholder: '请输入活动规则文案',
				},
				{
					title: '活动文案',
					type: 'textarea',
					dataIndex: 'activeDocument',
					placeholder: '请输入活动文案',
				},
				{
					type: 'uploadImage',
					title: '活动banner',
					dataIndex: 'bannerImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'bannerImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'bannerImage'),
					},
				},
				{
					type: 'uploadImage',
					title: '活动海报素材',
					dataIndex: 'activityPosterImage',
					uploadAttributes: {
						limit: 3,
						// isEdit: true,
						imageName: 'activityPosterImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'activityPosterImage'),
					},
				},
				{
					type: 'uploadImage',
					title: '个人海报素材',
					dataIndex: 'personPosterImage',
					uploadAttributes: {
						limit: 3,
						// isEdit: true,
						imageName: 'personPosterImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'personPosterImage'),
					},
				},
				{
					type: 'custom',
					dataIndex: 'tip',
					title: '',
				},
				{
					type: 'uploadImage',
					title: '活动教程素材',
					dataIndex: 'courseImage',
					uploadAttributes: {
						limit: 2,
						// isEdit: true,
						imageName: 'courseImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'courseImage'),
					},
				},
			],
			formAction111: [],
		}
	},

	created() {
		this.getData109(true)
	},

	methods: {
		_delActivityBanner: async function (actActivityBannerId) {
			let {
				data: { resultCode, resultMsg },
			} = await delActivityBanner({
				actActivityBannerId,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData109()
			}
		},
		_updateActivityBanner: async function (actActivityBannerId, shelfState) {
			let {
				data: { resultCode, resultMsg },
			} = await updateActivityBanner({
				actActivityBannerId,
				shelfState,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData109()
			}
		},
		_ActivityBanner: async function () {
			let paramJson = {
				activityName: this.formData111.activityName,
				activeDocument: this.formData111.activeDocument,
				rulesDocument: this.formData111.rulesDocument,
				imageList: [],
			}
			let formData111 = Object.assign({}, this.formData111)
			delete formData111.bannerImage[0].bannerImage
			formData111.bannerImage[0].sortOrder = 0
			paramJson.imageList.push(formData111.bannerImage[0])
			if (formData111.activityPosterImage.length) {
				formData111.activityPosterImage.map((item, index) => {
					delete item.activityPosterImage
					item.sortOrder = index
					paramJson.imageList.push(item)
				})
			}
			if (formData111.personPosterImage.length) {
				formData111.personPosterImage.map((item, index) => {
					delete item.personPosterImage
					item.sortOrder = index
					paramJson.imageList.push(item)
				})
			}
			if (formData111.courseImage.length) {
				formData111.courseImage.map((item, index) => {
					delete item.courseImage
					item.sortOrder = index
					paramJson.imageList.push(item)
				})
			}
			console.log(paramJson)
			let res = null
			if (formData111.actActivityBannerId) {
				paramJson.actActivityBannerId = formData111.actActivityBannerId
				if (formData111.state) {
					paramJson.shhelfStalf = formData111.state
				}
				res = await updateActivityBanner(paramJson)
			} else {
				res = await addActivityBanner(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				let flag = paramJson.actActivityBannerId ? false : true
				this.getData109(flag)
				this.dialogVisible110 = false
			}
		},
		async uploadImageHttpRequest(params, name) {
			//上传海报
			let formData = new FormData()
			if (name == 'bannerImage') {
				formData.append('formId', '#addActivityBanner')
				formData.append('data', JSON.stringify({ imageType: 38 }))
			} else if (name == 'activityPosterImage') {
				formData.append('formId', '#addActivityPoster')
				formData.append('data', JSON.stringify({ imageType: 39 }))
			} else if (name == 'personPosterImage') {
				formData.append('formId', '#addPersonalPoster')
				formData.append('data', JSON.stringify({ imageType: 40 }))
			} else if (name == 'courseImage') {
				formData.append('formId', '#addActivityHelp')
				formData.append('data', JSON.stringify({ imageType: 41 }))
			}
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0][name] = getBigImg(
					resultData.imageList[0].imageUrl
				)
				if (name == 'bannerImage') {
					this.formData111[name] = resultData.imageList
				} else {
					this.formData111[name].push(...resultData.imageList)
				}
			}
		},
		setFormData111(row) {
			this.formData111 = Object.assign({}, row)
			this.formData111.bannerImage.bannerImage = getBigImg(
				this.formData111.bannerImage.imageUrl
			)
			this.formData111.activityPosterImage.map((item) => {
				item.activityPosterImage = getBigImg(item.imageUrl)
			})
			this.formData111.personPosterImage.map((item) => {
				item.personPosterImage = getBigImg(item.imageUrl)
			})
			this.formData111.courseImage.map((item) => {
				item.courseImage = getBigImg(item.imageUrl)
			})
			this.formData111.bannerImage = [this.formData111.bannerImage]
		},
		async getData109(flag) {
			this.loading = true
			let paramJson = this.findSearchParams109(flag)
			const {
				data: { resultCode, resultData },
			} = await getActivityBannerList(paramJson)
			if (resultCode == 0) {
				resultData.activityBannerList.map((item) => {
					if (item.bannerImage) {
						item.bannerImageUrl = getBigImg(item.bannerImage.imageUrl)
					}
				})
				this.tableData109 = resultData.activityBannerList
				this.page109.count = resultData.count
			} else {
				this.tableData109 = []
				this.page109.count = 0
			}
			this.loading = false
		},
		findSearchParams109(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page109.currentPage = 1
			}
			const paramJson = Object.assign(this.formData108, {
				length: this.page109.length,
				startIndex: (this.page109.currentPage - 1) * this.page109.length,
			})
			return paramJson
		},
	},
}
</script>
<style scope>
.c_image {
	width: 100px;
	height: 100px;
}
</style>
