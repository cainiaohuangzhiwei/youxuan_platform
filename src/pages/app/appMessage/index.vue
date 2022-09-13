<template>
	<div>
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { getAppMessageList, delCmsAppMessage } from '@/api/cmsAppMessage'
export default {
	name: 'AppMessage',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			sendTypeMap: ['', '立即发送', '定时发送1'],
			sendStateMap: { '': '全部', 0: '未发送', 1: '已发送', 2: '发送中' },
			targetMap: { 1: '全部', 2: 'B端用户', 3: '指定用户', 4: '用户分群' },
			formData105: {
				title: '',
				sendState: '',
			},
			formCfg105: [
				{
					type: 'input',
					title: '消息标题',
					dataIndex: 'title',
					placeholder: '请输入消息标题',
				},
				{
					type: 'select',
					title: '发送状态',
					dataIndex: 'sendState',
					placeholder: '请选择发送状态',
					label: 'value',
					options: this.$store.state.app.constant.SENDOUT_TYPE,
				},
			],
			formAction105: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.getAppMessageListByCondition(true, e)
					},
				},
				{
					title: '新建消息',
					type: 'primary',
					click: () => {
						this.$router.push({
							name: 'AppMessageDetail',
							params: { appMessageId: 0, type: 'new' },
						})
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'appMessageId',
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
						if (row.sendType == 1) {
							return row.sendTime
								? moment(row.sendTime).format('YYYY-MM-DD HH:mm:ss')
								: ''
						} else if (row.sendType == 2) {
							return row.sendTimerTime
								? moment(row.sendTimerTime).format('YYYY-MM-DD HH:mm:ss')
								: ''
						} else {
							return ''
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'target',
					title: '目标对象',
					customRender: (row) => {
						return this.targetMap[row.target]
					},
				},
				{
					type: 'string',
					dataIndex: 'sendCount',
					title: '已读量/发送量',
					customRender: (row) => {
						return (
							(row.readCount === null ? 0 : row.readCount) +
							'/' +
							(row.sendCount === null ? 0 : row.sendCount)
						)
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
							click: (row) => {
								this.$router.push({
									name: 'AppMessageDetail',
									params: { appMessageId: row.appMessageId, type: 'details' },
								})
							},
						},
						{
							title: '编辑',
							click: (row) => {
								this.$router.push({
									name: 'AppMessageDetail',
									params: { appMessageId: row.appMessageId, type: 'edit' },
								})
							},
						},
						{
							title: '删除',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._messageDel(row.appMessageId)
										}
									},
								})
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getAppMessageListByCondition()
				},
			},
		}
	},

	created() {
		this.getAppMessageListByCondition(true)
	},

	methods: {
		//删除消息
		_messageDel: async function (appMessageId) {
			let paramJson = {
				appMessageId,
			}
			let {
				data: { resultCode },
			} = await delCmsAppMessage(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this.getAppMessageListByCondition()
			}
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			return paramJson
		},
		getAppMessageListByCondition: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getAppMessageList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData106 = resultData.list
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
.bg-yellow {
	background-color: #ffc94b;
	width: 40px;
}
.bg-grey {
	background-color: #5cb85c;
	width: 40px;
}
</style>
