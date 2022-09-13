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
	pageGoodsGroupEvaluationList,
	exportGoodsGroupEvaluationList,
} from '@/api/evaluation'
export default {
	name: 'GoodsGroupEvaluationList',
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
					type: 'string',
					dataIndex: 'id',
					title: '评价ID',
				},
				{
					type: 'string',
					dataIndex: 'goodsGroupId',
					title: '档期ID',
				},
				{
					type: 'string',
					dataIndex: 'goodsGroupName',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '名牌名称',
				},
				{
					type: 'string',
					dataIndex: 'tagName',
					title: '评价标签',
				},
				{
					type: 'newMap',
					dataIndex: 'submitStage',
					title: '提交阶段',
					options: [
						['1', '预热'],
						['2', '选品'],
						['3', '会场页'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'evaluationType',
					title: '评价类型',
					options: [['1', '店主关闭档期']],
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
				id: '',
				goodsGroupId: '',
				goodsGroupName: '',
				supplierName: '',
				submitStage: null,
				startAddTime: moment().startOf('month').valueOf(),
				endAddTime: moment().endOf('day').valueOf(),
			},
			formCfg187: [
				{
					type: 'input',
					dataIndex: 'id',
					title: '评价ID',
				},
				{
					type: 'input',
					dataIndex: 'goodsGroupId',
					title: '档期ID',
				},
				{
					type: 'input',
					dataIndex: 'goodsGroupName',
					title: '档期名称',
				},
				{
					type: 'custom',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'select',
					dataIndex: 'submitStage',
					title: '提交阶段',
					label: 'value',
					options: [
						{
							submitStage: null,
							value: '全部',
						},
						{
							submitStage: 1,
							value: '预热',
						},
						{
							submitStage: 2,
							value: '选品',
						},
						{
							submitStage: 3,
							value: '会场页',
						},
					],
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
					auth: 'closeGoodsGroupEvaluationListExport',
					click: async () => {
						if (this.exportLoading) return
						this.exportLoading = true
						let paramJson = this.findSearchParams()
						let { data } = await exportGoodsGroupEvaluationList(paramJson)
						downloadFile(data, '档期评价列表.xlsx')
						this.exportLoading = false
					},
				},
			],
		}
	},
	mounted() {
		this.init()
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
			} = await pageGoodsGroupEvaluationList(paramJson)
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
