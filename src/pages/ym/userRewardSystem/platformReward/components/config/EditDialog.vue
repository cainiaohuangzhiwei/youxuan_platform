<template>
	<el-dialog
		width="600px"
		:title="
			formData.actSaleRewardEntranceId ? '编辑配置奖励活动' : '新增配置奖励活动'
		"
		v-loading="loading"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxForm
			ref="form"
			:items="item"
			:rules="rules"
			:inline="false"
			:data="formData"
			:labelWidth="'95px'"
			:formAction="formAction"
		>
			<template #actSaleRewardId>
				<el-button type="primary" @click="handleAward">{{
					!formData.activityName ? '选择关联奖励' : '更换活动'
				}}</el-button>
				<span class="ml10" v-if="formData.activityName">{{
					formData.activityName
				}}</span>
			</template>
			<template #liveTarget>
				<el-checkbox-group v-model="formData.liveTarget" @change="handleLive">
					<el-checkbox label="直播" name="liveTargetIds" />
					<el-button class="ml10" type="text" @click="handleLiveDialog">{{
						!formData.livePlanName ? '选择直播' : '更换直播'
					}}</el-button>
					<span v-if="formData.livePlanName" class="ml10">{{
						formData.livePlanName
					}}</span>
				</el-checkbox-group>
			</template>
			<template #goodsGroupTarget>
				<el-checkbox-group
					v-model="formData.goodsGroupTarget"
					@change="handleBrand"
				>
					<el-checkbox label="品牌会场页" name="type" />
					<el-button class="ml10" type="text" @click="handleBrandDialog">{{
						!formData.groupName.length ? '选择分组' : '更换分组'
					}}</el-button>
					<span v-if="formData.groupName.length > 0" class="ml10 live_name">
						{{ formData.groupName.join('，') }}
					</span>
				</el-checkbox-group>
			</template>
		</YxForm>

		<LiveDialog
			ref="live"
			:visible.sync="liveDialog"
			@liveMethod="liveMethod"
		/>

		<AwardDialog
			ref="award"
			:visible.sync="awardDialog"
			@awardMethod="awardMethod"
		/>

		<GroupDialog
			ref="group"
			:itemInfo="formData"
			:visible.sync="groupDialog"
			@groupMethod="groupMethod"
		/>
	</el-dialog>
</template>

