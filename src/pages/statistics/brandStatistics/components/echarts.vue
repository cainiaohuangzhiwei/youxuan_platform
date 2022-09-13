<!--
 * @Description: echarts components
 * @Author: liqianwei
 * @Email: liqianwei@weeget.cn
 * @Date: 2020-11-30 13:53:08
 * @LastEditTime: 2020-12-24 15:39:24
 * @LastEditors: liqianwei
-->
<!-- echartscom.vue -->
<template>
	<div class="charttest">
		<div
			:style="{ width: width + 'px', height: height + 'px' }"
			class="echarts-dom"
			:id="echarts"
			ref="echarts"
		></div>
	</div>
</template>

<script>
import * as echarts from 'echarts'
import { retainDecimalPoint } from '@/utils/helper/common'

export default {
	name: 'echartsCom',
	props: {
		option: {
			type: Object,
			default: () => ({}),
		},
		width: {
			type: Number,
			default: null,
		},
		height: {
			type: Number,
			default: 280,
		},
		type: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			chart: null,
		}
	},
	methods: {
		optionList(list) {
			let xAxisData = []
			let seriesOne = []
			let seriesTwo = []
			let seriesThree = []
			let seriesFour = []
			console.log(list)
			list.forEach((item) => {
				xAxisData.push(item.groupName)
				//折线图数据
				seriesOne.push(item.totalOrderGoodsQuantity)
				seriesTwo.push(item.totalRefundGoodsQuantity)
				seriesThree.push(retainDecimalPoint(item.totalOrderAmount))
				seriesFour.push(retainDecimalPoint(item.totalRefundAmount))
			})
			let json = {
				tooltip: {
					trigger: 'axis',
				},
				color: [
					'#c93756',
					'#0081ff',
					'#39b54a',
					'#9b52ff',
					'#fac524',
					'#46caff',
					'#a1e867',
					'#10b2b2',
				],
				legend: {
					top: '5%',
					right: '5%',
					itemWidth: 6,
					itemGap: 20,
					textStyle: {
						color: '#556677',
					},
				},
				grid: {
					left: '5%',
					right: '3%',
				},
				// dataZoom: [
				// 	{
				// 		type: 'slider', //图表下方的伸缩条
				// 		show: false, //是否显示
				// 		realtime: true, //拖动时，是否实时更新系列的视图
				// 		filterMode: 'empty',
				// 		start: 0,
				// 	},
				// ],
				xAxis: [
					{
						type: 'category',
						name: '分组名称',
						data: xAxisData,
						axisPointer: {
							type: 'shadow',
						},
						splitLine: {
							show: true,
						},
						axisTick: {
							alignWithLabel: true,
						},
					},
				],

				yAxis: [
					{
						type: 'value',
						name: '商品总数',
						axisLabel: {
							formatter: '{value}',
						},
					},
					{
						type: 'value',
						name: '退货商品数量',
						show: false,
						axisLabel: {
							formatter: '{value}',
						},
					},
					{
						type: 'value',
						name: '总额',
						position: 'right',
						axisLabel: {
							formatter: '{value}',
						},
					},
					{
						type: 'value',
						name: '退货总额',
						position: 'right',
						show: false,
						axisLabel: {
							formatter: '{value}',
						},
					},
				],
				series: [
					{
						name: '商品总数',
						data: seriesOne,
						type: 'bar',
						// smooth: true,
						// smoothMonotone: 'x',
						cursor: 'pointer',
						// showSymbol: false,
						lineStyle: {
							shadowColor: 'rgba(255,230,0,0.5)',
							shadowBlur: 10,
						},
					},
					{
						name: '退货商品总数',
						data: seriesTwo,
						type: 'bar',
						// smooth: true,
						// smoothMonotone: 'x',
						cursor: 'pointer',
						// showSymbol: false,
						lineStyle: {
							shadowColor: 'rgba(0,129,255,0.5)',
							shadowBlur: 10,
						},
					},
					{
						name: '订单总额',
						data: seriesThree,
						type: 'line',
						// smooth: true,
						// smoothMonotone: 'x',
						cursor: 'pointer',
						yAxisIndex: 2,
						// showSymbol: false,
						lineStyle: {
							shadowColor: 'rgba(57,181,74,0.5)',
							shadowBlur: 10,
						},
					},
					{
						name: '退货总额',
						data: seriesFour,
						type: 'line',
						// smooth: true,
						// smoothMonotone: 'x',
						cursor: 'pointer',
						yAxisIndex: 2,
						// showSymbol: false,
						lineStyle: {
							shadowColor: 'rgba(57,181,74,0.5)',
							shadowBlur: 10,
						},
					},
				],
			}

			// if (xAxisData.length > 10) {
			// 	//	json.dataZoom[0].startValue = xAxisData[xAxisData.length - 10]
			// 	json.dataZoom[0].show = true
			// } else {
			// 	json.dataZoom[0].show = false
			// 	//		json.dataZoom[0].startValue = xAxisData[0]
			// }
			return json
		},
		drawCharts(option) {
			this.chart = echarts.init(document.getElementById(this.echarts))
			this.chart.setOption(option)
			window.addEventListener('resize', this.chart.resize)
		},
	},

	watch: {
		//观察option的变化
		option: {
			handler(newVal, oldVal) {
				if (this.chart) {
					this.chart.setOption(this.optionList(newVal))
				} else {
					if (newVal != oldVal) {
						this.$nextTick(() => {
							this.drawCharts(this.optionList(newVal))
						})
					}
				}
			},
			deep: true, //对象内部属性的监听，关键。
			immediate: true,
		},
	},
	computed: {
		echarts() {
			return 'echarts' + Math.random() * 100000
		},
	},
	mounted() {
		//	this.drawCharts()
	},
	components: {},
}
</script>

<style lang="scss">
.echarts-dom {
	width: 100%;
	height: auto;
}
</style>
