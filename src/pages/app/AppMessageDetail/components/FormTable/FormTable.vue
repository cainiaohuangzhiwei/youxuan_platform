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
			<template #title>
				<el-input
					:disabled="detailsDisable"
					v-model.trim="formData.title"
					maxlength="60"
					placeholder="请输入消息标题"
				></el-input>
			</template>
			<template #jgPushState>
				<el-switch
					:disabled="disabledS || detailsDisable"
					v-model="formData.jgPushState"
					:active-value="1"
					:inactive-value="0"
				>
				</el-switch>
			</template>
			<template #jgPushContent>
				<el-input
					:disabled="disabledS || detailsDisable"
					type="textarea"
					v-model.trim="formData.jgPushContent"
					maxlength="200"
					:autosize="{ minRows: 2, maxRows: 4 }"
					placeholder="请输入极光推送通知内容"
				></el-input>
			</template>
			<template #coverImageState>
				<el-switch
					:disabled="detailsDisable"
					v-model="formData.coverImageState"
					:active-value="1"
					:inactive-value="0"
				>
				</el-switch>
			</template>
			<template #content>
				<UE
					ref="um"
					:disabled="detailsDisable"
					:defaultMsg="information"
					:name="'ue' + timeOut"
				></UE>
			</template>
			<template #pageState>
				<el-switch
					:disabled="detailsDisable"
					v-model="formData.pageState"
					:active-value="1"
					:inactive-value="0"
				>
				</el-switch>
			</template>
			<template #buttonName>
				<el-input
					:disabled="detailsDisable"
					v-model.trim="formData.buttonName"
					placeholder="请输入按钮名称"
				></el-input>
			</template>
			<template #pageForwardUrl>
				<el-input
					:disabled="detailsDisable"
					v-model.trim="formData.pageForwardUrl"
					placeholder="请输入跳转小程序路径"
				></el-input>
			</template>
			<template #sendTimerTime>
				<el-date-picker
					v-model="formData.sendTimerTime"
					type="datetime"
					:disabled="disabledS || detailsDisable"
					placeholder="选择日期时间"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm:ss"
					:picker-options="{
						disabledDate: (time) => {
							return time.getTime() < Date.now() - 8.64e7
						},
						selectableRange: startTimeRange,
					}"
				>
				</el-date-picker>
			</template>
			<template #downloadTemp
				><el-button
					icon="el-icon-download"
					@click="downloadImpostTemplate"
					type="primary"
					>下载模板</el-button
				><el-button type="primary" @click="importHistory"
					>查看导入记录</el-button
				>
				<div v-if="disabledS">文件已上传</div>
			</template>
			<template slot="userTag">
				<SelectUserTagList
					:defaultSelectList="formData.userTagIds"
					:disabled="disabledS || detailsDisable"
					@change="handleSelectUserTag"
				/>
			</template>
		</yx-form>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import UE from '@/components/RichText'
