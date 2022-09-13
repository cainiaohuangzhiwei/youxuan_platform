<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form
		><el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			></yx-table>
		</el-row>
		<!-- //查看数据 -->
		<Dialog
			title="查看数据"
			:visible="viewDatapopUp"
			width="50%"
			@before-close="viewDatapopUp = false"
		>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="Table101"
				:pagination="page101"
				:data="TableData101"
			>
			</yx-table>
		</Dialog>
		<!-- //下载页uv统计 -->
		<Dialog
			title="下载页uv统计"
			:visible="UVStatisticspopUp"
			width="50%"
			@before-close="UVStatisticspopUp = false"
		>
			<yx-form
				:inline="true"
				:data="formData102"
				:items="formCfg102"
				:formAction="formAction102"
			>
			</yx-form>
			<div class="font_siwe">
				下载页面访问量(uv):{{ resultData102.visitorCount }}
			</div>
			<div class="font_siwe" style="margin-bottom: 20px">
				点击下载按钮人数:{{ resultData102.hitsCount }}
			</div>

			<yx-table v-loading="loading102" :columns="Table102" :data="TableData102">
			</yx-table>
		</Dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import { listAppChannel } from '@/api/cmsAppChannel'
import {
	listAppStatistics,
	exportAppStatistics,
	appDownloadStatisticsByDate,
	appDownloadStatisticsList,
} from '@/api/cmsAppStatistics'
import { downloadFile } from '@/utils/helper/common'

import moment from 'moment'

