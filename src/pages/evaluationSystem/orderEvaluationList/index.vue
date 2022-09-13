<template>
	<basicContainer>
		<yx-form
			:inline="true"
			:data="formData187"
			:items="formCfg187"
			:formAction="formAction187"
		>
			<template #supplierName>
				<el-input
					v-model="formData187.supplierName"
					placeholder="请选择商家"
					value-key="supplierName"
					label="supplierName"
					@focus="selectSupplier"
					clearable
					@clear="clearSupplier"
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
			:columns="tableColumns188"
			:pagination="page188"
			:data="tableData188"
		>
			<template slot="orderSn" slot-scope="scope">
				<div>
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</div>
			</template>
		</yx-table>
		<supplier-dialog
			:visible.sync="supplyDialogVisible"
			@fatherMethodInit="
				(row) => {
					formData187.supplierName = row.supplierName
					formData187.supplierId = row.supplierId
				}
			"
		/>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import SupplierDialog from '@/components/SupplyDialog'
import { downloadFile } from '@/utils/helper/common'
import {
	pageOrderEvaluationList,
	exportOrderEvaluationList,
} from '@/api/evaluation'
export default {
	name: 'OrderEvaluationList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		SupplierDialog,
	},
	data() {
		return {
			supplyDialogVisible: false,
			tableColumns188: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单编号',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'logisticsScore',
					title: '物流服务得分',
				},
				{
					type: 'string',
					dataIndex: 'serviceScore',
					title: '客服服务得分',
				},
				{
					type: 'newMap',
					dataIndex: 'type',
					title: '评价类型',
					options: [
						['1', '人工评价'],
						['0', '默认好评'],
					],
				},
				{
					type: 'date',
					dataIndex: 'orderTime',
					title: '下单时间',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '评价提交时间',
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			tableData188: [],
			loading: false,
			formData187: {
				orderSn: '',
				type: null,
				startOrderTime: '',
				endOrderTime: '',
				startAddTime: moment().startOf('day').valueOf(),
				endAddTime: moment().endOf('day').valueOf(),
				supplierName: '',
				supplierId: '',
			},
			formCfg187: [
				{
					type: 'input',
					dataIndex: 'orderSn',
					title: '订单编号',
				},
				{
					type: 'select',
					dataIndex: 'type',
					title: '评价类型',
					label: 'value',
					options: [
						{
							type: null,
							value: '全部',
						},
						{
							type: 1,
							value: '人工评价',
						},
						{
							type: 0,
							value: '默认好评',
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
					dataIndex: ['startOrderTime', 'endOrderTime'],
					title: '下单时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					title: '提交时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			exportLoading: false,
			formAction187: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '导出',
					type: 'success',
					auth: 'exportOrderEvaluationList',
					click: async () => {
						if (this.exportLoading) return
						this.exportLoading = true
						let paramJson = this.findSearchParams()
						let { data } = await exportOrderEvaluationList(paramJson)
						downloadFile(data, '订单评价列表.xlsx')
						this.exportLoading = false
					},
				},
			],
		}
	},
	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			const paramJson = Object.assign(this.formData187, {
				length: this.page188.length,
				currentPage: this.page188.currentPage,
			})
			return paramJson
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await pageOrderEvaluationList(paramJson)
			if (resultCode === 0) {
				this.tableData188 = resultData.records
				this.page188.count = resultData.total
			}
			this.loading = false
		},
		clearSupplier() {
			this.formData187.supplierName = ''
			this.formData187.supplierId = ''
		},
		fatherMethodInit(row) {
			this.formData187.supplierName = row.supplierName
			this.formData187.supplierId = row.supplierAccountNumberId
			if (!this.loading) this.init(true)
		},
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
		},
	},
}
</script>
