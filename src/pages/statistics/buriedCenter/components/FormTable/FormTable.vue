<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<el-row v-loading="loading">
				<yx-table
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
			<buried-point-event-dialog
				ref="event_dialog"
				:visible.sync="buriedDialog"
				:buriedRow="buriedRow"
				:actionType="actionType"
				@refreshList="getData"
			></buried-point-event-dialog>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import BuriedPointEventDialog from './BuriedPointEventDialog'

import { getDotEventList, deleteDotEvent } from '@/api/statistics'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		BuriedPointEventDialog,
	},
	name: 'FormTable',

	data() {
		return {
			buriedRow: {},
			buriedDialog: false,
			actionType: 'create',
			statusMap: ['下线', '上线'],
			loading: false,
			formInline: {
				status: '',
				createdDateStart: moment().subtract(3, 'months'),
				createdDateStop: moment(),
			},
			formCfg: [
				{
					title: '事件名称:',
					dataIndex: 'eventDesc',
					placeholder: '请输入内容',
				},
				{
					title: '事件ID:',
					dataIndex: 'eventId',
					placeholder: '请输入内容',
				},
				{
					title: '上线状态',
					type: 'select',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 0,
							value: '下线',
						},
						{
							status: 1,
							value: '上线',
						},
					],
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['createdDateStart', 'createdDateStop'],
				},
			],
			formAction: [
				{
					title: '搜索',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.page.currentPage = 1
						this.getData()
					},
				},
				{
					title: '重置',
					// auth: 'bindDepartmentId',
					click: () => {
						this.reset()
					},
				},
				{
					title: '添加事件',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.actionType = 'create'
						this.buriedDialog = true
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'eventId',
					title: '事件id',
				},
				{
					type: 'string',
					dataIndex: 'eventDesc',
					title: '事件名称',
				},
				{
					type: 'string',
					dataIndex: 'appName',
					title: '客户端',
				},
				{
					type: 'string',
					dataIndex: 'appId',
					title: 'APPid',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '上线状态',
					customRender: (row) => {
						return this.statusMap[row.status]
					},
				},
				{
					type: 'string',
					dataIndex: 'createdDate',
					title: '创建时间',
					width: 200,
					customRender: (row) => {
						return row.createdDate
							? moment(row.createdDate).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看',
							click: (row) => {
								this.actionType = 'check'
								this.getDetail(row)
							},
						},
						{
							title: '编辑',
							click: (row) => {
								this.actionType = 'edit'
								this.getDetail(row)
							},
						},
						{
							title: '删除',
							click: (row) => {
								let _this = this
								_this
									.$confirm('是否确定删除该事件？', '提示', {
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
									})
									.then(() => {
										_this.handleDelete(row)
									})
									.catch(() => {
										_this.$message({
											type: 'info',
											message: '已取消删除',
										})
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
				pageSizes: [20],
				tableChange: () => {
					this.getData()
				},
			},
		}
	},

	created() {
		this.getData()
	},
	methods: {
		getParams() {
			const { currentPage } = this.page
			const {
				appName = '',
				createdDateStart = '',
				createdDateStop = '',
				status,
				eventId = '',
				eventDesc = '',
			} = this.formInline
			const current =
				this.tableData.length === 1 ? Math.max(currentPage - 1, 1) : currentPage
			const data = {
				current,
				status,
				appName,
				createdDateStart: createdDateStart
					? moment(createdDateStart).format('YYYY-MM-DD HH:mm:ss')
					: '',
				isDrop: 0,
				eventDesc,
			}
			if (eventId) {
				data.eventId = eventId
			}
			if (createdDateStop) {
				data.createdDateStop = moment(createdDateStop).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			return data
		},
		async getData() {
			this.loading = true
			const res = await getDotEventList(this.getParams()).finally(() => {
				this.loading = false
			})
			if (res && res.data && res.data.resultCode === 0) {
				const { detailList, count } = res.data.resultData || {}
				this.tableData = detailList || []
				this.page.count = count || 0
			}
		},

		reset() {
			this.formInline = this.$options.data().formInline
			this.page.currentPage = 1
			this.$nextTick(() => {
				this.getData()
			})
		},

		handleDelete(row) {
			if (this.loading) return
			this.loading = true
			deleteDotEvent(row)
				.then((res) => {
					if (res) {
						this.$message({
							type: 'success',
							message: '删除成功!',
						})
						this.getData()
					}
				})
				.finally(() => {
					this.loading = false
				})
		},

		getDetail(item) {
			this.buriedDialog = true
			this.$refs.event_dialog.getDetail(item.id)
		},
	},
}
</script>

<style lang="scss" scope></style>
