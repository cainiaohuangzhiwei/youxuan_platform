<template>
	<div>
		<WgForm
			:inline="true"
			:actionInline="true"
			:data="formData105"
			:items="formCfg105"
			:formAction="formAction105"
			labelWidth="96px"
		>
			<template #brandParentId>
				<el-select
					v-model="formData105.brandParentId"
					filterable
					remote
					clearable
					placeholder="请输入品牌名称"
					value-key="brandParentId"
					:remote-method="_getBrandParentList"
				>
					<el-option
						v-for="item in formDataBrandParentList"
						:key="item.brandParentId"
						:label="item.brandParentName"
						:value="item.brandParentId"
					>
					</el-option>
				</el-select>
			</template>
		</WgForm>
		<WgTable
			:select="true"
			v-loading="loading"
			:columns="tableColumns106"
			:pagination="page106"
			:data="tableData106"
		>
		</WgTable>
		<!-- 查看处理详情 -->
		<Dialog title="商品处理状态" :visible.sync="detailsDialog">
			<WgForm
				:inline="true"
				:data="detailsFormData"
				:items="detailsFormCfg"
				:formAction="detailsFormAction"
				:actionColSpan="7"
			>
			</WgForm>
			<WgTable
				v-loading="detailsLoading"
				:columns="detailsTableColumns"
				:pagination="detailsPage"
				:data="detailsTableData"
			>
			</WgTable>
		</Dialog>
	</div>
</template>
<script>
import WgForm from '@/components/WgForm'
import WgTable from '@/components/WgTable'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import {
	goodsRejectBatchPage,
	exportGoodsRejectBatch,
	goodsRejectBatchItemPage,
	getBrandParentList,
} from '@/api/yhtPlusWebGoods'
import { downloadFile } from '@/utils/helper/common'

