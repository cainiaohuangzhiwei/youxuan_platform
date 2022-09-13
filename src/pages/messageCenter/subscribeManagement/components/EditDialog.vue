<template>
	<div class="heightBrandSet">
		<el-dialog
			width="800px"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="funData"
				:rules="funRules"
				:labelWidth="'110px'"
				:formAction="!forbiddenShow ? funAction : []"
			>
				<template #taskName>
					<el-input
						type="text"
						placeholder="请输入任务内容"
						v-model="funData.taskName"
						:disabled="forbiddenShow"
						maxlength="30"
						show-word-limit
					>
					</el-input>
				</template>
				<!-- // {
				// 	type: 'select',
				// 	title: '推送模板',
				// 	dataIndex: 'templateId',
				// 	disabled: false,
				// 	label: 'value',
				// 	options: this.templateListS,
				// 	selectAttributes: {
				// 		filterMmethod: (val) => {
				// 			this.getQueryTemplateList(val)
				// 		},
				// 	},
				// 	change: (e) => {
				// 		this.changeTemplate(e)
				// 	},
				// }, -->
				<template #templateId>
					<el-select
						:value-key="'templateId'"
						style="width: 100%"
						v-model="funData.templateId"
						clearable
						filterable
						:disabled="forbiddenShow"
						default-first-option
						@change="changeTemplate(e)"
						placeholder="请选择推送模板"
					>
						<el-option
							:disabled="forbiddenShow"
							v-for="item in templateListS"
							:key="item.templateId"
							:label="item.value"
							:value="item.templateId"
						>
						</el-option>
					</el-select>
				</template>

				<template #templateContent>
					<div class="content">
						<div
							class="mb20"
							style="display: flex"
							v-if="funData.channelCode == 'SMS'"
						>
							<label style="width: 80px; font-weight: bold">模板内容：</label>
							<el-input
								style="width: 520px; margin-left: 10px"
								type="textarea"
								:disabled="true"
								:autosize="{ minRows: 2, maxRows: 4 }"
								placeholder="请输入内容"
								v-model="templateContentTextarea"
							>
							</el-input>
						</div>

						<div v-for="(item, index) in templateContentJsonList" :key="index">
							<div v-if="!item.name" style="display: flex">
								<span style="color: #ff4949; margin-right: 4px">*</span>
								<span class="spanText"> {{ item.content }} ：</span>
								<el-input
									class="mb20"
									maxlength="18"
									show-word-limit
									:disabled="forbiddenShow"
									v-if="item.type == 'text'"
									v-model="item.text"
									:placeholder="'请输入' + item.content"
								></el-input>
								<el-date-picker
									v-model="item.time"
									class="mb20"
									style="margin-left: -17px"
									v-if="item.type == 'time'"
									type="datetime"
									:disabled="forbiddenShow"
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
							</div>
							<div v-if="item.name" style="display: flex">
								<span class="spanText"> {{ item.name }} ：</span>
								<el-input
									class="mb20"
									maxlength="18"
									show-word-limit
									:disabled="true"
									v-model="item.value"
								></el-input>
							</div>
						</div>
						<div
							style="display: flex"
							v-if="funData.channelCode != channelMap.SMS"
						>
							<span style="margin-left: 13px" class="spanText">
								跳转链接：</span
							>
							<el-input
								style="margin-left: -4px"
								class="mb20"
								v-model="url"
								:disabled="forbiddenShow"
								:placeholder="'请输入跳转链接'"
							></el-input>
						</div>
					</div>
				</template>
				<template #userTag>
					<el-select
						v-model="userTagValue"
						:disabled="forbiddenShow"
						@change="userTagValueChange"
						placeholder="请选择"
					>
						<el-option
							:disabled="forbiddenShow"
							v-for="item in userTagOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</template>
				<template #sendObject>
					<el-select
						:value-key="userTagValue == 1 ? 'userTagId' : 'id'"
						style="width: 100%"
						v-model="funData.sendObject"
						clearable
						multiple
						filterable
						:disabled="forbiddenShow"
						default-first-option
						placeholder="请选择发送对象"
					>
						<el-option
							:disabled="forbiddenShow"
							v-for="item in userTagList"
							:key="userTagValue == 1 ? item.userTagId : item.id"
							:label="
								userTagValue == 1
									? item.userTagId + '-' + item.tagName
									: item.id + '-' + item.groupName
							"
							:value="item"
						>
						</el-option>
					</el-select>
					<!-- <el-select
						v-if="userTagValue == 2"
						v-model="funData.sendObject"
						style="width: 100%"
						filterable
						multiple
						remote
						clearable
						@focus="_userGroupConfigList"
						:remote-method="_userGroupConfigList"
					>
						<el-option
							:disabled="forbiddenShow"
							v-for="item in userTagList"
							:key="item.id"
							:label="item.id + '-' + item.groupName"
							:value="item"
						>
						</el-option>
					</el-select> -->
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import {
	queryTarget,
	// weixinPushTaskCreate,
	customCreate,
	customUpdate,
} from '@/api/messageCenter'
import { getUserTagList } from '@/api/platformUserGroupTag'
import { userGroupConfigList } from '@/api/scene'

