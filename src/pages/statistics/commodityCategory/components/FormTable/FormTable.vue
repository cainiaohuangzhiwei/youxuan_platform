<template>
	<div class="commodityCategory">
		<basicContainer v-loading="excelLoading">
			<yx-form
				:inline="true"
				:data="formData115"
				:items="formCfg115"
				:formAction="formAction115"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns116"
				:pagination="page116"
				:data="tableData116"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getCMSClassifyReservationList } from '@/api/yhtPlusCmsStatistics'
import { exportCMSClassifyReservationList } from '@/api/webImport'

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
			excelLoading: false,
			loading: false,
			formData115: {
				startTime: '',
				endTime: '',
			},
			formCfg115: [
				{
					type: 'datetimerange',
					title: '订单时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction115: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData116(true)
					},
					tableId: 116,
				},
				{
					title: '导出Excel',
					type: '',
					auth: 'exportCMSClassifyReservationList',
					click: async () => {
						// 导出数据
						let paramJson = this.findSearchParams116()
						this.excelLoading = true
						let { data } = await exportCMSClassifyReservationList(paramJson)
						this.excelLoading = false
						downloadFile(data, '商品类目利润统计.xls')
					},
				},
			],
			tableData116: [],
			tableColumns116: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '分类id',
				},
				{
					type: 'string',
					dataIndex: 'firstClassify',
					title: '分类名称',
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '订单商品数量',
				},
				{
					type: 'string',
					dataIndex: 'setProfitMargin',
					title: '设置利润率',
					customRender: (row) => {
						return row.setProfitMargin.toFixed(2) + '%'
					},
				},
				{
					type: 'string',
					dataIndex: 'totalProfitMargin',
					title: '实际利润率',
					customRender: (row) => {
						return row.totalProfitMargin.toFixed(2) + '%'
					},
				},
				{
					type: 'string',
					dataIndex: 'differenceProfitMargin',
					title: '利润率差值\n（实际利润率-设置利润率）',
					customRender: (row) => {
						return row.differenceProfitMargin.toFixed(2) + '%'
					},
				},
			],
			page116: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData116()
				},
			},
		}
	},

	methods: {
		async getData116(flag) {
			this.loading = true
			let paramJson = this.findSearchParams116(flag)
			const {
				data: { resultCode, resultData },
			} = await getCMSClassifyReservationList(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.brandCategoryClassifyList) {
				this.tableData116 = resultData.brandCategoryClassifyList
				this.page116.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams116(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page116.currentPage = 1
			}
			const paramJson = Object.assign(this.formData115, {
				length: this.page116.length,
				startIndex: (this.page116.currentPage - 1) * this.page116.length,
			})
			return paramJson
		},
	},
}
</script>