import { uploadImageList } from '@/api/image'
import {
	addCmsAppMessage,
	getCmsAppMessageDetails,
	updateCmsAppMessage,
} from '@/api/cmsAppMessage'
import { getBigImg } from '@/utils/imageTool'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import SelectUserTagList from '@/components/SelectUserTagList'
export default {
	components: {
		YxForm,
		UE,
		SelectUserTagList,
	},
	data() {
		let validatePass = (rule, value, callback) => {
			let val = this.$refs.um.editor.getContent()
			// let valText = val.replace(/<[^>]+>/g, '')
			if (!val.trim()) {
				callback(new Error('请输入消息内容'))
			} else {
				callback()
			}
		}
		let validateShowPass = (rule, value, callback) => {
			let nowTime = moment().valueOf()
			let selectTime = moment(value).valueOf()
			if (!value) {
				callback(new Error('请选择定时发送时间'))
			} else {
				if (selectTime - 300000 < nowTime) {
					callback(new Error('定时发送只能选择比当前时间晚5分钟的时间'))
				} else {
					callback()
				}
			}
		}
		return {
			timeOut: new Date().getTime(),
			disabledS: false,
			detailsDisable: false,
			startTimeRange: '',
			appMessageId: '',
			typeStatus: '',
			formData: {
				title: '',
				jgPushState: 1,
				jgPushContent: '',
				coverImageState: 1,
				coverImages: [],
				pageState: 0,
				buttonName: '',
				pageForwardUrl: '',
				sendType: 1,
				sendTimerTime: '',
				target: 2,
			},
			information: '',
			fileToUpload: '',
			item: [
				{
					type: 'custom',
					title: '消息标题',
					dataIndex: 'title',
				},
				{
					type: 'custom',
					title: '极光推送',
					dataIndex: 'jgPushState',
				},
				{
					type: 'custom',
					title: '极光推送通知内容',
					dataIndex: 'jgPushContent',
					hide: false,
				},
				{
					type: 'custom',
					title: '封面图片(327px*94px)',
					dataIndex: 'coverImageState',
				},
				{
					type: 'uploadImage',
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
					type: 'custom',
					title: '消息内容',
					dataIndex: 'content',
				},
				{
					type: 'custom',
					title: '页面跳转',
					dataIndex: 'pageState',
				},
				{
					type: 'custom',
					title: '按钮名称',
					dataIndex: 'buttonName',
					hide: true,
				},
				{
					type: 'custom',
					title: '跳转页面',
					dataIndex: 'pageForwardUrl',
					hide: true,
				},
				{
					type: 'radioMap',
					dataIndex: 'sendType',
					title: '发送方式',
					options: {
						立即发送: 1,
						定时发送: 2,
					},
				},
				{
					type: 'custom',
					dataIndex: 'sendTimerTime',
					hide: true,
				},
				{
					type: 'radioMap',
					dataIndex: 'target',
					title: '目标对象',
					options: {
						全B端用户: 2,
						部分用户: 3,
						用户分群: 4,
					},
				},
				{
					type: 'custom',
					dataIndex: 'downloadTemp',
					hide: true,
				},
				{
					type: 'upload',
					dataIndex: 'organizationFile',
					hide: true,
					uploadAttributes: {
						limit: 1,
						autoUpload: true,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => {
							this.fileToUpload = file.file
						},
					},
					class: 'excel-upload',
				},
				{
					title: '用户类型',
					type: 'custom',
					dataIndex: 'userTag',
					hide: true,
				},
			],
			loading: false,
			formAction: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						this._addCmsAppMessage()
					},
				},
			],
			funRules: {
				title: [
					{ required: true, message: '请填写消息标题!', trigger: 'blur' },
				],
				jgPushContent: [
					{ required: true, message: '请填写推送内容!', trigger: 'blur' },
				],
				coverImages: [
					{ required: true, message: '请上传图片!', trigger: 'blur' },
				],
				pageForwardUrl: [
					{ required: true, message: '请输入跳转页面!', trigger: 'blur' },
				],
				sendTimerTime: [
					{ required: true, validator: validateShowPass, trigger: 'blur' },
				],
				visibleType: [
					{ required: true, message: '请选择可见对象!', trigger: 'blur' },
				],
				sort: [{ required: true, message: '请填写排序值!', trigger: 'blur' }],
				content: [{ required: true, validator: validatePass, trigger: 'blur' }],
				buttonName: [
					{ required: true, message: '请输入按钮名称!', trigger: 'blur' },
				],
				sendType: [
					{ required: true, message: '请选择发送方式!', trigger: 'blur' },
				],
			},
		}
	},
	created() {
		this.appMessageId =
			this.$route.params.appMessageId && this.$route.params.appMessageId > 0
				? this.$route.params.appMessageId
				: ''
		this.typeStatus = this.$route.params.type || ''
		this.echo()
	},
	watch: {
		formData: {
			handler: function (val) {
				console.log('val', val)
				console.log('this.item', this.item)
				const findIndex = this.findFormIndex

				this.item[findIndex('jgPushContent')].hide =
					val.jgPushState == 0 ? true : false
				this.item[findIndex('coverImages')].hide =
					val.coverImageState == 0 ? true : false
				this.item[findIndex('buttonName')].hide =
					val.pageState == 0 ? true : false
				this.item[findIndex('pageForwardUrl')].hide =
					val.pageState == 0 ? true : false
				this.item[findIndex('sendTimerTime')].hide =
					val.sendType == 1 ? true : false
				this.item[findIndex('downloadTemp')].hide =
					val.target === 3 ? false : true
				this.item[findIndex('organizationFile')].hide =
					val.target === 3 ||
					(this.typeStatus == 'new' &&
						this.appMessageId &&
						this.typeStatus == 'details')
						? false
						: true

				// 是否显示用户分群下拉
				this.item[findIndex('userTag')].hide = val.target === 4 ? false : true
			},
			deep: true,
		},
	},

	methods: {
		async echo() {
			if (this.appMessageId && this.appMessageId > 0) {
				let {
					data: { resultCode, resultData },
				} = await getCmsAppMessageDetails({
					appMessageId: this.appMessageId,
				})
				if (resultCode == 0) {
					this.formData.title = resultData.title
					this.formData.jgPushState = resultData.jgPushState
					this.formData.jgPushContent = resultData.jgPushContent
					this.formData.coverImagesState = resultData.coverImagesState
					this.formData.coverImages.push({
						imageUrl: getBigImg(resultData.coverImages),
					})
					this.information = resultData.content || 'default'
					this.formData.pageState = resultData.pageState
					this.formData.buttonName = resultData.buttonName
					this.formData.pageForwardUrl = resultData.pageForwardUrl
					if (resultData.sendTimerTime && resultData.sendType == 2) {
						this.formData.sendTimerTime = moment(
							resultData.sendTimerTime
						).format('yyyy-MM-DD HH:mm:ss')
					}
					this.formData.sendType = resultData.sendType
					this.formData.target = resultData.target
					// 用户分群
					if (resultData.userTagIds && resultData.target === 4) {
						this.formData.userTagIds = resultData.userTagIds
					}
					if (this.typeStatus == 'edit') {
						this.item[12].disabled = true
						this.item[11].disabled = true
						this.item[9].disabled = true
						this.item[1].disabled = true
						this.item[2].disabled = true
						this.item[13].hide = true
						this.disabledS = true
					} else {
						this.formAction[0].hide = true

						this.detailsDisable = true
						for (let i = 0; i < this.item.length; i++) {
							this.item[i].disabled = true
						}
					}
				}
			} else {
				this.formData = {
					title: '',
					jgPushState: 1,
					jgPushContent: '',
					coverImageState: 1,
					coverImages: [],
					pageState: 0,
					buttonName: '',
					pageForwardUrl: '',
					sendType: 1,
					sendTimerTime: '',
					target: 2,
				}
			}
		},
		importHistory() {
			this.$router.push({ path: '/import/importHistory' })
		},
		//下载模板
		downloadImpostTemplate() {
			downloadFile('/excel/platform/app推送消息部分用户模板.xlsx')
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
				JSON.stringify({ formId: '#addMaterial', imageType: 82 })
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
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		//保存
		async _addCmsAppMessage() {
			let paramsData = {
				title: this.formData.title,
				content: this.$refs.um.editor.getContent(),
				jgPushState: this.formData.jgPushState,
				coverImagesState: this.formData.coverImageState,
				sendType: this.formData.sendType,
				target: this.formData.target,
				pageState: this.formData.pageState,
			}
			// return
			if (this.formData.jgPushState == 1) {
				paramsData.jgPushContent = this.formData.jgPushContent
			}
			if (
				this.formData.coverImageState == 1 &&
				this.formData.coverImages.length
			) {
				paramsData.coverImages = this.formData.coverImages[0].imageUrlTemp
			}
			if (this.formData.pageState == 1) {
				paramsData.buttonName = this.formData.buttonName
				paramsData.pageForwardUrl = this.formData.pageForwardUrl
			}
			if (this.formData.sendType == 2) {
				paramsData.sendTimerTime = moment(this.formData.sendTimerTime).valueOf()
			} else {
				paramsData.sendTimerTime = moment().valueOf()
			}
			// 加入用户分群参数
			if (this.formData.target === 4) {
				paramsData.userTagIds = this.selectedUserTags
			} else if (paramsData.userTagIds) {
				delete paramsData.userTagIds
			}
			let isForm = true
			if (this.formData.target == 3 && this.typeStatus == 'new') {
				//部分店主
				if (this.fileToUpload == '') {
					this.$message.warning('请上传文件!')
					return
				}
				let formData = new FormData()
				formData.append(
					'data',
					JSON.stringify({
						timeStamp: new Date().getTime(),
						groupId: 2,
						...paramsData,
					})
				)
				formData.append('formId', '#appMaterial')
				formData.append('file', this.fileToUpload)
				paramsData = formData
				isForm = false
			}
			console.log('paramsData', paramsData)

			// return
			let Url = addCmsAppMessage
			if (this.appMessageId) {
				paramsData.appMessageId = this.appMessageId
				Url = updateCmsAppMessage
			}
			this.loading = true
			let res = await Url(paramsData, isForm)
			this.loading = false
			if (res.data.resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.$router.push({ name: 'AppMessage' })
			}
		},
		// 选择用户分群
		handleSelectUserTag(val) {
			if (val?.length) {
				this.selectedUserTags = val.map((i) => i.userTagId)
			}
		},
		// 查找表单配置索引
		findFormIndex(key) {
			return this.item.findIndex((i) => i.dataIndex === key)
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
