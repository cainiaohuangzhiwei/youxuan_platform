<template>
	<div class="message">
		<yx-form
			ref="form"
			v-loading="loading"
			labelWidth="140px"
			:items="item"
			:data="formData"
		>
			<template #jgPushState>
				<el-switch
					v-model="formData.jgPushState"
					:active-value="1"
					:inactive-value="0"
					disabled
				>
				</el-switch>
			</template>
			<template #coverImageState>
				<el-switch
					v-model="formData.coverImageState"
					:active-value="1"
					:inactive-value="0"
					disabled
				>
				</el-switch>
			</template>
			<template #content>
				<UE
					ref="um"
					:defaultMsg="information"
					:name="'ue' + messagePlanId"
				></UE>
			</template>
			<template #pageState>
				<el-switch
					v-model="formData.pageState"
					:active-value="1"
					:inactive-value="0"
					disabled
				>
				</el-switch>
			</template>
			<template #goodsGroupId>
				<div class="row">
					<el-input v-model="formData.groupName" disabled />
					<el-button type="primary" disabled @click="cutGroupDialog(true)"
						>选择分组</el-button
					>
				</div>
			</template>
			<template #goodsId>
				<div class="row">
					<el-input v-model="formData.goodsName" disabled />
					<el-button type="primary" disabled @click="cutGroupfListDialog(true)"
						>选择商品</el-button
					>
				</div>
			</template>
			<template #reducedActDiscountId>
				<div class="row">
					<el-select
						class="width"
						v-model="formData.reducedActDiscountId"
						placeholder="请选择"
						disabled
					>
						<el-option
							v-for="(val, key) in item[11].options"
							:key="key"
							:label="key"
							:value="val"
						/>
					</el-select>
				</div>
			</template>
			<template #actDiscountId>
				<div class="row">
					<el-select
						class="width"
						v-model="formData.actDiscountId"
						placeholder="请选择"
						disabled
					>
						<el-option
							v-for="(val, key) in item[12].options"
							:key="key"
							:label="key"
							:value="val"
						/>
					</el-select>
				</div>
			</template>
			<template #sendTime>
				<el-date-picker
					v-model="formData.sendTime"
					disabled
					type="datetime"
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
		</yx-form>
	</div>
</template>

<script>
import { getGoodsGroupListByCondition } from '@/api/goodsGroup'
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct'
import YxForm from '@wg-vue-materials/yx-form'
import UE from '@/components/RichText'
import { uploadImageList } from '@/api/image'
import { messageGet } from '@/api/appMessageCenter'
import { getBigImg } from '@/utils/imageTool'
import moment from 'moment'

