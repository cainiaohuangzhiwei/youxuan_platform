<template>
	<div class="activityList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData103"
				:items="formCfg103"
				:formAction="formAction103"
			>
			</yx-form>
			<div class="goods-group-btn-box">
				<el-button v-auth="'addActivity'" @click="addActivity" type="primary"
					>新增弹窗</el-button
				>
			</div>
			<yx-table
				v-loading="loading"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			>
				<template slot="actState" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="curTime < scope.row.startTime"
							>未开始</el-tag
						>
						<el-tag type="info" v-if="curTime > scope.row.endTime"
							>已结束</el-tag
						>
						<el-tag
							v-if="
								curTime >= scope.row.startTime && curTime <= scope.row.endTime
							"
							>进行中</el-tag
						>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
			>
				<yx-form
					ref="dialog106"
					labelWidth="100px"
					:data="formData106"
					:items="formCfg106"
					:rules="formRules106"
				>
					<template slot="goodsGroup">
						<el-autocomplete
							placeholder="请选择会场"
							v-model="formData106.groupName"
							:fetch-suggestions="querySearchAsync"
							@select="changeGoodsGroup"
							class="input-with-select"
						>
							<el-button
								@click="showDialog101"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
					<template slot="registrationTime">
						<el-radio-group
							class="registration-time-box"
							v-model="formData106.registrationTime"
							@change="registrationTimeChange"
						>
							<el-radio class="registration-time-item" :label="0"
								>全部</el-radio
							>
							<el-radio class="registration-time-item" :label="1">
								注册后<el-input
									style="width: 50px"
									v-model="formData106.startDay"
									@focus="registrationTimeFocus(1)"
								></el-input
								>到<el-input
									style="width: 50px"
									v-model="formData106.endDay"
									@focus="registrationTimeFocus(1)"
								></el-input
								>天
							</el-radio>
							<el-radio class="registration-time-item" :label="2">
								<el-date-picker
									v-model="formData106.registeredStartTime"
									type="datetime"
									style="width: 160px"
									placeholder="开始时间"
									@focus="registrationTimeFocus(2)"
									default-time="00:00:00"
								>
								</el-date-picker>
								-
								<el-date-picker
									v-model="formData106.registeredEndTime"
									type="datetime"
									style="width: 160px"
									:picker-options="pickerOptions"
									@focus="registrationTimeFocus(2)"
									placeholder="结束时间"
									default-time="23:59:59"
								>
								</el-date-picker>
							</el-radio>
							<el-radio class="registration-time-item" :label="3"
								>升级正式店主<el-input
									style="width: 50px"
									@focus="registrationTimeFocus(3)"
									v-model="formData106.startTrationTime"
								></el-input
								>到<el-input
									style="width: 50px"
									@focus="registrationTimeFocus(3)"
									v-model="formData106.endTrationTime"
								></el-input
								>天</el-radio
							>
						</el-radio-group>
					</template>
					<template slot="upload">
						<div>
							<div class="upload-box">
								<el-button
									@click="handleDownExcel"
									class="template"
									type="primary"
									>下载模板</el-button
								>
								<el-upload
									:before-upload="beforeUpload"
									:file-list="fileList"
									ref="uploadUser"
									:http-request="uploadHttpRequest"
								>
									<el-button slot="trigger" class="mr20" icon="el-icon-plus">
										添加文件
									</el-button>
								</el-upload>
							</div>
							<div v-if="userIds.length">
								<p v-for="(item, index) in userIds" :key="index">
									用户ID:{{ item }}
								</p>
							</div>
						</div>
					</template>
					<template slot="sortTip">
						<div class="sort-tip">
							排序值用于同一时间向同一用户展示的优先级判断，只能输入0或正整数，
							最大可输入999999，排序值大的优先级高
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle101"
				:visible.sync="dialogVisible101"
				:width="dialogWidth101"
				:bottomBtn="dialogBottomBtn101"
			>
				<yx-form
					:inline="true"
					:data="formData123"
					:items="formCfg123"
					:formAction="formAction123"
				>
				</yx-form
				><yx-table
					v-loading="loading102"
					:columns="tableColumns102"
					:pagination="page102"
					:data="tableData102"
				>
					<template slot="goodsSpecId" slot-scope="scope">
						<el-radio
							v-model="formData106.goodsGroupId"
							:label="scope.row.goodsGroupId"
							@change="changeGoodsGroup(scope.row)"
							>选择</el-radio
						>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	getActivityList,
	updateActivity,
	addActivity,
	openOrCloseActivity,
} from '@/api/yhtPlusCmsActivity'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import {
	getGoodsGroupListByConditionForCMS,
	getGoodsGroupListByCondition,
} from '@/api/goodsGroup'
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct'
import { getDepartmentAmiBaList } from '@/api/cmsOrganizationAdmin'
import { getOrganizationTag } from '@/api/systemConfiguration'
import { importActBannerUserIds } from '@/api/webImport'
import { downloadFile } from '@/utils/helper/common'
import moment from 'moment'
import { debounce } from 'lodash'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			pickerOptions: {
				disabledDate: (time) => {
					return time.getTime() < this.formData106.registeredStartTime
				},
			},
			loading102: false,
			dialogTitle101: '选择品牌',
			dialogWidth101: '90%',
			dialogVisible101: false,
			activityLoading: false, //新增，编辑活动确定按钮加载
			dialogBottomBtn101: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible101 = false
					},
				},
			],
			formData123: {
				groupNameKeyword: '',
			},
			formCfg123: [
				{
					title: '筛选',
					type: 'input',
					dataIndex: 'groupNameKeyword',
					placeholder: '品牌名称',
				},
			],
			formAction123: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData102(true)
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'goodsSpecId',
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					title: '会场名称',
					type: 'string',
					dataIndex: 'brandName',
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			curTime: new Date().getTime(),
			loading: false,
			formData103: {
				activityTitle: '',
				state: '',
			},
			formCfg103: [
				{
					type: 'input',
					title: '弹窗名称',
					dataIndex: 'activityTitle',
					placeholder: '请输入弹窗名称',
				},
				{
					type: 'select',
					title: '弹窗状态',
					dataIndex: 'state',
					placeholder: '请输入弹窗状态',
					label: 'value',
					options: [
						{
							state: '',
							value: '全部',
						},
						{
							state: '1',
							value: '进行中',
						},
						{
							state: '2',
							value: '已结束',
						},
						{
							state: '3',
							value: '未开始',
						},
					],
				},
			],
			formAction103: [
				{
					title: '清空',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData104(true)
						this.dialogGroupVisible = true
					},
					tableId: 104,
				},
			],
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'advActivityId',
					title: '弹窗ID',
				},
				{
					type: 'string',
					dataIndex: 'activityTitle',
					title: '弹窗名称',
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					title: '图片(弹窗图片)',
				},
				{
					type: 'newMap',
					dataIndex: 'userType',
					title: '用户类型',
					options: [
						['1', '全平台'],
						['2', '店主'],
						['3', '买家'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'transitionState',
					title: '跳转链接',
					options: [
						['1', '不跳'],
						['2', '选品列表页'],
						['3', '京东专区'],
						['4', '我的推手'],
						['5', '步数换首页'],
						['6', '砍单专区'],
						['8', '领券中心'],
						['9', '指定品牌'],
						['10', '满减/满折专区'],
						['11', '活动预告'],
						['12', '小程序直播'],
						['13', '加小助手'],
						['15', '活动专区'],
						['16', '多件促销'],
						['17', '邀请好友开店'],
						['18', '小程序'],
					],
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '有效时间',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'actState',
					title: '状态',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'openOrCloseActivity',
							popconfirm: true,
							popconfirmTitle: '确认要删除该弹窗吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._openOrCloseActivity(row)
							},
						},
						{
							title: '编辑',
							auth: 'updateActivity',
							dialogId: 105,
							click: (row) => {
								this.updateActivityInfo(row)
							},
						},
					],
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData104()
				},
			},
			dialogTitle105: '添加弹窗',
			dialogWidth105: '600px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: debounce(
						() => {
							this.$refs.dialog106.$refs.YxForm.validate((valid) => {
								if (valid) {
									// 规则校验通过
									if (!this.activityLoading) {
										this.saveAddActivityList()
									}
									// this.dialogVisible105 = false
								}
							})
						},
						300,
						{
							leading: true,
							trailing: false,
						}
					),
				},
			],
			formData106: {
				activityTitle: '',
				transitionState: '',
				pageUrl: '',
				startTime: '',
				endTime: '',
				userType: '',
				activityImage: [],
			},
			formCfg106: [
				{
					type: 'input',
					title: '活动标题',
					dataIndex: 'activityTitle',
					placeholder: '请输入活动标题',
				},
				{
					type: 'select',
					title: '跳转类型',
					dataIndex: 'transitionState',
					placeholder: '请选择跳转类型',
					label: 'value',
					change: (transitionState) => {
						this.transitionStateChange(transitionState)
					},
					options: [
						{
							value: '不跳',
							transitionState: 1,
						},
						{
							transitionState: 2,
							value: '选品列表页',
						},
						{
							transitionState: 3,
							value: '京东专区',
						},
						{
							transitionState: 4,
							value: '我的推手',
						},
						{
							transitionState: 5,
							value: '步数换首页',
						},
						{
							transitionState: 6,
							value: '砍单专区',
						},
						{
							transitionState: 8,
							value: '领券中心',
						},
						{
							transitionState: 9,
							value: '指定品牌',
						},
						{
							transitionState: 10,
							value: '满减/满折活动专区',
						},
						{
							transitionState: 12,
							value: '小程序直播',
						},
						{
							transitionState: 13,
							value: '加小助手',
						},
						{
							transitionState: 15,
							value: '活动专区',
						},
						{
							transitionState: 16,
							value: '多件促销',
						},
						{
							transitionState: 17,
							value: '邀请好友开店',
						},
						{
							transitionState: 18,
							value: '小程序',
						},
					],
				},
				{
					title: '跳转路径',
					type: 'input',
					dataIndex: 'pageUrl',
					placeholder: '请输入跳转路径',
				},
				{
					title: '选择会场',
					type: 'custom',
					dataIndex: 'goodsGroup',
				},
				{
					title: '选择活动',
					type: 'select',
					dataIndex: 'actDiscountId',
					label: 'actName',
					options: [],
					hide: true,
				},
				{
					title: '有效时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'uploadImage',
					title: '弹窗图片',
					dataIndex: 'activityImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'activityImage',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					title: '用户类型',
					type: 'radio',
					dataIndex: 'userType',
					label: 'value',
					change: (userType) => {
						this.userTypeChange(userType)
					},
					options: [
						{
							value: '平台所有用户',
							userType: 1,
						},
						{
							userType: 2,
							value: '店主',
						},
						{
							userType: 3,
							value: '消费者',
						},
						{
							userType: 4,
							value: '部分用户',
						},
					],
				},
				{
					title: '渠道店主',
					type: 'checkbox',
					dataIndex: 'channelList',
					options: this.$store.state.app.constant.SHOP_CHANNEL_LIST,
					label: 'channelList',
					change: () => {
						this.$forceUpdate()
					},
				},
				{
					title: '分组店主',
					type: 'checkbox',
					dataIndex: 'departmentId',
					options: [],
					label: 'departmentName',
					change: () => {
						this.$forceUpdate()
					},
				},
				// {
				// 	title: '店铺徽章',
				// 	type: 'checkbox',
				// 	dataIndex: 'groupTagId',
				// 	options: [],
				// 	label: 'tagName',
				// 	change: () => {
				// 		this.$forceUpdate()
				// 	},
				// },
				{
					title: '是否加小C',
					type: 'radio',
					dataIndex: 'addSmallC',
					options: [
						{
							value: '是',
							addSmallC: 1,
						},
						{
							value: '否',
							addSmallC: 0,
						},
					],
					label: 'value',
					change: () => {
						this.$forceUpdate()
					},
				},
				{
					type: 'custom',
					dataIndex: 'registrationTime',
					title: '注册时间',
				},
				{
					type: 'custom',
					dataIndex: 'upload',
				},
				{
					title: '排序值',
					type: 'input',
					dataIndex: 'sort',
					placeholder: '最高不超过999999',
				},
				{
					type: 'custom',
					dataIndex: 'sortTip',
					title: '',
				},
			],
			uploadImageList: '/yhtplus/webImport/importCusServiceTrusteeship.action',
			formRules106: {
				activityTitle: [
					{ required: true, message: '请输入活动标题', trigger: 'blur' },
				],
				transitionState: [
					{ required: true, message: '请选择跳转类型', trigger: 'change' },
				],
				pageUrl: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.formData106.transitionState == 18 && !value) {
								callback(new Error('请输入跳转路径!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				userType: [
					{ required: true, message: '请选择用户类型', trigger: 'change' },
				],
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'blur' },
				],
				endTime: [
					{ required: true, message: '请选择结束时间', trigger: 'blur' },
				],
				actDiscountId: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								(this.formData106.transitionState == 10 ||
									this.formData106.transitionState == 15) &&
								!this.formData106.actDiscountId
							) {
								callback(new Error('请选择活动!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				goodsGroup: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.formData106.transitionState == 9 &&
								!this.formData106.goodsGroupId
							) {
								callback(new Error('请选择指定品牌!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				// channelList: [
				// 	{
				// 		required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (
				// 				!this.formData106.channelList.length &&
				// 				this.formData106.userType == 2
				// 			) {
				// 				callback(new Error('请选择渠道店主!'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'change',
				// 	},
				// ],
				activityImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData106.activityImage.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
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
			actDiscountList: [],
			activityAreaList: [],
			fileList: [],
			userIds: [],
		}
	},

	created() {
		this.getData104(true)
		this._getDepartmentAmiBaList()
		this._getOrganizationTag()
	},

	methods: {
		showDialog101() {
			this.getData102(true)
			this.dialogVisible101 = true
		},
		updateActivityInfo(row) {
			this.formData106 = Object.assign({}, row)
			this.formData106.channelList =
				(this.formData106.channelsWay &&
					this.formData106.channelsWay.split(',')) ||
				[]
			this.formData106.departmentId =
				(this.formData106.groupWay &&
					this.formData106.groupWay.split(',').map(Number)) ||
				[]
			if (this.formData106.advActivityOrganization) {
				this.formData106.groupTagId =
					(this.formData106.advActivityOrganization.badge &&
						this.formData106.advActivityOrganization.badge
							.split(',')
							.map(Number)) ||
					[]
				this.formData106.addSmallC =
					(this.formData106.advActivityOrganization &&
						this.formData106.advActivityOrganization.ctag * 1) ||
					0
				this.formData106.registrationTime =
					this.formData106.advActivityOrganization.addType
			} else {
				this.formData106.groupTagId = []
			}
			this.formData106.activityImage = [
				{
					activityImage: getBigImg(row.imageUrl),
				},
			]
			if (this.formData106.registrationTime == 1) {
				this.formData106.startDay =
					this.formData106.advActivityOrganization.startTime > 0
						? this.formData106.advActivityOrganization.startTime
						: ''
				this.formData106.endDay =
					this.formData106.advActivityOrganization.endTime > 0
						? this.formData106.advActivityOrganization.endTime
						: ''
			} else if (this.formData106.registrationTime == 2) {
				this.formData106.registeredStartTime =
					this.formData106.advActivityOrganization.startTime
				this.formData106.registeredEndTime =
					this.formData106.advActivityOrganization.endTime
			} else if (this.formData106.registrationTime == 3) {
				this.formData106.startTrationTime =
					this.formData106.advActivityOrganization.startTime > 0
						? this.formData106.advActivityOrganization.startTime
						: ''
				this.formData106.endTrationTime =
					this.formData106.advActivityOrganization.endTime > 0
						? this.formData106.advActivityOrganization.endTime
						: ''
			}
			this.transitionStateChange(this.formData106.transitionState)
			this.userTypeChange(this.formData106.userType)
			this.dialogVisible105 = true
			this.userIds = row.userIds || []
			this.fileList = []
			this.$nextTick(() => {
				this.$refs.dialog106.$refs.YxForm.clearValidate()
			})
			this.$forceUpdate()
		},
		registrationTimeFocus(registrationTime) {
			this.formData106.registrationTime = registrationTime
			this.registrationTimeChange(registrationTime)
			this.$forceUpdate()
		},
		registrationTimeChange() {
			let groupTagId = null
			this.formCfg106.map((item) => {
				if (item.dataIndex == 'groupTagId') {
					item.options.map((op) => {
						op.disabled =
							this.formData106.registrationTime != 3
								? false
								: op.tagName != '正式'
						if (op.tagName == '正式') {
							groupTagId = op.groupTagId
						}
					})
				}
			})
			if (this.formData106.registrationTime == 3) {
				this.formData106.groupTagId = [groupTagId]
			} else {
				this.formData106.groupTagId = []
			}
			this.$forceUpdate()
		},
		_openOrCloseActivity: async function ({ advActivityId }) {
			let {
				data: { resultCode, resultMsg },
			} = await openOrCloseActivity({ advActivityId, state: 0 })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData104()
			}
		},
		addActivity() {
			this.formData106 = {
				activityTitle: '',
				transitionState: 1,
				pageUrl: '',
				startTime: '',
				endTime: '',
				userType: 1,
				channelList: [],
				departmentId: [],
				groupTagId: [],
				activityImage: [],
				sort: '',
			}
			this.fileList = []
			this.userIds = []
			this.transitionStateChange(1)
			this.userTypeChange(1)
			this.dialogVisible105 = true
		},
		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/platform/导入部分用户模板.xlsx`)
		},
		beforeUpload(files) {
			this.fileList = [files]
		},
		uploadHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ timeStamp: new Date().getTime(), groupId: 2 })
			)
			formData.append('formId', '#excelForm')
			formData.append('excel', params.file)
			const {
				data: { resultCode, resultData },
			} = await importActBannerUserIds(formData)
			if (resultCode == 0) {
				this.userIds = resultData.userIds || []
			}
		},
		_getDepartmentAmiBaList: async function () {
			let {
				data: {
					resultCode,
					resultData: { resultData },
				},
			} = await getDepartmentAmiBaList()
			if (resultCode == 0) {
				this.formCfg106.map((item) => {
					if (item.dataIndex == 'departmentId') {
						item.options = resultData.list
					}
				})
			}
		},
		_getOrganizationTag: async function () {
			let {
				data: { resultCode, resultData },
			} = await getOrganizationTag()
			if (resultCode == 0) {
				this.formCfg106.map((item) => {
					if (item.dataIndex == 'groupTagId') {
						item.options = resultData.groupBadgeList
					}
				})
			}
		},
		userTypeChange(type) {
			this.formCfg106.map((item) => {
				if (
					item.dataIndex == 'channelList' ||
					item.dataIndex == 'departmentId' ||
					item.dataIndex == 'groupTagId' ||
					item.dataIndex == 'addSmallC' ||
					item.dataIndex == 'registrationTime'
				) {
					item.hide = type != 2
				}
				if (item.dataIndex == 'upload') {
					item.hide = type != 4
				}
			})
			if (type == 2 && !this.formData106.registrationTime) {
				this.formData106.registrationTime = 0
			}
			this.$forceUpdate()
		},
		transitionStateChange(state) {
			this.formCfg106.map((item) => {
				if (item.dataIndex == 'pageUrl' || item.dataIndex == 'actDiscountId') {
					item.hide = true
				}
			})
			if (state == 9) {
				this.formData106.goodsGroupId =
					this.formData106.goodsGroupId != -1
						? this.formData106.goodsGroupId
						: ''
			}
			if (state == 10) {
				//满减/满折活动专区
				this.formCfg106.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.hide = false
						item.label = 'actName'
						if (this.actDiscountList.length) {
							item.options = this.actDiscountList
						}
					}
				})
				this.formData106.actDiscountId =
					this.formData106.actDiscountId != -1
						? this.formData106.actDiscountId
						: ''
				if (!this.actDiscountList.length) {
					this._getActDiscountListByCondition()
				}
			} else if (state == 15) {
				// 活动专区
				if (!this.activityAreaList.length) {
					this._getGoodsGroupListByCondition()
				}
				this.formCfg106.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.hide = false
						item.label = 'name'
						if (this.activityAreaList.length) {
							item.options = this.activityAreaList
						}
					}
				})
				this.formData106.actDiscountId =
					this.formData106.actDiscountId != -1
						? this.formData106.actDiscountId
						: ''
			} else if (state == 18) {
				this.formCfg106.map((item) => {
					if (item.dataIndex == 'pageUrl') {
						item.hide = false
					}
				})
			}
		},
		_getGoodsGroupListByCondition: async function () {
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByCondition()
			if (resultCode == 0) {
				resultData.activityAreaList.map((item) => {
					item.actDiscountId = item.id
				})
				this.activityAreaList = resultData.activityAreaList || []
				this.formCfg106.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.options = resultData.activityAreaList
					}
				})
			}
		},
		_getActDiscountListByCondition: async function () {
			let {
				data: { resultCode, resultData },
			} = await getActDiscountListByCondition({
				openTypeList: [1, 2],
			})
			if (resultCode == 0) {
				this.actDiscountList = resultData.actDiscountList || []
				this.formCfg106.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.options = resultData.actDiscountList
					}
				})
			}
		},
		saveAddActivityList: async function () {
			let res = null
			let paramJson = {
				activityTitle: this.formData106.activityTitle,
				transitionState: this.formData106.transitionState,
				userType: this.formData106.userType,
				state: 1,
				startTime: moment(this.formData106.startTime).valueOf(),
				endTime: moment(this.formData106.endTime).valueOf(),
				sort: this.formData106.sort,
			}
			if (this.formData106.activityImage[0].imageId) {
				paramJson.portraitImageData = this.formData106.activityImage[0]
				delete paramJson.portraitImageData.activityImage
				paramJson.portraitImageData = JSON.stringify(
					paramJson.portraitImageData
				)
			}
			if (paramJson.transitionState == 9) {
				paramJson.goodsGroupId = this.formData106.goodsGroupId
			}
			if (paramJson.transitionState == 10) {
				paramJson.actDiscountId = this.formData106.actDiscountId
			}
			if (paramJson.transitionState == 15) {
				paramJson.actDiscountId = this.formData106.actDiscountId
			}
			if (paramJson.transitionState == 18) {
				paramJson.pageUrl = this.formData106.pageUrl
				//去除空格 换行
				paramJson.pageUrl = paramJson.pageUrl.replace(/\s+/g, '')
				paramJson.pageUrl = paramJson.pageUrl.replace(/[\r\n]/g, '')
			}
			if (paramJson.startTime >= paramJson.endTime) {
				this.$message.error('开始时间必须小于结束时间')
				return
			}
			if (paramJson.userType == 2) {
				// 保存渠道店主
				paramJson.channelsWay = this.formData106.channelList.join(',')
				paramJson.groupWay = this.formData106.departmentId.join(',')
				paramJson.badge = this.formData106.groupTagId.join(',')
				if (this.formData106.addSmallC) {
					paramJson.ctag = this.formData106.addSmallC
				}
				paramJson.addType = this.formData106.registrationTime
				if (paramJson.addType == 1) {
					paramJson.ostartTime = this.formData106.startDay
					paramJson.oendTime = this.formData106.endDay
					if (!paramJson.ostartTime) {
						this.$message.error('请输入注册后的开始天数')
						return
					}
					if (!paramJson.oendTime) {
						this.$message.error('请输入注册后的结束天数')
						return
					}
					if (paramJson.ostartTime < 1) {
						this.$message.error('注册后的开始天数不小于1')
						return
					}
					if (paramJson.ostartTime >= paramJson.oendTime) {
						this.$message.error('注册后的开始天数必须小于注册后的结束天数')
						return
					}
				} else if (paramJson.addType == 2) {
					paramJson.ostartTime = moment(
						this.formData106.registeredStartTime
					).valueOf()
					paramJson.oendTime = moment(
						this.formData106.registeredEndTime
					).valueOf()
					if (!paramJson.ostartTime) {
						this.$message.error('请输入注册开始时间')
						return
					}
					if (!paramJson.oendTime) {
						this.$message.error('请输入注册结束时间')
						return
					}
					if (paramJson.ostartTime >= paramJson.oendTime) {
						this.$message.error('注册开始时间必须小于注册结束时间')
						return
					}
				} else if (paramJson.addType == 3) {
					paramJson.ostartTime = this.formData106.startTrationTime
					paramJson.oendTime = this.formData106.endTrationTime
					if (!paramJson.ostartTime) {
						this.$message.error('请输入开始时间')
						return
					}
					if (!paramJson.oendTime) {
						this.$message.error('请输入结束时间')
						return
					}
					if (paramJson.ostartTime >= paramJson.oendTime) {
						this.$message.error('开始时间必须小于结束时间')
						return
					}
				}
			} else if (paramJson.userType == 4) {
				paramJson.userIds = this.userIds
				if (!paramJson.userIds.length) {
					this.$message.error('请导入小程序用户')
					return
				}
			}
			let flag = false
			this.activityLoading = true
			if (this.formData106.advActivityId) {
				paramJson.advActivityId = this.formData106.advActivityId
				res = await updateActivity(paramJson)
			} else {
				flag = true
				res = await addActivity(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible105 = false
				this.getData104(flag)
			}
			this.activityLoading = false
			// this.dialogVisible105 = false
		},
		changeGoodsGroup(row) {
			this.formData106 = Object.assign(this.formData106, row)
		},
		getData102: async function (flag) {
			this.loading102 = true
			let paramJson = this.findSearchParams123(flag)
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.goodsGroupList
				this.page102.count = resultData.goodsGroupCount
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading102 = false
		},
		findSearchParams123(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData123, {
				length: this.page102.length,
				goodsGroupStateList: ['1', '2'],
				goodsType: 1,
				gcategoryList: ['1'],
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
		querySearchAsync: async function (queryString = '', cb) {
			console.log(queryString)
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS({
				goodsGroupStateList: ['1', '2'],
				goodsType: 1,
				gcategoryList: ['1'],
				startIndex: 0,
				length: 20,
				groupNameKeyword: queryString,
			})
			if (resultCode == 0) {
				resultData.goodsGroupList.map((item) => {
					item.value = item.groupName
				})
				cb(resultData.goodsGroupList)
			}
		},
		async uploadImageHttpRequest(params) {
			//上传海报
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({
					formId: '#portraitImageFrom',
					imageType: 34,
					isPng: 'png',
				})
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			console.log(resultCode, resultData)
			if (resultCode == 0) {
				this.formData106.activityImage = resultData.imageList
				this.formData106.activityImage[0].activityImage = getBigImg(
					resultData.imageList[0].imageUrl
				)
				// this.$set(this.formData106, 'activityImage', resultData.imageList)
			}
			this.$forceUpdate()
		},
		async getData104(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await getActivityList(paramJson)
			if (resultCode == 0) {
				resultData.advActivityList.map((item) => {
					item.imageUrl = getBigImg(item.imageUrl)
				})
				this.tableData104 = resultData.advActivityList
				this.page104.count = resultData.count
			} else {
				this.tableData104 = []
				this.page104.count = 0
			}
			this.loading = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData103, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
			})
			return paramJson
		},
	},
}
</script>
<style lang="scss" scope>
.registration-time-box {
	display: flex;
	flex-direction: column;
}
.registration-time-item {
	margin: 6px 0;
}
.upload-box {
	display: flex;
	.template {
		margin-right: 20px;
		height: 32px;
	}
}
.goods-group-btn-box {
	margin-bottom: 20px;
}
.c_image {
	width: 100px;
}
.sort-tip {
	color: #bbbfc5;
}
</style>
