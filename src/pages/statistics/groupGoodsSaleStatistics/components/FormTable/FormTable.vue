<template>
	<div class="groupGoodsSaleStatistics">
		<basicContainer>
			<yx-form
				v-loading="exportLoading"
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="goodsName" slot-scope="scope">
					<div class="blue" @click="toDetail(scope.row)">
						{{ scope.row.goodsName }}
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle103"
				:visible="dialogVisible103"
				:width="dialogWidth103"
				:bottomBtn="dialogBottomBtn103"
				@before-close="dialogVisible103 = false"
			>
				<yx-table
					:select="false"
					v-loading="loading106"
					:columns="tableColumns106"
					:pagination="page106"
					:data="tableData106"
				></yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	getCMSGoodsGroupSalesStatistics,
	getSpecSaleStatistics,
	exportCMSGoodsGroupSalesStatistics,
} from '@/api/yhtPlusCmsStatistics'
import { numberFormat, downloadFile } from '@/utils/helper/common'
import { getSmallImg } from '@/utils/imageTool'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData101: {
				goodsNumber: '',
				sortType: '2',
				goodsGroupId: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '请输入商品货号',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					type: 'select',
					title: '排序',
					dataIndex: 'sortType',
					placeholder: '请输入排序',
					label: 'value',
					options: [
						{
							sortType: '2',
							value: '成单商品数量↓',
						},
						{
							sortType: '1',
							value: '成单商品数量↑',
						},
						{
							sortType: '4',
							value: '发货前退货商品数量↓',
						},
						{
							sortType: '3',
							value: '发货前退货商品数量↑',
						},
						{
							sortType: '6',
							value: '发货后退货商品数量↓',
						},
						{
							sortType: '5',
							value: '发货后退货商品数量↑',
						},
					],
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
					title: '导出Excel',
					type: '',
					auth: 'exportCMSGoodsGroupSalesStatistics',
					click: () => {
						this.exportIt()
					},
					isClear: false,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'image',
					dataIndex: 'imageUrl',
					title: '商品图',
				},
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '商品货号',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'amount',
					dataIndex: 'supplyPrice',
					title: '供货价',
				},
				{
					type: 'string',
					dataIndex: 'advicePirce',
					title: '建议销售价',
					customRender: (row) => {
						return row.suggestSellPriceMin && row.suggestSellPriceMax
							? '￥' +
									numberFormat(row.suggestSellPriceMin, 2) +
									'-' +
									numberFormat(row.suggestSellPriceMax, 2)
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'perItemQuantity',
					title: '成单商品数量',
				},
				{
					type: 'string',
					dataIndex: 'returnGoodsBeforeDeliveryQuantity',
					title: '发货前退货商品数量',
				},
				{
					type: 'string',
					dataIndex: 'returnGoodsAfterDeliveryQuantity',
					title: '发货后退货商品数量',
				},

				{
					type: 'action',
					title: '操作',
					width: '140',
					fixed: 'right',
					actions: [
						{
							title: '查看规格销售统计',
							auth: '',
							click: (row) => {
								this.activeRow = row
								this.dialogVisible103 = true
								this.getSpecSaleStatistics(true)
							},
							dialogId: 103,
						},
					],
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
			dialogTitle103: '规格销售统计',
			dialogWidth103: '80%',
			dialogVisible103: false,
			dialogBottomBtn103: [
				{
					title: '取 消',
					click: () => {
						this.dialogVisible103 = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible103 = false
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'goodsName',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'specOne',
					title: '规格',
					customRender: (row) => {
						return `${row.specOne}  ${row.specTwo}`
					},
				},
				{
					type: 'amount',
					dataIndex: 'supplyPrice',
					title: '供货价',
				},
				{
					type: 'string',
					dataIndex: 'lowestPrice',
					title: '建议零售价',
					customRender: (row) => {
						return row.lowestPrice && row.highestPrice
							? '￥' +
									numberFormat(row.lowestPrice, 2) +
									'~￥' +
									numberFormat(row.highestPrice, 2)
							: '-'
					},
				},
				{
					title: '成单数量',
					type: 'string',
					dataIndex: 'totalQuantity',
				},
				{
					title: '剩余库存',
					type: 'string',
					dataIndex: 'remainingStock',
				},
				{
					title: '剩余货值',
					type: 'amount',
					dataIndex: 'remainingPrice',
				},
			],
			page106: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData106()
				},
			},
		}
	},

	created() {
		this.formData101.goodsGroupId = this.$route.params.goodsGroupId
		this.getData102(true)
	},

	methods: {
		toDetail(row) {
			this.$router.push({
				path: `/goods/GoodsDetail/${row.goodsId}/${row.goodsSpecId}`,
			})
		},
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams102()
			this.exportLoading = true
			let { data } = await exportCMSGoodsGroupSalesStatistics(paramJson)
			this.exportLoading = false
			downloadFile(data, 'excel.xls')
		},
		async getSpecSaleStatistics(flag) {
			this.loading106 = true
			let paramJson = this.findSearchParams106(flag)
			const {
				data: { resultCode, resultData },
			} = await getSpecSaleStatistics(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.goodsSpecList) {
				this.tableData106 = resultData.goodsSpecList
				this.page106.count = resultData.count
			}
			this.loading106 = false
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getCMSGoodsGroupSalesStatistics(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.list) {
				// this.tableData102 = resultData.list
				this.tableData102 = resultData.list.map((v) => {
					v.imageUrl = getSmallImg(v.imageUrl)
					return v
				})
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
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					goodsId: this.activeRow.goodsId,
					goodsGroupId: this.$route.params.goodsGroupId,
				},
				{
					length: this.page106.length,
					startIndex: (this.page106.currentPage - 1) * this.page106.length,
				}
			)
			return paramJson
		},
	},
}
</script>
<style scoped>
.blue {
	color: #4498e0;
	cursor: pointer;
}
</style>
