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
			for (let i = 0; i < list.length; i++) {
				xAxisData.push(i + 1 + (this.type == 3 ? '周' : '月') + '后')
			}
			let json = {
				tooltip: {
					trigger: 'axis',
					formatter: '留存率平均数<br/>{b}: {c}%',
				},
				color: [
					'#c93756',
					'#39b54a',
					'#0081ff',
					'#fac524',
					'#46caff',
					'#a1e867',
					'#10b2b2',
				],
				legend: {
					show: false,
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
						name: '留存率平均数',
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
						name: '留存率平均数',
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
				],
			}
			//折线图数据
			json.series[0].data = list.map((row) => {
				if (row.rateNum == 0) {
					return 0
				} else {
					return ((row.rate / row.rateNum) * 100).toFixed(2)
				}
			})
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
	height: 100%;
}
</style>
