<template>
	<div class="container">
		<div class="check-msg">
			<img src="@/assets/image/logo_icon.png" />
			<!-- <el-row v-if="orderInfoData.loanCount" :gutter="20">
				<el-col :span="12"
					>账户借支<span class="red-color">{{ orderInfoData.loanAmount }}</span>
				</el-col>
			</el-row> -->
		</div>

		<yx-info :data="orderInfoData" :items="orderInfoItems">
			<!-- 自定义插槽 -->
		</yx-info>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import { supplierQueryAccountDetail } from '@/api/supplierAccount'
import { numberFormat } from '@/utils/helper/common'
export default {
	components: {
		YxInfo,
	},
	name: 'baseInfo',
	data() {
		return {
			orderInfoData: {},
			BankCardDialog: false,
			DebitRecordsDialog: false,
			orderInfoItems: [
				{
					type: 'string',
					title: '商家id',
					dataIndex: 'supplierId',
				},
				{
					type: 'string',
					title: '商家名称',
					dataIndex: 'supplierName',
					customRender: () => {
						console.log('商家名称', this.orderInfoData.supplierName)
						return this.orderInfoData.supplierName
					},
				},
				{
					type: 'string',
					title: '状态',
					dataIndex: 'status',
					customRender: () => {
						return this.orderInfoData.status === 0 ? '冻结' : '正常'
					},
				},
				{
					type: 'string',
					title: '待结算余额',
					dataIndex: 'settledAmount',
					customRender: () => {
						return numberFormat(this.orderInfoData.settledAmount, 2)
					},
				},
				{
					type: 'string',
					title: '可用余额',
					dataIndex: 'availableAmount',
					customRender: () => {
						return numberFormat(this.orderInfoData.availableAmount, 2)
					},
				},
				{
					type: 'string',
					title: '提现冻结',
					dataIndex: 'frozenAmount',
					customRender: () => {
						return numberFormat(this.orderInfoData.frozenAmount, 2)
					},
				},
				{
					type: 'string',
					title: '借支冻结',
					dataIndex: 'borrowingLockBalance',
					customRender: () => {
						return numberFormat(this.orderInfoData.borrowingLockBalance, 2)
					},
				},
			],
		}
	},

	created() {
		this.merchantAccountDetails(true)
	},

	methods: {
		merchantAccountDetails: async function () {
			this.showLoading = true
			let paramJson = {
				merchantAccountId: Number(this.$route.params.merchantAccountId),
			}
			let {
				data: { resultCode, resultData },
			} = await supplierQueryAccountDetail(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				resultData.loanAmount = numberFormat(resultData.loanAmount || 0, 2)
				this.orderInfoData = resultData || {}
			}
		},
	},
}
</script>

<style scoped>
.check-btn {
	margin-left: 10px;
}
.red-color {
	color: brown;
	margin-left: 4px;
}
.info-container {
	padding: 10px 0 35px;
}
</style>
