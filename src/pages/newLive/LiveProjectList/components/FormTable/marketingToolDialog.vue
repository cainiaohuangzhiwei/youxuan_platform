<template>
	<div>
		<yx-dialog
			title="编辑营销工具"
			width="600px"
			:visible.sync="visible"
			@before-close="resetForm"
		>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="跳转浮窗" name="jumpTab">
					<yx-form
						ref="form"
						labelWidth="100px"
						:data="dialogData"
						:rules="rules"
						:items.sync="dialogCfg"
						:formAction="dialogAction"
					>
						<template slot="selectCouponList">
							<div>
								<el-button type="text" @click="cutCouponDialog"
									>添加优惠券</el-button
								>
								<div>
									<span
										class="nickname"
										v-for="item in dialogData.selectCouponList"
										:key="item.yxCouponId"
										>{{ item.couponName }}</span
									>
								</div>
							</div>
						</template>
						<template slot="bubbleJumpUrl" slot-scope="scope">
							<span class="adorn">*</span>
							<div class="row">
								<el-input
									v-model="scope.data.bubbleJumpUrl"
									placeholder="小程序路径"
								/>
							</div>
						</template>
					</yx-form>
				</el-tab-pane>
				<el-tab-pane label="抽奖活动" name="luckyDrawTab">
					<yx-form
						ref="form"
						labelWidth="100px"
						:data="luckyData"
						:rules="luckyRules"
						:items.sync="luckyCfg"
						:formAction="luckyAction"
					>
						<template slot="selectLuckyList">
							<div>
								<el-button
									type="primary"
									size="mini"
									icon="el-icon-plus"
									@click="cutLuckyDialog"
									>添加抽奖活动</el-button
								>
								<div class="sel_lucky_list">
									<el-tag
										v-for="(item, index) in luckyData.selectLuckyList"
										:key="index"
										effect="plain"
										:closable="true"
										@close="handleClose(item)"
									>
										{{ item.lotteryActivityName }}
									</el-tag>
								</div>
							</div>
						</template>
						<template slot="luckyDescribe">
							<el-input
								v-model="luckyData.luckyDescribe"
								type="textarea"
								:placeholder="请输入抽奖说明"
								:maxlength="10000"
								rows="8"
							/>
						</template>
					</yx-form>
				</el-tab-pane>
			</el-tabs>
		</yx-dialog>
		<!-- 选择优惠券弹框 S -->
		<selected-coupon-dialog
			:dialogVisible.sync="dialogCouponVisible"
			:selectedList.sync="dialogData.selectCouponList"
		></selected-coupon-dialog>
		<!-- 选择优惠券弹框 E -->
		<!-- 选择抽奖活动弹框 S -->
		<selected-lucky-dialog
			:dialogVisible.sync="dialogLuckyVisible"
			:selectedList.sync="luckyData.selectLuckyList"
			:liveStartTime.sync="itemInfo.planStartTime"
		></selected-lucky-dialog>
		<!-- 选择抽奖活动弹框 E -->
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import selectedCouponDialog from './selectedCouponDialog'
import selectedLuckyDialog from './selectedLuckyDialog'
import { getGroupAndCouponData, getLivePlanById } from '@/api/livePlan'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { editConfiguation } from '@/api/livePlan'
import {
	lotteryActivityGetDetail,
	lotteryActivitySave,
} from '@/api/lotteryTools'

