<!--
 * @Description: echarts popover
 * @Author: liqianwei
 * @Email: liqianwei@weeget.cn
 * @Date: 2020-12-01 10:23:21
 * @LastEditTime: 2020-12-22 19:26:50
 * @LastEditors: liqianwei
-->
<template>
	<div>
		<el-popover
			placement="top"
			title=""
			width="1200"
			@show="show"
			@hide="hide"
			trigger="hover"
		>
			<div class="pop-table">
				<div
					v-if="isNew && this.tableData[0] && this.tableData[0].newStatus === 1"
					class="new-tips"
				>
					NEW！
				</div>
				<div class="btn-group">
					<el-radio-group v-model="checked" @change="changeDate" size="mini">
						<el-radio-button label="2">365天</el-radio-button>
						<el-radio-button label="0">180天</el-radio-button>
						<el-radio-button label="1">30天</el-radio-button>
					</el-radio-group>
				</div>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:data="tableData"
					size="mini"
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
								'el-icon-right yellow-color':
									scope.row.trendCostPriceStatus == 0,
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
			<echarts-com :option="chartData" width="1180"></echarts-com>
			<el-button type="text" slot="reference">查看</el-button>
		</el-popover>
	</div>
</template>

<script>
import EchartsCom from '@/components/EchartsCom'
import YxTable from '@wg-vue-materials/yx-table'
import { queryGoodsPriceComparisonMoreSpec } from '@/api/supplierPrice'
import { numberFormat } from '@/utils/helper/common'
export default {
	props: {
		options: {
			type: Object,
			default: () => ({}),
		},
		isNew: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		EchartsCom,
		YxTable,
	},

	data() {
		return {
			showLoading: false,
			checked: 0,
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
					dataIndex: 'trendPriceStatus',
				},
				{
					type: 'custom',
					title: '供货价近期走势',
					dataIndex: 'trendCostPriceStatus',
				},
				{
					type: 'custom',
					title: '销售价近期走势',
					dataIndex: 'trendSupplyPriceStatus',
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
			chartData: {
				dateTime: [],
				costPrice: [],
				supplyPrice: [],
				lowestPrice: [],
			},
			saveDataList: [],
			showEcharts: false,
		}
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
		show() {
			this.init()
			this.showEcharts = true
		},
		hide() {
			this.showEcharts = false
		},
		changeDate(e) {
			this.checked = e
			this.init()
		},
		checkedSave() {
			let isNext = false
			this.saveDataList.forEach((item) => {
				for (let key in item) {
					if (key == this.checked) {
						this.tableData = item[key][0].goodsPriceComparisonDetail
							? [item[key][0].goodsPriceComparisonDetail]
							: []
						this.chartData = this.setOptions(item[key][0].showDataPrice)
						isNext = true
					}
				}
			})
			return isNext
		},
		async init() {
			let params = {
				goodsId: this.options.goodsId,
				specStatus: 0, //0 获取当前最新规格,1 获取全部规格
				priceTimeStatus: this.checked,
			}
			const paramJson = Object.assign(params, {
				startIndex: 1,
				length: 1,
			})
			// 校验是否存在存储的数据
			if (this.saveDataList && this.saveDataList.length > 0) {
				if (this.checkedSave()) return
			}

			let {
				data: {
					resultCode,
					resultData: { goodsPriceComparisonSpecVO = [] },
				},
			} = await queryGoodsPriceComparisonMoreSpec(paramJson)

			if (resultCode == 0) {
				// 存储返回的数据，防止多次滑动数据重复请求，因为是独立组件，id会自动存储所以id不需要自己存储，存储日期即可
				this.saveDataList.push({
					[this.checked]: goodsPriceComparisonSpecVO,
				})
				console.log(this.tableData, this.tableData.length)
				this.tableData = goodsPriceComparisonSpecVO[0]
					.goodsPriceComparisonDetail
					? [goodsPriceComparisonSpecVO[0].goodsPriceComparisonDetail]
					: []
				this.chartData = this.setOptions(
					goodsPriceComparisonSpecVO[0].showDataPrice
				)
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},
		setOptions(val) {
			let newArr = {
				dateTime: [],
				costPrice: [],
				supplyPrice: [],
				lowestPrice: [],
			}
			val.forEach((item) => {
				newArr.dateTime.push(item.dateTime)
				newArr.costPrice.push(item.costPrice)
				newArr.supplyPrice.push(item.supplyPrice)
				newArr.lowestPrice.push(item.lowestPrice)
			})
			return newArr
		},
	},
}
</script>

<style lang="scss" scoped>
.pop-table {
	position: relative;
	padding-bottom: 10px;
	.new-tips {
		position: absolute;
		top: 5px;
		left: 10px;
		background: brown;
		padding: 3px 8px;
		font-size: 14px;
		color: #fff;
		border-radius: 8px;
	}
}
.btn-group {
	float: right;
	margin-bottom: 12px;
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
