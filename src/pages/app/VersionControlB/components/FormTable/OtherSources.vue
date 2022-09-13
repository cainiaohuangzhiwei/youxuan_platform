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
			>
				<template slot="h5Url" slot-scope="scope">
					<div class="slot active">
						<div>
							<a style="color: #4498e0" :href="scope.row.h5Url">
								{{ scope.row.h5Url }}
							</a>
						</div>
					</div>
				</template>
			</yx-table>
		</el-row>
		<create-channel-dialog
			:visible.sync="createChannelVisible"
			:other="other"
			@initTable="_listAppChannel"
		></create-channel-dialog>
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
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { listAppChannel } from '@/api/cmsAppChannel'
import CreateChannelDialog from './CreateChannelDialog'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { listAppStatistics, exportAppStatistics } from '@/api/cmsAppStatistics'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		YxForm,
		YxTable,
		CreateChannelDialog,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			other: false,
			createChannelVisible: false,
			showLoading: false,
			viewDatapopUp: false,
			loading: false,
			TableData101: [],
			searchData: {
				channelType: 3, //渠道类型：1-默认，2-市场，3-其他，4-邀请
				startTime: '', // 开始时间,
				endTime: '', // 结束时间,
			},
			formData101: {
				channelNo: '',
				startTime: '',
				endTime: '',
			},
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
						this._deriveHzw(true)
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
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.viewData()
				},
			},
			orderStatus: [],
			searchCfg: [
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
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
					title: '新增渠道',
					type: 'primary',
					click: () => {
						this.createChannel(true)
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
					type: 'custom',
					dataIndex: 'h5Url',
					title: '下载链接',
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
									path: `/app/defaultVersionHistory/${row.appChannelId}/${row.channelType}/${row.channelNo}/${row.channelName}`,
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
		//导出
		_deriveHzw: async function () {
			let paramJson = Object.assign({}, this.formData101)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			console.log(paramJson)
			let { data } = await exportAppStatistics({
				data: JSON.stringify(paramJson),
			})
			downloadFile(data, '渠道列表.xlsx')
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
		createChannel() {
			//新增渠道
			this.createChannelVisible = true
			this.other = true
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
