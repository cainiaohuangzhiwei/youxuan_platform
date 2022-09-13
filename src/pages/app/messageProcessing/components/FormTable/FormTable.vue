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
					v-model.trim="formData.title"
					maxlength="60"
					placeholder="请输入消息标题"
				></el-input>
			</template>
			<template #jgPushState>
				<el-switch
					v-model="formData.jgPushState"
					:active-value="1"
					:inactive-value="0"
				>
				</el-switch>
			</template>
			<template #jgPushContent>
				<el-input
					type="textarea"
					v-model.trim="formData.jgPushContent"
					maxlength="200"
					:autosize="{ minRows: 2, maxRows: 4 }"
					placeholder="请输入极光推送通知内容"
				></el-input>
			</template>
			<template #coverImageState>
				<el-switch
					v-model="formData.coverImageState"
					:active-value="1"
					:inactive-value="0"
				>
				</el-switch>
			</template>
			<template #content>
				<UE ref="um" :defaultMsg="information" :name="'ue' + timeOut"></UE>
			</template>
			<template #pageState>
				<el-switch
					v-model="formData.pageState"
					:active-value="1"
					:inactive-value="0"
				>
				</el-switch>
			</template>
			<template #buttonName>
				<el-input
					v-model.trim="formData.buttonName"
					placeholder="请输入按钮名称"
				></el-input>
			</template>
			<template #goodsGroupId>
				<div class="row">
					<el-input v-model="formData.groupName" disabled />
					<el-button type="primary" @click="cutGroupDialog(true)"
						>选择分组</el-button
					>
				</div>
			</template>
			<template #goodsSpecId>
				<div class="row">
					<el-input v-model="formData.goodsName" disabled />
					<el-button type="primary" @click="cutGroupfListDialog(true)"
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
		<!-- 选择分组弹框 S -->
		<selected-group-dialog
			:dialogVisible.sync="dialogGroupVisible"
			:itemInfo.sync="selectedGoodsGroup"
		></selected-group-dialog>
		<!-- 选择分组弹框 S -->
		<selected-group-list-dialog
			:dialogVisible.sync="dialogGroupListVisible"
			:itemInfo.sync="selectedGoodsListGroup"
			:groups.sync="selectedGoodsGroup"
		></selected-group-list-dialog>
	</div>
</template>

<script>
import { getGoodsGroupListByCondition } from '@/api/goodsGroup'
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct'
import YxForm from '@wg-vue-materials/yx-form'
import UE from '@/components/RichText'
import { uploadImageList } from '@/api/image'
import { messageAdd } from '@/api/appMessageCenter'
import { getBigImg } from '@/utils/imageTool'
import selectedGroupDialog from '@/components/groupGoods/selectedGroupDialog'
import selectedGroupListDialog from '@/components/groupGoods/selectedGroupListDialog'
import moment from 'moment'

export default {
	components: {
		YxForm,
		UE,
		selectedGroupDialog,
		selectedGroupListDialog,
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
				goodsSpecId: '',
				goodsName: '',
			},
			information: '',
			fileToUpload: '',
			item: [
				{
					type: 'custom',
					title: '消息标题',
					dataIndex: 'title',
				},
				// {
				// 	type: 'input',
				// 	dataIndex: 'title',
				// 	maxlength: 60,
				// 	title: '消息标题',
				// },
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
				// {
				// 	type: 'textarea',
				// 	dataIndex: 'jgPushContent',
				// 	title: '极光推送通知内容',
				// 	maxlength: 200,
				// 	hide: false,
				// },
				{
					type: 'custom',
					title: '封面图片(327px*94px)',
					dataIndex: 'coverImageState',
				},
				{
					type: 'uploadImage',
					dataIndex: 'coverImage',
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
				// {
				// 	type: 'input',
				// 	dataIndex: 'buttonName',
				// 	title: '按钮名称',
				// 	hide: true,
				// },
				{
					type: 'radioMap',
					dataIndex: 'jumpType',
					title: '跳转页面',
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
					dataIndex: 'goodsSpecId',
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
					options: {
						全C端APP用户: 0,
					},
				},
			],
			loading: false,
			formAction: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						this._messageAdd()
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
				coverImage: [
					{ required: true, message: '请上传图片!', trigger: 'blur' },
				],
				jumpType: [
					{ required: true, message: '请选择跳转页面!', trigger: 'blur' },
				],
				sendTime: [
					{ required: true, validator: validateShowPass, trigger: 'blur' },
				],
				goodsGroupId: [
					{
						required: true,
						message: '请选择分组!',
						trigger: ['blur', 'change'],
					},
				],
				goodsSpecId: [
					{
						required: true,
						message: '请选择商品!',
						trigger: ['blur', 'change'],
					},
				],
				actDiscountId: [
					{
						required: true,
						message: '请选择活动!',
						trigger: ['blur', 'change'],
					},
				],
				reducedActDiscountId: [
					{
						required: true,
						message: '请选择活动!',
						trigger: ['blur', 'change'],
					},
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
		this._getGoodsGroupListByCondition()
		this._getActDiscountListByCondition()
	},
	watch: {
		selectedGoodsGroup() {
			this.selectedGoodsListGroup = {}
			this.formData.goodsGroupId = this.selectedGoodsGroup.goodsGroupId
			this.formData.groupName = this.selectedGoodsGroup.groupName
		},
		selectedGoodsListGroup() {
			this.formData.goodsSpecId = this.selectedGoodsListGroup.goodsSpecId
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
			},
			deep: true,
		},
	},

	methods: {
		beforeAvatarUpload(file) {
			if (!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
				this.$message.warning('格式不对')
				return false
			} else {
				return file
			}
		},
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
		//保存
		async _messageAdd() {
			let paramsData = {
				coverImageState: this.formData.coverImageState,
				jgPushState: this.formData.jgPushState,
				pageState: this.formData.pageState,
				sendType: this.formData.sendType,
				target: this.formData.target,
				title: this.formData.title,
				content: this.$refs.um.editor.getContent(),
			}
			if (this.formData.jgPushState == 1) {
				paramsData.jgPushContent = this.formData.jgPushContent
			}
			if (
				this.formData.coverImageState == 1 &&
				this.formData.coverImage.length
			) {
				paramsData.coverImage = this.formData.coverImage[0].imageUrlTemp
			}
			if (this.formData.pageState == 1) {
				paramsData.buttonName = this.formData.buttonName
				paramsData.jumpType = this.formData.jumpType
			}
			if (this.formData.jumpType == 9) {
				paramsData.goodsGroupId = this.formData.goodsGroupId
				paramsData.groupName = this.formData.groupName
			}
			if (this.formData.jumpType == 17) {
				paramsData.goodsGroupId = this.formData.goodsGroupId
				paramsData.groupName = this.formData.groupName
				paramsData.goodsSpecId = this.formData.goodsSpecId
				paramsData.goodsName = this.formData.goodsName
			}
			if (this.formData.jumpType == 10) {
				paramsData.actDiscountId = this.formData.reducedActDiscountId
			}
			if (this.formData.jumpType == 15) {
				paramsData.actDiscountId = this.formData.actDiscountId
			}
			if (this.formData.sendType == 2) {
				paramsData.sendTime = moment(this.formData.sendTime).valueOf()
			} else {
				paramsData.sendTime = moment().valueOf()
			}
			this.loading = true
			let res = await messageAdd(paramsData)
			this.loading = false
			if (res.data.resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.$router.push({ name: 'AppMessageCenter' })
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
