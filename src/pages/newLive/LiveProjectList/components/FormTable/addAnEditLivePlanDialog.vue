<template>
	<div>
		<yx-dialog
			:width="`800px`"
			v-loading="loading"
			:title="dialogTitle"
			:visible.sync="visible"
		>
			<yx-form
				labelWidth="140px"
				:data="dialogData"
				:rules="rules"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
				<template slot="anchorId" slot-scope="scope">
					<div class="row_flex">
						<el-input
							class="row_input"
							v-model="scope.data.nickname"
							disabled
						></el-input>
						<el-button type="primary" @click="cutAnchorh(true)"
							>添加主播</el-button
						>
					</div>
				</template>
				<template slot="visibleType" slot-scope="scope">
					<div>
						<div class="row_flex">
							<el-radio-group
								@change="visibleTypeChange"
								v-model="scope.data.visibleType"
							>
								<el-radio label="0">全部可见</el-radio>
								<el-radio label="3">仅店主可见</el-radio>
								<el-radio label="1"
									>部分可见
									<el-button type="text" @click="cutUserDialog()"
										>添加用户</el-button
									></el-radio
								>
								<el-radio label="2">批量上传</el-radio>
							</el-radio-group>
						</div>
						<div v-if="scope.data.visibleType == 1">
							<span
								class="nickname"
								v-for="item in userIds"
								:key="item.userId"
								>{{ item.nickname }}</span
							>
						</div>
						<div class="btn" v-if="scope.data.visibleType == 2">
							<el-button class="excel" type="primary" @click="handleDownExcel"
								>下载导入模板</el-button
							>
							<el-upload
								ref="uploadUer"
								:before-upload="beforeUpload"
								accept=".xls,.xlsx"
								:on-remove="onRemove"
								:file-list="fileList"
								:http-request="handleUploadExcel"
							>
								<el-button type="primary">导入EXCEL文件</el-button>
							</el-upload>
						</div>
					</div>
				</template>
				<template slot="makeMoneyRuleExplain" slot-scope="scope">
					<el-input
						type="textarea"
						placeholder="请输入可赚金规则说明"
						v-model="scope.data.makeMoneyRuleExplain"
						rows="5"
						maxlength="4096"
						show-word-limit
					/>
				</template>
			</yx-form>
		</yx-dialog>
		<!-- 添加主播弹框 S -->
		<select-anchor-dialog
			:dialogVisible.sync="dialogAnchorVisible"
			:itemInfo="selectedAnchor"
			@handleSelectedAnchor="handleSelectedAnchor"
		></select-anchor-dialog>
		<!-- 添加主播弹框 E -->
		<!-- 添加用户弹框 S -->
		<selected-user-dialog
			:dialogVisible.sync="dialogUserVisible"
			:userIds.sync="userIds"
		></selected-user-dialog>
		<!-- 添加用户弹框 E -->
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import selectAnchorDialog from './selectAnchorDialog'
import selectedUserDialog from './selectedUserDialog'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import {
	addLivePlan,
	updateLivePlan,
	getLivePlanById,
	uploadUsers,
} from '@/api/livePlan'
import { uploadImageList } from '@/api/image'
import { getSmallImg, getBigImg } from '@/utils/imageTool'
export default {
	components: {
		YxDialog,
		YxForm,
		selectAnchorDialog,
		selectedUserDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 机构
		editItem: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			visible: false,
			selectedAnchor: {}, // 选择的主播
			userIds: [], // 选择用户列表
			dialogAnchorVisible: false,
			dialogUserVisible: false,
			dialogTitle: '新建直播计划',
			anchorType: 0,
			dialogData: {
				livePlanName: '', //直播名称
				subtitle: '', //副标题
				nickname: '', // 主播名称
				anchorId: '', // 主播ID
				planStartTime: '', // 活动开始时间
				planEndTime: '', // 活动结束时间
				expectStartTime: '', // 直播开始时间
				liveProgramImage: [], // 直播栏目图
				shareImage: [], // 直播分享图
				posterImage: [], // 海报分享图
				coverImage: [], // 封面图
				enterImage: [], //入口图
				makeMoneyImage: [], //可赚金配图
				makeMoneyRuleExplain: '', //可赚金规则说明
				liveShareCopywrite: '', // 直播分享文案
				plantTime: ['', ''],
				initialSubscriptions: '', // 初始订阅数
				userIds: [], //部分用户
				visibleType: '0', //是否全部可见：全部可见：0，部分：1，2：批量上传
			},
			rules: {
				livePlanName: [
					{ required: true, message: '请输入副标题', trigger: 'blur' },
				],
				subtitle: [
					{
						required: true,
						message: '请输入直播名称',
						trigger: 'blur',
					},
				],
				anchorId: [{ required: true, message: '请选择主播', trigger: 'blur' }],
				plantTime: [
					{
						validator: (rule, value, callback) => {
							if (!value || !value[0] || !value[1]) {
								callback(new Error('请选择活动计划时间'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				expectStartTime: [
					{ required: true, message: '请直播预计开始时间', trigger: 'blur' },
				],
				shareImage: [
					{
						required: true,
						message: '请上传直播海报封面入口图',
						trigger: 'blur',
					},
				],
				posterImage: [
					{ required: true, message: '请上传海报分享图', trigger: 'blur' },
				],
				// coverImage: [
				// 	{ required: true, message: '请上传封面图', trigger: 'blur' },
				// ],
				// enterImage: [
				// 	{ required: true, message: '请上传入口图', trigger: 'blur' },
				// ],
				liveShareCopywrite: [
					{ required: true, message: '请输入直播分享文案', trigger: 'blur' },
				],
			},
			dialogCfg: [
				{
					type: 'input',
					title: '标题（利益点）',
					dataIndex: 'subtitle',
					maxlength: 12,
					placeholder: '请输入直播名称',
				},
				{
					type: 'input',
					title: '直播名称',
					dataIndex: 'livePlanName',
					maxlength: 12,
					placeholder: '请输入副标题',
				},
				{
					type: 'custom',
					title: '添加主播',
					dataIndex: 'anchorId',
				},
				{
					type: 'time',
					title: '活动计划时间',
					dataIndex: 'plantTime',
					timeAttributes: {
						type: 'datetimerange',
						pickerOptions: {
							disabledDate(time) {
								return time.getTime() < Date.now() - 8.64e7
							},
						},
					},
				},
				{
					title: '直播预计开始时间',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'expectStartTime',
				},
				{
					type: 'uploadImage',
					title: '直播栏目图',
					dataIndex: 'liveProgramImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'liveProgramImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'liveProgramImage'),
					},
				},
				{
					type: 'uploadImage',
					title: '直播海报封面入口图',
					dataIndex: 'posterImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'posterImage',
						httpRequest: (file) =>
							this.uploadPosterImageHttpRequest(file, 'posterImage', 3072),
					},
				},
				{
					type: 'uploadImage',
					title: '直播分享图',
					dataIndex: 'shareImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'shareImage',
						httpRequest: (file) =>
							this.uploadShareImageHttpRequest(file, 'shareImage', 3072),
					},
				},
				// {
				// 	type: 'uploadImage',
				// 	title: '封面图',
				// 	dataIndex: 'coverImage',
				// 	uploadAttributes: {
				// 		limit: 1,
				// 		imageName: 'coverImage',
				// 		httpRequest: (file) =>
				// 			this.uploadImageHttpRequest(file, 'coverImage', 500),
				// 	},
				// },
				// {
				// 	type: 'uploadImage',
				// 	title: '入口图',
				// 	dataIndex: 'enterImage',
				// 	uploadAttributes: {
				// 		limit: 1,
				// 		imageName: 'enterImage',
				// 		httpRequest: (file) =>
				// 			this.uploadImageHttpRequest(file, 'enterImage', 500),
				// 	},
				// },
				{
					type: 'uploadImage',
					title: '可赚金配图',
					dataIndex: 'makeMoneyImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'makeMoneyImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'makeMoneyImage', 500),
					},
				},
				{
					type: 'custom',
					title: '可赚金规则说明',
					dataIndex: 'makeMoneyRuleExplain',
				},
				{
					type: 'input',
					title: '直播分享文案',
					dataIndex: 'liveShareCopywrite',
				},
				{
					type: 'inputNumber',
					dataIndex: 'initialSubscriptions',
					title: '初始订阅数',
					maxlength: 6,
				},
				{
					type: 'custom',
					title: '可见范围',
					dataIndex: 'visibleType',
				},
			],
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveLivePlan()
					},
				},
			],
			fileList: [],
		}
	},
	methods: {
		async saveLivePlan() {
			// 新增\修改直播计划
			let paramJson = Object.assign({}, this.dialogData)
			let newTime = new Date().getTime()
			if (
				paramJson.liveProgramImage &&
				paramJson.liveProgramImage[0] &&
				paramJson.liveProgramImage[0].imageId
			) {
				paramJson.liveProgramImage = JSON.stringify(
					paramJson.liveProgramImage[0]
				)
			} else if (paramJson.liveProgramImage.length == 0) {
				paramJson.liveProgramImage = ''
			} else {
				delete paramJson.liveProgramImage
			}
			if (paramJson.shareImage[0].imageId) {
				paramJson.shareImage = JSON.stringify(paramJson.shareImage[0])
			} else {
				delete paramJson.shareImage
			}
			if (paramJson.posterImage[0].imageId) {
				paramJson.posterImage = JSON.stringify(paramJson.posterImage[0])
				paramJson.coverImage = paramJson.posterImage
				paramJson.enterImage = paramJson.posterImage
			} else {
				delete paramJson.posterImage
				delete paramJson.coverImage
				delete paramJson.enterImage
			}
			// if (paramJson.coverImage[0].imageId) {
			// 	paramJson.coverImage = JSON.stringify(paramJson.coverImage[0])
			// } else {
			// 	delete paramJson.coverImage
			// }
			// if (paramJson.enterImage[0].imageId) {
			// 	paramJson.enterImage = JSON.stringify(paramJson.enterImage[0])
			// } else {
			// 	delete paramJson.enterImage
			// }
			if (
				Array.isArray(paramJson.makeMoneyImage) &&
				paramJson.makeMoneyImage.length === 0
			) {
				paramJson.makeMoneyImage = ''
			} else if (
				paramJson.makeMoneyImage &&
				paramJson.makeMoneyImage[0].imageId
			) {
				paramJson.makeMoneyImage = JSON.stringify(paramJson.makeMoneyImage[0])
			} else {
				delete paramJson.makeMoneyImage
			}
			paramJson.planStartTime = moment(paramJson.plantTime[0]).valueOf()
			paramJson.planEndTime = moment(paramJson.plantTime[1]).valueOf()
			paramJson.expectStartTime = moment(paramJson.expectStartTime).valueOf()
			paramJson.groupId = 2
			if (paramJson.expectStartTime <= newTime) {
				this.$message.warning({ message: '直播开始时间要大于当前时间' })
				return
			}
			if (
				!(
					paramJson.expectStartTime > paramJson.planStartTime &&
					paramJson.expectStartTime < paramJson.planEndTime
				)
			) {
				this.$message.warning({
					message: '直播开始时间需大于活动开始时间，小于活动结束时间',
				})
				return
			}
			if (
				paramJson.visibleType != 0 &&
				paramJson.visibleType != 3 &&
				paramJson.userIds &&
				!paramJson.userIds.length
			) {
				this.$message.warning({
					message: paramJson.visibleType == 1 ? '请添加用户' : '请上传文件',
				})
				return
			}
			if (paramJson.visibleType == 0) {
				delete paramJson.userIds
			}
			if (
				paramJson.initialSubscriptions &&
				paramJson.initialSubscriptions.length > 6
			) {
				this.$message({
					message: '初始订阅数最多只支持6位数',
					type: 'warning',
				})
				return
			}
			this.loading = true
			let res = null
			console.log('paramJson', paramJson)
			if (paramJson.livePlanId) {
				res = await updateLivePlan(paramJson)
			} else {
				res = await addLivePlan(paramJson)
			}
			if (res.data.resultCode == 0) {
				this.$message({
					message: res.data.resultMsg,
					type: 'success',
				})
				this.visible = false
				this.$emit('updateList')
			}
			this.loading = false
		},
		visibleTypeChange(type) {
			if (type == 1) {
				this.cutUserDialog()
			} else if (type == 2) {
				this.userIds = []
			}
		},
		onRemove() {
			this.dialogData.filename = ''
			this.userIds = []
		},
		cutUserDialog() {
			// 添加用户弹框
			this.dialogData.visibleType = '1'
			this.dialogUserVisible = true
		},
		cutAnchorh() {
			// 选择主播弹框
			this.dialogAnchorVisible = true
		},
		async uploadImageHttpRequest(params, key, maxSize) {
			const size = params.file.size

			if (maxSize && size >= 1024 * maxSize) {
				this.$message.warning(`图片大小不超过${maxSize}K`)
				this.dialogData[key] = []
				return
			}

			//上传海报
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addImageFrom_goods', imageType: 81 })
			)
			formData.append('file', params.file)
			let {
				data: { resultData },
			} = await uploadImageList(formData)
			this.dialogData[key] = resultData.imageList
			this.dialogData[key][0][key] = getSmallImg(
				resultData.imageList[0].imageUrl
			)
		},
		async uploadPosterImageHttpRequest(params, key, maxSize) {
			const size = params.file.size

			try {
				const img = await this.uploadImageInfo(params.file)
				const flag = img.height == 750 && img.width == 750
				if (!flag) {
					this.$message.warning('图片的长为750，宽为750')
					this.dialogData[key] = []
					return
				}
			} catch (err) {
				this.$message.warning('图片加载失败')
				this.dialogData[key] = []
				return
			}

			if (maxSize && size >= 1024 * maxSize) {
				this.$message.warning(`图片大小不超过3m`)
				this.dialogData[key] = []
				return
			}

			this.uploadImageHttpRequest(params, key)
		},
		async uploadShareImageHttpRequest(params, key, maxSize) {
			const size = params.file.size

			try {
				const img = await this.uploadImageInfo(params.file)
				const scale = img.height / img.width
				if (scale != 0.8) {
					this.$message.warning('图片大小比例（长/宽）为4:5')
					this.dialogData[key] = []
					return
				}
			} catch (err) {
				this.$message.warning('图片加载失败')
				this.dialogData[key] = []
				return
			}

			if (maxSize && size >= 1024 * maxSize) {
				this.$message.warning(`图片大小不超过3m`)
				this.dialogData[key] = []
				return
			}

			this.uploadImageHttpRequest(params, key)
		},
		uploadImageInfo(file) {
			return new Promise((resolve, reject) => {
				let _URL = window.URL || window.webkitURL
				let img = new Image()
				img.onload = function () {
					resolve(img)
				}
				img.onerror = function () {
					reject(new Error('image onerror'))
				}
				img.src = _URL.createObjectURL(file)
			})
		},
		async _getLivePlanById(livePlanId) {
			// 获取直播详情
			let {
				data: { resultData },
			} = await getLivePlanById({
				livePlanId,
			})
			resultData.liveProgramImage = resultData.liveProgramImage
				? [
						{
							liveProgramImage: getBigImg(resultData.liveProgramImage),
						},
				  ]
				: []
			resultData.shareImage = [
				{
					shareImage: getBigImg(resultData.shareImage),
				},
			]
			resultData.posterImage = [
				{
					posterImage: getBigImg(resultData.posterImage),
				},
			]
			resultData.coverImage = [
				{
					coverImage: getBigImg(resultData.coverImage),
				},
			]
			resultData.enterImage = [
				{
					enterImage: getBigImg(resultData.enterImage),
				},
			]
			if (resultData.makeMoneyImage) {
				resultData.makeMoneyImage = [
					{
						makeMoneyImage: getBigImg(resultData.makeMoneyImage),
					},
				]
			}
			resultData.visibleType = resultData.visibleType + ''
			resultData.plantTime = [resultData.planStartTime, resultData.planEndTime]
			if (resultData.visibleType == 1) {
				this.userIds = resultData.userName || []
			}
			this.selectedAnchor = {
				nickname: resultData.nickname,
				userId: resultData.anchorId,
			}
			if (resultData.filename) {
				this.fileList = [
					{
						name: resultData.filename,
					},
				]
			}
			this.dialogData = resultData
		},
		handleDownExcel() {
			// 下载Excel模板
			downloadFile(`/excel/platform/导入部分用户模板.xlsx`)
		},
		beforeUpload(file) {
			console.log(file)
			this.fileList = []
			this.fileList.push(file)
		},
		async handleUploadExcel(file) {
			// 导入EXCEL文件
			const formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ timeStamp: new Date().getTime(), groupId: 2 })
			)
			formData.append('formId', '#uploadUsersFrom')
			formData.append('fileToUpload', file.file)
			const {
				data: { resultCode, resultData },
			} = await uploadUsers(formData)
			if (resultCode == 0) {
				this.dialogData.filename = file.file.name
				this.dialogData.userIds = resultData.userIds
			} else {
				this.fileList = []
			}
		},
		handleSelectedAnchor(val) {
			this.anchorType = val.type
			this.dialogData.nickname = val.nickName
			this.dialogData.anchorId = val.anchorId
		},
	},
	watch: {
		userIds() {
			this.dialogData.userIds = this.userIds.map((item) => {
				return item.userId
			})
			console.log('1111', this.dialogData.userIds)
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			this.fileList = []
			if (this.visible) {
				if (this.editItem && this.editItem.livePlanId) {
					this.dialogTitle = '编辑直播计划'
					this._getLivePlanById(this.editItem.livePlanId)
				} else {
					this.dialogTitle = '新建直播计划'
					this.userIds = []
					this.anchorType = 0
					this.dialogData = {
						livePlanName: '', //直播名称
						nickname: '', // 主播名称
						anchorId: '', // 主播ID
						planStartTime: '', // 活动开始时间
						planEndTime: '', // 活动结束时间
						expectStartTime: '', // 直播开始时间
						liveProgramImage: [], // 直播栏目图
						shareImage: [], // 直播分享图
						posterImage: [], // 海报分享图
						coverImage: [], // 封面图
						enterImage: [], //入口图
						makeMoneyImage: [], //可赚金配图
						makeMoneyRuleExplain: '', //可赚金规则说明
						liveShareCopywrite: '', // 直播分享文案
						plantTime: ['', ''],
						initialSubscriptions: '', // 初始订阅数
						userIds: [], //部分用户
						visibleType: '0', //是否全部可见：全部可见：0，部分：1
					}
				}
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

<style lang="scss">
.row_flex {
	display: flex;
	align-items: center;
}
.row_input {
	margin-right: 20px;
}
.nickname {
	margin-right: 10px;
	margin-bottom: 10px;
}
.btn {
	display: flex;
}
.excel {
	height: 32px;
	margin: 1px 10px 0 0;
}
</style>