<script>
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import {
	createActSaleRewardEntrance,
	updateActSaleRewardEntrance,
	getActSaleRewardEntrance,
} from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		LiveDialog: () => import('./LiveDialog'),
		AwardDialog: () => import('./AwardDialog'),
		GroupDialog: () => import('./GroupDialog'),
		YxForm: () => import('@wg-vue-materials/yx-form'),
	},

	data() {
		return {
			item: [
				{
					title: '活动名称',
					dataIndex: 'entranceName',
					placeholder: '请输入活动名称',
				},
				{
					type: 'time',
					title: '活动时间',
					dataIndex: 'time',
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
					},
				},
				{
					type: 'custom',
					title: '关联奖励',
					dataIndex: 'actSaleRewardId',
				},
				{
					type: 'custom',
					title: '展示位置',
					dataIndex: 'liveTarget',
				},
				{
					hide: true,
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'liveTargetActivityPosterImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'liveTargetActivityPosterImages',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'liveTargetActivityPosterImages',
								'addSupplierCredentials',
								83
							),
					},
				},
				{
					hide: true,
					type: 'uploadImage',
					title: '活动入口图',
					dataIndex: 'liveTargetEntrancePosterImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'liveTargetEntrancePosterImages',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'liveTargetEntrancePosterImages',
								'addSupplierCredentials',
								84
							),
					},
				},
				{
					type: 'custom',
					dataIndex: 'goodsGroupTarget',
				},
				{
					hide: true,
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'goodsGroupTargetActivityPosterImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'goodsGroupTargetActivityPosterImages',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'goodsGroupTargetActivityPosterImages',
								'addSupplierCredentials',
								83
							),
					},
				},
				{
					hide: true,
					type: 'uploadImage',
					title: '活动入口图',
					dataIndex: 'goodsGroupTargetEntrancePosterImages',
					uploadAttributes: {
						limit: 1,
						imageName: 'goodsGroupTargetEntrancePosterImages',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'goodsGroupTargetEntrancePosterImages',
								'addSupplierCredentials',
								84
							),
					},
				},
				{
					type: 'textarea',
					title: '活动规则',
					dataIndex: 'description',
					placeholder: '请输入活动规则',
				},
			],
			formData: {
				liveTarget: [],
				activityName: '',
				actSaleRewardId: '',
				entranceName: '',
				time: '',
				actSaleRewardEntranceId: '',
				goodsGroupTarget: [],
				livePlanName: '',
				liveTargetIds: '',
				groupName: [],
				goodsGroupTargetIds: [],
				liveTargetActivityPosterImages: [],
				liveTargetEntrancePosterImages: [],
				goodsGroupTargetActivityPosterImages: [],
				goodsGroupTargetEntrancePosterImages: [],
				description: '',
			},
			loading: false,
			liveDialog: false,
			awardDialog: false,
			groupDialog: false,
			tableData: [],
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
				{
					title: '取消',
					type: 'cancel',
					cancel: true,
					click: () => {
						this.resetForm()
					},
				},
			],
			rules: {
				entranceName: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{ max: 15, message: '活动的名称，不超过15个字符', trigger: 'blur' },
				],
				time: [
					{
						required: true,
						message: '请选择活动时间',
						trigger: 'blur',
					},
				],
				actSaleRewardId: [
					{ required: true, message: '请选择关联奖励', trigger: 'blur' },
				],
				liveTargetActivityPosterImages: [
					{ required: true, message: '请上传活动海报', trigger: 'change' },
				],
				liveTargetEntrancePosterImages: [
					{ required: true, message: '请上传活动入口图', trigger: 'change' },
				],
				goodsGroupTargetActivityPosterImages: [
					{ required: true, message: '请上传活动海报', trigger: 'change' },
				],
				goodsGroupTargetEntrancePosterImages: [
					{ required: true, message: '请上传活动入口图', trigger: 'change' },
				],
			},
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
		async _getActSaleRewardEntrance(actSaleRewardEntranceId) {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getActSaleRewardEntrance({ actSaleRewardEntranceId })

			if (resultCode == 0) {
				if (resultData.liveTarget.targetIds.length > 0) {
					this.item[4].hide = false
					this.item[5].hide = false
				} else {
					this.item[4].hide = true
					this.item[5].hide = true
				}
				if (resultData.goodsGroupTarget.targetIds.length > 0) {
					this.item[7].hide = false
					this.item[8].hide = false
				} else {
					this.item[7].hide = true
					this.item[8].hide = true
				}

				this.formData = {
					liveTarget:
						resultData.liveTarget.targetIds.length > 0 ? ['直播'] : [],
					activityName: resultData.activityName,
					actSaleRewardId: resultData.actSaleRewardId,
					entranceName: resultData.entranceName,
					time: [resultData.startTime, resultData.endTime],
					actSaleRewardEntranceId: resultData.actSaleRewardEntranceId,
					goodsGroupTarget:
						resultData.goodsGroupTarget.targetIds.length > 0
							? ['品牌会场页']
							: [],
					livePlanName: resultData.liveTarget.targetNames.join('，'),
					liveTargetIds: resultData.liveTarget.targetIds,
					groupName: resultData.goodsGroupTarget.targetNames,
					goodsGroupTargetIds: resultData.goodsGroupTarget.targetIds,
					liveTargetActivityPosterImages:
						resultData.liveTarget.activityPosterImages.length > 0
							? [
									{
										imageUrl: resultData.liveTarget.activityPosterImages[0],
										liveTargetActivityPosterImages: getBigImg(
											resultData.liveTarget.activityPosterImages[0]
										),
									},
							  ]
							: [],
					liveTargetEntrancePosterImages:
						resultData.liveTarget.entrancePosterImages.length > 0
							? [
									{
										imageUrl: resultData.liveTarget.entrancePosterImages[0],
										liveTargetEntrancePosterImages: getBigImg(
											resultData.liveTarget.entrancePosterImages[0]
										),
									},
							  ]
							: [],
					goodsGroupTargetActivityPosterImages:
						resultData.goodsGroupTarget.activityPosterImages.length > 0
							? [
									{
										imageUrl:
											resultData.goodsGroupTarget.activityPosterImages[0],
										goodsGroupTargetActivityPosterImages: getBigImg(
											resultData.goodsGroupTarget.activityPosterImages[0]
										),
									},
							  ]
							: [],
					goodsGroupTargetEntrancePosterImages:
						resultData.goodsGroupTarget.entrancePosterImages.length > 0
							? [
									{
										imageUrl:
											resultData.goodsGroupTarget.entrancePosterImages[0],
										goodsGroupTargetEntrancePosterImages: getBigImg(
											resultData.goodsGroupTarget.entrancePosterImages[0]
										),
									},
							  ]
							: [],
					description: resultData.description,
				}
			}
			this.loading = false
		},

		handleParams() {
			const data = JSON.parse(JSON.stringify(this.formData))
			const paramsData = {
				entranceName: data.entranceName,
				startTime: moment(data.time[0]).valueOf(),
				endTime: moment(data.time[1]).valueOf(),
				actSaleRewardId: data.actSaleRewardId,
				description: data.description,
			}

			if (data.liveTarget.length > 0) {
				paramsData.liveTarget = {
					targetNames: data.livePlanName ? [data.livePlanName] : [],
					activityPosterImages:
						data.liveTargetActivityPosterImages[0] &&
						data.liveTargetActivityPosterImages[0][0]
							? [data.liveTargetActivityPosterImages[0][0].imageUrl]
							: [data.liveTargetActivityPosterImages[0].imageUrl],
					entrancePosterImages:
						data.liveTargetEntrancePosterImages[0] &&
						data.liveTargetEntrancePosterImages[0][0]
							? [data.liveTargetEntrancePosterImages[0][0].imageUrl]
							: [data.liveTargetEntrancePosterImages[0].imageUrl],
				}
				if (
					Array.isArray(data.liveTargetIds) &&
					data.liveTargetIds.length > 0
				) {
					paramsData.liveTarget.targetIds = data.liveTargetIds
				} else {
					paramsData.liveTarget.targetIds = data.liveTargetIds
						? [data.liveTargetIds]
						: []
				}
			} else {
				paramsData.liveTarget = null
			}
			if (data.goodsGroupTarget.length > 0) {
				paramsData.goodsGroupTarget = {
					targetIds: data.goodsGroupTargetIds,
					targetNames: data.groupName,
					activityPosterImages:
						data.goodsGroupTargetActivityPosterImages[0] &&
						data.goodsGroupTargetActivityPosterImages[0][0]
							? [data.goodsGroupTargetActivityPosterImages[0][0].imageUrl]
							: [data.goodsGroupTargetActivityPosterImages[0].imageUrl],
					entrancePosterImages:
						data.goodsGroupTargetEntrancePosterImages[0] &&
						data.goodsGroupTargetEntrancePosterImages[0][0]
							? [data.goodsGroupTargetEntrancePosterImages[0][0].imageUrl]
							: [data.goodsGroupTargetEntrancePosterImages[0].imageUrl],
				}
			} else {
				paramsData.goodsGroupTarget = null
			}

			return paramsData
		},

		submitForm() {
			if (
				this.formData.liveTarget.length == 0 &&
				this.formData.goodsGroupTarget.length == 0
			) {
				return this.$message.warning('请选择展示位置')
			}
			if (
				this.formData.liveTarget.length > 0 &&
				this.formData.liveTargetIds.length == 0
			) {
				return this.$message.warning('关联直播不能为空')
			}
			if (
				this.formData.goodsGroupTarget.length > 0 &&
				this.formData.goodsGroupTargetIds == 0
			) {
				return this.$message.warning('关联分组不能为空')
			}

			const params = this.handleParams()

			if (!this.formData.actSaleRewardEntranceId) {
				this._createActSaleRewardEntrance(params)
			} else {
				this._updateActSaleRewardEntrance(params)
			}
		},

		async _createActSaleRewardEntrance(params) {
			this.loading = true
			const {
				data: { resultCode, resultMsg },
			} = await createActSaleRewardEntrance(params)

			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetForm()
				this.$emit('fatherMethodTwo')
			}
			this.loading = false
		},

		async _updateActSaleRewardEntrance(params) {
			this.loading = true
			params.actSaleRewardEntranceId = this.formData.actSaleRewardEntranceId
			const {
				data: { resultCode, resultMsg },
			} = await updateActSaleRewardEntrance(params)

			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetForm()
				this.$emit('fatherMethodTwo')
			}
			this.loading = false
		},

		liveMethod(row) {
			this.formData.liveTargetIds = row.livePlanId
			this.formData.livePlanName = row.livePlanName
		},

		groupMethod(row) {
			this.formData.groupName = []
			this.formData.goodsGroupTargetIds = []
			for (let i = 0; i < row.length; i++) {
				this.formData.groupName.push(row[i].groupName)
				this.formData.goodsGroupTargetIds.push(row[i].goodsGroupId)
			}
		},

		awardMethod(row) {
			this.formData.activityName = row.activityName
			this.formData.actSaleRewardId = row.actSaleRewardId
		},

		async uploadCertificate(params, key, name, imageType) {
			const formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: `#${name}`, imageType: imageType })
			)
			formData.append('image', params.file)
			const res = await uploadImageList(formData)

			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				if (imageType == 44) {
					this.formData[key] = res.data.resultData.imageList
					this.formData[key][0][key] = getBigImg(
						res.data.resultData.imageList[0].imageUrl
					)
				} else {
					this.formData[key].push(res.data.resultData.imageList)
					for (let i = 0; i < this.formData[key].length; i++) {
						const item = this.formData[key][i]
						for (let j = 0; j < item.length; j++) {
							if (item[j].imageUrl) {
								this.formData[key][i][key] = getBigImg(item[j].imageUrl)
							}
						}
					}
				}

				this.flag = false
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},

		handleLive(val) {
			if (val.length > 0) {
				this.item[4].hide = false
				this.item[5].hide = false
			} else {
				this.item[4].hide = true
				this.item[5].hide = true
			}
		},

		handleBrand(val) {
			if (val.length > 0) {
				this.item[7].hide = false
				this.item[8].hide = false
			} else {
				this.item[7].hide = true
				this.item[8].hide = true
			}
		},

		resetForm() {
			this.localVisible = false
			this.item[4].hide = true
			this.item[5].hide = true
			this.item[7].hide = true
			this.item[8].hide = true
			this.formData = {
				liveTarget: [],
				activityName: '',
				actSaleRewardId: '',
				entranceName: '',
				time: '',
				actSaleRewardEntranceId: '',
				goodsGroupTarget: [],
				livePlanName: '',
				liveTargetIds: '',
				groupName: [],
				goodsGroupTargetIds: [],
				liveTargetActivityPosterImages: [],
				liveTargetEntrancePosterImages: [],
				goodsGroupTargetActivityPosterImages: [],
				goodsGroupTargetEntrancePosterImages: [],
				description: '',
			}
		},

		handleAward() {
			this.awardDialog = true
			this.$nextTick(() => {
				this.$refs.award.details(this.formData.actSaleRewardId)
			})
		},

		handleLiveDialog() {
			this.liveDialog = true
			this.$nextTick(() => {
				this.$refs.live.details(this.formData.liveTargetIds)
			})
		},

		handleBrandDialog() {
			this.groupDialog = true
			this.$nextTick(() => {
				this.$refs.group.details(this.formData.goodsGroupTargetIds)
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.ml10 {
	font-size: 14px;
	margin-left: 10px;
}

.live_name {
	width: 460px;
	line-height: 16px;
}
</style>
