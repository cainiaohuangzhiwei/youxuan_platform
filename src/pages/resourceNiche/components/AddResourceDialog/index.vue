<template>
	<Dialog
		:title="title"
		:visible.sync="visible"
		customClass="add-resource-dialog-wrapper"
		width="780px"
		@close="handleClose"
		:showClose="true"
	>
		<div class="add-resource-dialog" v-loading="dialogLoading" v-if="visible">
			<yx-form
				ref="form"
				labelWidth="100px"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
				:rules="formRules"
				:formDisabled="formDisabled"
			>
				<template slot="jumpInfo">
					<!-- 跳转方式 -->
					<SelectSkipType
						:defaultValue="jumpInfo"
						@onChange="handleSkipTypeChange"
						:formDisabled="formDisabled || disableSelectForm"
					/>
				</template>
				<!-- 用户分群 -->
				<template slot="userTagIds">
					<SelectUserTagList
						:defaultSelectList="userTagIds"
						@change="handleSelectUserTag"
						:disabled="formDisabled || disableSelectForm"
					/>
				</template>
			</yx-form>
		</div>
	</Dialog>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import SelectSkipType from '@/components/SelectSkipType'
import SelectUserTagList from '@/components/SelectUserTagList'
import {
	addStartPage,
	updateStartPage,
	getStartPageDetail,
	addFloatWindowPage,
	updateFloatWindowPage,
	getFloatWindowDetail,
} from '@/api/marketing'

