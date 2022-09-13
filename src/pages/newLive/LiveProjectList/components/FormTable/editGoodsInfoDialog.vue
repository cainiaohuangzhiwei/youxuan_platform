<template>
	<div>
		<yx-dialog title="编辑商品信息" :visible.sync="visible">
			<yx-form
				labelWidth="100px"
				:data="dialogData"
				:rules="rules"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
				<template slot="goodsGroupId" slot-scope="scope">
					<span class="adorn">*</span>
					<div class="row">
						<el-input v-model="scope.data.groupName" disabled />
						<el-button type="primary" @click="cutGroupDialog(true)"
							>选择分组</el-button
						>
					</div>
				</template>
				<template slot="actDiscountId" slot-scope="scope">
					<span class="adorn">*</span>
					<div class="row">
						<el-select
							class="width"
							v-model="scope.data.actDiscountId"
							placeholder="请选择"
						>
							<el-option
								v-for="(val, key) in dialogCfg[2].options"
								:key="key"
								:label="key"
								:value="val"
							/>
						</el-select>
					</div>
				</template>
				<template slot="reducedActDiscountId" slot-scope="scope">
					<span class="adorn">*</span>
					<div class="row">
						<el-select
							class="width"
							v-model="scope.data.reducedActDiscountId"
							placeholder="请选择"
						>
							<el-option
								v-for="(val, key) in dialogCfg[3].options"
								:key="key"
								:label="key"
								:value="val"
							/>
						</el-select>
					</div>
				</template>
				<template slot="mallJumpUrl" slot-scope="scope">
					<span class="adorn">*</span>
					<div class="row">
						<el-input
							v-model="scope.data.mallJumpUrl"
							placeholder="小程序路径"
						/>
					</div>
				</template>
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
		</yx-dialog>
		<!-- 选择分组弹框 S -->
		<selected-group-dialog
			:dialogVisible.sync="dialogGroupVisible"
			:itemInfo.sync="selectedGoodsGroup"
		></selected-group-dialog>
		<!-- 选择分组弹框 E -->
		<!-- 选择优惠券弹框 S -->
		<selected-coupon-dialog
			:dialogVisible.sync="dialogCouponVisible"
			:selectedList.sync="selectedList"
		></selected-coupon-dialog>
		<!-- 选择优惠券弹框 E -->
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import selectedGroupDialog from './selectedGroupDialog'
import selectedCouponDialog from './selectedCouponDialog'
import { getGroupAndCouponData, editLiveGoods } from '@/api/livePlan'
import { getGoodsGroupListByCondition } from '@/api/goodsGroup'
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'