export default {
	components: {
		YxDialog,
		YxForm,
		selectedCouponDialog,
		selectedLuckyDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			dialogCouponVisible: false, // 选择优惠券弹框开关
			dialogLuckyVisible: false, // 选择抽奖弹框开关
			selectedList: [], // 选择优惠券弹框
			dialogData: {
				selectCouponList: [],
				couponName: '', // 优惠券名称
				bubbleIcon: [], // 气泡图标
				bubbleJumpType: '0', // 气泡跳转路径
				bubbleJumpUrl: '', // 气泡跳转路径-小程序
			},
			dialogAction: [
				// 编辑商品弹框操作项
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._editLiveGoods()
					},
				},
			],
			dialogCfg: [
				{
					type: 'uploadImage',
					title: '气泡图标',
					dataIndex: 'bubbleIcon',
					uploadAttributes: {
						limit: 1,
						imageName: 'bubbleIcon',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'bubbleIcon'),
					},
				},
				{
					type: 'radioMap',
					dataIndex: 'bubbleJumpType',
					title: '气泡跳转路径',
					change: (bubbleJumpType) => {
						this.handleBubbleJumpType(bubbleJumpType)
					},
					options: {
						不跳: '0',
						优惠券: '1',
						小程序: '2',
					},
				},
				{
					type: 'custom',
					title: '优惠券',
					hide: true,
					dataIndex: 'selectCouponList',
				},
				{
					type: 'custom',
					title: '小程序',
					hide: true,
					dataIndex: 'bubbleJumpUrl',
				},
			],
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
			rules: {
				// bubbleIcon: [
				// 	{ required: true, message: '请上传气泡图标', trigger: 'change' },
				// ],
				// 编辑商品弹框规则
				selectCouponList: [
					{
						validator: (rule, value, callback) => {
							if (!value.length) {
								callback(new Error('请选择优惠券'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				bubbleJumpUrl: [
					{
						validator: (rule, value, callback) => {
							if (this.dialogData.bubbleJumpType == 2 && !value) {
								callback(new Error('请输入程序路径'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			activeName: 'jumpTab',
			luckyData: {
				selectLuckyList: [], //关联抽奖
				luckyDescribe: '', // 抽奖说明
			},
			luckyCfg: [
				{
					type: 'custom',
					title: '关联抽奖',
					dataIndex: 'selectLuckyList',
				},
				{
					type: 'custom',
					title: '抽奖说明',
					dataIndex: 'luckyDescribe',
				},
			],
			luckyAction: [
				// 编辑抽奖弹框操作项
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._lotteryActivitySave()
					},
				},
			],
		}
	},
	watch: {
		selectedList() {
			this.dialogData.selectCouponList = this.selectedList
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible && this.itemInfo && this.itemInfo.livePlanId) {
				this.activeName = 'jumpTab'
				this.details()
				this._lotteryActivityGetDetail()
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
	methods: {
		async details() {
			this.dialogData.bubbleIcon = this.itemInfo.bubbleIcon
				? [{ bubbleIcon: this.itemInfo.bubbleIcon }]
				: []
			this.dialogData.bubbleJumpType = this.itemInfo.bubbleJumpType.toString()
			if (this.itemInfo.bubbleJumpType == 1) {
				// 优惠券
				this._getLivePlanById()
			} else if (this.itemInfo.bubbleJumpType == 2) {
				// 小程序
				this.dialogData.bubbleJumpUrl = this.itemInfo.bubbleJumpUrl
			}
			this.dialogCfg[2].hide =
				this.dialogData.bubbleJumpType == 1 ? false : true
			this.dialogCfg[3].hide =
				this.dialogData.bubbleJumpType == 2 ? false : true
		},
		async _getLivePlanById() {
			const {
				data: { resultCode, resultData },
			} = await getLivePlanById({
				livePlanId: this.itemInfo.livePlanId,
			})
			if (resultCode == 0) {
				this.dialogData.selectCouponList = resultData.livePlanCouponVo.livePlanCouponList.map(
					(item) => {
						return {
							yxCouponId: item.yxCouponId,
							couponName: item.couponName,
						}
					}
				)
			}
		},
		async _editLiveGoods() {
			// 编辑保存营销工具
			const flag = {}
			if (this.dialogData.bubbleIcon.length > 0) {
				const len = Object.keys(this.dialogData.bubbleIcon[0]).length
				if (len == 1 && this.dialogData.bubbleIcon[0].bubbleIcon) {
					flag.imageUrl = {
						imageUrl: this.dialogData.bubbleIcon[0].bubbleIcon,
					}
				} else {
					flag.imageUrl = this.dialogData.bubbleIcon[0]
				}
			}

			const coupons = this.dialogData.selectCouponList.map((item) => {
				return {
					couponId: item.yxCouponId,
					couponName: item.couponName,
				}
			})
			const paramJson = {
				livePlanId: this.itemInfo.livePlanId,
				bubbleIcon:
					this.dialogData.bubbleIcon.length === 0
						? null
						: flag.imageUrl.bubbleIcon,
				bubbleJumpType: this.dialogData.bubbleJumpType,
			}

			if (paramJson.bubbleJumpType == 1) {
				paramJson.coupons = coupons
			} else if (paramJson.bubbleJumpType == 2) {
				paramJson.bubbleJumpUrl = this.dialogData.bubbleJumpUrl || ''
			}

			const {
				data: { resultMsg, resultCode },
			} = await editConfiguation(paramJson)
			this.$message({
				message: resultMsg,
				type: resultCode == 0 ? 'success' : 'warning',
			})
			if (resultCode == 0) {
				this.resetForm()
				this.$emit('updateList')
			}
		},
		async _lotteryActivityGetDetail() {
			const {
				data: { resultCode, resultData },
			} = await lotteryActivityGetDetail({
				livePlanId: this.itemInfo.livePlanId,
			})
			if (resultCode == 0) {
				this.luckyData.selectLuckyList = resultData.lotteryActivityRefList || []
				this.luckyData.luckyDescribe = resultData.description || ''
				this.luckyData.livePlanLotteryActivityDescId =
					resultData.livePlanLotteryActivityDescId || ''
			}
		},
		async _lotteryActivitySave() {
			// 编辑保存抽奖活动
			const lotteryActivityDTOList = this.luckyData.selectLuckyList.map(
				(item) => {
					return {
						lotteryActivityId: item.lotteryActivityId,
						lotteryActivityName: item.lotteryActivityName,
					}
				}
			)
			const paramJson = {
				livePlanId: this.itemInfo.livePlanId,
				livePlanLotteryActivityDescId: this.luckyData
					.livePlanLotteryActivityDescId,
				description: this.luckyData.luckyDescribe,
				lotteryActivityDTOList: lotteryActivityDTOList,
			}

			const {
				data: { resultMsg, resultCode },
			} = await lotteryActivitySave(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.resetForm()
				this.$emit('updateList')
			}
		},
		resetForm() {
			this.visible = false
			this.selectedList = []
			this.dialogData = {
				selectCouponList: [],
				couponName: '', // 优惠券名称
				bubbleIcon: [], // 气泡图标
				bubbleJumpType: '0', // 气泡跳转路径
				bubbleJumpUrl: '', // 气泡跳转路径-小程序
			}
			this.luckyData = {
				selectLuckyList: [],
				luckyDescribe: '',
				livePlanLotteryActivityDescId: '',
			}
		},
		cutCouponDialog() {
			// 切换选择优惠券弹框
			this.dialogCouponVisible = true
		},
		async _getGroupAndCouponData(livePlanId) {
			let {
				data: { resultData },
			} = await getGroupAndCouponData({
				livePlanId,
			})

			if (resultData) {
				if (
					Array.isArray(resultData.bubbleIcon) &&
					resultData.bubbleIcon.length > 0
				) {
					resultData.bubbleIcon = [
						{
							bubbleIcon: getSmallImg(resultData.bubbleIcon[0].bubbleIcon),
						},
					]
				} else if (
					resultData.bubbleIcon &&
					typeof resultData.bubbleIcon == 'string'
				) {
					resultData.bubbleIcon = [
						{
							bubbleIcon: getSmallImg(resultData.bubbleIcon),
						},
					]
				}

				this.dialogData = {
					bubbleIcon: resultData.bubbleIcon || [],
					bubbleJumpUrl: resultData.bubbleJumpUrl,
					bubbleJumpType: resultData.bubbleJumpType.toString(),
				}
				this.selectedList =
					this.dialogData.bubbleJumpType == 1 ? resultData.liveCouponVos : []

				if (this.dialogData.bubbleJumpType == 2) {
					this.dialogData.bubbleJumpUrl = resultData.bubbleJumpUrl
				}
			} else {
				this.selectedList = []
				this.dialogData = {
					selectCouponList: [],
					couponName: '', // 优惠券名称
					bubbleIcon: [], // 气泡图标
					bubbleJumpType: '0', // 气泡跳转路径
					bubbleJumpUrl: '', // 气泡跳转路径-小程序
				}
			}
		},
		handleBubbleJumpType(type) {
			// 根据气泡跳转路径控制优惠券和小程序显示
			this.dialogCfg[2].hide = type == 1 ? false : true
			this.dialogCfg[3].hide = type == 2 ? false : true
		},
		async uploadImageHttpRequest(params, key) {
			// 上传气泡图标
			const formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#bubbleImageFrom', imageType: 81 })
			)
			formData.append('file', params.file)
			const {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)

			if (resultCode == 0 && resultData.imageList.length > 0) {
				this.dialogData[key] = resultData.imageList
				this.dialogData[key][0][key] = getSmallImg(
					resultData.imageList[0].imageUrl
				)
			} else {
				this.dialogData[key] = []
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		cutLuckyDialog() {
			// 切换选择抽奖弹框
			this.dialogLuckyVisible = true
		},
		handleClose(obj) {
			// 移除抽奖活动
			let selectLotteryList = this.luckyData.selectLuckyList.map((item) => {
				return item.lotteryActivityId
			})
			this.luckyData.selectLuckyList.splice(
				selectLotteryList.indexOf(obj.lotteryActivityId),
				1
			)
		},
	},
}
</script>

<style lang="scss" scope>
.adorn {
	margin-left: -108px;
	color: #f56c6c;
}

.row {
	display: flex;
	align-items: center;
	margin-top: -30px;

	.width {
		width: 100%;
	}
}

.sel_lucky_list {
	margin-top: 10px;
}

.sel_lucky_list span {
	margin-right: 8px;
}
</style>
