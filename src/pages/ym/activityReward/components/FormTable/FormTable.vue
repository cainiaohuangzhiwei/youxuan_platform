<template>
	<div>
		<WgForm
			v-loading="exportLoading"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
			:actionInline="true"
			labelWidth="68px"
		></WgForm>

		<WgTable
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="actName" slot-scope="scope">
				<div>{{ scope.row.actName }}</div>
				<div class="sub-text">
					{{
						moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') +
						'~' +
						moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')
					}}
				</div>
			</template>
			<template slot="actStatus" slot-scope="scope">
				<div v-html="findSaleStateString(scope.row)"></div>
			</template>
			<template slot="operator" slot-scope="scope">
				<div>{{ scope.row.operator }}</div>
				<div>
					{{ moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm') }}
				</div>
			</template>
		</WgTable>

		<EditDialog
			ref="activityEdit"
			:visible.sync="activityEditDialog"
			@fatherMethodInit="fatherMethodInit"
		/>

		<EditSettleTimeDialog
			ref="settleTimeEdit"
			:settleRow="settleRow"
			:visible.sync="settleTimeEditDialog"
			@fatherMethodInit="fatherMethodInit"
		/>
	</div>
</template>

<script>
import moment from 'moment'
import WgForm from '@/components/WgForm'
import WgTable from '@/components/WgTable'
import EditDialog from './EditDialog'
import EditSettleTimeDialog from './EditSettleTimeDialog'

import { listPage } from '@/api/marketing'
export default {
	components: {
		WgTable,
		WgForm,
		EditDialog,
		EditSettleTimeDialog,
	},

	name: 'FormTable',

	data() {
		return {
			actTypeMap: { 1: '阶梯型奖励活动', 2: '每满型奖励活动' },
			ruleCondTypeMap: {
				1: '实付金额',
				2: '有效商品数',
				3: '基础佣金',
				4: '卖货佣金',
				5: '有效订单数',
			},
			moment,
			exportLoading: false,
			loading: false,
			activityEditDialog: false,
			settleTimeEditDialog: false,
			settleRow: {},
			searchData: {
				actId: '', // 活动id
				actName: '', //活动名称
				status: '', //活动状态
				actType: '', //活动类型
			},
			searchCfg: [
				{
					title: '活动ID',
					type: 'input',
					dataIndex: 'actId',
				},
				{
					title: '活动名称',
					type: 'input',
					dataIndex: 'actName',
				},
				{
					title: '活动状态',
					type: 'select',
					dataIndex: 'status',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 1,
							value: '未开始',
						},
						{
							status: 2,
							value: '进行中',
						},
						{
							status: 3,
							value: '已结束',
						},
					],
					label: 'value',
				},
				{
					title: '活动类型',
					type: 'select',
					dataIndex: 'actType',
					options: [
						{
							actType: '',
							value: '全部',
						},
						{
							actType: 1,
							value: '阶梯型奖励活动',
						},
						{
							actType: 2,
							value: '每满型奖励活动',
						},
					],
					label: 'value',
				},
			],
			searchAction: [
				{
					title: '新建活动',
					auth: 'userCashRewardListPage',
					type: 'primary',
					align: 'left',
					click: () => {
						this.addActivity(1)
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'id',
					title: '活动ID',
					align: 'center',
					width: '90',
				},
				{
					type: 'custom',
					dataIndex: 'actName',
					title: '活动名称',
				},
				{
					dataIndex: 'actType',
					title: '活动类型',
					width: '200',
					customRender: (row) => {
						return (
							this.actTypeMap[row.actType] +
							(row.ruleBO && row.ruleBO.ruleCondType
								? '-' + this.ruleCondTypeMap[row.ruleBO.ruleCondType]
								: '')
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'actSettleTime',
					title: '结算时间',
					width: '160',
					customRender: (row) => {
						return row.actSettleTime
							? moment(row.actSettleTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'actStatus',
					title: '活动状态',
					width: '120',
				},
				{
					type: 'custom',
					dataIndex: 'operator',
					title: '最后操作人',
					width: '140',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							auth: 'userCashRewardListPage',
							click: (row) => {
								this.addActivity(2, row)
							},
							customRender: (action, row) => {
								const now = new Date().getTime()
								action.hide = row.endTime < now
								return action
							},
						},
						{
							title: '查看配置',
							auth: 'userCashRewardListPage',
							click: (row) => {
								this.addActivity(3, row)
							},
							customRender: (action, row) => {
								const now = new Date().getTime()
								action.hide = row.endTime >= now
								return action
							},
						},
						{
							title: '结算设置',
							auth: 'updateActSettleTime',
							click: (row) => {
								this.settleRow = row
								this.showSettleTimeEditDialog(row)
							},
							customRender: (action, row) => {
								const now = new Date().getTime()
								action.hide =
									(row.actSettleTime && now > row.actSettleTime) ||
									row.grantStatus === 2
								return action
							},
						},
						{
							title: '查看数据',
							auth: 'sumCashRewardAmount',
							click: (row) => {
								this.$router.push({
									name: 'activityRewardData',
									params: { actId: row.id },
								})
							},
							customRender: (action) => {
								return action
							},
						},
						{
							title: '复制链接',
							click: (row) => {
								this.$copyText(
									`/subpages/cashRewardActivity/detail/index?id=${row.id}`
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
					this.init()
				},
			},
		}
	},

	created() {
		this.init()
	},

	methods: {
		findSaleStateString(row) {
			// 活动状态值
			let stateString, color
			const now = new Date().getTime()
			if (now < row.startTime) {
				stateString = '未开始'
				color = '#c41717'
			} else if (now >= row.startTime && now <= row.endTime) {
				color = '#4498E0'
				stateString = '进行中'
			} else if (now > row.endTime) {
				stateString = '已结束'
				color = '#b0b0b0'
			}
			return `<div><span style="width:8px;height:8px;background:${color};margin-right: 10px;display: inline-block;"></span><span style="color: ${color};">${stateString}</span></div>`
			// return `<el-tag type="${type}">${stateString}</el-tag>`
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

		fatherMethodInit() {
			this.init(true)
		},

		async init(flag) {
			const paramJson = this.findSearchParams(flag)

			if (paramJson.actId && isNaN(paramJson.actId)) {
				this.$message.warning('活动ID格式有误')
				return false
			}

			this.loading = true

			const {
				data: { resultData, total },
			} = await listPage(paramJson)

			if (resultData?.length > 0) {
				this.tableData = resultData
				if (this.page.currentPage === 1) {
					this.page.count = total
				}
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		addActivity(type, row = {}) {
			this.activityEditDialog = true
			this.$nextTick(() => {
				this.$refs.activityEdit.detail(type, row)
			})
		},

		showSettleTimeEditDialog(row = {}) {
			this.settleTimeEditDialog = true
			this.$nextTick(() => {
				this.$refs.settleTimeEdit.detail(row)
			})
		},
	},
}
</script>
