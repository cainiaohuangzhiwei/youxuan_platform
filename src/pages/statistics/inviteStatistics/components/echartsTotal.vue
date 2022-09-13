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
import moment from 'moment'
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
		rateType: {
			type: Number,
			default: 1,
		},
		difference: {
			type: Number,
			default: 0,
		},
		radioType: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			chart: null,
		}
	},
	methods: {
		optionList(list) {
			//折线图节点名称
			let difference = this.difference
			let statisticsType = this.radioType
			let inviteCodeRateList = []
			for (let i = 0; i < 30; i++) {
				if (
					(difference + 1000) / (24 * 3600 * 1000) > i &&
					statisticsType == 2
				) {
					inviteCodeRateList.push({ rateNum: 0, rate: 0 })
				}
				if (
					(difference + 1000) / (7 * 24 * 3600 * 1000) > i &&
					statisticsType == 3
				) {
					inviteCodeRateList.push({ rateNum: 0, rate: 0 })
				}
				if (
					(difference + 1000) / (30 * 24 * 3600 * 1000) > i &&
					statisticsType == 4
				) {
					inviteCodeRateList.push({ rateNum: 0, rate: 0 })
				}
			}

			let rateTypeText = ''
			if (this.rateType == 1) {
				rateTypeText = '使用'
			} else if (this.rateType == 2) {
				rateTypeText = '出单'
			} else if (this.rateType == 3) {
				rateTypeText = '出三单'
			}
			let json = {
				grid: {
					left: '3%',
					right: '4%',
					containLabel: true,
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#999',
						},
					},
					formatter: '邀请码' + rateTypeText + '率<br/>{b}: {c}%',
				},
				toolbox: {
					feature: {
						dataView: {
							show: true,
							readOnly: false,
						},
						magicType: {
							show: true,
							type: ['line', 'bar'],
						},
						restore: {
							show: true,
						},
						saveAsImage: {
							show: true,
						},
					},
				},
				legend: {
					data: ['邀请码' + rateTypeText + '分析'],
				},
				xAxis: [
					{
						type: 'category',
						data: [],
						axisPointer: {
							type: 'shadow',
						},
						splitLine: {
							show: true,
						},
					},
				],
				yAxis: [
					{
						type: 'value',
						name: '邀请码' + rateTypeText + '率',
						boundaryGap: false,
						splitLine: {
							show: true,
						},
						axisLabel: {
							formatter: '{value}%',
						},
					},
				],
				series: [
					{
						name: '邀请码' + rateTypeText + '率',
						type: 'bar',
						data: [],
					},
				],
			}
			let statisticsList = [
				'当' + (statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月'),
				'1' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'2' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'3' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'4' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'5' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'6' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'7' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'8' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'9' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'10' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'11' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'12' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
				'13' +
					(statisticsType == 2 ? '天' : statisticsType == 3 ? '周' : '月') +
					'后',
			]
			statisticsList = statisticsList.slice(0, list.length)
			json.xAxis[0].data = statisticsList
			let curTime = moment(moment().startOf('month')).valueOf()

			let inviteList = []

			for (let i = 0; i < list.length; i++) {
				let item = list[i]
				let itemTime = new Date(item.timeString).getTime()
				if (itemTime > curTime) {
					continue
				} else {
					inviteList.push(item)
				}
			}

			for (let i = 0; i < inviteList.length; i++) {
				let item = inviteList[i]
				item.useList = []
				for (let a = 0; a < 30; a++) {
					item.useList.push({ useCount: 0 })
				}

				let useSituationList = item.useSituation.split(',')
				for (let k = 0; k < item.useList.length; k++) {
					let useCount = 0
					//        log('下标 =>'+k+'  当前时间 =>'+curDate+'  当前时间戳=>'+curTime)
					for (let j = 0; j < useSituationList.length; j++) {
						let time = useSituationList[j].split(':')[0]
						let count = useSituationList[j].split(':')[1]
						let useDate = new Date(time).getTime()
						if (statisticsType == 3) {
							//计算周
							useDate = this.getWeekDay(time).getTime()
						}
						if (j > 0 && k == j) {
							//大于当前时间的不显示
							//            log('下标 =>'+k+'  当前时间 =>'+time+'  当前时间戳=>'+useDate)

							if (curTime <= useDate) {
								item.useList[k].flag = true
							}
						}
						if (k < j) {
							break
						} else {
							useCount += Number(count)
						}
					}
					item.useList[k].useCount = useCount
					if (!item.useList[k].flag && inviteCodeRateList[k]) {
						inviteCodeRateList[k].rateNum += item.grantCount
						inviteCodeRateList[k].rate += useCount
					}
				}
				//      log(item.useList)
			}

			//折线图数据
			json.series[0].data = inviteCodeRateList.map((row) => {
				if (row.rateNum == 0) {
					return 0
				} else {
					return ((row.rate / row.rateNum) * 100).toFixed(2)
				}
			})

			return json
		},
		getWeekDay: function (dateStr) {
			let useDate = new Date(dateStr.split('-')[0], '0', '1')
			let weeks = dateStr.split('-')[1]
			let time = useDate.getTime()
			time += (weeks - 1) * 7 * 24 * 3600000
			useDate.setTime(time)
			//这个方法将取得 某日期(nowDate) 所在周的星期几(weekDay)的日期
			function getNextDate(nowDate, weekDay) {
				//0是星期日,1是星期一,...
				weekDay %= 7
				let day = nowDate.getDay()
				let time2 = nowDate.getTime()
				let sub = weekDay - day
				time2 += sub * 24 * 3600000
				nowDate.setTime(time2)
				return nowDate
			}
			return getNextDate(useDate, 1)
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
