<template>
	<div class="inviteStatistics">
		<basicContainer>
			<yx-form
				v-loading="loading"
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>

			<div v-if="!loading">
				<div class="chart-container" v-loading="loading">
					<echarts :option="chartData"></echarts>
				</div>
				<yx-form :inline="true" :data="formData1011" :items="formCfg1011">
				</yx-form>
				<div class="chart-container" v-loading="loading">
					<div class="top-msg">
						<div>
							邀请码{{
								this.formCfg1011[0].options[this.formData1011.rateType - 1]
									.value
							}}率分析
						</div>
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
				</div>

				<yx-table
					v-loading="loading"
					:columns="tableColumns102"
					:pagination="page102"
					:data="tableData102"
				></yx-table>

				<div class="chart-container" v-loading="loading">
					<div class="top-msg">
						<div>
							邀请码{{
								this.formCfg1011[0].options[this.formData1011.rateType - 1]
									.value
							}}率趋势
						</div>
					</div>
					<echarts-total
						:difference="formData101.difference"
						:rateType="formData1011.rateType"
						:radioType="radioType"
						:option="chartDataTotal"
						v-if="chartDataTotal && chartDataTotal.length > 0"
					></echarts-total>
				</div>
			</div>
			<Dialog
				:title="dialogTitle103"
				:visible="dialogVisible103"
				:width="dialogWidth103"
				:bottomBtn="dialogBottomBtn103"
				@before-close="dialogVisible103 = false"
			>
				<yx-table
					:select="false"
					v-loading="loading"
					:columns="tableColumns104"
					:pagination="page104"
					:data="tableData104"
				>
					<template slot="useOrganizationName" slot-scope="scope">
						<router-link
							class="blue"
							:to="{
								path: `/shop/shop/shopDetail?organizationId=${scope.row.organizationUse}`,
							}"
						>
							{{ scope.row.useOrganizationName }}</router-link
						>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { wgGetDate } from '@/utils/helper/common'
import echarts from '../echarts'
import echartsTotal from '../echartsTotal'

