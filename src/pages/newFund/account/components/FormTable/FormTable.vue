<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="6">
				<el-card class="box-card">
					<h3>基本账户</h3>
					<p class="head-p">微信收付通</p>
					<p>可用余额</p>
					<div class="head-money">{{ numberFormat(data.baseBalance, 2) }}</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="box-card">
					<h3>运营账户</h3>
					<p class="head-p">微信收付通</p>
					<p>余额</p>
					<div class="head-money">
						{{ numberFormat(data.marketingBalance, 2) }}
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="box-card">
					<h3>垫资金额</h3>
					<p class="head-p">微信收付通</p>
					<p>金额</p>
					<div class="head-money">
						{{ numberFormat(data.marketingLoanBalance, 2) }}
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="box-card">
					<h3>店主联盟账户</h3>
					<p class="head-p">微信收付通</p>
					<p>可用余额</p>
					<div class="head-money">
						{{ numberFormat(data.allianceBalance, 2) }}
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="6">
				<el-card class="box-card">
					<h3>店主联盟账户</h3>
					<p class="head-p">汇聚支付</p>
					<p>余额</p>
					<div class="head-money">
						{{ numberFormat(data.joinpayAllianceBalance, 2) }}
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import { realTimeDataBalance } from '@/api/newFund'
import { numberFormat } from '@/utils/helper/common'
export default {
	components: {},
	name: 'FormTable',
	data() {
		return {
			numberFormat,
			showLoading: false,
			data: {},
		}
	},
	created() {
		this.init()
	},
	methods: {
		async init() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await realTimeDataBalance()
			this.showLoading = false
			if (resultCode === 0) {
				this.data = resultData
			} else {
				this.data = {}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.box-card {
	font-size: 14px;
	margin-bottom: 14px;
	h3 {
		margin: 0;
		padding: 0;
	}
	p {
		margin: 0;
		padding: 10px 0;
		&.head-p {
			border-bottom: 1px solid #d6d6d6;
		}
	}
	.head-money {
		color: brown;
		font-size: 16px;
	}
}
</style>
