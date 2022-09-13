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

				<template #templateContent>
					<div class="content">
						<div
							style="display: flex"
							v-for="(item, index) in templateContentJsonList"
							:key="index"
						>
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
						<div style="display: flex">
							<span class="spanText"> 跳转链接：</span>

							<el-input
								class="mb20"
								v-model="url"
								:disabled="forbiddenShow"
								:placeholder="'请输入跳转链接'"
							></el-input>
						</div>
					</div>
				</template>
				<template #sendObject>
					<el-select
						value-key="userTagId"
						v-model="funData.sendObject"
						clearable
						multiple
						filterable
						:disabled="forbiddenShow"
						allow-create
						default-first-option
						placeholder="请选择发送对象"
					>
						<el-option
							:disabled="forbiddenShow"
							v-for="item in userTagList"
							:key="item.userTagId"
							:label="item.tagName"
							:value="item"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import {
	weixinTemplateList,
	weixinPushTaskCreate,
	weixinPushTaskEdit,
} from '@/api/messageCenter'
import { getUserTagList } from '@/api/platformUserGroupTag'
import moment from 'moment'
import { taskStatusMap, channelMap, channelNameMap } from '../type.old.map'
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
			dialogTitle: '',
			formsDialog: false,
			submitLoading: false,
			templateListS: [],
			templateContentJsonList: [],
			startTimeRange: '',
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
					dataIndex: 'pushChannel',
					placeholder: '请选择推送渠道',
					label: 'value',
					options: [
						{
							pushChannel: channelMap.MINI,
							value: channelNameMap[channelMap.MINI],
						},
						{
							pushChannel: channelMap.OFFICIALACCOUNT_C,
							value: channelNameMap[channelMap.OFFICIALACCOUNT_C],
						},
						{
							pushChannel: channelMap.OFFICIALACCOUNT_B,
							value: channelNameMap[channelMap.OFFICIALACCOUNT_B],
						},
					],
					change: (val) => {
						this.getQueryTemplateList(val)
					},
				},
				{
					type: 'select',
					title: '推送模板',
					dataIndex: 'templateId',
					disabled: false,
					label: 'value',
					options: this.templateListS,
					selectAttributes: {
						filterMmethod: (val) => {
							this.getQueryTemplateList(val)
						},
					},
					change: (e) => {
						this.changeTemplate(e)
					},
				},
				{
					type: 'custom',
					title: '模板内容',
					dataIndex: 'templateContent',
				},
				{
					type: 'custom',
					title: '发送对象',
					dataIndex: 'sendObject',
				},
				{
					title: '发送时间',
					type: 'radio',
					dataIndex: 'enableType',
					placeholder: '请选择发送时间',
					label: 'value',
					change: (enableType) => {
						this.changShareType(enableType)
					},
					options: [
						{
							value: '立即发送',
							enableType: 1,
						},
						{
							value: '定时发送',
							enableType: 2,
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
			funData: {
				sendObject: [],
				taskName: '', //任务名称
				templateId: '', //id
				enableType: 1,
				pushChannel: channelMap.MINI,
				pushTime: '',
			},
			funRules: {
				taskName: [
					{ required: true, message: '请输入任务名称', trigger: 'blur' },
				],
				templateId: [
					{ required: true, message: '请选择推送模板', trigger: 'change' },
				],
				sendObject: [
					{ required: true, message: '请选择发送对象', trigger: 'change' },
				],
				enableType: [
					{ required: true, message: '请选择发送时间', trigger: 'change' },
				],
				pushChannel: [
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
					this.funData.pushChannel,
					this.createTaskShow === taskStatusMap.EDIT ||
						this.title.includes('复制') ||
						this.createTaskShow === taskStatusMap.DETAIL
				)
			}
		},
	},

	methods: {
		getIndex(dataIndex) {
			return this.item.findIndex((item) => item.dataIndex === dataIndex) || -1
		},
		state(v) {
			if (v == taskStatusMap.DETAIL) {
				this.item[this.getIndex('pushChannel')].disabled = true
				this.item[this.getIndex('templateId')].disabled = true
				this.item[this.getIndex('enableType')].disabled = true
				this.item[this.getIndex('pushTime')].disabled = true
			} else {
				this.item[this.getIndex('pushChannel')].disabled = false
				this.item[this.getIndex('templateId')].disabled = false
				this.item[this.getIndex('enableType')].disabled = false
				this.item[this.getIndex('pushTime')].disabled = false
			}
		},
		changeTemplate() {
			JSON.parse(JSON.stringify(this.templateListS)).map((item) => {
				if (item.templateId === this.funData.templateId) {
					this.templateContentJsonList = item.templateContentJson
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
			let {
				data: { resultData },
			} = await getUserTagList(params)
			this.userTagList = Object.freeze(resultData.records)
		},
		changShareType(v) {
			if (v == 1) {
				this.item[this.getIndex('pushTime')].hide = true
			} else {
				this.item[this.getIndex('pushTime')].hide = false
			}
		},

		// 列表
		async getQueryTemplateList(type, isNotRefresh) {
			this.templateListS = []
			this.templateListMap = {}
			let {
				data: { resultData },
			} = await weixinTemplateList({
				type,
			})
			const templateList = resultData

			if (templateList.length > 0) {
				this.templateListS = templateList.map((item) => {
					return {
						value: item.templateName,
						templateSn: item.templateSn,
						templateId: item.id,
						templateContentJson: item.templateContentJson,
					}
				})
				if (!isNotRefresh) {
					this.funData.templateId = templateList[0].id
					this.templateContentJsonList =
						this.templateListS[0].templateContentJson
				}
				this.item[this.getIndex('templateId')].options = [...this.templateListS]
			} else {
				this.item[this.getIndex('templateId')].options = []
				this.funData.templateId = ''
			}
		},

		// 回显
		async detail(row) {
			if (row) {
				this.funData.taskName = row.taskName
				this.funData.templateId = row.templateId
				this.funData.enableType = row.enableType
				this.funData.pushChannel = row.pushChannel
				if (row.enableType == 1) {
					this.item[this.getIndex('pushTime')].hide = true
				} else {
					this.item[this.getIndex('pushTime')].hide = false
				}
				if (row.enableType == 2) {
					this.funData.pushTime = row.pushTime
				}
				this.url = row.url
				this.userTagList.forEach((item) => {
					JSON.parse(row.tagId).forEach((it) => {
						if (item.userTagId == it) {
							this.funData.sendObject.push(item)
						}
					})
				})
				this.templateContentJsonList = row.echoBOS.map((item) => {
					if (item.type == 'text') {
						item.text = item.keyWord
					}
					if (item.type == 'time') {
						item.time = moment(JSON.parse(item.keyWord)).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					}
					return item
				})
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
		// 保存
		async submitForm() {
			if (this.submitLoading) {
				this.$message.error('正在处理,请勿重复提交')
				return
			}

			let paramJson = this.funData
			let pushContent = {}
			let templateContent = []
			let verify = false
			let toTime
			this.templateContentJsonList.forEach((item) => {
				if (item.type == 'text' && !item.text) {
					verify = true
				}
				if (item.type == 'time') {
					console.log(
						'转化年月日后',
						this.timestampToTime(moment(item['time']).valueOf())
					)
					toTime = this.timestampToTime(moment(item['time']).valueOf())
					if (!item.time) {
						verify = true
					}
				}

				//展示映射值
				pushContent[item['content']] =
					item.type == 'text' ? item['text'] : toTime
				//后台入参（需）
				templateContent.push(item.type == 'text' ? item.text : toTime)
			})
			if (verify) {
				return this.$message({
					message: `请正确填写模板内容!`,
					type: 'warning',
				})
			}
			paramJson.url = this.url
			paramJson.pushContent = JSON.stringify(pushContent)
			paramJson.templateContent = templateContent
			let flag = false
			paramJson.tagId = this.funData.sendObject.map((item) => {
				if (item.userTagId == undefined) {
					flag = true
				}
				return item.userTagId
			})
			paramJson.tagName = this.funData.sendObject.map((item) => {
				if (item.tagName == undefined) {
					flag = true
				}
				return item.tagName
			})
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
			if (paramJson.enableType == 2 && !paramJson.pushTime) {
				return this.$message({
					message: `请选择推送时间!`,
					type: 'warning',
				})
			}
			console.log('paramJson', paramJson)
			console.log('this.itemInfo', this.createTaskShow)

			if (this.itemInfo && this.createTaskShow == taskStatusMap.EDIT) {
				paramJson.taskId = this.itemInfo.id
			}
			// return
			let url =
				this.itemInfo && this.createTaskShow == taskStatusMap.EDIT
					? weixinPushTaskEdit
					: weixinPushTaskCreate

			this.submitLoading = true
			let {
				data: { resultCode },
			} = await url(paramJson)
			this.submitLoading = false
			if (resultCode == 0) {
				this.$message({
					message: paramJson.enableType === 2 ? '保存成功!' : '发送成功!',
					type: 'success',
				})
				this.resetForm()
				this.$emit('fatherMethod')
			} else if (resultCode === 500) {
				this.$message({
					message: '接口错误',
					type: 'warning',
				})
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			//模板内容
			this.funData = {
				sendObject: [],
				taskName: '', //任务名称
				templateId: this.templateListS[0].templateId, //id
				enableType: 1,
				pushChannel: channelMap.MINI,
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
	width: 100px;
	font-weight: bold;
}
.mb20 {
	margin-bottom: 20px;
}
</style>
