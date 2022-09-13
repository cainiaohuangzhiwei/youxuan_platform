<template>
	<basic-container>
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
		</div>
		<version-dialog
			:options.sync="versionOptions"
			:visible.sync="versionVisible"
			@saveAppVersion="listAppVersion"
		></version-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import VersionDialog from './VersionDialog'
import { getAppVersionPage, delAppVersion } from '@/api/cmsAppChannel'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		VersionDialog,
	},
	name: 'FormTable',

	data() {
		return {
			versionOptions: {
				name: '', //渠道名称
				updateType: null, //更新类型
				number: '', //版本号
				checkMod: 0, //审核模式
				apk: [], // 安装包
				content: '', //更新内容
			},
			versionVisible: false,
			showLoading: false,
			searchData: {
				updateType: null,
				createStartTime: moment().startOf('month').valueOf(), // 开始时间
				createEndTime: moment().endOf('month').valueOf(), // 结束时间
			},
			orderStatus: [],
			searchCfg: [
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
							updateType: '1',
							value: '强制更新',
						},
						{
							updateType: '2',
							value: '非强制更新',
						},
					],
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['createStartTime', 'createEndTime'],
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.listAppVersion(true)
					},
				},
				{
					title: '新增',
					type: 'primary',
					click: () => {
						this._create()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'appVersionId',
					title: '版本ID',
				},
				{
					type: 'string',
					dataIndex: 'version',
					title: '版本号',
				},
				{
					type: 'string',
					dataIndex: 'platform',
					title: 'APP类型',
					customRender: (row) => {
						return row.platform == 1 ? 'IOS' : 'Android'
					},
				},
				{
					type: 'string',
					dataIndex: 'updateType',
					title: '更新类型',
					customRender: (row) => {
						return row.updateType == 1 ? '强制更新' : '非强制更新'
					},
				},
				{
					type: 'string',
					dataIndex: 'content',
					title: '更新内容',
				},
				{
					type: 'string',
					dataIndex: 'versionType',
					title: '有效状态',
					customRender: (row) => {
						return row.versionType == 1 ? '有效' : '无效'
					},
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '创建时间',
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
							title: '查看',
							click: (row) => {
								this._open(row)
							},
						},
						{
							title: '编辑',
							click: (row) => {
								this._edit(row)
							},
						},
						{
							title: '删除',
							click: (row) => {
								this.$confirm(`确认要删除吗？`, '提示', {
									type: 'warning',
									callback: async (action) => {
										if (action === 'confirm') {
											let {
												data: { resultMsg },
											} = await delAppVersion({
												appVersionId: row.appVersionId,
											})
											this.$message.success(resultMsg)
											this.listAppVersion()
										}
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
					this.listAppVersion()
				},
			},
		}
	},

	created() {
		this.listAppVersion(true)
	},

	methods: {
		_create() {
			this.versionOptions = {
				title: '新增',
				type: 'add',
				apk: [],
				downloadUrl: '',
				appChannelId: this.$route.query.appChannelId,
				channelNo: this.$route.query.channelNo,
				platform:
					this.$route.query.channelNo == 'IOS' ||
					this.$route.query.channelNo == 'IOS-C'
						? 1
						: 2,
				channelName:
					this.$route.query.channelNo == 'IOS' ||
					this.$route.query.channelNo == 'IOS-C'
						? 'IOS'
						: 'Andriod',
				auditMode: 1,
				updateType: 1,
				version: '',
				content: '',
			}
			this.versionVisible = true
		},
		_open(row) {
			this.versionOptions = JSON.parse(JSON.stringify(row))
			this.versionOptions.apk = [this.versionOptions.downloadUrl]
			this.versionOptions.title = '查看'
			;(this.versionOptions.channelName =
				this.$route.query.channelNo == 'IOS' ||
				this.$route.query.channelNo == 'IOS-C'
					? 'IOS'
					: 'Andriod'),
				(this.versionOptions.type = 'check')
			this.versionVisible = true
		},
		_edit(row) {
			this.versionOptions = JSON.parse(JSON.stringify(row))
			this.versionOptions.apk = [this.versionOptions.downloadUrl]
			this.versionOptions.title = '编辑'
			;(this.versionOptions.channelName =
				this.$route.query.channelNo == 'IOS' ||
				this.$route.query.channelNo == 'IOS-C'
					? 'IOS'
					: 'Andriod'),
				(this.versionOptions.type = 'edit')
			this.versionVisible = true
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 10,
				channelNo: this.$route.query.channelNo,
				appChannelId: this.$route.query.appChannelId,
			})
			console.log('pppp', this.$route.query.appChannelId)
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.createStartTime =
				moment(paramJson.createStartTime).valueOf() || ''
			paramJson.createEndTime = moment(paramJson.createEndTime).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		listAppVersion: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getAppVersionPage(paramJson)
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
