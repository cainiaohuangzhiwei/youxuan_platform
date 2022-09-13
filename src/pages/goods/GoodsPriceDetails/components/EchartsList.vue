<!--
 * @Description: echarts popover
 * @Author: liqianwei
 * @Email: liqianwei@weeget.cn
 * @Date: 2020-12-01 10:23:21
 * @LastEditTime: 2020-12-23 18:10:13
 * @LastEditors: liqianwei
-->
<template>
	<div>
		<div class="pop-table">
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:data="[options.goodsPriceComparisonDetail]"
			>
				<template slot="trendPriceStatus" slot-scope="scope">
					<i
						:class="{
							'el-icon-top-right red-color': scope.row.trendPriceStatus == 1,
							'el-icon-right yellow-color': scope.row.trendPriceStatus == 0,
							'el-icon-bottom-right green-color':
								scope.row.trendPriceStatus == 2,
						}"
					></i
					>{{ getType(scope.row.trendPriceStatus) }}
				</template>
				<template slot="trendCostPriceStatus" slot-scope="scope">
					<i
						:class="{
							'el-icon-top-right red-color':
								scope.row.trendCostPriceStatus == 1,
							'el-icon-right yellow-color': scope.row.trendCostPriceStatus == 0,
							'el-icon-bottom-right green-color':
								scope.row.trendCostPriceStatus == 2,
						}"
					></i
					>{{ getType(scope.row.trendCostPriceStatus) }}
				</template>
				<template slot="trendSupplyPriceStatus" slot-scope="scope">
					<i
						:class="{
							'el-icon-top-right red-color':
								scope.row.trendSupplyPriceStatus == 1,
							'el-icon-right yellow-color':
								scope.row.trendSupplyPriceStatus == 0,
							'el-icon-bottom-right green-color':
								scope.row.trendSupplyPriceStatus == 2,
						}"
					></i>
					{{ getType(scope.row.trendSupplyPriceStatus) }}
				</template>
			</yx-table>
		</div>
		<echarts-com :option="options.chartData"></echarts-com>
	</div>
</template>

<script>
import EchartsCom from '@/components/EchartsCom'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
export default {
	props: {
		options: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		EchartsCom,
		YxTable,
	},

	data() {
		return {
			showLoading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'specOne',
					title: '颜色',
				},
				{
					type: 'string',
					dataIndex: 'specTwo',
					title: '尺码',
				},
				{
					type: 'string',
					dataIndex: 'costPrice',
					title: '历史最低与最高成本价',
					customRender: (row) => {
						return `￥${numberFormat(row.lowestOldCostPrice, 2)}-${numberFormat(
							row.highestOldCostPrice,
							2
						)}`
					},
				},
				{
					type: 'string',
					dataIndex: 'supplyPrice',
					title: '历史最低与最高供货价',
					customRender: (row) => {
						return `￥${numberFormat(
							row.lowestOldSupplyPrice,
							2
						)}-${numberFormat(row.highestOldSupplyPrice, 2)}`
					},
				},
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '历史最低与最高销售价',
					customRender: (row) => {
						return `￥${numberFormat(row.lowestOldPrice, 2)}-${numberFormat(
							row.highestOldPrice,
							2
						)}`
					},
				},
				{
					type: 'custom',
					title: '成本价近期走势',
					dataIndex: 'trendCostPriceStatus',
				},
				{
					type: 'custom',
					title: '供货价近期走势',
					dataIndex: 'trendSupplyPriceStatus',
				},
				{
					type: 'custom',
					title: '销售价近期走势',
					dataIndex: 'trendPriceStatus',
				},
				// {
				// 	type: 'action',
				// 	title: '操作',
				// 	width: '150',
				// 	actions: [
				// 		{
				// 			title: '详细信息',
				// 			click: (row) => {
				// 				this.$router.push({
				// 					path: `goodsPriceDetails/${this.options.goodsId}/${
				// 						this.options.goodsSpecId
				// 					}/${
				// 						this.options.supplierId ||
				// 						this.options.supplierAccountNumberId
				// 					}`,
				// 				})
				// 				console.log(row)
				// 			},
				// 		},
				// 	],
				// },
			],
			tableData: [],
			saveDataList: [],
		}
	},
	mounted() {
		console.log(this.options)
	},
	methods: {
		getType(val) {
			let type
			switch (val) {
				case 0:
					type = '平稳'
					break
				case 1:
					type = '上升'
					break
				case 2:
					type = '下降'
					break

				default:
					type = '---'
					break
			}
			return type
		},
	},
}
</script>

<style lang="scss" scoped>
.pop-table {
	position: relative;
	padding-bottom: 10px;
}
.red-color {
	font-size: 24px;
	color: #d51a21;
	vertical-align: middle;
}
.green-color {
	font-size: 24px;
	color: #407434;
	vertical-align: middle;
}
.yellow-color {
	font-size: 24px;
	color: #f4d000;
	vertical-align: middle;
}
</style>
