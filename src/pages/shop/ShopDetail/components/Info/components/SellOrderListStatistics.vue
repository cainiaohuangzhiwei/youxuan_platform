<template>
	<div class="info">
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
			@change="handleSearch"
		></yx-form>

		<div v-loading="loading">
			<YxAccounts :items="orderData" />

			<yx-form
				:inline="true"
				:data="searchChartData"
				:items="searchChartCfg"
			></yx-form>

			<div class="echarts" id="main" />
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import * as echarts from 'echarts'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts/index'
import { wgGetDate, retainDecimalPoint } from '@/utils/helper/common'
import { findCMSOrganizationDetailsStatistics } from '@/api/shopDetail'

export default {
	components: {
		YxForm,
		YxAccounts,
	},

	props: {
		organizationId: {
			default: '',
		},
	},

	data() {
		return {
			orderData: [
				{
					type: 'money',
					title: '订单总额',
					value: 0,
				},
				{
					type: 'order',
					title: '订单总额',
					value: 0,
				},
			],
			loading: false,
			timesList: [], // 图表时间
			orderCountList: [], // 图表订单总数
			totalAmountList: [], // 图表订单总额
			searchData: {
				timeSelect: '3',
				startTime: wgGetDate().getCurrentStartDate,
				endTime: wgGetDate().getWeekEndDate,
			},
			searchCfg: [
				{
					type: 'radioButton',
					title: '时间',
					dataIndex: 'timeSelect',
					label: 'value',
					options: this.$store.state.app.constant.TYPE_TIME_ONE,
					change: (val) => {
						this.handleSearch(val)
					},
				},
				{
					title: '时段选择',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					change: () => {
						this.handleTransfer(2)
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.initChartList()
					},
				},
			],
			searchChartData: {
				type: '2',
			},
			searchChartCfg: [
				{
					type: 'radio',
					dataIndex: 'type',
					label: 'value',
					options: this.$store.state.app.constant.TYPE_TIME_TWO,
					change: () => {
						this.initChartList()
					},
				},
			],
			retainDecimalPoint: retainDecimalPoint,
		}
	},

	mounted() {
		this.initChartList()
	},

	methods: {
		// 操作时间类型
		handleSearch(val) {
			if (val == '1') {
				this.searchData.startTime = wgGetDate().getCurrentStartDate
				this.searchData.endTime = wgGetDate().getCurrentEndDate
			} else if (val == '2') {
				this.searchData.startTime = wgGetDate().getYesterdayStartDate
				this.searchData.endTime = wgGetDate().getYesterdayEndDate
			} else if (val == '3') {
				this.searchData.startTime = wgGetDate().getWeekStartDate
				this.searchData.endTime = wgGetDate().getWeekEndDate
			} else if (val == '4') {
				this.searchData.startTime = wgGetDate().getUpWeekStartDate
				this.searchData.endTime = wgGetDate().getUpWeekEndDate
			} else if (val == '5') {
				this.searchData.startTime = wgGetDate().getMonthStartDate
				this.searchData.endTime = wgGetDate().getMonthEndDate
			}

			this.handleTransfer(1, val)
		},

		// 处理时间选项
		handleTransfer(type, val) {
			const startTime = moment(this.searchData.startTime).valueOf() || ''
			const endTime = moment(this.searchData.endTime).valueOf() || ''
			const diffTime = endTime - startTime
			if (type == 2) {
				this.searchData.timeSelect = ''

				if (startTime > endTime) {
					return this.$message.warning('结束时间必须大于开始时间')
				}
			}

			if (val == '1' || val == '2' || diffTime < 24 * 3600 * 1000) {
				this.searchChartData.type = '1'
				this.$store.state.app.constant.TYPE_TIME_TWO[0].disabled = false
				this.$store.state.app.constant.TYPE_TIME_TWO[1].disabled = true
				this.$store.state.app.constant.TYPE_TIME_TWO[2].disabled = true
				this.$store.state.app.constant.TYPE_TIME_TWO[3].disabled = true
			} else if (val == '3' || val == '4' || diffTime < 7 * 24 * 3600 * 1000) {
				this.searchChartData.type = '2'
				this.$store.state.app.constant.TYPE_TIME_TWO[0].disabled = false
				this.$store.state.app.constant.TYPE_TIME_TWO[1].disabled = false
				this.$store.state.app.constant.TYPE_TIME_TWO[2].disabled = true
				this.$store.state.app.constant.TYPE_TIME_TWO[3].disabled = true
			} else if (val == '5' || diffTime < 30 * 24 * 3600 * 1000) {
				this.searchChartData.type = '4'
				this.$store.state.app.constant.TYPE_TIME_TWO[0].disabled = false
				this.$store.state.app.constant.TYPE_TIME_TWO[1].disabled = false
				this.$store.state.app.constant.TYPE_TIME_TWO[2].disabled = false
				this.$store.state.app.constant.TYPE_TIME_TWO[3].disabled = false
			}
			this.initChartList()
		},

		// 初始化
		async initChartList() {
			const paramJson = Object.assign(this.searchData, this.searchChartData)
			paramJson.organizationId = this.organizationId || ''
			paramJson.sortField = 1
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''

			if (!paramJson.startTime) {
				return this.$message.warning('请选择开始时间')
			} else if (!paramJson.endTime) {
				return this.$message.warning('请选择结束时间')
			}

			this.loading = true
			const res = await findCMSOrganizationDetailsStatistics(paramJson)
			const { list, totalOrderAmount, totalOrderCount } = res.data.resultData
			this.orderData[0].value = totalOrderAmount
			this.orderData[1].value = totalOrderCount

			let timesList = []
			let orderCountList = []
			let totalAmountList = []

			if (res.data.resultCode == 0) {
				for (let i = 0; i < list.length; i++) {
					//折线图节点名称
					if (this.searchChartData.type == 1) {
						//小时
						timesList.push(list[i].timesString.split(':')[0].slice(-2) + ':00')
					} else if (this.searchChartData.type == 2) {
						//天
						timesList.push(list[i].timesString.split(' ')[0])
					} else if (this.searchChartData.type == 3) {
						//周
						let value = list[i].timesString
						let endValue =
							new Date(value).getTime() +
							(7 - new Date(value).getDay()) * 24 * 3600 * 1000
						timesList.push(
							`${value.split(' ')[0]}-${moment(endValue).format('YYYY-MM-DD')}`
						)
					} else {
						timesList.push(list[i].timesString.split(' ')[0].slice(0, -3))
					}

					//折线图数据
					orderCountList.push(list[i].orderCount)
					totalAmountList.push(list[i].totalAmount)
				}
				this.initChart(timesList, orderCountList, totalAmountList)
				this.loading = false
			} else {
				this.loading = false
			}
		},

		// 图表
		initChart(timesList, orderCountList, totalAmountList) {
			const myChart = echarts.init(document.getElementById('main'))
			const option = {
				// 配置项和数据
				grid: {
					height: '270px',
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
				},
				toolbox: {
					feature: {
						dataView: {
							show: true,
							readOnly: false,
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
					data: ['订单总数', '订单总额(元)'],
				},
				xAxis: [
					{
						type: 'category',
						data: timesList,
						axisPointer: {
							type: 'shadow',
						},
					},
				],
				yAxis: [
					{
						type: 'value',
						name: '订单总数',
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
						name: '订单总额(元)',
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
						name: '订单总数',
						type: 'bar',
						data: orderCountList,
					},
					{
						name: '订单总额(元)',
						type: 'line',
						yAxisIndex: 1,
						data: totalAmountList,
					},
				],
			}

			myChart.setOption(option)
		},
	},
}
</script>

<style lang="scss" scoped>
.info {
	.echarts {
		width: 80vw;
		height: 400px;
		border: 1px solid #ddd;
	}
}
</style>
