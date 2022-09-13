<template>
	<basic-container>
		<div>
			<yx-form :inline="true" :formAction="oneformAction"></yx-form>
			<el-row>
				<yx-table
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					:actionInline="true"
					v-loading="tableLoading"
				>
				</yx-table>
			</el-row>
			<create-claim-plan
				ref="createForm"
				:dialogVisible.sync="dialogClaimVisible"
				:editItem.sync="editItem"
				@updateList="_listAllowancePlan(true)"
			></create-claim-plan>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import createClaimPlan from './createClaimPlan'
import moment from 'moment'
// import { getBigImg } from '@/utils/imageTool'
// import { downloadFile } from '@/utils/helper/common'

import { listAllowancePlan, endAllowancePlan } from '@/api/shoppingAllowance'
export default {
	components: {
		BasicContainer,
		createClaimPlan,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			editItem: {},
			dialogClaimVisible: false,
			tableData: [],
			tableLoading: false,
			oneformAction: [
				{
					title: '创建领取计划',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.addPlan()
					},
				},
			],
			tableColumns: [
				{
					width: 80,
					dataIndex: 'actAllowancePlanId',
					title: '计划ID',
				},
				{
					width: 80,
					dataIndex: 'actAllowanceId',
					title: '津贴ID',
				},
				{
					dataIndex: 'actAllowancePlanName',
					title: '计划名称',
					customRender: (row) => {
						if (row.actAllowancePlanName) {
							return row.actAllowancePlanName
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'startTime',
					title: '领取时间',
					width: 285,
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							' - ' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					dataIndex: 'planAmount',
					title: '限领额度',
				},
				{
					dataIndex: 'planState',
					title: '计划状态',
					customRender: (row) => {
						if (row.planState == 1) {
							return '未开始'
						} else if (row.planState == 2) {
							return '进行中'
						} else if (row.planState == 3) {
							return '已结束'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '修改',
							// auth: 'getOrganizationDetails',
							click: (row) => {
								this.addPlan(row)
							},
							customRender: (action, row) => {
								action.hide = row.planState != 1
								return action
							},
						},
						{
							title: '结束',
							// auth: 'checkGoodsPrice',
							click: (row) => {
								this.$confirm('确定结束?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
									.then(() => {
										this._endAllowancePlan(row)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消',
										})
									})
							},
							customRender: (action, row) => {
								action.hide = row.planState == 3
								return action
							},
						},
						{
							title: '-',
							// auth: 'getOrganizationDetails',
							customRender: (action, row) => {
								action.hide = row.planState != 3
								return action
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
					this.getYouxuanGoodsAuditListByParam()
				},
			},
		}
	},
	created() {
		this._listAllowancePlan()
	},
	methods: {
		async _listAllowancePlan() {
			this.tableLoading = true
			let { data } = await listAllowancePlan()
			this.tableLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData.records
				this.page.count = data.resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		async _endAllowancePlan(row) {
			this.tableLoading = true
			let parent = {
				actAllowancePlanId: row.actAllowancePlanId,
				endState: 1,
			}
			let { data } = await endAllowancePlan(parent)
			this.tableLoading = false
			if (data.resultCode == 0) {
				this._listAllowancePlan()
			}
		},
		async addPlan(row) {
			// 新建津贴限额计划
			if (row && row.actAllowancePlanId) {
				// 编辑津贴限额计划
				this.editItem = row
			} else {
				this.editItem = {}
			}
			this.dialogClaimVisible = true
		},
	},
}
</script>

<style lang="scss" scope>
.brandSelect {
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 16px;
}
.brandLeft {
	display: flex;
}
.one {
	font-size: 14px;
	color: #606266;
	min-width: 46px;
}
.brandRight {
	color: #4498e0;
	cursor: pointer;
	min-width: 40px;
}
.moreSelect {
	display: flex;
	margin-bottom: 16px;
}
.two {
	// flex: 1;
	width: 100%;
}
.t-top {
	width: 100%;
	border: 1px solid #e6e6e6;
	padding: 10px 0 0 10px;
	box-sizing: border-box;
	height: 200px;
	overflow: hidden;
	overflow-y: auto;
}
.t-bot {
	width: 100%;
	padding: 10px;
	border: 1px solid #e6e6e6;
	border-top: none;
	font-size: 16px;
	color: #4c4c4c;
	word-break: break-all;
	word-wrap: break-word;
}
.tb-b {
	width: 100%;
	text-align: center;
	margin-top: 20px;
}
.mb10 {
	margin-bottom: 10px;
}
.poster_img {
	width: 50px;
	height: 50px;
	line-height: 50px;
	margin-right: 6px;
	// margin-right: 20px;
}
.info {
	display: flex;
	align-items: center;
	color: #4498e0;
	cursor: pointer;
}
</style>
