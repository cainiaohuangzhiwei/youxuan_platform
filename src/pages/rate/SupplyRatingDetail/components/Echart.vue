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
		options: {
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
		drawCharts(option) {
			this.chart = echarts.init(document.getElementById(this.echarts))
			this.chart.setOption(option)
			window.addEventListener('resize', this.chart.resize)
		},
	},
	watch: {
		//观察option的变化
		options: {
			handler(newVal, oldVal) {
				if (this.chart) {
					this.chart.setOption(this.options)
				} else {
					if (newVal != oldVal) {
						this.$nextTick(() => {
							this.drawCharts(this.options)
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
