<template>
	<div class="messageadd">
		<yx-form
			ref="form"
			v-loading="loading"
			labelWidth="140px"
			:items="item"
			:rules="funRules"
			:data="formData"
			:formAction="formAction"
		>
			<template #context>
				<UE ref="um" :defaultMsg="information" :name="'ue' + timeOut"></UE>
			</template>
		</yx-form>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import UE from '@/components/RichText'
import { uploadImageList } from '@/api/image'
import { isNull } from '@/utils/helper/common'
import {
	addSourceMaterialManage,
	getSourceMaterialManageList,
} from '@/api/sourceMaterial'
import { getBigImg } from '@/utils/imageTool'
import moment from 'moment'
export default {
	components: {
		YxForm,
		UE,
	},
	data() {
		return {
			valList: {},
			timeOut: new Date().getTime(),
			disabledS: false,
			appMessageId: '',
			formData: {
				title: '',
				subtitle: '',
				initPeople: '',
				releaseTime: '',
				status: 1,
				type: 1,
				coverImages: [],
				jumpType: 1,
				jumpUrl: '',
				imageList: {},
				context: '',
			},
			information: '52954654',
			item: [
				{
					type: 'input',
					title: '标题',
					dataIndex: 'title',
				},
				{
					type: 'input',
					title: '副标题',
					dataIndex: 'subtitle',
				},
				{
					type: 'input',
					title: '初始人数',
					dataIndex: 'initPeople',
				},
				{
					title: '发布日期',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'releaseTime',
				},
				{
					type: 'radioMap',
					dataIndex: 'status',
					title: '状态',
					options: {
						启用: 1,
						禁用: 0,
					},
				},
				{
					type: 'uploadImage',
					title: '素材封面',
					dataIndex: 'coverImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file),
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
					hide: false,
				},
				{
					type: 'radioMap',
					dataIndex: 'jumpType',
					title: '跳转类型',
					options: {
						跳转h5链接: 1,
						定时编辑富文本发送: 2,
					},
				},
				{
					type: 'custom',
					title: '内容',
					hide: true,
					dataIndex: 'context',
				},
				{
					type: 'input',
					title: '跳转URL:',
					dataIndex: 'jumpUrl',
				},
			],
			loading: false,
			formAction: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						this._addSourceMaterialManage()
					},
				},
			],
			funRules: {
				title: [
					{ required: true, message: '请填写消息标题!', trigger: 'blur' },
				],
				initPeople: [
					{ required: true, message: '请填写初始人数!', trigger: 'blur' },
				],
				coverImages: [
					{ required: true, message: '请上传图片!', trigger: 'blur' },
				],
				status: [{ required: true, message: '请选择状态!', trigger: 'blur' }],
				jumpType: [
					{ required: true, message: '请选择跳转类型!', trigger: 'blur' },
				],

				releaseTime: [
					{ required: true, message: '请选择发布时间!', trigger: 'blur' },
				],
			},
		}
	},
	created() {
		this.sourceMaterialManageId = this.$route.params.Id || ''
		this.echo()
	},
	watch: {
		formData: {
			handler: function (val) {
				this.item[7].hide = val.jumpType == 1 ? true : false
				this.item[8].hide = val.jumpType == 2 ? true : false
				this.valList = val
				console.log('val', val)
				console.log('this.item', this.item)
			},
			deep: true,
		},
	},

	methods: {
		async echo() {
			if (!isNull(this.sourceMaterialManageId)) {
				let {
					data: { resultCode, resultData },
				} = await getSourceMaterialManageList({
					sourceMaterialManageId: this.sourceMaterialManageId,
				})
				if (resultCode == 0) {
					let sourceMaterialManageList = resultData.sourceMaterialManageList[0]
					this.formData.title = sourceMaterialManageList.title
					this.formData.subtitle = sourceMaterialManageList.subtitle
					this.formData.coverImages.push({
						imageUrl: getBigImg(sourceMaterialManageList.coverUrl),
					})
					if (sourceMaterialManageList.releaseTime) {
						this.formData.releaseTime = moment(
							sourceMaterialManageList.releaseTime
						).format('yyyy-MM-DD HH:mm:ss')
					}
					this.formData.jumpType = sourceMaterialManageList.type
					this.formData.status = sourceMaterialManageList.status
					this.formData.initPeople = sourceMaterialManageList.initPeople
					if (sourceMaterialManageList.type == 1) {
						this.formData.jumpUrl = sourceMaterialManageList.jumpUrl
						this.item[8].hide = false
					} else {
						this.information = sourceMaterialManageList.context || 'default'
						setTimeout(() => {
							this.$refs.um.editor.setContent(sourceMaterialManageList.context)
						}, 1)
						console.log('this.information', this.information)
						this.item[7].hide = false
					}
				}
			} else {
				this.formData = {
					title: '',
					subtitle: '',
					initPeople: '',
					releaseTime: '',
					status: 1,
					type: 1,
					coverImages: [],
					jumpType: 1,
					jumpUrl: '',
					imageList: {},
					context: '',
				}
			}
		},
		importHistory() {
			this.$router.push({ path: '/import/importHistory' })
		},
		beforeAvatarUpload(file) {
			if (!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
				this.$message.warning('格式不对')
				return false
			} else {
				return file
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 77 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.formData.coverImages.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
				this.formData.imageList = res.data.resultData.imageList[0]
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		//保存
		async _addSourceMaterialManage() {
			let paramsData = {
				title: this.formData.title,
				image: this.formData.imageList,
				initPeople: this.formData.initPeople,
				subtitle: this.formData.subtitle,
				type: this.formData.jumpType,
				status: this.formData.status,
				clerkId: this.$store.state.user.userInfo.clerkId,
				context: '',
			}
			paramsData.releaseTime = moment(this.formData.releaseTime).valueOf()
			if (this.valList.jumpType == 1) {
				paramsData.jumpUrl = this.formData.jumpUrl
				if (isNull(paramsData.jumpUrl)) {
					this.$message.error('请填写跳转URL')
					return
				}
			} else {
				paramsData.jumpUrl = this.formData.jumpUrl

				paramsData.context = this.$refs.um.editor.getContent()
				if (isNull(paramsData.context)) {
					this.$message.error('请填写富文本内容')
					return
				}
			}
			if (!isNull(this.sourceMaterialManageId)) {
				paramsData.sourceMaterialManageId = this.sourceMaterialManageId
			}
			console.log('paramsData', this.$store)
			// return
			this.loading = true
			let res = await addSourceMaterialManage(paramsData)
			this.loading = false
			if (res.data.resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.$router.push({ name: 'Materials' })
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.messageadd .row {
	display: flex;
	align-items: center;
	width: 300px;
	.width {
		width: 100%;
	}
}
</style>
