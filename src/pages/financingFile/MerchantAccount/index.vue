<template>
	<div class="wg_main">
		<div>
			<div class="data_list">
				<div class="data_item">
					<div class="capital_images"></div>
					<div class="data_msg">
						<div>余额</div>
						<div class="fz18 mt10">
							￥
							{{
								detail.balanceAmount
									? numberFormat(detail.balanceAmount, 2)
									: '0.00'
							}}
						</div>
					</div>
				</div>
				<div class="data_item">
					<div class="capital_images"></div>
					<div class="data_msg">
						<div>冻结余额</div>
						<div class="fz18 mt10">
							￥{{
								detail.freezeBalance
									? numberFormat(detail.freezeBalance, 2)
									: '0.00'
							}}
						</div>
					</div>
				</div>
				<div class="data_item">
					<div class="capital_images"></div>
					<div class="data_msg">
						<div>待入账金额</div>
						<div class="fz18 mt10">
							￥{{
								detail.pendingBalance
									? numberFormat(detail.pendingBalance, 2)
									: '0.00'
							}}
						</div>
					</div>
					<el-button
						type="primary"
						@click="goReconciliationList()"
						class="data_btn"
						v-if="
							authList.listFirstStFinancePage &&
							authList.listEndStFinancePage &&
							authList.listPreviousStFinancePage
						"
						>查看明细</el-button
					>
				</div>
			</div>
		</div>

		<basicContainer>
			<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
				>老系统</el-button
			> -->
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="余额明细" name="sPlatformSupplierBalanceRecordList">
					<span slot="label">余额明细 </span>
					<YxTable
						v-loading="tableLoding"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					>
					</YxTable>
				</el-tab-pane>
				<el-tab-pane label="提现记录" name="sPlatformSupplierWithdrawList">
					<span slot="label">提现记录 </span>
					<YxTable
						v-loading="tableLoding"
						:columns="tableWithdrawColumns"
						:pagination="pageWithdraw"
						:data="tableDataWithdraw"
					>
					</YxTable
				></el-tab-pane>
			</el-tabs>
		</basicContainer>
	</div>
