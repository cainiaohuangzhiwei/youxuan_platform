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
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import { listAppChannel } from '@/api/cmsAppChannel'
import moment from 'moment'

export default {
	components: {
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			searchData: {
				channelType: 21, //渠道类型：1-默认，2-市场，3-其他，4-邀请
				startTime: '', // 开始时间,
				endTime: '', // 结束时间,
			},
			orderStatus: [],
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
