<template>
	<div class="package">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData104"
				:items="formCfg104"
				class="planTab-form-container"
			>
				<template #templateSn>
					<el-input
						placeholder="请输入模板ID 或模板名称进行搜索"
						v-model="formData104.templateSn"
						style="width: 380px"
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
			<!-- <el-button
				type="primary"
				style="float: right"
				@click="createTask"
				v-auth="'pushTaskList'"
				>创建任务</el-button
			> -->
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns105"
				:pagination="page105"
				:data="tableData105"
			>
				<template slot="pushContent" slot-scope="scope">
					<div
						v-for="(item, index) in scope.row.echoBOS"
						:key="index"
						style="display: flex"
					>
						<div class="plantab-opacity">{{ item.content }}:</div>
						<div
							class="font"
							style="text-align: left"
							v-if="item.type == 'time'"
						>
							{{ moment(Number(item.keyWord)).format('YYYY-MM-DD HH:mm:ss') }}
						</div>
						<div class="font" style="text-align: left" v-else>
							{{ item.keyWord }}
						</div>
					</div>
				</template>
				<template slot="templateName" slot-scope="scope">
					<div class="font">{{ scope.row.templateName }}</div>
					<div class="opacity">{{ scope.row.templateSn }}</div>
				</template>
				<template slot="taskStatus" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="scope.row.taskStatus == 1"
							>待推送</el-tag
						>
						<el-tag type="info" v-if="scope.row.taskStatus == 2"
							>已取消
						</el-tag>
						<el-tag v-if="scope.row.taskStatus == 3">已推送</el-tag>
						<el-tag v-if="scope.row.taskStatus == 4">推送中</el-tag>
					</div>
					<div>
						{{ moment(scope.row.pushTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template slot="tagUserCount" slot-scope="scope">
					<div class="font">{{ scope.row.groupBaseName }}</div>
					<div class="opacity">共{{ scope.row.groupBaseCount }}人</div>
				</template>
			</yx-table>
			<edit-dialog
				ref="mall"
				:visible.sync="pushDialog"
				:createTaskShow.sync="createTaskShow"
				:forbiddenShow.sync="forbiddenShow"
				@fatherMethod="fatherMethod"
				:itemInfo.sync="editTemplate"
				:title="title"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import EditDialog from './EditDialogOld'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { weixinPushTaskHandler, weixinPushTaskList } from '@/api/messageCenter'
import { weixinPushExecute } from '@/api/messageCenter'
import moment from 'moment'

import { taskStatusMap, channelMap, channelNameMap } from '../type.old.map'

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
			moment,
			createTaskShow: null,
			title: '',
			loading: false,
			pushDialog: false,
			editTemplate: {},
			pushContent: {},
			formData104: {
				taskStatus: '',
				pushChannel: '',
				templateSn: this.templateSn,
			},
			formCfg104: [
				{
					type: 'select',
					placeholder: '任务状态',
					dataIndex: 'taskStatus',
					options: [
						{
							taskStatus: '',
							value: '全部',
						},
						{
							taskStatus: 1,
							value: '待推送',
						},
						{
							taskStatus: 3,
							value: '已推送',
						},
						{
							taskStatus: 2,
							value: '取消推送',
						},
					],
					label: 'value',
					change: () => {
						this.init(true)
					},
				},
				{
					type: 'select',
					placeholder: '推送渠道',
					dataIndex: 'pushChannel',
					options: [
						{
							pushChannel: '',
							value: '全部渠道',
						},
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
					title: '任务id-任务名称',
					customRender: (row) => {
						return row.id + '—' + row.taskName
					},
				},
				{
					type: 'custom',
					dataIndex: 'templateName',
					width: 300,
					title: '订阅模板',
				},
				{
					type: 'string',
					dataIndex: 'pushChannel',
					title: '推送渠道',
					customRender: (row) => channelNameMap[row.pushChannel],
				},
				{
					type: 'custom',
					dataIndex: 'pushContent',
					width: 300,
					title: '推送内容',
				},
				{
					type: 'string',
					dataIndex: 'url',
					title: '跳转链接',
					customRender: (row) => {
						let url = ''
						if (row.url) {
							if (row.url.includes('?')) {
								url = row.adCode ? row.url + '&' + row.adCode + row.id : row.url
							} else {
								url = row.adCode ? row.url + '?' + row.adCode + row.id : row.url
							}
						}
						return url
					},
				},
				{
					type: 'custom',
					dataIndex: 'tagUserCount',
					title: '发送对象',
				},
				{
					type: 'string',
					dataIndex: 'realPushCount',
					title: '实际推送人数',
					customRender: (row) => {
						return row.realPushCount + '人'
					},
				},
				{
					type: 'custom',
					dataIndex: 'taskStatus',
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
						// {
						// 	title: '编辑',
						// 	auth: 'pushTaskCreate',
						// 	click: (rowRaw) => {
						// 		const row = rowRaw
						// 		this.createTaskShow = taskStatusMap.EDIT
						// 		if (row.taskStatus == 3 || row.taskStatus == 2) {
						// 			delete row.id
						// 			this.createTaskShow = taskStatusMap.CREATE
						// 		}
						// 		this.pushDialog = true
						// 		this.editTemplate = row
						// 		this.forbiddenShow = false
						// 		this.$refs.mall.detail(row)
						// 		this.title =
						// 			row.taskStatus == 3 || row.taskStatus == 2
						// 				? '复制任务'
						// 				: '编辑任务'
						// 	},
						// 	customRender: (action, row) => {
						// 		action.title =
						// 			row.taskStatus == 3 || row.taskStatus == 2 ? '复制' : '编辑'
						// 		return action
						// 	},
						// },
						{
							title: '详情',
							auth: 'pushTaskCreate',
							dialogId: 112,
							click: (row) => {
								this.pushDialog = true
								this.forbiddenShow = true
								this.createTaskShow = taskStatusMap.DETAIL
								this.title = '任务详情'
								this.$refs.mall.detail(row)
							},
						},
						{
							title: '取消',
							auth: 'pushTaskCreate',
							click: (row) => {
								this.$confirm(
									row.taskStatus == 1 ? '确定取消该模板' : '确定恢复该模板',
									row.taskStatus == 1 ? '取消' : '恢复',
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
								action.title = row.taskStatus == 1 ? '取消' : '恢复'
								action.hide = row.taskStatus == 3 || row.taskStatus == 4
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
			this.formData104.templateSn = val
			this.init()
		},
	},
	methods: {
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
			this.title = '创建任务'
		},
		// 子组件调用父组件会场列表方法更新
		fatherMethod() {
			this.init()
		},
		async _templateRecoverCancel(row) {
			let params = {
				taskId: row.id,
			}
			if (row.taskStatus == 2) {
				params.handlerType = 1
			} else if (row.taskStatus == 1) {
				params.handlerType = 2
			}
			const {
				data: { resultCode },
			} = await weixinPushTaskHandler(params)
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
			const {
				data: { resultCode, resultData },
			} = await weixinPushTaskList(paramJson)
			if (resultCode == 0) {
				this.tableData105 = resultData.list
				this.page105.count = resultData.count
			} else {
				this.tableData105 = []
				this.page105.count = 0
			}
			this.loading = false
		},
		findSearchParams105(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			const paramJson = Object.assign(this.formData104, {
				length: this.page105.length,
				startIndex: (this.page105.currentPage - 1) * this.page105.length,
			})
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
</style>
