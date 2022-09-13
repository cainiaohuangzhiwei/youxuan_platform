/* eslint-disable vue/no-parsing-error */ /* eslint-disable no-unused-vars */
<template>
	<div class="wg_main">
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form>
		<div v-loading="loading">
			<!-- 账户余额 -->
			<div>
				<p class="mb10">账户余额</p>
				<div class="data_list">
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>流水账户</div>
							<div class="fz18 mt10">
								￥
								{{
									groupBalance.flowAmount
										? numberFormat(groupBalance.flowAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>成本账户</div>
							<div class="fz18 mt10">
								￥{{
									groupBalance.costAmount
										? numberFormat(groupBalance.costAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
						<el-button
							type="primary"
							@click="toWithdraw(2)"
							class="data_btn"
							v-if="authList.doWithdraw"
							>提现</el-button
						>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>盈利账户</div>
							<div class="fz18 mt10">
								￥{{
									groupBalance.gainAmount
										? numberFormat(groupBalance.gainAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
						<el-button
							type="primary"
							@click="toWithdraw(3)"
							class="data_btn"
							v-if="authList.doWithdraw"
							>提现</el-button
						>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>返现账户</div>
							<div class="fz18 mt10">
								￥{{
									groupBalance.cashAmount
										? numberFormat(groupBalance.cashAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
						<el-button
							type="primary"
							@click="toWithdraw(1)"
							class="data_btn"
							v-if="authList.doWithdraw"
							>提现</el-button
						>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>营销账户</div>
							<div class="fz18 mt10">
								￥{{
									groupBalance.marketingAmount
										? numberFormat(groupBalance.marketingAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
						<el-button
							type="primary"
							@click="toWithdraw(7)"
							class="data_btn"
							v-if="authList.doWithdraw"
							>提现</el-button
						>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>微革待收账户</div>
							<div class="fz18 mt10">
								￥{{
									groupBalance.weegetAmount
										? numberFormat(groupBalance.weegetAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
						<el-button
							type="primary"
							@click="toWithdraw(9)"
							class="data_btn"
							v-if="authList.doWithdraw"
							>提现</el-button
						>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>权益保障费用账户</div>
							<div class="fz18 mt10">
								￥{{
									groupBalance.equityAmount
										? numberFormat(groupBalance.equityAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
						<el-button
							type="primary"
							@click="toWithdraw(8)"
							class="data_btn"
							v-if="authList.doWithdraw"
							>提现</el-button
						>
					</div>

					<div class="data_item"></div>
				</div>
			</div>

			<!-- 金额流向 -->
			<div v-if="authList.financeStatisticsInfo">
				<p class="mb10">金额流向</p>
				<div class="data_list">
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>收入总额</div>
							<div class="fz18 mt10">
								￥
								{{
									flowStatistics.orderAmount
										? numberFormat(flowStatistics.orderAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>手续费</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.serviceChargeCount
										? numberFormat(flowStatistics.serviceChargeCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>商家成本</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.costAmountCount
										? numberFormat(flowStatistics.costAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>优惠券</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.couponAmountCount
										? numberFormat(flowStatistics.couponAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>佣金</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.purchaseFee
										? numberFormat(flowStatistics.purchaseFee, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>服务奖励</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.commissionCharge
										? numberFormat(flowStatistics.commissionCharge, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>退款金额</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.refundAmount
										? numberFormat(flowStatistics.refundAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>盈利</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.gainAmountCount
										? numberFormat(flowStatistics.gainAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 数据统计（收入） -->
			<div v-if="authList.financeStatisticsInfo">
				<p class="mb10">数据统计（收入）</p>
				<div class="data_list">
					<div
						@click="incomeTotalList('supplierSubsibyList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>商家补贴</div>
							<div class="fz18 mt10">
								￥
								{{
									flowStatistics.compensateAmountCount
										? numberFormat(flowStatistics.compensateAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div
						@click="incomeTotalList('incomeTotalList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>收入总额</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.incomeAmountCount
										? numberFormat(flowStatistics.incomeAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div
						@click="incomeTotalList('refundTotalList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>返退总额</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.refundAmountCount
										? numberFormat(flowStatistics.refundAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div
						@click="incomeTotalList('inviteCodeTotalList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>邀请码总额</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.inviteCodeAmount
										? numberFormat(flowStatistics.inviteCodeAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div
						@click="incomeTotalList('equityIncomeList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>权益保障收入</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.equityIncomeAmount
										? numberFormat(flowStatistics.equityIncomeAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item"></div>
					<div class="data_item"></div>
					<div class="data_item"></div>
				</div>
			</div>

			<!-- 数据统计（支出） -->
			<div v-if="authList.financeStatisticsInfo">
				<p class="mb10">数据统计（支出）</p>
				<div class="data_list">
					<div
						@click="incomeTotalList('supplierCostList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>商家成本</div>
							<div class="fz18 mt10">
								￥
								{{
									flowStatistics.costAmountCount
										? numberFormat(flowStatistics.costAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div
						@click="incomeTotalList('higherRebateList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>服务奖励</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.commissionCharge
										? numberFormat(flowStatistics.commissionCharge, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div
						@click="incomeTotalList('storeActRebateList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>营销费用</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.rewardAmountCount
										? numberFormat(flowStatistics.rewardAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>提现金额</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.withdrawAmount
										? numberFormat(flowStatistics.withdrawAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div
						@click="incomeTotalList('couponDeductionList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>优惠券扣减总额</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.couponAmountCount
										? numberFormat(flowStatistics.couponAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>佣金</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.purchaseFee
										? numberFormat(flowStatistics.purchaseFee, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>权益保障支出费用</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.equityExpensesAmount
										? numberFormat(flowStatistics.equityExpensesAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div
						@click="incomeTotalList('equityPayList')"
						class="pointer data_item"
					>
						<div class="capital_images"></div>
						<div class="data_msg">
							<div>权益赔付费用</div>
							<div class="fz18 mt10">
								￥{{
									flowStatistics.equityPayAmount
										? numberFormat(flowStatistics.equityPayAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt20">
				<p>1.商家成本：向商家下单的订单成本（包括需向商家支付的运费）</p>
				<p>2.商家补贴：商家的奖励或补偿金额</p>
				<p>3.收入总额：实际支付金额-第三方手续费</p>
				<p>
					4.返退总额：包括补偿金额及返退退款金额，需要统计第三方多组织多小程序的订单返退
				</p>
				<p>5.邀请码收益：除去服务奖励，最终优选平台所得的邀请码总额</p>
				<p>6.京东佣金：需要手动在充值界面录入佣金金额</p>
				<p>7.优惠券扣减总额：订单使用优惠券的总额（只统计折扣类优惠券）</p>
				<p>8.服务奖励明细：记录订单需要返给店主上级的费用</p>
				<p>9.营销费用：优选平台奖励给店主的金额</p>
				<p>
					10.订单运费：所有订单运费的收入与支出统计（用户下单的运费和需要给商家支付的运费）
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
// eslint-disable-next-line no-unused-vars
import { wgGetDate, getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'
import { getFinanceStatisticsInfo } from '@/api/yhtPlusCmsFinance'
import { numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		// eslint-disable-next-line vue/no-unused-components
		BasicContainer,
		YxForm,
		// eslint-disable-next-line vue/no-unused-components
		YxTable,
	},
	name: 'FormTable',
	data() {
		return {
			authList: {},
			loading: false,
			checkFlag: false,
			numberFormat: numberFormat,
			flowStatistics: {},
			groupBalance: {},
			fundBalance: {},
			today: false,
			month: false,
			lastMonth: false,
			searchData: {
				groupId: 2,
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
			},
			searchCfg: [
				{
					title: '统计时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.callFinanceStatisticsInfo(e)
					},
				},
				{
					title: '今日',
					type: 'primary',
					click: () => {
						this.today = true
						this.month = false
						this.lastMonth = false
						this.callFinanceStatisticsInfo(true)
					},
				},
				{
					title: '本月',
					type: 'primary',
					click: () => {
						this.month = true
						this.lastMonth = false
						this.today = false
						this.callFinanceStatisticsInfo(true)
					},
				},
				{
					title: '上月',
					type: 'primary',
					click: () => {
						this.lastMonth = true
						this.month = false
						this.today = false
						this.callFinanceStatisticsInfo(true)
					},
				},
			],
		}
	},
	created: function () {
		// this.initPage()
		// 权限
		this.authList = {
			doWithdraw: checkFunctionCode('doWithdraw'),
			financeStatisticsInfo: checkFunctionCode('financeStatisticsInfo'),
		}
	},
	watch: {
		$route: {
			immediate: true,
			deep: true,
			handler(newRoute) {
				if (newRoute.path == '/finance/financeDetails') {
					this.initPage()
				}
			},
		},
	},
	methods: {
		toWithdraw(type) {
			// 发起提现
			this.$router.push({
				path: `financeWithdraw/${type}`,
			})
		},
		onSubmit() {
			this.callFinanceStatisticsInfo(true)
		},
		resetForm(formName) {
			this.$refs[formName].resetFields()
		},
		incomeTotalList(e) {
			this.$router.push({
				path: `${e}`,
			})
		},
		// eslint-disable-next-line no-unused-vars
		findSearchParams(flag) {
			let paramJson = this.searchData
			paramJson.addTimeStart = moment(paramJson.addTimeStart).valueOf() || ''
			paramJson.addTimeEnd = moment(paramJson.addTimeEnd).valueOf() || ''
			return paramJson
		},
		async initPage() {
			await this.callFinanceStatisticsInfo()
		},
		async callFinanceStatisticsInfo(flag) {
			let paramJson = this.findSearchParams(flag)
			this.timeInitial(paramJson)
			this.loading = true
			let {
				data: { resultCode, resultData = {} },
			} = await getFinanceStatisticsInfo(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.flowStatistics =
					resultData && resultData.flowStatistics
						? resultData.flowStatistics
						: {}
				this.groupBalance =
					resultData && resultData.groupBalance ? resultData.groupBalance : {}
			}
		},

		// 处理时间
		async timeInitial(paramJson) {
			console.log('今日', this.today)
			console.log('本月', this.month)
			console.log('上月', this.lastMonth)
			//今日
			if (this.today) {
				paramJson.addTimeStart =
					moment(moment().startOf('day').valueOf()).valueOf() || ''
				paramJson.addTimeEnd =
					moment(moment().endOf('day').valueOf()).valueOf() || ''
			}
			//本月
			if (this.month) {
				paramJson.addTimeStart =
					moment().startOf('month').valueOf().valueOf() || ''
				paramJson.addTimeEnd = moment().endOf('month').valueOf().valueOf() || ''
			}
			//上月
			if (this.lastMonth) {
				paramJson.addTimeStart = moment()
					.startOf('month')
					.subtract('month', 1)
					.valueOf()
				paramJson.addTimeEnd =
					moment().subtract('month', 1).endOf('month').valueOf() || ''
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.mt10 {
	margin-top: 10px;
}

.data_list {
	width: 100%;
	display: flex;
	align-items: center;
	font-size: 14px;
	border: 1px solid #e8e8e8;
	border-right: 0;
}

.data_list + .data_list {
	border-top: 0;
}

.mt-10 {
	margin-top: -10px;
}

.data_item {
	display: flex;
	justify-content: center;
	flex: 1;
	padding: 25px 0;
	text-align: center;
	border-right: 1px solid #e8e8e8;
}
.data_msg {
	margin: 0 10px;
}
.data_btn {
	margin-top: 5px;
	padding: 0 15px;
	height: 32px;
	line-height: 32px;
}
.capital_images {
	width: 50px;
	height: 50px;
	background-image: url(../../../../../../static/images/capital_images.png);
	background-size: 50px 50px;
	background-repeat: no-repeat;
}

.collect_money {
	width: 50px;
	height: 50px;
	background-image: url(../../../../../../static/images/collect_money.png);
	background-size: 50px 50px;
	margin-right: 10px;
}

.expenditure_money {
	width: 50px;
	height: 55px;
	background-image: url(../../../../../../static/images/expenditure_money.png);
	background-size: 110% 120%;
	background-repeat: no-repeat;
	margin-right: 10px;
}
</style>
