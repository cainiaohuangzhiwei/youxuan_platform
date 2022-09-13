<template>
	<div class="shopStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<div class="chart-container" v-loading="loading">
				<div class="top-msg">
					<div>注册店主数</div>
					<div>
						<el-radio-group v-model="radioType" @change="changeRadio">
							<el-radio
								v-for="(item, index) in radioTypeList"
								:key="index"
								:label="item.value"
								:disabled="item.disabled"
								>{{ item.label }}</el-radio
							>
						</el-radio-group>
					</div>
				</div>
				<echarts :type="radioType" :option="chartData"></echarts>
			</div>
			<yx-table
				v-loading="loading"
				:columns="tableColumns102"
				:data="tableData102"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'

import YxTable from '@wg-vue-materials/yx-table'
import { getCMSOrganizationLossStatistics } from '@/api/yhtPlusCmsStatistics'
import { wgGetDate } from '@/utils/helper/common'
import moment from 'moment'
import echarts from '../echarts'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		echarts,
	},
	props: [],
	data() {
		return {
			radioType: 3,
			radioTypeList: [
				{ label: '按周', value: 3, disabled: false },
				{ label: '按月', value: 4, disabled: true },
			],
			chartData: [],
			radio1: '今日',
			loading: false,
			formData101: {
				startTime: wgGetDate().getTwoWeekStartDate,
				endTime: wgGetDate().getCurrentEndDate,
				channelList: [],
				timeSelect: 3,
			},
			formCfg101: [
				{
					type: 'radioButton',
					title: '时间',
					dataIndex: 'timeSelect',
					label: 'value',
					options: [
						{
							timeSelect: 3,
							value: '最近两周',
						},
						{
							timeSelect: 4,
							value: '最近两月',
						},
					],
					change: (val) => {
						this.handleSearch(val)
					},
				},
				{
					type: 'datetimerange',
					title: '时段选择',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
					change: () => {
						this.formData101.timeSelect = false
						let difference =
							moment(this.formData101.endTime).valueOf() -
							moment(this.formData101.startTime).valueOf()
						this.radioTypeList.forEach((item) => {
							item.disabled = true
						})
						if (difference < 30 * 24 * 3600 * 1000) {
							this.radioType = 3
							this.radioTypeList[0].disabled = false
							this.radioTypeList[1].disabled = false
						} else {
							this.radioType = 4
							this.radioTypeList[0].disabled = false
							this.radioTypeList[1].disabled = false
						}
						// if (!this.loading) this.getData102()
					},
				},
				{
					title: '渠道',
					type: 'checkbox',
					dataIndex: 'channelList',
					label: 'channelList',
					options: [
						{
							channelList: '渠道服务商3',
							value: '渠道服务商3',
						},
						{
							channelList: '百度搜索',
							value: '百度搜索',
						},
						{
							channelList: '360搜索',
							value: '360搜索',
						},
						{
							channelList: '凌希2',
							value: '凌希2',
						},
						{
							channelList: '橙陨首购CPA',
							value: '橙陨首购CPA',
						},
						{
							channelList: '繁笙首购CPA',
							value: '繁笙首购CPA',
						},
						{
							channelList: '凌希首购CPA',
							value: '凌希首购CPA',
						},
						{
							channelList: '正西首购CPA',
							value: '正西首购CPA',
						},
						{
							channelList: '宏创首购CPA',
							value: '宏创首购CPA',
						},
						{
							channelList: '渠道示例',
							value: '渠道示例',
						},
						{
							channelList: '西瓜皮公众号',
							value: '西瓜皮公众号',
						},
						{
							channelList: '亿远UV_A',
							value: '亿远UV_A',
						},
						{
							channelList: '百姓网wap_BD',
							value: '百姓网wap_BD',
						},
						{
							channelList: '新先视CPS微信',
							value: '新先视CPS微信',
						},
						{
							channelList: '微信群',
							value: '微信群',
						},
						{
							channelList: '朋友圈广告',
							value: '朋友圈广告',
						},
						{
							channelList: 'TZ',
							value: 'TZ',
						},
						{
							channelList: '斗米兼职',
							value: '斗米兼职',
						},
						{
							channelList: 'JNY',
							value: 'JNY',
						},
						{
							channelList: 'mmg',
							value: 'mmg',
						},
						{
							channelList: 'ytt',
							value: 'ytt',
						},
						{
							channelList: '头条渠道',
							value: '头条渠道',
						},
						{
							channelList: '孩教圈推广',
							value: '孩教圈推广',
						},
						{
							channelList: '小程序引导页',
							value: '小程序引导页',
						},
						{
							channelList: '推广渠道',
							value: '推广渠道',
						},
						{
							channelList: '渠道代理商',
							value: '渠道代理商',
						},
						{
							channelList: '腾讯广告推广',
							value: '腾讯广告推广',
						},
						{
							channelList: '邀请码注册',
							value: '邀请码注册',
						},
						{
							channelList: '未知',
							value: '未知',
						},
						{
							channelList: '淘客-黄蜂',
							value: '淘客-黄蜂',
						},
						{
							channelList: '淘客-野蛮',
							value: '淘客-野蛮',
						},
						{
							channelList: '淘客-核桃',
							value: '淘客-核桃',
						},
						{
							channelList: '备用1',
							value: '备用1',
						},
						{
							channelList: '备用2',
							value: '备用2',
						},
						{
							channelList: '备用3',
							value: '备用3',
						},
						{
							channelList: '备用4',
							value: '备用4',
						},
						{
							channelList: '备用5',
							value: '备用5',
						},
						{
							channelList: '备用6',
							value: '备用6',
						},
						{
							channelList: '备用7',
							value: '备用7',
						},
						{
							channelList: '备用8',
							value: '备用8',
						},
						{
							channelList: '备用9',
							value: '备用9',
						},
						{
							channelList: '备用10',
							value: '备用10',
						},
					],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102()
					},
					tableId: 102,
				},
			],
			tableData102: [],
			tableColumns102: [],
		}
	},

	created() {
		this.getData102()
	},

	methods: {
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
		changeRadio(e) {
			this.type = e
			this.getData102()
		},
		// 操作时间类型
		handleSearch(val) {
			this.radioTypeList.forEach((item) => {
				item.disabled = true
			})

			if (val == '3') {
				this.radioType = 3
				this.radioTypeList[0].disabled = false
				this.formData101.startTime = wgGetDate().getTwoWeekStartDate
				this.formData101.endTime = wgGetDate().getCurrentEndDate
			} else if (val == '4') {
				this.radioType = 4
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
				this.formData101.startTime = wgGetDate().getTwoMonthStartDate
				this.formData101.endTime = wgGetDate().getCurrentEndDate
			}
			this.getData102()
		},
		async getData102() {
			this.loading = true
			let paramJson = this.findSearchParams102()
			const {
				data: { resultCode, resultData },
			} = await getCMSOrganizationLossStatistics(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.list) {
				let list = resultData.list

				list.splice(-1, 1)
				let lossRateList = []

				for (let i = 0; i < list.length; i++) {
					lossRateList.push({ rateNum: 0, rate: 0 })

					list[i].lossRateList = []

					let ogIds = []
					if (list[i].ogIds) {
						ogIds = list[i].ogIds.split(',')
					}

					if (ogIds.length > 0) {
						for (let j = 0; j < list.length; j++) {
							if (i < j) {
								let ogIdss = []
								if (list[j].ogIds) {
									ogIdss = list[j].ogIds.split(',')
								}

								let arr = ogIds.concat(ogIdss)
								//使用sort从小到大排序并过滤出前后相同的元素
								let arr1 = arr
									.sort(function (a, b) {
										return a - b
									})
									.filter(function (value, index) {
										return arr[index] === arr[index - 1]
									})

								list[i].lossRateList.push({
									arrNum: arr1.length,
									rate: (arr1.length / ogIds.length).toFixed(2),
								})
							}
						}
					}

					for (let k = 0; k < lossRateList.length; k++) {
						if (list[i].lossRateList.length > k) {
							lossRateList[k].rateNum += ogIds.length
							lossRateList[k].rate += Number(list[i].lossRateList[k].arrNum)
						}
					}
				}

				this.changeColumns(lossRateList)
				this.chartData = lossRateList
				this.tableData102 = list
			}
			this.loading = false
		},
		changeColumns(lossRateList) {
			let tableColumns102 = JSON.parse(JSON.stringify(this.tableColumns102))
			tableColumns102 = [
				{
					type: 'string',
					dataIndex: 'timesString',
					title: '时间',
					customRender: (row) => {
						if (!row.timesString) return
						if (this.radioType == 2) {
							//天
							return row.timesString.split(' ')[0]
						} else if (this.radioType == 3) {
							//周
							return `${row.times.replace('-', '年')}周
					(${moment(this.getWeekDay(row.times)).format('YYYY-MM-DD')}
					)`
						} else {
							return row.timesString.split(' ')[0].slice(0, -3)
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'organizationCount',
					title: '在售店主数量',
				},
			]

			for (let i = 0; i < lossRateList.length; i++) {
				tableColumns102.push({
					type: 'string',
					dataIndex: 'useList',
					title: `第${i + 1}${this.type == 3 ? '周' : '月'}后`,
					customRender: (row) => {
						return row.lossRateList[i]
							? (row.lossRateList[i].rate * 100).toFixed(0) + '%'
							: '-'
					},
				})
			}
			this.tableColumns102 = tableColumns102
		},
		findSearchParams102() {
			this.formData101.startTime =
				moment(this.formData101.startTime).valueOf() || ''
			this.formData101.endTime =
				moment(this.formData101.endTime).valueOf() || ''
			this.formData101.type = this.radioType
			this.formData101.difference =
				this.formData101.endTime - this.formData101.startTime

			const paramJson = Object.assign(this.formData101, {})
			return paramJson
		},
	},
}
</script>
<style lang="scss" scoped>
.chart-container {
	.top-msg {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
	}
	.btn-s {
		margin-left: 10px;
	}
}
</style>
