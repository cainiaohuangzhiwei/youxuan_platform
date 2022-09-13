<template>
	<div class="chart-container">
		<WgForm
			:inline="false"
			:data="formData101"
			:items="formCfg101"
			:formAction="formAction101"
		>
			<template slot="tagsList">
				<el-collapse>
					<el-collapse-item title="渠道" name="1">
						<el-row :gutter="10" class="tags-row">
							<el-checkbox-group v-model="formData101.channelList">
								<el-col
									:span="4"
									v-for="(item, index) in $store.state.app.constant
										.SHOP_CHANNEL_LIST"
									:key="index"
								>
									<el-checkbox :label="item.channelList"></el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-row>
					</el-collapse-item>
				</el-collapse>
			</template>
		</WgForm>
		<yx-accounts v-loading="loading" :items="accountItems103"></yx-accounts>
		<div v-loading="loading">
			<div class="top-msg">
				<div>在售店主数/销售额</div>
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
					<el-button
						v-auth="exportCMSOrganizationStatistics"
						type="primary"
						@click="exportIt"
						class="btn-s"
						>导出EXCEL</el-button
					>
				</div>
			</div>
			<echarts :type="radioType" :option="chartData"></echarts>
			<div
				v-if="formData101.timeSelect != 1 && formData101.timeSelect != 2"
				class="top-msg"
			>
				<div>累积在售店主数统计</div>
			</div>
			<echartsTotal
				v-if="formData101.timeSelect != 1 && formData101.timeSelect != 2"
				:type="radioType"
				:option="chartDataTotal"
			></echartsTotal>
		</div>
		<div class="top-msg">
			<div>店主销售数据</div>
		</div>
		<yx-table
			v-loading="loading"
			:columns="tableColumns102"
			:pagination="page102"
			:data="tableData102"
		></yx-table>
	</div>
</template>
<script>
// import WgForm from '@wg-vue-materials/wg-form'
import WgForm from '@/components/WgForm'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getCMSOrganizationStatistics,
	exportCMSOrganizationStatistics,
} from '@/api/yhtPlusCmsStatistics'
import { wgGetDate, downloadFile } from '@/utils/helper/common'
import moment from 'moment'
import echarts from '../echarts'
import echartsTotal from '../echartsTotal'

