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
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import { exportLiveDatas, getLiveDatas } from '@/api/livePlan'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			searchData: {
				livePlanId: '', // 直播ID
				livePlanNameLike: '', // 直播名称
				actualStartQuery: moment().startOf('month').valueOf(), // 开始时间
				actualEndQuery: moment().endOf('month').valueOf(), // 结束时间
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'input',
					title: '直播ID',
					dataIndex: 'livePlanId',
				},
				{
					type: 'input',
					title: '直播名称',
					dataIndex: 'livePlanNameLike',
				},
				{
					title: '直播时间',
					type: 'datetimerange',
					dataIndex: ['actualStartQuery', 'actualEndQuery'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callLiveDatas(true)
					},
				},
				{
					title: '导出Excel',
					type: 'primary',
					auth: 'exportLiveDatas',
					click: () => {
						this.exportLiveDatas()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'livePlanId',
					title: '直播ID',
				},
				{
					type: 'string',
					dataIndex: 'livePlanName',
					title: '直播名称',
				},
				{
					type: 'string',
					dataIndex: 'actualStartTime',
					title: '直播开始时间',
					customRender: (row) => {
						return row.actualStartTime
							? moment(row.actualStartTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'actualEndTime',
					title: '直播结束时间',
					customRender: (row) => {
						return row.actualEndTime
							? moment(row.actualEndTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'orderNumber',
					title: '订单数',
				},
				{
					type: 'string',
					dataIndex: 'orderSales',
					title: '订单销售额',
				},
				{
					type: 'string',
					dataIndex: 'viewerNumber',
					title: '观看人数',
				},
				{
					type: 'string',
					dataIndex: 'popularValue',
					title: '人气值',
				},
				{
					type: 'string',
					dataIndex: 'thumbUpNumber',
					title: '点赞数',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callLiveDatas()
				},
			},
		}
	},

	created() {
		this.callLiveDatas(true)
	},

	methods: {
		exportLiveDatas: async function () {
			// 导出数据
			let paramJson = Object.assign({}, this.searchData)
			let { data } = await exportLiveDatas(paramJson)
			downloadFile(data, '直播数据.xlsx')
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.actualStartQuery =
				moment(paramJson.actualStartQuery).valueOf() || ''
			paramJson.actualEndQuery =
				moment(paramJson.actualEndQuery).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		callLiveDatas: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getLiveDatas(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.livePlanList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>