</template>
<script>
import { numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
import {
	sPlatformSupplierBalanceDetail,
	sPlatformSupplierBalanceRecordList,
	sPlatformSupplierWithdrawList,
} from '@/api/yhtPlusCmsSupplierBalance.js'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'

export default {
	name: 'MerchantImportRecord',
	components: { BasicContainer, YxTable },
	data() {
		return {
			tableLoding: false,
			authList: {},
			activeName: 'sPlatformSupplierBalanceRecordList',
			detail: {
				balanceAmount: 0,
				freezeBalance: 0,
				pendingBalance: 0,
			},
			numberFormat: numberFormat,
			// 余额明细
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'sourceId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					customRender: (row) => {
						return row.saleStartTime && row.saleEndTime
							? moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
									'-' +
									moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'type',
					title: '类型',
					customRender: (row) => {
						if (row.type == 1) {
							return '提现'
						} else if (row.type == 2) {
							return '会场首款'
						} else if (row.type == 3) {
							return '会场尾款'
						} else if (row.type == 4) {
							return '往期数据'
						} else if (row.type == 5) {
							return '平账'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '金额',
					customRender: (row) => {
						return `￥${numberFormat(row.amount, 2)}`
					},
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'operator',
					title: '操作人',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.sPlatformSupplierBalanceRecordList()
				},
			},
			tableData: [],
			tableWithdrawColumns: [
				{
					type: 'string',
					dataIndex: 'supplierWithdrawId',
					title: '提现ID',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '金额',
					customRender: (row) => {
						return `￥${numberFormat(row.amount, 2)}`
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'withdrawTime',
					title: '发起提现时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.withdrawTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'applicationUser',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'gainedTime',
					title: '到账时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.gainedTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'accountName',
					title: '账户名',
				},
				{
					type: 'string',
					dataIndex: 'accountNumber',
					title: '账号',
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '开户银行',
				},
				{
					type: 'string',
					dataIndex: 'bankSubbranch',
					title: '开户支行',
				},
				{
					type: 'string',
					dataIndex: 'withdrawStatus',
					title: '提现状态',
					customRender: (row) => {
						if (row.withdrawStatus == 1) {
							return '待打款'
						} else if (row.withdrawStatus == 2) {
							return '打款中'
						} else if (row.withdrawStatus == 3) {
							return '打款成功'
						} else if (row.withdrawStatus == 4) {
							return '打款失败'
						} else if (row.withdrawStatus == 5) {
							return '已驳回'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'feedbackReason',
					title: '反馈',
				},
			],
			pageWithdraw: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.sPlatformSupplierWithdrawList()
				},
			},
			tableDataWithdraw: [],
		}
	},
	created() {
		// 获取查看详情权限
		this.authList = {
			listFirstStFinancePage: checkFunctionCode('listFirstStFinancePage'),
			listEndStFinancePage: checkFunctionCode('listEndStFinancePage'),
			listPreviousStFinancePage: checkFunctionCode('listPreviousStFinancePage'),
		}
		// 获取商家账户详情
		this.sPlatformSupplierBalanceDetail()
		// 获取余额明细
		this.sPlatformSupplierBalanceRecordList(true)
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(
				`/yhtplus/web/merchantAccount.html?supplierBalanceId=${this.$route.query.supplierBalanceId}&supplierId=${this.$route.query.supplierId}`
			)
		},
		goReconciliationList() {
			// 跳转对账中心
			this.$router.push({
				path: `reconciliationList`,
			})
		},
		handleClick({ name }) {
			// tab拦点击事件
			if (this.tableLoding) {
				return
			}
			if (name == 'sPlatformSupplierBalanceRecordList') {
				// 获取余额明细
				this.sPlatformSupplierBalanceRecordList(true)
			} else if (name == 'sPlatformSupplierWithdrawList') {
				// 获取提现记录
				this.sPlatformSupplierWithdrawList(true)
			}
		},
		async sPlatformSupplierBalanceDetail() {
			// 详情
			let params = {
				supplierBalanceId: this.$route.query.supplierBalanceId,
			}
			let {
				data: { resultCode, resultData },
			} = await sPlatformSupplierBalanceDetail(params)
			if (resultCode === 0) {
				this.detail = resultData.supplierBalance
			}
		},
		async sPlatformSupplierBalanceRecordList(flag) {
			// 获取余额明细列表
			this.tableLoding = true
			if (flag) {
				this.page.currentPage = 1
			}
			let params = {
				supplierBalanceId: this.$route.query.supplierBalanceId,
				supplierIds: [this.$route.query.supplierId],
				length: this.page.length,
				startIndex: this.page.currentPage - 1,
			}
			let {
				data: { resultCode, resultData },
			} = await sPlatformSupplierBalanceRecordList(params)
			if (resultCode === 0) {
				this.tableData = resultData.supplierBalanceRecordList
				this.page.count = resultData.count
			}
			this.tableLoding = false
		},
		async sPlatformSupplierWithdrawList(flag) {
			// 获取提现记录列表
			this.tableLoding = true
			if (flag) {
				this.pageWithdraw.currentPage = 1
			}

			let params = {
				supplierBalanceId: this.$route.query.supplierBalanceId,
				supplierIds: [this.$route.query.supplierId],
				length: this.pageWithdraw.length,
				startIndex: this.pageWithdraw.currentPage - 1,
			}
			let {
				data: { resultCode, resultData },
			} = await sPlatformSupplierWithdrawList(params)
			if (resultCode === 0) {
				this.tableDataWithdraw = resultData.supplierWithdrawList
				this.pageWithdraw.count = resultData.count
			}
			this.tableLoding = false
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
	background-image: url(../../../../static/images/capital_images.png);
	background-size: 50px 50px;
	background-repeat: no-repeat;
}

::v-deep .basic-container {
	padding: 20px 0;
}
</style>