export default {
	name: 'BatchRejectGoodsList',
	components: {
		WgForm,
		WgTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData105: {
				supplierNameList: '',
				supplierIdList: '',
				categoryName: '',
				brandParentId: '',
				status: '',
				startAddTime: '',
				endAddTime: '',
				addTimeList: ['', ''],
			},
			// 搜索品牌数据源
			formDataBrandParentList: [],
			formCfg105: [
				{
					type: 'textarea',
					title: '商家名称',
					dataIndex: 'supplierNameList',
					placeholder: '请输入商家名称,多个商家用逗号隔开或者换行',
				},
				{
					type: 'textarea',
					title: '商家ID',
					dataIndex: 'supplierIdList',
					placeholder: '请输入商家ID,多个商家用逗号隔开或者换行',
				},
				{
					type: 'input',
					title: '商品三级类目',
					dataIndex: 'categoryName',
				},
				{
					type: 'custom',
					title: '品牌',
					dataIndex: 'brandParentId',
					colSpan: 6,
				},
				{
					type: 'br',
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
					click: (e) => {
						this.queryGetRejectGoodsList(true, e)
					},
				},
				{
					title: '导入驳回商品数据',
					type: 'primary',
					auth: 'importGoodsRejectBatch',
					click: () => {
						this.importRejectGoods()
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportGoodsRejectBatch',
					click: () => {
						this.importList()
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌',
				},
				{
					type: 'string',
					dataIndex: 'thirdCategoryName',
					title: '类目',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '处理状态',
					customRender: (row) => {
						return row.status == 1
							? '未处理'
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
					type: 'string',
					dataIndex: 'erpName',
					title: '总商品数量/成功/失败',
					width: '140',
					customRender: (row) => {
						return row.totalNum + '/' + row.successNum + '/' + row.failNum
					},
				},
				{
					type: 'data',
					dataIndex: 'addTimeMilli',
					title: '添加时间',
					width: '134',
				},
				{
					type: 'data',
					dataIndex: 'completeTimeMilli',
					title: '完成时间',
					width: '134',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					auth: 'goodsRejectBatchItemPage',
					actions: [
						{
							title: '查看处理详情',
							click: (row) => {
								this.goodsRejectBatchId = row.goodsRejectBatchId
								this.detailsDialog = true
								this.detailsFormData = {
									goodsNumber: '',
									status: '',
								}
								this.viewProcessingDetails()
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
					this.queryGetRejectGoodsList()
				},
			},
			detailsDialog: false,
			detailsLoading: false,
			detailsTableData: [],
			detailsTableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '货号',
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
			],
			detailsPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.viewProcessingDetails()
				},
			},
			detailsFormData: {
				goodsNumber: '',
				status: '',
			}, //查看处理详情弹窗查询
			detailsFormCfg: [
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '请输入商品货号',
					colSpan: 8,
				},
				{
					type: 'select',
					title: '商品驳回处理状态',
					dataIndex: 'status',
					placeholder: '请选择商品驳回处理状态',
					label: 'value',
					colSpan: 9,
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: '2',
							value: '处理中',
						},
						{
							status: '3',
							value: '处理成功',
						},
						{
							status: '4',
							value: '处理失败',
						},
					],
				},
			],
			detailsFormAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.viewProcessingDetails(true)
					},
				},
			],
			goodsRejectBatchId: null,
		}
	},

	methods: {
		// 获取品牌列表
		async _getBrandParentList(query) {
			if (query !== '') {
				const paramJson = {
					startIndex: 0,
					length: 20,
					keyword: query,
				}
				const {
					data: { resultCode, resultData },
				} = await getBrandParentList(paramJson)

				if (resultCode == 0) {
					this.formDataBrandParentList = resultData.brandParentList || []
					return
				}
			}
			this.formDataBrandParentList = []
		},
		//查看处理详情
		async viewProcessingDetails(flag) {
			let paramJson = this.findSearchParamsDetails(flag)
			paramJson.goodsRejectBatchId = this.goodsRejectBatchId
			let {
				data: { resultCode, resultData, total },
			} = await goodsRejectBatchItemPage(paramJson)
			if (resultCode === 0) {
				this.detailsTableData = resultData || []
				this.detailsPage.count = total
			} else {
				this.detailsTableData = []
				this.detailsPage.count = 0
			}
		},
		//查看处理详情
		findSearchParamsDetails(flag) {
			// 当前页的条数开始
			if (flag) {
				this.detailsPage.currentPage = 1
			}
			const paramJson = Object.assign(this.detailsFormData, {
				length: this.detailsPage.length,
				startIndex:
					(this.detailsPage.currentPage - 1) * this.detailsPage.length,
				pageNum: this.detailsPage.currentPage,
				pageSize: this.detailsPage.length,
			})
			return paramJson
		},
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
			paramJson.supplierIdList = paramJson.supplierIdList.replace(/\n/g, ',')
			paramJson.supplierIdList = paramJson.supplierIdList.replace(/\s*/g, '')
			paramJson.supplierNameList = paramJson.supplierNameList.replace(
				/\n/g,
				','
			)
			paramJson.supplierNameList = paramJson.supplierNameList.replace(
				/\s*/g,
				''
			)
			delete paramJson.addTimeList
			return paramJson
		},
		queryGetRejectGoodsList: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			if (paramJson.supplierIdList && paramJson.supplierNameList) {
				this.$message.warning('商家id和商家名称不能同时查询')
				return
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await goodsRejectBatchPage(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData106 = resultData || []
				this.page106.count = total
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
		importRejectGoods() {
			this.$router.push({
				path: '/goods/batchRejectGoodsImport',
			})
		},
		async importList() {
			let paramJson = this.findSearchParams106()
			let { data } = await exportGoodsRejectBatch(paramJson)
			data && downloadFile(data, '批量驳回商品列表.xlsx')
		},
	},
}
</script>
<style>
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
.number {
	margin-right: 10px;
}
.goods_name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
}
</style>