import moment from 'moment'
import { taskStatusMap, channelMap, channelNameMap } from '../type.map'
export default {
	props: {
		forbiddenShow: {
			type: Boolean,
			default: false,
		},
		createTaskShow: {
			type: Number,
			default: null,
		},
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		source: {
			type: String,
			default: '',
		},
		// 单条信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
	},

	data() {
		return {
			channelMap,
			dialogTitle: '',
			templateIdS: '',
			formsDialog: false,
			submitLoading: false,
			templateListS: [],
			templateContentJsonList: [],
			startTimeRange: '',
			templateContentTextarea: '',
			text: '',
			url: '',
			item: [
				{
					type: 'custom',
					title: '任务名称',
					maxlength: 30,
					dataIndex: 'taskName',
					placeholder: '请输入任务名称',
				},
				{
					title: '推送渠道',
					type: 'radio',
					dataIndex: 'channelCode',
					placeholder: '请选择推送渠道',
					label: 'value',
					options: [
						{
							channelCode: channelMap.SMS,
							value: channelNameMap[channelMap.SMS],
						},
						{
							channelCode: channelMap.MINI,
							value: channelNameMap[channelMap.MINI],
						},
						{
							channelCode: channelMap.OFFICIALACCOUNT_C,
							value: channelNameMap[channelMap.OFFICIALACCOUNT_C],
						},
						{
							channelCode: channelMap.OFFICIALACCOUNT_B,
							value: channelNameMap[channelMap.OFFICIALACCOUNT_B],
						},
					],
					change: (val) => {
						// this.funData.templateId = ''
						this.getQueryTemplateList(val)
					},
				},
				// {
				// 	type: 'select',
				// 	title: '推送模板',
				// 	dataIndex: 'templateId',
				// 	disabled: false,
				// 	label: 'value',
				// 	options: this.templateListS,
				// 	selectAttributes: {
				// 		filterMmethod: (val) => {
				// 			this.getQueryTemplateList(val)
				// 		},
				// 	},
				// 	change: (e) => {
				// 		this.changeTemplate(e)
				// 	},
				// },
				{
					type: 'custom',
					title: '推送模板',
					dataIndex: 'templateId',
					// disabled: false,
					// label: 'value',
					// options: this.templateListS,
					// selectAttributes: {
					// 	filterMmethod: (val) => {
					// 		this.getQueryTemplateList(val)
					// 	},
					// },
					// change: (e) => {
					// 	this.changeTemplate(e)
					// },
				},
				{
					type: 'custom',
					title: '模板内容',
					dataIndex: 'templateContent',
				},
				{
					type: 'custom',
					title: '发送对象',
					dataIndex: 'userTag',
					hide: this.isOperationSource(),
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'sendObject',
					hide: this.isOperationSource(),
				},
				{
					title: '发送时间',
					type: 'radio',
					dataIndex: 'sendType',
					placeholder: '请选择发送时间',
					label: 'value',
					hide: this.isOperationSource(),
					change: (sendType) => {
						this.changShareType(sendType)
					},
					options: [
						{
							value: '立即发送',
							sendType: 1,
						},
						{
							value: '定时发送',
							sendType: 2,
						},
					],
				},
				{
					title: '',
					type: 'time',
					hide: true,
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'pushTime',
				},
			],
			flag: true,
			userTagList: [],
			userTagValue: 1,
			userTagOptions: [
				{
					label: '用户标签系统',
					value: 1,
				},
				{
					label: '用户规则系统',
					value: 2,
				},
				// {
				// 	label: '用户运营中台',
				// 	value: 3,
				// },
			],
			compileSendObjectId: '',
			funData: {
				sendObject: [],
				taskName: '', //任务名称
				templateId: '', //id
				sendType: 1,
				channelCode: channelMap.SMS,
				pushTime: '',
			},
			funRules: {
				taskName: [
					{ required: true, message: '请输入任务名称', trigger: 'blur' },
				],
				templateId: [
					{ required: true, message: '请选择推送模板', trigger: 'change' },
				],
				userTag: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.userTagValue) {
								callback(new Error('请选择发送对象'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
					// { required: true, message: '请选择发送对象', trigger: 'change' },
				],
				// sendObject: [
				// 	{
				// 		required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (this.selectCouponList && !this.selectCouponList.length) {
				// 				callback(new Error('请选择发送对象'))
				// 			}
				// 			callback()
				// 		},
				// 		trigger: ['blur', 'change'],
				// 	},
				// 	// { required: true, message: '请选择发送对象', trigger: 'change' },
				// ],
				sendType: [
					{ required: true, message: '请选择发送时间', trigger: 'change' },
				],
				channelCode: [
					{ required: true, message: '请选择推送渠道', trigger: 'change' },
				],
			},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.form.$refs.YxForm.validate((valid) => {
							if (valid) {
								this.submitForm()
							}
						})
					},
				},
			],
			queryParam: {},
		}
	},
	created() {
		// this.getQueryTemplateList()
		this._getUserTagList()
	},
	computed: {
		localVisible: {
			get() {
				this.state(this.createTaskShow)
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	watch: {
		localVisible(val) {
			if (val) {
				this.getQueryTemplateList(
					this.funData.channelCode,
					this.createTaskShow === taskStatusMap.EDIT ||
						this.title.includes('复制') ||
						this.createTaskShow === taskStatusMap.DETAIL
				)
			}
		},
		source(val) {
			if (val === 'BULLET_USER_OPERATION') {
				this.item[this.getIndex('sendType')].hide = true
				this.item[this.getIndex('userTag')].hide = true
				this.item[this.getIndex('sendObject')].hide = true
				this.item[this.getIndex('pushTime')].hide = true
			} else {
				this.item[this.getIndex('sendType')].hide = false
				this.item[this.getIndex('userTag')].hide = false
				this.item[this.getIndex('sendObject')].hide = false
				this.item[this.getIndex('pushTime')].hide = false
			}
		},
	},

	methods: {
		userTagValueChange() {
			this.userTagList = Object.freeze([])
			this.funData.sendObject = []
			// if (e == 1) {
			this._getUserTagList()
			// } else if (e == 2) {
			// 	this._userGroupConfigList('')
			// }
		},
		getIndex(dataIndex) {
			return this.item.findIndex((item) => item.dataIndex === dataIndex) || -1
		},
		state(v) {
			if (v == taskStatusMap.DETAIL) {
				this.item[this.getIndex('channelCode')].disabled = true
				this.item[this.getIndex('templateId')].disabled = true
				this.item[this.getIndex('sendType')].disabled = true
				this.item[this.getIndex('pushTime')].disabled = true
			} else {
				this.item[this.getIndex('channelCode')].disabled = false
				this.item[this.getIndex('templateId')].disabled = false
				this.item[this.getIndex('sendType')].disabled = false
				this.item[this.getIndex('pushTime')].disabled = false
			}
		},
		changeTemplate() {
			if (this.templateIdS) {
				const temp = this.funData.templateId.split('——')
				this.templateIdS = (temp && temp[0]) || this.funData.templateId
			} else {
				this.templateIdS = this.funData.templateId
			}

			JSON.parse(JSON.stringify(this.templateListS)).map((item) => {
				if (item.templateId === this.templateIdS) {
					this.templateContentTextarea =
						this.funData.channelCode == 'SMS' ? item.templateContent : ''
					this.templateContentJsonList = item.templateParamList
				}
			})
		},
		async _getUserTagList() {
			const params = {
				startCreateTime: new Date('2021-01-01 00:00:00').getTime(),
				userTagId: '',
				tagType: '',
				tagName: '',
				status: 1, //启用
				creatorName: '',
				pageSize: 99999999,
				currentPage: 1,
			}
			const params1 = {
				startCreateTime: '',
				endCreateTime: '',
				keyWord: '',
				pageSize: 99999999,
				pageNum: 1,
			}
			let Url = this.userTagValue == 1 ? getUserTagList : userGroupConfigList
			let {
				data: { resultData },
			} = await Url(this.userTagValue == 1 ? params : params1)
			this.userTagList = Object.freeze(
				this.userTagValue == 1 ? resultData.records : resultData
			)
		},
		// async _userGroupConfigList(query) {
		// 	// return
		// 	let {
		// 		data: { resultData },
		// 	} = await userGroupConfigList({
		// 		groupName: query?.isTrusted == true ? '' : query,
		// 	})
		// 	this.userTagList = Object.freeze(resultData)
		// },

		changShareType(v) {
			if (v == 1) {
				this.item[this.getIndex('pushTime')].hide = true
			} else {
				this.item[this.getIndex('pushTime')].hide = false
			}
		},

		// 列表
		async getQueryTemplateList(type, isNotRefresh, boolean) {
			this.templateListS = []
			this.templateListMap = {}
			let {
				data: { resultData },
			} = await queryTarget({
				channelCodes: [type],
			})
			const templateList = resultData

			if (templateList.length > 0) {
				this.templateListS = templateList.map((item) => {
					return {
						value: item.templateId + '——' + item.templateName,
						templateSn: item.outTemplateId,
						templateId: item.templateId,
						templateContent: item.templateContent,
						templateParamList:
							type == 'SMS' ? item.defaultVariableList : item.templateParamList,
					}
				})
				this.templateContentTextarea =
					type == 'SMS' ? templateList[0].templateContent : ''
				if (!isNotRefresh && !boolean) {
					this.funData.templateId = templateList[0].templateId
					this.templateIdS = templateList[0].templateId
					this.templateContentJsonList = this.templateListS[0].templateParamList
				}
				this.item[this.getIndex('templateId')].options = [...this.templateListS]
				if (type == 'SMS') {
					this.changeTemplate()
				}
			} else {
				this.item[this.getIndex('templateId')].options = []
				this.funData.templateId = ''
			}
		},

		// 回显
		async detail(row) {
			if (row) {
				this.funData.taskName = row.taskName
				this.funData.templateId = row.templateId + '——' + row.templateName
				this.templateIdS = row.templateId
				this.url = row.jumpPath
				// this.funData.sendType = row.sendType
				this.funData.channelCode = row.channelCode
				if (
					row.taskTagBOList[0] &&
					row.taskTagBOList[0].tagSource == 'USER_TAG'
				) {
					this.userTagValue = 1
				} else {
					this.userTagValue = 2
				}
				// this.userTagList = row.taskTagBOList
				// this.funData.sendObject = row.taskTagBOList
				if (row.sendType == 'AT_ONCE') {
					this.funData.sendType = 1
					this.item[this.getIndex('pushTime')].hide = true
				} else if (row.sendType == 'TIMING') {
					this.funData.sendType = 2

					this.item[this.getIndex('pushTime')].hide = false
					this.funData.pushTime = row.sendTime && moment(row.sendTime).valueOf()
				}

				if (this.userTagValue == 1) {
					this.funData.sendObject = row.taskTagBOList.map((item) => {
						return {
							...item,
							userTagId: item.userTag,
							tagName: item.tagName,
						}
					})
				} else {
					this.funData.sendObject = row.taskTagBOList.map((item) => {
						return {
							...item,
							id: item.userTag,
							groupName: item.tagName,
						}
					})
				}
				this.userTagList = this.funData.sendObject
				this._getUserTagList()
				// if (
				// 	row.taskStatus == 'PROCESS' ||
				// 	row.taskStatus == 'FINISH' ||
				// 	row.taskStatus == 'FAIL'
				// ) {
				this.getQueryTemplateList(row.channelCode, false, true)
				// }
				if (row.channelCode != 'SMS') {
					this.templateContentJsonList =
						row.templateContentList &&
						row.templateContentList.map((item) => {
							if (item.type == 'text') {
								item.text = item.value
							}
							if (item.type == 'time') {
								item.time = item.value
							}
							return item
						})
				}
				if (row.channelCode == 'SMS') {
					this.templateContentTextarea = row.templateContent
				}
				this.templateContentJsonList = JSON.parse(
					JSON.stringify(this.templateContentJsonList)
				)
			}
		},
		timestampToTime(timestamp) {
			let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear() + '年'
			let M =
				(date.getMonth() + 1 < 10
					? '0' + (date.getMonth() + 1)
					: date.getMonth() + 1) + '月'
			let D = date.getDate() + '日'
			let h = date.getHours() + ':'
			let m = date.getMinutes() + ':'
			let s = date.getSeconds()
			return Y + M + D + ' ' + h + m + s
		},
		getTime(date) {
			let y = date.getFullYear() //年
			let m = date.getMonth() + 1 //月，月是从0开始的所以+1
			let d = date.getDate() //日
			m = m < 10 ? '0' + m : m //小于10补0
			d = d < 10 ? '0' + d : d //小于10补0
			return y + m + d //返回时间形式yyyy-mm-dd
		},
		// 保存
		async submitForm() {
			if (this.submitLoading) {
				this.$message.error('正在处理,请勿重复提交')
				return
			}

			let paramJson = { ...this.funData }
			let pushContent = {}
			let templateContent = []
			let verify = false
			let toTime
			// if (!this.isOperationSource()) {
			this.templateContentJsonList &&
				this.templateContentJsonList.forEach((item) => {
					if (item.type == 'text' && !item.text) {
						verify = true
					}
					if (item.type == 'time') {
						console.log(
							'转化年月日后',
							moment(item['time']).format('YYYY-MM-DD HH:mm:ss')
						)
						toTime = moment(item['time']).format('YYYY-MM-DD HH:mm:ss')
						if (!item.time) {
							verify = true
						}
					}

					//展示映射值
					pushContent[item['paramName']] =
						item.type == 'text' ? item['text'] : toTime
					//后台入参（需）
					templateContent.push(item.type == 'text' ? item.text : toTime)
				})
			// }

			if (verify) {
				return this.$message({
					message: `请正确填写模板内容!`,
					type: 'warning',
				})
			}
			// return
			paramJson.jumpPath = this.url
			paramJson.templateContent = JSON.stringify(pushContent)
			// paramJson.templateContent = templateContent
			let flag = false
			// paramJson.tagId = this.funData.sendObject.map((item) => {
			// 	if (item.userTagId == undefined) {
			// 		flag = true
			// 	}
			// 	return item.userTagId
			// })
			// paramJson.tagName = this.funData.sendObject.map((item) => {
			// 	if (item.tagName == undefined) {
			// 		flag = true
			// 	}
			// 	return item.tagName
			// })
			// paramJson.taskCustomTagList = this.funData.sendObject.map((item) => {
			// 	if (item.tagName == undefined) {
			// 		flag = true
			// 	}
			// 	return {
			// 		tagName: item.tagName,
			// 		id: item.userTagId,
			// 		userTag: item.userTagId,
			// 		tagSource:
			// 			this.userTagValue == 1
			// 				? 'USER_TAG'
			// 				: this.userTagValue == 2
			// 				? 'USER_GROUP'
			// 				: 'USER_OPERATION',
			// 	}
			// })
			// return
			JSON.parse(JSON.stringify(this.templateListS)).map((item) => {
				if (item.templateId === paramJson.templateId) {
					paramJson.templateSn = item.templateSn
				}
			})
			if (flag) {
				return this.$message({
					message: `请选择正确发送对象!`,
					type: 'warning',
				})
			}
			if (paramJson.sendType == 2 && !paramJson.pushTime) {
				return this.$message({
					message: `请选择推送时间!`,
					type: 'warning',
				})
			}
			paramJson.sendTime =
				paramJson.pushTime &&
				moment(paramJson.pushTime).format('YYYY-MM-DD HH:mm:ss')
			paramJson.sendType = this.isOperationSource()
				? 'NOT_TIMING'
				: paramJson.sendType == 1
				? 'AT_ONCE'
				: 'TIMING'
			if (paramJson.sendType == 'AT_ONCE') {
				delete paramJson.sendTime
			}
			paramJson.taskType = this.isOperationSource() ? 'SYSTEM' : 'TARGETED'
			paramJson.source = this.source || 'S端'
			let myDate = new Date()

			let nowDate = this.getTime(myDate)
			paramJson.createDate = nowDate
			// paramJson.requestId = this.$store.state.user.userInfo.userId
			paramJson.pushTime =
				paramJson.pushTime &&
				moment(paramJson.pushTime).format('YYYY-MM-DD HH:mm:ss')

			if (this.itemInfo && this.createTaskShow == taskStatusMap.EDIT) {
				paramJson.taskId = this.itemInfo.taskId
			}
			let taskCustomTagList = []
			if (this.userTagValue == 1) {
				taskCustomTagList = this.funData.sendObject.map((item) => {
					return {
						userTag: item.userTagId,
						tagName: item.tagName,
						tagSource: 'USER_TAG',
					}
				})
			} else {
				taskCustomTagList = this.funData.sendObject.map((item) => {
					return {
						userTag: item.id,
						tagName: item.groupName,
						tagSource: 'USER_GROUP',
					}
				})
				// let id = this.compileSendObjectId
				// 	? this.compileSendObjectId
				// 	: this.funData.sendObject
				// console.log('this.userTagList:', id)
				// this.userTagList.map((item) => {
				// 	if (id == item.id) {
				// 		taskCustomTagList = [
				// 			{
				// 				userTag: item.id,
				// 				tagName: item.groupName,
				// 				tagSource: 'USER_GROUP',
				// 			},
				// 		]
				// 	}
				// })
			}
			paramJson.taskCustomTagList = taskCustomTagList

			paramJson.updateUser = this.$store.state.user.userInfo.clerkName
			paramJson.createUser = this.$store.state.user.userInfo.clerkName

			if (this.isOperationSource()) {
				const { id } = this.$route.params
				paramJson.taskCustomTagList = [
					{
						userTag: Number(id) || '',
						tagName: '用户运营中台',
						tagSource: 'USER_OPERATION',
					},
				]
			}

			if (this.templateIdS) {
				paramJson.templateId = this.templateIdS
			}

			// return
			let url =
				this.itemInfo &&
				this.createTaskShow == taskStatusMap.EDIT &&
				this.title != '复制任务'
					? customUpdate
					: customCreate

			this.submitLoading = true
			let {
				data: { resultCode, resultData },
			} = await url(paramJson)
			this.submitLoading = false
			if (resultCode == 0) {
				this.$message({
					message:
						paramJson.sendType === 2 || this.isOperationSource()
							? '保存成功!'
							: '发送成功!',
					type: 'success',
				})

				const templateNameObject = this.templateListS.find(
					(item) => item.templateId === paramJson.templateId
				)

				this.$emit('fatherMethod', {
					taskId: resultData.taskId,
					taskName: paramJson.taskName,
					templateId: paramJson.templateId,
					templateName: templateNameObject ? templateNameObject.value : '',
				})
				this.resetForm()
			} else if (resultCode === 500) {
				this.$message({
					message: '接口错误',
					type: 'warning',
				})
			}
		},

		// 是否为运营中台来源数据
		isOperationSource() {
			return this.source === 'BULLET_USER_OPERATION'
		},

		// 关闭弹窗
		resetForm() {
			this.funData.sendObject = []
			this.userTagList = []
			this.userTagValue = ''
			this.templateIdS = ''
			this.compileSendObjectId = ''
			this.localVisible = false
			//模板内容
			this.funData = {
				sendObject: [],
				taskName: '', //任务名称
				templateId: this.templateListS[0].templateId, //id
				sendType: 1,
				channelCode: channelMap.SMS,
				pushTime: '',
			}
			this.item[this.getIndex('pushTime')].hide = true
			this.url = ''
			this.templateContentJsonList = []
			this.changeTemplate()
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
}
</script>
<style lang="scss">
.heightBrandSet .el-dialog__body {
	max-height: 640px !important;
	overflow-y: auto;
}
.content {
	background: #d7d7d7;
	padding: 20px;
	border-radius: 6px;
}
.content .el-form .el-form-item {
	margin: 20px !important;
}
.spanText {
	width: 105px;
	font-weight: bold;
}
.mb20 {
	margin-bottom: 20px;
}
</style>
