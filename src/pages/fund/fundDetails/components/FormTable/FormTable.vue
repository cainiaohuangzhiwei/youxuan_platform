/* eslint-disable vue/no-parsing-error */ /* eslint-disable no-unused-vars */
<template>
	<div class="wg_main">
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form>
		<div>
			<!--老资金 -->
			<div v-auth="'getFinanceStatisticsInfo'">
				<p class="mb10">老资金账户</p>
				<div class="data_list">
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>流水账户</div>
							<div class="fz18 theme_c mt10">
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
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>成本账户</div>
							<div class="fz18 theme_c mt10">
								￥{{
									groupBalance.costAmount
										? numberFormat(groupBalance.costAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>盈利账户</div>
							<div class="fz18 theme_c mt10">
								￥{{
									groupBalance.gainAmount
										? numberFormat(groupBalance.gainAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>营销账户</div>
							<div class="fz18 theme_c mt10">
								￥{{
									groupBalance.marketingAmount
										? numberFormat(groupBalance.marketingAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>权益保障费用账户</div>
							<div class="fz18 theme_c mt10">
								￥{{
									groupBalance.equityAmount
										? numberFormat(groupBalance.equityAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>微革待收账户</div>
							<div class="fz18 theme_c mt10">
								￥{{
									groupBalance.weegetAmount
										? numberFormat(groupBalance.weegetAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item"></div>
					<div class="data_item"></div>
				</div>
			</div>
			<div v-auth="'fundBalanceStatistics'">
				<!--资金账户 -->
				<p class="mb10 mt20">资金账户</p>
				<div class="data_list">
					<div class="data_item">
						<div class="mt10 ml100 capital_images"></div>
						<div class="p_absolute">
							<div>商家待结算账户<br />(汇总)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									fundBalance.supplierPendingAmount
										? numberFormat(fundBalance.supplierPendingAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="mt10 ml100 capital_images"></div>
						<div class="p_absolute">
							<div>商家可用余额账户<br />(汇总)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									fundBalance.supplierAvailableAmount
										? numberFormat(fundBalance.supplierAvailableAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>店主账户汇总</div>
							<div class="fz18 theme_c mt10">
								￥{{
									fundBalance.organizationBalance
										? numberFormat(fundBalance.organizationBalance, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>微革账户</div>
							<div class="fz18 theme_c mt10">
								￥{{
									fundBalance.weegetBalance
										? numberFormat(fundBalance.weegetBalance, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>微革营销账户</div>
							<div class="fz18 theme_c mt10">
								￥{{
									fundBalance.marketingBalance
										? numberFormat(fundBalance.marketingBalance, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item"></div>
					<div class="data_item"></div>
					<div class="data_item"></div>
				</div>
				<!-- 数据统计 -->
				<p class="mb10 mt20" style="display: inline">数据统计</p>
				<p
					class="el-icon-question"
					title="盈利=订单总额-（商家成本+可赚金+平台奖励+手续费+平台营销费用）-退款金额-退款营销费用金额;"
				></p>
				<div class="data_list">
					<div class="data_item">
						<div class="ml100 collect_money"></div>
						<div class="p_absolute">
							<div>订单总额(收)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.orderAmount
										? numberFormat(flowStatistics.orderAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>商家成本(支)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.costAmountCount
										? numberFormat(flowStatistics.costAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>可赚金(支)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.purchaseFee
										? numberFormat(flowStatistics.purchaseFee, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 expenditure_money"></div>
						<div class="p_absolute">
							<div>服务奖励(支)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.commissionCharge
										? numberFormat(flowStatistics.commissionCharge, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div class="data_item">
						<div class="ml100 expenditure_money"></div>
						<div class="p_absolute">
							<div>平台营销费用<br />(支)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.couponAmountCount
										? numberFormat(flowStatistics.couponAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 expenditure_money"></div>
						<div class="p_absolute">
							<div>手续费金额(支)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.serviceChargeCount
										? numberFormat(flowStatistics.serviceChargeCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 expenditure_money"></div>
						<div class="p_absolute">
							<div>退款金额(支)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.refundAmount
										? numberFormat(flowStatistics.refundAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 capital_images"></div>
						<div class="p_absolute">
							<div>盈利(收)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.gainAmountCount
										? numberFormat(flowStatistics.gainAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div class="data_item">
						<div class="ml100 collect_money"></div>
						<div class="p_absolute">
							<div>权益保障(收)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.equityIncomeAmount
										? numberFormat(flowStatistics.equityIncomeAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 expenditure_money"></div>
						<div class="p_absolute">
							<div>权益赔付(支 )</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.equityPayAmount
										? numberFormat(flowStatistics.equityPayAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 expenditure_money"></div>
						<div class="p_absolute">
							<div>商家结算资金</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.settleAmount
										? numberFormat(flowStatistics.settleAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>

					<div class="data_item"></div>
					<!-- 收入 -->
				</div>
				<p class="mb10 mt20">收入</p>
				<div class="data_list">
					<div @click="incomeTotalList(1)" class="pointer data_item">
						<div class="ml100 collect_money"></div>
						<div class="p_absolute">
							<div>实收总额</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.incomeAmountCount
										? numberFormat(flowStatistics.incomeAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div @click="incomeTotalList(2)" class="pointer data_item">
						<div class="ml100 collect_money"></div>
						<div class="p_absolute">
							<div>权益保障收入</div>
							<div class="fz18 theme_c mt10">
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
				</div>
				<!-- 支出 -->
				<p class="mb10 mt20">支出</p>
				<div class="data_list">
					<div @click="incomeTotalList(3)" class="pointer data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>商家成本</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.costAmountCount
										? numberFormat(flowStatistics.costAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>可赚金</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.purchaseFee
										? numberFormat(flowStatistics.purchaseFee, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div @click="incomeTotalList(4)" class="pointer data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>服务奖励</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.commissionCharge
										? numberFormat(flowStatistics.commissionCharge, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div @click="incomeTotalList(5)" class="pointer data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>平台营销费(优惠)</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.couponAmountCount
										? numberFormat(flowStatistics.couponAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<div class="data_list">
					<div class="data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>提现金额</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.withdrawAmount
										? numberFormat(flowStatistics.withdrawAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div @click="incomeTotalList(6)" class="pointer data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>营销费用</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.rewardAmountCount
										? numberFormat(flowStatistics.rewardAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div @click="incomeTotalList(7)" class="pointer data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>退款总额</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.refundAmount
										? numberFormat(flowStatistics.refundAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div @click="incomeTotalList(8)" class="pointer data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>补款总额</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.supplementAmountCount
										? numberFormat(flowStatistics.supplementAmountCount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
				</div>
				<!-- 断层 -->
				<div class="data_list">
					<div @click="incomeTotalList(9)" class="pointer data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>权益赔付费用</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.equityPayAmount
										? numberFormat(flowStatistics.equityPayAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>
					<div class="data_item">
						<div class="ml100 mt-10 expenditure_money"></div>
						<div class="p_absolute">
							<div>商家承担营销金额</div>
							<div class="fz18 theme_c mt10">
								￥{{
									flowStatistics.merchantCouponAmount
										? numberFormat(flowStatistics.merchantCouponAmount, 2)
										: '0.00'
								}}
							</div>
						</div>
					</div>

					<div class="data_item"></div>
					<div class="data_item"></div>
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
				<p>6.京东代购费：需要手动在充值界面录入代购费金额</p>
				<p>7.优惠券扣减总额：订单使用优惠券的总额（只统计折扣类优惠券）</p>
				<p>8.服务奖励：记录订单需要返给店主上级的费用</p>
				<p>9.活动返现：优选平台奖励给店主的金额</p>
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
import { fundBalanceStatistics } from '@/api/accountService'
import { numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
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
			getFinanceStatisticsInfo: checkFunctionCode('getFinanceStatisticsInfo'),
			fundBalanceStatistics: checkFunctionCode('fundBalanceStatistics'),
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
						this.callFundBalanceStatistics(e)
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
						this.callFundBalanceStatistics(true)
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
						this.callFundBalanceStatistics(true)
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
						this.callFundBalanceStatistics(true)
					},
				},
			],
		}
	},
	created: function () {
		this.initPage()
	},
	methods: {
		onSubmit() {
			this.callFinanceStatisticsInfo(true)
			this.callFundBalanceStatistics(true)
		},
		resetForm(formName) {
			this.$refs[formName].resetFields()
		},
		incomeTotalList(e) {
			//状态
			let url = ''
			switch (e) {
				case 1: //实收总额跳转
					this.$router.push({
						path: `/finance/incomeTotalList`,
					})
					break
				case 2: //权益保障收入
					this.$router.push({
						path: `/finance/equityIncomeList`,
					})
					break
				case 3: //商家成本
					this.$router.push({
						path: `/finance/supplierCostList`,
					})
					break
				case 4: //平台奖励
					this.$router.push({
						path: `/finance/higherRebateList`,
					})
					break
				case 5: //平台营销费用（优惠）
					this.$router.push({
						path: `/finance/couponDeductionList`,
					})
					break
				case 6: //营销费用
					this.$router.push({
						path: `/finance/storeActRebateList`,
					})
					break
				case 7: //退款总额
					this.$router.push({
						path: `/finance/refundTotalList`,
					})
					break
				case 8: //补款总额
					this.$router.push({
						path: `/finance/refundTotalList`,
					})
					break
				case 9: //权益赔付费用
					this.$router.push({
						path: `/finance/equityPayList`,
					})
					break
			}
			if (url) {
				window.location.href = url
			}
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
			await this.callFundBalanceStatistics()
		},
		async callFinanceStatisticsInfo(flag) {
			if (!this.getFinanceStatisticsInfo) return
			let paramJson = this.findSearchParams(flag)
			this.timeInitial(paramJson)
			let {
				data: { resultCode, resultData = {} },
			} = await getFinanceStatisticsInfo(paramJson)
			if (resultCode == 0) {
				this.flowStatistics =
					resultData && resultData.flowStatistics
						? resultData.flowStatistics
						: {}
				this.groupBalance =
					resultData && resultData.groupBalance ? resultData.groupBalance : {}
			}
		},
		//统计（资金改造 新）
		async callFundBalanceStatistics(flag) {
			if (!this.fundBalanceStatistics) return
			let paramJson = this.findSearchParams(flag)
			this.timeInitial(paramJson)
			let {
				data: { resultCode, resultData = {} },
			} = await fundBalanceStatistics(paramJson)
			if (resultCode == 0) {
				this.fundBalance = resultData
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

.capital_images {
	width: 50px;
	height: 50px;
	background-image: url(../../../../../../static/images/capital_images.png);
	background-size: 50px 50px;
	background-repeat: no-repeat;
	margin-right: 10px;
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
