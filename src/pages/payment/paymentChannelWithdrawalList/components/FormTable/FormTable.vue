<template>
	<basic-container>
		<div>
			<!-- 条件筛选 -->
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
			</yx-form>
			<el-button
				@click="sponsor"
				type="primary"
				v-auth="'paymentChannleCreateWithdraw'"
				style="float: right"
				>发起提现</el-button
			>
			<div class="amount_box">
				提现金额<span>￥{{ numberFormat(withdrawSummaryAmount, 2) }}</span>
			</div>
			<!-- 表单列表 -->
			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<el-dialog
			width="450px"
			title="提现信息"
			:visible.sync="bankInfoDialogVisible"
			:close-on-click-modal="false"
			:before-close="bankInfoDialogVisibleUpdate"
			:destroy-on-close="true"
		>
			<el-form :model="bankAccountData" label-width="120px">
				<el-form-item label="交易单号 ：">
					<span>{{ bankAccountData.outRequestNo }}</span>
				</el-form-item>
				<el-form-item label="账户名  ：">
					<span>{{ bankAccountData.accountName }}</span>
				</el-form-item>
				<el-form-item label="账号   ：">
					<span>{{ bankAccountData.bankNo }}</span>
				</el-form-item>
				<el-form-item label="开户银行   ：">
					<span>{{ bankAccountData.bankName }}</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="bankInfoDialogVisibleUpdate"
					>确 定</el-button
				>
			</div>
		</el-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import { withdrawPage } from '@/api/weeget-bullet-payment-rest-fors'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},

	name: 'FormTable',

	data() {
		return {
			loading: false,
			bankInfoDialogVisible: false,
			bankAccountData: {},
			numberFormat: numberFormat,
			withdrawSummaryAmount: 0,
			searchData: {
				channelCode: '',
				withdrawStatus: '',
				sendStartTime: '', //moment().startOf('day').valueOf() - 172800000, // 开始时间, 172800000为48小时时间戳
				sendEndTime: '', // moment().endOf('day').valueOf(), // 结束时间
				successStartTime: '',
				successEndTime: '',
				withdrawType: '',
			},
			searchCfg: [
				{
					title: '发起时间',
					type: 'datetimerange',
					dataIndex: ['sendStartTime', 'sendEndTime'],
				},
				{
					title: '到账时间',
					type: 'datetimerange',
					dataIndex: ['successStartTime', 'successEndTime'],
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'withdrawStatus',
					label: 'value',
					options: [
						{
							withdrawStatus: '',
							value: '全部',
						},
						{
							withdrawStatus: 'processing',
							value: '提现中',
						},
						{
							withdrawStatus: 'succeeded',
							value: '提现成功',
						},
						{
							withdrawStatus: 'failed',
							value: '提现失败',
						},
					],
				},
				{
					type: 'select',
					title: '通道',
					dataIndex: 'channelCode',
					label: 'value',
					options: [
						{
							channelCode: '',
							value: '全部',
						},
						{
							channelCode: 'JOIN_PAY',
							value: '汇聚支付',
						},
						{
							channelCode: 'SU_NING',
							value: '苏宁银行',
						},
					],
				},
				{
					type: 'select',
					title: '类型',
					dataIndex: 'withdrawType',
					label: 'value',
					options: [
						{
							withdrawType: '',
							value: '全部',
						},
						{
							withdrawType: 'WORKING_DAY',
							value: 'T+1',
						},
						{
							withdrawType: 'REAL_TIME',
							value: '立即到账',
						},
					],
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'id',
					title: '业务id',
				},
				{
					dataIndex: 'channelCode',
					title: '通道',
					customRender: (row) => {
						return row.channelCode == 'JOIN_PAY' ? '汇聚支付' : '苏宁银行'
					},
				},
				{
					dataIndex: 'withdrawRemark',
					title: '类型',
					customRender: (row) => {
						return row.withdrawType == 'WORKING_DAY' ? 'T+1' : '立即到账'
					},
				},
				{
					dataIndex: 'sendAt',
					title: '发起时间',
					type: 'date',
				},
				{
					dataIndex: 'successAt',
					title: '到账时间',
				},
				{
					dataIndex: 'amount',
					title: '提现金额',
					width: '120',
					type: 'amount',
				},
				{
					title: '状态',
					dataIndex: 'withdrawStatus',
					width: '120',
					customRender: (row) => {
						return row.withdrawStatus == 'succeeded'
							? '提现成功'
							: row.withdrawStatus == 'processing'
							? '提现中'
							: row.withdrawStatus == 'failed'
							? '提现失败'
							: '错误'
					},
				},
				{
					title: '原因',
					width: '120',
					dataIndex: 'reason',
				},
				{
					title: '备注',
					width: '120',
					dataIndex: 'remark',
				},
				{
					dataIndex: 'operator',
					title: '发起人',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					actions: [
						{
							title: '查看详情',
							auth: '',
							click: (row) => {
								this.showBankCardInfo(row)
							},
						},
					],
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
		sponsor() {
			this.$router.push({
				path: '/fund/withdraw',
				query: {
					platformAccountType: 6,
				},
			})
		},
		// 初始化及筛选审核列表数据
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await withdrawPage(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.records) {
				this.tableData = resultData.records
				this.withdrawSummaryAmount = resultData.withdrawSummaryAmount
				this.page.count = resultData.total
			}
			this.loading = false
		},
		// 显示银行卡信息
		showBankCardInfo(row) {
			// console.log(row.bankAccountId)
			this.bankAccountData = row
			this.bankInfoDialogVisible = true
		},
		// 关闭银行卡弹窗组件
		bankInfoDialogVisibleUpdate() {
			this.bankInfoDialogVisible = false
			this.bankAccountData = {}
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				currentPage: this.page.currentPage,
			})
			return paramJson
		},
	},
}
</script>
<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
	}
}
</style>
