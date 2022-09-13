<template>
	<div class="container">
		<div class="check-msg">
			<img src="@/assets/image/logo_icon.png" />
			<el-row :gutter="20">
				<!-- <el-col :span="6"
					>关联银行卡信息<el-button
						@click="checkBank"
						class="check-btn"
						type="primary"
						>查看详情</el-button
					></el-col
				> -->
				<!-- <el-col :span="12"
					>账户借支<span class="red-color">￥{{ this.loanAmount }}</span> -->
				<!-- <el-button
						class="check-btn"
						@click="checkDebitRecords"
						type="primary"
						>查看详情</el-button> -->
				<!-- </el-col> -->
			</el-row>
		</div>

		<yx-info :data="accountDetail" :items="orderInfoItems"></yx-info>
		<!-- <bank-card-dialog :visible.sync="BankCardDialog"></bank-card-dialog>
		<debit-records-dialog :visible.sync="DebitRecordsDialog"></debit-records-dialog>-->
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'

// import BankCardDialog from '../BankCardDialog'
// import DebitRecordsDialog from '../DebitRecordsDialog'
import { numberFormat } from '@/utils/helper/common'
import { organizationQueryAccountDetail } from '@/api/organizationAccount'
export default {
	components: {
		YxInfo,
		// BankCardDialog,
		// DebitRecordsDialog,
	},
	name: 'baseInfo',
	data() {
		return {
			accountDetail: {},
			loanAmount: 0,
			BankCardDialog: false,
			DebitRecordsDialog: false,
			orderInfoItems: [
				{
					type: 'string',
					title: '店主id',
					dataIndex: 'organizationId',
				},
				{
					type: 'string',
					title: '店主名称',
					dataIndex: 'organizationName',
				},
				{
					type: 'string',
					title: '状态',
					dataIndex: 'organizationState',
					customRender: () => {
						return this.accountDetail.organizationState === 1 ? '正常' : '禁用'
					},
				},
				// {
				// 	type: 'string',
				// 	title: '待结算余额',
				// 	dataIndex: 'settledAmount',
				// 	customRender: () => {
				// 		return numberFormat(this.accountDetail.settledAmount, 2)
				// 	},
				// },
				{
					type: 'string',
					title: '可用余额',
					dataIndex: 'availableAmount',
					customRender: () => {
						return numberFormat(this.accountDetail.availableAmount || 0, 2)
					},
				},
				{
					type: 'string',
					title: '提现冻结',
					dataIndex: 'frozenAmount',
					customRender: () => {
						return numberFormat(this.accountDetail.frozenAmount || 0, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'borrowingLockBalance',
					title: '借支冻结',
					customRender: () => {
						return numberFormat(this.accountDetail.borrowingLockBalance, 2)
					},
				},
			],
		}
	},

	created() {
		this.organizationQueryAccountDetail()
	},

	methods: {
		organizationQueryAccountDetail: async function () {
			let paramJson = {
				organizationId: this.$route.params.organizationId,
			}
			let {
				data: { resultCode, resultData },
			} = await organizationQueryAccountDetail(paramJson)
			if (resultCode == 0) {
				this.loanAmount = resultData.loanAmount
					? numberFormat(resultData.loanAmount, 2)
					: '0.00'

				this.accountDetail = {
					organizationId: this.$route.params.organizationId,
					...resultData,
				}
			}
		},
		// checkBank() {
		// 	this.BankCardDialog = true
		// },
		// checkDebitRecords() {
		// 	this.DebitRecordsDialog = true
		// },
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
