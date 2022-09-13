<template>
	<basic-container>
		<div class="messageCenter">
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { messageList, messageDel } from '@/api/appMessageCenter'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			row: {},
			showLoading: false,
			searchData: {
				title: '',
				sendState: '',
			},
			orderStatus: [],
			sendTypeMap: ['', '立即发送', '定时发送'],
			sendStateMap: ['未发送', '发送中', '已发送'],
			searchCfg: [
				{
					type: 'input',
					title: '消息标题',
					dataIndex: 'title',
				},
				{
					type: 'select',
					title: '发送状态',
					dataIndex: 'sendState',
					label: 'value',
					options: this.$store.state.app.constant.SENDOUT_TYPE,
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._messageList(true)
					},
				},
				{
					title: '新建消息',
					type: 'primary',
					click: () => {
						this.$router.push({ name: 'MessageProcessing' })
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'messagePlanId',
					title: '消息id',
				},
				{
					type: 'string',
					dataIndex: 'title',
					title: '消息标题',
				},
				{
					type: 'string',
					dataIndex: 'sendType',
					title: '发送方式',
					customRender: (row) => {
						return this.sendTypeMap[row.sendType]
					},
				},
				{
					type: 'string',
					dataIndex: 'sendTime',
					title: '发送时间',
					width: 300,
					customRender: (row) => {
						return row.sendTime
							? moment(row.sendTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'target',
					title: '目标对象',
					customRender: (row) => {
						return row.target == 0 ? '全C端用户' : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'jpushTarget',
					title: '推送目标人数',
					customRender: (row) => {
						let jpushTarget = row.jpushTarget ? row.jpushTarget : 0
						return jpushTarget
					},
				},
				{
					type: 'string',
					dataIndex: 'sendState',
					title: '发送状态',
					customRender: (row) => {
						return this.sendStateMap[row.sendState]
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看详情',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								this.$router.push({
									name: 'MessageDetail',
									query: { messagePlanId: row.messagePlanId },
								})
							},
						},
						{
							title: '编辑',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								this.$router.push({
									name: 'MessageEdit',
									params: { messagePlanId: row.messagePlanId },
								})
							},
						},
						{
							title: '删除',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._messageDel(row.messagePlanId)
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
					this._messageList()
				},
			},
		}
	},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_messageList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await messageList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.list
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//删除banner
		_messageDel: async function (messagePlanId) {
			let paramJson = {
				messagePlanId,
			}
			let {
				data: { resultCode },
			} = await messageDel(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._messageList()
			}
		},
	},
}
</script>

<style>
.messageCenter .el-table .cell {
	white-space: pre-wrap;
}
</style>
