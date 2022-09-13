<template>
	<div class="refundRateStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData113"
				:items="formCfg113"
				:formAction="formAction113"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns114"
				:pagination="page114"
				:data="tableData114"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	findOrganizationRefundCountByparam,
	exportOrganizationRefundCountByCondition,
} from '@/api/yhtPlusCmsOrganization'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData113: {
				sortField: '',
				keyword: '',
				phone: '',
			},
			formCfg113: [
				{
					type: 'select',
					title: '排序',
					dataIndex: 'sortField',
					placeholder: '请输入排序',
					label: 'value',
					options: [
						{
							sortField: '',
							value: '全部',
						},
						{
							sortField: '1',
							value: '销售订单数↓',
						},
						{
							sortField: '2',
							value: '销售订单数↑',
						},
						{
							sortField: '3',
							value: '销售商品数↓',
						},
						{
							sortField: '4',
							value: '销售商品数↑',
						},
						{
							sortField: '5',
							value: '退款订单数↓',
						},
						{
							sortField: '6',
							value: '退款订单数↑',
						},
						{
							sortField: '7',
							value: '退款商品数↓',
						},
						{
							sortField: '8',
							value: '退款商品数↑',
						},
						{
							sortField: '9',
							value: '退货率↓',
						},
						{
							sortField: '10',
							value: '退货率↑',
						},
					],
					change: () => {
						this.getData114(true)
					},
				},
				{
					type: 'input',
					title: '店铺名称',
					dataIndex: 'keyword',
					placeholder: '请输入店铺名称',
					enter: () => {
						this.getData114(true)
					},
				},
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'phone',
					placeholder: '请输入手机号',
					enter: () => {
						this.getData114(true)
					},
				},
			],
			formAction113: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData114(true)
					},
					tableId: 114,
				},
				{
					title: '导出Excel',
					type: '',
					auth: 'exportOrganizationRefundCountByCondition',
					click: async () => {
						// 导出数据
						let paramJson = this.findSearchParams114()
						let { data } = await exportOrganizationRefundCountByCondition(
							paramJson
						)
						downloadFile(data, 'excel.xls')
					},
				},
			],
			tableData114: [],
			tableColumns114: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺ID',
				},
				{
					type: 'action',
					dataIndex: 'orderSn',
					title: '店铺名称',
					width: 200,
					actions: [
						{
							title: '店铺名称',
							click: (row) => {
								this.$router.push({
									path: `/shop/shop/shopDetail/${row.organizationId}`,
								})
							},
							customRender: (action, row) => {
								action.title = row.organizationName
								return action
							},
						},
					],
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'levelName',
					title: '店铺等级',
					customRender: (row) => {
						return row.levelName || '普通店主'
					},
				},
				{
					type: 'string',
					dataIndex: 'orderCount',
					title: '订单数',
				},
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '订单商品数',
				},
				{
					type: 'string',
					dataIndex: 'orderRefundCount',
					title: '退单数',
				},
				{
					type: 'string',
					dataIndex: 'goodsRefundCount',
					title: '退单商品数',
				},
				{
					type: 'string',
					dataIndex: 'returnRate',
					title: '售后率',
					customRender: (row) => {
						return row.returnRate + '%'
					},
				},
			],
			page114: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData114()
				},
			},
		}
	},

	methods: {
		async getData114(flag) {
			this.loading = true
			let paramJson = this.findSearchParams114(flag)
			const {
				data: { resultCode, resultData },
			} = await findOrganizationRefundCountByparam(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.list) {
				this.tableData114 = resultData.list
				this.page114.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams114(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page114.currentPage = 1
			}

			const paramJson = Object.assign(this.formData113, {
				length: this.page114.length,
				startIndex: (this.page114.currentPage - 1) * this.page114.length,
			})
			if (this.formData113.sortField == 1) {
				paramJson.orderBy = 'orderCount'
				paramJson.orderWay = 1
			} else if (this.formData113.sortField == 2) {
				paramJson.orderBy = 'orderCount'
				paramJson.orderWay = 0
			} else if (this.formData113.sortField == 3) {
				paramJson.orderBy = 'goodsCount'
				paramJson.orderWay = 1
			} else if (this.formData113.sortField == 4) {
				paramJson.orderBy = 'goodsCount'
				paramJson.orderWay = 0
			} else if (this.formData113.sortField == 5) {
				paramJson.orderBy = 'orderRefundCount'
				paramJson.orderWay = 1
			} else if (this.formData113.sortField == 6) {
				paramJson.orderBy = 'orderRefundCount'
				paramJson.orderWay = 0
			} else if (this.formData113.sortField == 7) {
				paramJson.orderBy = 'goodsRefundCount'
				paramJson.orderWay = 1
			} else if (this.formData113.sortField == 8) {
				paramJson.orderBy = 'goodsRefundCount'
				paramJson.orderWay = 0
			} else if (this.formData113.sortField == 9) {
				paramJson.orderBy = 'returnRate'
				paramJson.orderWay = 1
			} else if (this.formData113.sortField == 10) {
				paramJson.orderBy = 'returnRate'
				paramJson.orderWay = 0
			}
			return paramJson
		},
	},
}
</script>
