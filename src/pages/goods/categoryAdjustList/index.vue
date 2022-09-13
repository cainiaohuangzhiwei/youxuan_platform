<template>
	<div class="batchFixPriceList">
		<WgForm
			:inline="true"
			:actionInline="true"
			:data="formData105"
			:items="formCfg105"
			:formAction="formAction105"
		>
		</WgForm>
		<WgTable
			:select="true"
			v-loading="loading"
			:columns="tableColumns106"
			:pagination="page106"
			:data="tableData106"
		>
		</WgTable>
	</div>
</template>
<script>
import WgForm from '@/components/WgForm'
import WgTable from '@/components/WgTable'
import {
	goodsCategoryChangePage,
	exportGoodsCategoryChange,
} from '@/api/yhtPlusWebGoods'
import { downloadFile } from '@/utils/helper/common'
import moment from 'moment'
export default {
	name: 'CategoryAdjustList',
	components: {
		WgForm,
		WgTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData105: {
				status: '',
				thirdCategoryName: '',
				startAddTime: '',
				endAddTime: '',
				addTimeList: ['', ''],
				// startAddTime: moment().startOf('month').valueOf(),
				// endAddTime: moment().endOf('month').valueOf(),
				// addTimeList: [moment().startOf('month'), moment().endOf('month')],
			},
			formCfg105: [
				{
					type: 'input',
					title: '三级类目名称',
					dataIndex: 'thirdCategoryName',
				},
				{
					type: 'select',
					title: '处理状态',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 2,
							value: '处理中',
						},
						{
							status: 3,
							value: '处理成功',
						},
						{
							status: 4,
							value: '处理失败',
						},
					],
				},
				{
					type: 'time',
					title: '添加时间',
					dataIndex: 'addTimeList',
					colSpan: 12,
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
						pickerOptions: {
							shortcuts: [
								{
									text: '今日',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('days'),
											moment().endOf('days'),
										])
									},
								},
								{
									text: '昨日',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'days').startOf('days'),
											moment().subtract(1, 'days').endOf('days'),
										])
									},
								},
								{
									text: '本周',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('week'),
											moment().endOf('week'),
										])
									},
								},
								{
									text: '上周',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'week').startOf('week'),
											moment().subtract(1, 'week').endOf('week'),
										])
									},
								},
								{
									text: '本月',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('months'),
											moment().endOf('months'),
										])
									},
								},
								{
									text: '上月',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'months').startOf('months'),
											moment().subtract(1, 'months').endOf('months'),
										])
									},
								},
							],
						},
					},
				},
			],
			formAction105: [
				{
					title: '重置',
					isClear: true,
					align: 'right',
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this.queryGoodsCategoryChangeList(true)
					},
				},
				{
					title: '导入类目调整数据',
					type: 'primary',
					auth: 'importGoodsCategoryChange',
					click: () => {
						this.importCategoryAdjust()
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportGoodsCategoryChange',
					click: () => {
						this.importList()
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'thirdCategoryId',
					title: '三级类目ID',
					renderHeader: () => {
						return (
							<div>
								三级
								<br />
								类目ID
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'thirdCategoryName',
					title: '三级类目名称',
					renderHeader: () => {
						return (
							<div>
								三级
								<br />
								类目名称
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'oldSecondCategoryName',
					title: '原二级类目名称',
					renderHeader: () => {
						return (
							<div>
								原二级
								<br />
								类目名称
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'oldFirstCategoryName',
					title: '原一级类目名称',
					renderHeader: () => {
						return (
							<div>
								原一级
								<br />
								类目名称
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'newSecondCategoryId',
					title: '新二级类目ID',
					renderHeader: () => {
						return (
							<div>
								新二级
								<br />
								类目ID
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'newSecondCategoryName',
					title: '新二级类目名称',
					renderHeader: () => {
						return (
							<div>
								新二级
								<br />
								类目名称
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'newFirstCategoryId',
					title: '新一级类目ID',
					renderHeader: () => {
						return (
							<div>
								新一级
								<br />
								类目ID
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'newFirstCategoryName',
					title: '新一级类目名称',
					renderHeader: () => {
						return (
							<div>
								新一级
								<br />
								类目名称
							</div>
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '处理状态',
					customRender: (row) => {
						return row.status == 1
							? '待处理'
							: row.status == 2
							? '处理中'
							: row.status == 3
							? '处理成功'
							: row.status == 4
							? '处理失败'
							: '-'
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
					width: '134',
				},
				{
					type: 'data',
					dataIndex: 'completeTime',
					title: '完成时间',
					width: '134',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
			],
			page106: {
				currentPage: 1,
				length: 10,
				startIndex: 0,
				tableChange: () => {
					this.queryGoodsCategoryChangeList()
				},
			},
		}
	},

	methods: {
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			this.formData105.addTimeList = this.formData105.addTimeList || ['', '']
			let startAddTime = this.formData105.addTimeList[0]
			let endAddTime = this.formData105.addTimeList[1]
			this.formData105.startAddTime = startAddTime
				? moment(startAddTime).valueOf()
				: ''
			this.formData105.endAddTime = endAddTime
				? moment(endAddTime).valueOf()
				: ''
			const paramJson = Object.assign(
				{
					length: this.page106.length,
					startIndex: (this.page106.currentPage - 1) * this.page106.length,
					pageNum: this.page106.currentPage,
					pageSize: this.page106.length,
				},
				this.formData105
			)
			delete paramJson.addTimeList
			return paramJson
		},
		queryGoodsCategoryChangeList: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await goodsCategoryChangePage(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData106 = resultData || []
				this.page106.count = total
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
		importCategoryAdjust() {
			this.$router.push({
				path: '/goods/categoryAdjustImport',
			})
		},
		async importList() {
			let paramJson = this.findSearchParams106()
			let { data } = await exportGoodsCategoryChange(paramJson)
			data && downloadFile(data, '商品类目调整记录.xlsx')
		},
	},
}
</script>
