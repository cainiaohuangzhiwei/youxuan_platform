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
			list.forEach((item) => {
				//折线图节点名称
				if (this.type == 1) {
					//小时
					xAxisData.push(item.timesString.split(':')[0].slice(-2) + ':00')
				} else if (this.type == 2) {
					//天
					xAxisData.push(item.timesString.split(' ')[0])
				} else if (this.type == 3) {
					//周

					xAxisData.push(item.times.replace('-', '年') + '周')
				} else {
					xAxisData.push(item.timesString.split(' ')[0].slice(0, -3))
				}
				//折线图数据
				seriesOne.push(item.organizationCount)
				seriesTwo.push(item.orderCount)
				seriesThree.push(retainDecimalPoint(item.totalAmount))
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
					x: 'center',
					itemWidth: 6,
					itemGap: 20,
					textStyle: {
						color: '#556677',
					},
				},
				grid: {
					left: '8%',
					right: '8%',
				},
				dataZoom: [
					{
						type: 'slider', //图表下方的伸缩条
						show: false, //是否显示
						realtime: true, //拖动时，是否实时更新系列的视图
						filterMode: 'empty',
						start: 0,
					},
				],
				xAxis: {
					// axisLabel: {
					// 	interval: 0, //横轴信息全部显示
					// },
					type: 'category',
					boundaryGap: true,
					data: xAxisData,

					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
				},
				yAxis: [
					{
						type: 'value',
						name: '累积数量',
						boundaryGap: false,
						splitLine: {
							show: true,
						},
						axisLabel: {
							formatter: '{value}',
						},
					},
					{
						type: 'value',
						name: '累积销售额(元)',
						boundaryGap: false,
						splitLine: {
							show: true,
						},
						axisLabel: {
							formatter: '{value}',
						},
					},
				],
				series: [
					{
						name: '累积在售店主数',
						type: 'bar',
						data: seriesOne,
					},
					{
						name: '累积订单数',
						type: 'bar',
						data: seriesTwo,
					},
					{
						name: '累积销售额(元)',
						type: 'line',
						yAxisIndex: 1,
						data: seriesThree,
					},
				],
			}

			if (xAxisData.length > 10) {
				//	json.dataZoom[0].startValue = xAxisData[xAxisData.length - 10]
				json.dataZoom[0].show = true
			} else {
				json.dataZoom[0].show = false
				//		json.dataZoom[0].startValue = xAxisData[0]
			}
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
