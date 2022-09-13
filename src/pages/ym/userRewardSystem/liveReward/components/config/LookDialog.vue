<template>
	<el-dialog
		class="look"
		width="650px"
		title="查看活动奖励"
		append-to-body
		v-loading="loading"
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxInfo :column="'1'" :items="items" :data="userInfo">
			<template #startTime>
				<p>
					活动时间：{{
						moment(userInfo.startTime).format('YYYY年MM月DD日HH:mm:ss') +
						'-' +
						moment(userInfo.endTime).format('YYYY年MM月DD日HH:mm:ss')
					}}
				</p>
			</template>
			<template #actSaleRewardName>
				<p>
					关联奖励：
					<el-button type="text" @click="lookActivity">{{
						userInfo.activityName
					}}</el-button>
				</p>
			</template>
			<template #liveTarget>
				展示位置：
				<div v-if="userInfo.liveTarget.switch">
					<p class="live">
						<el-checkbox
							disabled
							class="margin-right"
							v-model="userInfo.liveTarget.switch"
							>直播</el-checkbox
						>
						<span
							class="ml10"
							v-if="userInfo.liveTarget.targetNames.length > 0"
							>{{ userInfo.liveTarget.targetNames.join('，') }}</span
						>
					</p>
					<div class="location">
						<p>
							活动海报：
							<el-image
								class="location__poster location__img"
								:src="userInfo.liveTarget.activityPosterImages"
							/>
						</p>
						<p>
							活动入口图：
							<el-image
								class="location__img"
								:src="userInfo.liveTarget.entrancePosterImages"
							/>
						</p>
					</div>
				</div>

				<div class="location" v-if="userInfo.goodsGroupTarget.switch">
					<p class="brand" :class="{ embellish: userInfo.liveTarget.switch }">
						<el-checkbox
							class="margin-right"
							disabled
							v-model="userInfo.goodsGroupTarget.switch"
							>品牌会场页</el-checkbox
						>
						<span
							class="ml10"
							v-if="userInfo.goodsGroupTarget.targetNames.length > 0"
							>{{ userInfo.goodsGroupTarget.targetNames.join('，') }}</span
						>
					</p>
					<p>
						活动海报：
						<el-image
							class="location__poster location__img"
							:src="userInfo.goodsGroupTarget.activityPosterImages"
						/>
					</p>
					<p>
						活动入口图：
						<el-image
							class="location__img"
							:src="userInfo.goodsGroupTarget.entrancePosterImages"
						/>
					</p>
				</div>
			</template>
		</YxInfo>
	</el-dialog>
</template>

<script>
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'
import { getActSaleRewardEntrance } from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxInfo: () => import('@wg-vue-materials/yx-info'),
	},

	data() {
		return {
			checked: true,
			userInfo: {
				entranceName: '',
				startTime: '',
				actSaleRewardName: '',
				liveTarget: {
					switch: false,
					targetIds: '',
					targetNames: '',
					activityPosterImages: [],
					entrancePosterImages: [],
				},
				goodsGroupTarget: {
					switch: false,
					targetIds: '',
					targetNames: '',
					activityPosterImages: [],
					entrancePosterImages: [],
				},
			},
			items: [
				{
					type: 'string',
					title: '活动名称',
					dataIndex: 'entranceName',
				},
				{
					type: 'custom',
					dataIndex: 'startTime',
				},
				{
					type: 'custom',
					dataIndex: 'actSaleRewardName',
				},
				{
					type: 'custom',
					dataIndex: 'liveTarget',
				},
			],
			params: {},
			loading: false,
			moment,
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
			this.actSaleRewardEntranceId = actSaleRewardEntranceId
			const {
				data: { resultCode, resultData },
			} = await getActSaleRewardEntrance({ actSaleRewardEntranceId })

			if (resultCode == 0) {
				this.userInfo = resultData
				this.userInfo.liveTarget.activityPosterImages =
					resultData.liveTarget.activityPosterImages.length > 0
						? getBigImg(resultData.liveTarget.activityPosterImages[0])
						: []
				this.userInfo.liveTarget.entrancePosterImages =
					resultData.liveTarget.entrancePosterImages.length > 0
						? getBigImg(resultData.liveTarget.entrancePosterImages[0])
						: []
				this.userInfo.goodsGroupTarget.activityPosterImages =
					resultData.goodsGroupTarget.activityPosterImages.length > 0
						? getBigImg(resultData.goodsGroupTarget.activityPosterImages[0])
						: []
				this.userInfo.goodsGroupTarget.entrancePosterImages =
					resultData.goodsGroupTarget.entrancePosterImages.length > 0
						? getBigImg(resultData.goodsGroupTarget.entrancePosterImages[0])
						: []
				this.userInfo.liveTarget.switch =
					resultData.liveTarget.targetIds.length > 0 ? true : false
				this.userInfo.goodsGroupTarget.switch =
					resultData.goodsGroupTarget.targetIds.length > 0 ? true : false
				this.params = {
					actSaleRewardEntranceId,
					actSaleRewardId: resultData.actSaleRewardId,
				}
			} else {
				this.userInfo = {
					entranceName: '',
					startTime: '',
					actSaleRewardName: '',
					liveTarget: {
						switch: false,
						targetIds: '',
						targetNames: '',
						activityPosterImages: [],
						entrancePosterImages: [],
					},
					goodsGroupTarget: {
						switch: false,
						targetIds: '',
						targetNames: '',
						activityPosterImages: [],
						entrancePosterImages: [],
					},
				}
			}
			this.loading = false
		},

		resetForm() {
			this.localVisible = false
			this.rowData = {}
		},

		lookActivity() {
			this.$emit('fatherMethodInit', this.params)
		},
	},
}
</script>

<style lang="scss" scoped>
.ml10 {
	margin-left: 10px;
}

.live {
	margin: -20px 0 0 72px;
}

.brand {
	margin-top: -20px;
}

.embellish {
	margin-top: 10px;
}

.location {
	padding-left: 74px;

	&__poster {
		margin-left: 13px;
	}

	&__img {
		width: 100px;
		height: 100px;
	}
}
</style>
