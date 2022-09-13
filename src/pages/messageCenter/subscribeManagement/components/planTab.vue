<template>
	<div class="package">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData104"
				:items="formCfg104"
				class="planTab-form-container"
			>
				<template #dataTime1>
					<el-date-picker
						style="width: 200px"
						v-model="formData104.dataTime1"
						type="date"
						placeholder="选择开始日期时间"
						value-format="yyyy-MM-dd"
						@change="init(true)"
						format="yyyy-MM-dd"
					>
					</el-date-picker>
					至
				</template>
				<template #dataTime2>
					<el-date-picker
						style="width: 200px"
						v-model="formData104.dataTime2"
						type="date"
						placeholder="选择结束日期时间"
						value-format="yyyy-MM-dd"
						format="yyyy-MM-dd"
						@change="init(true)"
					>
					</el-date-picker>
				</template>
				<template #templateSn>
					<el-input
						placeholder="请输入模板ID 或模板名称进行搜索"
						v-model="formData104.keyword"
						style="width: 300px"
						class="input-with-select"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
							@click="init"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<el-button
				type="primary"
				style="float: right"
				@click="createTask"
				v-auth="'pushTaskList'"
				>创建任务</el-button
			>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns105"
				:pagination="page105"
				:data="tableData105"
			>
				<template slot="taskName" slot-scope="scope">
					<div>{{ scope.row.taskName }}</div>
					<div class="color_">创建时间：{{ scope.row.addTime }}</div>
				</template>
				<template slot="taskType" slot-scope="scope">
					<div>
						{{
							scope.row.taskType == 'TARGETED'
								? '人工定向'
								: scope.row.taskType == 'SYSTEM'
								? '业务系统调用'
								: ''
						}}
					</div>
					<div class="color_" v-if="scope.row.taskType == 'TARGETED'">
						{{ scope.row.createUser || '-' }}
					</div>
					<div class="color_" v-if="scope.row.taskType == 'SYSTEM'">
						用户运营中台
					</div>
				</template>

				<template slot="pushContent" slot-scope="scope">
					<div v-if="scope.row.channelCode != 'SMS'">
						<div
							v-for="(item, index) in scope.row.templateContentList"
							:key="index"
							style="display: flex"
						>
							<div class="plantab-opacity">{{ item.content }}:</div>
							<div class="font" style="text-align: left">
								{{ item.value }}
							</div>
							<!-- <div class="font" v-else style="text-align: left">
								{{ item.value }}
							</div> -->
						</div>
					</div>
					<div v-else>{{ scope.row.templateContent }}</div>
				</template>
				<template slot="templateName" slot-scope="scope">
					<div class="font">
						【{{ channelNameMap[scope.row.channelCode] }}】{{
							scope.row.templateName
						}}
					</div>
					<!-- <div class="opacity">{{ scope.row.templateSn }}</div> -->
				</template>
				<template slot="taskStatus" slot-scope="scope">
					<div :class="'taskStatus ' + BUTTONS_STATUS[scope.row.taskStatus]">
						{{
							scope.row.taskStatus == 'FINISH'
								? FILTER_STATUS_MAP[scope.row.taskStatus] +
								  ' - ' +
								  scope.row.successMsgNum +
								  ' 次'
								: FILTER_STATUS_MAP[scope.row.taskStatus]
						}}
					</div>
					<div v-if="scope.row.taskType !== 'SYSTEM'">
						<div class="color_" v-if="scope.row.taskStatus != 'FINISH'">
							推送时间：
							{{ moment(scope.row.sendTime).format('YYYY-MM-DD HH:mm:ss') }}
						</div>
						<div class="color_" v-if="scope.row.taskStatus == 'FINISH'">
							推送开始：
							{{ moment(scope.row.sendTime).format('YYYY-MM-DD HH:mm:ss') }}
						</div>
						<div class="color_" v-if="scope.row.taskStatus == 'FINISH'">
							推送完成：
							{{ moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
						</div>
					</div>
				</template>
				<template slot="tagUserCount" slot-scope="scope">
					<div v-if="scope.row.taskTagBOList && scope.row.taskTagBOList.length">
						<div class="font">
							人群系统：{{
								USER_SOURCE_TAG[scope.row.taskTagBOList[0].tagSource]
							}}
						</div>
						<div>
							<span class="opacity" style="margin-bottom: 20px">人群ID：</span>
							<div
								v-for="(item, index) in scope.row.taskTagBOList"
								:key="index"
								style="display: contents"
							>
								<span class="opacity">
									{{
										item.userTag +
										(scope.row.taskTagBOList.length != index + 1 ? '、' : '')
									}}
								</span>
							</div>
						</div>
					</div>
				</template>
			</yx-table>
			<edit-dialog
				ref="mall"
				:visible.sync="pushDialog"
				:createTaskShow.sync="createTaskShow"
				:forbiddenShow.sync="forbiddenShow"
				@fatherMethod="fatherMethod"
				:itemInfo.sync="editTemplate"
				:source.sync="source"
				:title="title"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import EditDialog from './EditDialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	// weixinPushTaskList,
	customPage,
	customView,
	customCancel,
} from '@/api/messageCenter'
import { weixinPushExecute } from '@/api/messageCenter'
import moment from 'moment'

import {
	taskStatusMap,
	channelNameMap,
	FILTER_STATUS_MAP,
	BUTTONS_STATUS,
	USER_SOURCE_TAG,
} from '../type.map'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	props: {
		templateSn: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			FILTER_STATUS_MAP,
			BUTTONS_STATUS,
			USER_SOURCE_TAG,
			moment,
			createTaskShow: null,
			title: '',
			source: '',
			loading: false,
			pushDialog: false,
			editTemplate: {},
			pushContent: {},
			formData104: {
				taskStatus: '',
				channelCode: '',
				dataTime1: this.getNowFormatDate(),
				dataTime2: this.getLastDay(),
				keyword: this.templateSn,
				taskType: '',
			},
			channelNameMap,
			formCfg104: [
				{
					type: 'custom',
					dataIndex: 'dataTime1',
					title: '',
				},
				{
					type: 'custom',
					dataIndex: 'dataTime2',
					title: '',
				},
				{
					type: 'select',
					placeholder: '任务状态',
					dataIndex: 'taskStatus',
					options: Object.keys(FILTER_STATUS_MAP).map((key) => ({
						taskStatus: key,
						value: FILTER_STATUS_MAP[key],
					})),
					label: 'value',
					change: () => {
						this.init(true)
					},
				},
				{
					type: 'select',
					placeholder: '任务类型',
					dataIndex: 'taskType',
					label: 'value',
					change: () => {
						this.init(true)
					},
					options: [
						{
							taskType: '',
							value: '任务类型',
						},
						{
							taskType: 'TARGETED',
							value: '人工定向',
						},
						{
							taskType: 'SYSTEM',
							value: '业务系统调用',
						},
					],
				},
				{
					type: 'select',
					placeholder: '推送渠道',
					dataIndex: 'channelCode',
					options: Object.keys(channelNameMap).map((key) => ({
						channelCode: key,
						value: channelNameMap[key],
					})),

					label: 'value',
					change: () => {
						this.init(true)
					},
				},
				{
					type: 'custom',
					dataIndex: 'templateSn',
					class: 'temp-sn',
					align: 'left',
				},
			],
			tableData105: [],
			tableColumns105: [
				{
					type: 'string',
					dataIndex: 'id',
					align: 'left',
					title: '任务ID',
				},
				{
					type: 'custom',
					dataIndex: 'taskName',
					align: 'left',
					width: 200,
					title: '任务名称',
				},
				{
					type: 'custom',
					dataIndex: 'taskType',
					align: 'left',
					title: '任务类型',
				},
				{
					type: 'custom',
					dataIndex: 'templateName',
					align: 'left',
					width: 200,
					title: '模板名称',
				},
				// {
				// 	type: 'string',
				// 	align: 'left',
				// 	dataIndex: 'channelCode',
				// 	title: '推送渠道',
				// 	customRender: (row) => channelNameMap[row.channelCode],
				// },
				{
					type: 'custom',
					dataIndex: 'pushContent',
					width: 300,
					align: 'left',
					title: '推送内容',
				},
				{
					type: 'string',
					align: 'left',
					dataIndex: 'jumpPath',
					title: '跳转链接',
					customRender: (row) => {
						let url = ''
						if (row.jumpPath) {
							if (row.jumpPath.includes('?')) {
								url = row.adCode
									? row.jumpPath + '&' + row.adCode + row.id
									: row.jumpPath
							} else {
								url = row.adCode
									? row.jumpPath + '?' + row.adCode + row.id
									: row.jumpPath
							}
						}
						return url
					},
				},
				{
					type: 'custom',
					dataIndex: 'tagUserCount',
					align: 'left',
					width: 200,
					title: '推送对象',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'realPushCount',
				// 	align: 'left',
				// 	title: '实际推送人数',
				// 	customRender: (row) => {
				// 		return row.realPushCount + '人'
				// 	},
				// },
				{
					type: 'custom',
					dataIndex: 'taskStatus',
					width: 200,
					title: '任务状态',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						// {
						// 	title: '推送任务',
						// 	auth: '',
						// 	popconfirm: true,
						// 	popconfirmTitle: '确认推送该任务吗',
						// 	confirmButtonText: '确认',
						// 	cancelButtonText: '取消',
						// 	confirmButtonType: 'primary',
						// 	cancelButtonType: 'text',
						// 	confirm: (row) => {
						// 		this._weixinPushExecute(row)
						// 	},
						// 	customRender: (action, row) => {
						// 		action.hide = row.taskStatus != 1
						// 		return action
						// 	},
						// },
						{
							title: '复制',
							auth: 'pushTaskCreate',
							click: (rowRaw) => {
								const row = rowRaw
								this.createTaskShow = taskStatusMap.EDIT
								// 是否为来自中台的数据
								if (row.taskType === 'SYSTEM') {
									this.source = 'BULLET_USER_OPERATION'
								} else {
									this.source = ''
								}
								// if (row.taskStatus == 3 || row.taskStatus == 2) {
								// 	delete row.id
								// 	this.createTaskShow = taskStatusMap.CREATE
								// }
								this.pushDialog = true
								this._customView(row)
								this.forbiddenShow = false
								this.title = '复制任务'
							},
							customRender: (action, row) => {
								action.hide =
									row.taskType == 'SYSTEM' || row.taskStatus != 'CREATED'
								return action
							},
						},
						{
							title: '编辑',
							auth: 'pushTaskCreate',
							click: (rowRaw) => {
								const row = rowRaw
								this.createTaskShow = taskStatusMap.EDIT
								// 是否为来自中台的数据
								if (row.taskType === 'SYSTEM') {
									this.source = 'BULLET_USER_OPERATION'
								} else {
									this.source = ''
								}
								// if (row.taskStatus == 3 || row.taskStatus == 2) {
								// 	delete row.id
								// 	this.createTaskShow = taskStatusMap.CREATE
								// }
								this.pushDialog = true
								// this.editTemplate = row
								this._customView(row)
								this.forbiddenShow = false

								this.title =
									row.taskStatus == 'PROCESS' ||
									row.taskStatus == 'FINISH' ||
									row.taskStatus == 'FAIL'
										? '复制任务'
										: '编辑任务'
							},
							customRender: (action, row) => {
								action.title =
									row.taskStatus == 'PROCESS' ||
									row.taskStatus == 'FINISH' ||
									row.taskStatus == 'FAIL'
										? '复制'
										: '编辑'
								action.hide = row.taskType == 'SYSTEM'
								return action
							},
						},
						{
							title: '详情',
							auth: 'pushTaskCreate',
							dialogId: 112,
							click: (row) => {
								this.pushDialog = true
								this.forbiddenShow = true
								this.createTaskShow = taskStatusMap.DETAIL
								this.title = '任务详情'
								// this.$refs.mall.detail(row)
								this._customView(row)
							},
							customRender: (action, row) => {
								action.hide = row.taskType == 'SYSTEM'
								return action
							},
						},
						{
							title: '取消',
							auth: 'pushTaskCreate',
							click: (row) => {
								this.$confirm(
									row.taskStatus == 'CREATED'
										? '确定取消该模板'
										: '确定恢复该模板',
									row.taskStatus == 'CREATED' ? '取消' : '恢复',
									{
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
									}
								)
									.then(() => {
										this._templateRecoverCancel(row)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消',
										})
									})
							},
							customRender: (action, row) => {
								action.title = row.taskStatus == 'CANCEL' ? '恢复' : '取消'
								action.hide =
									!(
										row.taskStatus == 'CREATED' || row.taskStatus == 'CANCEL'
									) || row.taskType == 'SYSTEM'
								return action
							},
						},
					],
				},
			],
			page105: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		this.init()
	},
	watch: {
		templateSn(val) {
			this.formData104.keyword = val
			this.init()
		},
	},
	methods: {
		//获取当月第一天
		getNowFormatDate() {
			let date = new Date()
			date.setDate(1) // 将当前时间的日期设置成第一天
			let year = date.getFullYear() // 得到当前年份
			let month = date.getMonth() + 1 // 得到当前月份（0-11月份，+1是当前月份）
			month = month > 10 ? month : '0' + month // 补零
			let day = date.getDate() // 得到当前天数，实际是本月第一天，因为前面setDate(1) 设置过了
			// console.log(month) 03
			return moment(new Date(year + '-' + month + '-' + day)).format(
				'YYYY-MM-DD'
			) // 这里传入的是字符串
		},
		//获取当月最后一天
		getLastDay() {
			let y = new Date().getFullYear() //获取年份
			let m = new Date().getMonth() + 1 //获取月份
			let d = new Date(y, m, 0).getDate() //获取当月最后一日
			m = m < 10 ? '0' + m : m //月份补 0
			d = d < 10 ? '0' + d : d //日数补 0
			return [y, m, d].join('-')
		},
		//编辑回显
		async _customView(row) {
			let {
				data: { resultCode, resultData },
			} = await customView({
				taskId: row.taskId,
			})
			if (resultCode == 0) {
				this.editTemplate = resultData
				this.$refs.mall.detail(resultData)
			}
		},
		async _weixinPushExecute(row) {
			let {
				data: { resultCode, resultMsg },
			} = await weixinPushExecute({
				taskId: row.id,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		createTask() {
			this.pushDialog = true
			this.createTaskShow = taskStatusMap.CREATE
			this.forbiddenShow = false
			this.source = ''
			this.title = '创建任务'
		},
		// 子组件调用父组件会场列表方法更新
		fatherMethod() {
			this.init()
		},
		async _templateRecoverCancel(row) {
			let params = {
				taskId: row.taskId,
			}
			console.log('row', row)
			if (row.taskStatus == 'CANCEL') {
				params.taskStatus = 'CREATED'
			} else {
				params.taskStatus = 'CANCEL'
			}
			const {
				data: { resultCode },
			} = await customCancel(params)
			if (resultCode == 0) {
				this.$message({
					message: `成功!`,
					type: 'success',
				})
				this.init()
			}
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams105(flag)
			paramJson.endCreateDate = this.formData104.dataTime2
			paramJson.startCreateDate = this.formData104.dataTime1

			const {
				data: { resultCode, resultData, total },
			} = await customPage(paramJson)
			if (resultCode == 0) {
				this.tableData105 = resultData
				this.page105.count = total
			} else {
				this.tableData105 = []
				this.page105.count = 0
			}
			this.loading = false
		},
		findSearchParams105(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData104, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page105.length
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			paramJson.pageNum = this.page105.currentPage
			return paramJson
		},
	},
}
</script>

<style>
.plantab-opacity {
	opacity: 0.8;
	flex-shrink: 0;
	margin-right: 2px;
}

.planTab-form-container {
	display: inline-block;
	width: calc(100% - 80px);
}

.planTab-form-container .temp-sn {
	float: right;
}

.color_ {
	color: #909399;
}
.taskStatus {
	text-align: left;
}
.taskStatus.info {
	color: #e6a23c;
}

.taskStatus.success {
	color: #81b34b;
}

.taskStatus.danger {
	color: #f56c6c;
}

.taskStatus.primary {
	color: #66b1ff;
}
</style>
