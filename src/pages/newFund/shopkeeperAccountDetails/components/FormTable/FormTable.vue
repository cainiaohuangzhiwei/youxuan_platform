<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix box-font">
				<span>账户余额</span>
			</div>
			<div class="b-money">
				<div>
					<el-tooltip
						class="item"
						effect="dark"
						content="结算完成可使用金额"
						placement="top-start"
					>
						<i class="el-icon-warning"></i>
					</el-tooltip>
					可用余额(元)
					<span
						>￥{{ numberFormat(balancePriceData.balanceTotal || 0, 2) }}</span
					>
				</div>
			</div>
			<div class="c-money">
				<div>
					<el-tooltip
						class="item"
						effect="dark"
						content="已发起还未到账金额"
						placement="top-start"
					>
						<i class="el-icon-warning"></i>
					</el-tooltip>
					提现中金额(元)
					<span
						>￥{{ numberFormat(balancePriceData.withdrawTotal || 0, 2) }}</span
					>
				</div>
			</div>
		</el-card>
		<el-card>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template slot="lately">
					<div class="timeTabs">
						<el-radio-group @change="changeDate" v-model="searchData.time">
							<el-radio-button label="-7">一周</el-radio-button>
							<el-radio-button label="-30">一个月</el-radio-button>
							<el-radio-button label="-90">三个月</el-radio-button>
						</el-radio-group>
					</div>
				</template>
			</yx-form>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="收支明细" name="one">
					<p-details ref="pDetails_ref" :searchData="searchData" />
				</el-tab-pane>
				<el-tab-pane label="提现记录" name="two">
					<withdrawal-record
						v-if="activeName == 'two'"
						ref="withdrawalRecord_ref"
						:searchData="searchData"
					/>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { shopkeeperAccountBalancePrice } from '@/api/newFund'
import { numberFormat, wgGetDate } from '@/utils/helper/common'
import moment from 'moment'
import pDetails from '../details.vue'
import withdrawalRecord from '../withdrawalRecord.vue'
export default {
	components: {
		YxForm,
		withdrawalRecord,
		pDetails,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat,
			activeName: 'one',

			showLoadingT: false,
			searchData: {
				startTime: moment().startOf('day').valueOf(), // 开始时间
				endTime: moment().endOf('day').valueOf(), // 结束时间
				time: '',
			},
			searchCfg: [
				{
					title: '时间区间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					title: '最近',
					type: 'custom',
					dataIndex: 'lately',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (this.activeName != 'two') {
							this.$refs.pDetails_ref.init()
						} else {
							this.$refs.withdrawalRecord_ref.init()
						}
					},
				},
				{
					title: '清空',
					auth: '',
					click: () => {
						this.searchData.startTime = moment().startOf('day').valueOf() // 开始时间
						this.searchData.endTime = moment().endOf('day').valueOf() // 结束时间
						this.searchData.time = ''
					},
				},
			],
			balancePriceData: {},
		}
	},

	created() {
		this.balancePrice()
	},

	methods: {
		changeDate(e) {
			let searchData = this.searchData
			if (e == '-7') {
				searchData.startTime = moment(wgGetDate().getSixStartDate).valueOf()
				searchData.endTime = moment().endOf('day').valueOf()
			} else if (e == '-30') {
				searchData.startTime = moment(wgGetDate().getThirtyStartDate).valueOf()
				searchData.endTime = moment().endOf('day').valueOf()
			} else if (e == '-90') {
				searchData.startTime = moment(wgGetDate().getNinetyStartDate).valueOf()
				searchData.endTime = moment().endOf('day').valueOf()
			}
		},

		async balancePrice() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await shopkeeperAccountBalancePrice({
				accountSn: this.$route.params.id,
				accountType: 6,
			})
			this.showLoading = false

			if (resultCode == 0) {
				this.balancePriceData = resultData
			} else {
				this.balancePriceData = {}
			}
		},
	},
}
</script>

<style lang="scss" scope>
.box-card {
	margin-bottom: 20px;
	.box-font {
		font-size: 20px;
		font-weight: bold;
	}
}
.two-msg {
	padding-bottom: 10px;
}
.two-button {
	margin-bottom: 10px;
}
.b-money {
	font-size: 16px;
	border-bottom: 1px solid #e3e3e3;
	padding-bottom: 20px;
	span {
		color: brown;
		margin-left: 20px;
		font-size: 20px;
	}
}
.c-money {
	font-size: 16px;
	padding-top: 20px;
	display: flex;
	div {
		flex: 1;
	}
	span {
		color: brown;
		margin-left: 20px;
		font-size: 20px;
	}
}
</style>
