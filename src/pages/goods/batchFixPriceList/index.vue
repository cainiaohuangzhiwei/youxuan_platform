<template>
	<div class="batchFixPriceList">
		<WgForm
			:inline="true"
			:data="formData105"
			:items="formCfg105"
			:formAction="formAction105"
		>
			<template #supplierId>
				<el-select
					v-model="formData105.supplierId"
					filterable
					remote
					clearable
					placeholder="请输入商家名称"
					value-key="supplierId"
					:remote-method="_getCmsSupplierListByCondition"
					><i class="el-icon-search el-input__icon" slot="prefix"> </i>
					<el-option
						v-for="item in supplierList"
						:key="item.supplierId"
						:label="item.supplierName"
						:value="item.supplierId"
					>
					</el-option>
				</el-select>
			</template>
		</WgForm>
		<yx-table
			:select="true"
			v-loading="loading"
			:columns="tableColumns106"
			:pagination="page106"
			:data="tableData106"
		>
		</yx-table>
	</div>
</template>
<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import { initBatchFixPriceRecord } from '@/api/yhtPlusWebGoods'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'

export default {
	name: 'BatchFixPriceList',
	components: {
		WgForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			// 搜索商家数据源
			supplierList: [],
			formData105: {
				handleStatus: 0,
				supplierId: '',
			},
			formCfg105: [
				{
					type: 'custom',
					title: '商家名称',
					dataIndex: 'supplierId',
					colSpan: 6,
				},
				{
					type: 'select',
					title: '处理状态',
					dataIndex: 'handleStatus',
					label: 'value',
					options: [
						{
							handleStatus: 0,
							value: '全部',
						},
						{
							handleStatus: 1,
							value: '处理中',
						},
						{
							handleStatus: 2,
							value: '处理成功',
						},
						{
							handleStatus: 3,
							value: '处理失败',
						},
					],
				},
			],
			formAction105: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.queryGetRejectGoodsList(true, e)
					},
				},
				{
					title: '导入批量定价数据',
					type: 'primary',
					auth: 'importGoodsPricing',
					click: () => {
						this.importFixPrice()
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
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'handleStatus',
					title: '处理状态',
					customRender: (row) => {
						return row.handleStatus == 1
							? '处理中'
							: row.handleStatus == 2
							? '处理成功'
							: row.handleStatus == 3
							? '处理失败'
							: '-'
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '导入时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '完成时间',
				},
			],
			page106: {
				currentPage: 1,
				length: 10,
				startIndex: 0,
				tableChange: () => {
					this.queryGetRejectGoodsList()
				},
			},
		}
	},

	methods: {
		// 获取商家列表
		async _getCmsSupplierListByCondition(query) {
			if (query !== '') {
				const paramJson = {
					startIndex: 0,
					length: 20,
					supplierName: query,
				}
				const {
					data: { resultCode, resultData },
				} = await getCmsSupplierListByCondition(paramJson)

				if (resultCode == 0) {
					this.supplierList = resultData.supplierList || []
					return
				}
			}
			this.supplierList = []
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			return paramJson
		},
		//
		queryGetRejectGoodsList: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			// if (isNull(paramJson.brandName)) {
			// 	this.$message.warning({ message: '请填写会场名称' })
			// 	return
			// }
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await initBatchFixPriceRecord(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData106 = resultData.recordList
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
		importFixPrice() {
			this.$router.push({
				path: '/goods/batchFixPriceImport',
			})
		},
	},
}
</script>
