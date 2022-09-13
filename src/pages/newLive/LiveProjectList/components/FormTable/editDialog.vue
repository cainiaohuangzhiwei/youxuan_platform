<template>
	<el-dialog
		width="1140px"
		title="编辑商品信息"
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
			:labelWidth="'80px'"
			:formAction="formAction"
		>
			<template #actSaleRewardId>
				<el-button
					v-if="formData.groupName.length == 0"
					type="primary"
					@click="handleAward"
					>选择分组</el-button
				>
				<div v-else class="skip">
					<div class="ml10">
						{{ formData.groupName }} <span>，已选择50个商品</span>
						<!-- <span>，鼠标拖动可以调整顺序；</span> -->
					</div>
					<div v-if="status == 1">
						<el-button type="primary" @click="handleAward">确认</el-button>
						<el-button @click="handleAward">取消关联</el-button>
					</div>
					<div v-if="status == 2">
						<el-button type="success" @click="handleAward"
							>继续增加分组</el-button
						>
						<el-button type="primary" @click="handleAward"
							>确认，不需要再增加分组</el-button
						>
						<el-button @click="handleAward">取消关联</el-button>
					</div>
					<div v-if="status == 3">
						<el-button type="primary" @click="handleAward"
							>不调整，用默认顺序并确认</el-button
						>
						<el-button @click="handleAward">取消操作</el-button>
					</div>
				</div>
			</template>
			<template #time>
				<!-- :style="{ height: height + 'px' }" -->
				<div class="draggable">
					<draggable v-model="list">
						<transition-group>
							<div class="wrapper" v-for="(item, index) in list" :key="index">
								<el-checkbox class="checkbox" v-model="item.checked">
									<div class="goods">
										<img
											class="goods__img"
											:src="getSmallImg(item.goodsImgUrl)"
											alt=""
										/>
										<div class="goods__name">{{ item.goodsName }}</div>
									</div>
								</el-checkbox>
							</div>
						</transition-group>
					</draggable>
				</div>
			</template>
		</YxForm>
		<SelectedGroupDialog
			:dialogVisible.sync="dialogGroupVisible"
			:itemInfo.sync="selectedGoodsGroup"
		/>
	</el-dialog>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import draggable from 'vuedraggable'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import {
	createActSaleRewardEntrance,
	updateActSaleRewardEntrance,
	// getActSaleRewardEntrance,
} from '@/api/userRewardSystem'
// import { goodsList } from '@/api/livePlan'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		draggable,
		YxForm: () => import('@wg-vue-materials/yx-form'),
		SelectedGroupDialog: () => import('./selectedGroupDialog'),
	},

	data() {
		return {
			getSmallImg,
			status: 0,
			dialogGroupVisible: false,
			selectedGoodsGroup: {},
			list: [
				{
					id: 1,
					checked: false,
					goodsName: '121212',
					goodsImgUrl: 'file/group_2/goods_233336/1608978591520_609234s.jpg',
				},
				{
					id: 2,
					checked: false,
					goodsName: '4545',
					goodsImgUrl: 'file/group_2/goods_233335/1608963580603_025986s.jpg',
				},
			],
			item: [
				{
					type: 'uploadImage',
					title: '引流商品',
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
					type: 'custom',
					title: '商城跳转',
					dataIndex: 'actSaleRewardId',
				},
				{
					type: 'custom',
					dataIndex: 'time',
				},
			],
			formData: {
				liveTarget: [],
				activityName: '',
				actSaleRewardId: '',
				time: '',
				actSaleRewardEntranceId: '',
				groupName: [],
				goodsGroupId: [],
				liveTargetActivityPosterImages: [],
				description: '',
			},
			loading: false,
			tableData: [],
			formAction: [
				// {
				// 	title: '确定',
				// 	type: 'primary',
				// 	click: () => {
				// 		this.handleBtn()
				// 	},
				// },
				// {
				// 	title: '取消',
				// 	type: 'cancel',
				// 	cancel: true,
				// 	click: () => {
				// 		this.resetForm()
				// 	},
				// },
			],
			rules: {
				actSaleRewardId: [
					{ required: true, message: '请选择关联奖励', trigger: 'blur' },
				],
				liveTargetActivityPosterImages: [
					{ required: true, message: '请上传引流商品', trigger: 'change' },
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
		height() {
			return Math.ceil(this.list.length / 10) * 125
		},
	},

	watch: {
		selectedGoodsGroup() {
			this.status = 1
			this.formData.groupName.push(this.selectedGoodsGroup.groupName)
			this.formData.goodsGroupId.push(this.selectedGoodsGroup.goodsGroupId)
			// this.formData.goodsGroupId = [
			// 	...new Set(this.selectedGoodsGroup.goodsGroupId),
			// ]
			// this.formData.groupName = [...new Set(this.selectedGoodsGroup.groupName)]
			console.log('groupName', this.selectedGoodsGroup.groupName)
			console.log('goodsGroupId', this.selectedGoodsGroup.goodsGroupId)
		},
	},

	created() {
		// this._goodsList()
	},

	updated() {
		// console.log('1111111', this.list)
	},

	methods: {
		async _goodsList() {
			// const {
			// 	data: { resultCode, resultMsg },
			// } = await goodsList({ livePlanId: 1 })
			// console.log('res', res);
		},

		async _getActSaleRewardEntrance() {
			this.loading = true
			this.loading = false
		},

		handleParams() {
			const data = JSON.parse(JSON.stringify(this.formData))
			return data
		},

		submitForm() {
			console.log('1111111', this.list)
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

		resetForm() {
			this.localVisible = false
		},

		handleAward() {
			this.dialogGroupVisible = !this.dialogGroupVisible
		},

		handleBtn() {
			console.log('1111111', this.list)
		},
	},
}
</script>

<style lang="scss" scoped>
.ml10 {
	font-size: 14px;
	margin-right: 20px;
}

.live_name {
	width: 460px;
	line-height: 16px;
}

.skip {
	display: flex;
}

.draggable {
	clear: both;
	width: 100%;

	.wrapper {
		float: left;
		margin-right: 10px;

		.checkbox {
			position: relative;
			width: 100px;
			height: 125px;
		}

		.goods {
			position: absolute;
			top: 0;
			left: 0;
			width: 100px;
			text-align: center;

			&__img {
				width: 100px;
				height: 100px;
			}

			&__name {
				width: 100px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>
