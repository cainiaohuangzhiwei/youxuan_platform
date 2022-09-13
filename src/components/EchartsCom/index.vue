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
	},
	data() {
		return {
			chart: null,
		}
	},
	methods: {
		optionList(value) {
			let xAxisData = value.dateTime || []
			let json = {
				tooltip: {
					trigger: 'axis',
				},
				color: [
					'#ffe600',
					'#0081ff',
					'#39b54a',
					'#9b52ff',
					'#fac524',
					'#46caff',
					'#a1e867',
					'#10b2b2',
				],
				legend: {
					icon: 'circle',
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
				dataZoom: [
					{
						type: 'slider', //图表下方的伸缩条
						show: false, //是否显示
						realtime: true, //拖动时，是否实时更新系列的视图
						filterMode: 'empty',
						start: 0,
					},
					// { moveOnMouseWheel: false },
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
				yAxis: {
					type: 'value',
					axisLabel: {
						color: '#333',
						formatter: '{value}',
					},
					splitLine: {
						lineStyle: {
							type: 'dashed',
						},
					},
					axisLine: {
						lineStyle: {
							color: 'rgba(107,107,107,.37)',
						},
					},
				},
				series: [
					{
						name: '销售价',
						data: value.lowestPrice,
						type: 'line',
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
						name: '供货价',
						data: value.supplyPrice,
						type: 'line',
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
						name: '成本价',
						data: value.costPrice,
						type: 'line',
						// smooth: true,
						// smoothMonotone: 'x',
						cursor: 'pointer',
						// showSymbol: false,
						lineStyle: {
							shadowColor: 'rgba(57,181,74,0.5)',
							shadowBlur: 10,
						},
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
