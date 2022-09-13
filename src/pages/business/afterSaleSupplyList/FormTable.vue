<template>
	<div class="afterSaleOrderList">
		<basicContainer>
			<yx-form
				:inline="true"
				labelWidth="96px"
				:data="formData115"
				:items="formCfg115"
				:formAction="formAction115"
				:actionInline="true"
			>
				<template #supplierName>
					<el-input
						v-model="formData115.supplierName"
						placeholder="请选择商家"
						value-key="supplierId"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData115.supplierName = ''
								formData115.supplierId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="supplyDialogVisible = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns115"
				:pagination="page115"
				:data="tableData115"
			>
				<template slot="orderSn" slot-scope="scope">
					<el-button type="text">
						<router-link :to="`/business/orderDetails/${scope.row.orderId}`">{{
							scope.row.orderSn
						}}</router-link>
					</el-button>
				</template>
			</yx-table>

			<supply-dialog
				:itemInfo="supplierRow"
				chooseType="checkbox"
				:visible.sync="supplyDialogVisible"
				@fatherMethodInit="
					(row) => {
						formData115.supplierId = row.supplierId
						formData115.supplierName = row.supplierName
						if (!this.loading) this.getData115(true)
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import SupplyDialog from '@/components/SupplyDialog'
import { downloadFile } from '@/utils/helper/common'
import {
	supplierTurnonAfterSalesPage,
	supplierTurnonAfterSalesExport,
} from '@/api/afterSales'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		SupplyDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			supplyDialogVisible: false,
			formData115: {
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				addTimeList: [moment().startOf('month'), moment().endOf('month')],
				orderSn: '',
				supplierName: '',
				supplierId: '',
			},
			formCfg115: [
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
					enter: () => {
						if (!this.loading) this.getData115(true)
					},
				},
				{
					type: 'custom',
					title: '商家名称',
					dataIndex: 'supplierName',
					colSpan: 6,
				},
				{
					type: 'time',
					title: '开启时间',
					dataIndex: 'addTimeList',
					colSpan: 12,
					change: () => {
						this.formData115.addTimeList = this.formData115.addTimeList || [
							'',
							'',
						]
						let startTime = this.formData115.addTimeList[0]
						let endTime = this.formData115.addTimeList[1]
						this.formData115.addTimeStart = startTime
							? moment(startTime).valueOf()
							: ''
						this.formData115.addTimeEnd = endTime
							? moment(endTime).valueOf()
							: ''
					},
					timeAttributes: {
						type: 'datetimerange',
					},
				},
			],
			formAction115: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData115()
					},
				},
				{
					title: '导出',
					auth: 'supplierTurnonAfterSalesExport',
					click: () => {
						this.$confirm('确定导出商家开启售后单列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.findSearchParams115(true)
									let paramJson_ = { ...paramJson }
									const { data } = await supplierTurnonAfterSalesExport(
										paramJson_
									)
									if (data) {
										downloadFile(data, '商家开启售后单列表.xlsx')
									}
								}
							},
						})
					},
				},
			],
			tableData115: [],
			// 表格列设置
			tableColumns115: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单编号',
					width: '180',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'date',
					dataIndex: 'orderConfirmDeliverTime',
					title: '订单确认收货时间',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '开启时间',
				},
			],
			page115: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData115()
				},
			},
		}
	},

	created() {
		this.getData115()
	},

	methods: {
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
		},
		findSearchParams115(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page115.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					pageNum: this.page115.currentPage,
					pageSize: this.page115.length,
				},
				this.formData115
			)
			return paramJson
		},
		async getData115(flag) {
			this.loading = true
			let paramJson = this.findSearchParams115(flag)
			let paramJson_ = { ...paramJson }
			const {
				data: { resultCode, resultData },
			} = await supplierTurnonAfterSalesPage(paramJson_)
			if (resultCode === 0) {
				this.tableData115 = resultData.records
				this.page115.count = resultData.total
			}
			this.loading = false
		},
	},
}
</script>
