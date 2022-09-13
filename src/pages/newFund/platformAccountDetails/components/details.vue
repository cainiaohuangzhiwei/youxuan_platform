<template>
	<div>
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="amount" slot-scope="scope">
				<div class="green" v-if="scope.row.balanceType == 1">
					-￥{{ scope.row.amount.toFixed(2) }}
				</div>
				<div class="red" v-if="scope.row.balanceType == 2">
					+￥{{ scope.row.amount.toFixed(2) }}
				</div>
			</template></yx-table
		>
	</div>
</template>

<script>
import moment from 'moment'
import { isNull } from '@/utils/helper/common'
import {
	baseAccountPaymentDetails,
	marketingAccountPaymentDetails,
	joinpayAllianceAccountPaymentDetails,
	allianceAccountPaymentDetails,
} from '@/api/newFund'
import YxTable from '@wg-vue-materials/yx-table'

export default {
	components: {
		YxTable,
	},
	props: {
		searchData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			businessType1: [
				'',
				'平台服务费',
				'权益保障费用',
				'备用金',
				'提现成功',
				'个人所得税',
				'账户转账',
				'罚款扣回',
				'补款扣回',
				'其他扣款',
				'平台服务费退回',
			],
			businessType2: [
				'',
				'平台优惠补贴',
				'备用金',
				'提现成功',
				'充值成功',
				'-',
				'账户互转',
				'-',
				'平台优惠补贴退回',
			],
			businessType3: [
				'',
				'可赚金结算',
				'余额下单',
				'余额退款',
				'备用金',
				'提现成功',
				'个人所得税',
				'-',
				'账户转账',
				'可赚金退回',
			],
			businessType4: ['', '提现失败', '店主提现'],
			showLoading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'date',
					dataIndex: 'createTime',
					title: '时间',
				},
				{
					type: 'custom',
					dataIndex: 'amount',
					title: '金额',
				},
				{
					type: 'string',
					dataIndex: 'balanceType',
					title: '类型',
					customRender: (row) => {
						const arr = ['', '出账', '入账']
						return arr[row.balanceType]
					},
				},
				{
					type: 'amount',
					dataIndex: 'balance',
					title: '余额',
				},
				{
					type: 'string',
					dataIndex: 'businessType',
					title: '交易摘要',
					customRender: (row) => {
						let arr = []
						let add = ''
						if (this.$route.params.type == 1) {
							arr = this.businessType1
						} else if (this.$route.params.type == 2) {
							arr = this.businessType2
						} else if (this.$route.params.type == 3) {
							arr = this.businessType3
						} else if (this.$route.params.type == 4) {
							add =
								row.balanceType == 1 && row.businessType == 2
									? '店主提现'
									: row.balanceType == 2
									? '提现失败'
									: ''
						}
						return this.$route.params.type != 4 ? arr[row.businessType] : add
					},
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
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
		async init(flag) {
			const params = this.findSearchParams(flag)
			if (isNull(params.startTime) || isNull(params.endTime)) {
				this.$message.warning({
					message: '请选择时间区间',
				})
				return false
			}
			this.showLoading = true
			let resultData = {},
				resultCode = 0

			if (this.$route.params.type == 1) {
				let { data } = await baseAccountPaymentDetails({
					...params,
					accountSn: this.$route.params.id,
					accountType: this.$route.params.type,
				})

				resultData = data.resultData || {}
				resultCode = data.resultCode
			} else if (this.$route.params.type == 2) {
				let { data } = await marketingAccountPaymentDetails({
					...params,
					accountSn: this.$route.params.id,
					accountType: this.$route.params.type,
				})
				resultData = data.resultData || {}
				resultCode = data.resultCode
			} else if (this.$route.params.type == 3) {
				let { data } = await allianceAccountPaymentDetails({
					...params,
					accountSn: this.$route.params.id,
					accountType: this.$route.params.type,
				})
				resultData = data.resultData || {}
				resultCode = data.resultCode
			} else if (this.$route.params.type == 4) {
				let { data } = await joinpayAllianceAccountPaymentDetails({
					...params,
					accountSn: this.$route.params.id,
					accountType: this.$route.params.type,
				})
				resultData = data.resultData || {}
				resultCode = data.resultCode
			}

			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.list || []
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				weegetAccountId: this.$route.params.accountId,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			paramJson.curPage = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
	},
}
</script>

<style lang="scss" scoped>
.green {
	color: rgb(9, 187, 135);
}
.red {
	color: rgb(253, 67, 55);
}
</style>
