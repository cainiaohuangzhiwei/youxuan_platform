<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableDataBrand"
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
// import { wgGetDate } from '@/utils/helper/common'

import { queryFixedPriceBrandList, syncGoods } from '@/api/brandRecord'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'fixedPriceEventVenue',
	props: [],
	data() {
		return {
			moment: moment,
			loading: false,
			tableDataBrand: [],
			selectedList: [],
			businessLicenseImg: '',
			formData105: {
				actName: '', //上游活动名称
				endStatus: '', //是否结束 0未结束 1已经结束
				refBrandName: '', //会场名称
				fixedPriceStartTime: '', //活动开始时间
				fixedPriceEndTime: '', //活动结束时间
				actStartTime: '', //wgGetDate().getMonthStartDate, //活动开始时间
				actEndTime: '', //wgGetDate().getMonthEndDate, //活动结束时间
				fixedPriceActState: '', //一口价活动状态
			},
			formCfg105: [
				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'refBrandName',
					placeholder: '请输入会场名称',
				},
				{
					type: 'input',
					title: '上游活动名称',
					dataIndex: 'actName',
					placeholder: '请输入上游活动名称',
				},
				{
					title: '一口价时间',
					type: 'datetimerange',
					dataIndex: ['fixedPriceStartTime', 'fixedPriceEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'select',
					title: '一口价活动状态',
					dataIndex: 'fixedPriceActState',
					placeholder: '请选择一口价活动状态',
					label: 'value',
					options: [
						{
							fixedPriceActState: '',
							value: '全部',
						},
						{
							fixedPriceActState: 1,
							value: '未开始',
						},
						{
							fixedPriceActState: 2,
							value: '进行中',
						},
						{
							fixedPriceActState: 3,
							value: '已结束',
						},
					],
				},
				{
					title: '会场时间',
					type: 'datetimerange',
					dataIndex: ['actStartTime', 'actEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction105: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this.getSearchBrandRecord(true, e)
					},
				},
			],
			tableColumns106: [
				{
					width: 80,
					type: 'string',
					dataIndex: 'refBrandId',
					title: '会场ID',
				},
				{
					type: 'string',
					dataIndex: 'refBrandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'actName',
					title: '上游活动名称',
				},
				{
					type: 'data',
					dataIndex: 'actStartTime',
					title: '会场开始时间',
				},
				{
					type: 'data',
					dataIndex: 'actEndTime',
					title: '会场结束时间',
				},
				{
					type: 'string',
					dataIndex: 'fixedPriceActState',
					title: '一口价活动状态',
					customRender: (row) => {
						return row.fixedPriceActState == 1
							? '未开始'
							: row.fixedPriceActState == 2
							? '进行中'
							: row.fixedPriceActState == 3
							? '已结束'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'goodsSyncState',
					title: '商品同步状态',
					customRender: (row) => {
						return row.goodsSyncState == 0
							? '待同步'
							: row.goodsSyncState == 1
							? '同步中'
							: row.goodsSyncState == 2
							? '已同步'
							: row.goodsSyncState == 3
							? '同步失败'
							: '-'
					},
				},
				{
					type: 'data',
					dataIndex: 'fixedPriceStartTime',
					title: '一口价开始时间',
				},
				{
					type: 'data',
					dataIndex: 'fixedPriceEndTime',
					title: '一口价结束时间',
				},
				{
					type: 'data',
					dataIndex: 'lastGoodsSyncTime',
					title: '最后同步时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '同步一口价商品',
							auth: 'syncGoods02',
							popconfirm: true,
							popconfirmTitle: '确认同步一口价该商品？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.synchronousGoods(row)
							},
							customRender: (action, row) => {
								action.hide = row.fixedPriceActState == 3
								return action
							},
						},

						{
							title: '查看一口价商品',
							auth: 'queryAkcBrandFixedPriceGoodsList01',
							click: (row) => {
								this.$router.push({
									path: `/goods/fixedPriceProductList/${row.actId}/${row.refBrandId}/${row.marketId}`,
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
					this.getSearchBrandRecord()
				},
			},
		}
	},

	created() {
		this.getSearchBrandRecord(true)
	},

	methods: {
		synchronousGoods: async function (row) {
			let paramJson = {
				activityId: String(row.actId),
				syncType: 2,
				activityType: 1,
				marketId: row.marketId,
				refBrandId: row.refBrandId,
			}

			let {
				data: { resultCode, resultMsg },
			} = await syncGoods([paramJson])
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getSearchBrandRecord()
			}
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				// startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			paramJson.currentPage = this.page106.currentPage
			paramJson.type = this.formData105.sourceType
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			return paramJson
		},
		getSearchBrandRecord: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			this.loading = true
			let {
				data: { resultData, resultCode, total },
			} = await queryFixedPriceBrandList(paramJson)
			if (resultCode == 0) {
				this.tableDataBrand = resultData
				this.page106.count = total
				this.loading = false
			} else {
				this.page106.count = 0
				this.tableDataBrand = []
				this.loading = false
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