export default {
	components: {
		YxDialog,
		YxForm,
		selectedGroupDialog,
		selectedCouponDialog,
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
			dialogGroupVisible: false, // 选择分组弹框开关
			dialogCouponVisible: false, // 选择优惠券弹框开关
			selectedList: [], // 选择优惠券弹框
			selectedGoodsGroup: {},
			dialogData: {
				//编辑商品信息参数
				selectCouponList: [],
				jumpType: '1', //跳转类型：1：分组，2：活动
				goodsGroupId: '', // 分组id
				mallJumpUrl: '', // 小程序路径
				groupName: '', // 分组名称
				actDiscountId: '', // 活动id
				reducedActDiscountId: '', // 满折满减活动id
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
					type: 'radioMap',
					dataIndex: 'jumpType',
					title: '商城跳转',
					change: (jumpType) => {
						this.cutJumpType(jumpType)
					},
					options: {
						品牌特卖: '1',
						自定义活动专区: '2',
						满折满减活动: '3',
						小程序: '4',
					},
				},
				{
					type: 'custom',
					title: '关联分组',
					dataIndex: 'goodsGroupId',
				},
				{
					type: 'custom',
					title: '选择活动',
					hide: true,
					dataIndex: 'actDiscountId',
					options: {},
				},
				{
					type: 'custom',
					title: '选择活动',
					hide: true,
					dataIndex: 'reducedActDiscountId',
					options: {},
				},
				{
					type: 'custom',
					title: '路径',
					hide: true,
					dataIndex: 'mallJumpUrl',
				},
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
				goodsGroupId: [
					{
						validator: (rule, value, callback) => {
							if (this.dialogData.jumpType == 1 && !value) {
								callback(new Error('请选择分组'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				mallJumpUrl: [
					{
						validator: (rule, value, callback) => {
							if (this.dialogData.jumpType == 4 && !value) {
								callback(new Error('请输入程序路径'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				actDiscountId: [
					{
						validator: (rule, value, callback) => {
							if (this.dialogData.jumpType == 2 && !value) {
								callback(new Error('请选择活动'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				reducedActDiscountId: [
					{
						validator: (rule, value, callback) => {
							if (this.dialogData.jumpType == 3 && !value) {
								callback(new Error('请选择活动'))
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
		}
	},
	watch: {
		selectedList() {
			this.dialogData.selectCouponList = this.selectedList
		},
		selectedGoodsGroup() {
			this.dialogData.goodsGroupId = this.selectedGoodsGroup.goodsGroupId
			this.dialogData.groupName = this.selectedGoodsGroup.groupName
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible && this.itemInfo && this.itemInfo.livePlanId) {
				this._getGroupAndCouponData(this.itemInfo.livePlanId)
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
	methods: {
		async _editLiveGoods() {
			// 编辑保存商品信息
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

			const couponIds = this.dialogData.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			const paramJson = {
				livePlanId: this.itemInfo.livePlanId,
				jumpType: this.dialogData.jumpType,
				bubbleIcon:
					this.dialogData.bubbleIcon.length === 0
						? null
						: JSON.stringify(flag.imageUrl),
				bubbleJumpType: this.dialogData.bubbleJumpType,
			}

			if (paramJson.jumpType == 1) {
				paramJson.goodsGroupId = this.dialogData.goodsGroupId
			} else if (paramJson.jumpType == 2) {
				paramJson.actDiscountId = this.dialogData.actDiscountId
			} else if (paramJson.jumpType == 3) {
				paramJson.reducedActDiscountId = this.dialogData.reducedActDiscountId
			} else if (paramJson.jumpType == 4) {
				paramJson.mallJumpUrl = this.dialogData.mallJumpUrl
			}

			if (paramJson.bubbleJumpType == 1) {
				paramJson.couponIds = couponIds
			} else if (paramJson.bubbleJumpType == 2) {
				paramJson.bubbleJumpUrl = this.dialogData.bubbleJumpUrl || ''
			}

			const {
				data: { resultMsg, resultCode },
			} = await editLiveGoods(paramJson)
			this.$message({
				message: resultMsg,
				type: resultCode == 0 ? 'success' : 'warning',
			})
			this.visible = false
			this.$emit('updateList')
		},
		cutCouponDialog() {
			// 切换选择优惠券弹框
			this.dialogCouponVisible = true
		},
		cutGroupDialog() {
			this.dialogGroupVisible = true
		},
		async _getActDiscountListByCondition() {
			// 获取满减活动专区选择列表
			if (JSON.stringify(this.dialogCfg[3].options) == '{}') {
				let {
					data: { resultData },
				} = await getActDiscountListByCondition({
					openTypeList: ['1', '2'],
				})
				let options = {}
				resultData.actDiscountList.map((item) => {
					options[item.actName] = item.actDiscountId
				})
				this.dialogCfg[3].options = options
				if (!resultData.actDiscountList.length) {
					this.dialogData.reducedActDiscountId = null
				}
			}
		},
		async _getGoodsGroupListByCondition() {
			// 获取活动专区选择列表
			if (JSON.stringify(this.dialogCfg[2].options) != '{}') {
				return
			}
			const {
				data: { resultData },
			} = await getGoodsGroupListByCondition()
			let options = {}
			resultData.activityAreaList.map((item) => {
				options[item.name] = item.id
			})
			this.dialogCfg[2].options = options
		},
		cutJumpType(jumpType) {
			// 根据商城跳转类型控制活动和分组显示
			this.dialogCfg[1].hide = jumpType == 1 ? false : true
			this.dialogCfg[2].hide = jumpType == 2 ? false : true
			this.dialogCfg[3].hide = jumpType == 3 ? false : true
			this.dialogCfg[4].hide = jumpType == 4 ? false : true
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
					jumpType: resultData.jumpType.toString(),
					mallJumpUrl: resultData.mallJumpUrl,
					goodsGroupId: resultData.goodsGroupId,
					groupName: resultData.goodsGroupName,
					actDiscountId: resultData.actDiscountId,
					bubbleIcon: resultData.bubbleIcon || [],
					bubbleJumpUrl: resultData.bubbleJumpUrl,
					bubbleJumpType: resultData.bubbleJumpType.toString(),
					reducedActDiscountId: resultData.reducedActDiscountId,
				}
				this.selectedList =
					this.dialogData.bubbleJumpType == 1 ? resultData.liveCouponVos : []

				if (this.dialogData.bubbleJumpType == 2) {
					this.dialogData.bubbleJumpUrl = resultData.bubbleJumpUrl
				}

				this.dialogCfg[7].hide =
					this.dialogData.bubbleJumpType == 1 ? false : true
				this.dialogCfg[8].hide =
					this.dialogData.bubbleJumpType == 2 ? false : true

				if (resultData.jumpType == 1) {
					this.selectedGoodsGroup = {
						goodsGroupId: resultData.goodsGroupId,
						groupName: resultData.goodsGroupName,
					}
				} else if (resultData.jumpType == 3) {
					this.dialogCfg[3].placeholder = resultData.reducedActName
				}
			} else {
				this.selectedList = []
				this.dialogData = {
					selectCouponList: [],
					jumpType: '1', //跳转类型：1：分组，2：活动
					goodsGroupId: '', // 分组id
					mallJumpUrl: '', // 小程序路径
					groupName: '', // 分组名称
					actDiscountId: '', // 活动id
					reducedActDiscountId: '', // 满折满减活动id
					couponName: '', // 优惠券名称
					bubbleIcon: [], // 气泡图标
					bubbleJumpType: '0', // 气泡跳转路径
					bubbleJumpUrl: '', // 气泡跳转路径-小程序
				}
			}
			this._getGoodsGroupListByCondition()
			this._getActDiscountListByCondition()
			let jumpType = (resultData && resultData.jumpType) || '1'
			this.cutJumpType(jumpType)
		},
		handleBubbleJumpType(type) {
			// 根据气泡跳转路径控制优惠券和小程序显示
			this.dialogCfg[7].hide = type == 1 ? false : true
			this.dialogCfg[8].hide = type == 2 ? false : true
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
</style>