export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			viewDatapopUp: false,
			showLoading: false,
			loading: false,
			UVStatisticspopUp: false,
			loading102: false,
			formData101: {
				channelNo: '',
				startTime: '',
				endTime: '',
			},
			resultData102: [],
			TableData102: [],
			formData102: {
				startTime: moment().startOf('day').valueOf(), // 开始时间
				endTime: moment().endOf('day').valueOf(), // 结束时间
			},
			formCfg102: [
				{
					title: '时间段统计',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
			],
			formAction102: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._appDownloadStatisticsByDate()
					},
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.viewData()
					},
				},
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this.deriveHzw(true)
					},
				},
			],
			formCfg101: [
				{
					type: 'input',
					title: '渠道',
					dataIndex: 'channelNo',
					placeholder: '请输入渠道',
				},
				{
					title: '时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
			],
			TableData101: [],
			Table102: [
				{
					type: 'string',
					dataIndex: 'date',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'visitorCount',
					title: '进入下载页面访问人数',
				},
				{
					type: 'string',
					dataIndex: 'hitsCount',
					title: '点击下载按钮人数',
				},
			],
			Table101: [
				{
					type: 'string',
					dataIndex: 'channelNo',
					title: '渠道号',
				},
				{
					type: 'string',
					dataIndex: 'downloadPageVisit',
					title: '下载页访问uv',
				},
				{
					type: 'string',
					dataIndex: 'clickDownloadButton',
					title: '点击下载按钮uv',
				},
				{
					type: 'string',
					dataIndex: 'shopkeeperFirstLogin',
					title: '店主首登陆APP数',
				},
				{
					type: 'string',
					dataIndex: 'newShopkeeperLogin',
					title: '当日成为新店主且登录APP',
				},
				{
					type: 'string',
					dataIndex: 'openApp',
					title: '打开APP数uv',
				},
				{
					type: 'string',
					dataIndex: 'operationGroup',
					title: '操作入群数',
				},
				{
					type: 'string',
					dataIndex: 'homepageVisit',
					title: '“选品页”访问uv',
				},
				{
					type: 'string',
					dataIndex: 'communityVisit',
					title: '“社群页”访问uv',
				},
				{
					type: 'string',
					dataIndex: 'myVisit',
					title: '“我的页”访问uv',
				},
				{
					type: 'string',
					dataIndex: 'openChatBox',
					title: '“聊天会话框”uv',
				},
				{
					type: 'string',
					dataIndex: 'openAppShopkeeper',
					title: '打开APP的店主数uv',
				},
				{
					type: 'string',
					dataIndex: 'cumulativeShopkeeper',
					title: '累积店主数',
				},
				{
					type: 'string',
					dataIndex: 'clickDownloadButtonRate',
					title: '点击下载按钮uv/下载访问页uv',
				},
				{
					type: 'string',
					dataIndex: 'shopkeeperFirstLoginRate',
					title: '首次登录app的店主/点击下载按钮uv',
				},
				{
					type: 'string',
					dataIndex: 'operationGroupRate',
					title: '操作入群数/首次登录APP店主数',
				},
				{
					type: 'string',
					dataIndex: 'newShopkeeperLoginGroupRate',
					title: '当日成为新店主且登录APP且入群数/当日成为新店主且登录AAP数',
				},
				{
					type: 'string',
					dataIndex: 'openAppRate',
					title: '打开APP店主数uv/累积app店主数',
				},
				{
					type: 'string',
					dataIndex: 'homepageVisitRate',
					title: '“选品”访问uv/打开APP数',
				},
				{
					type: 'string',
					dataIndex: 'communityVisitRate',
					title: '“社群”访问uv/打开APP数',
				},
				{
					type: 'string',
					dataIndex: 'myVisitRate',
					title: '“我的”访问uv/打开APP数',
				},
				{
					type: 'string',
					dataIndex: 'openChatBoxRate',
					title: '“聊天会话框”uv/“社群”访问',
				},
			],
			searchData: {
				channelType: 1, //渠道类型：1-默认，2-市场，3-其他，4-邀请
				startTime: '', // 开始时间,
				endTime: '', // 结束时间,
			},
			orderStatus: [],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.viewData()
				},
			},
			searchCfg: [
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					type: 'select',
					title: '更新类型',
					dataIndex: 'updateType',
					placeholder: '请选择更新类型',
					label: 'value',
					options: [
						{
							updateType: '',
							value: '全部',
						},
						{
							updateType: '2',
							value: '强制更新',
						},
						{
							updateType: '1',
							value: '非强制更新',
						},
					],
					change: () => {
						this._listAppChannel(true)
					},
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this._listAppChannel(true)
					},
				},
				{
					title: '查看数据',
					type: 'info',
					click: () => {
						this.viewData(true)
					},
				},
				{
					title: '下载页uv统计',
					type: 'info',
					click: () => {
						this.downloadUVStatistics(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'channelName',
					title: '渠道名称',
				},
				{
					type: 'string',
					dataIndex: 'channelNo',
					title: '渠道号',
				},
				{
					type: 'string',
					dataIndex: 'version',
					title: '版本号',
				},
				{
					field: 'updateType',
					title: '更新类型',
					align: 'center',
					valign: 'middle',
					customRender: function (row) {
						if (row.updateType == 1) {
							return '强制更新'
						} else if (row.updateType == 2) {
							return '非强制更新'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'content',
					title: '更新内容',
				},
				{
					type: 'string',
					dataIndex: 'addUserName',
					title: '创建者',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '操作时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '历史版本',
							click: (row) => {
								this.$router.push({
									path: '/app/defaultVersionHistory',
									query: {
										channelNo: row.channelNo,
										appChannelId: row.appChannelId,
									},
								})
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listAppChannel()
				},
			},
		}
	},

	created() {
		this._listAppChannel(true)
	},

	methods: {
		//统计页
		downloadUVStatistics() {
			this.UVStatisticspopUp = true
			this._appDownloadStatisticsList()
			this._appDownloadStatisticsByDate()
		},
		//导出
		deriveHzw: async function () {
			let paramJson = Object.assign({}, this.formData101)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			console.log(paramJson)
			let { data } = await exportAppStatistics({
				data: JSON.stringify(paramJson),
			})
			downloadFile(data, '渠道列表.xlsx')
		},

		//下载页uv统计
		_appDownloadStatisticsByDate: async function () {
			let paramJson = this.formData102
			let {
				data: { resultCode, resultData },
			} = await appDownloadStatisticsByDate(paramJson)
			if (resultCode == 0) {
				this.resultData102 = resultData ? resultData : []
			} else {
				this.resultData102 = []
			}
		},
		//下载页uv统计列表
		_appDownloadStatisticsList: async function () {
			this.loading102 = true
			let {
				data: { resultCode, resultData },
			} = await appDownloadStatisticsList({})
			this.loading102 = false
			if (resultCode == 0) {
				this.TableData102 = resultData ? resultData : []
			} else {
				this.TableData102 = []
			}
		},
		//查看数据
		viewData: async function () {
			this.viewDatapopUp = true
			this.loading = true
			let paramJson = this.formData101
			let {
				data: { resultCode, resultData },
			} = await listAppStatistics(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.TableData101 =
					resultData && resultData.records ? resultData.records : []
				this.page101.count =
					resultData && resultData.total ? resultData.total : 0
			} else {
				this.page101.count = 0
				this.TableData101 = []
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		_listAppChannel: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await listAppChannel(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData =
					resultData && resultData.records ? resultData.records : []
				this.page.count = resultData && resultData.total ? resultData.total : 0
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style>
.font_siwe {
	font-size: 26px;
	font-weight: 900;
}
</style>
