<template>
	<div class="brandStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
				v-loading="exportLoading"
			>
				<template #supplierName>
					<el-input
						v-model="formData101.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData101.supplierName = ''
								formData101.supplierAccountNumberId = ''
								getData102(true)
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<echarts
				v-if="chartData && chartData.length > 0"
				:option="chartData"
			></echarts>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
				:selectionChange="selectionChange"
			>
				<template slot="groupName" slot-scope="scope">
					<router-link
						class="blue"
						:to="{
							path: `/statistics/groupGoodsSaleStatistics/${scope.row.goodsGroupId}`,
						}"
					>
						{{ scope.row.groupName }}</router-link
					>
				</template>
			</yx-table>
			<!-- 商家/商家列表 -->
			<supply-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						formData101.supplierName = row.supplierName
						formData101.supplierAccountNumberId = row.supplierAccountNumberId
						this.getData102(true)
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getGoodsGroupStatistics,
	exportGoodsGroupStatistics,
} from '@/api/yhtPlusCmsStatistics'
import { downloadFile } from '@/utils/helper/common'
import moment from 'moment'
import SupplyDialog from '@/components/SupplyDialog'
import echarts from '../echarts'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		SupplyDialog,
		echarts,
	},
	props: [],
	data() {
		return {
			chartData: [],
			formsDialog: false,
			loading: false,
			exportLoading: false,
			formData101: {
				sortField: '11',
				startTime: moment().startOf('day').valueOf(), // 开始时间
				endTime: moment().endOf('day').valueOf(), // 结束时间
				keyword: '',
				supplierAccountNumberId: '',
				supplierName: '',
			},
			formCfg101: [
				{
					type: 'select',
					title: '排序',
					dataIndex: 'sortField',
					placeholder: '请输入排序',
					label: 'value',
					options: [
						{
							sortField: '1',
							value: '商品总数↓',
						},
						{
							sortField: '2',
							value: '商品总数↑',
						},
						{
							sortField: '3',
							value: '订单总额↓',
						},
						{
							sortField: '4',
							value: '订单总额↑',
						},
						{
							sortField: '5',
							value: '售卖时间↓',
						},
						{
							sortField: '6',
							value: '售卖时间↑',
						},
						{
							sortField: '7',
							value: '退货率↓',
						},
						{
							sortField: '8',
							value: '退货率↑',
						},
						{
							sortField: '9',
							value: '审核通过商品总数↓',
						},
						{
							sortField: '10',
							value: '审核通过商品总数↑',
						},
						{
							sortField: '11',
							value: '审核通过订单总额↓',
						},
						{
							sortField: '12',
							value: '审核通过订单总额↑',
						},
					],
				},
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierName',
				},
				{
					type: 'datetimerange',
					title: '售卖时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
					change: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					title: '',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '会场名称/分组名称',
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
				{
					title: '导出EXCEL',
					type: '',
					auth: 'exportCMSGoodsGroupOrderStatistics',
					click: () => {
						this.exportIt()
					},
					tableId: 102,
				},
			],
			tableData102: [
				{
					demo: 'test',
				},
			],
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					customRender: (row) => {
						return row.saleStartTime
							? moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'checkOrderQuantity',
					title: '审核通过订单数量指数',
				},
				{
					type: 'string',
					dataIndex: 'checkGoodsQuantity',
					title: '审核通过商品总数指数',
				},
				{
					type: 'amount',
					dataIndex: 'checkOrderAmount',
					title: '审核通过订单总额指数',
				},
				{
					type: 'string',
					dataIndex: 'totalOrderCount',
					title: '发完货订单数量指数',
				},
				{
					type: 'string',
					dataIndex: 'totalOrderGoodsQuantity',
					title: '发完货商品总数指数',
				},
				{
					type: 'amount',
					dataIndex: 'totalOrderAmount',
					title: '发完货订单总额指数',
				},
				{
					type: 'string',
					dataIndex: 'totalRefundGoodsQuantity',
					title: '退货商品总数指数',
				},
				{
					type: 'amount',
					dataIndex: 'totalRefundAmount',
					title: '退货退款总额指数',
				},
				{
					type: 'string',
					dataIndex: 'returnRate',
					title: '退货率指数',
				},
			],
			page102: {
				count: 1,
				length: 50,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},

	created() {
		this.getData102(true)
	},

	methods: {
		toDetail(e) {
			console.log(e)
		},
		selectionChange(list) {
			this.formData101.goodsGroupIdList =
				list &&
				list.length > 0 &&
				list.map((item) => {
					return item.goodsGroupId
				})
			this.chartData = list
		},
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams102()
			this.exportLoading = true
			let { data } = await exportGoodsGroupStatistics(paramJson)
			this.exportLoading = false
			downloadFile(data, 'excel.xls')
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupStatistics(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.goodsGroupList) {
				this.tableData102 = resultData.goodsGroupList
				this.page102.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
<style scoped>
.blue {
	color: #4498e0;
}
</style>
