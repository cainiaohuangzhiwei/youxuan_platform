<template>
	<div>
		<div class="view-step4-title">
			<div class="text">命中用户数量：{{ hitUserNum }}</div>
			<div class="text">
				营销成功用户数（统计全部成功）：{{ marketingSucUserNum }}
			</div>
		</div>

		<WgForm
			:inline="true"
			:data="searchFormData"
			:items="formCfg"
			:formAction="searchAction"
		>
		</WgForm>

		<WgTable
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableList"
		>
		</WgTable>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
import WgTable from '@/components/WgTable'
import {
	getImplementationStatistics,
	seeImplementationPage,
	exportImplementationExcel,
} from '@/api/userOperation'
import moment from 'moment'

// 执行结果状态:0:待执行,1:成功,2:失败
const STATUS_TYPE = {
	ALL: '',
	PENDING: 0,
	SUCCESS: 1,
	FAIL: 2,
}

export default {
	components: {
		WgForm,
		WgTable,
	},
	name: 'Step4',
	data() {
		return {
			searchFormData: {
				currentUserId: '',
				organizationId: '',
				implementationStatus: STATUS_TYPE.ALL,
			},
			hitUserNum: '-',
			marketingSucUserNum: '-',
			tableList: [],
			formCfg: [
				{
					title: '用户ID',
					type: 'input',
					dataIndex: 'currentUserId',
					placeholder: '精确搜索',
				},
				{
					title: '店铺ID：',
					type: 'input',
					dataIndex: 'organizationId',
					placeholder: '精确搜索',
				},
				{
					title: '执行结果：',
					type: 'select',
					dataIndex: 'implementationStatus',
					label: 'text',
					options: [
						{
							text: '全部',
							implementationStatus: STATUS_TYPE.ALL,
						},
						{
							text: '待执行',
							implementationStatus: STATUS_TYPE.PENDING,
						},
						{
							text: '成功',
							implementationStatus: STATUS_TYPE.SUCCESS,
						},
						{
							text: '失败',
							implementationStatus: STATUS_TYPE.FAIL,
						},
					],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this.getStatistics()
						this.getData(true)
					},
				},
				{
					title: '导出',
					type: 'danger',
					align: 'right',
					click: () => {
						this.exportResult()
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺ID',
				},

				{
					type: 'string',
					dataIndex: 'triggerTime',
					title: '触发时间',
					customRender: (record) => {
						return moment(record.triggerTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},

				{
					type: 'string',
					dataIndex: 'marketingBehaviorTime',
					title: '营销行为时间',
					customRender: (record) => {
						return moment(record.marketingBehaviorTime).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					},
				},

				{
					type: 'string',
					dataIndex: 'marketingConfig',
					title: '营销配置',
				},

				{
					type: 'string',
					dataIndex: 'implementationResult',
					title: '执行结果',
					customRender: (row) => {
						return row.implementationResult === STATUS_TYPE.SUCCESS ? (
							<el-tag type="success">成功</el-tag>
						) : row.implementationResult === STATUS_TYPE.FAIL ? (
							<el-tag type="danger">失败</el-tag>
						) : (
							<el-tag type="warning">待执行</el-tag>
						)
					},
				},

				{
					type: 'string',
					dataIndex: 'failReason',
					title: '备注',
					customRender: (row) => {
						return row.implementationResult === STATUS_TYPE.SUCCESS
							? '/'
							: row.implementationResult === STATUS_TYPE.FAIL
							? row.failReason
							: '待执行'
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getStatistics()
					this.getData()
				},
			},
		}
	},
	mounted() {
		this.getData()
		this.getStatistics()
	},
	methods: {
		// 搜索条件
		findSearchParams(flag) {
			//搜索条件
			const paramJson = Object.assign(
				{
					pageNum: 1,
					pageSize: 10,
					strategyId: this.$route.params.id,
				},
				this.searchFormData
			)
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},

		async getData(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData, total },
			} = await seeImplementationPage(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableList = resultData
				this.page.count = total
			} else {
				this.page.count = 0
				this.tableList = []
			}
		},
		// 执行情况统计维度
		async getStatistics() {
			const {
				data: { resultCode, resultData },
			} = await getImplementationStatistics({
				strategyId: this.$route.params.id,
			})
			if (resultCode === 0) {
				this.hitUserNum = resultData.hitUserNum
				this.marketingSucUserNum = resultData.marketingSucUserNum
			}
		},
		// 导出数据
		async exportResult() {
			const paramJson = this.findSearchParams()
			const {
				data: { resultCode, resultData },
			} = await exportImplementationExcel(paramJson)
			if (resultCode === 0) {
				// 确认弹窗
				this.$confirm(resultData, '提示', {
					confirmButtonText: '去下载中心',
					type: 'success',
				}).then(() => {
					this.$router.push({
						path: '/business/downloadCenter',
					})
				})
			}
		},
	},
}
</script>

<style lang="scss">
.view-step4-title {
	font-size: 20px;
	font-weight: bold;
	display: flex;
	margin-bottom: 40px;

	.text {
		margin-right: 50px;
	}
}
</style>
