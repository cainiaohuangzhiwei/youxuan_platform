<template>
	<div>
		<yx-form
			:inline="true"
			:data="formData"
			:items="formCfg"
			:formAction="formAction"
		></yx-form>
		<el-row>
			<yx-table
				v-loading="tableLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="operator" slot-scope="scope">
					<div>{{ scope.row.operator }}</div>
					<div>
						{{ moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
			</yx-table>
		</el-row>
		<activity-data-dialog
			:visible.sync="activityDataDialog"
			:activityDataRow="activityDataRow"
		></activity-data-dialog>
		<new-activities-dialog
			:visible.sync="newActivitiesDialog"
			:newActivitiesRow="newActivitiesRow"
			@refit="refit"
		></new-activities-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import ActivityDataDialog from './ActivityDataDialog'
import NewActivitiesDialog from './NewActivitiesDialog'
import {
	listPageMarketingReward,
	closeActivityReward,
	deleteActivityReward,
} from '@/api/userRewardSystem'

export default {
	components: {
		YxForm,
		YxTable,
		ActivityDataDialog,
		NewActivitiesDialog,
	},
	name: 'FormTable',

	data() {
		return {
			moment,
			newActivitiesDialog: false,
			newActivitiesRow: {},
			activityDataDialog: false,
			activityDataRow: {},
			showLoading: false,
			formData: {
				activityName: '',
				status: '',
			},
			formCfg: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'activityName',
				},
				{
					type: 'select',
					title: '活动状态',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 0,
							value: '未开始',
						},
						{
							status: 1,
							value: '进行中',
						},
						{
							status: 2,
							value: '已结束',
						},
					],
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._listPageMarketingReward(true)
					},
				},
				{
					title: '新增活动',
					auth: 'saveMarketingActivityReward',
					type: 'primary',
					click: () => {
						this.newActivitiesDialog = true
						this.newActivitiesRow = {}
					},
				},
			],
			statusMap: ['未开始', '进行中', '已结束'],
			tableLoading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'id',
					title: 'ID',
					width: '80',
				},
				{
					type: 'string',
					dataIndex: 'activityName',
					title: '活动名称',
					align: 'left',
					width: '300',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '活动时间',
					width: '146',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							'~' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '活动状态',
					width: '100',
					customRender: (row) => {
						return this.statusMap[row.status]
					},
				},
				{
					type: 'custom',
					dataIndex: 'operator',
					title: '最后操作人',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							auth: 'modifyMarketingActivityReward',
							click: (row) => {
								this.handleCheck(row)
							},
							customRender: (action, row) => {
								action.hide = this.canShow(row, 1)
								return action
							},
						},
						{
							title: '删除',
							auth: 'deleteActivityReward',
							click: (row) => {
								this.handleDeleteActivity(row)
							},
							customRender: (action, row) => {
								action.hide = this.canShow(row, 4)
								return action
							},
						},
						{
							title: '查看',
							click: (row) => {
								this.handleCheck(row)
							},
							customRender: (action, row) => {
								action.hide = this.canShow(row, 2)
								return action
							},
						},
						{
							title: '结束活动',
							auth: 'closeMarketingActivityReward',
							click: (row) => {
								this.handleEndActivity(row)
							},
							customRender: (action, row) => {
								action.hide = this.canShow(row, 3)
								return action
							},
						},
						{
							title: '查看活动数据',
							auth: 'listPageMarketingActivityReward',
							click: (row) => {
								this.handleView(row)
							},
						},
						{
							title: '复制路径',
							click: (row) => {
								this.$copyText(
									`/subpages/rewardActivity/activityDetail?id=${row.id}`
								).then(() => {
									this.$message.success('复制成功')
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
					this._listPageMarketingReward()
				},
			},
		}
	},

	mounted() {
		this._listPageMarketingReward()
	},

	methods: {
		canShow(row, type) {
			if (type == 1) {
				if (row.activityStatus == 0) {
					return true
				} else if (row.activityStatus == 1) {
					if (row.status == 0 || row.status == 1) {
						return false
					} else {
						return true
					}
				}
			} else if (type == 2) {
				if (row.activityStatus == 0) {
					return false
				} else if (row.activityStatus == 1) {
					if (row.status == 0 || row.status == 1) {
						return true
					} else {
						return false
					}
				}
			} else if (type == 3) {
				if (row.activityStatus == 0) {
					return true
				} else if (row.activityStatus == 1) {
					if (row.status == 1) {
						return false
					} else {
						return true
					}
				}
			} else if (type == 4) {
				if (row.activityStatus == 1 && row.status == 0) {
					return false
				} else {
					return true
				}
			}
		},
		handleCheck(row) {
			this.newActivitiesRow = row
			this.newActivitiesDialog = true
		},
		handleEndActivity(row) {
			this.$confirm('此操作将结束活动, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this._closeActivityReward(row)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					})
				})
		},
		async _closeActivityReward(row) {
			let params = {
				activityId: row.id,
				userName: this.$store.state.user.userInfo.clerkName,
			}
			let {
				data: { resultCode },
			} = await closeActivityReward(params)
			if (resultCode == 0) {
				this.$message.success('操作成功')
				this._listPageMarketingReward()
			}
		},
		handleDeleteActivity(row) {
			this.$confirm('此操作将删除活动, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this._deleteActivityReward(row)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					})
				})
		},
		async _deleteActivityReward(row) {
			let params = {
				activityId: row.id,
				userName: this.$store.state.user.userInfo.clerkName,
			}
			let {
				data: { resultCode },
			} = await deleteActivityReward(params)
			if (resultCode == 0) {
				this.$message.success('操作成功')
				this._listPageMarketingReward()
			}
		},

		refit() {
			this._listPageMarketingReward()
		},
		handleView(row) {
			this.activityDataDialog = true
			this.activityDataRow = row
		},
		Refresh() {
			this._listPageMarketingReward()
		},
		findSearchParams(flag) {
			//搜索条件
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			let newSearchData = Object.assign(this.formData, this.paramJson)
			const paramJson = Object.assign(newSearchData, {
				length: this.page.length,
				currentPage: this.page.currentPage,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		_listPageMarketingReward: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listPageMarketingReward(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style>
.couponList .el-table .cell {
	white-space: pre-wrap;
}
</style>
