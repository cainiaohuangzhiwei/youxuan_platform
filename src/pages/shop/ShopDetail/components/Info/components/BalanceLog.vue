<template>
	<div v-loading="loading">
		<YxAccounts :items="statistics" />

		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form>

		<yx-table :columns="tableColumns" :pagination="page" :data="tableData">
		</yx-table>
	</div>
</template>

<script>
import moment from 'moment'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import YxAccounts from '@/components/Accounts/index'
import { balanceLogList, findOrganizationDetails } from '@/api/shopDetail'
import { wgGetDate, retainDecimalPoint } from '@/utils/helper/common'

export default {
	components: {
		YxForm,
		YxTable,
		YxAccounts,
	},

	props: {
		organizationId: {
			default: '',
		},
	},

	data() {
		return {
			searchData: {
				watercourseSn: '',
				orderSn: '',
				organizationName: '',
				watercourseType: '0',
				intoAccountState: 0,
				startArrivalTime: wgGetDate().getMonthStartDate,
				endArrivalTime: wgGetDate().getMonthEndDate,
				startTime: '',
				endTime: '',
			},
			searchCfg: [
				{
					title: '流水号',
					dataIndex: 'watercourseSn',
					placeholder: '请输入流水号',
				},
				{
					title: '订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					title: '店铺名称',
					dataIndex: 'organizationNameKeyword',
					placeholder: '请输入店铺名称',
				},
				{
					title: '记账时间',
					type: 'datetimerange',
					dataIndex: ['startArrivalTime', 'endArrivalTime'],
				},
				{
					title: '下单时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					type: 'select',
					title: '流水类型',
					dataIndex: 'watercourseType',
					label: 'value',
					options: [
						{
							watercourseType: '0',
							value: '全部',
						},
						{
							watercourseType: '1',
							value: '余额冲账',
						},
						{
							watercourseType: '2',
							value: '可赚金',
						},
						{
							watercourseType: '3',
							value: '推广分成',
						},
						{
							watercourseType: '4',
							value: '提现成功',
						},
						// {
						// 	watercourseType: '7',
						// 	value: '分销分佣',
						// },
						{
							watercourseType: '8',
							value: '邀请返佣',
						},
						{
							watercourseType: '12',
							value: '余额退款',
						},
						{
							watercourseType: '24',
							value: '砍价返佣',
						},
						{
							watercourseType: '26',
							value: '京东可赚金',
						},
						// {
						// 	watercourseType: '28',
						// 	value: '京东分销分佣',
						// },
						{
							watercourseType: '30',
							value: '平台奖励',
						},
						{
							watercourseType: '31',
							value: '订单补款',
						},
						{
							watercourseType: '32',
							value: '首单奖励',
						},
						{
							watercourseType: '43',
							value: '余额充值',
						},
						{
							watercourseType: '42',
							value: '结算[月度收益]',
						},
						{
							watercourseType: '44',
							value: '调账[月度收益]',
						},
						{
							watercourseType: '50',
							value: '卖货佣金',
						},
						{
							watercourseType: '51',
							value: '好友奖励',
						},
						{
							watercourseType: '52',
							value: '活动订单卖货佣金',
						},
						{
							watercourseType: '53',
							value: '活动订单好友奖励',
						},
						{
							watercourseType: '54',
							value: '活动奖励金',
						},
						{
							watercourseType: '55',
							value: '余额扣回',
						},
					],
				},
				{
					type: 'select',
					title: '冻结状态',
					dataIndex: 'intoAccountState',
					label: 'value',
					options: [
						{
							intoAccountState: 0,
							value: '全部',
						},
						{
							intoAccountState: 2,
							value: '已入账',
						},
						{
							intoAccountState: 1,
							value: '待入账',
						},
					],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init()
					},
				},
			],
			loading: false,
			statistics: [
				{
					type: 'money',
					title: '入账总额',
					value: 0,
				},
				{
					type: 'money',
					title: '待入账',
					value: 0,
				},
				{
					type: 'money',
					title: '已入账',
					value: 0,
				},
				{
					type: 'money',
					title: '出账总额',
					value: 0,
				},
				{
					type: 'money',
					title: '余额支出',
					value: 0,
				},
				{
					type: 'money',
					title: '个人销售额',
					value: 0,
				},
				{
					type: 'money',
					title: '团队销售额',
					value: 0,
				},
				{
					type: 'money',
					title: '累计默认可赚金',
					value: 0,
				},
			], // 余额流水数据
			tableData: [], // table数据
			tableColumns: [
				{
					dataIndex: 'organizationName',
					title: '店主名称',
				},
				{
					width: 180,
					dataIndex: 'watercourseSn',
					title: '流水号',
				},
				{
					type: 'string',
					dataIndex: 'arrivalTime',
					title: '记账时间',
					customRender: (row) => {
						return row.arrivalTime
							? moment(row.arrivalTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '下单时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					width: 180,
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					dataIndex: 'realAmount',
					title: '订单金额',
					customRender: (row) => {
						return `￥${retainDecimalPoint(row.realAmount, 2)}`
					},
				},
				{
					type: 'string',
					dataIndex: 'watercourseType',
					title: '类型',
					customRender: (row) => {
						return this.handleType(row)
					},
				},
				{
					dataIndex: 'watercourseAmount',
					title: '流水金额',
					customRender: (row) => {
						return this.handleWatercourseAmount(row)
					},
				},
				{
					type: 'string',
					dataIndex: 'intoAccountState',
					title: '冻结状态',
					customRender: (row) => {
						return this.transitionIntoAccountState(row.intoAccountState)
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		this.init(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				organizationId: this.organizationId || '',
				watercourseTypeList:
					this.searchData.watercourseType == 0
						? []
						: [this.searchData.watercourseType],
				startTime: moment(this.searchData.startTime).valueOf() || '',
				endTime: moment(this.searchData.endTime).valueOf() || '',
				startArrivalTime:
					moment(this.searchData.startArrivalTime).valueOf() || '',
				endArrivalTime: moment(this.searchData.endArrivalTime).valueOf() || '',
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		// 处理类型
		handleType(row) {
			const value = row.watercourseType
			if (value == 1) {
				return '余额冲账'
			} else if (value == 2) {
				return '可赚金'
			} else if (value == 3) {
				return '推广分成'
			} else if (value == 4) {
				return '提现成功'
			} else if (value == 5) {
				return '提现失败'
			} else if (value == 6) {
				return '发起提现'
			} else if (value == 7) {
				if (row.level == 1) {
					return '分销分佣(一级)'
				} else if (row.level == 2) {
					return '分销分佣(二级)'
				} else if (row.level == 3) {
					return '分销分佣(三级)'
				} else if (row.level == 4) {
					return '分销分佣(四级)'
				} else {
					return '分销分佣'
				}
			} else if (value == 8) {
				return '邀请返佣'
			} else if (value == 12) {
				return '余额退款'
			} else if (value == 24) {
				return '砍价返佣'
			} else if (value == 26) {
				return '京东可赚金'
			} else if (value == 28) {
				return '京东分销分佣'
			} else if (value == 30) {
				return '平台奖励'
			} else if (value == 31) {
				return '订单补款'
			} else if (value == 32) {
				return '首单奖励'
			} else if (value == 33) {
				return '余额冲账-权益卡'
			} else if (value == 42) {
				return '结算[月度收益]'
			} else if (value == 43) {
				return '余额充值'
			} else if (value == 44) {
				return '调账[月度收益]'
			} else if (value == 50) {
				return '卖货佣金'
			} else if (value == 51) {
				return '好友奖励'
			} else if (value == 52) {
				return '活动订单卖货佣金'
			} else if (value == 53) {
				return '活动订单好友奖励'
			} else if (value == 54) {
				return '活动奖励金'
			} else if (value == 55) {
				return '余额扣回'
			} else {
				return '其他'
			}
		},

		// 处理
		handleWatercourseAmount(row) {
			const { watercourseAmount, watercourseType } = row
			console.log('watercourseAmount>>>1', watercourseAmount, watercourseType)
			//1，余额冲账 2，内购结算 3，推广分成 4,提现成功 5,提现失败 6,发起提现 7,渠道分佣 8,下单返现
			if (watercourseAmount) {
				if (
					watercourseType == 1 ||
					watercourseType == 4 ||
					watercourseType == 8 ||
					watercourseType == 24 ||
					watercourseType == 33
				) {
					return `-￥${retainDecimalPoint(watercourseAmount, 2)}`
				} else if (
					watercourseType == 2 ||
					watercourseType == 3 ||
					watercourseType == 7 ||
					watercourseType == 42 ||
					watercourseType == 43 ||
					watercourseType == 44 ||
					watercourseType == 52 ||
					watercourseType == 53
				) {
					if (watercourseAmount < 0) {
						return '-￥' + Math.abs(watercourseAmount).toFixed(2)
					} else {
						return `+￥${retainDecimalPoint(watercourseAmount, 2)}`
					}
				} else if (
					watercourseType == 12 ||
					watercourseType == 26 ||
					watercourseType == 28 ||
					watercourseType == 30 ||
					watercourseType == 31
				) {
					return `+￥${retainDecimalPoint(watercourseAmount, 2)}`
				} else if (watercourseType == 50 || watercourseType == 51) {
					if (watercourseAmount < 0) {
						return '-￥' + Math.abs(watercourseAmount).toFixed(2)
					} else {
						return `+￥${retainDecimalPoint(watercourseAmount, 2)}`
					}
				} else {
					return `+￥${retainDecimalPoint(watercourseAmount, 2)}`
				}
			} else {
				return '0'
			}
		},

		// 获取余额流水列表
		async init(flag) {
			let allAata = {}
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const paramsData = Object.assign(
				{},
				{
					organizationId: this.organizationId,
					startTime: paramJson.startTime,
					endTime: paramJson.endTime,
				}
			)
			const resFirst = await balanceLogList(paramJson)
			const resSecond = await findOrganizationDetails(paramsData)

			Promise.all([resFirst, resSecond]).then((res) => {
				if (
					res[0].data.resultData.balanceWatercourseList.length > 0 ||
					res[0].data.resultData.statistics
				) {
					allAata = res[0].data.resultData.statistics || {}
					this.tableData = res[0].data.resultData.balanceWatercourseList
					this.page.count = res[0].data.resultData.Count
					this.loading = false
				} else {
					this.page.count = 0
					this.tableData = []
					this.loading = false
				}

				const data = Object.assign(allAata, res[1].data.resultData)
				this.statistics[0].value = data.intoAccountAmount || 0
				this.statistics[1].value = data.sumUnIntoAccountAmount || 0
				this.statistics[2].value =
					data.intoAccountAmount - data.sumUnIntoAccountAmount || 0
				this.statistics[3].value = data.outAccountAmount || 0
				this.statistics[4].value = data.balanceAmount || 0
				this.statistics[5].value = data.personalVolume || 0
				this.statistics[6].value = data.teamVolume || 0
				this.statistics[7].value = data.sumEarnAmount || 0
			})
		},

		// 转换冻结状态
		transitionIntoAccountState(val) {
			if (val == 1) {
				return '待入账'
			} else if (val == 2) {
				return '已入账'
			} else {
				return '其他'
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
