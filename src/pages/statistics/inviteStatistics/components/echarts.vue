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
		optionList(value) {
			let json = {
				//      color:['#18a6db','#18c6db','#18dba2','#f3ba1c','#fcac5b'],
				color: ['#18a6db', '#18dba2', '#fcac5b'],
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}',
				},
				legend: {
					data: [],
					orient: 'vertical',
					top: '100',
					left: '65%',
					itemGap: 100,
					textStyle: {
						fontSize: '14',
					},
				},
				series: [
					{
						name: '邀请码统计',
						type: 'funnel',
						left: '20%',
						top: 20,
						width: '40%',
						height: '280',
						gap: 2,
						label: {
							normal: {
								show: true,
								position: 'inside',
								textStyle: {
									fontSize: '14',
								},
								formatter: function (params) {
									return params.data.num + '%'
								},
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: 16,
								},
							},
						},
						data: [],
					},
				],
			}

			let arr = [
				{
					count: value.grantCount,
					name: '发放',
				},
				{
					count: value.useCount,
					name: '使用',
				},
				{
					count: value.payOrderCount,
					name: '有出单',
				},
				{
					count: value.payOrderCountThree,
					name: '出三单',
				},
			]
			for (let i = 0; i < arr.length; i++) {
				let item = arr[i]
				//折线图数据
				let num = 0
				if (i == 0) {
					if (item.count > 0) {
						num = 100
					} else {
						num = 0
					}
				} else {
					if (arr[i - 1].count == 0) {
						num = 0
					} else {
						num = ((item.count / arr[i - 1].count) * 100).toFixed(0)
					}
				}
				let count = item.count
				let name = item.name + ' : ' + item.count + '个'
				json.series[0].max = arr[0].count
				json.series[0].data.push({
					value: count,
					name: name,
					num: num,
				})
				json.legend.data.push(name)
			}
			//适配样式
			let h = json.series[0].height
			let fzH = json.series[0].label.normal.textStyle.fontSize
			let length = json.series[0].data.length
			let mh = h / length
			json.legend.top = mh / 2 - fzH
			json.legend.itemGap = mh - fzH
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