import {
	getCMSInviteCodeStatistics,
	getInviteCodeUseList,
} from '@/api/yhtPlusCmsStatistics'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		echarts,
		echartsTotal,
	},
	props: [],
	data() {
		return {
			radioType: 2,
			radioTypeList: [
				// { label: '按小时', value: 1, disabled: false },
				{ label: '按天', value: 2, disabled: false },
				{ label: '按周', value: 3, disabled: false },
				{ label: '按月', value: 4, disabled: false },
			],
			chartData: [],
			chartDataTotal: [],
			loading: false,
			formData101: {
				payType: '0',
				timeSelect: 2,
				startTime: wgGetDate().getWeekStartDate,
				endTime: wgGetDate().getWeekEndDate,
				channelList: [],
				type: 2,
			},
			formCfg101: [
				{
					type: 'radioButton',
					title: '时间',
					dataIndex: 'timeSelect',
					label: 'value',
					options: [
						{
							timeSelect: 2,
							value: '本周',
						},
						{
							timeSelect: 3,
							value: '最近两周',
						},
					],
					change: (val) => {
						this.handleSearch(val)
					},
				},
				{
					type: 'select',
					title: '邀请码类型',
					dataIndex: 'payType',
					placeholder: '请输入邀请码类型',
					label: 'value',
					options: [
						{
							payType: '0',
							value: '全部',
						},
						{
							payType: '2',
							value: '付费',
						},
						{
							payType: '4',
							value: '系统生成',
						},
						{
							payType: '5',
							value: '手动生成',
						},
						{
							payType: '6',
							value: '渠道生成',
						},
						{
							payType: '7',
							value: '活动奖励',
						},
						{
							payType: '8',
							value: '活动兑换',
						},
					],
					change: () => {
						this.timeChange(true)
					},
				},
				{
					type: 'datetimerange',
					title: '邀请码生成时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
					change: () => {
						this.timeChange(true)
					},
				},
				{
					type: 'checkbox',
					title: '渠道',
					dataIndex: 'channelList',
					placeholder: '请输入渠道',
					label: 'value',
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
			formData1011: {
				rateType: 1,
			},
			formCfg1011: [
				{
					type: 'radioButton',
					title: '',
					dataIndex: 'rateType',
					label: 'value',
					options: [
						{
							rateType: 1,
							value: '使用',
						},
						{
							rateType: 2,
							value: '有出单',
						},
						{
							rateType: 3,
							value: '有三单',
						},
					],
					change: (val) => {
						this.formData1011.rateType = val
						this.getData102(true)
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
				{
					title: '查看邀请码使用列表',
					type: '',
					auth: '',
					click: (row) => {
						this.activeRow = row
						this.dialogVisible103 = true
						this.getInviteCodeUseList(true)
					},
				},
			],
			activeRow: {},
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'timeString',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'grantCount',
					title: '',
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
			dialogTitle103: '邀请码使用列表',
			dialogWidth103: '90%',
			dialogVisible103: false,
			dialogBottomBtn103: [
				{
					title: '取 消',
					click: () => {
						this.dialogVisible103 = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible103 = false
					},
				},
			],
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'inviteCodeId',
					title: '邀请码ID',
				},
				{
					type: 'string',
					dataIndex: 'inviteCode',
					title: '邀请码',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '生成时间',
				},
				{
					type: 'string',
					title: '备注',
					width: '120',
					dataIndex: 'remark',
				},
				{
					title: '使用时间',
					type: 'date',
					dataIndex: 'useTime',
				},
				{
					title: '使用店铺',
					type: 'custom',
					dataIndex: 'useOrganizationName',
				},
				{
					title: '渠道',
					type: 'string',
					dataIndex: 'channel',
				},
				{
					title: '首次成单时间',
					type: 'string',
					dataIndex: 'orderPayTime',
				},
			],
			page104: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData104()
				},
			},
		}
	},

	created() {
		// this.getData102(true)
	},

	methods: {
		changeRadio(e) {
			this.radioType = e
			this.getData102(true)
		},
		// 操作时间类型
		timeChange(flag) {
			if (flag) this.formData101.timeSelect = ''

			this.radioTypeList.forEach((item) => {
				item.disabled = true
			})

			let difference = this.formData101.endTime - this.formData101.startTime
			if (difference <= 7 * 24 * 3600 * 1000) {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
			} else if (difference <= 31 * 24 * 3600 * 1000) {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
			} else if (difference <= 18 * 30 * 24 * 3600 * 1000) {
				this.radioType = 4
				this.radioTypeList[1].disabled = false
				this.radioTypeList[2].disabled = false
			} else {
				this.radioType = 4
				this.radioTypeList[2].disabled = false
			}

			// this.getData102(true)
		},
		handleSearch(val) {
			if (val == '2') {
				this.formData101.startTime = wgGetDate().getWeekStartDate
				this.formData101.endTime = wgGetDate().getWeekEndDate
			} else if (val == '3') {
				this.formData101.startTime = wgGetDate().getUpWeekStartDate
				this.formData101.endTime = wgGetDate().getWeekEndDate
			}
			this.radioTypeList.forEach((item) => {
				item.disabled = true
			})

			let difference = this.formData101.endTime - this.formData101.startTime
			if (difference <= 7 * 24 * 3600 * 1000) {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
			} else if (difference <= 31 * 24 * 3600 * 1000) {
				this.radioType = 2
				this.radioTypeList[0].disabled = false
				this.radioTypeList[1].disabled = false
			} else if (difference <= 18 * 30 * 24 * 3600 * 1000) {
				this.radioType = 4
				this.radioTypeList[1].disabled = false
				this.radioTypeList[2].disabled = false
			} else {
				this.radioType = 4
				this.radioTypeList[2].disabled = false
			}
			this.getData102(true)
		},
		async getData102(flag) {
			console.log(resultData, '---0---')
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			console.log(resultData, '---0111---')
			const {
				data: { resultCode, resultData },
			} = await getCMSInviteCodeStatistics(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			console.log(resultData, '---2---')
			this.chartData = resultData.InviteCodeCounts
			if (resultData.inviteCodeSimpleList) {
				this.changeTabel(resultData.inviteCodeSimpleList)
				console.log(resultData, '---4---')
				this.chartDataTotal = resultData.inviteCodeSimpleList
				this.page102.count = resultData.count
			}
			this.loading = false
		},
		// 转换table渲染
		changeTabel(arr) {
			let inviteCodeRateList = []
			let inviteShowList = [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0,
			] //限制30列
			let difference = this.formData101.endTime - this.formData101.startTime
			console.log(arr, '---5---')
			for (let i = 0; i < inviteShowList.length; i++) {
				if (
					(difference + 1000) / (24 * 3600 * 1000) > i &&
					this.radioType == 2
				) {
					inviteShowList[i] = 1
					inviteCodeRateList.push({ rateNum: 0, rate: 0 })
				}
				if (
					(difference + 1000) / (7 * 24 * 3600 * 1000) > i &&
					this.radioType == 3
				) {
					inviteShowList[i] = 1
					inviteCodeRateList.push({ rateNum: 0, rate: 0 })
				}
				if (
					(difference + 1000) / (30 * 24 * 3600 * 1000) > i &&
					this.radioType == 4
				) {
					inviteShowList[i] = 1
					inviteCodeRateList.push({ rateNum: 0, rate: 0 })
				}
			}
			console.log(arr, '---6---')
			let curDate = moment(new Date()).format('YYYY-MM-DD')
			if (this.radioType == 4) {
				curDate = moment(new Date()).format('YYYY-MM')
			}
			let inviteList = []
			let curTime = new Date(curDate).getTime()
			if (this.radioType == 3) {
				curTime = wgGetDate().getWeekStartDate
			}
			console.log(arr, '---7---')
			for (let i = 0; i < arr.length; i++) {
				let item = arr[i]
				let itemTime = new Date(item.timeString).getTime()
				if (itemTime > curTime) {
					continue
				} else {
					inviteList.push(item)
				}
			}
			let useListTotal = []
			for (let i = 0; i < inviteList.length; i++) {
				let item = inviteList[i]
				useListTotal[i] = [
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
					{ useCount: 0 },
				]

				let useSituationList = item.useSituation.split(',')
				for (let k = 0; k < useListTotal[i].length; k++) {
					let useCount = 0
					//        log('下标 =>'+k+'  当前时间 =>'+curDate+'  当前时间戳=>'+curTime)
					for (let j = 0; j < useSituationList.length; j++) {
						let time = useSituationList[j].split(':')[0]
						let count = useSituationList[j].split(':')[1]
						let useDate = new Date(time).getTime()
						if (this.radioType == 3) {
							//计算周
							useDate = this.getWeekDay(time).getTime()
						}
						if (j > 0 && k == j) {
							//大于当前时间的不显示
							//            log('下标 =>'+k+'  当前时间 =>'+time+'  当前时间戳=>'+useDate)
							if (curTime <= useDate) {
								useListTotal[i][k].flag = true
							}
						}
						if (k < j) {
							break
						} else {
							useCount += Number(count)
						}
					}
					useListTotal[i][k].useCount = useCount
					if (!useListTotal[i][k].flag && inviteCodeRateList[k]) {
						inviteCodeRateList[k].rateNum += item.grantCount
						inviteCodeRateList[k].rate += useCount
					}
				}
				//      log(item.useList)
			}
			let tableColumns102 = [
				{
					type: 'string',
					dataIndex: 'timeString',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'grantCount',
					title: '',
				},
			]
			tableColumns102[0].customRender = (row) => {
				if (this.radioType == 2) {
					//天
					return row.timeString.split(' ')[0]
				} else if (this.radioType == 3) {
					//周
					return `${row.times.replace('-', '年')}周
					(${moment(this.getWeekDay(row.times)).format('YYYY-MM-DD')}
					)`
				} else {
					return row.timeString.split(' ')[0].slice(0, -3)
				}
			}
			if (this.formData1011.rateType == 1) {
				tableColumns102[1].title = '发放邀请码数'
			} else if (this.formData1011.rateType == 2) {
				tableColumns102[1].title = '使用邀请码数'
			} else if (this.formData1011.rateType == 3) {
				tableColumns102[1].title = '有出单邀请码数'
			}

			tableColumns102[2] = {
				type: 'string',
				dataIndex: 'useList',
				title: `当${
					this.radioType == 2 ? '天' : this.radioType == 3 ? '周' : '月'
				}
					`,
				customRender: (row) => {
					return (
						(
							(row.useSituation.split(',')[0].split(':')[1] / row.grantCount) *
							100
						).toFixed(2) + ' %'
					)
				},
			}

			inviteShowList.forEach((item, index) => {
				if (item == 1) {
					tableColumns102.push({
						type: 'string',
						dataIndex: 'useList',
						title:
							'第' +
							(index + 1) +
							(this.radioType == 2 ? '天' : this.radioType == 3 ? '周' : '月') +
							'后',
						customRender: (row) => {
							if (useListTotal[index] && useListTotal[index].length > 0) {
								if (useListTotal[index][index + 1].flag) {
									return '-'
								}
								return (
									(
										(useListTotal[index][index + 1].useCount / row.grantCount) *
										100
									).toFixed(2) + '%'
								)
							} else {
								return '-'
							}
						},
					})
				}
			})
			this.tableColumns102 = tableColumns102
			window.console.log(inviteList, '---------', this.tableColumns102)
			this.tableData102 = inviteList
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
		async getInviteCodeUseList(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await getInviteCodeUseList(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}

			if (resultData.list) {
				this.tableData104 = resultData.list
				this.page104.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			this.formData101.startTime =
				moment(this.formData101.startTime).valueOf() || ''
			this.formData101.endTime =
				moment(this.formData101.endTime).valueOf() || ''
			this.formData101.type = this.radioType
			this.formData101.difference =
				this.formData101.endTime - this.formData101.startTime
			const paramJson = Object.assign(
				{ ...this.formData101, ...this.formData1011 },
				{
					length: this.page104.length,
					startIndex: (this.page104.currentPage - 1) * this.page104.length,
				}
			)
			return paramJson
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			this.formData101.startTime =
				moment(this.formData101.startTime).valueOf() || ''
			this.formData101.endTime =
				moment(this.formData101.endTime).valueOf() || ''
			this.formData101.type = this.radioType
			this.formData101.difference =
				this.formData101.endTime - this.formData101.startTime
			const paramJson = Object.assign(
				{ ...this.formData101, ...this.formData1011 },
				{
					length: this.page102.length,
					startIndex: (this.page102.currentPage - 1) * this.page102.length,
				}
			)
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
		margin: 18px 0 0;
	}
	.btn-s {
		margin-left: 10px;
	}
}
.blue {
	color: #4498e0;
}
</style>