export default {
	components: {
		YxForm,
		UE,
	},
	data() {
		return {
			messagePlanId: '',
			selectedGoodsListGroup: {},
			selectedGoodsGroup: {},
			dialogGroupListVisible: false,
			dialogGroupVisible: false,
			startTimeRange: '',
			formData: {
				title: '',
				jgPushState: 1,
				jgPushContent: '',
				coverImageState: 1,
				coverImage: [],
				pageState: 0,
				buttonName: '',
				jumpType: 0,
				sendType: 1,
				sendTime: '',
				target: 0,
				groupName: '',
				goodsGroupId: '',
				actDiscountId: '',
				reducedActDiscountId: '',
				goodsId: '',
				goodsName: '',
				textContent: '',
				pictureUrl: [],
				sort: '',
				visibleType: 0,
				jumpUrl: '',
			},
			information: '',
			fileToUpload: '',
			item: [
				{
					type: 'input',
					dataIndex: 'title',
					disabled: true,
					title: '消息标题',
				},
				{
					type: 'custom',
					title: '极光推送',
					dataIndex: 'jgPushState',
				},
				{
					type: 'textarea',
					dataIndex: 'jgPushContent',
					title: '极光推送通知内容',
					maxlength: 200,
					disabled: true,
					hide: false,
				},
				{
					type: 'custom',
					title: '封面图片(327px*94px)',
					dataIndex: 'coverImageState',
				},
				{
					canNotBeModified: true,
					type: 'uploadImage',
					disabled: true,
					dataIndex: 'coverImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
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
					type: 'input',
					dataIndex: 'buttonName',
					title: '按钮名称',
					hide: true,
					disabled: true,
				},
				{
					type: 'radioMap',
					dataIndex: 'jumpType',
					title: '跳转页面',
					disabled: true,
					hide: true,
					options: {
						首页: 0,
						品牌特卖页: 9,
						商品详情页: 17,
						满折满减专区: 10,
						多件促销专区: 16,
						自定义活动专区: 15,
						领券中心: 8,
					},
				},
				{
					type: 'custom',
					title: '选择分组',
					dataIndex: 'goodsGroupId',
					hide: true,
				},
				{
					type: 'custom',
					title: '选择商品',
					dataIndex: 'goodsId',
					hide: true,
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
					title: '选择活动',
					hide: true,
					dataIndex: 'actDiscountId',
					options: {},
				},
				{
					type: 'radioMap',
					dataIndex: 'sendType',
					title: '发送方式',
					disabled: true,
					options: {
						立即发送: 1,
						定时发送: 2,
					},
				},
				{
					type: 'custom',
					dataIndex: 'sendTime',
					hide: true,
				},
				{
					type: 'radioMap',
					dataIndex: 'target',
					title: '目标对象',
					disabled: true,
					options: {
						全C端APP用户: 0,
					},
				},
			],
			loading: false,
		}
	},
	created() {
		this.messagePlanId = this.$route.query.messagePlanId || ''
	},
	watch: {
		$route: {
			immediate: true,
			deep: true,
			handler(newValue) {
				const ids = newValue.query.messagePlanId || ''
				this.messagePlanId = ids
				if (ids) {
					this._getGoodsGroupListByCondition()
					this._getActDiscountListByCondition()
					this._messageGet(true)
				}
			},
		},
		selectedGoodsGroup() {
			this.formData.goodsGroupId = this.selectedGoodsGroup.goodsGroupId
			this.formData.groupName = this.selectedGoodsGroup.groupName
		},
		selectedGoodsListGroup() {
			this.formData.goodsId = this.selectedGoodsListGroup.goodsId
			this.formData.goodsName = this.selectedGoodsListGroup.goodsName
		},
		formData: {
			handler: function (val) {
				this.item[2].hide = val.jgPushState == 0 ? true : false
				this.item[4].hide = val.coverImageState == 0 ? true : false
				this.item[7].hide = val.pageState == 0 ? true : false
				this.item[8].hide = val.pageState == 0 ? true : false
				this.item[9].hide =
					val.jumpType == 9 || val.jumpType == 17 ? false : true
				this.item[10].hide = val.jumpType == 17 ? false : true
				this.item[11].hide = val.jumpType == 10 ? false : true
				this.item[12].hide = val.jumpType == 15 ? false : true
				this.item[14].hide = val.sendType == 1 ? true : false
				// this.item[9].hide = val.visibleType == 0 ? true : false
				this.formData.sort = val.sort.replace(/[^\d]/g, '')
			},
			deep: true,
		},
	},

	methods: {
		async _getActDiscountListByCondition() {
			// 获取满减活动专区选择列表
			if (JSON.stringify(this.item[11].options) == '{}') {
				let {
					data: { resultData },
				} = await getActDiscountListByCondition({
					openTypeList: ['1', '2'],
				})
				let options = {}
				resultData.actDiscountList.map((item) => {
					let name
					if (item.activeState == 0) {
						name = '（未开始）'
					} else if (item.activeState == 1) {
						name = '（进行中）'
					} else if (item.activeState == 2) {
						name = '（已结束）'
					} else {
						name = '（未知）'
					}
					options[item.actName + name] = item.actDiscountId
				})
				this.item[11].options = options
				if (!resultData.actDiscountList.length) {
					this.formData.reducedActDiscountId = null
				}
			}
		},
		async _getGoodsGroupListByCondition() {
			// 获取活动专区选择列表
			if (JSON.stringify(this.item[12].options) != '{}') {
				return
			}
			const {
				data: { resultData },
			} = await getGoodsGroupListByCondition()
			let options = {}
			resultData.activityAreaList.map((item) => {
				let name
				if (item.activeState == 0) {
					name = '（未开始）'
				} else if (item.activeState == 1) {
					name = '（进行中）'
				} else if (item.activeState == 2) {
					name = '（已结束）'
				} else {
					name = '（未知）'
				}
				options[item.name + name] = item.id
			})
			this.item[12].options = options
		},
		async _messageGet() {
			let paramJson = {
				messagePlanId: this.messagePlanId,
			}
			let res = await messageGet(paramJson)
			if (res.data.resultCode == 0) {
				this.formData.title = res.data.resultData.title || ''
				this.formData.jgPushState = res.data.resultData.jgPushState
				this.formData.jgPushContent = res.data.resultData.jgPushContent || ''
				this.formData.coverImageState = res.data.resultData.coverImageState
				this.formData.pageState = res.data.resultData.pageState
				this.formData.buttonName = res.data.resultData.buttonName || ''
				this.formData.sendType = res.data.resultData.sendType
				this.formData.target = res.data.resultData.target
				this.formData.goodsGroupId = res.data.resultData.goodsGroupId
				this.formData.groupName = res.data.resultData.groupName
				this.formData.goodsId = res.data.resultData.goodsId
				this.formData.goodsName = res.data.resultData.goodsName
				if (res.data.resultData.coverImage) {
					this.formData.coverImage = [
						{
							imageUrl: getBigImg(res.data.resultData.coverImage),
							imageUrlTemp: res.data.resultData.coverImage,
						},
					]
				}
				if (res.data.resultData.jumpType) {
					this.formData.jumpType = res.data.resultData.jumpType
				}
				if (
					res.data.resultData.jumpType == 9 &&
					res.data.resultData.goodsGroupId
				) {
					this.selectedGoodsGroup = {
						goodsGroupId: res.data.resultData.goodsGroupId,
						groupName: res.data.resultData.groupName,
					}
				}
				if (
					res.data.resultData.jumpType == 17 &&
					res.data.resultData.goodsGroupId &&
					res.data.resultData.goodsId
				) {
					this.selectedGoodsGroup = {
						goodsGroupId: res.data.resultData.goodsGroupId,
						groupName: res.data.resultData.groupName,
					}
					this.selectedGoodsListGroup = {
						goodsId: res.data.resultData.goodsId,
						goodsName: res.data.resultData.goodsName,
					}
				}
				if (
					res.data.resultData.jumpType == 10 &&
					res.data.resultData.actDiscountId
				) {
					this.formData.reducedActDiscountId = res.data.resultData.actDiscountId
				}
				if (
					res.data.resultData.jumpType == 15 &&
					res.data.resultData.actDiscountId
				) {
					this.formData.actDiscountId = res.data.resultData.actDiscountId
				}
				if (res.data.resultData.sendTime && res.data.resultData.sendType == 2) {
					this.formData.sendTime = moment(res.data.resultData.sendTime).format(
						'yyyy-MM-DD HH:mm:ss'
					)
				}
				this.information = res.data.resultData.content || 'default'
			}
		},
		cutGroupDialog() {
			this.dialogGroupVisible = true
		},
		cutGroupfListDialog() {
			this.dialogGroupListVisible = true
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
				this.formData.coverImage.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.message .row {
	display: flex;
	align-items: center;
	width: 300px;
	// margin-top: -30px;
	.width {
		width: 100%;
	}
}
</style>