export default {
	components: {
		WgForm,
		YxAccounts,
		YxTable,
		echarts,
		echartsTotal,
	},
	props: [],
	data() {
		return {
			radioType: 1,
			radioTypeList: [
				{ label: '按小时', value: 1, disabled: false },
				{ label: '按天', value: 2, disabled: true },
				{ label: '按周', value: 3, disabled: true },
				{ label: '按月', value: 4, disabled: true },
			],
			chartData: [],
			chartDataTotal: [],
			radio1: '今日',
			isFourWeek: false,
			loading: false,
			formData101: {
				timeList: [
					wgGetDate().getCurrentStartDate,
					wgGetDate().getCurrentEndDate,
				],
				startTime: moment(wgGetDate().getCurrentStartDate).valueOf(),
				endTime: moment(wgGetDate().getCurrentEndDate).valueOf(),
				channelList: [],
				orderType: 1,
				timeSelect: 2,
			},
			formCfg101: [
				{
					type: 'radioButton',
					title: '时间',
					dataIndex: 'timeSelect',
					label: 'value',
					colSpan: '9',
					options: [
						{
							timeSelect: 1,
							value: '昨日此时',
						},
						{
							timeSelect: 2,
							value: '今日',
						},
						{
							timeSelect: 3,
							value: '本周',
						},
						{
							timeSelect: 4,
							value: '上周',
						},
						{
							timeSelect: 5,
							value: '最近四周',
						},
					],
					change: (val) => {
						this.handleSearch(val)
					},
				},
				{
					type: 'time',
					title: '时段选择',
					dataIndex: 'timeList',
					colSpan: 12,
					change: () => {
						this.formData101.timeList = this.formData101.timeList || ['', '']
						let startTime = this.formData101.timeList[0]
						let endTime = this.formData101.timeList[1]
						this.formData101.startTime = startTime
							? moment(startTime).valueOf()
							: ''
						this.formData101.endTime = endTime ? moment(endTime).valueOf() : ''
						this.timeChange(true)
					},
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
						pickerOptions: {
							shortcuts: [
								{
									text: '今日',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getCurrentStartDate,
											wgGetDate().getCurrentEndDate,
										])
									},
								},
								{
									text: '昨日',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getYesterdayStartDate,
											wgGetDate().getYesterdayEndDate,
										])
									},
								},
								{
									text: '本周',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getWeekStartDate,
											wgGetDate().getWeekEndDate,
										])
									},
								},
								{
									text: '上周',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getUpWeekStartDate,
											wgGetDate().getUpWeekEndDate,
										])
									},
								},
								{
									text: '本月',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getMonthStartDate,
											wgGetDate().getMonthEndDate,
										])
									},
								},
								{
									text: '上月',
									onClick(picker) {
										picker.$emit('pick', [
											wgGetDate().getUpMonthStartDate,
											wgGetDate().getUpMonthEndDate,
										])
									},
								},
							],
						},
					},
				},
				{
					type: 'custom',
					dataIndex: 'tagsList',
				},
				{
					type: 'radioMap',
					title: '流水类型',
					dataIndex: 'orderType',
					label: 'value',
					colSpan: 7,
					options: {
						支付流水: 1,
						成单流水: 2,
					},
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
			],
			accountItems103: [
				{
					type: 'amount',
					title: '总销售额',
					value: '0.00',
				},
				{
					type: 'order',
					title: '总订单数',
					value: '0',
				},
				{
					type: 'order',
					title: '总在售店主数',
					value: '0',
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'timesString',
					title: '时间',
					customRender: (row) => {
						if (this.radioType == 1) {
							return row.timesString.split(':')[0].slice(-2) + ':00'
						} else if (this.radioType == 2) {
							//天
							return row.timesString.split(' ')[0]
						} else if (this.radioType == 3) {
							//周
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
				{
					type: 'string',
					dataIndex: 'orderCount',
					title: '订单数量',
				},
				{
					type: 'amount',
					dataIndex: 'totalAmount',
					title: '销售额',
				},
			],
			page102: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},

	created() {
		this.getData102(true)
	},

	methods: {
		// 操作时间类型
		timeChange(flag) {
			if (flag) this.formData101.timeSelect = ''
			this.isFourWeek = false
			this.radioTypeList.forEach((item) => {
				item.disabled = true
			})

			let difference = this.formData101.endTime - this.formData101.startTime

			if (difference < 24 * 3600 * 1000) {
				this.radioType = 1
				this.radioTypeList[0].disabled = false
			} else if (difference < 7 * 24 * 3600 * 1000) {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
			} else if (difference < 30 * 24 * 3600 * 1000) {
				this.radioType = 3
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
				this.radioTypeList[2].disabled = false
			} else {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
				this.radioTypeList[2].disabled = false
				this.radioTypeList[3].disabled = false
			}

			// if (!this.loading) this.getData102(true)
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
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams102()
			let { data } = await exportCMSOrganizationStatistics(paramJson)
			downloadFile(data, 'excel.xls')
		},
		changeRadio(e) {
			this.type = e
			this.getData102(true)
		},
		// 操作时间类型
		handleSearch(val) {
			this.isFourWeek = false
			this.radioTypeList.forEach((item) => {
				item.disabled = true
			})
			if (val == '1') {
				this.radioType = 1
				this.radioTypeList[0].disabled = false
				this.formData101.timeList = [
					wgGetDate().getYesterdayStartDate,
					new Date().getTime() - 24 * 60 * 60 * 1000,
				]
				this.formData101.startTime = moment(
					wgGetDate().getYesterdayStartDate
				).valueOf()
				this.formData101.endTime = new Date().getTime() - 24 * 60 * 60 * 1000
			} else if (val == '2') {
				this.radioType = 1
				this.radioTypeList[0].disabled = false
				this.formData101.startTime = moment(
					wgGetDate().getCurrentStartDate
				).valueOf()
				this.formData101.endTime = moment(
					wgGetDate().getCurrentEndDate
				).valueOf()
				this.formData101.timeList = [
					wgGetDate().getCurrentStartDate,
					wgGetDate().getCurrentEndDate,
				]
			} else if (val == '3') {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
				this.formData101.startTime = moment(
					wgGetDate().getWeekStartDate
				).valueOf()
				this.formData101.endTime = moment(wgGetDate().getWeekEndDate).valueOf()
				this.formData101.timeList = [
					wgGetDate().getWeekStartDate,
					wgGetDate().getWeekEndDate,
				]
			} else if (val == '4') {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
				this.formData101.startTime = moment(
					wgGetDate().getUpWeekStartDate
				).valueOf()
				this.formData101.endTime = moment(
					wgGetDate().getUpWeekEndDate
				).valueOf()
				this.formData101.timeList = [
					wgGetDate().getUpWeekStartDate,
					wgGetDate().getUpWeekEndDate,
				]
			} else if (val == '5') {
				this.radioType = 2
				this.isFourWeek = true
				this.formData101.startTime = moment(
					wgGetDate().getFourWeekStartDate
				).valueOf()
				this.formData101.endTime = moment(
					wgGetDate().getCurrentEndDate
				).valueOf()
				this.formData101.timeList = [
					wgGetDate().getFourWeekStartDate,
					wgGetDate().getCurrentEndDate,
				]
			}
			this.getData102(true)
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getCMSOrganizationStatistics(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.list) {
				this.tableData102 = resultData.list
				this.chartData = resultData.list
				if (this.isFourWeek == 1) {
					let tmpList = []
					tmpList = tmpList.concat(
						resultData.beforeThreeWeekList,
						resultData.beforeTwoWeekList,
						resultData.beforeOneWeekList,
						resultData.thisWeekList
					)
					this.chartDataTotal = tmpList
				} else {
					this.chartDataTotal = resultData.totalList
				}
				this.accountItems103[0].value = resultData.totalOrganizationAmount
				this.accountItems103[1].value = resultData.totalOrderCount
				this.accountItems103[2].value = resultData.totalOrganizationCount
				this.page102.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			if (this.isFourWeek) {
				this.formData101.isFourWeek = 1
			} else {
				this.formData101.isFourWeek = 0
			}
			if (this.formData101.orderType == 1) {
				this.formData101.receiveState = 3
				this.formData101.orderState = null
			} else if (this.formData101.orderType == 2) {
				this.formData101.orderState = 8
				this.formData101.receiveState = null
			}
			this.formData101.type = this.radioType
			const paramJson = Object.assign(
				{
					length: this.page102.length,
					sortField: 1,
					startIndex: (this.page102.currentPage - 1) * this.page102.length,
				},
				this.formData101
			)
			const time = 60 * 24 * 60 * 60 * 1000
			if (
				paramJson.startTime &&
				paramJson.endTime &&
				time < paramJson.endTime - paramJson.startTime
			) {
				this.loading = false
				return this.$message.warning('时间区间不能大于60天！')
			}
			delete paramJson.timeList
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
		align-items: center;
		margin-bottom: 10px;
	}
	.btn-s {
		margin-left: 20px;
	}
}
</style>
