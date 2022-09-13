<template>
	<div>
		<WgForm
			v-loading="exportLoading"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
			:actionInline="true"
		></WgForm>
		<div>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="现金" name="money">
					<div class="table-title">
						<span class="table-title-span">订单剩余奖励金额：</span
						><span class="table-title-amount">
							{{
								numberFormat(this.CashNum.orderRemainingRewardAmount, 2) || 0
							}}
						</span>
						<span class="table-title-span">商家承担金额：</span
						><span class="table-title-amount">
							{{ numberFormat(this.CashNum.supplierUndertakeAmount, 2) || 0 }}
						</span>
						<span class="table-title-span">平台承担金额：</span
						><span class="table-title-amount">
							{{ numberFormat(this.CashNum.platformUndertakeAmount, 2) || 0 }}
						</span>
					</div>
					<yx-table
						v-loading="showLoading"
						:columns="cashTableColumns"
						:pagination="page"
						:data="cashTableData"
					>
					</yx-table
				></el-tab-pane>
				<el-tab-pane label="优惠券" name="discountCoupon">
					<div class="table-title">
						<span class="table-title-span">优惠券数量：</span
						><span class="table-title-amount">
							{{ numberFormat(this.discountNum.totalCouponNumber) || 0 }}
						</span>
					</div>
					<yx-table
						v-loading="showLoading"
						:columns="discountTableColumns"
						:pagination="page"
						:data="discountTableData"
					>
						<template slot="couponType" slot-scope="scope">
							<span>
								{{ couponTypeChange(scope.row.couponType) }}
							</span>
						</template>
					</yx-table></el-tab-pane
				>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	actRewardDetailsToCashBatch,
	actRewardDetailsToCashSum,
	actRewardDetailsToCouponBatch,
	actRewardDetailsToCouponSum,
	exportActRewardDetailsToCash,
	exportActRewardDetailsToCoupon,
} from '@/api/userRewardSystem'
import { downloadFile, numberFormat } from '@/utils/helper/common'
export default {
	components: {
		WgForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			activeName: 'money', //现金和优惠券的tabs
			exportLoading: false,
			showLoading: false,
			// 现金
			CashNum: {
				supplierUndertakeAmount: 0,
				platformUndertakeAmount: 0,
				orderRemainingRewardAmount: 0,
			},
			// 优惠券
			discountNum: {
				totalCouponNumber: 0,
			},
			searchData: {
				organizationId: '', //店主id
			},
			searchCfg: [
				{
					title: '店主ID',
					type: 'inputNumber',
					dataIndex: 'organizationId',
				},
			],
			searchAction: [
				{
					title: '导出',
					type: 'success',
					// auth: 'marketingExportRewardDetailByPlatform',
					click: () => {
						this.$confirm('确定导出列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									this.exprotSaleList()
								}
							},
						})
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._orgReconciliationList(true, this.activeName)
					},
				},
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
			],
			// 现金表格
			cashTableData: [],
			cashTableColumns: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
					align: 'left',
				},
				{
					type: 'amount',
					dataIndex: 'totalEstimateRewardMoney',
					title: '预估总奖励金额',
				},
				{
					type: 'amount',
					dataIndex: 'platformUndertakeAmount',
					title: '平台承担金额',
				},
			],
			// 优惠券表格
			discountTableData: [],
			discountTableColumns: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'couponType',
					title: '优惠券类型',
				},
				{
					type: 'string',
					dataIndex: 'rewardCouponName',
					title: '优惠券名称',
				},
				{
					type: 'string',
					dataIndex: 'rewardCouponQuantity',
					title: '优惠券数量',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._orgReconciliationList(false, this.activeName)
				},
			},
		}
	},
	created() {
		this._orgReconciliationList(true, this.activeName)
	},

	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			//搜索条件
			let paramJson = Object.assign(
				{
					startIndex: (this.page.currentPage - 1) * this.page.length,
					pageNum: this.page.currentPage,
					pageSize: this.page.length,
				},
				this.searchData
			)
			paramJson.actId = parseInt(this.$route.params.actId)
			paramJson.organizationId = Number(paramJson.organizationId)
			return paramJson
		},
		// 查找列表
		_orgReconciliationList: async function (flag, tab) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let UrlList, UrlNum
			if (tab == 'money') {
				UrlList = actRewardDetailsToCashBatch
				UrlNum = actRewardDetailsToCashSum
			} else if (tab == 'discountCoupon') {
				UrlList = actRewardDetailsToCouponBatch
				UrlNum = actRewardDetailsToCouponSum
			}
			let {
				data: { resultCode, resultData, total },
			} = await UrlList(paramJson)
			let {
				data: { resultCode: Rescode, resultData: ResData },
			} = await UrlNum(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				if (tab == 'money') {
					this.cashTableData = resultData
					this.page.count = total
				} else {
					this.discountTableData = resultData
					this.page.count = total
				}
			} else {
				if (tab == 'money') {
					this.cashTableData = []
					this.page.count = 0
				} else {
					this.discountTableData = []
					this.page.count = 0
				}
			}
			if (Rescode == 0) {
				if (tab == 'money') {
					this.CashNum = ResData
				} else {
					this.discountNum = ResData
				}
			}
		},
		//导出
		async exprotSaleList() {
			let paramJson = this.findSearchParams(true)
			let Url
			if (this.activeName == 'money') {
				Url = exportActRewardDetailsToCash
			} else if (this.activeName == 'discountCoupon') {
				Url = exportActRewardDetailsToCoupon
			}
			let { data } = await Url(paramJson)
			console.log('datas', data)
			let title =
				this.activeName == 'money'
					? '现金奖励明细记录列表.xlsx'
					: '优惠券奖励明细记录列表.xlsx'
			downloadFile(data, title)
		},
		handleClick({ name }) {
			if (name == 'money') {
				this._orgReconciliationList(true, this.activeName)
			} else if (name == 'discountCoupon') {
				this._orgReconciliationList(true, this.activeName)
			}
		},
		couponTypeChange(couponType) {
			//优惠券类型: 0:默认空、1:平台购物券、2:品牌购物券、3:优惠券
			const arr = ['', '平台购物券', '品牌购物券', '优惠券']
			return arr[couponType] || arr[0]
		},
	},
}
</script>

<style lang="scss" scoped>
.table-title {
	margin-bottom: 15px;
}
.table-title .table-title-span {
	font-weight: bold;
}
.table-title .table-title-amount {
	margin-right: 20px;
}
</style>