export default {
	components: {
		Dialog,
		YxForm,
		SelectSkipType,
		SelectUserTagList,
	},

	props: {
		type: {
			type: String,
			default: 'BootPage',
		},
		title: {
			type: String,
			default: '',
		},
		visible: {
			type: Boolean,
			default: false,
		},
		defaultValue: {
			type: Object,
			default: () => {},
		},
		formDisabled: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			jumpInfo: {},
			userTagIds: [],
			selectedUserTags: [],
			dialogLoading: false,
			formData: {
				activityTitle: '',
				startTime: '',
				endTime: '',
				imageUrl: [],
				jumpInfo: {},
				sort: 0,
				applicationTypeList: [],
				applicationModuleList: [],
			},
			formCfg: [
				{
					title: '启动页名称',
					type: 'input',
					dataIndex: 'activityTitle',
					maxlength: 30,
				},
				{
					title: '开始时间',
					type: 'time',
					dataIndex: 'startTime',
					placeholder: '请选择开始时间',
					timeAttributes: {
						type: 'datetime',
						pickerOptions: {
							disabledDate: (time) => {
								return time.getTime() < Date.now() - 8.64e7
							},
						},
					},
				},
				{
					title: '结束时间',
					type: 'time',
					dataIndex: 'endTime',
					placeholder: '请选择结束时间',
					timeAttributes: {
						type: 'datetime',
						pickerOptions: {
							disabledDate: (time) => {
								return time.getTime() < Date.now() - 8.64e7
							},
						},
					},
				},
				{
					type: 'uploadImage',
					title: '广告图片',
					dataIndex: 'imageUrl',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'imageUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					type: 'custom',
					title: '跳转',
					dataIndex: 'jumpInfo',
				},
				{
					title: '可见人群',
					type: 'custom',
					dataIndex: 'userTagIds',
				},
				{
					title: '排序值',
					type: 'inputNumber',
					dataIndex: 'sort',
					placeholder: '请输入排序值',
					maxlength: 6,
				},
				{
					type: 'checkbox',
					title: '应用',
					dataIndex: 'applicationTypeList',
					label: 'value',
					options: [
						{
							applicationTypeList: 1,
							value: '小程序',
						},
						{
							applicationTypeList: 2,
							value: 'B端APP',
						},
					],
				},
			],
			formRules: {
				activityTitle: [
					{ required: true, message: '请输入启动页名称', trigger: 'blur' },
				],
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'blur' },
				],
				endTime: [
					{ required: true, message: '请选择结束时间', trigger: 'blur' },
				],
				imageUrl: [
					{ required: true, message: '请上传广告图片', trigger: 'blur' },
				],
				jumpInfo: [
					{ required: true, message: '请选择跳转方式', trigger: 'blur' },
				],
				applicationTypeList: [
					{ required: true, message: '请选择应用场景', trigger: 'blur' },
				],
				applicationModuleList: [
					{ required: true, message: '请选择应用场景', trigger: 'blur' },
				],
				sort: [
					{
						validator: (rule, value, callback) => {
							if (value > 999999) {
								callback(new Error('排序值最高不超过999999'))
							} else if (!/(^[1-9]\d*$)/.test(value) && value != 0) {
								callback(new Error('请输入0或正整数'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: this.handleConfirm,
				},
			],
			disableSelectForm: false,
		}
	},

	watch: {
		async visible(val) {
			// 新增和编辑之间进行切换表单状态
			this.formCfg = this.formCfg.map((item) => {
				if (this.defaultValue.advActivityId && this.defaultValue.status !== 1) {
					return {
						...item,
						disabled: item.dataIndex !== 'endTime',
					}
				}
				return {
					...item,
					disabled: false,
				}
			})

			// 禁用部分表单
			this.disableSelectForm =
				!!this.defaultValue.advActivityId && this.defaultValue.status !== 1
			if (!this.defaultValue.advActivityId) {
				this.resetForm()
			}

			if (!val || !this.defaultValue.advActivityId) return

			this.dialogLoading = true

			const fetchMethods =
				this.type === 'Floating' ? getFloatWindowDetail : getStartPageDetail

			// 接口请求回显数据
			const {
				data: { resultData: defaultValue },
			} = await fetchMethods({
				advActivityId: this.defaultValue.advActivityId,
			})

			if (!defaultValue) return

			// 人群回显
			if (defaultValue.advUserTagRelationList) {
				this.userTagIds = defaultValue.advUserTagRelationList?.map(
					(i) => i.userTagId
				)
				this.selectedUserTags = defaultValue.advUserTagRelationList?.map(
					(i) => i.userTagId
				)
			}

			// 应用场景回显
			if (defaultValue.advApplicationSceneList?.length) {
				if (this.type === 'BootPage') {
					defaultValue.applicationTypeList =
						defaultValue.advApplicationSceneList?.map((i) => i.applicationType)
				}

				if (this.type === 'Floating') {
					defaultValue.applicationModuleList =
						defaultValue.advApplicationSceneList?.map(
							(i) => i.applicationModule
						)
				}
			}

			// 回显格式化跳转类型
			if (typeof defaultValue.jumpInfo === 'string') {
				try {
					defaultValue.jumpInfo = JSON.parse(defaultValue.jumpInfo || '{}')
					this.jumpInfo = defaultValue.jumpInfo
				} catch (err) {
					console.log(err)
				}
			}

			// 回显图片
			if (typeof defaultValue.imageUrl === 'string') {
				defaultValue.imageUrl = [
					{
						imageUrl: getBigImg(defaultValue.imageUrl),
					},
				]
			} else {
				defaultValue.imageUrl = []
			}

			console.log({
				...this.formData,
				...defaultValue,
			})

			this.formData = {
				...this.formData,
				...defaultValue,
			}

			this.dialogLoading = false
		},
	},

	created() {
		// 针对浮窗广告进行修改对应的表单
		if (this.type === 'Floating') {
			this.formCfg = this.formCfg.map((item) => {
				if (item.dataIndex === 'applicationTypeList') {
					return {
						...item,
						dataIndex: 'applicationModuleList',
						options: [
							{
								applicationModuleList: 1,
								value: '选品页',
							},
							{
								applicationModuleList: 2,
								value: '店铺页',
							},
							{
								applicationModuleList: 3,
								value: 'B端【我的】',
							},
							{
								applicationModuleList: 4,
								value: 'C端【我的】',
							},
						],
					}
				}

				if (item.dataIndex === 'activityTitle') {
					return {
						...item,
						title: '浮窗名称',
					}
				}

				return item
			})
		}
	},

	methods: {
		handleClose() {
			// 关闭弹窗
			this.$emit('update:visible', false)
			// 重置表单
			this.$refs.form.$refs.YxForm.resetFields()
		},

		// 提交
		async handleConfirm() {
			const params = { ...this.formData }

			// 新增人Id
			params.addUserId = this.$store.state.user.userInfo.userId

			// 指定标签类型：0：全量用户，1:指定人群标签
			params.tagType = 0

			// 处理用户分群
			if (this.selectedUserTags.length > 0) {
				params.userTagList = this.selectedUserTags.map((i) => {
					// 更新接口需要返回的格式
					if (params.advActivityId) {
						// 找到接口返回的数据中存在的关系数据
						const target = params.advUserTagRelationList?.find(
							(j) => j.userTagId === i.userTagId
						)
						return {
							userTagId: i.userTagId,
							advUserTagRelationId: target ? target.advUserTagRelationId : 0,
							userTagType: target ? target.userTagType : 1,
						}
					}
					// 新增提交
					return {
						userTagId: i.userTagId,
						userTagType: 1,
					}
				})
				params.tagType = 1
			}

			// 处理上传图片格式
			if (params.imageUrl.length > 0) {
				params.imageUrl = params.imageUrl?.[0]?.imageUrl || ''
			} else if (params.imageUrl.length === 0) {
				params.imageUrl = ''
			}

			// 过滤出需要的参数
			const requestParams = {
				activityTitle: params.activityTitle,
				addUserId: params.addUserId,
				applicationTypeList: params.applicationTypeList || [],
				endTime: params.endTime,
				imageUrl: params.imageUrl,
				jumpInfo: params.jumpInfo,
				sort: params.sort,
				startTime: params.startTime,
				tagType: params.tagType,
				userTagList: params.userTagList || [],
			}

			// 新增/编辑
			// 启动广告新增和更新
			let fetchMethods = params.advActivityId ? updateStartPage : addStartPage

			// 浮窗广告新增和更新
			if (this.type === 'Floating') {
				fetchMethods = params.advActivityId
					? updateFloatWindowPage
					: addFloatWindowPage

				requestParams.applicationModuleList = params.applicationModuleList
				delete requestParams.applicationTypeList
			}

			// 更新时数据处理
			if (params.advActivityId) {
				// 活动弹窗ID
				requestParams.advActivityId = params.advActivityId
				requestParams.lastUpdateUser = requestParams.addUserId
				delete requestParams.addUserId

				if (this.type === 'BootPage') {
					// 广告配置应用场景
					requestParams.advApplicationSceneList =
						params.applicationTypeList.map((i) => {
							// 找到接口返回的数据中存在的关系数据
							const target = params.advApplicationSceneList.find(
								(j) => j.applicationType === i
							)
							return {
								advApplicationSceneId: target
									? target.advApplicationSceneId
									: 0,
								applicationType: i,
							}
						})
					delete requestParams.applicationTypeList
				}

				if (this.type === 'Floating') {
					// 广告配置应用场景
					requestParams.advApplicationSceneList =
						params.applicationModuleList.map((i) => {
							// 找到接口返回的数据中存在的关系数据
							const target = params.advApplicationSceneList.find(
								(j) => j.applicationModule === i
							)
							return {
								advApplicationSceneId: target
									? target.advApplicationSceneId
									: 0,
								applicationModule: i,
							}
						})
					delete requestParams.applicationModuleList
				}
			}

			console.log(requestParams, 'handleConfirm')

			const {
				data: { resultCode, resultData },
			} = await fetchMethods(requestParams)

			if (resultCode === 0 && resultData) {
				this.$message.success(params.advActivityId ? '修改成功!' : '新增成功!')
				this.$emit('successCallback', params.advActivityId)
				this.handleClose()
			}
		},

		async uploadImageHttpRequest(params) {
			//上传图片
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({
					formId: '#imageUrl',
					imageType: 34,
					isPng: 'png',
				})
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				this.formData.imageUrl = resultData.imageList
				this.formData.imageUrl[0].imageUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
			}
		},

		// 选择跳转类型
		handleSkipTypeChange(val) {
			this.formData.jumpInfo = {
				skipType: val.skipType,
				skipUrl: val.skipUrl,
				skipDesc: val.skipDesc,
				appUrl: val.appUrl,
				appRouterName: val.appRouterName,
			}
		},

		// 选择用户分群
		handleSelectUserTag(val) {
			this.selectedUserTags = val
		},

		resetForm() {
			this.userTagIds = []
			this.selectedUserTags = []
			this.jumpInfo = {}
			this.formData = {
				activityTitle: '',
				startTime: '',
				endTime: '',
				imageUrl: [],
				jumpInfo: {},
				sort: 0,
				applicationTypeList: [],
				applicationModuleList: [],
			}
		},
	},
}
</script>

<style scoped lang="scss">
.add-resource-dialog {
	width: 100%;
}

.add-resource-dialog-wrapper .el-dialog__body {
	max-height: 800px;
}
</style>
